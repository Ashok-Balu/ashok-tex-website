import express from 'express';
import { validatePhone } from '../../utils/validator.js';
import {
  getCompanySettings, updateCompanySettings, getAllNavigationItems, createNavigationItem,
  updateNavigationItem, deleteNavigationItem, reorderNavigationItems,
  getHomepageSections, updateHomepageSection,
} from '../../db/repositories/settingsRepo.js';

const router = express.Router();

router.get('/company', async (req, res) => res.json({ success: true, data: await getCompanySettings() }));
router.put('/company', async (req, res) => {
  const phoneFields = ['phone', 'phoneRaw', 'phoneSecondary', 'phoneSecondaryRaw', 'whatsappNumber'];
  const invalidPhone = phoneFields.find((field) => req.body[field] && !validatePhone(String(req.body[field])));
  if (invalidPhone) return res.status(400).json({ success: false, message: `${invalidPhone} must contain exactly 10 digits.` });
  res.json({ success: true, data: await updateCompanySettings(req.body) });
});

router.get('/navigation', async (req, res) => res.json({ success: true, data: await getAllNavigationItems() }));
router.post('/navigation', async (req, res) => {
  if (!req.body.label) return res.status(400).json({ success: false, message: 'Label is required.' });
  res.status(201).json({ success: true, data: await createNavigationItem(req.body) });
});
router.put('/navigation/reorder', async (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) return res.status(400).json({ success: false, message: 'orderedIds array is required.' });
  await reorderNavigationItems(orderedIds);
  res.json({ success: true });
});
router.put('/navigation/:id', async (req, res) => {
  const item = await updateNavigationItem(req.params.id, req.body);
  if (!item) return res.status(404).json({ success: false, message: 'Navigation item not found.' });
  res.json({ success: true, data: item });
});
router.delete('/navigation/:id', async (req, res) => {
  await deleteNavigationItem(req.params.id);
  res.json({ success: true });
});

router.get('/homepage-sections', async (req, res) => res.json({ success: true, data: await getHomepageSections({ enabledOnly: false }) }));
router.put('/homepage-sections/:key', async (req, res) => {
  const section = await updateHomepageSection(req.params.key, req.body);
  if (!section) return res.status(404).json({ success: false, message: 'Section not found.' });
  res.json({ success: true, data: section });
});

export default router;
