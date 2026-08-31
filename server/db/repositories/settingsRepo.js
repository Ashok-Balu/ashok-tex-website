import { query, withTransaction } from '../database.js';

// ─── Company Settings (flat key/value store) ───────────────────────────────
export async function getCompanySettings() {
  const rows = (await query('SELECT * FROM company_settings')).rows;
  const settings = {};
  for (const row of rows) {
    try { settings[row.key] = JSON.parse(row.value); } catch { settings[row.key] = row.value; }
  }
  return settings;
}

export async function updateCompanySettings(data) {
  await withTransaction(async (client) => {
    for (const [key, value] of Object.entries(data)) await client.query('INSERT INTO company_settings (key, value) VALUES ($1, $2) ON CONFLICT(key) DO UPDATE SET value = EXCLUDED.value', [key, JSON.stringify(value)]);
  });
  return getCompanySettings();
}

// ─── Navigation ─────────────────────────────────────────────────────────────
export async function getNavigationTree({ visibleOnly = true } = {}) {
  const where = visibleOnly ? 'WHERE visible = true' : '';
  const rows = (await query(`SELECT * FROM navigation_items ${where} ORDER BY display_order ASC`)).rows;
  const byId = new Map(rows.map((r) => [r.id, { ...r, children: [] }]));
  const roots = [];
  for (const item of byId.values()) {
    if (item.parent_id && byId.has(item.parent_id)) byId.get(item.parent_id).children.push(item);
    else roots.push(item);
  }
  return roots;
}

export async function getAllNavigationItems() {
  return (await query('SELECT * FROM navigation_items ORDER BY display_order ASC')).rows;
}

export async function createNavigationItem(data) {
  const maxOrder = (await query('SELECT COALESCE(MAX(display_order), -1)::int AS count FROM navigation_items')).rows[0].count;
  return (await query('INSERT INTO navigation_items (parent_id, label, link, display_order, visible) VALUES ($1, $2, $3, $4, $5) RETURNING *', [data.parentId || null, data.label, data.link || '', data.displayOrder ?? maxOrder + 1, data.visible !== false])).rows[0];
}

export async function updateNavigationItem(id, data) {
  const existing = (await query('SELECT * FROM navigation_items WHERE id = $1', [id])).rows[0];
  if (!existing) return null;
  await query('UPDATE navigation_items SET parent_id = $1, label = $2, link = $3, display_order = $4, visible = $5 WHERE id = $6', [
      data.parentId ?? existing.parent_id,
      data.label ?? existing.label,
      data.link ?? existing.link,
      data.displayOrder ?? existing.display_order,
      data.visible !== undefined ? data.visible : existing.visible,
      id,
  ]);
  return (await query('SELECT * FROM navigation_items WHERE id = $1', [id])).rows[0];
}

export async function deleteNavigationItem(id) {
  await query('DELETE FROM navigation_items WHERE id = $1', [id]);
  return { success: true };
}

export async function reorderNavigationItems(orderedIds) {
  await withTransaction(async (client) => { for (const [index, id] of orderedIds.entries()) await client.query('UPDATE navigation_items SET display_order = $1 WHERE id = $2', [index, id]); });
}

// ─── Homepage Sections ──────────────────────────────────────────────────────
export async function getHomepageSections({ enabledOnly = true } = {}) {
  const where = enabledOnly ? 'WHERE enabled = true' : '';
  const rows = (await query(`SELECT * FROM homepage_sections ${where} ORDER BY display_order ASC`)).rows;
  return rows.map((r) => ({ ...r, content: safeParse(r.content) }));
}

function safeParse(value) {
  if (value && typeof value === 'object') return value;
  try { return JSON.parse(value); } catch { return {}; }
}

export async function updateHomepageSection(sectionKey, data) {
  const existing = (await query('SELECT * FROM homepage_sections WHERE section_key = $1', [sectionKey])).rows[0];
  if (!existing) return null;
  await query('UPDATE homepage_sections SET title = $1, subtitle = $2, content = $3::jsonb, enabled = $4, display_order = $5 WHERE section_key = $6', [
      data.title ?? existing.title,
      data.subtitle ?? existing.subtitle,
      data.content !== undefined ? JSON.stringify(data.content) : JSON.stringify(existing.content),
      data.enabled !== undefined ? data.enabled : existing.enabled,
      data.displayOrder ?? existing.display_order,
      sectionKey,
  ]);
  const row = (await query('SELECT * FROM homepage_sections WHERE section_key = $1', [sectionKey])).rows[0];
  return { ...row, content: safeParse(row.content) };
}
