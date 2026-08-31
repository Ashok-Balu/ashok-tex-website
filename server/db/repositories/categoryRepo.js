import { query, withTransaction } from '../database.js';
import { generateUniqueSlug } from '../../utils/slug.js';

const slugExists = async (slug, excludeId) => {
  const result = await query(excludeId ? 'SELECT id FROM categories WHERE slug = $1 AND id != $2' : 'SELECT id FROM categories WHERE slug = $1', excludeId ? [slug, excludeId] : [slug]);
  return result.rowCount > 0;
};

async function withProductCount(row) {
  if (!row) return row;
  const result = await query('SELECT COUNT(*)::int AS count FROM products WHERE category_id = $1 AND published = true', [row.id]);
  return { ...row, productCount: result.rows[0].count };
}

export async function getAllCategories({ includeInactive = false } = {}) {
  const where = includeInactive ? '' : 'WHERE active = true';
  const result = await query(`
    SELECT c.*, COALESCE(pc.count, 0)::int AS "productCount"
    FROM categories c
    LEFT JOIN (
      SELECT category_id, COUNT(*)::int AS count
      FROM products
      WHERE published = true
      GROUP BY category_id
    ) pc ON pc.category_id = c.id
    ${where}
    ORDER BY c.display_order ASC, c.name ASC
  `);
  return result.rows.map((row) => ({ ...row, productCount: Number(row.productCount || 0) }));
}

// Builds a nested category tree (unlimited depth) from the flat table.
export async function getCategoryTree({ includeInactive = false } = {}) {
  const flat = await getAllCategories({ includeInactive });
  const byId = new Map(flat.map((c) => [c.id, { ...c, children: [] }]));
  const roots = [];
  for (const cat of byId.values()) {
    if (cat.parent_id && byId.has(cat.parent_id)) {
      byId.get(cat.parent_id).children.push(cat);
    } else {
      roots.push(cat);
    }
  }
  return roots;
}

export async function getCategoryBySlug(slug) {
  const row = (await query('SELECT * FROM categories WHERE slug = $1', [slug])).rows[0];
  return withProductCount(row);
}

export async function getCategoryById(id) {
  const row = (await query('SELECT * FROM categories WHERE id = $1', [id])).rows[0];
  return withProductCount(row);
}

// Returns [root, ..., parent, self] for breadcrumb generation.
export async function getCategoryAncestry(id) {
  const chain = [];
  let current = (await query('SELECT * FROM categories WHERE id = $1', [id])).rows[0];
  const seen = new Set();
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    chain.unshift(current);
    current = current.parent_id ? (await query('SELECT * FROM categories WHERE id = $1', [current.parent_id])).rows[0] : null;
  }
  return chain;
}

export async function getSubcategoryIds(categoryId) {
  const ids = [categoryId];
  const children = (await query('SELECT id FROM categories WHERE parent_id = $1', [categoryId])).rows;
  for (const child of children) {
    ids.push(...await getSubcategoryIds(child.id));
  }
  return ids;
}

export async function createCategory(data) {
  const slug = data.slug ? await generateUniqueSlug(data.slug, slugExists) : await generateUniqueSlug(data.name, slugExists);
  const maxOrder = (await query('SELECT COALESCE(MAX(display_order), -1)::int AS count FROM categories')).rows[0].count;
  const result = await query(`INSERT INTO categories (parent_id, name, slug, description, image, accent_color, display_order, active, seo_title, seo_description, og_image)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`, [data.parentId || null, data.name, slug, data.description || '', data.image || '', data.accentColor || '#1a6b3a', data.displayOrder ?? maxOrder + 1, data.active !== false, data.seoTitle || '', data.seoDescription || '', data.ogImage || '']);
  return withProductCount(result.rows[0]);
}

export async function updateCategory(id, data) {
  const existing = (await query('SELECT * FROM categories WHERE id = $1', [id])).rows[0];
  if (!existing) return null;
  const slug = data.slug && data.slug !== existing.slug ? await generateUniqueSlug(data.slug, slugExists, id) : existing.slug;
  const result = await query(`UPDATE categories SET parent_id = $1, name = $2, slug = $3, description = $4, image = $5, accent_color = $6,
    display_order = $7, active = $8, seo_title = $9, seo_description = $10, og_image = $11, updated_at = CURRENT_TIMESTAMP
    WHERE id = $12 RETURNING *`, [data.parentId ?? existing.parent_id, data.name ?? existing.name, slug, data.description ?? existing.description, data.image ?? existing.image, data.accentColor ?? existing.accent_color, data.displayOrder ?? existing.display_order, data.active !== undefined ? data.active : existing.active, data.seoTitle ?? existing.seo_title, data.seoDescription ?? existing.seo_description, data.ogImage ?? existing.og_image, id]);
  return withProductCount(result.rows[0]);
}

export async function deleteCategory(id) {
  const [{ rows: productRows }, { rows: childRows }] = await Promise.all([query('SELECT COUNT(*)::int AS count FROM products WHERE category_id = $1', [id]), query('SELECT COUNT(*)::int AS count FROM categories WHERE parent_id = $1', [id])]);
  const count = productRows[0].count;
  const childCount = childRows[0].count;
  if (count > 0) {
    return { success: false, message: `Cannot delete: ${count} product(s) are assigned to this category. Reassign or delete them first.` };
  }
  if (childCount > 0) {
    return { success: false, message: `Cannot delete: ${childCount} subcategory(ies) exist under this category. Delete or reassign them first.` };
  }
  await query('DELETE FROM categories WHERE id = $1', [id]);
  return { success: true };
}

export async function reorderCategories(orderedIds) {
  await withTransaction(async (client) => {
    for (const [index, id] of orderedIds.entries()) await client.query('UPDATE categories SET display_order = $1 WHERE id = $2', [index, id]);
  });
}
