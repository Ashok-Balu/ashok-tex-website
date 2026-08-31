import express from 'express';
import { getAllCategories } from '../db/repositories/categoryRepo.js';
import { listProducts } from '../db/repositories/productRepo.js';

const router = express.Router();

const SITE_URL = process.env.SITE_URL || 'https://www.ashoktex.in';

const STATIC_PATHS = [
  '', 'about', 'collections', 'products', 'why-ashok-tex', 'testimonials',
  'request-quote', 'contact', 'privacy-policy', 'terms',
];

function escapeXml(value) {
  return String(value).replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[character]));
}

// Dynamically generated from the database — published products/active categories only.
router.get('/sitemap.xml', async (req, res) => {
  const categories = await getAllCategories({ includeInactive: false });
  const { data: products } = await listProducts({ published: true, limit: 100000 });

  const urls = [
    ...STATIC_PATHS.map((p) => `${SITE_URL}/${p}`),
    ...categories.map((c) => `${SITE_URL}/collections/${c.slug}`),
    ...products.map((p) => `${SITE_URL}/products/${p.slug}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${escapeXml(u.replace(/\/$/, '') || SITE_URL)}</loc></url>`).join('\n')}
</urlset>`;

  res.set({ 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=300, s-maxage=3600' });
  res.send(xml);
});

export default router;
