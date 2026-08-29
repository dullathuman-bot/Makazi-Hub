import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Heart, Building2, Target, Eye, ChevronDown } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';

interface AboutPageProps {
  settings: SiteSettings | null;
}

export function AboutPage({ settings }: AboutPageProps) {
  const [isOn, setIsOn] = useState(false);
  const [openId, setOpenId] = useState<string | null>('about');
  const phone = settings?.contact_phone || '+255693910992';
  const whatsapp = settings?.contact_whatsapp || 'https://wa.me/255693910992';

  const items = [
    {
      id: 'about',
      icon: Building2,
      title: 'About Makazi Hub',
      content: (
        <p className="text-sm leading-relaxed text-white/80">
          {settings?.about_text ||
            'Makazi Hub is dedicated to helping people find reliable, quality housing in Dar es Salaam. Our mission is to make house hunting simple, transparent, and stress-free.'}
        </p>
      ),
    },
    {
      id: 'mission',
      icon: Target,
      title: 'Our Mission',
      content: (
        <p className="text-sm leading-relaxed text-white/80">
          To make finding a home in Dar es Salaam effortless, transparent, and accessible to everyone.
        </p>
      ),
    },
    {
      id: 'vision',
      icon: Eye,
      title: 'Our Vision',
      content: (
        <p className="text-sm leading-relaxed text-white/80">
          A city where everyone finds a place they love to call home — without the stress of traditional house hunting.
        </p>
      ),
    },
    {
      id: 'contact',
      icon: Phone,
      title: 'Get in Touch',
      content: (
        <div className="space-y-2.5">
          <a href={`tel:${phone}`} className="sheen-sweep glass flex items-center gap-3 rounded-xl p-3 transition-all hover:scale-[1.02]">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg glass-dark">
              <Phone size={16} className="text-white" />
            </div>
            <div>
              <div className="text-[11px] text-white/50">Phone</div>
              <div className="text-sm font-medium text-white">{phone}</div>
            </div>
          </a>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="sheen-sweep glass flex items-center gap-3 rounded-xl p-3 transition-all hover:scale-[1.02]">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg glass-dark">
              <MessageCircle size={16} className="text-white" />
            </div>
            <div>
              <div className="text-[11px] text-white/50">WhatsApp</div>
              <div className="text-sm font-medium text-white">Chat with us</div>
            </div>
          </a>
          <div className="glass flex items-center gap-3 rounded-xl p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg glass-dark">
              <MapPin size={16} className="text-white" />
            </div>
            <div>
              <div className="text-[11px] text-white/50">Location</div>
              <div className="text-sm font-medium text-white">Dar es Salaam, Tanzania</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen px-4 pb-32 pt-10">
      <div className="mx-auto flex max-w-xl flex-col items-center">
        {/* Hanging pull-cord lamp */}
        <div className="relative flex flex-col items-center pt-2">
          <div className="h-8 w-px bg-white/20" />

          <motion.div
            animate={{ rotate: isOn ? [0, -5, 4, -2, 0] : 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative"
            style={{ transformOrigin: 'top center' }}
          >
            <svg width="88" height="54" viewBox="0 0 88 54" fill="none">
              <path d="M44 0 L82 50 Q44 62 6 50 Z" fill="#0a0a0a" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
            </svg>
            <motion.div
              animate={{ opacity: isOn ? 1 : 0.35, scale: isOn ? 1 : 0.7 }}
              transition={{ duration: 0.4 }}
              className="absolute left-1/2 top-[46px] h-3 w-3 -translate-x-1/2 rounded-full"
              style={{
                background: isOn ? '#94000b' : '#3a3a3a',
                boxShadow: isOn
                  ? '0 0 18px 6px rgba(148, 0, 11, 0.85), 0 0 55px 26px rgba(148, 0, 11, 0.35)'
                  : 'none',
                transition: 'background 0.4s ease',
              }}
            />
          </motion.div>

          <AnimatePresence>
            {isOn && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="pointer-events-none fixed inset-0 -z-10"
                style={{
                  background: 'radial-gradient(ellipse 75vw 95vh at 50% 8%, rgba(148, 0, 11, 0.28), rgba(148, 0, 11, 0.1) 45%, transparent 75%)',
                }}
              />
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsOn((v) => !v)}
            className="group relative z-10 mt-0 flex flex-col items-center focus:outline-none"
            aria-label="Toggle About Us"
          >
            <motion.div
              key={isOn ? 'pulled' : 'released'}
              initial={{ scaleY: 0.8 }}
              animate={{ scaleY: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 9 }}
              style={{ transformOrigin: 'top' }}
              className="h-9 w-px bg-white/30"
            />
            <div className="sheen-sweep liquid-black mt-0 flex items-center gap-2 rounded-full px-4 py-2 transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
              <span
                className="h-1.5 w-1.5 rounded-full transition-all duration-300"
                style={{
                  background: isOn ? '#94000b' : 'rgba(255,255,255,0.4)',
                  boxShadow: isOn ? '0 0 8px #94000b' : 'none',
                }}
              />
              <span className="text-xs font-medium text-white/85">About Us</span>
            </div>
          </button>
        </div>

        {!isOn && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5 text-xs text-white/35">
            Pull the cord to illuminate
          </motion.p>
        )}

        {/* Revealed accordion content */}
        <AnimatePresence>
          {isOn && (
            <motion.div
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="mt-8 w-full"
            >
              <h1 className="text-center font-display text-2xl font-bold text-white text-glow sm:text-3xl">
                About Makazi Hub
              </h1>

              <div className="mt-6 flex flex-col gap-2.5">
                {items.map((item, i) => {
                  const Icon = item.icon;
                  const isOpen = openId === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                      className={`overflow-hidden rounded-2xl ${isOpen ? 'border-beam' : ''}`}
                    >
                      <div className="glass-teal rounded-2xl">
                        <button
                          onClick={() => setOpenId(isOpen ? null : item.id)}
                          className="sheen-sweep flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/25">
                            <Icon size={15} className="text-white" />
                          </div>
                          <span className="flex-1 text-sm font-semibold text-white">{item.title}</span>
                          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                            <ChevronDown size={16} className="text-white/70" />
                          </motion.div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 pt-1">{item.content}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/40">
                <Heart size={14} className="text-white/30" />
                <span>Makazi Hub — Made with care for Dar es Salaam</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
