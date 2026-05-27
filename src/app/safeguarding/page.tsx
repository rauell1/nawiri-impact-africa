import type { Metadata } from "next";
import { db } from "@/lib/db";
import { createMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import SafeguardingHero from "./SafeguardingHero";
import SafeguardingContent from "./SafeguardingContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Safeguarding & Accountability",
  description:
    "Nawiri Impact Africa is committed to the safety, dignity, and protection of all people we work with. Learn about our safeguarding policies and reporting.",
  path: "/safeguarding",
});

async function getPageData() {
  let siteSettings: any = null;
  let safeguardingSettings: any = null;

  try {
    const [siteRes, safeguardingRes] = await Promise.all([
      db.siteSettings.findUnique({ where: { id: "main" } }),
      db.safeguardingSettings.findUnique({ where: { id: "main" } }),
    ]);
    siteSettings = siteRes;
    safeguardingSettings = safeguardingRes;
  } catch (error) {
    console.error("Failed to fetch safeguarding page data:", error);
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
        contact_email: "safeguarding@nawiriimpactafrica.org",
        contact_phone: "+254 700 000 000",
        physical_address: "Nairobi, Kenya",
      };

  return {
    site,
    safeguarding: safeguardingSettings,
  };
}

export default async function SafeguardingPage() {
  const { site, safeguarding } = await getPageData();

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

