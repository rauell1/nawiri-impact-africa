"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface AboutStripProps {
  mission?: string;
  vision?: string;
  image?: string;
  site_tagline?: string;
}

export default function AboutStrip({
  mission,
  vision,
  image,
  site_tagline,
}: AboutStripProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const missionText =
    mission ||
    "To walk alongside Kenyan communities — delivering programmes that build resilience, restore dignity, and create lasting opportunity.";
  const visionText =
    vision ||
    "A Kenya where every community has the agency, resources, and support to thrive.";

  return (
    <section
      ref={sectionRef}
      className="section-padding gradient-section-green"
      aria-label="About Nawiri"
    >
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-2xl overflow-hidden shadow-nawiri-lg aspect-[4/3]"
          >
            {image ? (
              <Image
                src={image}
                alt="Nawiri Impact Africa team at work"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full bg-[var(--brand-primary-50)] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-[var(--brand-primary)] flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-white font-heading">N</span>
                  </div>
                  <p className="text-[var(--brand-text-muted)] text-sm">Nawiri Impact Africa</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col gap-6"
          >
            <span className="text-overline text-[var(--brand-secondary)]">
              Who We Are
            </span>
            <h2 className="mb-1">
              {site_tagline || "Rooted Here. Building Together."}
            </h2>

            {/* Mission */}
            <div>
              <h4 className="text-sm font-bold font-ui text-[var(--brand-primary)] uppercase tracking-wider mb-2">
                Our Mission
              </h4>
              <p className="text-prose text-[var(--brand-text-secondary)] leading-relaxed">
                {missionText}
              </p>
            </div>

            {/* Vision */}
            <div>
              <h4 className="text-sm font-bold font-ui text-[var(--brand-primary)] uppercase tracking-wider mb-2">
                Our Vision
              </h4>
              <p className="text-prose text-[var(--brand-text-secondary)] leading-relaxed">
                {visionText}
              </p>
            </div>

            {/* About Link */}
            <div className="mt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold font-ui rounded-lg bg-[var(--brand-primary)] text-[var(--brand-text-inverse)] hover:bg-[var(--brand-primary-light)] transition-colors group"
              >
                <span>About Us</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
