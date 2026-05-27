import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Leaf,
  Shield,
  Baby,
  HeartPulse,
  Users,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";

const iconMap: Record<string, LucideIcon> = {
  Leaf,
  Shield,
  Baby,
  HeartPulse,
};

/* ── Data fetcher ─────────────────────────────────────────── */
async function getProgramme(slug: string) {
  const programme = await db.programme.findUnique({
    where: { slug },
  });

  if (!programme || programme.status !== "published") return null;
  return programme;
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
  const programme = await getProgramme(slug);

  if (!programme) {
    return createMetadata({
      title: "Programme Not Found",
      description: "The requested programme could not be found.",
      path: "/programmes",
    });
  }

  return createMetadata({
    title: programme.title,
    description: programme.short_description,
    path: `/programmes/${programme.slug}`,
    image: programme.cover_image,
  });
}

/* ── Helper: parse key_activities JSON ────────────────────── */
function parseActivities(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/* ── Page Component ───────────────────────────────────────── */
export default async function ProgrammeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [programme, siteSettings] = await Promise.all([
    getProgramme(slug),
    getSiteSettings(),
  ]);

  if (!programme) notFound();

  const IconComponent = iconMap[programme.icon] || Leaf;
  const accentColor = programme.color_accent || "var(--brand-primary)";
  const activities = parseActivities(programme.key_activities);

  const impactStats = [
    { number: programme.impact_stat_1_number, label: programme.impact_stat_1_label },
    { number: programme.impact_stat_2_number, label: programme.impact_stat_2_label },
    { number: programme.impact_stat_3_number, label: programme.impact_stat_3_label },
  ].filter((s) => s.number && s.label);

  const paragraphs = programme.full_description
    ? programme.full_description.split("\n").filter((p) => p.trim())
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
            { name: "Programmes", path: "/programmes" },
            { name: programme.title, path: `/programmes/${programme.slug}` },
          ]),
        }}
      />

      <main id="main-content" className="flex-1">
        {/* ── Hero with cover image ──────────────────────── */}
        <section className="relative h-[50vh] md:h-[60vh] min-h-[320px] overflow-hidden">
          <Image
            src={programme.cover_image}
            alt={programme.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

          {/* Programme title overlaid */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="container-site pb-12 md:pb-16">
              <ScrollReveal direction="up">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-overline text-white/80">Programme</span>
                </div>
                <h1 className="text-white text-[var(--text-h1)] md:text-[var(--text-display)] leading-[var(--leading-display)]">
                  {programme.title}
                </h1>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── Full Description ────────────────────────────── */}
        {paragraphs.length > 0 && (
          <section className="section-padding" aria-label="Programme overview">
            <div className="container-narrow">
              <ScrollReveal>
                <span className="text-overline text-[var(--brand-secondary)] mb-3 block">
                  Overview
                </span>
                <div className="space-y-5">
                  {paragraphs.map((para, i) => (
                    <p key={i} className="text-prose-lg leading-[var(--leading-relaxed)]">
                      {para}
                    </p>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* ── Impact Stats ────────────────────────────────── */}
        {impactStats.length > 0 && (
          <section className="section-padding-compact gradient-section-green" aria-label="Impact statistics">
            <div className="container-site">
              <ScrollReveal>
                <h2 className="text-center mb-10">
                  Our <span className="accent-underline">Impact</span>
                </h2>
              </ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {impactStats.map((stat, index) => (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <div className="bg-white rounded-xl p-6 md:p-8 text-center shadow-nawiri-sm border border-[var(--border)]">
                      <div
                        className="text-3xl md:text-4xl font-bold font-heading mb-2"
                        style={{ color: accentColor }}
                      >
                        {stat.number}
                      </div>
                      <p className="text-sm text-[var(--brand-text-secondary)] font-ui font-medium">
                        {stat.label}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Key Activities ──────────────────────────────── */}
        {activities.length > 0 && (
          <section className="section-padding" aria-label="Key activities">
            <div className="container-narrow">
              <ScrollReveal>
                <span className="text-overline text-[var(--brand-secondary)] mb-3 block">
                  What We Do
                </span>
                <h2 className="mb-8">Key Activities</h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <ul className="space-y-4">
                  {activities.map((activity, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2
                        className="w-5 h-5 mt-1 shrink-0"
                        style={{ color: accentColor }}
                      />
                      <span className="text-prose leading-relaxed">
                        {activity}
                      </span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* ── Target Beneficiaries ────────────────────────── */}
        {programme.target_beneficiaries && (
          <section className="section-padding-compact gradient-section-warm" aria-label="Target beneficiaries">
            <div className="container-narrow">
              <ScrollReveal>
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="mb-2">Who We Serve</h2>
                    <p className="text-prose-lg text-[var(--brand-text-secondary)]">
                      {programme.target_beneficiaries}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* ── CTA: Support This Programme ─────────────────── */}
        <section className="section-padding" aria-label="Support this programme">
          <div className="container-narrow text-center">
            <ScrollReveal>
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-nawiri-md border border-[var(--border)]">
                <h2 className="mb-4">Support This Programme</h2>
                <p className="text-prose text-[var(--brand-text-secondary)] max-w-lg mx-auto mb-8">
                  Your generous contribution helps us expand our reach and deepen
                  our impact in communities across Kenya.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold font-ui rounded-lg border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-text-inverse)] transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Back to programmes ──────────────────────────── */}
        <section className="section-padding-compact">
          <div className="container-site text-center">
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2 text-sm font-bold font-ui text-[var(--brand-text-muted)] hover:text-[var(--brand-primary)] transition-colors"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to All Programmes
            </Link>
          </div>
        </section>
      </main>

      <Footer settings={site} />
    </div>
  );
}
