import { query, withTransaction } from '../database.js';

export async function getPublishedTestimonials() {
  return (await query('SELECT * FROM testimonials WHERE published = true ORDER BY display_order ASC, id DESC')).rows;
}

export async function getAllTestimonials() {
  return (await query('SELECT * FROM testimonials ORDER BY display_order ASC, id DESC')).rows;
}

export async function getTestimonialById(id) {
  return (await query('SELECT * FROM testimonials WHERE id = $1', [id])).rows[0];
}

export async function createTestimonial(data) {
  const maxOrder = (await query('SELECT COALESCE(MAX(display_order), -1)::int AS count FROM testimonials')).rows[0].count;
  const result = await query('INSERT INTO testimonials (customer_name, role, quote, image, rating, published, display_order) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [data.customerName, data.role || '', data.quote, data.image || '', data.rating ?? 5, data.published !== false, data.displayOrder ?? maxOrder + 1]);
  return result.rows[0];
}

export async function updateTestimonial(id, data) {
  const existing = await getTestimonialById(id);
  if (!existing) return null;
  await query('UPDATE testimonials SET customer_name = $1, role = $2, quote = $3, image = $4, rating = $5, published = $6, display_order = $7 WHERE id = $8', [data.customerName ?? existing.customer_name, data.role ?? existing.role, data.quote ?? existing.quote, data.image ?? existing.image, data.rating ?? existing.rating, data.published !== undefined ? data.published : existing.published, data.displayOrder ?? existing.display_order, id]);
  return getTestimonialById(id);
}

export async function deleteTestimonial(id) {
  await query('DELETE FROM testimonials WHERE id = $1', [id]);
  return { success: true };
}

export async function reorderTestimonials(orderedIds) {
  await withTransaction(async (client) => { for (const [index, id] of orderedIds.entries()) await client.query('UPDATE testimonials SET display_order = $1 WHERE id = $2', [index, id]); });
}
