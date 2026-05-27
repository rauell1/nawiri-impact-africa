import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nawiriimpactafrica.org";
const SITE_NAME = "Nawiri Impact Africa";
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hero-bg.jpg`;

/**
 * Shared SEO helpers for consistent metadata across all pages.
 */
export function createMetadata({
  title,
  description,
  path = "",
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex = false,
  keywords,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImage = image ? `${SITE_URL}${image}` : DEFAULT_OG_IMAGE;

  return {
    title: fullTitle,
    description,
    keywords: keywords || [SITE_NAME, "Kenya NGO", "community development", "humanitarian"],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_KE",
      type: type === "article" ? "article" : "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" && publishedTime
        ? { publishedTime, modifiedTime: modifiedTime || publishedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: "@NawiriAfrica",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  };
}

/**
 * Generate BreadcrumbList JSON-LD structured data for a page.
 * Items are rendered as absolute URLs.
 *
 * @example
 * createBreadcrumbJsonLd([
 *   { name: "Home", path: "/" },
 *   { name: "Blog", path: "/blog" },
 *   { name: "My Post", path: "/blog/my-post" },
 * ])
 */
export function createBreadcrumbJsonLd(
  items: { name: string; path: string }[]
): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
  return JSON.stringify(jsonLd);
}
