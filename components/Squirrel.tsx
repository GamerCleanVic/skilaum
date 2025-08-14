
import React, { useState, useEffect } from 'react';
import { Point } from '../types';

interface SquirrelProps {
  position: Point;
  isHead: boolean;
  isBody: boolean;
  isTailTip: boolean;
  isEating?: boolean;
  nutPosition?: Point;
  headPosition?: Point;
}

const cellSize = 24;

const Pupil: React.FC<{ rotation: number }> = ({ rotation }) => (
    <div className="absolute top-1/2 left-1/2 w-3/5 h-3/5 bg-black rounded-full"
         style={{ 
            transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(35%)`,
            transition: 'transform 0.1s ease-out'
        }}/>
);

const SquirrelHeadSVG: React.FC<{isEating?: boolean}> = ({ isEating }) => {
    const mouthOpenPath = "M 8 18 C 8 26, 24 26, 24 18 S 8 18, 8 18 Z";
    const mouthSmilePath = "M 10 21 Q 16 24 22 21";
    
    return (
        <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: 'translateZ(10px)' }}>
            {/* Ears */}
            <path d="M 4 8 C 4 2, 10 2, 10 8" fill="#a46628" />
            <path d="M 28 8 C 28 2, 22 2, 22 8" fill="#a46628" />
            <path d="M 6 8 C 6 4, 10 4, 10 8" fill="#d58432" />
            <path d="M 26 8 C 26 4, 22 4, 22 8" fill="#d58432" />
            
            {/* Head */}
            <path d="M2,16 C2,28 30,28 30,16 C30,4 2,4 2,16 Z" fill="#d58432" />
            
            {/* Cheeks */}
            <path d="M2,16 C-2,22 10,28 10,22 C10,16 -2,12 2,16" fill="#e79538" />
            <path d="M30,16 C34,22 22,28 22,22 C22,16 34,12 30,16" fill="#e79538" />

            {/* Nose */}
            <path d="M14,16 C14,14 18,14 18,16 C18,18 14,18 14,16 Z" fill="#603813" />

            {/* Mouth Area */}
            {isEating ? (
                <path d={mouthOpenPath} fill="black" />
            ) : (
                <path d={mouthSmilePath} stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            )}

            {/* Buck Teeth - positioned to be partially covered by smile line, or fully visible with open mouth */}
            <g style={{ transition: 'transform 0.1s ease-out', transform: isEating ? 'translateY(0)' : 'translateY(2px)' }}>
              <path d="M12,20 L12,26 L15,26 L15,20 Z" fill="white" stroke="#d0d0d0" strokeWidth="0.5"/>
              <path d="M17,20 L17,26 L20,26 L20,20 Z" fill="white" stroke="#d0d0d0" strokeWidth="0.5"/>
            </g>
        </svg>
    );
};

const SquirrelBodySVG: React.FC = () => (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: 'translateZ(5px)' }}>
      <circle cx="16" cy="16" r="14" fill="#d58432" stroke="#a46628" strokeWidth="2" />
    </svg>
);

const SquirrelTailTipSVG: React.FC = () => (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: 'translateZ(5px)' }}>
      <circle cx="16" cy="16" r="14" fill="#d58432" stroke="#a46628" strokeWidth="2" />
      <circle cx="16" cy="16" r="8" fill="white" />
    </svg>
);


const Squirrel: React.FC<SquirrelProps> = ({ position, isHead, isBody, isTailTip, isEating, nutPosition, headPosition }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x * cellSize}px`,
    top: `${position.y * cellSize}px`,
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    transition: 'left 0.15s linear, top 0.15s linear',
  };

  const [eyeRotation, setEyeRotation] = useState(0);
    useEffect(() => {
        if (isHead && nutPosition && headPosition) {
            const dx = nutPosition.x - headPosition.x;
            const dy = nutPosition.y - headPosition.y;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            setEyeRotation(angle);
        }
    }, [isHead, nutPosition, headPosition]);

  return (
    <div style={style} className="relative">
      {isHead && (
        <>
            <SquirrelHeadSVG isEating={isEating} />
            {/* Eyes container - placed on top of SVG to allow child divs for pupil tracking */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute w-1/4 h-1/4 bg-white rounded-full border border-gray-600" style={{top: '30%', left: '20%'}}><Pupil rotation={eyeRotation} /></div>
                <div className="absolute w-1/4 h-1/4 bg-white rounded-full border border-gray-600" style={{top: '30%', right: '20%'}}><Pupil rotation={eyeRotation} /></div>
            </div>
        </>
      )}
      {isBody && <SquirrelBodySVG />}
      {isTailTip && <SquirrelTailTipSVG />}
    </div>
  );
};

export default Squirrel;
