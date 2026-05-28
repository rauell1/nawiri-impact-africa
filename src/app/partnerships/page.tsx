import type { Metadata } from "next";
import { db } from "@/lib/db";
import { createMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { HandHeart, ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = createMetadata({
  title: "Our Partners & Donors",
  description:
    "Nawiri Impact Africa works in collaboration with institutional donors, government agencies, and implementing partners to build resilient communities across Kenya.",
  path: "/partnerships",
});

async function getPageData() {
  try {
    const [siteSettings, partners] = await Promise.all([
      db.siteSettings.findUnique({ where: { id: "main" } }),
      db.partner.findMany({
        where: { status: "published" },
        orderBy: { sort_order: "asc" },
      }),
    ]);

    let footerLinks: { label: string; url: string }[] = [];
    try {
      footerLinks = JSON.parse(siteSettings?.footer_links || "[]");
    } catch {
      footerLinks = [];
    }

    const site = siteSettings
      ? {
          id: siteSettings.id,
          site_name: siteSettings.site_name,
          site_tagline: siteSettings.site_tagline,
          logo_url: siteSettings.logo_url,
          logo_dark_url: siteSettings.logo_dark_url || undefined,
          favicon_url: siteSettings.favicon_url,
          primary_color: siteSettings.primary_color,
          secondary_color: siteSettings.secondary_color,
          font_heading: siteSettings.font_heading,
          font_body: siteSettings.font_body,
          contact_email: siteSettings.contact_email,
          contact_phone: siteSettings.contact_phone,
          physical_address: siteSettings.physical_address,
          social_twitter: siteSettings.social_twitter || undefined,
          social_linkedin: siteSettings.social_linkedin || undefined,
          social_facebook: siteSettings.social_facebook || undefined,
          social_youtube: siteSettings.social_youtube || undefined,
          footer_description: siteSettings.footer_description,
          footer_links: footerLinks,
          cookie_banner_text: siteSettings.cookie_banner_text,
          maintenance_mode: siteSettings.maintenance_mode,
          google_analytics_id: siteSettings.google_analytics_id || undefined,
          createdAt: siteSettings.createdAt,
          updatedAt: siteSettings.updatedAt,
        }
      : null;

    const mappedPartners = partners.map((partner) => ({
      ...partner,
      website_url: partner.website_url || undefined,
      description: partner.description || undefined,
    }));

    return {
      site,
      partners: mappedPartners,
    };
  } catch (error) {
    console.error("Failed to load partnerships page data:", error);
    return null;
  }
}

export default async function PartnershipsPage() {
  const data = await getPageData();

  if (!data || !data.site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--brand-background)]">
        <p className="text-[var(--brand-text-muted)]">Unable to load partnerships data.</p>
      </div>
    );
  }

  const { site, partners } = data;

  // Group partners by type
  const donors = partners.filter((p) => p.partner_type === "Donor");
  const implementing = partners.filter((p) => p.partner_type === "Implementing Partner");
  const government = partners.filter((p) => p.partner_type === "Government");
  const others = partners.filter(
    (p) =>
      !["Donor", "Implementing Partner", "Government"].includes(p.partner_type)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar settings={site} />

      <main id="main-content" className="flex-1">
        {/* ── Hero Section ── */}
        <section
          className="gradient-hero section-padding-generous"
          aria-label="Partnerships header"
        >
          <div className="container-site text-center">
            <span className="text-overline text-[var(--brand-secondary-light)] mb-3 block">
              Building Together
            </span>
            <h1 className="text-display text-white mb-4">Our Partners &amp; Donors</h1>
            <p className="text-prose-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.85)" }}>
              No single organization can solve systemic challenges alone. We work in close collaboration with global agencies, local authorities, and grassroots groups to scale sustainable impact across Kenya.
            </p>
          </div>
        </section>

        {/* ── Donors Section ── */}
        {donors.length > 0 && (
          <section className="section-padding gradient-section-warm" aria-label="Institutional donors">
            <div className="container-site">
              <div className="mb-10 text-center md:text-left">
                <span className="text-overline text-brand-gold block mb-2">Funding Partners</span>
                <h2 className="text-h2">Institutional Donors</h2>
                <p className="text-prose text-[var(--brand-text-muted)] max-w-xl">
                  We are deeply grateful to the international grant-making bodies and funding partners whose financial trust sustains our programmes.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {donors.map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-white rounded-xl border border-[var(--border)] p-6 shadow-nawiri-sm flex flex-col justify-between hover:shadow-nawiri-md transition-shadow"
                  >
                    <div>
                      <div className="h-16 w-32 relative mb-4 shrink-0 flex items-center">
                        <Image
                          src={partner.logo_url}
                          alt={`${partner.name} logo`}
                          width={128}
                          height={64}
                          className="object-contain max-h-full max-w-full grayscale hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-[var(--brand-text-primary)] mb-2">
                        {partner.name}
                      </h3>
                      {partner.description && (
                        <p className="text-sm text-[var(--brand-text-secondary)] font-body leading-relaxed mb-4">
                          {partner.description}
                        </p>
                      )}
                    </div>
                    {partner.website_url && (
                      <a
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold font-ui text-[var(--brand-primary)] hover:underline mt-2 self-start"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Government & Strategic Section ── */}
        {government.length > 0 && (
          <section className="section-padding" aria-label="Government partners">
            <div className="container-site">
              <div className="mb-10 text-center md:text-left">
                <span className="text-overline text-brand-green block mb-2">Strategic Alliances</span>
                <h2 className="text-h2">Government &amp; Public Authorities</h2>
                <p className="text-prose text-[var(--brand-text-muted)] max-w-xl">
                  We coordinate closely with national ministries and county governments to align our interventions with local development blueprints and public frameworks.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {government.map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-white rounded-xl border border-[var(--border)] p-6 shadow-nawiri-sm flex flex-col justify-between hover:shadow-nawiri-md transition-shadow"
                  >
                    <div>
                      <div className="h-16 w-32 relative mb-4 shrink-0 flex items-center">
                        <Image
                          src={partner.logo_url}
                          alt={`${partner.name} logo`}
                          width={128}
                          height={64}
                          className="object-contain max-h-full max-w-full grayscale hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-[var(--brand-text-primary)] mb-2">
                        {partner.name}
                      </h3>
                      {partner.description && (
                        <p className="text-sm text-[var(--brand-text-secondary)] font-body leading-relaxed mb-4">
                          {partner.description}
                        </p>
                      )}
                    </div>
                    {partner.website_url && (
                      <a
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold font-ui text-[var(--brand-primary)] hover:underline mt-2 self-start"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Implementing & Technical Section ── */}
        {(implementing.length > 0 || others.length > 0) && (
          <section className="section-padding gradient-section-warm" aria-label="Implementing and technical partners">
            <div className="container-site">
              <div className="mb-10 text-center md:text-left">
                <span className="text-overline text-brand-gold block mb-2">Collaborative Action</span>
                <h2 className="text-h2">Implementing &amp; Technical Partners</h2>
                <p className="text-prose text-[var(--brand-text-muted)] max-w-xl">
                  Co-delivering grassroots solutions alongside peer NGOs, civil society coalitions, and technical advisors to achieve optimal project synergy.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...implementing, ...others].map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-white rounded-xl border border-[var(--border)] p-6 shadow-nawiri-sm flex flex-col justify-between hover:shadow-nawiri-md transition-shadow"
                  >
                    <div>
                      <div className="h-16 w-32 relative mb-4 shrink-0 flex items-center">
                        <Image
                          src={partner.logo_url}
                          alt={`${partner.name} logo`}
                          width={128}
                          height={64}
                          className="object-contain max-h-full max-w-full grayscale hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-[var(--brand-text-primary)] mb-2">
                        {partner.name}
                      </h3>
                      {partner.description && (
                        <p className="text-sm text-[var(--brand-text-secondary)] font-body leading-relaxed mb-4">
                          {partner.description}
                        </p>
                      )}
                    </div>
                    {partner.website_url && (
                      <a
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold font-ui text-[var(--brand-primary)] hover:underline mt-2 self-start"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Call to Action ── */}
        <section className="section-padding bg-[var(--brand-primary-dark)] text-white text-center" aria-label="Become a partner">
          <div className="container-narrow space-y-6">
            <div className="w-16 h-16 rounded-full bg-[var(--brand-primary)] flex items-center justify-center mx-auto mb-4">
              <HandHeart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-h2 text-white">Join Our Mission</h2>
            <p className="text-prose-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.85)" }}>
              If you represent an institutional funder, potential implementing partner, or corporate stakeholder interested in working with us, let us start a conversation.
            </p>
            <div className="pt-4">
              <Link
                href="/donate#partnership-enquiry"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--brand-secondary)] text-[var(--brand-text-on-gold)] font-bold font-ui shadow-nawiri-md hover:opacity-90 transition-opacity"
              >
                <span>Submit Partnership Enquiry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={site} />
    </div>
  );
}
