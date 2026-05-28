import type { Metadata } from "next";
import { db } from "@/lib/db";
import { createMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import ContactForm from "./ContactForm";
import ContactHero from "./ContactHero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Nawiri Impact Africa. Reach us by email, phone, or visit our offices in Nairobi, Kenya.",
  path: "/contact",
});

async function getPageData() {
  const siteSettings = await db.siteSettings.findUnique({ where: { id: "main" } });

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

  return {
    site,
  };
}

export default async function ContactPage() {
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
          className="relative w-full min-h-[300px] md:min-h-[360px] flex items-center justify-center overflow-hidden"
          aria-label="Contact hero"
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

          <ContactHero />
        </section>

        {/* ── Contact Section ── */}
        <section className="section-padding" aria-label="Contact form and details">
          <div className="container-site">
            <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
              {/* Left: Form (3 cols) */}
              <div className="lg:col-span-3">
                <div className="rounded-xl bg-[var(--brand-surface)] border border-[var(--border)] p-8 md:p-10 shadow-nawiri-sm">
                  <h2 className="font-heading text-xl font-bold text-[var(--brand-text-primary)] mb-2">
                    Send Us a Message
                  </h2>
                  <p className="text-sm text-[var(--brand-text-muted)] font-ui mb-6">
                    Fill out the form below and we will get back to you as soon as possible.
                  </p>
                  <ContactForm />
                </div>
              </div>

              {/* Right: Contact Details (2 cols) */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact Info */}
                <div className="rounded-xl bg-[var(--brand-surface)] border border-[var(--border)] p-8 shadow-nawiri-sm">
                  <h3 className="font-heading text-lg font-bold text-[var(--brand-text-primary)] mb-6">
                    Contact Details
                  </h3>
                  <div className="space-y-5">
                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary-50)] flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-[var(--brand-primary)]" />
                      </div>
                      <div>
                        <p className="text-xs font-ui font-semibold text-[var(--brand-text-muted)] uppercase tracking-wider mb-1">
                          Email
                        </p>
                        <a
                          href={`mailto:${site.contact_email}`}
                          className="text-sm font-ui font-medium text-[var(--brand-primary)] hover:text-[var(--brand-primary-light)] transition-colors"
                        >
                          {site.contact_email}
                        </a>
                      </div>
                    </div>

                    {/* Phone */}
                    {site.contact_phone && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[var(--brand-secondary-50)] flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5 text-[var(--brand-secondary)]" />
                        </div>
                        <div>
                          <p className="text-xs font-ui font-semibold text-[var(--brand-text-muted)] uppercase tracking-wider mb-1">
                            Phone
                          </p>
                          <a
                            href={`tel:${site.contact_phone}`}
                            className="text-sm font-ui font-medium text-[var(--brand-text-primary)] hover:text-[var(--brand-primary)] transition-colors"
                          >
                            {site.contact_phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Address */}
                    {site.physical_address && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[var(--brand-accent-earth)]/10 flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-[var(--brand-accent-earth)]" />
                        </div>
                        <div>
                          <p className="text-xs font-ui font-semibold text-[var(--brand-text-muted)] uppercase tracking-wider mb-1">
                            Office
                          </p>
                          <p className="text-sm font-ui text-[var(--brand-text-primary)]">
                            {site.physical_address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Media */}
                {(site.social_twitter || site.social_linkedin || site.social_facebook || site.social_youtube) && (
                  <div className="rounded-xl bg-[var(--brand-surface)] border border-[var(--border)] p-8 shadow-nawiri-sm">
                    <h3 className="font-heading text-lg font-bold text-[var(--brand-text-primary)] mb-4">
                      Follow Us
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {site.social_facebook && (
                        <a
                          href={site.social_facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-ui font-medium bg-[var(--brand-surface-warm)] text-[var(--brand-text-secondary)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary-50)] transition-colors"
                        >
                          Facebook
                        </a>
                      )}
                      {site.social_twitter && (
                        <a
                          href={site.social_twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-ui font-medium bg-[var(--brand-surface-warm)] text-[var(--brand-text-secondary)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary-50)] transition-colors"
                        >
                          X / Twitter
                        </a>
                      )}
                      {site.social_linkedin && (
                        <a
                          href={site.social_linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-ui font-medium bg-[var(--brand-surface-warm)] text-[var(--brand-text-secondary)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary-50)] transition-colors"
                        >
                          LinkedIn
                        </a>
                      )}
                      {site.social_youtube && (
                        <a
                          href={site.social_youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-ui font-medium bg-[var(--brand-surface-warm)] text-[var(--brand-text-secondary)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary-50)] transition-colors"
                        >
                          YouTube
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Office Hours */}
                <div className="rounded-xl gradient-green-dark p-8 text-white">
                  <h3 className="font-heading text-lg font-bold mb-2">Office Hours</h3>
                  <div className="space-y-1 text-sm font-ui text-white/80">
                    <p>Monday – Friday: <span className="font-semibold text-white">8:00 AM – 5:00 PM</span></p>
                    <p>Saturday – Sunday: <span className="text-white/50">Closed</span></p>
                    <p className="pt-2 text-xs text-white/50">
                      Public holidays may affect operating hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={site} />
    </div>
  );
}
