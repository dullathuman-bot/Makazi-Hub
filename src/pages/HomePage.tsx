import { motion } from 'framer-motion';
import { Search, Building2, ShieldCheck, Sparkles, KeyRound, MessageSquareText, Wallet } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import type { SiteSettings } from '@/lib/types';

interface HomePageProps {
  settings: SiteSettings | null;
  onSearch: () => void;
}

// Fallback photos shown only if the admin hasn't uploaded any showcase
// media yet — CSS-only "breathing" pulse, no scroll tracking, light on mobile.
const DEFAULT_SHOWCASE = [
  {
    src: 'https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&w=1000',
    title: 'Modern exteriors',
    desc: 'Clean, contemporary homes across the city, photographed exactly as they are.',
  },
  {
    src: 'https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&w=1000',
    title: 'Comfortable living rooms',
    desc: 'Spaces built for real life — furnished, spacious, and ready to move into.',
  },
  {
    src: 'https://images.pexels.com/photos/7587828/pexels-photo-7587828.jpeg?auto=compress&cs=tinysrgb&w=1000',
    title: 'Quiet bedrooms',
    desc: 'A place to rest, in neighborhoods across Dar es Salaam that fit your life.',
  },
];

const SHOWCASE_CAPTIONS = [
  { title: 'Real homes, real photos', desc: 'Every image here comes straight from a live Makazi Hub listing.' },
  { title: 'Available right now', desc: 'These are homes you can book today — not stock photos.' },
  { title: 'See it before you visit', desc: 'Know exactly what you\u2019re getting before you reach out.' },
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
  const hasCustomShowcase = settings?.showcase_images && settings.showcase_images.length > 0;
  const showcaseItems: { type: 'image' | 'video'; src: string; title: string; desc: string }[] = hasCustomShowcase
    ? [
        ...settings!.showcase_images!.map((src, i) => ({
          type: 'image' as const,
          src,
          title: SHOWCASE_CAPTIONS[i % SHOWCASE_CAPTIONS.length].title,
          desc: SHOWCASE_CAPTIONS[i % SHOWCASE_CAPTIONS.length].desc,
        })),
        ...(settings?.showcase_video_url
          ? [{ type: 'video' as const, src: settings.showcase_video_url, title: 'See it in motion', desc: 'A quick video look at one of our homes.' }]
          : []),
      ]
    : DEFAULT_SHOWCASE.map((item) => ({ type: 'image' as const, ...item }));

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

      {/* Showcase — calm, static "breathing" photos with real copy underneath */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mx-auto mt-20 w-full max-w-4xl"
      >
        <h2 className="text-center font-display text-2xl font-bold text-white sm:text-3xl">
          A glimpse of what's waiting for you
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-white/55">
          Every home on Makazi Hub is real, photographed, and verified — this is a small taste of what
          you'll find once you start browsing.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {showcaseItems.map((item, i) => (
            <motion.div
              key={item.src + i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="overflow-hidden rounded-2xl shadow-lg shadow-black/40"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {item.type === 'video' ? (
                  <video
                    src={item.src}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="animate-breathe h-full w-full object-cover"
                    style={{ animationDelay: `${i * 1.5}s` }}
                    loading="lazy"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-sm font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/70">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

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