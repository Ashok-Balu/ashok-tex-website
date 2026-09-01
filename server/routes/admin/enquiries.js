import express from 'express';
import { getEnquiries, updateEnquiryStatus, deleteEnquiry, getContacts, updateContactStatus, deleteContact } from '../../db/repositories/enquiryRepo.js';

const router = express.Router();
let enquiryCache = { data: null, timestamp: 0 };
let contactCache = { data: null, timestamp: 0 };
const CACHE_TTL = 3000; // 3 seconds

router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const startTime = Date.now();
    const now = Date.now();
    
    // Return cached data if available
    if (enquiryCache.data && (now - enquiryCache.timestamp) < CACHE_TTL && !status) {
      res.set('X-Cache', 'HIT');
      const pageNum = Math.max(1, Number(page));
      const pageSize = Math.min(200, Math.max(1, Number(limit)));
      const offset = (pageNum - 1) * pageSize;
      const total = enquiryCache.data.length;
      const paged = enquiryCache.data.slice(offset, offset + pageSize);
      return res.json({ success: true, data: paged, pagination: { total, page: pageNum, limit: pageSize, totalPages: Math.ceil(total / pageSize) || 1 } });
    }
    
    const pageNum = Math.max(1, Number(page));
    const pageSize = Math.min(200, Math.max(1, Number(limit)));
    const offset = (pageNum - 1) * pageSize;
    const data = await getEnquiries({ status: status || undefined });
    
    if (!status) enquiryCache = { data, timestamp: now };
    
    const total = data.length;
    const paged = data.slice(offset, offset + pageSize);
    const duration = Date.now() - startTime;
    
    res.set('X-Query-Time', duration.toString());
    if (!status) res.set('Cache-Control', 'private, max-age=3');
    res.json({ success: true, data: paged, pagination: { total, page: pageNum, limit: pageSize, totalPages: Math.ceil(total / pageSize) || 1 } });
  } catch (error) {
    console.error('[Admin Enquiries Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch enquiries.' });
  }
});

router.get('/contacts', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const startTime = Date.now();
    const now = Date.now();
    
    if (contactCache.data && (now - contactCache.timestamp) < CACHE_TTL) {
      res.set('X-Cache', 'HIT');
      const pageNum = Math.max(1, Number(page));
      const pageSize = Math.min(200, Math.max(1, Number(limit)));
      const offset = (pageNum - 1) * pageSize;
      const total = contactCache.data.length;
      const paged = contactCache.data.slice(offset, offset + pageSize);
      return res.json({ success: true, data: paged, pagination: { total, page: pageNum, limit: pageSize, totalPages: Math.ceil(total / pageSize) || 1 } });
    }
    
    const pageNum = Math.max(1, Number(page));
    const pageSize = Math.min(200, Math.max(1, Number(limit)));
    const offset = (pageNum - 1) * pageSize;
    const data = await getContacts();
    contactCache = { data, timestamp: now };
    
    const total = data.length;
    const paged = data.slice(offset, offset + pageSize);
    const duration = Date.now() - startTime;
    
    res.set('X-Query-Time', duration.toString());
    res.set('Cache-Control', 'private, max-age=3');
    res.json({ success: true, data: paged, pagination: { total, page: pageNum, limit: pageSize, totalPages: Math.ceil(total / pageSize) || 1 } });
  } catch (error) {
    console.error('[Admin Contacts Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch contacts.' });
  }
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
