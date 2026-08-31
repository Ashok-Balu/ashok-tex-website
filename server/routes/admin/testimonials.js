import express from 'express';
import {
  getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, reorderTestimonials,
} from '../../db/repositories/testimonialRepo.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { page = 1, limit = 50, sort = 'display_order' } = req.query;
  const pageNum = Math.max(1, Number(page));
  const pageSize = Math.min(200, Math.max(1, Number(limit)));
  const offset = (pageNum - 1) * pageSize;
  const allTestimonials = await getAllTestimonials();
  const total = allTestimonials.length;
  const data = allTestimonials.slice(offset, offset + pageSize);
  res.json({ success: true, data, pagination: { total, page: pageNum, limit: pageSize, totalPages: Math.ceil(total / pageSize) || 1 } });
});

router.post('/', async (req, res) => {
  if (!req.body.customerName || !req.body.quote) {
    return res.status(400).json({ success: false, message: 'Customer name and quote are required.' });
  }
  res.status(201).json({ success: true, data: await createTestimonial(req.body) });
});

router.put('/reorder', async (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) return res.status(400).json({ success: false, message: 'orderedIds array is required.' });
  await reorderTestimonials(orderedIds);
  res.json({ success: true });
});

router.put('/:id', async (req, res) => {
  const testimonial = await updateTestimonial(req.params.id, req.body);
  if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found.' });
  res.json({ success: true, data: testimonial });
});

router.delete('/:id', async (req, res) => {
  await deleteTestimonial(req.params.id);
  res.json({ success: true });
});

export default router;
