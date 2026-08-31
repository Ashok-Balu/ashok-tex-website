import express from 'express';
import { getCompanySettings, getNavigationTree, getHomepageSections } from '../db/repositories/settingsRepo.js';

const router = express.Router();

router.get('/company', async (req, res) => {
  res.json({ success: true, data: await getCompanySettings() });
});

router.get('/navigation', async (req, res) => {
  res.json({ success: true, data: await getNavigationTree({ visibleOnly: true }) });
});

router.get('/homepage-sections', async (req, res) => {
  res.json({ success: true, data: await getHomepageSections({ enabledOnly: true }) });
});

export default router;
