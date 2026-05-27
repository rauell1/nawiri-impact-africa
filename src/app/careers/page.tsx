import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CareersListClient from "./CareersListClient";
import JobApplicationForm from "./JobApplicationForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Careers",
  description:
    "Join Nawiri Impact Africa's team. Find open positions in community development, humanitarian response, and programme management across Kenya.",
  path: "/careers",
});

export default async function CareersPage() {
  let careers: any[] = [];
  try {
    careers = await db.career.findMany({
      where: { status: "open" },
      orderBy: { published_date: "desc" },
      select: {
        id: true,
        job_title: true,
        slug: true,
        department: true,
        location: true,
        employment_type: true,
        application_deadline: true,
        is_urgent: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch careers:", error);
  }

  return (
    <main id="main-content">
      {/* ── Hero Section ──────────────────────────────────────── */}
      <section
        className="gradient-hero section-padding-generous"
        aria-label="Careers header"
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
            Work With Us
          </span>
          <h1 className="text-display text-white mb-4">Join Our Team</h1>
          <p className="text-prose-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.85)" }}>
            We are a locally governed, Kenyan organization committed to
            community-driven development. Join a passionate team making a real
            difference in the lives of people across Kenya.
          </p>
        </div>
      </section>

      {/* ── Job Listings ──────────────────────────────────────── */}
      <section className="section-padding gradient-section-warm" aria-label="Open positions">
        <div className="container-site">
          {careers.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center py-10">
              <div className="w-16 h-16 rounded-full bg-[var(--brand-primary-50)] flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-[var(--brand-primary)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </div>
              <h3 className="mb-3">No Open Positions Right Now</h3>
              <p className="text-prose text-[var(--brand-text-muted)] max-w-md mx-auto mb-10 font-body">
                We don&apos;t have any open roles at the moment, but we are always looking for talented professionals. Submit your CV below to join our talent pool!
              </p>

              {/* General Talent Pool CV Upload Form */}
              <div className="bg-[var(--brand-surface-warm)] rounded-2xl p-6 md:p-8 border border-[var(--border)] shadow-nawiri-sm text-left">
                <h3 className="font-heading text-lg font-bold text-[var(--brand-text-primary)] mb-6 text-center">
                  Join Our General Talent Pool
                </h3>
                <JobApplicationForm
                  jobTitle="General CV Submission"
                  department="General Talent Pool"
                  apiEndpoint="/api/contact"
                />
              </div>
            </div>
          ) : (
            <>
              <p className="text-label text-[var(--brand-text-muted)] mb-8 font-ui">
                {careers.length} open {careers.length === 1 ? "position" : "positions"}
              </p>
              <CareersListClient careers={careers} />
            </>
          )}
        </div>
      </section>
    </main>
  );
}
