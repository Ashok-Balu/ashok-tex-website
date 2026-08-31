import 'dotenv/config';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32 || JWT_SECRET.includes('YOUR_')) {
  throw new Error('JWT_SECRET must be configured with at least 32 random characters.');
}
if (process.env.NODE_ENV === 'production' && (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === 'change-me' || process.env.ADMIN_PASSWORD.includes('YOUR_'))) {
  throw new Error('ADMIN_PASSWORD must be configured with a strong production password.');
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h', issuer: 'ashok-tex', audience: 'ashok-tex-admin' });
}

export function requireAdminAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { issuer: 'ashok-tex', audience: 'ashok-tex-admin' });
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
  }
}
