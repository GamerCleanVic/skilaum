
import React from 'react';
import { Point } from '../types';

interface NutProps {
  position: Point;
}

const cellSize = 24;

const Nut: React.FC<NutProps> = ({ position }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x * cellSize}px`,
    top: `${position.y * cellSize}px`,
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    transform: 'translateZ(8px)',
  };

  return (
    <div style={style} className="flex items-center justify-center animate-pulse">
      <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-lg">
        <g>
          {/* Main nut body */}
          <path d="M8,15 C4,23 16,32 16,32 C16,32 28,23 24,15 Z" fill="#c19a6b" />
          {/* Nut cap */}
          <path d="M6,16 C6,12 26,12 26,16" stroke="#71543a" strokeWidth="11" strokeLinecap="round" fill="none" transform="translate(0, -2)" />
          {/* Stem */}
          <path d="M16,5 L16,2" stroke="#543d2b" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

export default Nut;