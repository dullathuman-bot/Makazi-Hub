import { useRef, useState, type MouseEvent } from 'react';
import { Home, Search, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export function BottomNav({ active, onChange }: BottomNavProps) {
  const [hovered, setHovered] = useState<TabId | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const getTilt = (tabId: TabId) => {
    if (hovered !== tabId && active !== tabId) return { rotateX: 0, rotateY: 0 };
    return { rotateX: 0, rotateY: 0 };
  };

  const handleMouseMove = (e: MouseEvent, tabId: TabId) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateY = (x / rect.width) * 15;
    const rotateX = -(y / rect.height) * 15;
    target.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
  };

  const handleMouseLeave = (e: MouseEvent) => {
    (e.currentTarget as HTMLElement).style.transform = '';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-4 px-4 pointer-events-none">
      <motion.nav
        ref={navRef}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        className="glass-dark glass-glow pointer-events-auto flex items-center gap-1 rounded-3xl px-3 py-2"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              onMouseEnter={() => setHovered(tab.id)}
              onMouseLeave={() => setHovered(null)}
              onMouseMove={(e) => handleMouseMove(e, tab.id)}
              onMouseOut={handleMouseLeave}
              className="preserve-3d relative flex flex-col items-center justify-center rounded-2xl px-4 py-2.5 transition-colors duration-300 sm:px-6"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 rounded-2xl bg-sand/15"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      boxShadow: '0 0 20px rgba(240, 234, 214, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                  />
                )}
              </AnimatePresence>
              <motion.div
                animate={getTilt(tab.id)}
                className="relative z-10 flex flex-col items-center gap-1"
              >
                <Icon
                  size={22}
                  className={`transition-all duration-300 ${
                    isActive ? 'text-sand' : 'text-sand/50'
                  }`}
                  style={isActive ? { filter: 'drop-shadow(0 0 8px rgba(240,234,214,0.4))' } : {}}
                />
                <span
                  className={`text-[10px] font-medium tracking-wide transition-all duration-300 sm:text-xs ${
                    isActive ? 'text-sand' : 'text-sand/50'
                  }`}
                >
                  {tab.label}
                </span>
              </motion.div>
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
}
