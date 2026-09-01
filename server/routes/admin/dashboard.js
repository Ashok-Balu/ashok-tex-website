import express from 'express';
import { getDashboardStats } from '../../db/repositories/productRepo.js';
import { getVisitorStats } from '../../db/repositories/analyticsRepo.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const [dashboard, visitors] = await Promise.all([
    getDashboardStats(),
    getVisitorStats(),
  ]);

  res.json({
    success: true,
    data: {
      ...dashboard,
      visitors,
    },
  });
});

export default router;
