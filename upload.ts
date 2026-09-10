import { supabase } from './supabase';

/**
 * Uploads a file (image or video) to the "property-media" Supabase Storage
 * bucket and returns its public URL. Used by the admin panel for direct
 * device uploads instead of pasting external image URLs.
 */
export async function uploadMedia(file: File, folder: 'properties' | 'showcase' = 'properties'): Promise<string> {
  const ext = file.name.split('.').pop() || 'bin';
  const safeExt = ext.replace(/[^a-zA-Z0-9]/g, '');
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`;

  const { error } = await supabase.storage.from('property-media').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from('property-media').getPublicUrl(path);
  return data.publicUrl;
}