import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import * as Icons from "lucide-react";
import { db } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "About Us",
  description:
    "Learn about Nawiri Impact Africa: our mission, vision, values, and the team driving change in communities across Kenya.",
  path: "/about",
});

export default async function AboutPage() {
  let siteSettings: any = null;
  let aboutSettings: any = null;
  let leadershipTeam: any[] = [];
  let generalTeam: any[] = [];

  try {
    const [siteRes, aboutRes, leadershipRes, generalRes] = await Promise.all([
      db.siteSettings.findUnique({ where: { id: "main" } }),
      db.aboutSettings.findUnique({ where: { id: "main" } }),
      db.teamMember.findMany({
        where: { status: "published", is_leadership: true },
        orderBy: { sort_order: "asc" },
      }),
      db.teamMember.findMany({
        where: { status: "published", is_leadership: false },
        orderBy: { sort_order: "asc" },
      }),
    ]);
    siteSettings = siteRes;
    aboutSettings = aboutRes;
    leadershipTeam = leadershipRes;
    generalTeam = generalRes;
  } catch (error) {
    console.error("Failed to fetch about page data:", error);
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

  // Extract from database-driven aboutSettings
  const aboutHeadline = aboutSettings?.about_headline || "About Nawiri Impact Africa";
  const mission = aboutSettings?.mission_statement || site.footer_description || "To walk alongside Kenyan communities, delivering programmes that build resilience, restore dignity, and create lasting opportunity.";
  const vision = aboutSettings?.vision_statement || "A Kenya where every community has the agency, resources, and support to thrive.";
  const heroImage = aboutSettings?.about_hero_image || "/images/about-hero.jpg";
  const aboutBody = aboutSettings?.about_body || "Nawiri Impact Africa, formerly operating as World Relief Kenya, is a Kenyan NGO undergoing a complete organizational identity transition. It is separating from its former international affiliation to become a fully independent, locally governed entity. This transition is a significant organizational milestone: the new brand, the new name, and the new website all represent its commitment to being a locally rooted, community-driven institution rather than a branch of an international body.\n\nThe organization works across Kenya delivering programmes in community development, humanitarian response, livelihood support, and social protection.";

  // Parse values
  let valuesList: { title: string; icon: string; description: string }[] = [];
  try {
    valuesList = JSON.parse(aboutSettings?.values || "[]");
  } catch {
    valuesList = [];
  }
  if (valuesList.length === 0) {
    valuesList = [
      {
        icon: "ShieldCheck",
        title: "Integrity",
        description: "We uphold the highest standards of transparency and accountability in everything we do, from financial stewardship to community engagement.",
      },
      {
        icon: "Users",
        title: "Community",
        description: "We believe lasting change comes from within. We walk alongside communities, listening first and co-creating solutions that truly fit.",
      },
      {
        icon: "Heart",
        title: "Dignity",
        description: "Every person has inherent worth. Our programmes are designed to empower, not to create dependency, restoring dignity at every step.",
      },
      {
        icon: "Star",
        title: "Excellence",
        description: "We pursue the highest quality in our work, grounded in evidence and learning. Good enough is never enough when lives are at stake.",
      },
    ];
  }

  // Parse timeline
  let timelineList: { year: string; event: string }[] = [];
  try {
    timelineList = JSON.parse(aboutSettings?.history_timeline || "[]");
  } catch {
    timelineList = [];
  }

  const valueColors = ["var(--brand-primary)", "var(--brand-secondary)", "var(--brand-accent-earth)", "var(--brand-primary-dark)"];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar settings={site} />

      <main id="main-content" className="flex-1">
        {/* ── Hero with about_hero_image ────────── */}
        <section className="relative h-[50vh] md:h-[60vh] min-h-[320px] overflow-hidden">
          <Image
            src={heroImage}
            alt="Nawiri Impact Africa team working with communities in Kenya"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

          <div className="absolute bottom-0 left-0 right-0">
            <div className="container-site pb-12 md:pb-16">
              <ScrollReveal direction="up">
                <span className="text-overline text-[var(--brand-secondary)] mb-4 block">
                  Who We Are
                </span>
                <h1 className="text-white text-[var(--text-h1)] md:text-[var(--text-display)] leading-[var(--leading-display)]">
                  {aboutHeadline}
                </h1>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── Mission & Vision ───────────────────────────── */}
        <section className="section-padding" aria-label="Mission and vision">
          <div className="container-site">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Mission */}
              <ScrollReveal direction="left">
                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-nawiri-md border-l-4 border-[var(--brand-primary)] h-full">
                  <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary-50)] flex items-center justify-center mb-5">
                    <svg
                      className="w-6 h-6 text-[var(--brand-primary)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--brand-text-primary)] mb-4">
                    Our Mission
                  </h2>
                  <p className="text-prose-lg text-[var(--brand-text-secondary)] leading-[var(--leading-relaxed)]">
                    {mission}
                  </p>
                </div>
              </ScrollReveal>

              {/* Vision */}
              <ScrollReveal direction="right">
                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-nawiri-md border-l-4 border-[var(--brand-secondary)] h-full">
                  <div className="w-12 h-12 rounded-xl bg-[var(--brand-secondary-50)] flex items-center justify-center mb-5">
                    <svg
                      className="w-6 h-6 text-[var(--brand-secondary)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--brand-text-primary)] mb-4">
                    Our Vision
                  </h2>
                  <p className="text-prose-lg text-[var(--brand-text-secondary)] leading-[var(--leading-relaxed)]">
                    {vision}
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── Our Story & Timeline ───────────────────────── */}
        <section className="section-padding bg-white" aria-label="Our story and history">
          <div className="container-site">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              {/* Narrative Text */}
              <ScrollReveal direction="left" className="lg:col-span-1">
                <span className="text-overline text-[var(--brand-secondary)] mb-3 block">
                  Our History
                </span>
                <h2 className="mb-6">Our <span className="accent-underline">Story</span></h2>
                <div className="text-prose space-y-4 whitespace-pre-line text-[var(--brand-text-secondary)]">
                  {aboutBody}
                </div>
              </ScrollReveal>

              {/* Timeline list */}
              {timelineList.length > 0 && (
                <ScrollReveal direction="right" className="lg:col-span-2">
                  <div className="relative border-l-2 border-[var(--border)] pl-6 ml-4 space-y-8">
                    {timelineList.map((item, idx) => (
                      <div key={idx} className="relative group">
                        {/* Timeline Bullet */}
                        <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full border-2 border-[var(--brand-secondary)] bg-white group-hover:bg-[var(--brand-secondary)] transition-colors duration-200" />
                        
                        <div className="bg-[var(--brand-surface-warm)] rounded-xl p-5 border border-[var(--border)] shadow-nawiri-sm transition-all duration-300 hover:shadow-nawiri-md">
                          <span className="inline-block text-brand-gold text-lg font-bold font-ui mb-1">{item.year}</span>
                          <p className="text-sm leading-relaxed text-[var(--brand-text-secondary)]">{item.event}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>

        {/* ── Values Grid ────────────────────────────────── */}
        <section className="section-padding gradient-section-green" aria-label="Our values">
          <div className="container-site">
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                <span className="text-overline text-[var(--brand-secondary)] mb-3 block">
                  What Drives Us
                </span>
                <h2 className="mb-3">
                  Our <span className="accent-underline">Values</span>
                </h2>
                <p className="text-prose text-[var(--brand-text-secondary)]">
                  Principles that guide every decision we make and every
                  programme we deliver.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
              {valuesList.map((value, index) => {
                const IconComponent = (Icons as any)[value.icon] || Icons.HelpCircle;
                const valueColor = valueColors[index % valueColors.length];
                return (
                  <ScrollReveal key={value.title} delay={index * 0.1}>
                    <div className="bg-white rounded-2xl p-6 md:p-7 shadow-nawiri-sm border border-[var(--border)] h-full card-lift">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                        style={{ backgroundColor: valueColor }}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-[var(--brand-text-primary)] mb-3">
                        {value.title}
                      </h3>
                      <p className="text-sm text-[var(--brand-text-secondary)] leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Leadership Team ─────────────────────────────── */}
        {leadershipTeam.length > 0 && (
          <section className="section-padding" aria-label="Leadership team">
            <div className="container-site">
              <ScrollReveal>
                <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                  <span className="text-overline text-[var(--brand-secondary)] mb-3 block">
                    Our People
                  </span>
                  <h2 className="mb-3">
                    <span className="accent-underline">Leadership</span> Team
                  </h2>
                  <p className="text-prose text-[var(--brand-text-secondary)]">
                    The experienced professionals leading Nawiri Impact Africa
                    towards our mission.
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {leadershipTeam.map((member, index) => (
                  <ScrollReveal key={member.id} delay={index * 0.08}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-nawiri-sm border border-[var(--border)] card-lift">
                      {/* Photo */}
                      <div className="relative h-64 overflow-hidden bg-[var(--brand-surface-warm)]">
                        {member.photo ? (
                          <Image
                            src={member.photo}
                            alt={`Photo of ${member.name}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-[var(--brand-primary-50)] flex items-center justify-center">
                              <span className="text-2xl font-bold text-[var(--brand-primary)] font-ui">
                                {member.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </span>
                            </div>
                          </div>
                        )}
                        {/* Subtle gradient overlay at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
                      </div>

                      {/* Info */}
                      <div className="p-6 pt-2 text-center">
                        <h3 className="text-lg font-bold text-[var(--brand-text-primary)]">
                          {member.name}
                        </h3>
                        <p
                          className="text-sm font-bold font-ui mb-3"
                          style={{ color: "var(--brand-primary)" }}
                        >
                          {member.role}
                        </p>
                        {member.bio && (
                          <p className="text-sm text-[var(--brand-text-secondary)] leading-relaxed line-clamp-4">
                            {member.bio}
                          </p>
                        )}
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold font-ui text-[var(--brand-text-muted)] hover:text-[var(--brand-primary)] transition-colors"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── General Team ───────────────────────────────── */}
        {generalTeam.length > 0 && (
          <section
            className="section-padding-compact gradient-section-warm"
            aria-label="Our team"
          >
            <div className="container-site">
              <ScrollReveal>
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="mb-3">Our Team</h2>
                  <p className="text-prose text-[var(--brand-text-secondary)]">
                    The dedicated team members who make our work possible every
                    day.
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {generalTeam.map((member, index) => (
                  <ScrollReveal key={member.id} delay={index * 0.06}>
                    <div className="bg-white rounded-xl p-5 shadow-nawiri-sm border border-[var(--border)] flex items-start gap-4 card-lift">
                      {/* Avatar */}
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={`Photo of ${member.name}`}
                          width={56}
                          height={56}
                          className="w-14 h-14 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[var(--brand-primary-50)] flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-[var(--brand-primary)] font-ui">
                            {member.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-[var(--brand-text-primary)] truncate">
                          {member.name}
                        </h3>
                        <p className="text-xs font-bold font-ui text-[var(--brand-primary)] mb-1">
                          {member.role}
                        </p>
                        {member.bio && (
                          <p className="text-xs text-[var(--brand-text-secondary)] leading-relaxed line-clamp-2">
                            {member.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Get Involved CTA ───────────────────────────── */}
        <section className="section-padding" aria-label="Get involved">
          <div className="container-site text-center">
            <ScrollReveal>
              <h2 className="mb-4">Join Us in Building a Better Kenya</h2>
              <p className="text-prose text-[var(--brand-text-secondary)] max-w-xl mx-auto mb-8">
                Whether through partnerships, volunteering, or donations, there
                are many ways to be part of the Nawiri story.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold font-ui rounded-lg bg-[var(--brand-primary)] text-white hover:opacity-90 transition-opacity shadow-nawiri-md"
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
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold font-ui rounded-lg border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer settings={site} />
    </div>
  );
}

