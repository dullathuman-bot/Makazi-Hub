import { useRef, useEffect, useState, type MouseEvent } from 'react';
import { Home, Search, Info, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';

export type TabId = 'home' | 'search' | 'about';

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'about', label: 'About', icon: Info },
];

// Tilt nyepesi — inafanya kazi tu kwenye kifaa chenye mouse halisi
// (desktop), kamwe kwenye simu za mguso, na kwa nguvu ndogo zaidi.
function useLightTilt(strength = 6) {
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setCanTilt(mq.matches);
  }, []);

  const onMouseMove = (e: MouseEvent) => {
    if (!canTilt) return;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateY = (x / rect.width) * strength;
    const rotateX = -(y / rect.height) * strength;
    target.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(2px)`;
  };
  const onMouseLeave = (e: MouseEvent) => {
    (e.currentTarget as HTMLElement).style.transform = '';
  };
  return { onMouseMove, onMouseLeave };
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const { theme, toggleTheme } = useTheme();
  const tilt = useLightTilt(6);

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center px-4 pb-5">
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
        className="liquid-black pointer-events-auto flex items-center gap-1 rounded-full p-1.5"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              {...tilt}
              style={{ transformStyle: 'preserve-3d' }}
              className="preserve-3d relative flex items-center overflow-hidden rounded-full"
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(148,0,11,0.95) 0%, rgba(120,1,22,0.85) 100%)',
                      boxShadow: '0 4px 16px rgba(148,0,11,0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
                    }}
                  />
                )}
              </AnimatePresence>

              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                className="relative z-10 flex items-center gap-2 px-4 py-2.5"
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.4 : 2}
                  className={isActive ? 'text-white' : 'text-white/60'}
                />
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden whitespace-nowrap text-[13px] font-semibold tracking-wide text-white"
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </button>
          );
        })}

        {/* mgawanyo */}
        <div className="mx-1 h-6 w-px bg-white/15" />

        {/* Dark / Light toggle — sasa ni sehemu ya bar moja */}
        <button
          onClick={toggleTheme}
          {...tilt}
          style={{ transformStyle: 'preserve-3d' }}
          aria-label="Toggle dark / light mode"
          className="preserve-3d relative flex h-10 w-10 items-center justify-center rounded-full"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.22 }}
            >
              {theme === 'dark' ? (
                <Moon size={17} className="text-white/75" />
              ) : (
                <Sun size={17} className="text-white/75" />
              )}
            </motion.div>
          </AnimatePresence>
        </button>
      </motion.nav>
    </div>
  );
}