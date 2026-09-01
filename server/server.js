import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { runSeedIfEmpty } from './db/seed.js';
import { requireAdminAuth } from './middleware/auth.js';
import { recordAudit } from './db/repositories/adminRepo.js';

import enquiryRoutes from './routes/enquiry.js';
import contactRoutes from './routes/contact.js';
import categoryRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
import testimonialRoutes from './routes/testimonials.js';
import settingsRoutes from './routes/settings.js';
import sitemapRoutes from './routes/sitemap.js';

import adminAuthRoutes from './routes/admin/auth.js';
import adminCategoryRoutes from './routes/admin/categories.js';
import adminProductRoutes from './routes/admin/products.js';
import adminTestimonialRoutes from './routes/admin/testimonials.js';
import adminEnquiryRoutes from './routes/admin/enquiries.js';
import adminSettingsRoutes from './routes/admin/settings.js';
import adminDashboardRoutes from './routes/admin/dashboard.js';
import adminUploadRoutes from './routes/admin/upload.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
app.disable('x-powered-by');
app.set('trust proxy', 1);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again shortly.' },
});

const configuredOrigins = (process.env.CORS_ORIGINS || process.env.SITE_URL || '')
  .split(',').map((origin) => origin.trim()).filter(Boolean);
const allowedOrigins = new Set(configuredOrigins);
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.add('http://localhost:5173');
  allowedOrigins.add('http://127.0.0.1:5173');
}

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
app.use(compression({ level: 6, threshold: 1024 }));
app.use('/api', apiLimiter);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

function auditAdminMutation(req, res, next) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    res.on('finish', () => {
      if (res.statusCode < 400 && req.admin) {
        recordAudit({ username: req.admin.username, action: req.method, entity: req.path }).catch((error) => {
          console.error('[Audit Error]', error.message);
        });
      }
    });
  }
  next();
}

// ─── Public API Routes ──────────────────────────────────────────────────────
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/', sitemapRoutes);

// ─── Admin API Routes (all protected except login) ─────────────────────────
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/categories', requireAdminAuth, auditAdminMutation, adminCategoryRoutes);
app.use('/api/admin/products', requireAdminAuth, auditAdminMutation, adminProductRoutes);
app.use('/api/admin/testimonials', requireAdminAuth, auditAdminMutation, adminTestimonialRoutes);
app.use('/api/admin/enquiries', requireAdminAuth, auditAdminMutation, adminEnquiryRoutes);
app.use('/api/admin/settings', requireAdminAuth, auditAdminMutation, adminSettingsRoutes);
app.use('/api/admin/dashboard', requireAdminAuth, auditAdminMutation, adminDashboardRoutes);
app.use('/api/admin/upload', requireAdminAuth, auditAdminMutation, adminUploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Ashok Tex API Server',
    location: 'Karur, Tamil Nadu',
  });
});

// Production Static Serving
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, {
    maxAge: '1d',
    etag: true,
    immutable: false,
    setHeaders(res, filePath) {
      if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  }));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || error.status || 500;
  console.error('[API Error]', { 
    method: req.method, 
    path: req.path, 
    statusCode,
    message: error.message,
    stack: error.stack 
  });
  if (res.headersSent) return next(error);
  const message = process.env.NODE_ENV === 'production' ? 'Unable to process this request.' : error.message;
  res.status(statusCode).json({ success: false, message });
});

export default app;

if (!process.env.VERCEL && process.env.DATABASE_URL) {
  runSeedIfEmpty().catch((error) => console.error('[Seed] Failed:', error));
}

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Ashok Tex API Server] Running on http://localhost:${PORT}`);
  });
}