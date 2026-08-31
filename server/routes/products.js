import express from 'express';
import {
  listProducts, getProductBySlug, getRelatedProducts, incrementViewCount, getFilterFacets,
} from '../db/repositories/productRepo.js';
import { getCategoryAncestry } from '../db/repositories/categoryRepo.js';

const router = express.Router();

// Formats a number with thousands separators (e.g. 2500 -> "2,500") while leaving
// already-formatted / non-numeric strings untouched.
function formatNumber(value) {
  const num = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(num) && String(value).trim() !== '' ? num.toLocaleString('en-IN') : value;
}

// MOQ values seeded before the unit/value split existed may already contain the unit
// (e.g. "2,500 Meter"). Strip it out so callers can reliably re-combine value + unit
// without duplicating it (e.g. rendering "2,500 Meter Meter").
function cleanMoqValue(value, unit) {
  if (!value) return '';
  const raw = String(value).trim();
  const stripped = unit && raw.toLowerCase().endsWith(unit.toLowerCase()) ? raw.slice(0, raw.length - unit.length).trim() : raw;
  return formatNumber(stripped);
}

function formatMoq(value, unit) {
  const cleaned = cleanMoqValue(value, unit);
  if (!cleaned) return null;
  return unit ? `${cleaned} ${unit}` : cleaned;
}

function serializeProduct(p) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category ? p.category.name : null,
    categorySlug: p.category ? p.category.slug : null,
    categoryId: p.category_id,
    shortDescription: p.short_description,
    description: p.description,
    tagline: p.short_description,
    priceMin: p.price_min,
    priceMax: p.price_max,
    priceUnit: p.price_unit,
    priceDisplay: p.price_min && p.price_max ? `\u20b9${formatNumber(p.price_min)} \u2013 \u20b9${formatNumber(p.price_max)} / ${p.price_unit}` : null,
    moq: formatMoq(p.moq_value, p.moq_unit),
    moqValue: cleanMoqValue(p.moq_value, p.moq_unit),
    moqUnit: p.moq_unit,
    tags: p.tags,
    published: !!p.published,
    featured: !!p.featured,
    isLatest: !!p.is_latest,
    images: p.images.map((i) => i.url),
    imageDetails: p.images,
    specifications: p.specifications,
    seoTitle: p.seo_title,
    seoDescription: p.seo_description,
    ogImage: p.og_image,
    viewCount: p.view_count,
  };
}

// GET /api/products?category=cotton&search=dobby&featured=true&sort=featured&page=1&limit=24
router.get('/', async (req, res) => {
  const { category, search, featured, latest, sort, page, limit, tags } = req.query;
  const result = await listProducts({
    categorySlug: category || undefined,
    search: search || undefined,
    featured: featured === 'true',
    latest: latest === 'true',
    sort: sort || undefined,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 24,
    tags: tags ? String(tags).split(',') : undefined,
  });
  res.json({ success: true, data: result.data.map(serializeProduct), pagination: result.pagination });
});

// Dynamic filter facets (materials/colors/patterns/etc.) built from live attribute data.
router.get('/filters', async (req, res) => {
  const facets = await getFilterFacets({ categorySlug: req.query.category || undefined });
  res.json({ success: true, data: facets });
});

router.get('/:slug', async (req, res) => {
  const product = await getProductBySlug(req.params.slug);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  await incrementViewCount(product.id);
  const breadcrumb = product.category_id ? (await getCategoryAncestry(product.category_id)).map((c) => ({ id: c.id, name: c.name, slug: c.slug })) : [];
  const related = (await getRelatedProducts(product, 6)).map(serializeProduct);
  res.json({ success: true, data: { ...serializeProduct(product), breadcrumb, related } });
});

export default router;
