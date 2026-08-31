import express from 'express';
import {
  getAllCategories, getCategoryTree, getCategoryById, createCategory,
  updateCategory, deleteCategory, reorderCategories,
} from '../../db/repositories/categoryRepo.js';

const router = express.Router();

router.get('/', async (req, res) => {
  res.json({ success: true, data: await getAllCategories({ includeInactive: true }) });
});

router.get('/tree', async (req, res) => {
  res.json({ success: true, data: await getCategoryTree({ includeInactive: true }) });
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
