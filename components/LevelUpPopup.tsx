
import React from 'react';

interface LevelUpPopupProps {
  level: number;
}

const LevelUpPopup: React.FC<LevelUpPopupProps> = ({ level }) => {
  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="text-center text-white transform animate-zoom-in">
        <h2 className="text-8xl font-black text-yellow-400" style={{ WebkitTextStroke: '3px #854d0e' }}>
          LEVEL {level}
        </h2>
        <p className="text-3xl font-bold mt-4">Get Ready!</p>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-zoom-in { animation: zoom-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default LevelUpPopup;
