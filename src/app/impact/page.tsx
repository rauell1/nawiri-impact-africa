import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import { MapPin, BookOpen } from "lucide-react";
import { db } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = createMetadata({
  title: "Impact & Stories",
  description:
    "Read real stories of change from the communities Nawiri Impact Africa serves across Kenya. See the lasting impact of our programmes.",
  path: "/impact",
});

export default async function ImpactPage() {
  let siteSettings: any = null;
  let stories: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    author_name: string;
    author_role: string | null;
    cover_image: string;
    location: string | null;
    programme_id: string | null;
    published_date: Date;
  }[] = [];
  let programmes: { title: string; slug: string; id: string }[] = [];

  try {
    [siteSettings, stories, programmes] = await Promise.all([
      db.siteSettings.findUnique({ where: { id: "main" } }),
      db.story.findMany({
        where: { status: "published" },
        orderBy: { published_date: "desc" },
      }),
      db.programme.findMany({
        where: { status: "published" },
        select: { id: true, title: true, slug: true },
      }),
    ]);
  } catch (error) {
    console.error("Failed to fetch stories:", error);
  }

  const site = siteSettings
    ? {
        ...siteSettings,
        footer_links: JSON.parse(siteSettings.footer_links || "[]"),
      }
    : {
        site_name: "Nawiri Impact Africa",
        site_tagline: "Rooted Here. Building Together.",
        logo_url: "/images/logo-placeholder.svg",
        footer_links: [] as { label: string; url: string }[],
        primary_color: "#1B5E20",
        secondary_color: "#D4A017",
        footer_description: "",
        contact_email: "",
        contact_phone: "",
        physical_address: "",
      };

  // Build programme lookup by id
  const programmeMap = new Map(
    programmes.map((p) => [p.id, { title: p.title, slug: p.slug }])
  );

  // Also support programme_id storing a slug (matching homepage pattern)
  const programmeSlugMap = new Map(
    programmes.map((p) => [p.slug, { title: p.title, slug: p.slug }])
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar settings={site} />

      <main id="main-content" className="flex-1">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative gradient-hero overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="container-site relative py-24 md:py-32 lg:py-40 text-center">
            <ScrollReveal>
              <span className="text-overline text-[var(--brand-secondary)] mb-4 block">
                Stories of Change
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h1 className="text-white mb-4">
                Impact &amp;{" "}
                <span className="accent-underline">Stories</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-prose-lg text-white/80 max-w-2xl mx-auto">
                Real stories from the communities we serve, showing the lasting
                impact of our work across Kenya.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Stories Grid ─────────────────────────────────── */}
        <section className="section-padding" aria-label="Impact stories">
          <div className="container-site">
            {stories.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[var(--brand-text-muted)]">
                  No stories published yet. Check back soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {stories.map((story, index) => {
                  // Look up programme by ID or slug
                  const programme = story.programme_id
                    ? programmeMap.get(story.programme_id) ||
                      programmeSlugMap.get(story.programme_id)
                    : null;

                  return (
                    <ScrollReveal
                      key={story.id}
                      delay={index * 0.08}
                    >
                      <Link
                        href={`/stories/${story.slug}`}
                        className="group block h-full"
                        aria-label={`Read: ${story.title}`}
                      >
                        <article className="relative bg-white rounded-2xl overflow-hidden shadow-nawiri-sm card-lift border border-[var(--border)] flex flex-col h-full">
                          {/* Cover image */}
                          <div className="relative h-52 md:h-56 overflow-hidden">
                            <Image
                              src={story.cover_image}
                              alt={story.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            {/* Programme tag */}
                            {programme && (
                              <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold font-ui uppercase tracking-wider text-[var(--brand-text-inverse)] bg-[var(--brand-primary)]/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                  <BookOpen className="w-3 h-3" />
                                  {programme.title}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-6 flex flex-col flex-1">
                            {/* Location */}
                            {story.location && (
                              <div className="flex items-center gap-1.5 text-xs text-[var(--brand-text-muted)] font-ui mb-3">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{story.location}</span>
                              </div>
                            )}

                            {/* Title */}
                            <h2 className="text-lg font-bold text-[var(--brand-text-primary)] mb-3 group-hover:text-[var(--brand-primary)] transition-colors leading-snug">
                              {story.title}
                            </h2>

                            {/* Excerpt */}
                            <p className="text-prose text-sm text-[var(--brand-text-secondary)] line-clamp-3 flex-1 mb-5">
                              {story.excerpt}
                            </p>

                            {/* Author card */}
                            <div className="pt-4 border-t border-[var(--border)] flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[var(--brand-primary-50)] flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-[var(--brand-primary)] font-ui">
                                  {story.author_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-[var(--brand-text-primary)] truncate">
                                  {story.author_name}
                                </p>
                                {story.location && (
                                  <p className="text-xs text-[var(--brand-text-muted)]">
                                    {story.location}
                                  </p>
                                )}
                              </div>
                              <svg
                                className="w-4 h-4 ml-auto text-[var(--brand-text-muted)] transition-transform group-hover:translate-x-1 shrink-0"
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
                            </div>
                          </div>
                        </article>
                      </Link>
                    </ScrollReveal>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer settings={site} />
    </div>
  );
}
