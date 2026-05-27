# ─── Nawiri Impact Africa — Supabase Migration Guide ───────
#
# This guide walks you through migrating from the local SQLite
# prototype to Supabase PostgreSQL for production deployment.
#
# Prerequisites:
#   - A Supabase account (free tier works)
#   - Your Supabase project URL and database password
#
# ─────────────────────────────────────────────────────────────

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign up / log in
2. Click "New Project"
3. Set:
   - Name: nawiri-production
   - Database Password: (generate a strong one, save it)
   - Region: af-south-1 (Johannesburg, closest to Kenya)
4. Click "Create new project" and wait for provisioning (~2 min)

## Step 2: Get Your Connection Strings

1. In Supabase dashboard → Settings → Database
2. Scroll to "Connection string" section
3. You need TWO connection strings:

   **Connection pooler (DATABASE_URL):**
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

   **Direct connection (DIRECT_URL):**
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

## Step 3: Update Prisma Schema

Edit `prisma/schema.prisma` and change the datasource:

```diff
 datasource db {
-  provider = "sqlite"
-  url      = env("DATABASE_URL")
+  provider = "postgresql"
+  url      = env("DATABASE_URL")
+  directUrl = env("DIRECT_URL")
 }
```

## Step 4: Update Environment Variables

Create/update your `.env` file:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
ADMIN_PASSWORD=your-secure-password
```

Also set these same variables in:
- Vercel: Settings → Environment Variables
- Supabase: (if running edge functions)

## Step 5: Push Schema to Supabase

```bash
# Generate Prisma client for PostgreSQL
npx prisma generate

# Create all tables in Supabase
npx prisma db push

# Seed the database with initial content
npx prisma db seed
```

## Step 6: Verify

```bash
# Check that tables were created
npx prisma studio
# Opens a visual database browser at localhost:5555
```

You should see all 10 tables:
- SiteSettings, HomeSettings, Programme, Story, BlogPost
- Report, Career, TeamMember, Partner, ContactSubmission

## Step 7: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo to Vercel and deploy from there.

## Step 8: Post-Deployment

1. Update `NEXT_PUBLIC_SITE_URL` to your actual domain
2. Set up Google Analytics (if using)
3. Configure Google Search Console with your sitemap URL
4. Test the admin dashboard at `/admin/login`

## Troubleshooting

### "relation does not exist"
Run `npx prisma db push` again — sometimes Supabase needs a moment.

### "Connection refused"
Make sure your IP is allowed. Supabase free tier allows all IPs.

### SSL Issues
The `?sslmode=require` parameter is automatically added by Supabase pooler URLs.
If using direct URL, add it manually.

### Images Not Loading
Supabase Storage needs to be configured for file uploads.
For now, keep images in `/public/images/` (deployed with the app).
For future: use Supabase Storage bucket for user-uploaded images.
