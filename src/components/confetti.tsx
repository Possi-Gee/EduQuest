'use client';

import React, { useEffect, useState, useMemo } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  speedY: number;
  speedX: number;
  opacity: number;
  animationDelay: string;
}

const colors = ['#FFC107', '#11D565', '#FFFFFF', '#FFD700'];

const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  const confettiCount = 150;

  const memoizedPieces = useMemo(() => {
    return Array.from({ length: confettiCount }).map((_, i) => {
      const side = i % 4; // 0: top, 1: bottom, 2: left, 3: right
      let x, y, speedX, speedY;

      switch (side) {
        case 0: // Top
          x = Math.random() * 100;
          y = -10;
          speedX = Math.random() * 10 - 5;
          speedY = Math.random() * 5 + 2;
          break;
        case 1: // Bottom
          x = Math.random() * 100;
          y = 110;
          speedX = Math.random() * 10 - 5;
          speedY = Math.random() * -5 - 2;
          break;
        case 2: // Left
          x = -10;
          y = Math.random() * 100;
          speedX = Math.random() * 5 + 2;
          speedY = Math.random() * 10 - 5;
          break;
        case 3: // Right
        default:
          x = 110;
          y = Math.random() * 100;
          speedX = Math.random() * -5 - 2;
          speedY = Math.random() * 10 - 5;
          break;
      }
      
      return {
        id: i,
        x,
        y,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY,
        speedX,
        opacity: 1,
        animationDelay: `${Math.random() * 0.5}s`,
      }
    });
  }, []);

  useEffect(() => {
    setPieces(memoizedPieces);

    let animationFrameId: number;

    const animate = () => {
      setPieces(prevPieces =>
        prevPieces.map(p => {
            const newY = p.y + p.speedY;
            const newX = p.x + p.speedX;
            const newSpeedY = p.speedY + 0.15; // gravity

            let opacity = p.opacity;
            if (p.y > 120 || p.y < -20 || p.x > 120 || p.x < -20) {
              opacity = 0;
            }

            return { 
              ...p, 
              y: newY, 
              x: newX, 
              speedY: newSpeedY,
              rotation: p.rotation + p.speedX,
              opacity,
            };
        })
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
        animationFrameId = requestAnimationFrame(animate);
    }
    
    const startTimeout = setTimeout(startAnimation, 3000);
    const stopTimeout = setTimeout(() => cancelAnimationFrame(animationFrameId), 8000);

    return () => {
        clearTimeout(startTimeout);
        clearTimeout(stopTimeout);
        cancelAnimationFrame(animationFrameId);
    };
  }, [memoizedPieces]);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-30"
      aria-hidden="true"
    >
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
            opacity: p.opacity,
            width: '8px',
            height: '16px',
            transition: 'opacity 0.5s ease-out, top 0.05s linear, left 0.05s linear'
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
