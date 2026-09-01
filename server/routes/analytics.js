import express from 'express';
import { recordVisit } from '../db/repositories/analyticsRepo.js';
import { normalizeVisitorRequest } from '../utils/visitor.js';

const router = express.Router();

router.post('/visit', async (req, res) => {
  try {
    const normalized = normalizeVisitorRequest({
      path: req.body?.path || req.originalUrl || '/',
      headers: {
        'user-agent': req.headers['user-agent'],
        referer: req.headers.referer,
        referrer: req.headers.referrer,
        'x-forwarded-for': req.headers['x-forwarded-for'],
      },
      ipAddress: req.ip || req.socket?.remoteAddress || '',
    });

    const sessionId = String(req.body?.sessionId || normalized.sessionId || '').trim();
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Visitor session is required.' });
    }

    await recordVisit({
      sessionId,
      path: normalized.path,
      referrer: normalized.referrer,
      userAgent: normalized.userAgent,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('[Visitor analytics] Failed:', error.message);
    res.status(500).json({ success: false, message: 'Unable to record visit.' });
  }
});

export default router;
