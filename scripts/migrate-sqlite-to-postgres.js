import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pg;
const root = path.dirname(fileURLToPath(import.meta.url));
const sqlitePath = path.join(root, '../data-storage/ashoktex.db');
const tables = [
  'categories', 'products', 'product_images', 'product_attributes', 'testimonials',
  'enquiries', 'contacts', 'company_settings', 'navigation_items', 'homepage_sections',
  'admin_users', 'audit_log',
];
const booleanColumns = new Set(['active', 'published', 'featured', 'is_latest', 'visible', 'enabled', 'is_primary']);
const jsonColumns = new Set(['content', 'old_value', 'new_value']);

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
if (!fs.existsSync(sqlitePath)) throw new Error(`SQLite database not found: ${sqlitePath}`);

const sqlite = new Database(sqlitePath, { readonly: true });
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

try {
  await pool.query('BEGIN');
  const schema = fs.readFileSync(path.join(root, '../server/db/schema.sql'), 'utf8');
  await pool.query(schema);
  for (const table of tables) {
    const columns = sqlite.prepare(`PRAGMA table_info(${table})`).all().map((column) => column.name);
    const rows = sqlite.prepare(`SELECT * FROM ${table}`).all();
    if (!columns.length || !rows.length) continue;
    const quotedColumns = columns.map((column) => `"${column}"`).join(', ');
    const values = [];
    const placeholders = rows.map((row, rowIndex) => {
      const rowValues = columns.map((column) => {
        let value = row[column];
        if (booleanColumns.has(column)) value = Boolean(value);
        if (jsonColumns.has(column) && value) value = typeof value === 'string' ? value : JSON.stringify(value);
        values.push(value);
        return `$${values.length}`;
      });
      return `(${rowValues.join(', ')})`;
    }).join(', ');
    const conflict = columns.includes('id')
      ? ' ON CONFLICT (id) DO NOTHING'
      : table === 'company_settings'
        ? ' ON CONFLICT (key) DO NOTHING'
        : table === 'homepage_sections'
          ? ' ON CONFLICT (section_key) DO NOTHING'
          : '';
    await pool.query(`INSERT INTO ${table} (${quotedColumns}) VALUES ${placeholders}${conflict}`, values);
    console.log(`${table}: ${rows.length} source row(s) processed`);
  }
  // Preserved SQLite IDs do not advance PostgreSQL identity sequences. Reset
  // each sequence so the next admin-created row receives a free ID.
  for (const table of tables) {
    if (table === 'company_settings') continue;
    const sequence = (await pool.query('SELECT pg_get_serial_sequence($1, $2) AS name', [table, 'id'])).rows[0].name;
    if (!sequence) continue;
    const maxId = Number((await pool.query(`SELECT COALESCE(MAX(id), 0) AS id FROM "${table}"`)).rows[0].id);
    await pool.query('SELECT setval($1::regclass, $2, $3)', [sequence, Math.max(maxId, 1), maxId > 0]);
    console.log(`${table}: identity sequence synchronized`);
  }
  await pool.query('COMMIT');
  console.log('SQLite migration completed. Existing PostgreSQL rows were preserved.');
} catch (error) {
  await pool.query('ROLLBACK');
  throw error;
} finally {
  sqlite.close();
  await pool.end();
}