import { type ReactNode } from 'react';
import { useTilt } from '@/lib/useTilt';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
  tilt?: boolean;
}

export function GlassCard({ children, className = '', glow = false, onClick, tilt = true }: GlassCardProps) {
  const { onMouseMove, onMouseLeave } = useTilt(6);

  return (
    <div
      onClick={onClick}
      onMouseMove={tilt ? onMouseMove : undefined}
      onMouseLeave={tilt ? onMouseLeave : undefined}
      className={`glass rounded-2xl transition-transform duration-200 ease-out ${glow ? 'glass-glow' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={tilt ? { transformStyle: 'preserve-3d' } : undefined}
    >
      {children}
    </div>
  );
}
