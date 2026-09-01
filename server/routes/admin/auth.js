import express from 'express';
import rateLimit from 'express-rate-limit';
import { verifyAdminPassword } from '../../db/repositories/adminRepo.js';
import { signToken } from '../../middleware/auth.js';
import { sanitizeString } from '../../utils/validator.js';

const router = express.Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const username = sanitizeString(req.body.username);
    const password = String(req.body.password || '');
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }
    const user = await verifyAdminPassword(username, password);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
    const token = signToken({ id: user.id, username: user.username, role: user.role });
    res.json({ success: true, token, user });
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

export default router;
