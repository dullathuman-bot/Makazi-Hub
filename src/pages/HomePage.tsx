import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Building2, ShieldCheck, Sparkles } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import type { SiteSettings } from '@/lib/types';

interface HomePageProps {
  settings: SiteSettings | null;
  onSearch: () => void;
}

const SHOWCASE_IMAGES = [
  { src: 'https://images.pexels.com/photos/12558848/pexels-photo-12558848.jpeg?auto=compress&cs=tinysrgb&w=900', speed: 26, className: 'col-span-2 row-span-2' },
  { src: 'https://images.pexels.com/photos/7587828/pexels-photo-7587828.jpeg?auto=compress&cs=tinysrgb&w=700', speed: 44 },
  { src: 'https://images.pexels.com/photos/27164969/pexels-photo-27164969.jpeg?auto=compress&cs=tinysrgb&w=700', speed: 18 },
  { src: 'https://images.pexels.com/photos/35361410/pexels-photo-35361410.jpeg?auto=compress&cs=tinysrgb&w=700', speed: 36, className: 'col-span-2 row-span-1 sm:col-span-1 sm:row-span-2' },
  { src: 'https://images.pexels.com/photos/12558958/pexels-photo-12558958.jpeg?auto=compress&cs=tinysrgb&w=700', speed: 52 },
];

export function HomePage({ settings, onSearch }: HomePageProps) {
  return (
    <div className="relative flex min-h-screen flex-col px-6 pb-40 pt-16 sm:px-10 lg:px-20">
      {/* Logo mark — top right, plain, no border/glass frame */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="absolute right-6 top-6 sm:right-10 sm:top-8 lg:right-20"
      >
        {settings?.logo_url ? (
          <img src={settings.logo_url} alt="Makazi Hub" className="h-10 w-10 object-contain sm:h-12 sm:w-12" />
        ) : (
          <img src="/logo.png" alt="Makazi Hub" className="h-10 w-10 object-contain sm:h-12 sm:w-12" />
        )}
      </motion.div>

      {/* Centered brand header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="mx-auto flex flex-col items-center text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-display text-4xl font-bold text-white text-glow sm:text-6xl"
        >
          Makazi Hub
        </motion.h1>
      </motion.div>

      {/* Left-aligned supporting content */}
      <div className="mt-10 w-full max-w-xl text-left">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-button-accent-soft mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white"
        >
          <Sparkles size={13} />
          Welcome to Makazi Hub
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-lg text-base leading-relaxed text-white/85 sm:text-lg"
        >
          {settings?.hero_tagline ||
            'Sehemu ambayo unapata makazi yako bila kupata usumbufu wa dalali — chagua chumba, wasiliana, lipa mara moja na uhamie.'}
        </motion.p>
      </div>

      {/* CTA button — fully centered, black liquid glass */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mx-auto mt-10 flex justify-center"
      >
        <GlassButton size="lg" onClick={onSearch} variant="black" className="shimmer-border group">
          <span className="flex items-center gap-2">
            <Search size={20} className="transition-transform group-hover:scale-110" />
            Search Makazi Now
          </span>
        </GlassButton>
      </motion.div>

      {/* Feature strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mx-auto mt-16 w-full max-w-xl"
      >
        <div className="liquid-black flex items-center rounded-full p-1.5">
          {[
            { icon: Building2, label: 'Verified' },
            { icon: ShieldCheck, label: 'Trusted' },
            { icon: Sparkles, label: 'Easy Booking' },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="sheen-sweep flex flex-1 flex-col items-center gap-1 rounded-full px-3 py-3 transition-colors duration-200 hover:bg-white/5"
              >
                <Icon size={16} className="text-white" />
                <span className="text-[10px] font-medium text-white/80">{feature.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Showcase gallery — a visual "walk-through" as you scroll, purely for browsing feel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mx-auto mt-16 w-full max-w-4xl"
      >
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wide text-white/40">
          A glimpse of what's waiting for you
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4" style={{ gridAutoRows: '130px' }}>
          {SHOWCASE_IMAGES.map((img, i) => (
            <ShowcaseImage key={i} src={img.src} speed={img.speed} className={img.className} />
          ))}
        </div>
        <p className="mt-5 text-center text-sm text-white/50">
          Every home is verified, photographed, and ready to view — head to Search Makazi to explore them all.
        </p>
      </motion.div>
    </div>
  );
}

function ShowcaseImage({ src, speed = 30, className = '' }: { src: string; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  return (
    <div ref={ref} className={`group relative overflow-hidden rounded-2xl shadow-lg shadow-black/40 ${className}`}>
      <motion.img
        src={src}
        alt=""
        style={{ y }}
        className="h-[130%] w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
    </div>
  );
}