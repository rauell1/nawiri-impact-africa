import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import {
  Leaf,
  Shield,
  Baby,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";
import { db } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = createMetadata({
  title: "Our Programmes",
  description:
    "Explore Nawiri Impact Africa's programmes in community resilience, humanitarian response, child wellbeing, and health & nutrition across Kenya.",
  path: "/programmes",
});

const iconMap: Record<string, LucideIcon> = {
  Leaf,
  Shield,
  Baby,
  HeartPulse,
};

export default async function ProgrammesPage() {
  let siteSettings: any = null;
  let programmes: {
    id: string;
    title: string;
    slug: string;
    short_description: string;
    cover_image: string;
    icon: string;
    color_accent: string | null;
  }[] = [];

  try {
    [siteSettings, programmes] = await Promise.all([
      db.siteSettings.findUnique({ where: { id: "main" } }),
      db.programme.findMany({
        where: { status: "published" },
        orderBy: { sort_order: "asc" },
      }),
    ]);
  } catch (error) {
    console.error("Failed to fetch programmes:", error);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar settings={site} />

      <main id="main-content" className="flex-1">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative gradient-hero overflow-hidden">
          {/* Pattern overlay */}
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
                What We Do
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h1 className="text-white mb-4">
                Our{" "}
                <span className="accent-underline">Programmes</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-prose-lg text-white/80 max-w-2xl mx-auto">
                Across Kenya, we deliver programmes that build community
                resilience, respond to humanitarian needs, protect children, and
                improve health outcomes.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Programmes Grid ──────────────────────────────── */}
        <section className="section-padding" aria-label="All programmes">
          <div className="container-site">
            {programmes.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[var(--brand-text-muted)]">
                  No programmes published yet. Check back soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {programmes.map((programme, index) => {
                  const IconComponent = iconMap[programme.icon] || Leaf;
                  const accentColor =
                    programme.color_accent || "var(--brand-primary)";

                  return (
                    <ScrollReveal
                      key={programme.id}
                      delay={index * 0.08}
                    >
                      <Link
                        href={`/programmes/${programme.slug}`}
                        className="group block"
                        aria-label={`Learn more about ${programme.title}`}
                      >
                        <article className="relative bg-white rounded-2xl overflow-hidden shadow-nawiri-sm card-lift border border-[var(--border)]">
                          {/* Image */}
                          <div className="relative h-52 md:h-60 overflow-hidden">
                            <Image
                              src={programme.cover_image}
                              alt={programme.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            {/* Colour accent bar at bottom of image */}
                            <div
                              className="absolute bottom-0 left-0 right-0 h-1.5"
                              style={{ backgroundColor: accentColor }}
                            />
                            {/* Icon badge floating on image */}
                            <div
                              className="absolute top-4 right-4 w-11 h-11 rounded-lg flex items-center justify-center shadow-md"
                              style={{ backgroundColor: accentColor }}
                            >
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6 md:p-7">
                            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-text-primary)] mb-3 group-hover:text-[var(--brand-primary)] transition-colors leading-snug">
                              {programme.title}
                            </h2>
                            <p className="text-prose text-[var(--brand-text-secondary)] line-clamp-3 mb-5">
                              {programme.short_description}
                            </p>

                            {/* Learn more link */}
                            <div
                              className="flex items-center gap-1.5 text-sm font-bold font-ui"
                              style={{ color: accentColor }}
                            >
                              <span>Learn More</span>
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

        {/* ── CTA Strip ─────────────────────────────────────── */}
        <section className="section-padding-compact gradient-section-warm">
          <div className="container-site text-center">
            <ScrollReveal>
              <h2 className="mb-4">Want to Support Our Work?</h2>
              <p className="text-prose text-[var(--brand-text-secondary)] max-w-xl mx-auto mb-8">
                Your contribution helps us reach more communities across Kenya
                with life-changing programmes.
              </p>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold font-ui rounded-lg bg-[var(--brand-primary)] text-[var(--brand-text-inverse)] hover:bg-[var(--brand-primary-light)] transition-colors shadow-nawiri-md"
              >
                Donate Now
                <svg
                  className="w-4 h-4"
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
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer settings={site} />
    </div>
  );
}
