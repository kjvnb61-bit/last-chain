import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  const [outlinePosition, setOutlinePosition] = useState({ x: -16, y: -16 });

  useEffect(() => {
    let rafId: number;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setDotPosition({ x: targetX, y: targetY });
    };

    const updateOutline = () => {
      setOutlinePosition(prev => ({
        x: prev.x + (targetX - 20 - prev.x) * 0.15,
        y: prev.y + (targetY - 20 - prev.y) * 0.15
      }));
      rafId = requestAnimationFrame(updateOutline);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(updateOutline);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        className="fixed w-2 h-2 rounded-full pointer-events-none z-[10000]"
        style={{
          background: '#00ffcc',
          left: dotPosition.x,
          top: dotPosition.y,
          transform: 'translate(-50%, -50%)'
        }}
      />
      <div
        className="fixed w-10 h-10 rounded-full pointer-events-none z-[9999] border"
        style={{
          borderColor: '#00ffcc',
          left: outlinePosition.x,
          top: outlinePosition.y,
          transform: 'translate(-50%, -50%)'
        }}
      />
    </>
  );
}
