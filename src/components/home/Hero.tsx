"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

interface HeroProps {
  hero_headline: string;
  hero_subheadline: string;
  hero_cta_primary_label: string;
  hero_cta_primary_url: string;
  hero_cta_secondary_label?: string;
  hero_cta_secondary_url?: string;
  hero_background_image: string;
  hero_overlay_opacity: number;
  hero_text_alignment: string;
  secondary_color: string;
}

export default function Hero({
  hero_headline,
  hero_subheadline,
  hero_cta_primary_label,
  hero_cta_primary_url,
  hero_cta_secondary_label,
  hero_cta_secondary_url,
  hero_background_image,
  hero_overlay_opacity,
  hero_text_alignment,
  secondary_color,
}: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const textAlignClass =
    hero_text_alignment === "left"
      ? "text-left items-start"
      : hero_text_alignment === "right"
        ? "text-right items-end"
        : "text-center items-center";

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[600px] max-h-[1000px] flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ y: imageY, scale: imageScale }}
      >
        <Image
          src={hero_background_image}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </motion.div>

      {/* Color Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            160deg,
            rgba(13, 59, 18, ${(hero_overlay_opacity / 100) * 1.2}) 0%,
            rgba(27, 94, 32, ${hero_overlay_opacity / 100}) 40%,
            rgba(0, 0, 0, ${(hero_overlay_opacity / 100) * 0.7}) 100%
          )`,
        }}
      />

      {/* Bottom gradient for scroll indicator area */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--brand-background)] to-transparent" />

      {/* Content */}
      <div className={`relative z-10 container-site flex flex-col ${textAlignClass} gap-6 md:gap-8 max-w-4xl`}>
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-overline text-[var(--brand-secondary-light)] tracking-[0.15em]"
        >
          Nawiri Impact Africa
        </motion.span>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-display text-white leading-[1.1] max-w-3xl"
        >
          {hero_headline}
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-prose-lg text-white/80 max-w-2xl"
        >
          {hero_subheadline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className={`flex flex-wrap gap-4 mt-2 ${textAlignClass.includes("text-center") ? "justify-center" : textAlignClass.includes("text-right") ? "justify-end" : "justify-start"}`}
        >
          <Link
            href={hero_cta_primary_url}
            className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-bold rounded-lg transition-all duration-200 hover:opacity-90 hover:shadow-lg"
            style={{
              backgroundColor: secondary_color || "var(--brand-secondary)",
              color: "var(--brand-text-on-gold)",
            }}
          >
            {hero_cta_primary_label}
          </Link>

          {hero_cta_secondary_label && hero_cta_secondary_url && (
            <Link
              href={hero_cta_secondary_url}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-bold rounded-lg border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-200"
            >
              {hero_cta_secondary_label}
            </Link>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/50 font-ui tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
