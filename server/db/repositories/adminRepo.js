import bcrypt from 'bcryptjs';
import { query } from '../database.js';

export async function getAdminByUsername(username) {
  return (await query('SELECT * FROM admin_users WHERE username = $1', [username])).rows[0];
}

export async function createAdminUser(username, password, role = 'super_admin') {
  const passwordHash = await bcrypt.hash(password, 10);
  return (await query('INSERT INTO admin_users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role', [username, passwordHash, role])).rows[0];
}

export async function verifyAdminPassword(username, password) {
  try {
    const user = await getAdminByUsername(username);
    if (!user) {
      console.warn('Admin user not found:', username);
      return null;
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    return valid ? { id: user.id, username: user.username, role: user.role } : null;
  } catch (error) {
    console.error('Error verifying admin password:', error.message);
    throw error;
  }
}

export async function recordAudit({ username, action, entity, entityId, oldValue, newValue }) {
  await query('INSERT INTO audit_log (username, action, entity, entity_id, old_value, new_value) VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb)', [username, action, entity, String(entityId ?? ''), oldValue ? JSON.stringify(oldValue) : null, newValue ? JSON.stringify(newValue) : null]);
}
