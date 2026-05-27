# Nawiri Impact Africa — Developer & AI Instructions (`claude.md`)

This document is a comprehensive technical guide and instruction manual for any AI assistant (e.g., Claude, Cursor, Windsurf) or developer working on the **Nawiri Impact Africa** website prototype. It outlines the codebase architecture, design system, coding conventions, database schemas, and step-by-step instructions to implement remaining features.

---

## 1. Project Context & Stack

* **Framework**: Next.js 16 (App Router) with Server-Side Rendering (SSR) for public pages and dynamic APIs.
* **Database / ORM**: Prisma ORM with **SQLite** for development (`prisma/dev.db`) and instructions for staging/production deployment to **Supabase (PostgreSQL)**.
* **Styling**: Tailwind CSS 4 + custom CSS variables. Strict design tokens matching Kenyan-rooted brand identity (savannah gold, forest green, earth colors).
* **Package Manager**: Bun (`bun.lock` lockfile is used; run tasks with `bun run <script>`).
* **State & Forms**: Zustand (global states), React Hook Form + Zod (validations).
* **Authentication**: Managed internally in `/admin` via credentials cookie checks, ready for integration with NextAuth.
* **Animations**: Framer Motion for scroll-reveals and hover states.

---

## 2. Directory Layout & Architecture

The application is structured logically to separate public-facing routes from the CMS administration dashboard:

* `/src/app/(site)`: Public pages (Home, About, Programmes, Impact/Stories, Reports, Careers, Blog, Donate, Contact, Safeguarding).
* `/src/app/admin`: Password-protected CMS admin dashboard (/admin/site-settings, /admin/home-settings, /admin/programmes, etc.).
* `/src/app/api`: Serverless API endpoints for client form submissions, admin authentication, data CRUD, and revalidation.
* `/src/components/ui`: Shadcn UI interactive design system components.
* `/src/components/home` & `/src/components/layout`: Specialized presentation blocks and shell layouts.
* `/src/lib`: Core utilities including Prisma Database Client (`db.ts`), SEO metadata generator (`seo.ts`), and helper functions.

---

## 3. Database Relations & Schema Reference

The database runs on **Prisma** under SQLite by default, which can be swapped to Supabase by changing the provider in `prisma/schema.prisma`.

### Key Models & Schemas

1. **SiteSettings**: Global configuration.
   * `id`: `"main"` (Single row enforcement)
   * `site_name`, `site_tagline`, `logo_url`, `primary_color`, `secondary_color`, `contact_email`, `physical_address`, `footer_links` (JSON string)
2. **HomeSettings**: Landing page configuration.
   * `id`: `"main"`
   * `hero_headline`, `hero_subheadline`, `hero_cta_primary_label`, `hero_cta_primary_url`, `hero_background_image`, `stats` (JSON string containing `{ number, label, icon, prefix, suffix }`), `featured_story_id` (Relates to Story)
3. **Programme**: CRUD-managed areas of work.
   * `id` (cuid), `title`, `slug` (unique), `short_description`, `full_description` (richtext HTML), `cover_image`, `icon`, `target_beneficiaries`, `key_activities` (JSON string)
4. **Story**: Impact stories.
   * `id` (cuid), `title`, `slug` (unique), `excerpt`, `author_name`, `author_role`, `cover_image`, `body`, `programme_id`, `location`, `published_date`, `is_featured` (boolean), `pull_quote`
5. **Report**: PDF documents library.
   * `id`, `title`, `document_type` (Annual Report, Financial Statement, etc.), `year` (Int), `file_url` (PDF), `cover_image`
6. **Career**: Job listing entries.
   * `id`, `job_title`, `department`, `location`, `employment_type`, `requirements`, `application_deadline`, `status` (open, closed)

---

## 4. Coding Conventions & Standards

When writing or modifying code in this project, strictly adhere to the following principles:

### A. Next.js 16 Component Boundaries
* **Server Components (Default)**: All pages in `(site)` should remain Server Components to ensure optimal SEO and fast time-to-first-byte (TTFB). Fetch data directly via Prisma:
  ```typescript
  import { db } from "@/lib/db";
  const data = await db.programme.findMany();
  ```
* **Client Components**: Restrict client components to interactive elements (forms, menus, dashboards, animations). Annotate with `"use client"` at the top of the file.

### B. Brand Theme & Styling Control
* Avoid using static tailwind colors (e.g., `bg-green-600` or `text-blue-500`) for primary elements.
* **Always use CSS Brand Variables**:
  * Brand Primary (Gold): `var(--brand-secondary)`
  * Brand Deep Green: `var(--brand-primary)`
  * Brand Background (Warm Off-white): `var(--brand-background)`
  * Primary Text Color: `var(--brand-text-primary)`
  * Muted Text Color: `var(--brand-text-muted)`
* Use Tailwind utility classes that wrap variables, or standard styles where custom values are loaded from the CMS settings:
  ```tsx
  <button style={{ backgroundColor: settings.primary_color }} className="text-white">
    {label}
  </button>
  ```

---

## 5. Guide to Implementing Missing Features

During our audit, we identified several instructions from the master prompt that need to be fully implemented. Follow these instructions to build them:

### A. Implementing Safeguarding in Database & CMS
Currently, the safeguarding page is static. To make it dynamic:
1. **Schema Update**: Add a `SafeguardingSettings` model to `prisma/schema.prisma`:
   ```prisma
   model SafeguardingSettings {
     id                      String   @id @default("main")
     safeguarding_headline   String   @default("Safeguarding & Accountability")
     commitment_statement    String   @default("...")
     reporting_contact_email String   @default("safeguarding@nawiriimpactafrica.org")
     policy_documents        String   @default("[]") // JSON array of { title: string, file_url: string }
     last_reviewed_date      DateTime @default(now())
     updatedAt               DateTime @updatedAt
   }
   ```
2. **Migration & Seed**: Run `bun run db:push` or create a migration. Add default data in `prisma/seed.ts`.
3. **Admin Page**: Create `src/app/admin/safeguarding/page.tsx` with a dashboard form to update the headline, statement, email, last reviewed date, and manage policy documents upload.
4. **Public Page Update**: In `src/app/safeguarding/page.tsx`, fetch this new data and map the files dynamically.

### B. Implementing the About Page Editor in CMS
The About page is currently static (vision, values, history timeline).
1. **Schema Update**: Add an `AboutSettings` model:
   ```prisma
   model AboutSettings {
     id                String   @id @default("main")
     about_headline    String   @default("About Nawiri Impact Africa")
     about_body        String   @default("...")
     mission_statement String   @default("...")
     vision_statement  String   @default("...")
     values            String   @default("[]") // JSON of array of { title, icon, description }
     about_hero_image  String   @default("/images/about-hero.jpg")
     history_timeline  String   @default("[]") // JSON of { year, event }
     updatedAt         DateTime @updatedAt
   }
   ```
2. **Admin Interface**: Create `src/app/admin/about-settings/page.tsx` containing forms to update mission, vision, drag-and-drop timeline items, and add/edit/remove value cards.
3. **Public Page Update**: In `src/app/about/page.tsx`, fetch `AboutSettings` and replace all static markup with dynamic databases fields.

### C. Injected Global Brand Colors and Dynamic Metadata
To enable dynamic styling directly from the CMS:
1. **Dynamic Style Injection**: In `src/app/layout.tsx`, fetch `SiteSettings` from the database. Inject the primary and secondary colors as custom CSS variables inline on the `<html>` or `<body>` element:
   ```tsx
   const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
   
   return (
     <html 
       lang="en" 
       style={{ 
         "--color-primary": settings?.primary_color || "#1B5E20",
         "--color-secondary": settings?.secondary_color || "#D4A017" 
       } as React.CSSProperties}
     >
       ...
     </html>
   );
   ```
2. **Dynamic Metadata generation**: Implement `generateMetadata()` in `layout.tsx` and main dynamic pages (e.g. `/programmes/[slug]`, `/stories/[slug]`, `/blog/[slug]`) to query the database and generate custom, SEO-rich metadata matching titles and descriptions from the CMS records.

---

## 6. Verification Steps & QA Checklist

After completing any code modifications, run the following verification pipeline:
1. **Database Check**: Run `bun run db:generate` to update Typescript types.
2. **Type Check**: Ensure there are no compile-time errors by running `bun run tsc --noEmit`.
3. **Build Check**: Run `bun run build` to confirm the production bundle compiles correctly.
4. **Performance Validation**: Use Google Lighthouse / Chrome DevTools to ensure home page weight is under 1.5MB and Largest Contentful Paint (LCP) is under 2.5s.
