import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  children?: ReactNode;
}

export function StatCard({ label, value, children }: StatCardProps) {
  return (
    <div className="p-[45px_35px] text-center">
      <p className="text-[9px] text-[#666] tracking-[3px] font-black uppercase">
        {label}
      </p>
      {children || (
        <h2
          className="text-[38px] font-bold mt-2.5"
          style={{ fontFamily: 'Space Mono, monospace' }}
        >
          {value}
        </h2>
      )}
    </div>
  );
}
