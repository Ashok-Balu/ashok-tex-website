import test from 'node:test';
import assert from 'node:assert/strict';

import { buildCategoryTree } from './categoryRepo.js';

test('category tree keeps categories with cyclic parent references visible', () => {
  const tree = buildCategoryTree([
    { id: 1, parent_id: 2, display_order: 0 },
    { id: 2, parent_id: 1, display_order: 1 },
    { id: 3, parent_id: 2, display_order: 2 },
    { id: 4, parent_id: null, display_order: 3 },
  ]);
  const flatten = (nodes) => nodes.flatMap((node) => [node.id, ...flatten(node.children)]);

  assert.deepEqual(tree.map((node) => node.id), [1, 4]);
  assert.deepEqual(tree[0].children.map((node) => node.id), [2]);
  assert.deepEqual(tree[0].children[0].children.map((node) => node.id), [3]);
  assert.deepEqual(flatten(tree), [1, 2, 3, 4]);
});