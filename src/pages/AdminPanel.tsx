import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, CalendarCheck, Settings, Plus, Pencil, Trash2,
  CheckCircle2, Clock, XCircle, LogOut, Save, ImagePlus, Video, X, Loader2,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassModal } from '@/components/ui/GlassModal';
import { supabase } from '@/lib/supabase';
import { uploadMedia } from '@/lib/upload';
import type { Property, Booking, SiteSettings } from '@/lib/types';
import { PROPERTY_TYPES, AREAS } from '@/lib/types';

interface AdminPanelProps {
  onLogout: () => void;
}

type AdminTab = 'properties' | 'bookings' | 'settings';

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [tab, setTab] = useState<AdminTab>('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showPropertyForm, setShowPropertyForm] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [propsRes, bookRes, settingsRes] = await Promise.all([
        supabase.from('properties').select('*').order('created_at', { ascending: false }),
        supabase.from('bookings').select('*, properties(name)').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('*').maybeSingle(),
      ]);
      if (propsRes.data) setProperties(propsRes.data as Property[]);
      if (bookRes.data) setBookings(bookRes.data as Booking[]);
      if (settingsRes.data) setSettings(settingsRes.data as SiteSettings);
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Delete this property? This cannot be undone.')) return;
    await supabase.from('properties').delete().eq('id', id);
    loadData();
  };

  // Approving a booking marks its property as booked (not available).
  // Rejecting one frees the property back up.
  const handleBookingStatus = async (id: string, status: string, propertyId: string | null) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    if (propertyId) {
      if (status === 'approved') {
        await supabase.from('properties').update({ available: false }).eq('id', propertyId);
      } else if (status === 'rejected') {
        await supabase.from('properties').update({ available: true }).eq('id', propertyId);
      }
    }
    loadData();
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Delete this booking request?')) return;
    await supabase.from('bookings').delete().eq('id', id);
    loadData();
  };

  const tabs = [
    { id: 'properties' as const, label: 'Properties', icon: Building2 },
    { id: 'bookings' as const, label: 'Bookings', icon: CalendarCheck },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black px-4 pb-32 pt-8">
      <div className="water-droplets" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Admin Panel</h1>
            <p className="mt-1 text-sm text-white/50">Manage your Makazi Hub listings</p>
          </div>
          <GlassButton variant="secondary" onClick={onLogout} size="sm">
            <span className="flex items-center gap-2"><LogOut size={16} /> Logout</span>
          </GlassButton>
        </div>

        {/* Tabs */}
        <div className="liquid-black mb-6 flex w-fit gap-1 rounded-2xl p-1.5">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`sheen-sweep flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  active ? 'bg-maroon-500/70 text-white' : 'text-white/50 hover:text-white/80'
                }`}
              >
                <Icon size={16} />
                {t.label}
                {t.id === 'bookings' && bookings.filter(b => b.status === 'pending').length > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-[10px] font-bold text-white">
                    {bookings.filter(b => b.status === 'pending').length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {tab === 'properties' && (
                <PropertiesTab
                  properties={properties}
                  onAdd={() => { setEditingProperty(null); setShowPropertyForm(true); }}
                  onEdit={(p) => { setEditingProperty(p); setShowPropertyForm(true); }}
                  onDelete={handleDeleteProperty}
                />
              )}
              {tab === 'bookings' && (
                <BookingsTab
                  bookings={bookings}
                  onStatus={handleBookingStatus}
                  onDelete={handleDeleteBooking}
                />
              )}
              {tab === 'settings' && (
                <SettingsTab settings={settings} onSave={loadData} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Property form modal */}
      <PropertyFormModal
        open={showPropertyForm}
        property={editingProperty}
        onClose={() => setShowPropertyForm(false)}
        onSaved={() => { setShowPropertyForm(false); loadData(); }}
      />
    </div>
  );
}

// --- Properties Tab ---

function PropertiesTab({ properties, onAdd, onEdit, onDelete }: {
  properties: Property[];
  onAdd: () => void;
  onEdit: (p: Property) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-white/60">{properties.length} properties listed</p>
        <GlassButton onClick={onAdd} size="sm">
          <span className="flex items-center gap-2"><Plus size={16} /> Add Property</span>
        </GlassButton>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <GlassCard key={p.id} className="overflow-hidden">
            <div className="relative aspect-video overflow-hidden">
              <img
                src={p.image_urls?.[0] || 'https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&w=600'}
                alt={p.name}
                className="h-full w-full object-cover"
              />
              {p.video_url && (
                <span className="glass-dark absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] text-white/80">
                  <Video size={10} /> Video
                </span>
              )}
              <div className="absolute right-2 top-2">
                {p.available ? (
                  <span className="glass rounded-full px-2 py-1 text-[10px] font-medium text-green-300 ring-1 ring-green-400/30">Available</span>
                ) : (
                  <span className="glass-dark rounded-full px-2 py-1 text-[10px] font-medium text-white/50">Booked</span>
                )}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display text-sm font-semibold text-white">{p.name}</h3>
              <p className="mt-0.5 text-xs text-white/50">{p.area} • {p.property_type}</p>
              <p className="mt-1 text-sm font-bold text-white">{p.price.toLocaleString()} TZS/mo</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => onEdit(p)}
                  className="sheen-sweep glass-button-accent-soft flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs text-white"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="glass-dark flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs text-red-300 transition-all hover:bg-red-500/20"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

// --- Bookings Tab ---

function BookingsTab({ bookings, onStatus, onDelete }: {
  bookings: (Booking & { properties?: { name: string } | null })[];
  onStatus: (id: string, status: string, propertyId: string | null) => void;
  onDelete: (id: string) => void;
}) {
  const statusConfig: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
    pending: { icon: Clock, color: 'text-amber-300', bg: 'ring-amber-400/30' },
    approved: { icon: CheckCircle2, color: 'text-green-300', bg: 'ring-green-400/30' },
    rejected: { icon: XCircle, color: 'text-red-300', bg: 'ring-red-400/30' },
  };

  if (bookings.length === 0) {
    return (
      <GlassCard className="p-12 text-center">
        <CalendarCheck size={48} className="mx-auto text-white/30" />
        <p className="mt-4 text-white/50">No booking requests yet</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((b) => {
        const cfg = statusConfig[b.status] || statusConfig.pending;
        const StatusIcon = cfg.icon;
        return (
          <GlassCard key={b.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm font-semibold text-white">{b.guest_name}</h3>
                  <span className={`glass flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.color} ring-1 ${cfg.bg}`}>
                    <StatusIcon size={10} /> {b.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/50">
                  {b.properties?.name || 'Property removed'} • {b.guest_phone}
                </p>
                {(b.check_in || b.check_out) && (
                  <p className="mt-0.5 text-xs text-white/40">
                    {b.check_in || '?'} → {b.check_out || '?'}
                  </p>
                )}
                {b.message && <p className="mt-1 text-xs text-white/40">"{b.message}"</p>}
              </div>
              <div className="flex gap-2">
                {b.status === 'pending' && (
                  <>
                    <button onClick={() => onStatus(b.id, 'approved', b.property_id)} className="sheen-sweep glass-button-accent-soft flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-white">
                      <CheckCircle2 size={14} /> Approve
                    </button>
                    <button onClick={() => onStatus(b.id, 'rejected', b.property_id)} className="glass-dark flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-red-300">
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                )}
                {b.status === 'approved' && (
                  <button onClick={() => onStatus(b.id, 'rejected', b.property_id)} className="glass-dark flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-white/70">
                    <XCircle size={14} /> Cancel booking
                  </button>
                )}
                <button onClick={() => onDelete(b.id)} className="glass-dark flex items-center justify-center rounded-lg px-2.5 py-1.5 text-xs text-red-300 hover:bg-red-500/20">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}

// --- Settings Tab ---

function SettingsTab({ settings, onSave }: { settings: SiteSettings | null; onSave: () => void }) {
  const [logoUrl, setLogoUrl] = useState(settings?.logo_url || '');
  const [backgroundUrl, setBackgroundUrl] = useState(settings?.background_url || '');
  const [heroTagline, setHeroTagline] = useState(settings?.hero_tagline || '');
  const [aboutText, setAboutText] = useState(settings?.about_text || '');
  const [contactPhone, setContactPhone] = useState(settings?.contact_phone || '+255693910992');
  const [contactWhatsapp, setContactWhatsapp] = useState(settings?.contact_whatsapp || 'https://wa.me/255693910992');
  const [showcaseImages, setShowcaseImages] = useState<string[]>(settings?.showcase_images || []);
  const [showcaseVideoUrl, setShowcaseVideoUrl] = useState(settings?.showcase_video_url || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingShowcase, setUploadingShowcase] = useState(false);
  const [uploadingShowcaseVideo, setUploadingShowcaseVideo] = useState(false);

  useEffect(() => {
    if (settings) {
      setLogoUrl(settings.logo_url || '');
      setBackgroundUrl(settings.background_url || '');
      setHeroTagline(settings.hero_tagline || '');
      setAboutText(settings.about_text || '');
      setContactPhone(settings.contact_phone || '+255693910992');
      setContactWhatsapp(settings.contact_whatsapp || 'https://wa.me/255693910992');
      setShowcaseImages(settings.showcase_images || []);
      setShowcaseVideoUrl(settings.showcase_video_url || '');
    }
  }, [settings]);

  const handleShowcaseUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingShowcase(true);
    try {
      const uploaded = await Promise.all(Array.from(files).map((f) => uploadMedia(f, 'showcase')));
      setShowcaseImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      console.error('Showcase upload error:', err);
    } finally {
      setUploadingShowcase(false);
    }
  };

  const handleShowcaseVideoUpload = async (file: File | null) => {
    if (!file) return;
    setUploadingShowcaseVideo(true);
    try {
      const url = await uploadMedia(file, 'showcase');
      setShowcaseVideoUrl(url);
    } catch (err) {
      console.error('Showcase video upload error:', err);
    } finally {
      setUploadingShowcaseVideo(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase.from('site_settings').upsert({
        id: 1,
        logo_url: logoUrl || null,
        background_url: backgroundUrl || null,
        hero_tagline: heroTagline || null,
        about_text: aboutText || null,
        contact_phone: contactPhone,
        contact_whatsapp: contactWhatsapp,
        showcase_images: showcaseImages.length > 0 ? showcaseImages : null,
        showcase_video_url: showcaseVideoUrl || null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSave();
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-4">
      <GlassCard className="p-5">
        <h3 className="mb-4 font-display text-lg font-semibold text-white">Site Content</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Logo Image URL</label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
              className="glass w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-maroon-500/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Background Image URL</label>
            <input
              type="text"
              value={backgroundUrl}
              onChange={(e) => setBackgroundUrl(e.target.value)}
              placeholder="https://..."
              className="glass w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-maroon-500/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Hero Tagline</label>
            <textarea
              value={heroTagline}
              onChange={(e) => setHeroTagline(e.target.value)}
              rows={2}
              className="glass w-full resize-none rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-maroon-500/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">About Us Text</label>
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              rows={5}
              className="glass w-full resize-none rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-maroon-500/50"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">Contact Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="glass w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-maroon-500/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">WhatsApp Link</label>
              <input
                type="text"
                value={contactWhatsapp}
                onChange={(e) => setContactWhatsapp(e.target.value)}
                className="glass w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-maroon-500/50"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h3 className="mb-1 font-display text-lg font-semibold text-white">Homepage Showcase</h3>
        <p className="mb-4 text-xs text-white/50">Photos (and an optional video) shown in the "glimpse of what's waiting for you" section on the homepage.</p>

        <div className="mb-4 flex flex-wrap gap-3">
          {showcaseImages.map((url, i) => (
            <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-lg">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() => setShowcaseImages((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="glass-dark flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg text-white/60 hover:text-white">
            {uploadingShowcase ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
            <span className="text-[9px]">Add photo</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleShowcaseUpload(e.target.files)} />
          </label>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/60">Showcase Video (optional)</label>
          {showcaseVideoUrl ? (
            <div className="flex items-center gap-2">
              <video src={showcaseVideoUrl} className="h-16 w-24 rounded-lg object-cover" muted />
              <button onClick={() => setShowcaseVideoUrl('')} className="glass-dark rounded-lg px-3 py-1.5 text-xs text-red-300">Remove</button>
            </div>
          ) : (
            <label className="glass-dark flex w-fit cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-xs text-white/70 hover:text-white">
              {uploadingShowcaseVideo ? <Loader2 size={14} className="animate-spin" /> : <Video size={14} />}
              Upload video
              <input type="file" accept="video/*" className="hidden" onChange={(e) => handleShowcaseVideoUpload(e.target.files?.[0] || null)} />
            </label>
          )}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <GlassButton onClick={handleSave} disabled={saving}>
            <span className="flex items-center gap-2"><Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}</span>
          </GlassButton>
          {saved && <span className="text-sm text-green-300">Saved!</span>}
        </div>
      </GlassCard>
    </div>
  );
}

// --- Property Form Modal ---

function PropertyFormModal({ open, property, onClose, onSaved }: {
  open: boolean;
  property: Property | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('Mikocheni');
  const [propertyType, setPropertyType] = useState('Studio');
  const [bedrooms, setBedrooms] = useState('0');
  const [bathrooms, setBathrooms] = useState('1');
  const [amenities, setAmenities] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [available, setAvailable] = useState(true);
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (property) {
      setName(property.name);
      setDescription(property.description || '');
      setPrice(String(property.price));
      setArea(property.area);
      setPropertyType(property.property_type);
      setBedrooms(String(property.bedrooms));
      setBathrooms(String(property.bathrooms));
      setAmenities(property.amenities?.join(', ') || '');
      setImageUrls(property.image_urls || []);
      setVideoUrl(property.video_url || '');
      setAvailable(property.available);
      setLocation(property.location || '');
    } else {
      setName(''); setDescription(''); setPrice(''); setArea('Mikocheni');
      setPropertyType('Studio'); setBedrooms('0'); setBathrooms('1');
      setAmenities(''); setImageUrls([]); setVideoUrl(''); setAvailable(true); setLocation('');
    }
  }, [property, open]);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    try {
      const uploaded = await Promise.all(Array.from(files).map((f) => uploadMedia(f, 'properties')));
      setImageUrls((prev) => [...prev, ...uploaded]);
    } catch (err) {
      console.error('Image upload error:', err);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleVideoUpload = async (file: File | null) => {
    if (!file) return;
    setUploadingVideo(true);
    try {
      const url = await uploadMedia(file, 'properties');
      setVideoUrl(url);
    } catch (err) {
      console.error('Video upload error:', err);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSave = async () => {
    if (!name || !price) return;
    setSaving(true);
    const data = {
      name,
      description: description || null,
      price: parseFloat(price),
      area,
      property_type: propertyType,
      bedrooms: parseInt(bedrooms) || 0,
      bathrooms: parseInt(bathrooms) || 1,
      amenities: amenities.split(',').map(a => a.trim()).filter(Boolean),
      image_urls: imageUrls,
      video_url: videoUrl || null,
      available,
      location: location || null,
      updated_at: new Date().toISOString(),
    };

    try {
      if (property) {
        await supabase.from('properties').update(data).eq('id', property.id);
      } else {
        await supabase.from('properties').insert(data);
      }
      onSaved();
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <GlassModal open={open} onClose={onClose} className="max-w-2xl">
      <div className="p-6 sm:p-8">
        <h2 className="mb-5 font-display text-xl font-bold text-white">
          {property ? 'Edit Property' : 'Add New Property'}
        </h2>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/60">Property Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="glass w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-maroon-500/50" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-white/60">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              className="glass w-full resize-none rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-maroon-500/50" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/60">Price (TZS/mo) *</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                className="glass w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-maroon-500/50" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/60">Area</label>
              <select value={area} onChange={(e) => setArea(e.target.value)}
                className="glass w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none">
                {[...AREAS].map(a => <option key={a} value={a} className="bg-black">{a}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/60">Type</label>
              <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}
                className="glass w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none">
                {[...PROPERTY_TYPES].map(t => <option key={t} value={t} className="bg-black">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/60">Bedrooms</label>
              <input type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}
                className="glass w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-maroon-500/50" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/60">Bathrooms</label>
              <input type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)}
                className="glass w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-maroon-500/50" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-white/60">Location (specific address)</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
              className="glass w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-maroon-500/50" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-white/60">Amenities (comma-separated)</label>
            <input type="text" value={amenities} onChange={(e) => setAmenities(e.target.value)}
              placeholder="WiFi, Parking, Security, Air Conditioning"
              className="glass w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-maroon-500/50" />
          </div>

          {/* Photo upload */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Photos</label>
            <div className="flex flex-wrap gap-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="group relative h-16 w-16 overflow-hidden rounded-lg">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    onClick={() => setImageUrls((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              <label className="glass-dark flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg text-white/60 hover:text-white">
                {uploadingImages ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                <span className="text-[8px]">Add</span>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageUpload(e.target.files)} />
              </label>
            </div>
          </div>

          {/* Video upload */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Video (optional)</label>
            {videoUrl ? (
              <div className="flex items-center gap-2">
                <video src={videoUrl} className="h-14 w-24 rounded-lg object-cover" muted />
                <button onClick={() => setVideoUrl('')} className="glass-dark rounded-lg px-3 py-1.5 text-xs text-red-300">Remove</button>
              </div>
            ) : (
              <label className="glass-dark flex w-fit cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-xs text-white/70 hover:text-white">
                {uploadingVideo ? <Loader2 size={14} className="animate-spin" /> : <Video size={14} />}
                Upload video
                <input type="file" accept="video/*" className="hidden" onChange={(e) => handleVideoUpload(e.target.files?.[0] || null)} />
              </label>
            )}
          </div>

          <div>
            <label className="mb-1.5 flex cursor-pointer items-center gap-2 text-sm text-white/80">
              <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)}
                className="h-4 w-4 rounded accent-[#94000b]" />
              Available for rent
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <GlassButton variant="secondary" onClick={onClose} className="flex-1">Cancel</GlassButton>
            <GlassButton onClick={handleSave} disabled={saving || !name || !price} className="flex-1">
              {saving ? 'Saving...' : property ? 'Update' : 'Create'}
            </GlassButton>
          </div>
        </div>
      </div>
    </GlassModal>
  );
}