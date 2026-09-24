import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getCategoryCache,
  invalidateCategoryCache,
  setCategoryCache,
} from './categories.js';

test('admin category cache is cleared after invalidation', () => {
  setCategoryCache([{ id: 1, name: 'Kitchen Linen' }]);
  assert.deepEqual(getCategoryCache(), [{ id: 1, name: 'Kitchen Linen' }]);

  invalidateCategoryCache();

  assert.equal(getCategoryCache(), null);
});
