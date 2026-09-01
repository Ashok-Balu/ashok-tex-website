import express from 'express';
import { validatePhone } from '../../utils/validator.js';
import {
  getCompanySettings, updateCompanySettings, getAllNavigationItems, createNavigationItem,
  updateNavigationItem, deleteNavigationItem, reorderNavigationItems,
  getHomepageSections, updateHomepageSection,
} from '../../db/repositories/settingsRepo.js';

const router = express.Router();
let settingsCache = { data: null, timestamp: 0 };
let navigationCache = { data: null, timestamp: 0 };
let homepageCache = { data: null, timestamp: 0 };
const CACHE_TTL = 5000;

router.get('/company', async (req, res) => {
  try {
    const now = Date.now();
    if (settingsCache.data && (now - settingsCache.timestamp) < CACHE_TTL) {
      res.set('X-Cache', 'HIT');
      return res.json({ success: true, data: settingsCache.data });
    }
    const startTime = Date.now();
    const data = await getCompanySettings();
    settingsCache = { data, timestamp: now };
    res.set('X-Query-Time', (Date.now() - startTime).toString());
    res.set('Cache-Control', 'private, max-age=5');
    res.json({ success: true, data });
  } catch (error) {
    console.error('[Admin Company Settings Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch company settings.' });
  }
});

router.put('/company', async (req, res) => {
  try {
    const phoneFields = ['phone', 'phoneRaw', 'phoneSecondary', 'phoneSecondaryRaw', 'whatsappNumber'];
    const invalidPhone = phoneFields.find((field) => req.body[field] && !validatePhone(String(req.body[field])));
    if (invalidPhone) return res.status(400).json({ success: false, message: `${invalidPhone} must contain exactly 10 digits.` });
    const startTime = Date.now();
    const data = await updateCompanySettings(req.body);
    settingsCache = { data: null, timestamp: 0 };
    res.set('X-Query-Time', (Date.now() - startTime).toString());
    res.json({ success: true, data });
  } catch (error) {
    console.error('[Admin Company Settings Update Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to update company settings.' });
  }
});

router.get('/navigation', async (req, res) => {
  try {
    const now = Date.now();
    if (navigationCache.data && (now - navigationCache.timestamp) < CACHE_TTL) {
      res.set('X-Cache', 'HIT');
      return res.json({ success: true, data: navigationCache.data });
    }
    const startTime = Date.now();
    const data = await getAllNavigationItems();
    navigationCache = { data, timestamp: now };
    res.set('X-Query-Time', (Date.now() - startTime).toString());
    res.set('Cache-Control', 'private, max-age=5');
    res.json({ success: true, data });
  } catch (error) {
    console.error('[Admin Navigation Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch navigation items.' });
  }
});
router.post('/navigation', async (req, res) => {
  try {
    if (!req.body.label) return res.status(400).json({ success: false, message: 'Label is required.' });
    const startTime = Date.now();
    const data = await createNavigationItem(req.body);
    navigationCache = { data: null, timestamp: 0 };
    res.set('X-Query-Time', (Date.now() - startTime).toString());
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('[Admin Navigation Create Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to create navigation item.' });
  }
});

router.put('/navigation/reorder', async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) return res.status(400).json({ success: false, message: 'orderedIds array is required.' });
    const startTime = Date.now();
    await reorderNavigationItems(orderedIds);
    navigationCache = { data: null, timestamp: 0 };
    res.set('X-Query-Time', (Date.now() - startTime).toString());
    res.json({ success: true });
  } catch (error) {
    console.error('[Admin Navigation Reorder Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to reorder navigation items.' });
  }
});

router.put('/navigation/:id', async (req, res) => {
  try {
    const startTime = Date.now();
    const item = await updateNavigationItem(req.params.id, req.body);
    if (!item) return res.status(404).json({ success: false, message: 'Navigation item not found.' });
    navigationCache = { data: null, timestamp: 0 };
    res.set('X-Query-Time', (Date.now() - startTime).toString());
    res.json({ success: true, data: item });
  } catch (error) {
    console.error('[Admin Navigation Update Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to update navigation item.' });
  }
});

router.delete('/navigation/:id', async (req, res) => {
  try {
    const startTime = Date.now();
    await deleteNavigationItem(req.params.id);
    navigationCache = { data: null, timestamp: 0 };
    res.set('X-Query-Time', (Date.now() - startTime).toString());
    res.json({ success: true });
  } catch (error) {
    console.error('[Admin Navigation Delete Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete navigation item.' });
  }
});

router.get('/homepage-sections', async (req, res) => {
  try {
    const now = Date.now();
    if (homepageCache.data && (now - homepageCache.timestamp) < CACHE_TTL) {
      res.set('X-Cache', 'HIT');
      return res.json({ success: true, data: homepageCache.data });
    }
    const startTime = Date.now();
    const data = await getHomepageSections({ enabledOnly: false });
    homepageCache = { data, timestamp: now };
    res.set('X-Query-Time', (Date.now() - startTime).toString());
    res.set('Cache-Control', 'private, max-age=5');
    res.json({ success: true, data });
  } catch (error) {
    console.error('[Admin Homepage Sections Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch homepage sections.' });
  }
});

router.put('/homepage-sections/:key', async (req, res) => {
  try {
    const startTime = Date.now();
    const section = await updateHomepageSection(req.params.key, req.body);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found.' });
    homepageCache = { data: null, timestamp: 0 };
    res.set('X-Query-Time', (Date.now() - startTime).toString());
    res.json({ success: true, data: section });
  } catch (error) {
    console.error('[Admin Homepage Sections Update Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to update homepage section.' });
  }
});

export default router;
