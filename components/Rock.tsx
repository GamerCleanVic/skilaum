
import React from 'react';
import { Point, ObstacleState } from '../types';

interface RockProps {
  position: Point;
  state: ObstacleState;
}

const cellSize = 24;

const Rock: React.FC<RockProps> = ({ position, state }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x * cellSize}px`,
    top: `${position.y * cellSize}px`,
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    transform: 'translateZ(12px)',
  };
  
  const isDeteriorating = state === ObstacleState.DETERIORATING;

  return (
    <div 
        style={style} 
        className={`flex items-center justify-center transition-all duration-1000 ${isDeteriorating ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
    >
       <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-lg">
        <path d="M4,16 C4,8 10,2 16,4 C22,6 28,10 28,18 C28,26 22,30 14,28 C6,26 4,24 4,16 Z" fill="#a1a1aa" />
        <path d="M6,15 C6,9 11,4 16,6 C21,8 26,12 26,19 C26,25 21,28 14,26 C7,24 6,22 6,15 Z" fill="#71717a" />
        <path d="M12,12 L18,10 M10,22 L16,24" stroke="#52525b" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    </div>
  );
};

export default Rock;