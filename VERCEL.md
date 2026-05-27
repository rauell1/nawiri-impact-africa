# Vercel — Nawiri Impact Africa

## Environment Variables

Set these in your Vercel project settings (Settings → Environment Variables):

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SITE_URL` | Your production domain (e.g. `https://nawiri.org`) | Yes |
| `DATABASE_URL` | Supabase PostgreSQL connection string | Yes |
| `DIRECT_URL` | Supabase direct connection (for Prisma migrations) | Yes |
| `ADMIN_PASSWORD` | Admin dashboard login password | Yes |

## Build Configuration

- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `npx prisma generate && npx prisma db push && next build`
- **Output Directory**: `.next`
- **Install Command**: `bun install`

## Supabase Migration

Before deploying, migrate from SQLite to Supabase PostgreSQL:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy the project reference and database password
3. Update your `.env` with the Supabase connection strings
4. Run: `npx prisma db push` (this creates tables in Supabase)
5. Run: `npx prisma db seed` (this populates initial data)
6. Deploy to Vercel

## Database Provider Change

In `prisma/schema.prisma`, change:
```
provider = "sqlite"
```
to:
```
provider = "postgresql"
```

And update the `url` in the `datasource` block.
