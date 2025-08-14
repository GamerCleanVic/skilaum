import React from 'react';

const FullSquirrel: React.FC<{className?: string}> = ({className}) => {
    return (
        <svg viewBox="0 0 100 80" className={className} style={{transform: 'scaleX(-1)'}}>
            {/* Tail */}
            <path d="M 98 40 C 120 10, 80 -10, 70 20 C 60 40, 70 60, 90 70 C 110 80, 110 50, 98 40 Z" fill="#a46628" />
            <path d="M 96 42 C 110 20, 85 0, 75 22 C 68 38, 75 55, 90 65 C 100 70, 105 55, 96 42 Z" fill="#d58432" />

            {/* Body */}
            <path d="M 40 70 C 20 75, 10 50, 30 30 C 50 10, 80 10, 80 30 C 85 55, 60 75, 40 70 Z" fill="#d58432" />
            <circle cx="55" cy="50" r="18" fill="#e79538" />

            {/* Legs */}
            <path d="M 40 68 C 30 75, 30 80, 45 78 Z" fill="#a46628" />
            <path d="M 60 68 C 70 75, 70 80, 55 78 Z" fill="#a46628" />
            
            {/* Head */}
            <circle cx="25" cy="35" r="20" fill="#d58432" />
            <path d="M 28 20 C 28 14, 34 14, 34 20" fill="#a46628" /> {/* Ear */}
            
            {/* Face */}
            <circle cx="18" cy="32" r="4" fill="white" />
            <circle cx="19" cy="33" r="2" fill="black" />
            <path d="M 12 42 L 12 48 L 15 48 L 15 42 Z" fill="white"/>
            <path d="M 17 42 L 17 48 L 20 48 L 20 42 Z" fill="white"/>
            <path d="M 10 45 Q 16 48 22 45" stroke="black" strokeWidth="1" fill="none" />

            {/* Arms */}
            <circle cx="45" cy="45" r="8" fill="#a46628"/>
        </svg>
    )
};

const SmallNut: React.FC<{className?: string}> = ({className}) => (
    <svg viewBox="0 0 32 32" className={className}>
        <g>
            <path d="M8,15 C4,23 16,32 16,32 C16,32 28,23 24,15 Z" fill="#c19a6b" />
            <path d="M6,16 C6,12 26,12 26,16" stroke="#71543a" strokeWidth="11" strokeLinecap="round" fill="none" transform="translate(0, -2)" />
        </g>
    </svg>
);

const GiantNut: React.FC<{className?: string}> = ({className}) => (
     <svg viewBox="0 0 80 80" className={className}>
        <defs>
          <filter id="giant-nut-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="4" stdDeviation="2" floodColor="#000000" floodOpacity="0.4"/>
          </filter>
        </defs>
        <g style={{ filter: 'url(#giant-nut-shadow)'}}>
          <path d="M20,40 C10,55 40,80 40,80 C40,80 70,55 60,40 Z" fill="#c19a6b" />
          <path d="M15,42 C15,30 65,30 65,42" stroke="#71543a" strokeWidth="28" strokeLinecap="round" fill="none" transform="translate(0, -5)" />
          <path d="M40,12 L40,5" stroke="#543d2b" strokeWidth="8" strokeLinecap="round" />
        </g>
    </svg>
);


interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-green-800 to-yellow-900 p-4">
      
      {/* Background looping animation */}
      <div className="absolute top-1/2 left-0 w-full h-48 -translate-y-1/2">
        {/* Forest floor path */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-yellow-800/50" style={{ clipPath: 'polygon(0 70%, 100% 40%, 100% 100%, 0% 100%)' }} />

        {/* Squirrel Chasing Nut (Part 1) */}
        <div className="absolute top-1/2 left-0 w-full animate-run-chase">
           <FullSquirrel className="w-32 h-24 inline-block animate-bob" />
        </div>
        <div className="absolute top-1/2 left-0 w-8 h-8 mt-10 ml-4 animate-roll-chase">
            <SmallNut />
        </div>
        
        {/* Squirrel Returning with Giant Nut (Part 2) */}
        <div className="absolute top-1/2 left-0 w-full animate-return-with-prize flex items-center">
           <div className="inline-block relative animate-bob" style={{ width: '200px', height: '150px' }}>
                {/* Giant Nut */}
                <GiantNut className="absolute w-32 h-32 z-10 top-2 left-8 drop-shadow-2xl" />
                {/* Squirrel peeking from behind, holding the nut */}
                <div className="absolute z-0" style={{ right: '50px', top: '10px' }}>
                    <FullSquirrel className="w-32 h-24" />
                </div>
            </div>
        </div>
      </div>
      
      {/* Game Title and Start Button */}
      <div className="relative z-20 text-center text-white">
        <h1 className="text-8xl font-black mb-4 text-yellow-400" style={{ WebkitTextStroke: '3px #5c3b0c' }}>
          Eskilaum
        </h1>
        <p className="text-xl text-yellow-100 mb-8">The Nut-Chasing Adventure!</p>
        <button
          onClick={onStart}
          className="px-12 py-6 bg-green-600 text-white font-bold text-3xl rounded-xl shadow-2xl border-b-8 border-green-800 transform hover:scale-105 active:border-b-2 active:translate-y-1 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-yellow-400"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default StartScreen;