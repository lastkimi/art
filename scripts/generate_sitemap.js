import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate SEO-friendly URL slug from artist name
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate artist URL path
 */
function getArtistUrl(name) {
  const slug = generateSlug(name);
  return `/artist/${slug}`;
}

// Read styles data
const stylesPath = path.join(__dirname, '../public/data/styles.json');
const stylesData = JSON.parse(fs.readFileSync(stylesPath, 'utf-8'));

// Base URL - this should be updated to your actual domain
const baseUrl = process.env.SITE_URL || 'https://artstyle.example.com';

// Get current date in ISO format
const currentDate = new Date().toISOString().split('T')[0];

// Generate sitemap XML
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

// Add all artist pages
stylesData.styles.forEach((style) => {
  const artistUrl = getArtistUrl(style.name);
  sitemap += `
  <url>
    <loc>${baseUrl}${artistUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
});

sitemap += `
</urlset>`;

// Write sitemap to public directory
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap, 'utf-8');

console.log(`✅ Sitemap generated successfully!`);
console.log(`   Total URLs: ${stylesData.styles.length + 1} (${stylesData.styles.length} artists + 1 homepage)`);
console.log(`   Output: ${sitemapPath}`);
console.log(`   Base URL: ${baseUrl}`);
console.log(`\n💡 Tip: Update SITE_URL environment variable to set your actual domain:`);
console.log(`   SITE_URL=https://yourdomain.com node scripts/generate_sitemap.js`);
