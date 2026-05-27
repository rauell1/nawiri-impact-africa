import type { Metadata } from "next";
import { db } from "@/lib/db";
import { createMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import {
  Heart,
  Building2,
  Smartphone,
  Users,
  HandHeart,
} from "lucide-react";
import PartnershipForm from "./PartnershipForm";
import VolunteerForm from "./VolunteerForm";
import DonateHero from "./DonateHero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Support Our Work",
  description:
    "Support Nawiri Impact Africa through M-Pesa, bank transfer, or partnership. Every contribution helps build resilient communities across Kenya.",
  path: "/donate",
});

async function getPageData() {
  const siteSettings = await db.siteSettings.findUnique({ where: { id: "main" } });

  let footerLinks: { label: string; url: string }[] = [];
  try {
    footerLinks = JSON.parse(siteSettings?.footer_links || "[]");
  } catch {
    footerLinks = [];
  }

  return {
    site: { ...siteSettings, footer_links: footerLinks },
  };
}

export default async function DonatePage() {
  const { site } = await getPageData();

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--brand-background)]">
        <p className="text-[var(--brand-text-muted)]">Unable to load site data.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar settings={site} />

      <main id="main-content" className="flex-1">
        {/* ── Hero ── */}
        <section
          className="relative w-full min-h-[400px] md:min-h-[480px] flex items-center justify-center overflow-hidden"
          aria-label="Donate hero"
        >
          <Image
            src="/images/donate-bg.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary-dark)]/80 via-[var(--brand-primary)]/75 to-black/60" />

          <DonateHero />
        </section>

        {/* ── Donation Methods ── */}
        <section className="section-padding gradient-section-warm" aria-label="How to donate">
          <div className="container-site">
            <div className="text-center mb-12">
              <span className="text-overline text-brand-gold inline-block mb-3">
                Ways to Give
              </span>
              <h2 className="text-h2">How You Can Donate</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* M-Pesa */}
              <article className="rounded-xl bg-[var(--brand-surface)] border border-[var(--border)] p-8 shadow-nawiri-sm card-lift">
                <div className="w-14 h-14 rounded-xl bg-[var(--brand-primary)] flex items-center justify-center mb-6">
                  <Smartphone className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[var(--brand-text-primary)] mb-4">
                  M-Pesa
                </h3>
                <div className="space-y-3 font-ui text-sm">
                  <div className="bg-[var(--brand-surface-warm)] rounded-lg p-4">
                    <p className="text-[var(--brand-text-muted)] text-xs uppercase tracking-wider mb-1">
                      Business Number
                    </p>
                    <p className="text-2xl font-bold text-[var(--brand-text-primary)] tracking-wide">
                      174 444
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--brand-text-muted)] text-xs uppercase tracking-wider mb-1">
                      Account Reference
                    </p>
                    <p className="font-semibold text-[var(--brand-text-primary)]">
                      NAWIRI
                    </p>
                  </div>
                  <ol className="list-decimal list-inside text-[var(--brand-text-secondary)] space-y-1 mt-4">
                    <li>Go to <strong>Lipa na M-Pesa</strong></li>
                    <li>Select <strong>Pay Bill</strong></li>
                    <li>Enter business number <strong>174 444</strong></li>
                    <li>Enter account reference <strong>NAWIRI</strong></li>
                    <li>Enter amount and confirm with your PIN</li>
                  </ol>
                </div>
              </article>

              {/* Bank Transfer */}
              <article className="rounded-xl bg-[var(--brand-surface)] border border-[var(--border)] p-8 shadow-nawiri-sm card-lift">
                <div className="w-14 h-14 rounded-xl bg-[var(--brand-secondary)] flex items-center justify-center mb-6">
                  <Building2 className="w-7 h-7 text-[var(--brand-text-on-gold)]" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[var(--brand-text-primary)] mb-4">
                  Bank Transfer
                </h3>
                <div className="space-y-3 font-ui text-sm">
                  <div className="bg-[var(--brand-surface-warm)] rounded-lg p-4 space-y-2">
                    <div>
                      <p className="text-[var(--brand-text-muted)] text-xs uppercase tracking-wider">Bank</p>
                      <p className="font-semibold text-[var(--brand-text-primary)]">Kenya Commercial Bank (KCB)</p>
                    </div>
                    <div>
                      <p className="text-[var(--brand-text-muted)] text-xs uppercase tracking-wider">Account Name</p>
                      <p className="font-semibold text-[var(--brand-text-primary)]">Nawiri Impact Africa</p>
                    </div>
                    <div>
                      <p className="text-[var(--brand-text-muted)] text-xs uppercase tracking-wider">Account Number</p>
                      <p className="font-semibold text-[var(--brand-text-primary)]">1234567890</p>
                    </div>
                    <div>
                      <p className="text-[var(--brand-text-muted)] text-xs uppercase tracking-wider">Branch</p>
                      <p className="font-semibold text-[var(--brand-text-primary)]">KCB Kenyatta Avenue</p>
                    </div>
                    <div>
                      <p className="text-[var(--brand-text-muted)] text-xs uppercase tracking-wider">SWIFT Code</p>
                      <p className="font-semibold text-[var(--brand-text-primary)]">KCABORO1XXX</p>
                    </div>
                  </div>
                </div>
              </article>

              {/* Other Ways */}
              <article className="rounded-xl bg-[var(--brand-surface)] border border-[var(--border)] p-8 shadow-nawiri-sm card-lift">
                <div className="w-14 h-14 rounded-xl bg-[var(--brand-accent-earth)] flex items-center justify-center mb-6">
                  <HandHeart className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[var(--brand-text-primary)] mb-4">
                  Other Ways to Give
                </h3>
                <div className="space-y-4 text-sm text-[var(--brand-text-secondary)] font-body">
                  <p>
                    We welcome in-kind donations including food items, clothing,
                    medical supplies, and educational materials for our
                    humanitarian and community programmes.
                  </p>
                  <p>
                    Corporate entities and institutional donors can explore
                    tailored partnership opportunities through our
                    partnerships team.
                  </p>
                  <p>
                    For international wire transfers or cheque donations, please
                    contact our finance department directly.
                  </p>
                  <div className="pt-2">
                    <p className="text-[var(--brand-text-muted)] text-xs font-ui uppercase tracking-wider mb-1">
                      Contact for Donations
                    </p>
                    <a
                      href={`mailto:${site.contact_email}`}
                      className="font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-primary-light)] transition-colors"
                    >
                      {site.contact_email}
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ── Partnership Enquiry ── */}
        <section className="section-padding" aria-label="Partnership enquiry">
          <div className="container-site">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left: Text */}
              <div>
                <span className="text-overline text-brand-gold inline-block mb-3">
                  Partner With Us
                </span>
                <h2 className="text-h2 mb-4">Partnership Enquiry</h2>
                <p className="text-prose mb-6">
                  Whether you are a corporate entity, government agency,
                  international donor, or community-based organization, we
                  welcome the opportunity to explore how we can work together
                  to achieve shared development goals.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary-50)] flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-[var(--brand-primary)]" />
                    </div>
                    <div>
                      <h4 className="font-ui font-bold text-[var(--brand-text-primary)] text-sm">
                        Institutional Partnerships
                      </h4>
                      <p className="text-sm text-[var(--brand-text-secondary)] font-body">
                        Collaborative programmes with development agencies and governments.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--brand-secondary-50)] flex items-center justify-center shrink-0">
                      <Heart className="w-5 h-5 text-[var(--brand-secondary)]" />
                    </div>
                    <div>
                      <h4 className="font-ui font-bold text-[var(--brand-text-primary)] text-sm">
                        Corporate Social Responsibility
                      </h4>
                      <p className="text-sm text-[var(--brand-text-secondary)] font-body">
                        Meaningful CSR initiatives that create measurable community impact.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--brand-accent-earth)]/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-[var(--brand-accent-earth)]" />
                    </div>
                    <div>
                      <h4 className="font-ui font-bold text-[var(--brand-text-primary)] text-sm">
                        Funding Partnerships
                      </h4>
                      <p className="text-sm text-[var(--brand-text-secondary)] font-body">
                        Grant-funded programmes with full transparency and reporting.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <div className="rounded-xl bg-[var(--brand-surface)] border border-[var(--border)] p-8 shadow-nawiri-sm">
                <PartnershipForm apiEndpoint="/api/contact" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Volunteer Section ── */}
        <section className="section-padding gradient-section-warm" aria-label="Volunteer">
          <div className="container-narrow">
            <div className="text-center mb-10">
              <span className="text-overline text-brand-gold inline-block mb-3">
                Get Involved
              </span>
              <h2 className="text-h2 mb-4">Volunteer With Us</h2>
              <p className="text-prose max-w-2xl mx-auto">
                Share your time, skills, and passion with communities across Kenya.
                Whether you are a professional, student, or simply someone who wants
                to make a difference — we would love to hear from you.
              </p>
            </div>

            <div className="rounded-xl bg-[var(--brand-surface)] border border-[var(--border)] p-8 md:p-10 shadow-nawiri-md">
              <VolunteerForm apiEndpoint="/api/contact" />
            </div>
          </div>
        </section>
      </main>

      <Footer settings={site} />
    </div>
  );
}
