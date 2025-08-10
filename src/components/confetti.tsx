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

const colors = ['#FFC107', '#11D565', '#FFFFFF', '#FFD700', '#DA70D6', '#4169E1'];

const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  const confettiCount = 150;

  const memoizedPieces = useMemo(() => {
    return Array.from({ length: confettiCount }).map((_, i) => {
      const angle = Math.random() * 2 * Math.PI;
      const initialSpeed = Math.random() * 8 + 4; // pop-out speed
      
      return {
        id: i,
        x: 50, // Start from center
        y: 50, // Start from center
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.sin(angle) * initialSpeed,
        speedX: Math.cos(angle) * initialSpeed,
        opacity: 1,
        animationDelay: '0s',
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
            const newSpeedX = p.speedX * 0.98; // friction

            let opacity = p.opacity;
            if (p.y > 120) { // Disappear when off-screen
              opacity = 0;
            }

            return { 
              ...p, 
              y: newY, 
              x: newX, 
              speedY: newSpeedY,
              speedX: newSpeedX,
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
    
    // Start animation after a short delay
    const startTimeout = setTimeout(startAnimation, 100);
    // Stop animation after a while to save performance
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
            transition: 'opacity 0.5s ease-out'
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
