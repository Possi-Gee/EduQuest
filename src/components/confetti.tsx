'use client';

import React, { useEffect, useState, useMemo } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  speed: number;
  opacity: number;
}

const colors = ['#FFC107', '#11D565', '#FFFFFF', '#FFD700'];

const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  const confettiCount = 150;

  const memoizedPieces = useMemo(() => {
    return Array.from({ length: confettiCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 100,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.5 + 0.5,
    }));
  }, []);


  useEffect(() => {
    setPieces(memoizedPieces);

    let animationFrameId: number;

    const animate = () => {
      setPieces(prevPieces =>
        prevPieces.map(p => {
          let newY = p.y + p.speed;
          let newX = p.x + Math.sin(newY / 10) * 0.1;
          if (newY > 120) {
            newY = -20;
            newX = Math.random() * 100;
          }
          return { ...p, y: newY, x: newX, rotation: p.rotation + p.speed /2 };
        })
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    const timeoutId = setTimeout(() => cancelAnimationFrame(animationFrameId), 5000);

    return () => {
        cancelAnimationFrame(animationFrameId);
        clearTimeout(timeoutId);
    };
  }, [memoizedPieces]);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-10"
      aria-hidden="true"
    >
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
            opacity: p.opacity,
            width: '8px',
            height: '16px',
            transition: 'top 0.1s linear, left 0.1s linear',
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
