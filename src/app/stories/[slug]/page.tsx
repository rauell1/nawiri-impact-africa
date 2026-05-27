import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, BookOpen, ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const dynamic = "force-dynamic";

/* ── Data fetchers ─────────────────────────────────────────── */
async function getStory(slug: string) {
  const story = await db.story.findUnique({
    where: { slug },
  });

  if (!story || story.status !== "published") return null;
  return story;
}

async function getSiteSettings() {
  const siteSettings = await db.siteSettings.findUnique({
    where: { id: "main" },
  });
  return siteSettings
    ? {
        ...siteSettings,
        footer_links: JSON.parse(siteSettings.footer_links || "[]"),
      }
    : null;
}

/* ── Metadata ────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);

  if (!story) {
    return createMetadata({
      title: "Story Not Found",
      description: "The requested story could not be found.",
      path: "/impact",
    });
  }

  return createMetadata({
    title: story.title,
    description: story.excerpt,
    path: `/stories/${story.slug}`,
    image: story.cover_image,
    type: "article",
    publishedTime: story.published_date?.toISOString(),
    modifiedTime: story.updatedAt?.toISOString(),
  });
}

/* ── Page Component ───────────────────────────────────────── */
export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [story, siteSettings] = await Promise.all([
    getStory(slug),
    getSiteSettings(),
  ]);

  if (!story) notFound();

  // Look up related programme
  let relatedProgramme: { title: string; slug: string } | null = null;
  if (story.programme_id) {
    // programme_id may store a slug (matching homepage pattern)
    const bySlug = await db.programme.findUnique({
      where: { slug: story.programme_id },
      select: { title: true, slug: true },
    });
    if (bySlug) {
      relatedProgramme = bySlug;
    } else {
      // Try as actual ID
      const byId = await db.programme.findUnique({
        where: { id: story.programme_id },
        select: { title: true, slug: true },
      });
      if (byId) relatedProgramme = byId;
    }
  }

  const paragraphs = story.body
    ? story.body.split("\n").filter((p) => p.trim())
    : [];

  const site: any = siteSettings || {
    site_name: "Nawiri Impact Africa",
    site_tagline: "Rooted Here. Building Together.",
    logo_url: "/images/logo-placeholder.svg",
    footer_links: [],
    primary_color: "#1B5E20",
    secondary_color: "#D4A017",
    footer_description: "",
    contact_email: "",
    contact_phone: "",
    physical_address: "",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar settings={site} />

      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: createBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Impact & Stories", path: "/impact" },
            { name: story.title, path: `/stories/${story.slug}` },
          ]),
        }}
      />

      <main id="main-content" className="flex-1">
        {/* ── Full-bleed cover image ──────────────────────── */}
        <section className="relative h-[55vh] md:h-[65vh] min-h-[360px] overflow-hidden">
          <Image
            src={story.cover_image}
            alt={story.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          {/* Gradient overlay - darker at bottom for text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

          {/* Title overlaid at bottom */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="container-site pb-10 md:pb-14">
              <ScrollReveal direction="up">
                {/* Programme tag */}
                {relatedProgramme && (
                  <Link
                    href={`/programmes/${relatedProgramme.slug}`}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold font-ui uppercase tracking-wider text-white/90 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full mb-4 hover:bg-white/25 transition-colors"
                  >
                    <BookOpen className="w-3 h-3" />
                    {relatedProgramme.title}
                  </Link>
                )}
                <h1 className="text-white text-[var(--text-h1)] md:text-[var(--text-display)] leading-[var(--leading-display)] max-w-3xl">
                  {story.title}
                </h1>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── Story body ──────────────────────────────────── */}
        <section className="section-padding" aria-label="Story content">
          <div className="container-narrow">
            {/* Meta info */}
            <ScrollReveal>
              <div className="flex flex-wrap items-center gap-4 mb-10 pb-8 border-b border-[var(--border)]">
                {/* Author initials avatar */}
                <div className="w-11 h-11 rounded-full bg-[var(--brand-primary-50)] flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-[var(--brand-primary)] font-ui">
                    {story.author_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--brand-text-primary)] font-ui">
                    {story.author_name}
                  </p>
                  {story.author_role && (
                    <p className="text-xs text-[var(--brand-text-muted)]">
                      {story.author_role}
                    </p>
                  )}
                </div>
                {story.location && (
                  <div className="flex items-center gap-1.5 text-xs text-[var(--brand-text-muted)] font-ui ml-auto">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{story.location}</span>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Story paragraphs */}
            {paragraphs.length > 0 && (
              <ScrollReveal delay={0.05}>
                <div className="space-y-6">
                  {paragraphs.map((para, i) => (
                    <p
                      key={i}
                      className="font-body text-lg leading-[var(--leading-relaxed)] text-[var(--brand-text-secondary)]"
                      style={{ fontSize: "min(1.125rem, 18px)" }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </ScrollReveal>
            )}

            {/* Pull quote */}
            {story.pull_quote && (
              <ScrollReveal delay={0.1}>
                <blockquote className="my-10 md:my-14 pl-6 md:pl-8 border-l-4 border-[var(--brand-secondary)]">
                  <p className="text-xl md:text-2xl font-heading italic text-[var(--brand-text-primary)] leading-[var(--leading-snug)]">
                    &ldquo;{story.pull_quote}&rdquo;
                  </p>
                </blockquote>
              </ScrollReveal>
            )}
          </div>
        </section>

        {/* ── Author card ─────────────────────────────────── */}
        <section className="section-padding-compact gradient-section-warm" aria-label="About the author">
          <div className="container-narrow">
            <ScrollReveal>
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-nawiri-sm border border-[var(--border)] flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/* Author photo or initials */}
                {story.author_photo ? (
                  <Image
                    src={story.author_photo}
                    alt={`Photo of ${story.author_name}`}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[var(--brand-primary-50)] flex items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-[var(--brand-primary)] font-ui">
                      {story.author_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  </div>
                )}
                <div className="text-center sm:text-left">
                  <p className="text-xs font-bold font-ui uppercase tracking-wider text-[var(--brand-secondary)] mb-1">
                    About the Author
                  </p>
                  <h3 className="text-lg font-bold text-[var(--brand-text-primary)] mb-1">
                    {story.author_name}
                  </h3>
                  {story.author_role && (
                    <p className="text-sm text-[var(--brand-text-muted)] font-ui">
                      {story.author_role}
                    </p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Related programme link ──────────────────────── */}
        {relatedProgramme && (
          <section className="section-padding-compact">
            <div className="container-narrow text-center">
              <ScrollReveal>
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-nawiri-sm border border-[var(--border)]">
                  <p className="text-sm font-ui text-[var(--brand-text-muted)] mb-2">
                    This story is part of
                  </p>
                  <Link
                    href={`/programmes/${relatedProgramme.slug}`}
                    className="inline-flex items-center gap-2 text-lg font-bold font-heading text-[var(--brand-primary)] hover:text-[var(--brand-primary-light)] transition-colors group"
                  >
                    <BookOpen className="w-5 h-5" />
                    {relatedProgramme.title}
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* ── Back to stories ─────────────────────────────── */}
        <section className="section-padding-compact">
          <div className="container-site text-center">
            <Link
              href="/impact"
              className="inline-flex items-center gap-2 text-sm font-bold font-ui text-[var(--brand-text-muted)] hover:text-[var(--brand-primary)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Stories
            </Link>
          </div>
        </section>
      </main>

      <Footer settings={site} />
    </div>
  );
}
