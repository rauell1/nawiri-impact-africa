"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_image: string;
  category: string;
  author_name?: string;
  published_date: Date;
}

const categoryColors: Record<string, string> = {
  News: "bg-[var(--brand-primary)] text-white",
  "Programme Updates": "bg-[var(--brand-secondary)] text-[var(--brand-text-on-gold)]",
  Humanitarian: "bg-[var(--brand-accent-earth)] text-white",
  Events: "bg-[var(--brand-primary-light)] text-white",
  default: "bg-[var(--brand-text-muted)] text-white",
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogListClient({ posts }: { posts: BlogPost[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {posts.map((post, index) => {
        const colorClass = categoryColors[post.category] || categoryColors.default;

        return (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 * (index % 6) }}
            className="group"
          >
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="bg-white rounded-xl overflow-hidden shadow-nawiri-sm card-lift border border-[var(--border)]">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold font-ui rounded-full ${colorClass}`}
                    >
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                  {/* Date */}
                  <p className="flex items-center gap-1.5 text-xs text-[var(--brand-text-muted)] font-ui mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(post.published_date)}
                  </p>

                  {/* Title */}
                  <h3 className="text-base md:text-lg font-bold text-[var(--brand-text-primary)] mb-2 leading-snug group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-sm text-[var(--brand-text-muted)] leading-relaxed line-clamp-3 mb-3 font-body">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Read more */}
                  <div className="flex items-center gap-1.5 text-sm font-bold font-ui text-[var(--brand-primary)] group-hover:text-[var(--brand-primary-light)] transition-colors">
                    <span>Read More</span>
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
              </div>
            </Link>
          </motion.article>
        );
      })}
    </div>
  );
}
