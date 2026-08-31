import slugify from 'slugify';

export function slugifyText(text) {
  return slugify(String(text || ''), { lower: true, strict: true, trim: true });
}

// Generates a unique slug for a table by appending -2, -3, etc. when needed.
// `checkExists(slug, excludeId)` must return true if the slug is already taken.
export async function generateUniqueSlug(baseText, checkExists, excludeId = null) {
  const base = slugifyText(baseText) || 'item';
  let slug = base;
  let counter = 2;
  while (await checkExists(slug, excludeId)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}
