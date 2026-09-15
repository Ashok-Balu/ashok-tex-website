import dotenv from 'dotenv';
import dns from 'node:dns';
import { MongoClient } from 'mongodb';

dotenv.config({ path: '.env.production' });

const sourceName = process.env.MONGODB_SOURCE_DATABASE || 'ashoktex';
const targetName = process.env.MONGODB_DATABASE || 'ashoktex_prod';
const sourceUri = process.env.MONGODB_SOURCE_URI || process.env.MONGODB_URI;
const targetUri = process.env.MONGODB_URI;
if (!sourceUri || !targetUri) throw new Error('MONGODB_URI is required.');
if (sourceName === targetName) throw new Error('Source and target databases must be different.');
if (process.env.MONGODB_DNS_SERVERS) {
  dns.setServers(process.env.MONGODB_DNS_SERVERS.split(',').map((server) => server.trim()).filter(Boolean));
}

const sourceClient = new MongoClient(sourceUri, {
  maxPoolSize: Number(process.env.MONGODB_POOL_MAX || 10),
});
const targetClient = new MongoClient(targetUri, {
  maxPoolSize: Number(process.env.MONGODB_POOL_MAX || 10),
});

try {
  await Promise.all([sourceClient.connect(), targetClient.connect()]);
  const source = sourceClient.db(sourceName);
  const target = targetClient.db(targetName);
  const collections = await source.listCollections().toArray();

  for (const metadata of collections) {
    const sourceCollection = source.collection(metadata.name);
    const targetCollection = target.collection(metadata.name);
    const documents = await sourceCollection.find({}).toArray();
    if (documents.length) {
      await targetCollection.deleteMany({});
      await targetCollection.insertMany(documents, { ordered: false });
    }

    const indexes = await sourceCollection.listIndexes().toArray();
    for (const index of indexes) {
      if (index.name === '_id_') continue;
      const { key, name, ...options } = index;
      await targetCollection.createIndex(key, { ...options, name });
    }
    console.log(`[copy] ${metadata.name}: ${documents.length} documents`);
  }

  console.log(`Copied ${collections.length} collections from ${sourceName} to ${targetName}.`);
} finally {
  await Promise.all([sourceClient.close(), targetClient.close()]);
}
