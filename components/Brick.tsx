
import React from 'react';
import { Point } from '../types';

interface BrickProps {
  position: Point;
}

const cellSize = 24;

const Brick: React.FC<BrickProps> = ({ position }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x * cellSize}px`,
    top: `${position.y * cellSize}px`,
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    // Make bricks feel taller than rocks
    transform: 'translateZ(16px)', 
  };

  return (
    <div style={style} className="flex items-center justify-center">
       <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-md">
         {/* Base Brick Color */}
         <rect width="32" height="32" rx="2" fill="#b94e3a" />
         {/* Darker shade for 3D effect */}
         <path d="M2,30 V2 H30 V30 H2 Z M4,28 H28 V4 H4 Z" fill="#8c3a2b" />
         {/* Highlight for 3D effect */}
         <path d="M4,4 L28,4 L28,2 H2 L2,4 L4,4 Z" fill="#d58432" />
         <path d="M4,4 L4,28 L2,28 L2,2 L4,2 Z" fill="#d58432" />
         {/* Mortar lines */}
         <rect x="0" y="15" width="32" height="2" fill="#d5bfa5" fillOpacity="0.5" />
         <rect x="15" y="0" width="2" height="32" fill="#d5bfa5" fillOpacity="0.5" />
      </svg>
    </div>
  );
};

export default Brick;
