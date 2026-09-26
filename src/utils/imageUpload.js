import { MAX_IMAGE_FILES, MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_LABEL } from '../../shared/imageUploadLimits.js';

export { MAX_IMAGE_SIZE_LABEL };

export function validateImageFiles(files) {
  if (files.length > MAX_IMAGE_FILES) {
    throw new Error(`You can upload up to ${MAX_IMAGE_FILES} images at a time.`);
  }
  const oversizedFile = files.find((file) => file.size > MAX_IMAGE_SIZE_BYTES);
  if (oversizedFile) {
    throw new Error(`${oversizedFile.name} is larger than the ${MAX_IMAGE_SIZE_LABEL} per-image limit.`);
  }
}