import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar } from "lucide-react";
import BlogListClient from "./BlogListClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Blog & News",
  description:
    "Stay informed about Nawiri Impact Africa's programmes, impact stories, and organisational updates from across Kenya.",
  path: "/blog",
});

export default async function BlogPage() {
  let posts: any[] = [];
  try {
    posts = await db.blogPost.findMany({
      where: { status: "published" },
      orderBy: { published_date: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        cover_image: true,
        category: true,
        author_name: true,
        published_date: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
  }

  return (
    <main id="main-content">
      {/* ── Hero Section ──────────────────────────────────────── */}
      <section
        className="gradient-hero section-padding-generous"
        aria-label="Blog & News header"
      >
        <div className="container-site text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-ui text-white/70 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <span className="text-overline text-[var(--brand-secondary-light)] mb-3 block">
            Our Latest Updates
          </span>
          <h1 className="text-display text-white mb-4">Blog &amp; News</h1>
          <p className="text-prose-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.85)" }}>
            Stories of impact, programme updates, humanitarian response reports,
            and organisational news from across Kenya.
          </p>
        </div>
      </section>

      {/* ── Blog Grid ─────────────────────────────────────────── */}
      <section className="section-padding gradient-section-warm" aria-label="All blog posts">
        <div className="container-site">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-prose text-[var(--brand-text-muted)] text-lg">
                No posts published yet. Check back soon for updates from the field.
              </p>
            </div>
          ) : (
            <>
              <p className="text-label text-[var(--brand-text-muted)] mb-8 font-ui">
                {posts.length} {posts.length === 1 ? "article" : "articles"}
              </p>
              <BlogListClient posts={posts} />
            </>
          )}
        </div>
      </section>
    </main>
  );
}
