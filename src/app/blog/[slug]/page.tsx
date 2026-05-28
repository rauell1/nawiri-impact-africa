import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import BlogDetailClient from "./BlogDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, cover_image: true, published_date: true, updatedAt: true },
  });

  if (!post) {
    return createMetadata({
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
      path: "/blog",
    });
  }

  return createMetadata({
    title: post.title,
    description: post.excerpt || "",
    path: `/blog/${slug}`,
    image: post.cover_image || undefined,
    type: "article",
    publishedTime: post.published_date?.toISOString(),
    modifiedTime: post.updatedAt?.toISOString(),
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug, status: "published" },
  });

  if (!post) {
    notFound();
  }

  return (
    <>
      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: createBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog & News", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        }}
      />

      <main id="main-content">
      {/* ── Back Link ─────────────────────────────────────────── */}
      <div className="bg-[var(--brand-background)] border-b border-[var(--border)]">
        <div className="container-site py-3">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-ui text-[var(--brand-text-muted)] hover:text-[var(--brand-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog &amp; News</span>
          </Link>
        </div>
      </div>

      {/* ── Cover Image ───────────────────────────────────────── */}
      {post.cover_image && (
        <div className="relative w-full aspect-[21/9] md:aspect-[21/8] overflow-hidden bg-[var(--brand-surface-warm)]">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      {/* ── Article Content ───────────────────────────────────── */}
      <article className="section-padding gradient-section-warm" aria-label="Blog post content">
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            {/* Meta row */}
            <BlogDetailClient
              category={post.category}
              date={formatDate(post.published_date)}
              authorName={post.author_name || undefined}
            />

            {/* Title */}
            <h1 className="mb-6">{post.title}</h1>

            {/* Body */}
            <div className="space-y-5">
              {post.body.split("\n").filter(Boolean).map((paragraph, i) => (
                <p
                  key={i}
                  className="font-body text-[1.125rem] leading-[1.75] text-[var(--brand-text-secondary)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </article>
    </main>
    </>
  );
}
