import express from 'express';
import { getCategoryTree, getCategoryBySlug, getCategoryAncestry, getAllCategories } from '../db/repositories/categoryRepo.js';

const router = express.Router();

function serializeCategory(c) {
  return {
    id: c.id,
    parentId: c.parent_id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    accentColor: c.accent_color,
    displayOrder: c.display_order,
    active: !!c.active,
    seoTitle: c.seo_title,
    seoDescription: c.seo_description,
    ogImage: c.og_image,
    productCount: c.productCount,
    children: c.children ? c.children.map(serializeCategory) : undefined,
  };
}

// Full nested tree (unlimited depth) — drives navigation, homepage, category pages.
router.get('/', async (req, res) => {
  const tree = await getCategoryTree({ includeInactive: false });
  res.json({ success: true, data: tree.map(serializeCategory) });
});

router.get('/flat', async (req, res) => {
  const flat = await getAllCategories({ includeInactive: false });
  res.json({ success: true, data: flat.map(serializeCategory) });
});

router.get('/:slug', async (req, res) => {
  const category = await getCategoryBySlug(req.params.slug);
  if (!category || !category.active) {
    return res.status(404).json({ success: false, message: 'Category not found.' });
  }
  const ancestry = (await getCategoryAncestry(category.id)).map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
  res.json({ success: true, data: { ...serializeCategory(category), breadcrumb: ancestry } });
});

export default router;
