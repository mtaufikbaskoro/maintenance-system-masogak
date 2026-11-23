# Maintenance System

Next.js 16 application using Prisma 7 and a MySQL-compatible database.

## Local development

1. Install dependencies with `npm install`.
2. Create `.env` and set `DATABASE_URL` to your MySQL connection string:

   ```dotenv
   DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
   ```

3. Ensure the database schema has been applied, then run `npm run dev`.
4. Open [http://localhost:3000](http://localhost:3000).

The Prisma schema is in `prisma/schema.prisma`. Do not use a local-only database URL for a Vercel deployment.

## Deploy on Vercel

1. Push this project to a Git provider and import it into Vercel. Vercel detects Next.js; keep the default build command (`npm run build`).
2. Provision a remotely accessible MySQL database (for example, through a managed MySQL provider) and apply the schema in `prisma/schema.prisma`.
3. In **Project → Settings → Environment Variables**, add `DATABASE_URL` with the provider's MySQL connection URL. Add it for Production and Preview as appropriate. Treat it as a secret and never commit it.
4. Redeploy after setting or changing environment variables. Verify the deployment and database-backed flows.

The Vercel build runs `prisma db push` before building, syncing the Prisma schema directly to the configured database. This does not keep migration history, and schema changes that may lose data are not automatically accepted. Use a managed MySQL database with backups, and test schema changes against a preview database before deploying to production.
