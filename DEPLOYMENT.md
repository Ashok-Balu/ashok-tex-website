# Ashok Tex production deployment

## 1. MongoDB Atlas

Create the MongoDB Atlas cluster named `ashoktex` and a database user. Add the deployment server IP to the Atlas Network Access list, then set `MONGODB_URI` and `MONGODB_DATABASE=ashoktex_prod`. The API creates the required collections and indexes on first connection.

The application stores categories, products, testimonials, enquiries, contacts, company settings, navigation, homepage sections, admin users, audit logs, and visitor analytics in MongoDB. Product images and specifications are embedded in product documents.

## 2. Cloudinary

Create a Cloudinary account and set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. Admin image uploads are sent to the `CLOUDINARY_FOLDER` folder and the returned secure URL is stored in MongoDB. Keep the API secret server-only; never prefix it with `VITE_`.

After MongoDB and Cloudinary are configured, run `npm run migrate:cloudinary` once to move existing product, category, testimonial, and company gallery URLs into Cloudinary. The migration skips URLs already hosted by Cloudinary and is safe to rerun.

## 3. Environment variables

Set these in local `.env.production` and in Vercel for Development, Preview, and Production:

`MONGODB_URI`, `MONGODB_DATABASE`, `MONGODB_POOL_MAX`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SITE_URL`, `VITE_API_BASE_URL`, and the existing SMTP variables when email notifications are required.

The MongoDB credentials supplied for local development are already in `.env.local`, which is ignored by Git. Rotate any credentials that may have been exposed in chat, logs, or a committed file.

## 4. Local and Vercel deployment

Run `npm run dev:all` after setting the environment. The Express API is exposed by `api/index.js`; Vercel routes `/api/*` and `/sitemap.xml` to it. No production data or uploaded media is written to the Vercel filesystem.

Check `/api/health`, the home page, product/category pages, admin login, CRUD operations, visitor analytics, and an image upload after deployment. Confirm that Atlas Network Access allows the deployed server to connect.

## 5. Backups and migration

Use `mongodump`/`mongorestore` or Atlas backups for MongoDB. Cloudinary assets are separate from MongoDB backups, so retain Cloudinary's asset backup/versioning or periodically export the media library. Existing SQLite/PostgreSQL migration scripts are not part of the MongoDB runtime; import legacy data into the collections before production launch and verify product, category, and image counts.
