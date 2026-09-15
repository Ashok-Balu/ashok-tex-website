import bcrypt from 'bcryptjs';
import { collection, nextId } from './mongoHelpers.js';

export async function getAdminByUsername(username) { return (await collection('admin_users')).findOne({ username }); }
export async function createAdminUser(username, password, role = 'super_admin') {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: await nextId('admin_users'), username, password_hash: passwordHash, role, created_at: new Date() };
  await (await collection('admin_users')).insertOne(user);
  const { password_hash, ...safeUser } = user;
  return safeUser;
}
export async function updateAdminPassword(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  await (await collection('admin_users')).updateOne({ username }, { $set: { password_hash: passwordHash } });
  return getAdminByUsername(username);
}
export async function verifyAdminPassword(username, password) {
  const user = await getAdminByUsername(username);
  if (!user) return null;
  return (await bcrypt.compare(password, user.password_hash)) ? { id: user.id, username: user.username, role: user.role } : null;
}
export async function recordAudit({ username, action, entity, entityId, oldValue, newValue }) {
  await (await collection('audit_log')).insertOne({ id: await nextId('audit_log'), username: username || null, action, entity, entity_id: String(entityId ?? ''), old_value: oldValue || null, new_value: newValue || null, created_at: new Date() });
}
