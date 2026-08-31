Check `/api/health`, the home page, product/category pages, admin login, CRUD operations, and an image upload after deployment. Confirm successful admin writes create rows in `audit_log` without storing passwords or uploaded file contents.
# Ashok Tex production deployment

## 1. Supabase

Create a Supabase project, open SQL Editor, and run `server/db/schema.sql`. Create a public Storage bucket named `uploads` (or use another name in `SUPABASE_STORAGE_BUCKET`). Restrict uploads to authenticated server operations by leaving the bucket policies closed to anonymous writes; the server uses the service-role key and never sends it to the browser. Public reads are appropriate for the current product image URLs. Use signed URLs instead if the bucket must be private.

The schema currently contains the application’s actual entities: categories, products, product images, product attributes, testimonials, enquiries, contacts, company settings, navigation items, homepage sections, admin users, and audit log. There are no orders, customer accounts, variants, addresses, or subcategories as separate tables in this codebase; subcategories are represented by `categories.parent_id`.

## 2. Migrate the existing database

Keep `data-storage/ashoktex.db` as the source backup. Copy `.env.example` to `.env`, set `DATABASE_URL`, then run:

```text
npm run migrate:sqlite
```

The script reads the existing SQLite schema/data, applies the PostgreSQL schema, preserves integer IDs, converts SQLite flags to booleans, and skips existing rows with the same primary key. Take a Supabase backup before rerunning against a populated production database. Verify counts in Supabase for each table and manually verify representative category/product relationships and image URLs.

## 3. Environment variables

Set these in Vercel for Development, Preview, and Production as appropriate:

`DATABASE_URL`, `DATABASE_SSL`, `DATABASE_POOL_MAX`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_STORAGE_BUCKET`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SITE_URL`, `VITE_API_BASE_URL`, and the existing SMTP variables when email notifications are required. The publishable key is browser-safe; the secret key is server-only and must never be prefixed with `VITE_`. The current frontend uses the API for data access, so the VITE Supabase values are ready for future browser-side Supabase features but are not required by existing API calls.

## 4. Local and Vercel deployment

Run `npm run dev:all` locally after setting the environment. The Express API is exposed by `api/index.js`; Vercel uses `vercel.json` to route `/api/*` and `/sitemap.xml` to it. Import the GitHub repository into Vercel, set the environment variables, and deploy. The Vite build remains the existing frontend build and the API uses a bounded PostgreSQL pool suitable for serverless requests. No production data or uploaded media is written to the Vercel filesystem.

## 5. Domain and operations

In Vercel, add the GoDaddy or Hostinger domain and copy the displayed DNS records. At the registrar, add the Vercel A record for the apex domain and CNAME for `www` exactly as Vercel specifies, then wait for DNS/TLS verification. Check `/api/health`, the home page, product/category pages, admin login, CRUD operations, and an image upload after deployment.

Enable Supabase daily backups and point-in-time recovery on the paid production plan, and perform a test restore before launch. A backup strategy is not verified until a restore has been tested. Keep `ashoktex.db` archived until the migration is verified. Store future schema changes as reviewed SQL migrations and apply them in Supabase before deploying code that depends on them. Storage objects are separate from database backups, so periodically export or copy the `uploads` bucket as part of the media backup process and verify that representative image URLs still work after restore.