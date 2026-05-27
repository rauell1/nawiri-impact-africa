import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

interface FooterLink {
  label: string;
  url: string;
}

interface FooterProps {
  settings: {
    site_name: string;
    site_tagline: string;
    logo_url: string;
    footer_description: string;
    footer_links: FooterLink[];
    contact_email: string;
    contact_phone: string;
    physical_address: string;
    social_twitter?: string;
    social_linkedin?: string;
    social_facebook?: string;
    social_youtube?: string;
    primary_color: string;
  };
}

export default function Footer({ settings }: FooterProps) {
  const quickLinks = settings.footer_links.filter(
    (l) =>
      !["Donate", "Get Involved"].some(
        (d) => l.label.toLowerCase().includes(d.toLowerCase())
      )
  );
  const programmeLinks = [
    { label: "Community Resilience & Livelihoods", url: "/programmes/community-resilience" },
    { label: "Humanitarian Response & Social Protection", url: "/programmes/humanitarian-response" },
    { label: "Child & Family Wellbeing", url: "/programmes/child-wellbeing" },
    { label: "Health & Nutrition", url: "/programmes/health-nutrition" },
  ];

  return (
    <footer className="bg-[var(--brand-primary-dark)] text-white" role="contentinfo">
      <div className="container-site section-padding-compact">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Logo + Tagline + Description */}
          <div className="space-y-4">
            <Image
              src={settings.logo_url}
              alt={settings.site_name}
              width={140}
              height={40}
              className="h-9 w-auto brightness-0 invert"
            />
            <p className="text-white/60 text-sm leading-relaxed">
              {settings.footer_description || settings.site_tagline}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-[var(--brand-secondary)] uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Programmes */}
          <div>
            <h3 className="text-sm font-bold text-[var(--brand-secondary)] uppercase tracking-wider mb-4">
              Programmes
            </h3>
            <ul className="space-y-2.5">
              {programmeLinks.map((link) => (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-sm font-bold text-[var(--brand-secondary)] uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-[var(--brand-secondary)] shrink-0" />
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {settings.contact_email}
                </a>
              </li>
              {settings.contact_phone && (
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 text-[var(--brand-secondary)] shrink-0" />
                  <a
                    href={`tel:${settings.contact_phone}`}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {settings.contact_phone}
                  </a>
                </li>
              )}
              {settings.physical_address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-[var(--brand-secondary)] shrink-0" />
                  <span className="text-sm text-white/70">
                    {settings.physical_address}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} {settings.site_name}. All rights
            reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/safeguarding"
              className="text-xs font-bold text-[var(--brand-secondary)] hover:text-[var(--brand-secondary-light)] transition-colors"
            >
              Safeguarding &amp; Accountability
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
