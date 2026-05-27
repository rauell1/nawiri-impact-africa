"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, User } from "lucide-react";

const categoryColors: Record<string, string> = {
  News: "bg-[var(--brand-primary)] text-white",
  "Programme Updates": "bg-[var(--brand-secondary)] text-[var(--brand-text-on-gold)]",
  Humanitarian: "bg-[var(--brand-accent-earth)] text-white",
  Events: "bg-[var(--brand-primary-light)] text-white",
  default: "bg-[var(--brand-text-muted)] text-white",
};

interface BlogDetailClientProps {
  category: string;
  date: string;
  authorName?: string;
}

export default function BlogDetailClient({
  category,
  date,
  authorName,
}: BlogDetailClientProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const colorClass = categoryColors[category] || categoryColors.default;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45 }}
      className="flex flex-wrap items-center gap-3 mb-6"
    >
      {/* Category badge */}
      <span
        className={`inline-block px-3 py-1 text-xs font-bold font-ui rounded-full ${colorClass}`}
      >
        {category}
      </span>

      {/* Date */}
      <span className="flex items-center gap-1.5 text-sm text-[var(--brand-text-muted)] font-ui">
        <Calendar className="w-3.5 h-3.5" />
        {date}
      </span>

      {/* Author */}
      {authorName && (
        <span className="flex items-center gap-1.5 text-sm text-[var(--brand-text-muted)] font-ui">
          <User className="w-3.5 h-3.5" />
          {authorName}
        </span>
      )}
    </motion.div>
  );
}
