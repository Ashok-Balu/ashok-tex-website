import express from 'express';
import { getDashboardStats } from '../../db/repositories/productRepo.js';

const router = express.Router();

router.get('/', async (req, res) => {
  res.json({ success: true, data: await getDashboardStats() });
});

export default router;
