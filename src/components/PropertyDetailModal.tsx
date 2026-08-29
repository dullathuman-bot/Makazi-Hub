import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, CalendarDays, CheckCircle2, X, MapPin, Bed, Bath, Wifi, Car, ShieldCheck, AirVent, Trees, Dumbbell, Waves, Home } from 'lucide-react';
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

const MONTHS_OPTIONS = [1, 2, 3, 6, 12];

export function PropertyDetailModal({ property, onClose }: PropertyDetailModalProps) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [bookingForm, setBookingForm] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [monthsToPay, setMonthsToPay] = useState(1);
  const [moveInDate, setMoveInDate] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const open = property !== null;
  const images = property?.image_urls && property.image_urls.length > 0
    ? property.image_urls
    : ['https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&w=1200'];

  // Auto-advancing slideshow
  useEffect(() => {
    if (!open || images.length <= 1) return;
    const t = setInterval(() => {
      setGalleryIndex((i) => (i + 1) % images.length);
    }, 4500);
    return () => clearInterval(t);
  }, [open, images.length]);

  useEffect(() => {
    setGalleryIndex(0);
  }, [property?.id]);

  const handleSubmitBooking = async () => {
    if (!property || !guestName || !guestPhone) return;
    setSubmitting(true);
    try {
      const noteParts = [
        `Months to pay: ${monthsToPay}`,
        currentLocation ? `Current location: ${currentLocation}` : null,
      ].filter(Boolean);
      const { error } = await supabase.from('bookings').insert({
        property_id: property.id,
        guest_name: guestName,
        guest_phone: guestPhone,
        check_in: moveInDate || null,
        message: noteParts.join(' | '),
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
    setMonthsToPay(1);
    setMoveInDate('');
    setCurrentLocation('');
    setGalleryIndex(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && property && (
        <>
          {/* Backdrop — liquid blur over the grid behind */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md"
          />

          {/* Side panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 280 }}
            className="border-beam fixed right-0 top-0 z-50 h-full w-full overflow-y-auto scrollbar-hide rounded-l-3xl sm:w-[440px] lg:w-[520px]"
          >
            <div className="liquid-black relative min-h-full rounded-l-3xl">
              <button
                onClick={handleClose}
                className="sheen-sweep glass-dark absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:text-white"
              >
                <X size={18} />
              </button>

              {/* Breathing main image + thumbnails */}
              <div className="relative">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-tl-3xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={galleryIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7 }}
                      className="absolute inset-0 animate-breathe"
                    >
                      <img
                        src={images[galleryIndex]}
                        alt={property.name}
                        className="h-full w-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  {/* Status badge */}
                  <div className="absolute right-16 top-4">
                    {property.available ? (
                      <span className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-green-300 ring-1 ring-green-400/30">
                        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                        Available
                      </span>
                    ) : (
                      <span className="glass-dark flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white/50 ring-1 ring-white/10">
                        <X size={12} /> Not Available
                      </span>
                    )}
                  </div>

                  {/* Vertical thumbnail strip */}
                  {images.length > 1 && (
                    <div className="absolute left-3 top-3 flex max-h-[85%] flex-col gap-2 overflow-y-auto scrollbar-hide">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setGalleryIndex(i)}
                          className={`h-11 w-11 shrink-0 overflow-hidden rounded-lg transition-all ${
                            i === galleryIndex ? 'ring-2 ring-white' : 'opacity-50 ring-1 ring-white/20 hover:opacity-80'
                          }`}
                        >
                          <img src={img} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Booking form overlay — appears over the breathing image, rest blurred */}
                <AnimatePresence>
                  {bookingForm && !submitted && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 p-4 backdrop-blur-lg"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="border-beam w-full max-w-xs rounded-2xl"
                      >
                        <div className="liquid-black max-h-[90%] overflow-y-auto rounded-2xl p-4">
                          <h3 className="mb-3 font-display text-sm font-semibold text-white">Request Booking</h3>
                          <div className="space-y-2.5">
                            <input
                              type="text"
                              placeholder="Full name *"
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                              className="glass w-full rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none"
                            />
                            <input
                              type="tel"
                              placeholder="Phone number *"
                              value={guestPhone}
                              onChange={(e) => setGuestPhone(e.target.value)}
                              className="glass w-full rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none"
                            />
                            <div>
                              <label className="mb-1 block text-[10px] text-white/50">Months to pay</label>
                              <select
                                value={monthsToPay}
                                onChange={(e) => setMonthsToPay(Number(e.target.value))}
                                className="glass w-full rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                              >
                                {MONTHS_OPTIONS.map((m) => (
                                  <option key={m} value={m} className="bg-black">{m} month{m > 1 ? 's' : ''}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] text-white/50">Expected move-in date</label>
                              <input
                                type="date"
                                value={moveInDate}
                                onChange={(e) => setMoveInDate(e.target.value)}
                                className="glass w-full rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="Where are you currently located?"
                              value={currentLocation}
                              onChange={(e) => setCurrentLocation(e.target.value)}
                              className="glass w-full rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none"
                            />
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => setBookingForm(false)}
                                className="glass-dark flex-1 rounded-lg py-2 text-xs text-white/70"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSubmitBooking}
                                disabled={!guestName || !guestPhone || submitting}
                                className="sheen-sweep flex-1 rounded-lg py-2 text-xs font-semibold text-white disabled:opacity-50"
                                style={{ background: '#005D58' }}
                              >
                                {submitting ? 'Sending...' : 'Send Booking'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/70 p-6 text-center backdrop-blur-lg"
                    >
                      <CheckCircle2 size={44} className="text-green-400" />
                      <h3 className="font-display text-base font-semibold text-white">Booking Request Sent!</h3>
                      <p className="text-xs text-white/60">The owner will contact you shortly to confirm.</p>
                      <button onClick={handleClose} className="glass-dark rounded-lg px-4 py-2 text-xs text-white">Close</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Details */}
              <div className={`p-5 transition-all duration-300 ${bookingForm ? 'pointer-events-none blur-sm' : ''}`}>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">{property.name}</h2>
                    <div className="mt-1 flex items-center gap-1 text-xs text-white/60">
                      <MapPin size={13} />
                      {property.location || property.area}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg font-bold text-white">{formatPrice(property.price)}</div>
                    <div className="text-[10px] text-white/50">per month</div>
                  </div>
                </div>

                <div className="mb-4 flex gap-2">
                  <div className="glass flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/80">
                    <Bed size={14} /> {property.bedrooms} Bed
                  </div>
                  <div className="glass flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/80">
                    <Bath size={14} /> {property.bathrooms} Bath
                  </div>
                  <div className="glass flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/80">
                    <Home size={14} /> {property.property_type}
                  </div>
                </div>

                {property.description && (
                  <p className="mb-4 text-xs leading-relaxed text-white/70">{property.description}</p>
                )}

                {property.amenities && property.amenities.length > 0 && (
                  <div className="mb-5">
                    <h3 className="mb-2 font-display text-xs font-semibold text-white">Amenities</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {property.amenities.map((amenity) => {
                        const Icon = amenityIcons[amenity] || CheckCircle2;
                        return (
                          <span key={amenity} className="glass flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] text-white/80">
                            <Icon size={12} />
                            {amenity}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <a href="tel:+255693910992" className="block">
                    <div className="sheen-sweep glass-dark flex w-full flex-col items-center gap-1 rounded-xl py-3 text-white/85">
                      <Phone size={16} />
                      <span className="text-[10px] font-medium">Call</span>
                    </div>
                  </a>
                  <a href="https://wa.me/255693910992" target="_blank" rel="noopener noreferrer" className="block">
                    <div className="sheen-sweep glass-dark flex w-full flex-col items-center gap-1 rounded-xl py-3 text-white/85">
                      <MessageCircle size={16} />
                      <span className="text-[10px] font-medium">WhatsApp</span>
                    </div>
                  </a>
                  <button
                    onClick={() => setBookingForm(true)}
                    disabled={!property.available}
                    className="sheen-sweep flex w-full flex-col items-center gap-1 rounded-xl py-3 text-white disabled:opacity-40"
                    style={{ background: '#005D58' }}
                  >
                    <CalendarDays size={16} />
                    <span className="text-[10px] font-medium">Book / Pay</span>
                  </button>
                </div>

                <p className="mt-4 text-center text-[10px] text-white/35">
                  Online payment (M-Pesa, Tigo Pesa, Airtel Money) coming soon. For now, booking is confirmed via phone or WhatsApp.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function formatPrice(price: number): string {
  return `${price.toLocaleString()} TZS`;
}