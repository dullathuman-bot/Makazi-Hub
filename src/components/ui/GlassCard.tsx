import { type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', glow = false, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`glass rounded-2xl ${glow ? 'glass-glow' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
