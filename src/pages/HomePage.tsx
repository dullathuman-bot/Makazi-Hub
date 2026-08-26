import { motion } from 'framer-motion';
import { Search, Building2, ShieldCheck, Sparkles } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import type { SiteSettings } from '@/lib/types';

interface HomePageProps {
  settings: SiteSettings | null;
  onSearch: () => void;
}

export function HomePage({ settings, onSearch }: HomePageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pb-32 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="text-center"
      >
        {/* Logo / brand mark */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl glass glass-glow"
        >
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="Makazi Hub" className="h-12 w-12 rounded-2xl object-cover" />
          ) : (
            <Building2 size={36} className="text-sand" />
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-display text-5xl font-bold text-sand text-glow sm:text-7xl"
        >
          Makazi Hub
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-4 max-w-xl text-base text-sand/70 sm:text-lg"
        >
          {settings?.hero_tagline || 'Find your perfect home in Dar es Salaam — quality rentals, trusted landlords, effortless booking.'}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <GlassButton size="lg" onClick={onSearch} className="shimmer-border group">
            <span className="flex items-center gap-2">
              <Search size={20} className="transition-transform group-hover:scale-110" />
              Search Makazi Now
            </span>
          </GlassButton>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {[
            { icon: Building2, title: 'Verified Listings', desc: 'Every property is checked and verified' },
            { icon: ShieldCheck, title: 'Trusted Landlords', desc: 'Connect with reliable, vetted landlords' },
            { icon: Sparkles, title: 'Easy Booking', desc: 'Reserve your home in just a few taps' },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="glass rounded-2xl p-5 text-left">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl glass-dark">
                  <Icon size={20} className="text-sand" />
                </div>
                <h3 className="font-display text-sm font-semibold text-sand">{feature.title}</h3>
                <p className="mt-1 text-xs text-sand/60">{feature.desc}</p>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
