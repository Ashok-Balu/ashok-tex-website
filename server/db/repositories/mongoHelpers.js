import { collection, nextId } from '../database.js';

export { collection, nextId };

export function publicDocument(document) {
  if (!document) return null;
  const { _id, ...rest } = document;
  return rest;
}

export async function nextDisplayOrder(name) {
  const row = await (await collection(name)).find().sort({ display_order: -1 }).limit(1).next();
  return Number(row?.display_order ?? -1) + 1;
}

export function sortByOrder(left, right) {
  return Number(left.display_order || 0) - Number(right.display_order || 0) || String(left.name || left.label || '').localeCompare(String(right.name || right.label || ''));
}

export function withDates(document) {
  if (!document) return null;
  return { ...publicDocument(document), created_at: document.created_at || new Date(), updated_at: document.updated_at || new Date() };
}
