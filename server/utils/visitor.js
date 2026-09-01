import crypto from 'crypto';

export function buildVisitorSessionId(userAgent = '', ipAddress = '') {
  const normalizedUserAgent = String(userAgent || '').trim();
  const normalizedIp = String(ipAddress || '').trim();
  const source = `${normalizedUserAgent}|${normalizedIp}`;
  return crypto.createHash('sha256').update(source).digest('hex');
}

export function normalizeVisitorRequest({ path = '/', headers = {}, ipAddress = '' } = {}) {
  const userAgent = String(headers['user-agent'] || headers['User-Agent'] || '').trim();
  const referrer = String(headers.referer || headers.referrer || '').trim();
  const requestPath = typeof path === 'string' && path.trim() ? path : '/';
  const forwarded = Array.isArray(headers['x-forwarded-for'])
    ? headers['x-forwarded-for'].join(',')
    : String(headers['x-forwarded-for'] || '');
  const clientIp = forwarded || ipAddress || 'unknown';

  return {
    path: requestPath,
    referrer: referrer || '',
    userAgent,
    ipAddress: clientIp,
    sessionId: buildVisitorSessionId(userAgent, clientIp),
  };
}
