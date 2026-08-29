import { type MouseEvent } from 'react';

/**
 * Returns onMouseMove/onMouseLeave handlers that apply a subtle 3D "liquid glass"
 * tilt to the element based on cursor position, mirroring the BottomNav tilt effect.
 * Attach alongside `className="transition-transform duration-200 ease-out"` and
 * `style={{ transformStyle: 'preserve-3d' }}` for the smoothest result.
 */
export function useTilt(strength = 10) {
  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateY = (x / rect.width) * strength;
    const rotateX = -(y / rect.height) * strength;
    target.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
  };

  const onMouseLeave = (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = '';
  };

  return { onMouseMove, onMouseLeave };
}
