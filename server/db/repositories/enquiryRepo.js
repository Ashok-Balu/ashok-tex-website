import { query } from '../database.js';

function genId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export async function saveEnquiry(data) {
  const id = genId('ENQ');
  await query(`
    INSERT INTO enquiries (id, name, company, email, phone, country, product, product_id, category, category_id, quantity, unit, purpose, requirements, attachment, source_page, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 'New')
  `, [
    id,
    data.name || '', data.company || '', data.email || '', data.phone || '', data.country || '',
    data.product || '', data.productId || null, data.category || '', data.categoryId || null,
    data.quantity ?? null, data.unit || 'Meter', data.purpose || '', data.requirements || '',
    data.attachment || '', data.sourcePage || '/request-quote',
  ]);
  return getEnquiryById(id);
}

export async function getEnquiries({ status } = {}) {
  const result = status ? await query('SELECT * FROM enquiries WHERE status = $1 ORDER BY created_at DESC', [status]) : await query('SELECT * FROM enquiries ORDER BY created_at DESC');
  return result.rows;
}

export async function getEnquiryById(id) {
  return (await query('SELECT * FROM enquiries WHERE id = $1', [id])).rows[0];
}

export async function updateEnquiryStatus(id, status) {
  const valid = ['New', 'Contacted', 'Quoted', 'Follow-up', 'Closed'];
  if (!valid.includes(status)) return null;
  await query('UPDATE enquiries SET status = $1 WHERE id = $2', [status, id]);
  return getEnquiryById(id);
}

export async function deleteEnquiry(id) {
  await query('DELETE FROM enquiries WHERE id = $1', [id]);
  return { success: true };
}

export async function saveContactMessage(data) {
  const id = genId('MSG');
  await query(`
    INSERT INTO contacts (id, name, email, phone, message, status)
    VALUES ($1, $2, $3, $4, $5, 'New')
  `, [id, data.name || '', data.email || '', data.phone || '', data.message || '']);
  return (await query('SELECT * FROM contacts WHERE id = $1', [id])).rows[0];
}

export async function getContacts() {
  return (await query('SELECT * FROM contacts ORDER BY created_at DESC')).rows;
}

export async function updateContactStatus(id, status) {
  const valid = ['New', 'Read', 'Replied'];
  if (!valid.includes(status)) return null;
  await query('UPDATE contacts SET status = $1 WHERE id = $2', [status, id]);
  return (await query('SELECT * FROM contacts WHERE id = $1', [id])).rows[0];
}

export async function deleteContact(id) {
  await query('DELETE FROM contacts WHERE id = $1', [id]);
  return { success: true };
}
