import { collection, nextId, nextDisplayOrder, sortByOrder } from './mongoHelpers.js';
import { generateUniqueSlug } from '../../utils/slug.js';
const categories = () => collection('categories');
const normalizeId = (id) => {
  const value = Number(id);
  return Number.isFinite(value) && String(value) === String(id).trim() ? value : id;
};
async function slugExists(slug, excludeId) { return !!(await (await categories()).findOne({ slug, ...(excludeId ? { id: { $ne: normalizeId(excludeId) } } : {}) })); }
async function withProductCount(row) { if (!row) return row; const count = await (await collection('products')).countDocuments({ category_id: normalizeId(row.id), published: true }); return { ...row, productCount: count }; }
export async function getAllCategories({ includeInactive = false } = {}) { const rows = await (await categories()).find(includeInactive ? {} : { active: true }).sort({ display_order: 1, name: 1 }).toArray(); const products = await (await collection('products')).find({ published: true }, { projection: { category_id: 1 } }).toArray(); const counts = products.reduce((map, p) => map.set(normalizeId(p.category_id), (map.get(normalizeId(p.category_id)) || 0) + 1), new Map()); return rows.map((row) => ({ ...row, productCount: counts.get(normalizeId(row.id)) || 0 })); }
export function buildCategoryTree(flat) {
  const byId = new Map(flat.map((category) => [normalizeId(category.id), { ...category, children: [] }]));
  const visited = new Set();
  const cycleRoots = new Set();

  for (const category of byId.values()) {
    const path = [];
    const pathIndex = new Map();
    let current = category;

    while (current) {
      const currentId = normalizeId(current.id);
      if (pathIndex.has(currentId)) {
        const cycle = path.slice(pathIndex.get(currentId));
        const root = cycle.reduce((first, candidate) => {
          const orderDifference = Number(first.display_order || 0) - Number(candidate.display_order || 0);
          if (orderDifference !== 0) return orderDifference < 0 ? first : candidate;
          return String(first.id).localeCompare(String(candidate.id)) <= 0 ? first : candidate;
        });
        cycleRoots.add(normalizeId(root.id));
        break;
      }
      if (visited.has(currentId)) break;

      pathIndex.set(currentId, path.length);
      path.push(current);
      const parentId = normalizeId(current.parent_id);
      current = current.parent_id && byId.has(parentId) ? byId.get(parentId) : null;
    }

    path.forEach((node) => visited.add(normalizeId(node.id)));
  }

  const roots = [];
  for (const category of byId.values()) {
    const categoryId = normalizeId(category.id);
    const parentId = normalizeId(category.parent_id);
    if (!cycleRoots.has(categoryId) && category.parent_id && byId.has(parentId)) {
      byId.get(parentId).children.push(category);
    } else {
      roots.push(category);
    }
  }
  return roots;
}
export async function getCategoryTree(options = {}) { return buildCategoryTree(await getAllCategories(options)); }
export async function getCategoryBySlug(slug) { return withProductCount(await (await categories()).findOne({ slug })); }
export async function getCategoryById(id) { return withProductCount(await (await categories()).findOne({ id: normalizeId(id) })); }
export async function getCategoryAncestry(id) { const chain = []; let current = await getCategoryById(id); const seen = new Set(); while (current && !seen.has(current.id)) { seen.add(current.id); chain.unshift(current); current = current.parent_id ? await getCategoryById(current.parent_id) : null; } return chain; }
export async function getSubcategoryIds(categoryId) {
  const rootId = normalizeId(categoryId);
  const rows = await (await categories()).find({}, { projection: { id: 1, parent_id: 1 } }).toArray();
  const childrenByParent = new Map();
  for (const row of rows) {
    if (row.parent_id === null || row.parent_id === undefined) continue;
    const parentId = normalizeId(row.parent_id);
    const children = childrenByParent.get(parentId) || [];
    children.push(normalizeId(row.id));
    childrenByParent.set(parentId, children);
  }

  const ids = [rootId];
  const visited = new Set(ids);
  for (let index = 0; index < ids.length; index += 1) {
    for (const childId of childrenByParent.get(ids[index]) || []) {
      if (visited.has(childId)) continue;
      visited.add(childId);
      ids.push(childId);
    }
  }
  return ids;
}
export async function createCategory(data) { const slug = await generateUniqueSlug(data.slug || data.name, slugExists); const category = { id: await nextId('categories'), parent_id: data.parentId || null, name: data.name, slug, description: data.description || '', image: data.image || '', accent_color: data.accentColor || '#1a6b3a', display_order: data.displayOrder ?? await nextDisplayOrder('categories'), active: data.active !== false, seo_title: data.seoTitle || '', seo_description: data.seoDescription || '', og_image: data.ogImage || '', created_at: new Date(), updated_at: new Date() }; await (await categories()).insertOne(category); return withProductCount(category); }
export async function updateCategory(id, data) { const normalizedId = normalizeId(id); const existing = await getCategoryById(normalizedId); if (!existing) return null; const slug = data.slug && data.slug !== existing.slug ? await generateUniqueSlug(data.slug, slugExists, normalizedId) : existing.slug; const updated = { ...existing, parent_id: data.parentId ?? existing.parent_id, name: data.name ?? existing.name, slug, description: data.description ?? existing.description, image: data.image ?? existing.image, accent_color: data.accentColor ?? existing.accent_color, display_order: data.displayOrder ?? existing.display_order, active: data.active !== undefined ? data.active : existing.active, seo_title: data.seoTitle ?? existing.seo_title, seo_description: data.seoDescription ?? existing.seo_description, og_image: data.ogImage ?? existing.og_image, updated_at: new Date() }; await (await categories()).replaceOne({ id: normalizedId }, updated); return withProductCount(updated); }
export async function deleteCategory(id) { const normalizedId = normalizeId(id); const productCount = await (await collection('products')).countDocuments({ category_id: normalizedId }); const childCount = await (await categories()).countDocuments({ parent_id: normalizedId }); if (productCount) return { success: false, message: `Cannot delete: ${productCount} product(s) are assigned to this category. Reassign or delete them first.` }; if (childCount) return { success: false, message: `Cannot delete: ${childCount} subcategory(ies) exist under this category. Delete or reassign them first.` }; await (await categories()).deleteOne({ id: normalizedId }); return { success: true }; }
export async function reorderCategories(orderedIds) { const store = await categories(); await Promise.all(orderedIds.map((id, index) => store.updateOne({ id: normalizeId(id) }, { $set: { display_order: index } }))); }
