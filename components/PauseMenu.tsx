
import React from 'react';
import { SoundConfig } from '../types';

interface PauseMenuProps {
  onContinue: () => void;
  onReset: () => void;
  soundConfig: SoundConfig;
  onSoundConfigChange: (newConfig: SoundConfig) => void;
  onExitApp: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({ onContinue, onReset, soundConfig, onSoundConfigChange, onExitApp }) => {

  const toggleSound = () => {
    onSoundConfigChange({ ...soundConfig, effects: !soundConfig.effects });
  };

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gray-800/80 border-2 border-yellow-500 rounded-2xl p-10 shadow-2xl flex flex-col items-center gap-6 w-96">
        <h2 className="text-5xl font-bold text-white mb-4">Paused</h2>
        <button onClick={onContinue} className="w-full text-2xl py-3 bg-green-600 hover:bg-green-500 transition-colors rounded-lg font-semibold">
          Continue
        </button>
        <button onClick={onReset} className="w-full text-2xl py-3 bg-yellow-600 hover:bg-yellow-500 transition-colors rounded-lg font-semibold">
          Reset Game
        </button>
        <div className="w-full text-xl py-3 bg-blue-600 rounded-lg font-semibold flex items-center justify-center gap-4">
          <span>Sounds</span>
          <button onClick={toggleSound} className={`w-16 h-8 rounded-full transition-colors ${soundConfig.effects ? 'bg-green-500' : 'bg-gray-600'}`}>
            <span className={`block w-6 h-6 m-1 bg-white rounded-full transform transition-transform ${soundConfig.effects ? 'translate-x-8' : 'translate-x-0'}`} />
          </button>
        </div>
        <button onClick={onExitApp} className="w-full text-2xl py-3 bg-red-700 hover:bg-red-600 transition-colors rounded-lg font-semibold">
          Exit
        </button>
      </div>
    </div>
  );
};

export default PauseMenu;