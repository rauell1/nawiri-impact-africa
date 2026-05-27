"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, BookOpen } from "lucide-react";

interface FeaturedStoryProps {
  story: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    author_name: string;
    author_role?: string;
    cover_image: string;
    location?: string;
    programme?: {
      title: string;
      slug: string;
    } | null;
  } | null;
}

export default function FeaturedStory({ story }: FeaturedStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  if (!story) return null;

  return (
    <section
      ref={sectionRef}
      className="section-padding surface-warm"
      aria-label="Featured story"
    >
      <div className="container-site">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-14"
        >
          <span className="text-overline text-[var(--brand-secondary)] mb-3 block">
            Impact Story
          </span>
          <h2 className="mb-3">Stories of Change</h2>
          <p className="text-prose text-[var(--brand-text-secondary)]">
            Real stories from the communities we serve, showing the lasting impact of our work.
          </p>
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-stretch">
          {/* Image Column (60%) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 relative rounded-2xl overflow-hidden shadow-nawiri-lg min-h-[300px] lg:min-h-[420px]"
          >
            <Image
              src={story.cover_image}
              alt={story.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            {/* Gradient overlay on image for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>

          {/* Text Column (40%) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="lg:col-span-2 flex flex-col justify-center"
          >
            {/* Programme Tag */}
            {story.programme && (
              <Link
                href={`/programmes/${story.programme.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold font-ui uppercase tracking-wider text-[var(--brand-primary)] bg-[var(--brand-primary-50)] px-3 py-1.5 rounded-full w-fit mb-4 hover:bg-[var(--brand-primary)] hover:text-white transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {story.programme.title}
              </Link>
            )}

            {/* Story Title */}
            <h3 className="text-xl md:text-2xl lg:text-[1.625rem] leading-snug text-[var(--brand-text-primary)] mb-4">
              {story.title}
            </h3>

            {/* Location */}
            {story.location && (
              <div className="flex items-center gap-1.5 text-sm text-[var(--brand-text-muted)] mb-4 font-ui">
                <MapPin className="w-4 h-4" />
                <span>{story.location}</span>
              </div>
            )}

            {/* Excerpt */}
            <p className="text-prose text-[var(--brand-text-secondary)] mb-6 leading-relaxed">
              {story.excerpt}
            </p>

            {/* Author */}
            {story.author_name && (
              <div className="mb-6">
                <p className="text-sm font-bold text-[var(--brand-text-primary)] font-ui">
                  {story.author_name}
                </p>
                {story.author_role && (
                  <p className="text-xs text-[var(--brand-text-muted)]">
                    {story.author_role}
                  </p>
                )}
              </div>
            )}

            {/* Read Story Link */}
            <Link
              href={`/stories/${story.slug}`}
              className="inline-flex items-center gap-2 text-sm font-bold font-ui text-[var(--brand-primary)] hover:text-[var(--brand-primary-light)] transition-colors group"
            >
              <span>Read Full Story</span>
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
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
