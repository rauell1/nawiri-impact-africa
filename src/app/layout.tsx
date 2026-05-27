import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, DM_Sans } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { db } from "@/lib/db";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nawiriimpactafrica.org";
const SITE_NAME = "Nawiri Impact Africa";

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  } catch (error) {
    console.error("Failed to fetch site settings for metadata:", error);
  }

  const title = settings?.site_name || SITE_NAME;
  const tagline = settings?.site_tagline || "Rooted Here. Building Together.";
  const description = settings?.footer_description || "Nawiri Impact Africa is a Kenyan NGO delivering programmes in community development, humanitarian response, livelihood support, and social protection across the country.";
  const favicon = settings?.favicon_url || "/favicon.ico";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${title} — ${tagline}`,
      template: `%s | ${title}`,
    },
    description,
    keywords: [
      "Nawiri",
      "Impact Africa",
      "Kenya",
      "NGO",
      "community development",
      "humanitarian",
      "livelihoods",
      "social protection",
      "health",
      "nutrition",
      "child protection",
    ],
    authors: [{ name: title, url: SITE_URL }],
    creator: title,
    publisher: title,
    icons: {
      icon: [
        { url: favicon, sizes: "any" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.json",
    openGraph: {
      title: title,
      description: tagline,
      url: SITE_URL,
      siteName: title,
      locale: "en_KE",
      type: "website",
      images: [
        {
          url: "/images/hero-bg.jpg",
          width: 1200,
          height: 630,
          alt: `${title} — ${tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: tagline,
      images: ["/images/hero-bg.jpg"],
      creator: "@NawiriAfrica",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings = null;
  try {
    settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  } catch (error) {
    console.error("Failed to fetch site settings in RootLayout:", error);
  }

  const primaryColor = settings?.primary_color || "#1B5E20";
  const secondaryColor = settings?.secondary_color || "#D4A017";

  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      style={{
        "--brand-primary": primaryColor,
        "--brand-secondary": secondaryColor,
        "--primary": primaryColor,
        "--secondary": secondaryColor,
      } as React.CSSProperties}
    >
      <head>
        {/* JSON-LD: Organization (appears on every page) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NGO",
              name: settings?.site_name || SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}${settings?.logo_url || "/images/logo-placeholder.svg"}`,
              description: settings?.footer_description || "Nawiri Impact Africa is a Kenyan NGO delivering programmes in community development, humanitarian response, livelihood support, and social protection across the country.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Nairobi",
                addressCountry: "KE",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: settings?.contact_email || "kenyajobs@wr.org",
                contactType: "general",
              },
              sameAs: [],
            }),
          }}
        />
        {/* JSON-LD: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: settings?.site_name || SITE_NAME,
              url: SITE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/blog?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${sourceSerif.variable} ${dmSans.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        >
          Skip to main content
        </a>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

