import { collection, nextId, nextDisplayOrder } from './mongoHelpers.js';
const normalizeId = (id) => {
  const value = Number(id);
  return Number.isFinite(value) && String(value) === String(id).trim() ? value : id;
};
function tree(rows) { const byId = new Map(rows.map((r) => [normalizeId(r.id), { ...r, children: [] }])); const roots = []; for (const item of byId.values()) item.parent_id && byId.has(normalizeId(item.parent_id)) ? byId.get(normalizeId(item.parent_id)).children.push(item) : roots.push(item); return roots; }
export async function getCompanySettings() { const rows = await (await collection('company_settings')).find().toArray(); return Object.fromEntries(rows.map((row) => [row.key, row.value])); }
export async function updateCompanySettings(data) { const store = await collection('company_settings'); await Promise.all(Object.entries(data).map(([key, value]) => store.updateOne({ key }, { $set: { key, value } }, { upsert: true }))); return getCompanySettings(); }
export async function getProductSpecificationOptions() {
  const document = await (await collection('product_specification_options')).findOne({ _id: 'catalog' });
  const groupByField = (items = []) => items.reduce((result, { field, value }) => {
    (result[field] ||= []).push(value);
    return result;
  }, {});
  return {
    options: groupByField(document?.options),
    deletedOptions: groupByField(document?.deletedOptions),
  };
}
export async function addProductSpecificationOption(field, value) {
  const store = await collection('product_specification_options');
  await store.updateOne(
    { _id: 'catalog' },
    { $setOnInsert: { options: [], deletedOptions: [] } },
    { upsert: true },
  );
  await store.updateOne({ _id: 'catalog' }, { $pull: { deletedOptions: { field, value } } });
  const catalog = await store.findOne({ _id: 'catalog' });
  const exists = catalog?.options?.some((option) => option.field === field && option.value.toLowerCase() === value.toLowerCase());
  if (!exists) await store.updateOne({ _id: 'catalog' }, { $addToSet: { options: { field, value } } }, { upsert: true });
  return getProductSpecificationOptions();
}
export async function deleteProductSpecificationOption(field, value) {
  const store = await collection('product_specification_options');
  await store.updateOne(
    { _id: 'catalog' },
    { $setOnInsert: { options: [], deletedOptions: [] } },
    { upsert: true },
  );
  await store.updateOne(
    { _id: 'catalog' },
    {
      $pull: { options: { field, value } },
      $addToSet: { deletedOptions: { field, value } },
    },
  );
  return getProductSpecificationOptions();
}
export async function getNavigationTree({ visibleOnly = true } = {}) { const rows = await (await collection('navigation_items')).find(visibleOnly ? { visible: true } : {}).sort({ display_order: 1 }).toArray(); return tree(rows); }
export async function getAllNavigationItems() { return (await collection('navigation_items')).find().sort({ display_order: 1 }).toArray(); }
export async function createNavigationItem(data) { const item = { id: await nextId('navigation_items'), parent_id: data.parentId || null, label: data.label, link: data.link || '', display_order: data.displayOrder ?? await nextDisplayOrder('navigation_items'), visible: data.visible !== false }; await (await collection('navigation_items')).insertOne(item); return item; }
export async function updateNavigationItem(id, data) { const store = await collection('navigation_items'); const normalizedId = normalizeId(id); const existing = await store.findOne({ id: normalizedId }); if (!existing) return null; const updated = { ...existing, parent_id: data.parentId ?? existing.parent_id, label: data.label ?? existing.label, link: data.link ?? existing.link, display_order: data.displayOrder ?? existing.display_order, visible: data.visible !== undefined ? data.visible : existing.visible }; await store.replaceOne({ id: normalizedId }, updated); return updated; }
export async function deleteNavigationItem(id) { await (await collection('navigation_items')).deleteOne({ id: normalizeId(id) }); return { success: true }; }
export async function reorderNavigationItems(orderedIds) { const store = await collection('navigation_items'); await Promise.all(orderedIds.map((id, index) => store.updateOne({ id: normalizeId(id) }, { $set: { display_order: index } }))); }
export async function getHomepageSections({ enabledOnly = true } = {}) { return (await collection('homepage_sections')).find(enabledOnly ? { enabled: true } : {}).sort({ display_order: 1 }).toArray(); }
export async function updateHomepageSection(sectionKey, data) { const store = await collection('homepage_sections'); const existing = await store.findOne({ section_key: sectionKey }); if (!existing) return null; const updated = { ...existing, title: data.title ?? existing.title, subtitle: data.subtitle ?? existing.subtitle, content: data.content ?? existing.content ?? {}, enabled: data.enabled !== undefined ? data.enabled : existing.enabled, display_order: data.displayOrder ?? existing.display_order }; await store.replaceOne({ section_key: sectionKey }, updated); return updated; }
