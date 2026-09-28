import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeVisitorRequest, buildVisitorSessionId, describeUserAgent } from './visitor.js';

test('normalizes visitor requests to a safe browser session', () => {
  const result = normalizeVisitorRequest({
    path: '/products/linen-fabric',
    headers: {
      'user-agent': 'Mozilla/5.0',
      referer: 'https://example.com/',
    },
  });

  assert.equal(result.path, '/products/linen-fabric');
  assert.equal(result.referrer, 'https://example.com/');
  assert.match(result.userAgent, /Mozilla/);
  assert.ok(result.sessionId.length > 10);
});

test('builds a stable visitor ID from browser identity', () => {
  const id1 = buildVisitorSessionId('Mozilla/5.0', '127.0.0.1');
  const id2 = buildVisitorSessionId('Mozilla/5.0', '127.0.0.1');
  assert.equal(id1, id2);
});

test('summarizes browser, device and platform details from a user agent', () => {
  const summary = describeUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');

  assert.equal(summary.browser, 'Safari');
  assert.equal(summary.device, 'iPhone');
  assert.equal(summary.platform, 'iOS');
});
