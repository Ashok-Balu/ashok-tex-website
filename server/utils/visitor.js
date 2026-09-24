import crypto from 'crypto';

export function buildVisitorSessionId(userAgent = '', ipAddress = '') {
  const normalizedUserAgent = String(userAgent || '').trim();
  const normalizedIp = String(ipAddress || '').trim();
  const source = `${normalizedUserAgent}|${normalizedIp}`;
  return crypto.createHash('sha256').update(source).digest('hex');
}

export function summarizeReferrer(referrer = '') {
  const value = String(referrer || '').trim();
  if (!value) return { source: 'Direct', hostname: 'Direct', path: '/' };

  try {
    const parsed = new URL(value);
    const hostname = parsed.hostname.replace(/^www\./i, '') || 'Direct';
    return {
      source: hostname,
      hostname,
      path: parsed.pathname || '/',
    };
  } catch {
    return { source: 'External', hostname: 'External', path: value };
  }
}

export function describeUserAgent(userAgent = '') {
  const value = String(userAgent || '').trim();
  const lower = value.toLowerCase();

  let browser = 'Unknown';
  if (lower.includes('edg') || lower.includes('edga') || lower.includes('edgios')) browser = 'Edge';
  else if (lower.includes('opr') || lower.includes('opera')) browser = 'Opera';
  else if (lower.includes('chrome') && !lower.includes('edg')) browser = 'Chrome';
  else if (lower.includes('firefox')) browser = 'Firefox';
  else if (lower.includes('safari')) browser = 'Safari';

  let platform = 'Unknown';
  if (lower.includes('windows')) platform = 'Windows';
  else if (lower.includes('android')) platform = 'Android';
  else if (lower.includes('iphone') || lower.includes('ipad') || lower.includes('ios')) platform = 'iOS';
  else if (lower.includes('mac')) platform = 'macOS';
  else if (lower.includes('linux')) platform = 'Linux';

  let device = 'Desktop';
  if (lower.includes('iphone')) device = 'iPhone';
  else if (lower.includes('ipad')) device = 'iPad';
  else if (lower.includes('android')) device = 'Android';
  else if (lower.includes('mobile')) device = 'Mobile';

  return { browser, platform, device };
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
