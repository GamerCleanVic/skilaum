import React, { useState, useCallback } from 'react';
import { GameState } from './types';
import StartScreen from './components/StartScreen';
import GameContainer from './components/GameContainer';
import useGameSounds from './hooks/useGameSounds';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.INITIAL);
  const [lastScore, setLastScore] = useState(0);
  const [level, setLevel] = useState(() => {
     const savedLevel = localStorage.getItem('eskilaum_level');
     return savedLevel ? parseInt(savedLevel, 10) : 1;
  });

  const { playClickSound } = useGameSounds();

  const handleStartGame = useCallback(() => {
    playClickSound();
    setGameState(GameState.PLAYING);
  }, [playClickSound]);

  const handleGameOver = useCallback((score: number, finalLevel: number) => {
    setLastScore(score);
    setLevel(finalLevel);
    // Note: We don't save the level to localStorage here, only on successful level-up in GameContainer.
    // This allows the player to retry the level they failed on.
    setGameState(GameState.GAME_OVER);
  }, []);
  
  const handleResetToMenu = useCallback(() => {
      playClickSound();
      setGameState(GameState.INITIAL);
  }, [playClickSound]);

  const handleRetryLevel = useCallback(() => {
    playClickSound();
    setGameState(GameState.PLAYING);
  }, [playClickSound]);

  const handleExitApp = useCallback(() => {
    playClickSound();
    setGameState(GameState.EXIT_SCREEN);
  }, [playClickSound]);


  const renderContent = () => {
    switch (gameState) {
      case GameState.PLAYING:
        return <GameContainer onGameOver={handleGameOver} initialLevel={level} onReset={handleResetToMenu} onExitApp={handleExitApp} />;
      case GameState.GAME_OVER:
        return (
           <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white font-mono">
             <h1 className="text-6xl font-bold text-red-500 mb-4">Game Over</h1>
             <p className="text-2xl mb-2">You were on Level {level}</p>
             <p className="text-2xl mb-8">Final Score: {lastScore}</p>
             <button
               onClick={handleRetryLevel}
               className="px-8 py-4 bg-yellow-500 text-gray-900 font-bold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200"
             >
               Play Again
             </button>
             <button
               onClick={handleResetToMenu}
               className="mt-4 px-6 py-2 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors"
             >
               Back to Menu
             </button>
           </div>
        );
      case GameState.EXIT_SCREEN:
        return (
          <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white font-mono text-center">
            <h1 className="text-6xl font-bold text-yellow-400 mb-6">Thanks for Playing!</h1>
            <p className="text-2xl mb-12">Eskilaum hopes to see you again soon!</p>
            <button
                onClick={handleResetToMenu}
                className="px-12 py-6 bg-green-600 text-white font-bold text-3xl rounded-xl shadow-2xl border-b-8 border-green-800 transform hover:scale-105 active:border-b-2 active:translate-y-1 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-yellow-400"
            >
                Start New Game
            </button>
          </div>
        );
      case GameState.INITIAL:
      default:
        return <StartScreen onStart={handleStartGame} />;
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-800 flex items-center justify-center font-mono">
      {renderContent()}
    </div>
  );
};

export default App;