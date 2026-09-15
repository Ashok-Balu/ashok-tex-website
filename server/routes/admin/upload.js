import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { createStorageFilename, upload } from '../../middleware/upload.js';

const router = express.Router();
function configureCloudinary() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary is not configured.');
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

router.post('/', upload.array('images', 20), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No image files were uploaded.' });
  }
  try {
    const startTime = Date.now();
    configureCloudinary();
    
    // Process uploads in parallel while keeping the admin request responsive.
    const uploadPromises = req.files.map(async (file) => {
      const filename = createStorageFilename(file.originalname);
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          folder: process.env.CLOUDINARY_FOLDER || 'ashok-tex',
          public_id: filename.replace(/\.[^.]+$/, ''),
          resource_type: 'image',
          invalidate: true,
        }, (error, response) => error ? reject(error) : resolve(response)).end(file.buffer);
      });
      return { url: result.secure_url, filename: result.public_id, publicId: result.public_id };
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
