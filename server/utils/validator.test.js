import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePurpose } from './validator.js';

test('validatePurpose accepts the supported enquiry purposes', () => {
  assert.equal(validatePurpose('Reselling'), true);
  assert.equal(validatePurpose('End Use'), true);
  assert.equal(validatePurpose('reselling'), true);
  assert.equal(validatePurpose('end use'), true);
});

test('validatePurpose rejects invalid or empty values', () => {
  assert.equal(validatePurpose(''), false);
  assert.equal(validatePurpose('Wholesale'), false);
  assert.equal(validatePurpose(null), false);
});
