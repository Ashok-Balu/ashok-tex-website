import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required. Copy .env.example to .env and set the Supabase connection string before running npm run server.');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DATABASE_POOL_MAX || 10),
  min: 2,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
  statement_timeout: 30000,
});

pool.on('error', (error) => {
  console.error('[Database Pool Error]', error.message, error.stack);
});

pool.on('connect', () => {
  console.log('[Database] Connected to PostgreSQL');
});

export async function query(text, values = []) {
  return pool.query(text, values);
}

export async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function closeDatabase() {
  await pool.end();
}

export default pool;

/*
 * The canonical schema lives in server/db/schema.sql and is applied through
 * Supabase migrations. Keeping schema DDL out of the request path prevents a
 * Vercel function from trying to mutate the database on every cold start.
 */
