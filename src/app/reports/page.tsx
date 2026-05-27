import type { Metadata } from "next";
import { db } from "@/lib/db";
import { createMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { FileText, Download, Calendar, Filter } from "lucide-react";
import ReportsClient from "./ReportsClient";

export const metadata: Metadata = createMetadata({
  title: "Reports & Financials",
  description:
    "Access Nawiri Impact Africa's annual reports, financial statements, evaluations, and other publications demonstrating our transparency and impact.",
  path: "/reports",
});

async function getPageData() {
  const [siteSettings, reports] = await Promise.all([
    db.siteSettings.findUnique({ where: { id: "main" } }),
    db.report.findMany({
      where: { status: "published" },
      orderBy: [{ is_featured: "desc" }, { year: "desc" }, { published_date: "desc" }],
    }),
  ]);

  // Parse footer links
  let footerLinks: { label: string; url: string }[] = [];
  try {
    footerLinks = JSON.parse(siteSettings?.footer_links || "[]");
  } catch {
    footerLinks = [];
  }

  return {
    site: { ...siteSettings, footer_links: footerLinks },
    reports,
  };
}

export default async function ReportsPage() {
  const { site, reports } = await getPageData();

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--brand-background)]">
        <p className="text-[var(--brand-text-muted)]">Unable to load site data.</p>
      </div>
    );
  }

  const featured = reports.find((r) => r.is_featured) || null;
  const allReports = reports.filter((r) => !r.is_featured);
  const years = [...new Set(reports.map((r) => r.year))].sort((a, b) => b - a);
  const docTypes = [...new Set(reports.map((r) => r.document_type))].sort();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar settings={site} />

      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section
          className="relative w-full min-h-[340px] md:min-h-[400px] flex items-center justify-center overflow-hidden"
          aria-label="Reports & Financials hero"
        >
          <Image
            src="/images/about-hero.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary-dark)]/85 via-[var(--brand-primary)]/80 to-[var(--brand-primary-dark)]/90" />

          <div className="relative z-10 container-site text-center py-20">
            <span className="text-overline text-[var(--brand-secondary-light)] inline-block mb-4">
              Transparency & Accountability
            </span>
            <h1 className="text-display text-white max-w-3xl mx-auto">
              Reports &amp; Financials
            </h1>
            <p className="text-prose-lg text-white/80 mt-4 max-w-2xl mx-auto">
              We are committed to transparency. Browse our annual reports,
              financial statements, and programme evaluations.
            </p>
          </div>
        </section>

        {/* Featured Report */}
        {featured && (
          <section className="section-padding gradient-section-warm" aria-label="Featured report">
            <div className="container-narrow">
              <div className="rounded-2xl overflow-hidden bg-[var(--brand-surface)] shadow-nawiri-md card-lift">
                <div className="grid md:grid-cols-2">
                  {/* Cover Image placeholder */}
                  <div className="relative h-64 md:h-auto bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-light)] flex items-center justify-center">
                    <div className="text-center p-8">
                      <FileText className="w-20 h-20 text-white/40 mx-auto mb-4" />
                      <p className="text-overline text-white/50">Featured Document</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <span className="inline-flex items-center gap-2 text-overline text-brand-gold font-semibold mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {featured.year} — {featured.document_type}
                    </span>
                    <h2 className="text-h3 mb-3">{featured.title}</h2>
                    <p className="text-prose mb-6">{featured.description}</p>
                    {featured.file_url && (
                      <a
                        href={featured.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-[var(--brand-text-on-gold)] bg-[var(--brand-secondary)] hover:opacity-90 transition-opacity shadow-nawiri-sm w-fit"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Reports — Filterable Grid */}
        <section className="section-padding" aria-label="All reports">
          <div className="container-site">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-h2">
                All Publications
              </h2>
              <div className="flex items-center gap-2 text-brand-muted font-ui text-sm">
                <Filter className="w-4 h-4" />
                <span>{reports.length} document{reports.length !== 1 ? "s" : ""}</span>
              </div>
            </div>

            <ReportsClient
              reports={allReports}
              years={years}
              docTypes={docTypes}
            />
          </div>
        </section>
      </main>

      <Footer settings={site} />
    </div>
  );
}
