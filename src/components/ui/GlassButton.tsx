import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: GlassButtonProps) {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variants = {
    primary: 'glass-button-accent text-sand hover:text-white',
    secondary: 'glass-dark text-sand border-sand/20 hover:border-sand/40',
    ghost: 'text-sand/80 hover:text-sand hover:bg-white/5',
  };

  return (
    <button
      className={`rounded-xl font-medium transition-all duration-300 ${sizes[size]} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
}
