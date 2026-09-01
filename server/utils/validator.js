export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePhone(phone) {
  return typeof phone === 'string' && /^\d{10}$/.test(phone);
}

export function validateName(name) {
  return typeof name === 'string' && name.trim().length >= 2;
}

export function validateMessage(message, minLength = 5) {
  return typeof message === 'string' && message.trim().length >= minLength;
}

export function validatePurpose(value) {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (!normalized) return false;
  const allowed = ['Reselling', 'End Use'];
  return allowed.some((option) => option.toLowerCase() === normalized.toLowerCase());
}