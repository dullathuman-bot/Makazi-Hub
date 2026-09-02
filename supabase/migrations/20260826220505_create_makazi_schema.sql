/*
# Makazi Hub — Initial Schema

1. New Tables
- `properties`: Rental listings (houses/rooms) with photos, price, area, availability, amenities.
- `bookings`: Booking requests submitted by visitors (name, phone, property, dates, status).
- `site_settings`: Single-row table for admin-editable site content (logo URL, background image URL, about text, hero tagline).

2. Security
- RLS enabled on all tables.
- Public (anon) can READ properties and site_settings.
- Public (anon) can CREATE bookings (submit a booking request).
- Only authenticated (admin) can INSERT/UPDATE/DELETE properties and site_settings.
- Only authenticated (admin) can READ/UPDATE/DELETE bookings (approve/reject requests).
*/

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  area text NOT NULL,
  property_type text NOT NULL DEFAULT 'Studio',
  bedrooms integer NOT NULL DEFAULT 0,
  bathrooms integer NOT NULL DEFAULT 1,
  amenities text[] DEFAULT '{}',
  image_urls text[] DEFAULT '{}',
  available boolean NOT NULL DEFAULT true,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_properties" ON properties;
CREATE POLICY "public_read_properties" ON properties FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_properties" ON properties;
CREATE POLICY "admin_insert_properties" ON properties FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_properties" ON properties;
CREATE POLICY "admin_update_properties" ON properties FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_properties" ON properties;
CREATE POLICY "admin_delete_properties" ON properties FOR DELETE
  TO authenticated USING (true);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  guest_phone text NOT NULL,
  check_in date,
  check_out date,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_create_bookings" ON bookings;
CREATE POLICY "public_create_bookings" ON bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_bookings" ON bookings;
CREATE POLICY "admin_read_bookings" ON bookings FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_bookings" ON bookings;
CREATE POLICY "admin_update_bookings" ON bookings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_bookings" ON bookings;
CREATE POLICY "admin_delete_bookings" ON bookings FOR DELETE
  TO authenticated USING (true);

-- Site settings table (single-row)
CREATE TABLE IF NOT EXISTS site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  logo_url text,
  background_url text,
  hero_tagline text,
  about_text text,
  contact_phone text DEFAULT '+255693910992',
  contact_whatsapp text DEFAULT 'https://wa.me/255693910992',
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_settings" ON site_settings;
CREATE POLICY "public_read_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_settings" ON site_settings;
CREATE POLICY "admin_insert_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_settings" ON site_settings;
CREATE POLICY "admin_update_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Seed initial site settings
INSERT INTO site_settings (id, logo_url, background_url, hero_tagline, about_text)
VALUES (
  1,
  NULL,
  'https://images.pexels.com/photos/29560257/pexels-photo-29560257.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'Find your perfect home in Dar es Salaam — quality rentals, trusted landlords, effortless booking.',
  'Makazi Hub is dedicated to helping people find reliable, quality housing in Dar es Salaam. Our mission is to make house hunting simple, transparent, and stress-free — whether you are looking for a cozy studio, a family apartment, or a full house. We connect trusted landlords with tenants who deserve the best.'
) ON CONFLICT (id) DO NOTHING;

-- Seed sample properties
INSERT INTO properties (name, description, price, area, property_type, bedrooms, bathrooms, amenities, image_urls, available, location) VALUES
(
  'Mikocheni Modern Studio',
  'A sleek, fully furnished studio apartment in the heart of Mikocheni. Perfect for young professionals, with fast WiFi, secure parking, and 24/7 security.',
  450000, 'Mikocheni', 'Studio', 0, 1,
  ARRAY['WiFi', 'Parking', 'Security', 'Furnished', 'Air Conditioning'],
  ARRAY['https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/6920439/pexels-photo-6920439.jpeg?auto=compress&cs=tinysrgb&w=800'],
  true, 'Mikocheni B, near Mlimani City'
),
(
  'Mbezi Beachfront Apartment',
  'Stunning 2-bedroom apartment with ocean views. Spacious living area, modern kitchen, and a balcony overlooking the coastline.',
  850000, 'Mbezi', '2 Bedroom', 2, 2,
  ARRAY['WiFi', 'Parking', 'Ocean View', 'Balcony', 'Air Conditioning', 'Gym'],
  ARRAY['https://images.pexels.com/photos/7587828/pexels-photo-7587828.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/8089172/pexels-photo-8089172.jpeg?auto=compress&cs=tinysrgb&w=800'],
  true, 'Mbezi Beach, near Slipway'
),
(
  'Masaki Luxury Villa',
  'An exquisite 4-bedroom villa in upscale Masaki. Private garden, swimming pool, and servant quarters. The epitome of luxury living in Dar es Salaam.',
  2500000, 'Masaki', 'Whole House', 4, 4,
  ARRAY['WiFi', 'Parking', 'Pool', 'Garden', 'Security', 'Air Conditioning', 'Furnished'],
  ARRAY['https://images.pexels.com/photos/12558848/pexels-photo-12558848.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/13600836/pexels-photo-13600836.jpeg?auto=compress&cs=tinysrgb&w=800'],
  true, 'Masaki, near Oysterbay'
),
(
  'Sinza Cozy 1-Bedroom',
  'A comfortable and affordable 1-bedroom apartment in Sinza. Close to shops, restaurants, and public transport. Ideal for singles or couples.',
  350000, 'Sinza', '1 Bedroom', 1, 1,
  ARRAY['WiFi', 'Parking', 'Furnished'],
  ARRAY['https://images.pexels.com/photos/7546648/pexels-photo-7546648.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/7173666/pexels-photo-7173666.jpeg?auto=compress&cs=tinysrgb&w=800'],
  true, 'Sinza Mori, near Sinza Stadium'
),
(
  'Kinondoni Family House',
  'Spacious 3-bedroom house perfect for families. Large compound, secure neighborhood, and close to schools and shopping centers.',
  1200000, 'Kinondoni', '3 Bedroom', 3, 2,
  ARRAY['WiFi', 'Parking', 'Garden', 'Security', 'Furnished'],
  ARRAY['https://images.pexels.com/photos/35361410/pexels-photo-35361410.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/19219055/pexels-photo-19219055.jpeg?auto=compress&cs=tinysrgb&w=800'],
  false, 'Kinondoni, near Mwananyamala'
),
(
  'Mikocheni Penthouse Suite',
  'A luxurious penthouse with panoramic city views. Floor-to-ceiling windows, designer interiors, and a private rooftop terrace.',
  1500000, 'Mikocheni', '2 Bedroom', 2, 2,
  ARRAY['WiFi', 'Parking', 'Rooftop Terrace', 'Air Conditioning', 'Gym', 'Security', 'Furnished'],
  ARRAY['https://images.pexels.com/photos/27164969/pexels-photo-27164969.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/6758284/pexels-photo-6758284.jpeg?auto=compress&cs=tinysrgb&w=800'],
  true, 'Mikocheni A, near Bagamoyo Road'
),
(
  'Mbezi Hillside Townhouse',
  'Modern 3-bedroom townhouse on Mbezi Hill. Open-plan living, fitted kitchen, and a small private garden. Peaceful and secure.',
  950000, 'Mbezi', '3 Bedroom', 3, 2,
  ARRAY['WiFi', 'Parking', 'Garden', 'Security', 'Furnished'],
  ARRAY['https://images.pexels.com/photos/12558958/pexels-photo-12558958.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/34277690/pexels-photo-34277690.jpeg?auto=compress&cs=tinysrgb&w=800'],
  true, 'Mbezi Luis, near Mlimani Shopping Centre'
),
(
  'Masaki Executive Studio',
  'A premium studio in the heart of Masaki. Walking distance to restaurants, gyms, and the beach. Includes all utilities.',
  550000, 'Masaki', 'Studio', 0, 1,
  ARRAY['WiFi', 'Parking', 'Air Conditioning', 'Furnished', 'Gym'],
  ARRAY['https://images.pexels.com/photos/6920439/pexels-photo-6920439.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/8089172/pexels-photo-8089172.jpeg?auto=compress&cs=tinysrgb&w=800'],
  false, 'Masaki, near Haile Selassie Road'
)
ON CONFLICT DO NOTHING;
