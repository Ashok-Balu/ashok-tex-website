import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { MAX_IMAGE_FILES, MAX_IMAGE_SIZE_BYTES } from '../../shared/imageUploadLimits.js';
import { MAX_VIDEO_SIZE_BYTES } from '../../shared/videoUploadLimits.js';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const ALLOWED_VIDEO_MIME = new Set(['video/mp4', 'video/webm', 'video/ogg']);
const ALLOWED_VIDEO_EXT = new Set(['.mp4', '.webm', '.ogv', '.ogg']);

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

export const uploadVideo = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, cb) {
    if (!ALLOWED_VIDEO_MIME.has(file.mimetype) || !ALLOWED_VIDEO_EXT.has(path.extname(file.originalname).toLowerCase())) {
      return cb(new Error('Only MP4, WEBM, and OGG video files are allowed.'));
    }
    cb(null, true);
  },
  limits: { fileSize: MAX_VIDEO_SIZE_BYTES, files: 1 },
});

export function createStorageFilename(originalname) {
  const ext = path.extname(originalname).toLowerCase();
  const safeExt = ALLOWED_EXT.has(ext) ? ext : '.jpg';
  return `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`;
}

export function createVideoStorageFilename(originalname) {
  const ext = path.extname(originalname).toLowerCase();
  const safeExt = ALLOWED_VIDEO_EXT.has(ext) ? ext : '.mp4';
  return `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`;
}
