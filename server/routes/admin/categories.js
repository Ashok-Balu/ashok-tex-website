import express from 'express';
import {
  getAllCategories, getCategoryTree, getCategoryById, createCategory,
  updateCategory, deleteCategory, reorderCategories,
} from '../../db/repositories/categoryRepo.js';

const router = express.Router();
let categoryCache = { data: null, timestamp: 0 };
const CACHE_TTL = 5000; // 5 seconds

router.get('/', async (req, res) => {
  try {
    const now = Date.now();
    if (categoryCache.data && (now - categoryCache.timestamp) < CACHE_TTL) {
      res.set('X-Cache', 'HIT');
      return res.json({ success: true, data: categoryCache.data });
    }
    
    const startTime = Date.now();
    const categories = await getAllCategories({ includeInactive: true });
    categoryCache = { data: categories, timestamp: now };
    const duration = Date.now() - startTime;
    
    res.set('X-Query-Time', duration.toString());
    res.set('Cache-Control', 'private, max-age=5');
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('[Admin Categories Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
});

router.get('/tree', async (req, res) => {
  try {
    const startTime = Date.now();
    const tree = await getCategoryTree({ includeInactive: true });
    const duration = Date.now() - startTime;
    res.set('X-Query-Time', duration.toString());
    res.set('Cache-Control', 'private, max-age=5');
    res.json({ success: true, data: tree });
  } catch (error) {
    console.error('[Admin Category Tree Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch category tree.' });
  }
});

router.get('/:id', async (req, res) => {
  const category = await getCategoryById(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
  res.json({ success: true, data: category });
});

router.post('/', async (req, res) => {
  if (!req.body.name || !String(req.body.name).trim()) {
    return res.status(400).json({ success: false, message: 'Category name is required.' });
  }
  const category = await createCategory(req.body);
  res.status(201).json({ success: true, data: category });
});

router.put('/reorder', async (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) return res.status(400).json({ success: false, message: 'orderedIds array is required.' });
  await reorderCategories(orderedIds);
  res.json({ success: true });
});

router.put('/:id', async (req, res) => {
  const category = await updateCategory(req.params.id, req.body);
  if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
  res.json({ success: true, data: category });
});

router.delete('/:id', async (req, res) => {
  const result = await deleteCategory(req.params.id);
  if (!result.success) return res.status(409).json(result);
  res.json(result);
});

export default router;
