import { motion } from 'framer-motion';
import { Phone, MessageCircle, Mail, MapPin, Heart, Building2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import type { SiteSettings } from '@/lib/types';

interface AboutPageProps {
  settings: SiteSettings | null;
}

export function AboutPage({ settings }: AboutPageProps) {
  const phone = settings?.contact_phone || '+255693910992';
  const whatsapp = settings?.contact_whatsapp || 'https://wa.me/255693910992';

  return (
    <div className="min-h-screen px-4 pb-32 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-3xl"
      >
        <h1 className="font-display text-3xl font-bold text-sand text-glow sm:text-4xl">About Makazi Hub</h1>

        {/* About card */}
        <GlassCard className="mt-6 p-6 sm:p-8" glow>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl glass-dark">
            <Building2 size={28} className="text-sand" />
          </div>
          <p className="text-base leading-relaxed text-sand/80">
            {settings?.about_text || 'Makazi Hub is dedicated to helping people find reliable, quality housing in Dar es Salaam. Our mission is to make house hunting simple, transparent, and stress-free.'}
          </p>
        </GlassCard>

        {/* Mission / values */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { title: 'Our Mission', desc: 'To make finding a home in Dar es Salaam effortless, transparent, and accessible to everyone.' },
            { title: 'Our Vision', desc: 'A city where everyone finds a place they love to call home — without the stress of traditional house hunting.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
            >
              <GlassCard className="p-5">
                <h3 className="font-display text-lg font-semibold text-sand">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sand/60">{item.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <GlassCard className="mt-6 p-6 sm:p-8" glow>
            <h2 className="font-display text-xl font-semibold text-sand">Get in Touch</h2>
            <p className="mt-1 text-sm text-sand/60">Have questions? We are here to help.</p>

            <div className="mt-5 space-y-3">
              <a href={`tel:${phone}`} className="block">
                <div className="glass flex items-center gap-3 rounded-xl p-4 transition-all hover:scale-[1.02]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl glass-dark">
                    <Phone size={18} className="text-sand" />
                  </div>
                  <div>
                    <div className="text-xs text-sand/50">Phone</div>
                    <div className="text-sm font-medium text-sand">{phone}</div>
                  </div>
                </div>
              </a>

              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="block">
                <div className="glass flex items-center gap-3 rounded-xl p-4 transition-all hover:scale-[1.02]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl glass-dark">
                    <MessageCircle size={18} className="text-sand" />
                  </div>
                  <div>
                    <div className="text-xs text-sand/50">WhatsApp</div>
                    <div className="text-sm font-medium text-sand">Chat with us</div>
                  </div>
                </div>
              </a>

              <div className="glass flex items-center gap-3 rounded-xl p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl glass-dark">
                  <MapPin size={18} className="text-sand" />
                </div>
                <div>
                  <div className="text-xs text-sand/50">Location</div>
                  <div className="text-sm font-medium text-sand">Dar es Salaam, Tanzania</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-sand/40">
          <Heart size={14} className="text-sand/30" />
          <span>Makazi Hub — Made with care for Dar es Salaam</span>
        </div>
      </motion.div>
    </div>
  );
}
