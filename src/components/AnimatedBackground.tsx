import { useEffect, useState } from 'react';

interface AnimatedBackgroundProps {
  imageUrl: string | null;
}

export function AnimatedBackground({ imageUrl }: AnimatedBackgroundProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fallback = 'https://images.pexels.com/photos/29560257/pexels-photo-29560257.jpeg?auto=compress&cs=tinysrgb&w=1920';
  const url = imageUrl || fallback;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-cyprus-500">
      {/* Breathing background image with parallax */}
      <div
        className="absolute inset-0 animate-breathe"
        style={{
          transform: `translateY(${scrollY * 0.15}px) scale(1.1)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <img
          src={url}
          alt=""
          className="h-full w-full object-cover"
          style={{ filter: 'blur(2px) brightness(0.55)' }}
        />
      </div>

      {/* Depth-of-field gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyprus-500/40 via-cyprus-500/30 to-cyprus-700/70" />
      <div className="absolute inset-0 bg-gradient-to-tr from-cyprus-600/30 via-transparent to-cyprus-400/20" />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0, 71, 65, 0.5) 100%)',
        }}
      />

      {/* Subtle maroon accent tint in the corners for warmth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 15% 10%, rgba(120, 1, 22, 0.12), transparent 45%), radial-gradient(ellipse at 85% 95%, rgba(120, 1, 22, 0.1), transparent 45%)',
        }}
      />
    </div>
  );
}
