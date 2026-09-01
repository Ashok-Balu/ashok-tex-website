import express from 'express';
import {
  listProducts, getProductById, createProduct, updateProduct, deleteProduct,
  duplicateProduct, reorderProducts,
} from '../../db/repositories/productRepo.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const startTime = Date.now();
    const { category, search, page, limit, status } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Number(limit) || 50);
    
    const result = await listProducts({
      categorySlug: category || undefined,
      search: search || undefined,
      published: status === 'published' ? true : status === 'unpublished' ? false : 'all',
      sort: 'display_order',
      page: pageNum,
      limit: pageSize,
    });
    
    const duration = Date.now() - startTime;
    res.set('X-Query-Time', duration.toString());
    if (duration > 1000) console.warn(`[Admin Products List] took ${duration}ms`);
    
    res.json({ success: true, data: result.data, pagination: result.pagination });
  } catch (error) {
    console.error('[Admin Products Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
});

router.get('/:id', async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
  res.json({ success: true, data: product });
});

router.post('/', async (req, res) => {
  if (!req.body.name || !String(req.body.name).trim()) {
    return res.status(400).json({ success: false, message: 'Product name is required.' });
  }
  const product = await createProduct(req.body);
  res.status(201).json({ success: true, data: product });
});

router.put('/reorder', async (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) return res.status(400).json({ success: false, message: 'orderedIds array is required.' });
  await reorderProducts(orderedIds);
  res.json({ success: true });
});

router.post('/:id/duplicate', async (req, res) => {
  const copy = await duplicateProduct(req.params.id);
  if (!copy) return res.status(404).json({ success: false, message: 'Product not found.' });
  res.status(201).json({ success: true, data: copy });
});

router.put('/:id', async (req, res) => {
  const product = await updateProduct(req.params.id, req.body);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
  res.json({ success: true, data: product });
});

router.delete('/:id', async (req, res) => {
  await deleteProduct(req.params.id);
  res.json({ success: true });
});

export default router;
