import bcrypt from 'bcryptjs';
import { query, withTransaction } from './database.js';
import { createCategory, getAllCategories } from './repositories/categoryRepo.js';
import { createProduct } from './repositories/productRepo.js';
import { createTestimonial, getAllTestimonials } from './repositories/testimonialRepo.js';
import { updateCompanySettings, getCompanySettings } from './repositories/settingsRepo.js';
import { createNavigationItem, getAllNavigationItems } from './repositories/settingsRepo.js';
import { createAdminUser, getAdminByUsername } from './repositories/adminRepo.js';

import { collections } from '../../src/data/collections.js';
import { products } from '../../src/data/products.js';
import { companyInfo } from '../../src/data/company.js';

const HOMEPAGE_SECTION_DEFAULTS = [
  { section_key: 'hero', title: 'Quality Fabrics. Trusted Manufacturing. Reliable Supply.', subtitle: 'Ashok Tex, Karur — Est. 1995', display_order: 0 },
  { section_key: 'trust_stats', title: 'Why Buyers Trust Ashok Tex', subtitle: '', display_order: 1 },
  { section_key: 'categories', title: 'Our Collections', subtitle: 'Fabric Catalogue', display_order: 2 },
  { section_key: 'featured_products', title: 'Featured Fabrics', subtitle: 'Curated Machine-Made Fabrics', display_order: 3 },
  { section_key: 'why_choose_us', title: 'Why Choose Ashok Tex', subtitle: '', display_order: 4 },
  { section_key: 'about', title: 'Three Decades of Weaving Excellence in Karur.', subtitle: 'Heritage & Capability', display_order: 5 },
  { section_key: 'testimonials', title: 'What Buyers Say', subtitle: 'Client Feedback', display_order: 6 },
  { section_key: 'enquiry', title: 'Request a Quote', subtitle: 'B2B Inquiry & Bulk Sourcing', display_order: 7 },
];

const NAV_DEFAULTS = [
  { label: 'Home', link: '/', display_order: 0 },
  { label: 'Products', link: '/products', display_order: 1 },
  { label: 'Collections', link: '/collections', display_order: 2 },
  { label: 'Why Ashok Tex', link: '/why-ashok-tex', display_order: 3 },
  { label: 'About', link: '/about', display_order: 4 },
  { label: 'Request Quote', link: '/request-quote', display_order: 5 },
  { label: 'Contact', link: '/contact', display_order: 6 },
];

const DEFAULT_TESTIMONIALS = [
  { customerName: 'Rajiv Ranjan Kumar', role: 'Garment Manufacturer', quote: 'Incredible value for money. Consistent quality in every bulk order.', rating: 5 },
  { customerName: 'Ramesh Rummy', role: 'Textile Wholesaler', quote: 'The staff has been very helpful throughout the procurement process. Highly reliable.', rating: 5 },
  { customerName: 'Kanakaraju', role: 'Apparel Exporter', quote: 'A must-have supplier for quality cotton fabrics. Timely delivery every time.', rating: 5 },
  { customerName: 'Pravin Amrutkar', role: 'Textile Buyer', quote: 'Consistent excellence across the board, a hallmark of reliability', rating: 5 },
  { customerName: 'Sonu Patwa', role: 'Regular Customer', quote: 'Thanks for your services. I have been purchasing your products since a while now.', rating: 5 },
  { customerName: 'Shubham Shukla', role: 'Apparel Manufacturer', quote: 'This product has a modern design and innovative features. Love it.', rating: 5 },
];

export async function runSeedIfEmpty() {
  await seedCategoriesAndProducts();
  await seedTestimonials();
  await seedCompanySettings();
  await seedNavigation();
  await seedHomepageSections();
  await seedAdminUser();
  await normalizeProductMoq();
  await ensureRequestQuoteNavItem();
}

// Adds the "Request Quote" nav item to installs seeded before it existed in NAV_DEFAULTS.
// Safe to run on every startup — no-ops once the link is present.
async function ensureRequestQuoteNavItem() {
  const items = await getAllNavigationItems();
  if (!items.length) return; // fresh install — seedNavigation() already added it
  if (items.some((i) => i.link === '/request-quote')) return;
  await createNavigationItem({ label: 'Request Quote', link: '/request-quote', displayOrder: items.length });
  console.log('[Seed] Added missing "Request Quote" navigation item.');
}

// One-time cleanup for rows seeded before the MOQ value/unit split existed, where
// moq_value already included the unit (e.g. "2,500 Meter") producing "2,500 Meter Meter".
// Safe to run on every startup — it only touches rows that still have the duplicated unit.
async function normalizeProductMoq() {
  const rows = (await query("SELECT id, moq_value, moq_unit FROM products WHERE moq_unit != '' AND LOWER(moq_value) LIKE '%' || LOWER(moq_unit)")).rows;
  if (!rows.length) return;
  for (const row of rows) {
    const cleaned = row.moq_value.slice(0, row.moq_value.length - row.moq_unit.length).trim();
    await query('UPDATE products SET moq_value = $1 WHERE id = $2', [cleaned, row.id]);
  }
  console.log(`[Seed] Normalized MOQ value on ${rows.length} product(s).`);
}

async function seedCategoriesAndProducts() {
  if ((await getAllCategories({ includeInactive: true })).length > 0) return;

  const categoryIdBySlug = {};
  for (const [index, col] of collections.entries()) {
    const created = await createCategory({
      name: col.name,
      slug: col.slug,
      description: col.description,
      image: col.heroImage || col.image,
      accentColor: col.accentColor,
      displayOrder: index,
      seoTitle: col.name,
      seoDescription: col.tagline,
    });
    categoryIdBySlug[col.slug] = created.id;
  }

  for (const [index, p] of products.entries()) {
    await createProduct({
      categoryId: categoryIdBySlug[p.categorySlug] || null,
      name: p.name,
      slug: p.slug,
      shortDescription: p.tagline || '',
      description: p.description || '',
      priceMin: p.priceMin ?? null,
      priceMax: p.priceMax ?? null,
      priceUnit: p.priceUnit || 'Meter',
      // Seed data stores MOQ as a combined string like "2,500 Meter" — strip the
      // trailing unit so it isn't duplicated when re-joined with moqUnit for display.
      moqValue: (p.moq || '').replace(/\s*meter$/i, '').trim(),
      moqUnit: 'Meter',
      tags: [p.category].filter(Boolean),
      published: true,
      featured: !!p.featured,
      isLatest: index >= products.length - 3,
      displayOrder: index,
      seoTitle: p.seoTitle || '',
      seoDescription: p.seoDescription || '',
      images: (p.images || []).map((url, i) => ({ url, altText: p.name, isPrimary: i === 0 })),
      specifications: (p.specifications || []).map((s) => ({ name: s.label, value: s.value })),
    });
  }

  console.log(`[Seed] Created ${collections.length} categories and ${products.length} products.`);
}

async function seedTestimonials() {
  if ((await getAllTestimonials()).length > 0) return;
  for (const [i, t] of DEFAULT_TESTIMONIALS.entries()) await createTestimonial({ ...t, displayOrder: i });
  console.log(`[Seed] Created ${DEFAULT_TESTIMONIALS.length} testimonials.`);
}

async function seedCompanySettings() {
  if (Object.keys(await getCompanySettings()).length > 0) return;
  await updateCompanySettings({
    name: companyInfo.name,
    tagline: companyInfo.tagline,
    establishedYear: companyInfo.establishedYear,
    founder: companyInfo.founder,
    contactPerson: companyInfo.contactPerson,
    businessType: 'Manufacturer, Supplier',
    gstin: companyInfo.gstin,
    address: companyInfo.address,
    phone: companyInfo.phone,
    phoneRaw: companyInfo.phoneRaw,
    phoneSecondary: companyInfo.phoneSecondary,
    phoneSecondaryRaw: companyInfo.phoneSecondaryRaw,
    email: companyInfo.email,
    website: companyInfo.website,
    whatsappNumber: companyInfo.whatsappNumber,
    whatsappUrl: companyInfo.whatsappUrl,
    moq: companyInfo.moq,
    googleMapsUrl: companyInfo.googleMapsUrl,
    googleMapsEmbedUrl: companyInfo.googleMapsEmbedUrl,
    marketCovered: 'Pan-India',
    stats: companyInfo.stats,
    managementMembers: [
      {
        name: 'M. Balusamy',
        role: 'Founder & Leadership',
        description: 'Known person in town for his weaving techniques, reliability, designing work and quality management. He has born and bought up from a weaving factory in his childhood days.',
        image: '',
      },
      {
        name: 'B. Arvinth',
        role: 'Business & Finance',
        description: 'Once after his studies he joined the business. From then till now he has full experience in business and He is looking after merchandising and finance and accounts.',
        image: '',
      },
    ],
    aboutGallery: [],
    legacyImage: '',
    legacyImageCaption: 'Ashok Tex textile production facility',
    aboutContent: '',
    sustainabilityContent: '',
  });
  console.log('[Seed] Created company settings.');
}

async function seedNavigation() {
  if ((await getAllNavigationItems()).length > 0) return;
  for (const item of NAV_DEFAULTS) await createNavigationItem(item);
  console.log(`[Seed] Created ${NAV_DEFAULTS.length} navigation items.`);
}

async function seedHomepageSections() {
  const existing = (await query('SELECT COUNT(*)::int AS c FROM homepage_sections')).rows[0].c;
  if (existing > 0) return;
  await withTransaction(async (client) => {
    for (const s of HOMEPAGE_SECTION_DEFAULTS) await client.query('INSERT INTO homepage_sections (section_key, title, subtitle, content, enabled, display_order) VALUES ($1, $2, $3, $4::jsonb, true, $5)', [s.section_key, s.title, s.subtitle, '{}', s.display_order]);
  });
  console.log(`[Seed] Created ${HOMEPAGE_SECTION_DEFAULTS.length} homepage sections.`);
}

async function seedAdminUser() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password || username.includes('YOUR_') || password.includes('YOUR_') || password === 'change-me') {
    console.warn('[Seed] Skipped admin user: configure a strong ADMIN_USERNAME and ADMIN_PASSWORD.');
    return;
  }

  const existingUser = await getAdminByUsername(username);
  if (existingUser) {
    const passwordMatches = await bcrypt.compare(password, existingUser.password_hash);
    if (!passwordMatches) {
      await updateAdminPassword(username, password);
      console.log(`[Seed] Updated admin password for "${username}" to match ADMIN_PASSWORD.`);
    }
    return;
  }

  await createAdminUser(username, password);
  console.log(`[Seed] Created default admin user "${username}". Set ADMIN_USERNAME/ADMIN_PASSWORD env vars to customize.`);
}
