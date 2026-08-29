import { motion } from 'framer-motion';
import { Search, Building2, ShieldCheck, Sparkles, Phone, Link2 } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import type { SiteSettings } from '@/lib/types';

interface HomePageProps {
  settings: SiteSettings | null;
  onSearch: () => void;
}

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

      {/* Contact Us — compact liquid black pill */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mx-auto mt-8 w-full max-w-xl"
      >
        <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wide text-white/40">
          Contact Us
        </p>
        <div className="liquid-black flex items-center rounded-full p-1.5">
          <a
            href="tel:+255693910992"
            className="sheen-sweep flex flex-1 flex-col items-center gap-1 rounded-full px-2 py-3 transition-colors duration-200 hover:bg-white/5"
          >
            <Phone size={16} className="text-white" />
            <span className="text-[9px] font-medium text-white/80">Call</span>
          </a>
          <a
            href="https://instagram.com/makazihub"
            target="_blank"
            rel="noopener noreferrer"
            className="sheen-sweep flex flex-1 flex-col items-center gap-1 rounded-full px-2 py-3 transition-colors duration-200 hover:bg-white/5"
          >
            <Link2 size={16} className="text-white" />
            <span className="text-[9px] font-medium text-white/80">Instagram</span>
          </a>
          <a
            href="https://facebook.com/makazihub"
            target="_blank"
            rel="noopener noreferrer"
            className="sheen-sweep flex flex-1 flex-col items-center gap-1 rounded-full px-2 py-3 transition-colors duration-200 hover:bg-white/5"
          >
            <Link2 size={16} className="text-white" />
            <span className="text-[9px] font-medium text-white/80">Facebook</span>
          </a>
          <a
            href="https://tiktok.com/@makazihub"
            target="_blank"
            rel="noopener noreferrer"
            className="sheen-sweep flex flex-1 flex-col items-center gap-1 rounded-full px-2 py-3 transition-colors duration-200 hover:bg-white/5"
          >
            <Link2 size={16} className="text-white" />
            <span className="text-[9px] font-medium text-white/80">TikTok</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
