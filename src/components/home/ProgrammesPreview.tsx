import Link from "next/link";
import Image from "next/image";
import {
  Leaf,
  Shield,
  Baby,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";

interface Programme {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  cover_image: string;
  icon: string;
  color_accent?: string;
}

interface ProgrammesPreviewProps {
  heading: string;
  subtext?: string;
  programmes: Programme[];
}

const iconMap: Record<string, LucideIcon> = {
  Leaf,
  Shield,
  Baby,
  HeartPulse,
};

export default function ProgrammesPreview({
  heading,
  subtext,
  programmes,
}: ProgrammesPreviewProps) {
  if (!programmes || programmes.length === 0) return null;

  return (
    <section className="section-padding" aria-label="Our programmes">
      <div className="container-site">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-overline text-[var(--brand-secondary)] mb-3 block">
            What We Do
          </span>
          <h2 className="mb-4">{heading}</h2>
          {subtext && (
            <p className="text-prose text-[var(--brand-text-secondary)]">
              {subtext}
            </p>
          )}
        </div>

        {/* Programmes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
          {programmes.map((programme, index) => {
            const IconComponent = iconMap[programme.icon] || Leaf;
            const accentColor =
              programme.color_accent || "var(--brand-primary)";

            return (
              <Link
                key={programme.id}
                href={`/programmes/${programme.slug}`}
                className="group block"
                aria-label={`Learn more about ${programme.title}`}
              >
                <article className="relative bg-white rounded-xl overflow-hidden shadow-nawiri-sm card-lift border border-[var(--border)]">
                  {/* Colour accent bar at top */}
                  <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: accentColor }}
                  />

                  {/* Icon badge */}
                  <div className="pt-6 px-6">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{
                        backgroundColor: accentColor,
                      }}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-6 pb-6">
                    <h3 className="text-base md:text-lg font-bold text-[var(--brand-text-primary)] mb-2 group-hover:text-[var(--brand-primary)] transition-colors leading-snug">
                      {programme.title}
                    </h3>
                    <p className="text-sm text-[var(--brand-text-muted)] leading-relaxed line-clamp-3">
                      {programme.short_description}
                    </p>

                    {/* Learn more link */}
                    <div className="mt-4 flex items-center gap-1.5 text-sm font-bold font-ui" style={{ color: accentColor }}>
                      <span>Learn More</span>
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
