import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { BottomNav, type TabId } from '@/components/BottomNav';
import { HomePage } from '@/pages/HomePage';
import { SearchPage } from '@/pages/SearchPage';
import { AboutPage } from '@/pages/AboutPage';
import { AdminLogin } from '@/pages/AdminLogin';
import { AdminPanel } from '@/pages/AdminPanel';
import { supabase } from '@/lib/supabase';
import type { Property, SiteSettings } from '@/lib/types';

function App() {
  const [tab, setTab] = useState<TabId>('home');
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Check URL for /admin route
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      setIsAdminRoute(path === '/admin' || path.startsWith('/admin'));
    };
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  // Check auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setAuthChecked(true);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  // Load public data
  const loadData = useCallback(async () => {
    try {
      const [propsRes, settingsRes] = await Promise.all([
        supabase.from('properties').select('*').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('*').maybeSingle(),
      ]);
      if (propsRes.data) setProperties(propsRes.data as Property[]);
      if (settingsRes.data) setSettings(settingsRes.data as SiteSettings);
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdminRoute) loadData();
  }, [isAdminRoute, loadData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
  };

  const handleTabChange = (newTab: TabId) => {
    setTab(newTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin route
  if (isAdminRoute) {
    if (!authChecked) {
      return (
        <>
          <AnimatedBackground imageUrl={settings?.background_url ?? null} />
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-sand/30 border-t-sand" />
          </div>
        </>
      );
    }
    if (!isAuthenticated) {
      return (
        <>
          <AnimatedBackground imageUrl={settings?.background_url ?? null} />
          <AdminLogin
            onSuccess={() => setIsAuthenticated(true)}
            onBack={() => {
              window.history.pushState({}, '', '/');
              setIsAdminRoute(false);
            }}
          />
        </>
      );
    }
    return (
      <>
        <AnimatedBackground imageUrl={settings?.background_url ?? null} />
        <AdminPanel onLogout={handleLogout} />
      </>
    );
  }

  // Public site
  return (
    <>
      <AnimatedBackground imageUrl={settings?.background_url ?? null} />

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        >
          {tab === 'home' && <HomePage settings={settings} onSearch={() => handleTabChange('search')} />}
          {tab === 'search' && <SearchPage properties={properties} loading={loading} />}
          {tab === 'about' && <AboutPage settings={settings} />}
        </motion.div>
      </AnimatePresence>

      <BottomNav active={tab} onChange={handleTabChange} />
    </>
  );
}

export default App;
