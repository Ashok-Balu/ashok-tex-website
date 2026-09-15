import { v2 as cloudinary } from 'cloudinary';
import { collection, closeDatabase } from '../server/db/database.js';

const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'MONGODB_URI'];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const folder = process.env.CLOUDINARY_FOLDER || 'ashok-tex';
const migrated = new Map();

async function uploadImage(url, publicId) {
  if (!url || typeof url !== 'string' || url.includes('res.cloudinary.com')) return url;
  if (migrated.has(url)) return migrated.get(url);

  try {
    const result = await cloudinary.uploader.upload(url, {
      folder,
      public_id: publicId,
      resource_type: 'image',
      overwrite: false,
      unique_filename: false,
      use_filename: false,
    });
    migrated.set(url, result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.warn(`[skip] Could not import ${url}: ${error.message}`);
    migrated.set(url, '');
    return '';
  }
}

async function migrateProducts() {
  const store = await collection('products');
  const rows = await store.find({ images: { $exists: true, $ne: [] } }).toArray();
  for (const product of rows) {
    const images = (await Promise.all((product.images || []).map(async (image, index) => ({
      ...image,
      url: await uploadImage(image.url, `products/${product.slug || product.id}/${index + 1}`),
    })))).filter((image) => image.url);
    if (images.some((image, index) => image.url !== product.images[index]?.url)) {
      await store.updateOne({ _id: product._id }, { $set: { images, updated_at: new Date() } });
      console.log(`[products] ${product.name}`);
    }
  }
}

async function migrateSimpleCollection(name, fields) {
  const store = await collection(name);
  const rows = await store.find({}).toArray();
  for (const row of rows) {
    const updates = {};
    for (const field of fields) {
      if (row[field]) updates[field] = await uploadImage(row[field], `${name}/${row.slug || row.id}/${field}`);
    }
    if (Object.keys(updates).some((field) => updates[field] !== row[field])) {
      await store.updateOne({ _id: row._id }, { $set: { ...updates, updated_at: new Date() } });
      console.log(`[${name}] ${row.name || row.customer_name || row.id}`);
    }
  }
}

async function migrateCompanySettings() {
  const store = await collection('company_settings');
  const rows = await store.find({}).toArray();
  for (const row of rows) {
    let value = row.value;
    if (row.key === 'legacyImage' && value) value = await uploadImage(value, 'company/legacy-image');
    if (row.key === 'managementMembers' && Array.isArray(value)) {
      value = await Promise.all(value.map(async (member, index) => ({
        ...member,
        image: await uploadImage(member.image, `company/management-${index + 1}`),
      })));
    }
    if (row.key === 'aboutGallery' && Array.isArray(value)) {
      value = await Promise.all(value.map(async (image, index) => ({
        ...image,
        url: await uploadImage(image.url, `company/gallery-${index + 1}`),
      })));
    }
    if (JSON.stringify(value) !== JSON.stringify(row.value)) {
      await store.updateOne({ _id: row._id }, { $set: { value } });
      console.log(`[company_settings] ${row.key}`);
    }
  }
}

try {
  await migrateProducts();
  await migrateSimpleCollection('categories', ['image', 'og_image']);
  await migrateSimpleCollection('testimonials', ['image']);
  await migrateCompanySettings();
  console.log(`Cloudinary migration complete. ${migrated.size} unique images processed.`);
} finally {
  await closeDatabase();
}
