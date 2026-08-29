import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Building2, ArrowLeft } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { supabase } from '@/lib/supabase';

interface AdminLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function AdminLogin({ onSuccess, onBack }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.session) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 pb-32 pt-8">
      <div className="water-droplets" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="liquid-black rounded-3xl p-8">
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-black/40 ring-1 ring-white/10">
              <Building2 size={32} className="text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Admin Panel</h1>
            <p className="mt-1 text-sm text-white/50">Makazi Hub — Owner Access</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">Email</label>
              <div className="glass flex items-center gap-2 rounded-xl px-4 py-3">
                <Mail size={18} className="text-white/50" />
                <input
                  type="email"
                  placeholder="admin@makazi.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder:text-white/35 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">Password</label>
              <div className="glass flex items-center gap-2 rounded-xl px-4 py-3">
                <Lock size={18} className="text-white/50" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="flex-1 bg-transparent text-white placeholder:text-white/35 focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="glass rounded-xl border border-red-400/30 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <GlassButton
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full"
              size="lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </GlassButton>

            <button
              onClick={onBack}
              className="flex w-full items-center justify-center gap-2 py-2 text-sm text-white/50 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} /> Back to site
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
