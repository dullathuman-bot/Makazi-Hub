import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, CalendarDays, CheckCircle2, X, MapPin, Bed, Bath, Wifi, Car, ShieldCheck, AirVent, Trees, Dumbbell, Waves, Home } from 'lucide-react';
import { GlassModal } from '@/components/ui/GlassModal';
import { GlassButton } from '@/components/ui/GlassButton';
import { supabase } from '@/lib/supabase';
import type { Property } from '@/lib/types';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
}

const amenityIcons: Record<string, typeof Wifi> = {
  'WiFi': Wifi,
  'Parking': Car,
  'Security': ShieldCheck,
  'Air Conditioning': AirVent,
  'Garden': Trees,
  'Gym': Dumbbell,
  'Ocean View': Waves,
  'Pool': Waves,
  'Balcony': Trees,
  'Rooftop Terrace': Trees,
  'Furnished': CheckCircle2,
};

export function PropertyDetailModal({ property, onClose }: PropertyDetailModalProps) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [bookingForm, setBookingForm] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const open = property !== null;

  const handleSubmitBooking = async () => {
    if (!property || !guestName || !guestPhone) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('bookings').insert({
        property_id: property.id,
        guest_name: guestName,
        guest_phone: guestPhone,
        check_in: checkIn || null,
        check_out: checkOut || null,
        message: message || null,
        status: 'pending',
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('Booking error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setBookingForm(false);
    setSubmitted(false);
    setGuestName('');
    setGuestPhone('');
    setCheckIn('');
    setCheckOut('');
    setMessage('');
    setGalleryIndex(0);
    onClose();
  };

  return (
    <GlassModal open={open} onClose={handleClose} className="max-w-3xl">
      {property && (
        <div className="p-6 sm:p-8">
          {/* Gallery */}
          <div className="relative mb-6 overflow-hidden rounded-2xl">
            <div className="aspect-[16/10] w-full">
              <img
                src={property.image_urls?.[galleryIndex] || property.image_urls?.[0] || 'https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                alt={property.name}
                className="h-full w-full object-cover"
              />
            </div>
            {property.image_urls && property.image_urls.length > 1 && (
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                {property.image_urls.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === galleryIndex ? 'w-6 bg-sand' : 'w-2 bg-sand/40'
                    }`}
                  />
                ))}
              </div>
            )}
            {/* Status badge */}
            <div className="absolute right-3 top-3">
              {property.available ? (
                <span className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-green-300 ring-1 ring-green-400/30"
                  style={{ boxShadow: '0 0 16px rgba(74, 222, 128, 0.25)' }}
                >
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  Available
                </span>
              ) : (
                <span className="glass-dark flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-sand/50 ring-1 ring-sand/10">
                  <X size={12} />
                  Not Available
                </span>
              )}
            </div>
          </div>

          {/* Title + price */}
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-sand">{property.name}</h2>
              <div className="mt-1 flex items-center gap-1 text-sm text-sand/60">
                <MapPin size={14} />
                {property.location || property.area}
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl font-bold text-sand">{formatPrice(property.price)}</div>
              <div className="text-xs text-sand/50">per month</div>
            </div>
          </div>

          {/* Key specs */}
          <div className="mb-5 flex gap-3">
            <div className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-sand/80">
              <Bed size={16} /> {property.bedrooms} Bed
            </div>
            <div className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-sand/80">
              <Bath size={16} /> {property.bathrooms} Bath
            </div>
            <div className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-sand/80">
              <Home size={16} /> {property.property_type}
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <p className="mb-5 text-sm leading-relaxed text-sand/70">{property.description}</p>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 font-display text-sm font-semibold text-sand">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || CheckCircle2;
                  return (
                    <span key={amenity} className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-sand/80">
                      <Icon size={14} />
                      {amenity}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="submitted"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass glass-glow flex flex-col items-center gap-3 rounded-2xl p-8 text-center"
              >
                <CheckCircle2 size={48} className="text-green-400" />
                <h3 className="font-display text-lg font-semibold text-sand">Booking Request Sent!</h3>
                <p className="text-sm text-sand/60">
                  We've received your request. The owner will contact you shortly to confirm.
                </p>
                <GlassButton variant="secondary" onClick={handleClose}>Close</GlassButton>
              </motion.div>
            ) : bookingForm ? (
              <motion.div
                key="booking-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass rounded-2xl p-5"
              >
                <h3 className="mb-4 font-display text-lg font-semibold text-sand">Request a Booking</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your full name *"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="glass w-full rounded-xl px-4 py-3 text-sm text-sand placeholder:text-sand/40 focus:outline-none focus:ring-1 focus:ring-sand/30"
                  />
                  <input
                    type="tel"
                    placeholder="Your phone number *"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="glass w-full rounded-xl px-4 py-3 text-sm text-sand placeholder:text-sand/40 focus:outline-none focus:ring-1 focus:ring-sand/30"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs text-sand/50">Check In</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="glass w-full rounded-xl px-3 py-2.5 text-sm text-sand focus:outline-none focus:ring-1 focus:ring-sand/30"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-sand/50">Check Out</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="glass w-full rounded-xl px-3 py-2.5 text-sm text-sand focus:outline-none focus:ring-1 focus:ring-sand/30"
                      />
                    </div>
                  </div>
                  <textarea
                    placeholder="Message (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={2}
                    className="glass w-full resize-none rounded-xl px-4 py-3 text-sm text-sand placeholder:text-sand/40 focus:outline-none focus:ring-1 focus:ring-sand/30"
                  />
                  <div className="flex gap-3">
                    <GlassButton
                      variant="secondary"
                      onClick={() => setBookingForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </GlassButton>
                    <GlassButton
                      onClick={handleSubmitBooking}
                      disabled={!guestName || !guestPhone || submitting}
                      className="flex-1"
                    >
                      {submitting ? 'Sending...' : 'Submit Request'}
                    </GlassButton>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 gap-3 sm:grid-cols-3"
              >
                <a href="tel:+255693910992" className="block">
                  <GlassButton variant="secondary" className="w-full">
                    <span className="flex items-center justify-center gap-2">
                      <Phone size={18} /> Call Now
                    </span>
                  </GlassButton>
                </a>
                <a href="https://wa.me/255693910992" target="_blank" rel="noopener noreferrer" className="block">
                  <GlassButton variant="secondary" className="w-full">
                    <span className="flex items-center justify-center gap-2">
                      <MessageCircle size={18} /> WhatsApp
                    </span>
                  </GlassButton>
                </a>
                <GlassButton
                  onClick={() => setBookingForm(true)}
                  disabled={!property.available}
                  className="w-full"
                >
                  <span className="flex items-center justify-center gap-2">
                    <CalendarDays size={18} /> Book / Pay Now
                  </span>
                </GlassButton>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Payment note */}
          {!bookingForm && !submitted && (
            <p className="mt-4 text-center text-xs text-sand/40">
              Online payment (M-Pesa, Tigo Pesa, Airtel Money) coming soon. For now, booking is confirmed via phone or WhatsApp.
            </p>
          )}
        </div>
      )}
    </GlassModal>
  );
}

function formatPrice(price: number): string {
  return `${price.toLocaleString()} TZS`;
}
