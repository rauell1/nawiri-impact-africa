import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import ProgrammesPreview from "@/components/home/ProgrammesPreview";
import FeaturedStory from "@/components/home/FeaturedStory";
import AboutStrip from "@/components/home/AboutStrip";
import LatestBlog from "@/components/home/LatestBlog";
import PartnersStrip from "@/components/home/PartnersStrip";
import DonateCta from "@/components/home/DonateCta";
import Footer from "@/components/layout/Footer";
import { db } from "@/lib/db";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Nawiri Impact Africa — Rooted Here. Building Together.",
  description:
    "Nawiri Impact Africa is a Kenyan NGO delivering programmes in community development, humanitarian response, livelihood support, and social protection across the country.",
  path: "",
  keywords: [
    "Nawiri Impact Africa",
    "Kenya NGO",
    "community development",
    "humanitarian response",
    "livelihoods",
    "social protection",
    "health and nutrition",
    "child protection",
    "resilience",
  ],
});

async function getCmsData() {
  try {
    const [siteSettings, homeSettings, programmes, blogPosts, featuredPartners] = await Promise.all([
      db.siteSettings.findUnique({ where: { id: "main" } }),
      db.homeSettings.findUnique({ where: { id: "main" } }),
      db.programme.findMany({
        where: { status: "published" },
        orderBy: { sort_order: "asc" },
      }),
      db.blogPost.findMany({
        where: { status: "published" },
        orderBy: { published_date: "desc" },
        take: 3,
      }),
      db.partner.findMany({
        where: { status: "published", is_featured: true },
        orderBy: { sort_order: "asc" },
      }),
    ]);

    // Parse JSON fields
    let footerLinks: { label: string; url: string }[] = [];
    try {
      footerLinks = JSON.parse(siteSettings?.footer_links || "[]");
    } catch {
      footerLinks = [];
    }

    let stats: {
      number: string;
      label: string;
      icon: string;
      prefix: string;
      suffix: string;
    }[] = [];
    try {
      stats = JSON.parse(homeSettings?.stats || "[]");
    } catch {
      stats = [];
    }

    let featuredProgrammeSlugs: string[] = [];
    try {
      featuredProgrammeSlugs = JSON.parse(
        homeSettings?.home_featured_programmes || "[]"
      );
    } catch {
      featuredProgrammeSlugs = [];
    }

    // Filter to only featured programmes (or all if no featured specified)
    const featuredProgrammes =
      featuredProgrammeSlugs.length > 0
        ? programmes.filter((p) => featuredProgrammeSlugs.includes(p.slug))
        : programmes.slice(0, 4);

    const mappedProgrammes = featuredProgrammes.map((p) => ({
      ...p,
      color_accent: p.color_accent || undefined,
      impact_stat_1_number: p.impact_stat_1_number || undefined,
      impact_stat_1_label: p.impact_stat_1_label || undefined,
      impact_stat_2_number: p.impact_stat_2_number || undefined,
      impact_stat_2_label: p.impact_stat_2_label || undefined,
      impact_stat_3_number: p.impact_stat_3_number || undefined,
      impact_stat_3_label: p.impact_stat_3_label || undefined,
    }));

    // Fetch featured story if set
    let featuredStory: any = null;
    if (homeSettings?.featured_story_id) {
      const story = await db.story.findUnique({
        where: { id: homeSettings.featured_story_id },
      });

      if (story && story.status === "published") {
        // Look up the associated programme by slug (programme_id stores the slug)
        let programme: any = null;
        if (story.programme_id) {
          programme = programmes.find((p) => p.slug === story.programme_id) || null;
        }

        featuredStory = {
          ...story,
          author_role: story.author_role || undefined,
          author_photo: story.author_photo || undefined,
          location: story.location || undefined,
          programme_id: story.programme_id || undefined,
          pull_quote: story.pull_quote || undefined,
          programme: programme
            ? { title: programme.title, slug: programme.slug }
            : null,
        };
      }
    }

    const mappedBlogPosts = blogPosts.map((post) => ({
      ...post,
      excerpt: post.excerpt || undefined,
      author_name: post.author_name || undefined,
    }));

    const mappedFeaturedPartners = featuredPartners.map((partner) => ({
      ...partner,
      website_url: partner.website_url || undefined,
      description: partner.description || undefined,
    }));

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

    const home = homeSettings
      ? {
          id: homeSettings.id,
          hero_headline: homeSettings.hero_headline,
          hero_subheadline: homeSettings.hero_subheadline,
          hero_cta_primary_label: homeSettings.hero_cta_primary_label,
          hero_cta_primary_url: homeSettings.hero_cta_primary_url,
          hero_cta_secondary_label: homeSettings.hero_cta_secondary_label || undefined,
          hero_cta_secondary_url: homeSettings.hero_cta_secondary_url || undefined,
          hero_background_image: homeSettings.hero_background_image,
          hero_background_video_url: homeSettings.hero_background_video_url || undefined,
          hero_overlay_opacity: homeSettings.hero_overlay_opacity,
          hero_text_alignment: homeSettings.hero_text_alignment,
          stats,
          stats_bar_bg_color: homeSettings.stats_bar_bg_color,
          featured_story_id: homeSettings.featured_story_id || undefined,
          home_programmes_heading: homeSettings.home_programmes_heading,
          home_programmes_subtext: homeSettings.home_programmes_subtext || undefined,
          home_featured_programmes: homeSettings.home_featured_programmes,
          home_cta_heading: homeSettings.home_cta_heading,
          home_cta_body: homeSettings.home_cta_body || undefined,
          home_cta_button_label: homeSettings.home_cta_button_label,
          home_cta_button_url: homeSettings.home_cta_button_url,
          home_cta_background: homeSettings.home_cta_background,
          home_cta_image: homeSettings.home_cta_image || undefined,
          createdAt: homeSettings.createdAt,
          updatedAt: homeSettings.updatedAt,
        }
      : null;

    return {
      site,
      home,
      programmes: mappedProgrammes,
      featuredStory,
      blogPosts: mappedBlogPosts,
      featuredPartners: mappedFeaturedPartners,
    };
  } catch (error) {
    console.error("CMS fetch error:", error);
    return null;
  }
}

export default async function HomePage() {
  const data = await getCmsData();

  if (!data || !data.site || !data.home) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--brand-background)]">
        <div className="text-center space-y-4">
          <p className="text-[var(--brand-text-muted)]">
            Unable to load site data.
          </p>
          <p className="text-sm text-[var(--brand-text-muted)]">
            Please run the database seed:{" "}
            <code className="bg-muted px-2 py-0.5 rounded">
              npx tsx prisma/seed.ts
            </code>
          </p>
        </div>
      </div>
    );
  }

  const { site, home, programmes, featuredStory, blogPosts, featuredPartners } = data;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Section A: Navigation Bar */}
      <Navbar settings={site} />

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {/* Section B: Hero */}
        <Hero
          hero_headline={home.hero_headline}
          hero_subheadline={home.hero_subheadline}
          hero_cta_primary_label={home.hero_cta_primary_label}
          hero_cta_primary_url={home.hero_cta_primary_url}
          hero_cta_secondary_label={home.hero_cta_secondary_label || undefined}
          hero_cta_secondary_url={home.hero_cta_secondary_url || undefined}
          hero_background_image={home.hero_background_image}
          hero_overlay_opacity={home.hero_overlay_opacity}
          hero_text_alignment={home.hero_text_alignment}
          secondary_color={site.secondary_color}
        />

        {/* Section C: Impact Stats Bar */}
        <StatsBar
          stats={home.stats}
          stats_bar_bg_color={home.stats_bar_bg_color}
        />

        {/* Section D: Programmes Preview */}
        <ProgrammesPreview
          heading={home.home_programmes_heading}
          subtext={home.home_programmes_subtext || undefined}
          programmes={programmes}
        />

        {/* Section E: Featured Story */}
        <FeaturedStory story={featuredStory} />

        {/* Section F: About Strip */}
        <AboutStrip
          mission={site.footer_description || undefined}
          image="/images/about-strip.jpg"
          site_tagline={site.site_tagline}
        />

        {/* Section G: Latest Blog & News */}
        <LatestBlog posts={blogPosts} />

        {/* Section H: Partners Strip */}
        <PartnersStrip partners={featuredPartners} />

        {/* Section I: Donate / Get Involved CTA */}
        <DonateCta
          heading={home.home_cta_heading}
          body={home.home_cta_body || undefined}
          button_label={home.home_cta_button_label}
          button_url={home.home_cta_button_url}
          background_color={home.home_cta_background}
        />
      </main>

      {/* Section J: Footer */}
      <Footer settings={site} />
    </div>
  );
}
