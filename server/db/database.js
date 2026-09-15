import dotenv from 'dotenv';
import dns from 'node:dns';
import { MongoClient } from 'mongodb';

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is required. Copy .env.example to .env and set your MongoDB connection string.');
}

if (process.env.MONGODB_DNS_SERVERS) {
  dns.setServers(process.env.MONGODB_DNS_SERVERS.split(',').map((server) => server.trim()).filter(Boolean));
}

const client = new MongoClient(process.env.MONGODB_URI, {
  maxPoolSize: Number(process.env.MONGODB_POOL_MAX || 10),
});

let database;
let databasePromise;

export async function getDatabase() {
  if (database) return database;
  if (!databasePromise) {
    databasePromise = (async () => {
      await client.connect();
      const connectedDatabase = client.db(process.env.MONGODB_DATABASE || undefined);
      await Promise.all([
        connectedDatabase.collection('categories').createIndex({ slug: 1 }, { unique: true }),
        connectedDatabase.collection('products').createIndex({ slug: 1 }, { unique: true }),
        connectedDatabase.collection('admin_users').createIndex({ username: 1 }, { unique: true }),
        connectedDatabase.collection('website_visits').createIndex({ session_id: 1, path: 1, visited_date: 1 }, { unique: true }),
      ]);
      database = connectedDatabase;
      console.log(`[Database] Connected to MongoDB (${database.databaseName})`);
      return database;
    })().catch((error) => {
      databasePromise = undefined;
      throw error;
    });
  }
  return databasePromise;
}

export async function collection(name) {
  return (await getDatabase()).collection(name);
}

export async function nextId(name) {
  const counters = await collection('_counters');
  const result = await counters.findOneAndUpdate(
    { _id: name },
    { $inc: { value: 1 } },
    { upsert: true, returnDocument: 'after' },
  );
  const document = result?.value && typeof result.value === 'object' ? result.value : result;
  return document?.value;
}

export async function closeDatabase() {
  await client.close();
  database = undefined;
  databasePromise = undefined;
}

export default getDatabase;
