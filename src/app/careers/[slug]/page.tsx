import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Building2,
  Calendar,
  AlertTriangle,
  Mail,
  CheckCircle2,
} from "lucide-react";
import CareerDetailClient from "./CareerDetailClient";

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
  const career = await db.career.findUnique({
    where: { slug },
    select: { job_title: true, department: true, location: true, employment_type: true },
  });

  if (!career) {
    return createMetadata({
      title: "Position Not Found",
      description: "The requested job position could not be found.",
      path: "/careers",
    });
  }

  return createMetadata({
    title: `${career.job_title} (${career.department})`,
    description: `Apply for ${career.job_title} in ${career.department} at Nawiri Impact Africa. ${career.location ? `Location: ${career.location}.` : ""} ${career.employment_type || ""}`,
    path: `/careers/${slug}`,
  });
}

export default async function CareerDetailPage({ params }: Props) {
  const { slug } = await params;
  const career = await db.career.findUnique({
    where: { slug, status: "open" },
  });

  if (!career) {
    notFound();
  }

  const subject = encodeURIComponent(
    `Application: ${career.job_title} — ${career.department}`
  );
  const mailto = career.application_email
    ? `mailto:${career.application_email}?subject=${subject}`
    : null;

  const descriptionParagraphs = career.description
    ? career.description.split("\n").filter(Boolean)
    : [];
  const requirementsList = career.requirements
    ? career.requirements.split("\n").filter(Boolean)
    : [];
  const howToApplyParagraphs = career.how_to_apply
    ? career.how_to_apply.split("\n").filter(Boolean)
    : [];

  return (
    <>
      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: createBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Careers", path: "/careers" },
            { name: career.job_title, path: `/careers/${career.slug}` },
          ]),
        }}
      />

      <main id="main-content">
      {/* ── Back Link ─────────────────────────────────────────── */}
      <div className="bg-[var(--brand-background)] border-b border-[var(--border)]">
        <div className="container-site py-3">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-sm font-ui text-[var(--brand-text-muted)] hover:text-[var(--brand-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Careers</span>
          </Link>
        </div>
      </div>

      {/* ── Header Section ────────────────────────────────────── */}
      <section className="section-padding gradient-section-warm" aria-label="Job details">
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            {/* Badges row */}
            <CareerDetailClient
              department={career.department}
              location={career.location}
              employmentType={career.employment_type}
              isUrgent={career.is_urgent}
            />

            {/* Title */}
            <h1 className="mb-6">{career.job_title}</h1>

            {/* Deadline banner */}
            <div
              className={`flex items-center gap-3 px-5 py-4 rounded-xl mb-10 border ${
                career.is_urgent
                  ? "bg-[var(--brand-error)]/10 border-[var(--brand-error)]/30"
                  : "bg-[var(--brand-primary-50)] border-[var(--brand-primary)]/20"
              }`}
            >
              <Calendar className="w-5 h-5 shrink-0 text-[var(--brand-primary)]" />
              <div>
                <p className="text-sm font-ui font-semibold text-[var(--brand-text-primary)]">
                  Application Deadline
                </p>
                <p className="text-base font-ui font-bold text-[var(--brand-primary)]">
                  {formatDate(career.application_deadline)}
                </p>
              </div>
              {career.is_urgent && (
                <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold font-ui rounded-full bg-[var(--brand-error)] text-white">
                  <AlertTriangle className="w-3 h-3" />
                  Urgent
                </span>
              )}
            </div>

            {/* ── Description ─────────────────────────────────── */}
            {descriptionParagraphs.length > 0 && (
              <section className="mb-10">
                <h2 className="flex items-center gap-2 mb-5">
                  <span className="w-8 h-[2px] bg-[var(--brand-secondary)] rounded-full" />
                  <span className="text-overline text-[var(--brand-secondary)]">
                    About This Role
                  </span>
                </h2>
                <div className="space-y-4">
                  {descriptionParagraphs.map((p, i) => (
                    <p
                      key={i}
                      className="font-body text-[1.0625rem] leading-[1.75] text-[var(--brand-text-secondary)]"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* ── Requirements ────────────────────────────────── */}
            {requirementsList.length > 0 && (
              <section className="mb-10">
                <h2 className="flex items-center gap-2 mb-5">
                  <span className="w-8 h-[2px] bg-[var(--brand-primary)] rounded-full" />
                  <span className="text-overline text-[var(--brand-primary)]">
                    Requirements
                  </span>
                </h2>
                <ul className="space-y-3">
                  {requirementsList.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 font-body text-[1.0625rem] leading-[1.75] text-[var(--brand-text-secondary)]"
                    >
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[var(--brand-primary)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* ── How to Apply ───────────────────────────────── */}
            {(howToApplyParagraphs.length > 0 || mailto) && (
              <section className="mb-10">
                <h2 className="flex items-center gap-2 mb-5">
                  <span className="w-8 h-[2px] bg-[var(--brand-secondary)] rounded-full" />
                  <span className="text-overline text-[var(--brand-secondary)]">
                    How to Apply
                  </span>
                </h2>
                <div className="space-y-4">
                  {howToApplyParagraphs.map((p, i) => (
                    <p
                      key={i}
                      className="font-body text-[1.0625rem] leading-[1.75] text-[var(--brand-text-secondary)]"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* ── Apply Now CTA ───────────────────────────────── */}
            {mailto && (
              <div className="pt-6 border-t border-[var(--border)]">
                <a
                  href={mailto}
                  className="inline-flex items-center gap-3 px-8 py-4 text-base font-bold font-ui rounded-xl text-white shadow-nawiri-md hover:shadow-nawiri-lg transition-all bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-light)]"
                >
                  <Mail className="w-5 h-5" />
                  Apply Now
                </a>
                {career.application_email && (
                  <p className="mt-3 text-sm text-[var(--brand-text-muted)] font-ui">
                    Send your application to{" "}
                    <span className="text-[var(--brand-text-secondary)] font-medium">
                      {career.application_email}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Salary range if available */}
            {career.salary_range && (
              <div className="mt-8 p-4 rounded-xl bg-[var(--brand-surface-warm)] border border-[var(--border)]">
                <p className="text-sm font-ui text-[var(--brand-text-muted)]">
                  <span className="font-semibold text-[var(--brand-text-secondary)]">
                    Salary Range:
                  </span>{" "}
                  {career.salary_range}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
