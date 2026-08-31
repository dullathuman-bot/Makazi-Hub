import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { Search, Building2, ShieldCheck, Sparkles, KeyRound, MessageSquareText, Wallet } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import type { SiteSettings } from '@/lib/types';

interface HomePageProps {
  settings: SiteSettings | null;
  onSearch: () => void;
}

// A short sequence of photos that crossfade into one another as the user
// scrolls through the tall wrapper below — exterior, then further inside
// with each step, like walking through the house room by room.
const TOUR_IMAGES = [
  'https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'https://images.pexels.com/photos/6920439/pexels-photo-6920439.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'https://images.pexels.com/photos/7587828/pexels-photo-7587828.jpeg?auto=compress&cs=tinysrgb&w=1400',
];

const STEPS = [
  {
    icon: Search,
    title: '1. Search',
    desc: 'Browse verified houses and rooms across Dar es Salaam — filter by area, price, and property type until you find the one that feels right.',
  },
  {
    icon: MessageSquareText,
    title: '2. Connect',
    desc: 'Reach the landlord directly by phone or WhatsApp — no middlemen, no broker fees, no waiting days for a reply.',
  },
  {
    icon: Wallet,
    title: '3. Book & Pay',
    desc: 'Confirm your booking and pay securely through mobile money or bank transfer, right from your phone.',
  },
  {
    icon: KeyRound,
    title: '4. Move In',
    desc: "Pick your move-in date and settle into your new home — it's that straightforward.",
  },
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

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-3 max-w-lg text-sm leading-relaxed text-white/60"
        >
          Whether you're after a cozy studio in Mikocheni, a family home in Kinondoni, or a beachfront
          apartment in Mbezi — Makazi Hub connects you directly with trusted landlords across Dar es Salaam,
          with every listing checked and every photo real.
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

      {/* Scroll "tour" — one image that walks you deeper into the house as you scroll */}
      <div className="mx-auto mt-20 w-full max-w-4xl">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wide text-white/40">
          Take a walk through
        </p>
      </div>
      <ScrollTour images={TOUR_IMAGES} />

      {/* How it works — explains the value prop, gives the page real substance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mx-auto mt-20 w-full max-w-4xl"
      >
        <h2 className="text-center font-display text-2xl font-bold text-white sm:text-3xl">How It Works</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-white/55">
          Four simple steps between you and your next home — no agents, no hidden fees, no confusion.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="liquid-black rounded-2xl p-5"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Icon size={18} className="text-white" />
                </div>
                <h3 className="font-display text-sm font-semibold text-white">{step.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-white/60">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Closing statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="mx-auto mt-20 w-full max-w-2xl text-center"
      >
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Your next home is closer than you think
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
          Dar es Salaam has thousands of great places to live — Makazi Hub just makes them easy to find.
          Skip the endless phone calls and unreliable brokers. Search, view, and book your next home in
          minutes, all from right here.
        </p>
        <div className="mt-6 flex justify-center">
          <GlassButton size="lg" onClick={onSearch} variant="black" className="shimmer-border group">
            <span className="flex items-center gap-2">
              <Search size={18} className="transition-transform group-hover:scale-110" />
              Start Searching
            </span>
          </GlassButton>
        </div>
      </motion.div>
    </div>
  );
}

function ScrollTour({ images }: { images: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.28]);
  const n = images.length;

  return (
    <div ref={containerRef} className="relative mx-auto mt-4 w-full" style={{ height: `${n * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale }}>
          {images.map((src, i) => (
            <TourImage key={i} src={src} index={i} total={n} scrollYProgress={scrollYProgress} />
          ))}
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
          <span className="liquid-black rounded-full px-4 py-2 text-xs text-white/70">
            Scroll to walk through the house
          </span>
        </div>
      </div>
    </div>
  );
}

function TourImage({
  src,
  index,
  total,
  scrollYProgress,
}: {
  src: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const segment = 1 / total;
  const start = index * segment;
  const end = (index + 1) * segment;
  const fadeIn = start + segment * 0.15;
  const fadeOutStart = end - segment * 0.15;

  const isFirst = index === 0;
  const isLast = index === total - 1;

  const opacity = useTransform(
    scrollYProgress,
    isFirst ? [start, fadeIn, fadeOutStart, end] : isLast ? [start, fadeIn, end] : [start, fadeIn, fadeOutStart, end],
    isFirst ? [1, 1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0]
  );

  return <motion.img src={src} alt="" style={{ opacity }} className="absolute inset-0 h-full w-full object-cover" />;
}