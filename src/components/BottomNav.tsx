import { useRef, type MouseEvent } from 'react';
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
  { id: 'search', label: 'Search Makazi', icon: Search },
  { id: 'about', label: 'About Us', icon: Info },
];

function tiltHandlers(strength = 14) {
  const onMouseMove = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateY = (x / rect.width) * strength;
    const rotateX = -(y / rect.height) * strength;
    target.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
  };
  const onMouseLeave = (e: MouseEvent) => {
    (e.currentTarget as HTMLElement).style.transform = '';
  };
  return { onMouseMove, onMouseLeave };
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const tiltNav = tiltHandlers(14);
  const tiltToggle = tiltHandlers(18);

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-3 px-4 pb-5">
      <motion.nav
        ref={navRef}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        className="liquid-black pointer-events-auto flex items-center gap-1 rounded-[28px] p-1.5"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              {...tiltNav}
              className="preserve-3d relative flex flex-col items-center justify-center rounded-[22px] px-4 py-2.5 transition-colors duration-200 sm:px-6"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 rounded-[22px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(148,0,11,0.95) 0%, rgba(120,1,22,0.85) 100%)',
                      boxShadow: '0 4px 18px rgba(148,0,11,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                    }}
                  />
                )}
              </AnimatePresence>
              <div className="relative z-10 flex flex-col items-center gap-1">
                <motion.div
                  animate={{ scale: isActive ? 1.08 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Icon size={21} className={`transition-colors duration-200 ${isActive ? 'text-white' : 'text-white/70'}`} />
                </motion.div>
                <span className={`text-[10px] font-medium tracking-wide transition-colors duration-200 sm:text-xs ${isActive ? 'text-white' : 'text-white/70'}`}>
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </motion.nav>

      {/* Dark / Light mode toggle */}
      <motion.button
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        onClick={toggleTheme}
        {...tiltToggle}
        aria-label="Toggle dark / light mode"
        className="liquid-black pointer-events-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.25 }}
          >
            {theme === 'dark' ? (
              <Moon size={18} className="text-white/80" />
            ) : (
              <Sun size={18} className="text-white/80" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}