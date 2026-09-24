export function digitsOnly(value) {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, 12);
  if (!digits) return '';

  let compact = digits;
  if (compact.startsWith('91')) compact = compact.slice(2);
  compact = compact.replace(/^0+/, '').slice(0, 10);

  if (!compact) return '+91 ';

  if (compact.length <= 5) return `+91 ${compact}`;
  if (compact.length <= 10) return `+91 ${compact.slice(0, 5)} ${compact.slice(5)}`;
  return `+91 ${compact.slice(0, 5)} ${compact.slice(5, 10)}`;
}

export function isValidIndianMobilePhone(value) {
  if (typeof value !== 'string') return false;

  const normalized = value.replace(/[\s+]/g, '');
  if (!normalized) return false;

  const compact = normalized.startsWith('91') ? normalized.slice(2) : normalized;
  const digits = compact.replace(/^0+/, '');
  return /^[6-9]\d{9}$/.test(digits);
}

export function normalizeWhatsAppNumber(value) {
  if (value === null || value === undefined) return '';

  const digits = String(value).replace(/\D/g, '');
  if (!digits) return '';

  let compact = digits;
  if (compact.startsWith('91')) compact = compact.slice(2);
  compact = compact.replace(/^0+/, '');

  return compact.length === 10 ? `91${compact}` : compact.length > 10 && compact.startsWith('91') ? compact : '';
}

export function buildWhatsAppUrl(value, text = '') {
  const number = normalizeWhatsAppNumber(value);
  if (!number) return '';

  const baseUrl = `https://wa.me/${number}`;
  if (!text) return baseUrl;
  return `${baseUrl}?text=${encodeURIComponent(text)}`;
}