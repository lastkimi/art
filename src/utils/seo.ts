/**
 * Generate SEO-friendly URL slug from artist name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate artist URL path
 */
export function getArtistUrl(name: string): string {
  const slug = generateSlug(name);
  return `/artist/${slug}`;
}
