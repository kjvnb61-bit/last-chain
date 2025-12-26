import { ReactNode } from 'react';

interface RotatingBorderBoxProps {
  children: ReactNode;
  direction?: 'cw' | 'acw';
  className?: string;
}

export function RotatingBorderBox({ children, direction = 'cw', className = '' }: RotatingBorderBoxProps) {
  return (
    <div className={`relative p-[1px] overflow-hidden rounded-[35px] bg-[rgba(255,255,255,0.05)] transition-all duration-400 hover:-translate-y-1 ${className}`}>
      <div
        className={`absolute w-[140%] h-[140%] -top-[20%] -left-[20%] ${
          direction === 'cw' ? 'animate-spin-slow-cw' : 'animate-spin-slow-acw'
        }`}
        style={{
          background: 'conic-gradient(transparent, transparent, transparent, #00ffcc)',
          animationDuration: '6s',
          animationTimingFunction: 'linear'
        }}
      />
      <div className="relative bg-[#050505] rounded-[34px] z-[1]">
        {children}
      </div>
    </div>
  );
}
