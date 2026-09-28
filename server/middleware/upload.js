import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { MAX_IMAGE_FILES, MAX_IMAGE_SIZE_BYTES } from '../../shared/imageUploadLimits.js';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME.has(file.mimetype)) {
    return cb(new Error('Only JPEG, PNG, WEBP, and GIF images are allowed.'));
  }
  cb(null, true);
}

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES, files: MAX_IMAGE_FILES },
});

export function createStorageFilename(originalname) {
  const ext = path.extname(originalname).toLowerCase();
  const safeExt = ALLOWED_EXT.has(ext) ? ext : '.jpg';
  return `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`;
}
