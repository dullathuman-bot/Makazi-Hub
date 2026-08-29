import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Bed, Bath, CheckCircle2, XCircle, SlidersHorizontal } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { PropertyDetailModal } from '@/components/PropertyDetailModal';
import type { Property } from '@/lib/types';
import { AREAS, PROPERTY_TYPES } from '@/lib/types';

interface SearchPageProps {
  properties: Property[];
  loading: boolean;
}

export function SearchPage({ properties, loading }: SearchPageProps) {
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.area.toLowerCase().includes(search.toLowerCase())) return false;
      if (areaFilter !== 'all' && p.area !== areaFilter) return false;
      if (typeFilter !== 'all' && p.property_type !== typeFilter) return false;
      if (availableOnly && !p.available) return false;
      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        if (p.price < min || (max && p.price > max)) return false;
      }
      return true;
    });
  }, [properties, search, areaFilter, typeFilter, priceRange, availableOnly]);

  return (
    <div className="min-h-screen px-4 pb-32 pt-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-7xl"
      >
        <h1 className="font-display text-3xl font-bold text-sand text-glow sm:text-4xl">
          Search Makazi
        </h1>
        <p className="mt-1 text-sm text-sand/60">Browse available houses and rooms across Dar es Salaam</p>

        {/* Search bar */}
        <div className="mt-6 flex gap-3">
          <div className="glass flex flex-1 items-center gap-2 rounded-full px-5 py-3">
            <Search size={18} className="text-sand/50" />
            <input
              type="text"
              placeholder="Search by name or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sand placeholder:text-sand/40 focus:outline-none"
              onFocus={(e) => (e.currentTarget.parentElement!.style.boxShadow = '0 0 0 1px rgba(120, 1, 22, 0.5), 0 0 16px rgba(120, 1, 22, 0.2)')}
              onBlur={(e) => (e.currentTarget.parentElement!.style.boxShadow = '')}
            />
          </div>
          <GlassButton
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-full"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">Filters</span>
            </span>
          </GlassButton>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <GlassCard className="p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Area filter */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-sand/60">Area</label>
                  <select
                    value={areaFilter}
                    onChange={(e) => setAreaFilter(e.target.value)}
                    className="glass w-full rounded-xl px-3 py-2.5 text-sm text-sand focus:outline-none"
                  >
                    <option value="all" className="bg-cyprus-600">All Areas</option>
                    {[...AREAS].map((a) => (
                      <option key={a} value={a} className="bg-cyprus-600">{a}</option>
                    ))}
                  </select>
                </div>

                {/* Property type filter */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-sand/60">Property Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="glass w-full rounded-xl px-3 py-2.5 text-sm text-sand focus:outline-none"
                  >
                    <option value="all" className="bg-cyprus-600">All Types</option>
                    {[...PROPERTY_TYPES].map((t) => (
                      <option key={t} value={t} className="bg-cyprus-600">{t}</option>
                    ))}
                  </select>
                </div>

                {/* Price range filter */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-sand/60">Price Range (TZS/mo)</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="glass w-full rounded-xl px-3 py-2.5 text-sm text-sand focus:outline-none"
                  >
                    <option value="all" className="bg-cyprus-600">Any Price</option>
                    <option value="0-500000" className="bg-cyprus-600">Up to 500K</option>
                    <option value="500000-1000000" className="bg-cyprus-600">500K – 1M</option>
                    <option value="1000000-2000000" className="bg-cyprus-600">1M – 2M</option>
                    <option value="2000000-0" className="bg-cyprus-600">2M+</option>
                  </select>
                </div>

                {/* Availability filter */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-sand/60">Availability</label>
                  <button
                    onClick={() => setAvailableOnly(!availableOnly)}
                    className={`glass flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all ${
                      availableOnly ? 'text-sand ring-1 ring-maroon-500/50' : 'text-sand/60'
                    }`}
                  >
                    {availableOnly ? 'Available Only' : 'All Properties'}
                    {availableOnly ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </motion.div>

      {/* Property grid */}
      <div className="mx-auto mt-8 max-w-7xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-sand/30 border-t-sand" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-sand/50">
            <p className="text-lg">No properties match your filters</p>
            <p className="mt-1 text-sm">Try adjusting your search criteria</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-4"
          >
            {filtered.map((property, i) => (
              <PropertyCard
                key={property.id}
                property={property}
                index={i}
                onClick={() => setSelectedProperty(property)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Detail modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </div>
  );
}

function PropertyCard({ property, index, onClick }: { property: Property; index: number; onClick: () => void }) {
  const primaryImage = property.image_urls?.[0] || 'https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
    >
      <GlassCard
        glow={property.available}
        onClick={onClick}
        className={`group overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
          !property.available ? 'opacity-60' : ''
        }`}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
          <img
            src={primaryImage}
            alt={property.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Status badge */}
          <div className="absolute left-2 top-2">
            {property.available ? (
              <span className="glass flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium text-green-300 ring-1 ring-green-400/30"
                style={{ boxShadow: '0 0 12px rgba(74, 222, 128, 0.2)' }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                Available
              </span>
            ) : (
              <span className="glass-dark flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium text-sand/50 ring-1 ring-sand/10">
                <XCircle size={10} />
                Not Available
              </span>
            )}
          </div>
          {/* Price badge */}
          <div className="absolute bottom-2 right-2">
            <span className="glass-dark rounded-full px-2 py-1 text-[10px] font-semibold text-sand">
              {formatPrice(property.price)}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-2.5">
          <h3 className="truncate font-display text-xs font-semibold text-sand sm:text-sm">{property.name}</h3>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-sand/50">
            <MapPin size={10} />
            <span className="truncate">{property.area}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[10px] text-sand/50">
            <span className="flex items-center gap-0.5"><Bed size={10} />{property.bedrooms}</span>
            <span className="flex items-center gap-0.5"><Bath size={10} />{property.bathrooms}</span>
            <span className="truncate">{property.property_type}</span>
          </div>
        </div>

        {/* View details button */}
        <div className="px-2.5 pb-2.5">
          <button
            className="glass-button-accent w-full rounded-xl py-2 text-[10px] font-medium text-white transition-all duration-200 ease-out sm:text-xs"
            style={{ transformStyle: 'preserve-3d' }}
            onMouseMove={(e) => {
              const target = e.currentTarget;
              const rect = target.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;
              const rotateY = (x / rect.width) * 8;
              const rotateX = -(y / rect.height) * 8;
              target.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
            }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
          >
            View Details
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function formatPrice(price: number): string {
  if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M TZS`;
  return `${(price / 1000).toFixed(0)}K TZS`;
}
