# Nawiri Impact Africa — Rollback & Emergency Recovery Runbook (`rollback.md`)

This runbook describes the detailed procedures to reverse code modifications, restore databases, and roll back failing production deployments for the Nawiri Impact Africa web application.

---

## 1. Code Level Rollbacks (Git)

In case a broken feature or regression is pushed to the main repository, follow these steps:

### Scenario A: Reverting the Most Recent Commit
If a commit was pushed to `main` and is failing tests, revert it immediately to generate a clean-up commit:
```bash
# 1. Identify the bad commit hash (e.g. 5a4b3c2)
git log -n 5

# 2. Revert the commit (creates a new commit that reverses the changes)
git revert 5a4b3c2

# 3. Push to GitHub to trigger Vercel redeployment
git push origin main
```

### Scenario B: Hard Resetting to a Previous Stable State
If the codebase is heavily compromised and you need to reset the branch completely to a specific commit:
```bash
# WARNING: This discards all commits and local changes after the target stable commit
git reset --hard <stable-commit-hash>

# Force push to GitHub (use with caution, coordinates with other developers)
git push origin main --force
```

### Scenario C: Hotfixing Production Directly
If a bug is found in production but you don't want to roll back other features:
1. Create a hotfix branch from the stable release tag or commit:
   `git checkout -b hotfix/bug-description <stable-commit-hash>`
2. Apply the fix and commit.
3. Merge back to `main` and push.

---

## 2. Database Schema & Migration Rollbacks (Prisma)

Since this project supports SQLite (local development) and Supabase/PostgreSQL (production), the rollback processes differ.

### A. Local Development (SQLite)
If a local database migration fails or you want to undo a schema change before staging:
```bash
# 1. Revert schema.prisma changes manually in your IDE.

# 2. Reset the local database completely (re-creates schema from stable schema.prisma and runs seed.ts)
bun run db:reset

# Or, if you want to undo a specific migration:
# Delete the folder under prisma/migrations/my_bad_migration
# Restore database from automatic backup:
cp prisma/dev.db.bak prisma/dev.db
```

### B. Production / Supabase (PostgreSQL)
If a migration fails during a staging or production release:
1. **Mark the Migration as Rolled Back**:
   Use Prisma CLI to mark the bad migration as failed/resolved if it became half-applied:
   ```bash
   npx prisma migrate resolve --rolled-back "20260527120000_bad_migration"
   ```
2. **Revert Schema changes**:
   Update `schema.prisma` to return to the original state.
3. **Generate a Correcting Migration**:
   ```bash
   npx prisma migrate dev --name revert_bad_migration
   ```
4. **Direct SQL Execution (Disaster Recovery)**:
   If Prisma is unable to execute a rollback due to schema conflicts, access the Supabase SQL editor directly to restore tables manually using SQL.

---

## 3. Serverless Deployment Rollbacks (Vercel)

Vercel stores immutable builds for every commit, allowing instant rollbacks without rebuilding.

### A. Dashboard Rollback (Recommended, Instant)
1. Go to the [Vercel Dashboard](https://vercel.com).
2. Select the **nawiri-impact-africa** project.
3. Go to the **Deployments** tab.
4. Locate the last stable deployment (marked green/active prior to the broken release).
5. Click the **three dots (...)** next to it and select **Promote to Production**.
6. Vercel will instantly route traffic to the selected stable build (under 2 seconds, no rebuild required).

### B. Vercel CLI Rollback
If you have Vercel CLI configured, you can promote a deployment hash from the command line:
```bash
# 1. List recent deployments to find the stable Deployment ID (e.g. dpl_stableHash)
vercel list

# 2. Instantly promote the stable deployment to production
vercel deploy --prod --archive=dpl_stableHash
```

---

## 4. Database Seed Data Recovery

If the database is working but data became corrupted or deleted by accident:
1. **Re-seed the Core Data**:
   The `prisma/seed.ts` is configured as an upsert sequence. Running it will restore all standard pages, programmes, initial impact stories, and site settings without deleting existing custom records:
   ```bash
   # Run the seed file using Bun
   bun run prisma db seed
   ```
2. **Full Reset (Staging Only)**:
   If you want to clear out all records and start with a fresh slate:
   ```bash
   bun run db:reset
   ```

---

## 5. Contact List / Message Submissions Recovery

Form submissions are stored in the database model `ContactSubmission`.
* **Prevention**: Forms are verified client-side (Zod) and validated server-side to prevent invalid records.
* **Extraction**: If the front-end fails but database is active, you can extract submissions safely using Prisma Studio:
  ```bash
  npx prisma studio
  ```
  This opens an interactive data explorer at `http://localhost:5555` to view, filter, and export message records.
