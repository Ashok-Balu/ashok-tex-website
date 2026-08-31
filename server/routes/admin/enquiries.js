import express from 'express';
import { getEnquiries, updateEnquiryStatus, deleteEnquiry, getContacts, updateContactStatus, deleteContact } from '../../db/repositories/enquiryRepo.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  const pageNum = Math.max(1, Number(page));
  const pageSize = Math.min(200, Math.max(1, Number(limit)));
  const offset = (pageNum - 1) * pageSize;
  const data = await getEnquiries({ status: status || undefined });
  const total = data.length;
  const paged = data.slice(offset, offset + pageSize);
  res.json({ success: true, data: paged, pagination: { total, page: pageNum, limit: pageSize, totalPages: Math.ceil(total / pageSize) || 1 } });
});

router.get('/contacts', async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const pageNum = Math.max(1, Number(page));
  const pageSize = Math.min(200, Math.max(1, Number(limit)));
  const offset = (pageNum - 1) * pageSize;
  const data = await getContacts();
  const total = data.length;
  const paged = data.slice(offset, offset + pageSize);
  res.json({ success: true, data: paged, pagination: { total, page: pageNum, limit: pageSize, totalPages: Math.ceil(total / pageSize) || 1 } });
});

router.put('/contacts/:id/status', async (req, res) => {
  const { status } = req.body;
  const updated = await updateContactStatus(req.params.id, status);
  if (!updated) return res.status(400).json({ success: false, message: 'Invalid status or message not found.' });
  res.json({ success: true, data: updated });
});

router.delete('/contacts/:id', async (req, res) => {
  await deleteContact(req.params.id);
  res.json({ success: true });
});

router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  const updated = await updateEnquiryStatus(req.params.id, status);
  if (!updated) return res.status(400).json({ success: false, message: 'Invalid status or enquiry not found.' });
  res.json({ success: true, data: updated });
});

router.delete('/:id', async (req, res) => {
  await deleteEnquiry(req.params.id);
  res.json({ success: true });
});

export default router;
