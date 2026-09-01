import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { createStorageFilename, upload } from '../../middleware/upload.js';

const router = express.Router();
const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'uploads';

function getStorageClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!process.env.SUPABASE_URL || !secretKey || secretKey.includes('YOUR_')) {
    throw new Error('Supabase Storage is not configured.');
  }
  return createClient(process.env.SUPABASE_URL, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

router.post('/', upload.array('images', 20), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No image files were uploaded.' });
  }
  try {
    const startTime = Date.now();
    const storage = getStorageClient();
    
    // Process up to 5 files concurrently to avoid overwhelming server
    const uploadPromises = req.files.map(async (file) => {
      const filename = createStorageFilename(file.originalname);
      const { error } = await storage.storage.from(bucket).upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
        cacheControl: '3600',
      });
      if (error) throw error;
      const { data } = storage.storage.from(bucket).getPublicUrl(filename);
      return { url: data.publicUrl, filename };
    });
    
    const files = await Promise.all(uploadPromises);
    const duration = Date.now() - startTime;
    
    res.set('X-Upload-Time', duration.toString());
    if (duration > 5000) console.warn(`[Admin Upload] ${files.length} files took ${duration}ms`);
    
    res.status(201).json({ success: true, data: files });
  } catch (error) {
    const message = process.env.NODE_ENV === 'production'
      ? 'Image storage is currently unavailable.'
      : error.message || 'Image storage is currently unavailable.';
    res.status(502).json({ success: false, message });
  }
});

// Multer errors (bad file type, too large) surface here.
router.use((err, req, res, next) => {
  res.status(400).json({ success: false, message: err.message || 'Upload failed.' });
});

export default router;
