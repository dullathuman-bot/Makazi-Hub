import { supabase } from './supabase';

/**
 * Resizes and compresses an image in the browser before upload — most
 * phone photos come in at 3-8 MB, far larger than needed for a web card
 * or gallery. Caps the longest side at 1600px and re-encodes as JPEG at
 * 78% quality, which typically brings files down to 150-400 KB with no
 * visible quality loss on screen. Non-image files (video, gifs, svgs)
 * pass through untouched.
 */
async function compressImage(file: File, maxDimension = 1600, quality = 0.78): Promise<File> {
  // Skip types where re-encoding could break animation or break vector
  // scaling, or where the file is already small enough to not bother.
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file;
  }
  if (file.size < 250 * 1024) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    );
    if (!blob) return file;

    // Never let compression accidentally produce a larger file.
    if (blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], newName, { type: 'image/jpeg' });
  } catch (err) {
    console.error('Image compression failed, uploading original:', err);
    return file;
  }
}

/**
 * Uploads a file (image or video) to the "property-media" Supabase Storage
 * bucket and returns its public URL. Used by the admin panel for direct
 * device uploads instead of pasting external image URLs. Images are
 * automatically compressed first (see compressImage above).
 */
export async function uploadMedia(file: File, folder: 'properties' | 'showcase' = 'properties'): Promise<string> {
  const toUpload = await compressImage(file);

  const ext = toUpload.name.split('.').pop() || 'bin';
  const safeExt = ext.replace(/[^a-zA-Z0-9]/g, '');
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`;

  const { error } = await supabase.storage.from('property-media').upload(path, toUpload, {
    // File names are unique per upload (timestamp + random), so it's safe
    // to let phones cache them for a full year instead of just an hour —
    // this is what PageSpeed's "efficient cache lifetimes" check wants.
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from('property-media').getPublicUrl(path);
  return data.publicUrl;
}