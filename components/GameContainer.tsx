
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction, Obstacle, ObstacleState, GameState, ObstacleType } from '../types';
import { GRID_SIZE, INITIAL_TICK_RATE, LEVEL_TICK_RATE_DECREASE, MIN_TICK_RATE, ROCK_DETERIORATION_DISTANCE } from '../constants';
import GameBoard from './GameBoard';
import PauseMenu from './PauseMenu';
import LevelUpPopup from './LevelUpPopup';
import useGameSounds from '../hooks/useGameSounds';

interface GameContainerProps {
  onGameOver: (score: number, level: number) => void;
  initialLevel: number;
  onReset: () => void;
  onExitApp: () => void;
}

const levelColors = [
    "from-blue-900 to-indigo-900", // Level 1
    "from-green-900 to-teal-900",  // Level 2
    "from-yellow-900 to-orange-900", // Level 3
    "from-red-900 to-pink-900",     // Level 4
    "from-purple-900 to-violet-900", // Level 5
    "from-gray-800 to-gray-900" // Level 6+
];

const GameContainer: React.FC<GameContainerProps> = ({ onGameOver, initialLevel, onReset, onExitApp }) => {
  const [snake, setSnake] = useState<Point[]>([{ x: 12, y: 12 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>({ x: 0, y: -1 });
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(initialLevel);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isEating, setIsEating] = useState(false);

  const {
      config, setConfig, playEatSound, playCrashSound, playLevelUpSound,
      playRockCrumbleSound, playPauseInSound, playPauseOutSound, playClickSound
  } = useGameSounds();

  const gameLoopRef = useRef<number | null>(null);

  const createFood = useCallback((currentSnake: Point[], currentObstacles: Obstacle[]): Point => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
      currentObstacles.some(obs => obs.position.x === newFood.x && obs.position.y === newFood.y)
    );
    return newFood;
  }, []);

  const generateLevelLayout = useCallback((newLevel: number, currentSnake: Point[]) => {
      const newObstacles: Obstacle[] = [];
      const reservedPositions: Set<string> = new Set(currentSnake.map(p => `${p.x},${p.y}`));

      const isReserved = (pos: Point) => {
          return reservedPositions.has(`${pos.x},${pos.y}`) ||
                 (Math.abs(pos.x - GRID_SIZE/2) < 5 && Math.abs(pos.y - GRID_SIZE/2) < 5); // Keep a larger center clear
      };

      // 1. Generate Rocks
      const rockCount = Math.min(Math.floor(newLevel * 1.2), 15);
      for (let i = 0; i < rockCount; i++) {
          let pos: Point;
          let attempts = 0;
          do {
              pos = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
              attempts++;
          } while (isReserved(pos) && attempts < 50);

          if (attempts < 50) {
              newObstacles.push({ id: Date.now() + i, position: pos, state: ObstacleState.SOLID, type: ObstacleType.ROCK });
              reservedPositions.add(`${pos.x},${pos.y}`);
          }
      }

      // 2. Generate Brick Walls (Level 3+)
      if (newLevel >= 3) {
          const wallCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 walls
          for (let i = 0; i < wallCount; i++) {
              const wallLength = Math.floor(Math.random() * 3) + 3; // Length 3 to 5
              const isVertical = Math.random() > 0.5;
              
              let wallPoints: Point[] = [];
              let validWall = false;
              let attempts = 0;

              // Try to find a valid position for the whole wall
              while (!validWall && attempts < 50) {
                  attempts++;
                  wallPoints = [];
                  const startPos = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
                  
                  let wallIsValid = true;
                  for (let j = 0; j < wallLength; j++) {
                      const currentPos = {
                          x: startPos.x + (isVertical ? 0 : j),
                          y: startPos.y + (isVertical ? j : 0)
                      };

                      if (currentPos.x >= GRID_SIZE || currentPos.y >= GRID_SIZE || isReserved(currentPos)) {
                          wallIsValid = false;
                          break;
                      }
                      wallPoints.push(currentPos);
                  }
                  if (wallIsValid) {
                      validWall = true;
                  }
              }

              if (validWall) {
                  wallPoints.forEach((pos, index) => {
                      newObstacles.push({
                          id: Date.now() + 1000 + i * 10 + index, // unique ID
                          position: pos,
                          state: ObstacleState.SOLID,
                          type: ObstacleType.BRICK
                      });
                      reservedPositions.add(`${pos.x},${pos.y}`);
                  });
              }
          }
      }

      setObstacles(newObstacles);
      return newObstacles;
  }, []);

  useEffect(() => {
    generateLevelLayout(level, snake);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);


  const advanceLevel = useCallback(() => {
    playLevelUpSound();
    const newLevel = level + 1;
    setLevel(newLevel);
    setShowLevelUp(true);
    setGameState(GameState.PAUSED);
    const newObstacles = generateLevelLayout(newLevel, [{ x: 12, y: 12 }]);
    
    setTimeout(() => {
        setSnake([{ x: 12, y: 12 }]);
        setDirection({ x: 0, y: -1 });
        setFood(createFood([{ x: 12, y: 12 }], newObstacles));
        setShowLevelUp(false);
        setGameState(GameState.PLAYING);
    }, 3000);
  }, [level, playLevelUpSound, createFood, generateLevelLayout]);

  const gameTick = useCallback(() => {
    const newSnake = [...snake];
    const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      playCrashSound();
      onGameOver(score, level);
      return;
    }
    
    // Self collision
    for (let i = 1; i < newSnake.length; i++) {
        if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
            playCrashSound();
            onGameOver(score, level);
            return;
        }
    }
    
    // Obstacle collision
    if (obstacles.some(obs => obs.state === ObstacleState.SOLID && obs.position.x === head.x && obs.position.y === head.y)) {
        playCrashSound();
        onGameOver(score, level);
        return;
    }

    newSnake.unshift(head);
    
    // Food consumption
    if (head.x === food.x && head.y === food.y) {
      playEatSound();
      setIsEating(true);
      setTimeout(() => setIsEating(false), 200);

      const newScore = score + 10;
      setScore(newScore);
      setFood(createFood(newSnake, obstacles));

      if(newSnake.length-1 > 0 && (newSnake.length-1) % 5 === 0) {
        advanceLevel();
        return;
      }

    } else {
      newSnake.pop();
    }
    
    // Rock deterioration logic
    let soundPlayedThisTick = false;
    const updatedObstacles = obstacles.map(obs => {
        if (obs.type === ObstacleType.ROCK) {
            const distance = Math.sqrt(Math.pow(head.x - obs.position.x, 2) + Math.pow(head.y - obs.position.y, 2));
            if (distance <= ROCK_DETERIORATION_DISTANCE && obs.state === ObstacleState.SOLID) {
                if (!soundPlayedThisTick) {
                    playRockCrumbleSound();
                    soundPlayedThisTick = true;
                }
                return {...obs, state: ObstacleState.DETERIORATING, deteriorationTimestamp: Date.now()};
            }
        }
        return obs;
    });

    setObstacles(updatedObstacles.filter(obs => {
        if (obs.state === ObstacleState.DETERIORATING) {
            return (Date.now() - (obs.deteriorationTimestamp || 0)) < 1000;
        }
        return true;
    }));
    setSnake(newSnake);
  }, [snake, direction, food, score, onGameOver, playCrashSound, playEatSound, createFood, obstacles, advanceLevel, level, playRockCrumbleSound]);

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      const tickRate = Math.max(MIN_TICK_RATE, INITIAL_TICK_RATE - (level - 1) * LEVEL_TICK_RATE_DECREASE);
      gameLoopRef.current = setInterval(gameTick, tickRate);
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, gameTick, level]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    let newDirection = { ...direction };
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        if (direction.y === 0) newDirection = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
        if (direction.y === 0) newDirection = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
        if (direction.x === 0) newDirection = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
        if (direction.x === 0) newDirection = { x: 1, y: 0 };
        break;
      case 'Escape':
        togglePause();
        break;
    }
    setDirection(newDirection);
  }, [direction]);
  
  const togglePause = () => {
       if (gameState === GameState.PLAYING) {
          playPauseInSound();
          setGameState(GameState.PAUSED);
        } else if (gameState === GameState.PAUSED && !showLevelUp) {
          playPauseOutSound();
          setGameState(GameState.PLAYING);
        }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const bgColor = levelColors[Math.min(level - 1, levelColors.length - 1)];

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center transition-all duration-1000 bg-gradient-to-br ${bgColor}`}>
      <div className="flex justify-between w-[640px] p-4 text-white text-2xl font-bold">
        <span>Score: {score}</span>
        <span>Level: {level}</span>
      </div>
      <GameBoard snake={snake} food={food} obstacles={obstacles} isEating={isEating} foodPosition={food} />
      <div className="absolute top-4 right-4">
        <button onClick={togglePause} className="p-2 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      {gameState === GameState.PAUSED && !showLevelUp && (
        <PauseMenu 
            onContinue={togglePause} 
            onReset={() => { playClickSound(); onReset(); }} 
            soundConfig={config}
            onSoundConfigChange={setConfig}
            onExitApp={onExitApp}
        />
      )}
      {showLevelUp && <LevelUpPopup level={level} />}
    </div>
  );
};

export default GameContainer;