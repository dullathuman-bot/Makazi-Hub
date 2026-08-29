import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { useTilt } from '@/lib/useTilt';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'black';
  size?: 'sm' | 'md' | 'lg';
}

export function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: GlassButtonProps) {
  const { onMouseMove, onMouseLeave } = useTilt(8);

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variants = {
    primary: 'glass-button-accent text-white',
    secondary: 'glass-button-accent-soft text-white',
    ghost: 'text-white/80 hover:text-white hover:bg-maroon-500/15 border border-transparent hover:border-maroon-500/30',
    black: 'glass-button-black text-white',
  };

  return (
    <button
      className={`sheen-sweep rounded-xl font-medium transition-all duration-200 ease-out ${sizes[size]} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
      {...props}
    >
      {children}
    </button>
  );
}
