import { query, withTransaction } from '../database.js';
import { generateUniqueSlug } from '../../utils/slug.js';
import { getSubcategoryIds } from './categoryRepo.js';

async function slugExists(slug, excludeId) {
  const result = await query(excludeId ? 'SELECT id FROM products WHERE slug = $1 AND id != $2' : 'SELECT id FROM products WHERE slug = $1', excludeId ? [slug, excludeId] : [slug]);
  return result.rowCount > 0;
}

async function attachRelations(product) {
  if (!product) return product;
  const [images, attributes, category] = await Promise.all([
    query('SELECT * FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC, display_order ASC', [product.id]),
    query('SELECT * FROM product_attributes WHERE product_id = $1 ORDER BY display_order ASC', [product.id]),
    product.category_id ? query('SELECT * FROM categories WHERE id = $1', [product.category_id]) : { rows: [] },
  ]);
  return {
    ...product,
    tags: product.tags ? product.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
    images: images.rows.map((image) => ({ id: image.id, url: image.url, altText: image.alt_text, isPrimary: !!image.is_primary, displayOrder: image.display_order })),
    specifications: attributes.rows.filter((attribute) => attribute.value && String(attribute.value).trim()).map((attribute) => ({ id: attribute.id, label: attribute.name, value: attribute.unit ? `${attribute.value} ${attribute.unit}` : attribute.value, rawValue: attribute.value, unit: attribute.unit })),
    category: category.rows[0] ? { id: category.rows[0].id, name: category.rows[0].name, slug: category.rows[0].slug } : null,
  };
}

export async function listProducts({ categoryId, categorySlug, search, featured, latest, published = true, sort = 'display_order', page = 1, limit = 24, tags } = {}) {
  const clauses = [];
  const values = [];
  const add = (clause, value) => { values.push(value); clauses.push(clause.replace('?', `$${values.length}`)); };
  if (published !== 'all') add('published = ?', !!published);
  let categoryIds;
  if (categorySlug) { const category = (await query('SELECT id FROM categories WHERE slug = $1', [categorySlug])).rows[0]; categoryIds = category ? await getSubcategoryIds(category.id) : [-1]; }
  else if (categoryId) categoryIds = await getSubcategoryIds(categoryId);
  if (categoryIds) { const placeholders = categoryIds.map((id) => { values.push(id); return `$${values.length}`; }); clauses.push(`category_id IN (${placeholders.join(',')})`); }
  if (featured) clauses.push('featured = true');
  if (latest) clauses.push('is_latest = true');
  if (search && search.trim()) { values.push(`%${search.trim().toLowerCase()}%`); const placeholder = `$${values.length}`; clauses.push(`(LOWER(name) LIKE ${placeholder} OR LOWER(description) LIKE ${placeholder} OR LOWER(short_description) LIKE ${placeholder} OR LOWER(tags) LIKE ${placeholder} OR id IN (SELECT product_id FROM product_attributes WHERE LOWER(value) LIKE ${placeholder} OR LOWER(name) LIKE ${placeholder}) OR category_id IN (SELECT id FROM categories WHERE LOWER(name) LIKE ${placeholder}))`); }
  if (tags) for (const tag of (Array.isArray(tags) ? tags : [tags])) { values.push(`%,${tag.trim()},%`); clauses.push(`(',' || tags || ',') LIKE $${values.length}`); }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const order = { display_order: 'display_order ASC, name ASC', 'name-asc': 'name ASC', 'name-desc': 'name DESC', newest: 'created_at DESC', 'price-asc': 'price_min ASC', 'price-desc': 'price_max DESC', featured: 'featured DESC, display_order ASC' }[sort] || 'display_order ASC, name ASC';
  const total = (await query(`SELECT COUNT(*)::int AS count FROM products ${where}`, values)).rows[0].count;
  const offset = (Math.max(1, Number(page)) - 1) * Number(limit);
  const rows = await query(`SELECT * FROM products ${where} ORDER BY ${order} LIMIT $${values.length + 1} OFFSET $${values.length + 2}`, [...values, Number(limit), offset]);

  const productRows = rows.rows;
  const productIds = productRows.map((row) => row.id);
  const categoryIdsForRows = [...new Set(productRows.map((row) => row.category_id).filter(Boolean))];

  const [imagesResult, attributesResult, categoriesResult] = await Promise.all([
    productIds.length ? query('SELECT * FROM product_images WHERE product_id = ANY($1::int[]) ORDER BY product_id, is_primary DESC, display_order ASC', [productIds]) : { rows: [] },
    productIds.length ? query('SELECT * FROM product_attributes WHERE product_id = ANY($1::int[]) ORDER BY product_id, display_order ASC', [productIds]) : { rows: [] },
    categoryIdsForRows.length ? query('SELECT * FROM categories WHERE id = ANY($1::int[])', [categoryIdsForRows]) : { rows: [] },
  ]);

  const imageMap = new Map();
  for (const image of imagesResult.rows) {
    const key = Number(image.product_id);
    if (!imageMap.has(key)) imageMap.set(key, []);
    imageMap.get(key).push({ id: image.id, url: image.url, altText: image.alt_text, isPrimary: !!image.is_primary, displayOrder: image.display_order });
  }

  const attributeMap = new Map();
  for (const attribute of attributesResult.rows) {
    const key = Number(attribute.product_id);
    if (!attributeMap.has(key)) attributeMap.set(key, []);
    attributeMap.get(key).push({ id: attribute.id, label: attribute.name, value: attribute.unit ? `${attribute.value} ${attribute.unit}` : attribute.value, rawValue: attribute.value, unit: attribute.unit });
  }

  const categoryMap = new Map();
  for (const category of categoriesResult.rows) {
    categoryMap.set(Number(category.id), { id: category.id, name: category.name, slug: category.slug });
  }

  const data = productRows.map((product) => ({
    ...product,
    tags: product.tags ? product.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
    images: (imageMap.get(Number(product.id)) || []).sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.displayOrder - b.displayOrder),
    specifications: (attributeMap.get(Number(product.id)) || []).filter((attribute) => attribute.rawValue && String(attribute.rawValue).trim()),
    category: categoryMap.get(Number(product.category_id)) || null,
  }));

  return { data, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) || 1 } };
}

export async function getProductBySlug(slug, { publishedOnly = true } = {}) { const result = await query(`SELECT * FROM products WHERE slug = $1${publishedOnly ? ' AND published = true' : ''}`, [slug]); return attachRelations(result.rows[0]); }
export async function getProductById(id) { return attachRelations((await query('SELECT * FROM products WHERE id = $1', [id])).rows[0]); }
export async function incrementViewCount(id) { await query('UPDATE products SET view_count = view_count + 1 WHERE id = $1', [id]); }

export async function getRelatedProducts(product, limit = 6) {
  const productTags = Array.isArray(product.tags) ? product.tags : (product.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean);
  const sameCategory = product.category_id ? (await query('SELECT * FROM products WHERE category_id = $1 AND id != $2 AND published = true ORDER BY display_order ASC LIMIT $3', [product.category_id, product.id, limit])).rows : [];
  let results = await Promise.all(sameCategory.map(attachRelations));
  const existingIds = new Set([product.id, ...results.map((item) => item.id)]);
  if (results.length < limit && productTags.length) {
    const candidates = (await query('SELECT * FROM products WHERE published = true')).rows;
    for (const candidate of candidates) {
      if (results.length >= limit) break;
      if (existingIds.has(candidate.id)) continue;
      const candidateTags = (candidate.tags || '').split(',').map((tag) => tag.trim());
      if (candidateTags.some((tag) => productTags.includes(tag))) { results.push(await attachRelations(candidate)); existingIds.add(candidate.id); }
    }
  }
  if (results.length < limit) {
    const filler = (await query('SELECT * FROM products WHERE published = true ORDER BY display_order ASC')).rows.filter((candidate) => !existingIds.has(candidate.id)).slice(0, limit - results.length);
    results = results.concat(await Promise.all(filler.map(attachRelations)));
  }
  return results.slice(0, limit);
}

export async function getFilterFacets({ categorySlug } = {}) {
  let result;
  if (categorySlug) { const category = (await query('SELECT id FROM categories WHERE slug = $1', [categorySlug])).rows[0]; const ids = category ? await getSubcategoryIds(category.id) : [-1]; result = await query('SELECT id FROM products WHERE category_id = ANY($1::int[]) AND published = true', [ids]); }
  else result = await query('SELECT id FROM products WHERE published = true');
  if (!result.rows.length) return {};
  const attributes = await query('SELECT name, value FROM product_attributes WHERE product_id = ANY($1::int[])', [result.rows.map((row) => row.id)]);
  const facets = {}; for (const row of attributes.rows) if (row.value) (facets[row.name] ||= new Set()).add(row.value);
  return Object.fromEntries(Object.entries(facets).map(([key, set]) => [key, Array.from(set).sort()]));
}

export async function createProduct(data) {
  const slug = await generateUniqueSlug(data.slug || data.name, slugExists);
  const max = (await query('SELECT COALESCE(MAX(display_order), -1)::int AS count FROM products')).rows[0].count;
  const result = await query('INSERT INTO products (category_id, name, slug, short_description, description, price_min, price_max, price_unit, moq_value, moq_unit, tags, published, featured, is_latest, display_order, seo_title, seo_description, og_image) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *', [data.categoryId || null, data.name, slug, data.shortDescription || '', data.description || '', data.priceMin ?? null, data.priceMax ?? null, data.priceUnit || 'Meter', data.moqValue || '', data.moqUnit || 'Meter', Array.isArray(data.tags) ? data.tags.join(',') : data.tags || '', data.published !== false, !!data.featured, !!data.isLatest, data.displayOrder ?? max + 1, data.seoTitle || '', data.seoDescription || '', data.ogImage || '']);
  const productId = result.rows[0].id;
  if (Array.isArray(data.images)) await setProductImages(productId, data.images);
  if (Array.isArray(data.specifications || data.attributes)) await setProductAttributes(productId, data.specifications || data.attributes);
  return getProductById(productId);
}

export async function updateProduct(id, data) {
  const existing = await getProductById(id); if (!existing) return null;
  const slug = data.slug && data.slug !== existing.slug ? await generateUniqueSlug(data.slug, slugExists, id) : existing.slug;
  await query('UPDATE products SET category_id=$1,name=$2,slug=$3,short_description=$4,description=$5,price_min=$6,price_max=$7,price_unit=$8,moq_value=$9,moq_unit=$10,tags=$11,published=$12,featured=$13,is_latest=$14,display_order=$15,seo_title=$16,seo_description=$17,og_image=$18,updated_at=CURRENT_TIMESTAMP WHERE id=$19', [data.categoryId ?? existing.category_id, data.name ?? existing.name, slug, data.shortDescription ?? existing.short_description, data.description ?? existing.description, data.priceMin ?? existing.price_min, data.priceMax ?? existing.price_max, data.priceUnit ?? existing.price_unit, data.moqValue ?? existing.moq_value, data.moqUnit ?? existing.moq_unit, data.tags !== undefined ? (Array.isArray(data.tags) ? data.tags.join(',') : data.tags) : existing.tags, data.published !== undefined ? !!data.published : !!existing.published, data.featured !== undefined ? !!data.featured : !!existing.featured, data.isLatest !== undefined ? !!data.isLatest : !!existing.is_latest, data.displayOrder ?? existing.display_order, data.seoTitle ?? existing.seo_title, data.seoDescription ?? existing.seo_description, data.ogImage ?? existing.og_image, id]);
  if (Array.isArray(data.images)) await setProductImages(id, data.images);
  if (Array.isArray(data.specifications || data.attributes)) await setProductAttributes(id, data.specifications || data.attributes);
  return getProductById(id);
}

export async function deleteProduct(id) { await query('DELETE FROM products WHERE id = $1', [id]); return { success: true }; }
export async function duplicateProduct(id) { const original = await getProductById(id); if (!original) return null; return createProduct({ categoryId: original.category_id, name: `${original.name} (Copy)`, shortDescription: original.short_description, description: original.description, priceMin: original.price_min, priceMax: original.price_max, priceUnit: original.price_unit, moqValue: original.moq_value, moqUnit: original.moq_unit, tags: original.tags, published: false, featured: false, isLatest: false, seoTitle: original.seo_title, seoDescription: original.seo_description, images: original.images, specifications: original.specifications.map((item) => ({ name: item.label, value: item.rawValue, unit: item.unit })) }); }
export async function reorderProducts(orderedIds) { await withTransaction(async (client) => { for (const [index, id] of orderedIds.entries()) await client.query('UPDATE products SET display_order=$1 WHERE id=$2', [index, id]); }); }
export async function setProductImages(productId, images) { await withTransaction(async (client) => { await client.query('DELETE FROM product_images WHERE product_id=$1', [productId]); for (const [index, image] of images.entries()) await client.query('INSERT INTO product_images (product_id,url,alt_text,display_order,is_primary) VALUES ($1,$2,$3,$4,$5)', [productId, image.url, image.altText || '', index, !!image.isPrimary || index === 0]); }); }
export async function setProductAttributes(productId, attributes) { await withTransaction(async (client) => { await client.query('DELETE FROM product_attributes WHERE product_id=$1', [productId]); for (const [index, attribute] of attributes.entries()) { const name = attribute.name || attribute.label; const value = attribute.value ?? attribute.rawValue; if (name && value !== undefined && value !== null && String(value).trim()) await client.query('INSERT INTO product_attributes (product_id,name,value,unit,display_order) VALUES ($1,$2,$3,$4,$5)', [productId, name, String(value), attribute.unit || '', index]); } }); }
export async function getDashboardStats() { const names = ['totalProducts','publishedProducts','featuredProducts','totalCategories','totalTestimonials','totalEnquiries','newEnquiries']; const sql = ['SELECT COUNT(*)::int AS c FROM products','SELECT COUNT(*)::int AS c FROM products WHERE published=true','SELECT COUNT(*)::int AS c FROM products WHERE featured=true','SELECT COUNT(*)::int AS c FROM categories','SELECT COUNT(*)::int AS c FROM testimonials','SELECT COUNT(*)::int AS c FROM enquiries',"SELECT COUNT(*)::int AS c FROM enquiries WHERE status='New'"]; const counts = await Promise.all(sql.map((statement) => query(statement))); const mostViewed = (await query('SELECT id,name,slug,view_count FROM products ORDER BY view_count DESC LIMIT 5')).rows; return { ...Object.fromEntries(names.map((name, index) => [name, counts[index].rows[0].c])), mostViewed }; }