export interface Property {
  id: string;
  name: string;
  description: string | null;
  price: number;
  area: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  image_urls: string[];
  available: boolean;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  property_id: string | null;
  guest_name: string;
  guest_phone: string;
  check_in: string | null;
  check_out: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  logo_url: string | null;
  background_url: string | null;
  hero_tagline: string | null;
  about_text: string | null;
  contact_phone: string | null;
  contact_whatsapp: string | null;
}

export const PROPERTY_TYPES = ['Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom', 'Whole House'] as const;
export const AREAS = ['Mikocheni', 'Mbezi', 'Kinondoni', 'Masaki', 'Sinza'] as const;
