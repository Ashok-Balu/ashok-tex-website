import test from 'node:test';
import assert from 'node:assert/strict';
import { companyInfo } from '../src/data/company.js';

test('company info includes SEO defaults for site metadata', () => {
  assert.equal(typeof companyInfo.metaTitle, 'string');
  assert.ok(companyInfo.metaTitle.length > 0);
  assert.equal(typeof companyInfo.metaDescription, 'string');
  assert.ok(companyInfo.metaDescription.length > 0);
  assert.equal(typeof companyInfo.keywords, 'string');
  assert.ok(companyInfo.keywords.length > 0);
});
