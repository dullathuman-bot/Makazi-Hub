import { type ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function GlassModal({ open, onClose, children, className = '' }: GlassModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-cyprus-900/60 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={`glass-dark glass-glow relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl scrollbar-hide ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="glass-button absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full text-sand/80 hover:text-sand"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
