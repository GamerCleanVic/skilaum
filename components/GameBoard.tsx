
import React from 'react';
import { Point, Obstacle, ObstacleType } from '../types';
import { GRID_SIZE } from '../constants';
import Squirrel from './Squirrel';
import Nut from './Nut';
import Rock from './Rock';
import Brick from './Brick';

interface GameBoardProps {
  snake: Point[];
  food: Point;
  obstacles: Obstacle[];
  isEating: boolean;
  foodPosition: Point;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food, obstacles, isEating, foodPosition }) => {
  const cellSize = 24; // in pixels
  const boardSize = GRID_SIZE * cellSize;

  return (
    <div
      className="bg-green-800/50 border-8 border-yellow-700 rounded-lg shadow-2xl relative"
      style={{
        width: `${boardSize}px`,
        height: `${boardSize}px`,
        transform: 'perspective(1000px) rotateX(25deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="absolute inset-0 grid grid-cols-24 grid-rows-24" style={{gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`}}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
          <div key={i} className="border-r border-b border-green-700/30"></div>
        ))}
      </div>
      
      {snake.map((segment, index) => (
        <Squirrel
          key={index}
          position={segment}
          isHead={index === 0}
          isBody={index > 0 && index < snake.length - 1}
          isTailTip={snake.length > 1 && index === snake.length - 1}
          isEating={index === 0 && isEating}
          nutPosition={foodPosition}
          headPosition={snake[0]}
        />
      ))}
      <Nut position={food} />
      {obstacles.map(obstacle => (
          obstacle.type === ObstacleType.BRICK
            ? <Brick key={obstacle.id} position={obstacle.position} />
            : <Rock key={obstacle.id} position={obstacle.position} state={obstacle.state} />
      ))}
    </div>
  );
};

export default GameBoard;