import type { Metadata } from "next";
import { db } from "@/lib/db";
import { createMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import SafeguardingHero from "./SafeguardingHero";
import SafeguardingContent from "./SafeguardingContent";

export const metadata: Metadata = createMetadata({
  title: "Safeguarding & Accountability",
  description:
    "Nawiri Impact Africa is committed to the safety, dignity, and protection of all people we work with. Learn about our safeguarding policies and reporting.",
  path: "/safeguarding",
});

async function getPageData() {
  const [siteSettings, safeguardingSettings] = await Promise.all([
    db.siteSettings.findUnique({ where: { id: "main" } }),
    db.safeguardingSettings.findUnique({ where: { id: "main" } }),
  ]);

  let footerLinks: { label: string; url: string }[] = [];
  try {
    footerLinks = JSON.parse(siteSettings?.footer_links || "[]");
  } catch {
    footerLinks = [];
  }

  return {
    site: { ...siteSettings, footer_links: footerLinks },
    safeguarding: safeguardingSettings,
  };
}

export default async function SafeguardingPage() {
  const { site, safeguarding } = await getPageData();

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--brand-background)]">
        <p className="text-[var(--brand-text-muted)]">Unable to load site data.</p>
      </div>
    );
  }

  const headline = safeguarding?.safeguarding_headline || "Safeguarding & Accountability";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar settings={site} />

      <main id="main-content" className="flex-1">
        {/* ── Hero ── */}
        <section
          className="relative w-full min-h-[340px] md:min-h-[400px] flex items-center justify-center overflow-hidden"
          aria-label="Safeguarding hero"
        >
          <Image
            src="/images/safeguarding-bg.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary-dark)]/85 via-[var(--brand-primary)]/80 to-[var(--brand-primary-dark)]/90" />

          <SafeguardingHero headline={headline} />
        </section>

        {/* ── Content ── */}
        <SafeguardingContent safeguarding={safeguarding} />
      </main>

      <Footer settings={site} />
    </div>
  );
}

