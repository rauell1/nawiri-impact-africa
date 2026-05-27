"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
  partner_type?: string;
}

interface PartnersStripProps {
  partners: Partner[];
}

export default function PartnersStrip({ partners }: PartnersStripProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  if (!partners || partners.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="section-padding-compact surface-warm"
      aria-label="Our partners and donors"
    >
      <div className="container-site">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-10"
        >
          <span className="text-overline text-[var(--brand-secondary)] mb-3 block">
            Working Together
          </span>
          <h2 className="mb-2">Our Partners & Donors</h2>
          <p className="text-prose text-sm text-[var(--brand-text-muted)]">
            We are grateful for the trust and support of our partners.
          </p>
        </motion.div>

        {/* Partners Logo Grid */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-10 lg:gap-14">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
              className="group relative"
            >
              {partner.website_url ? (
                <a
                  href={partner.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  aria-label={`Visit ${partner.name} website`}
                >
                  <div className="flex items-center justify-center w-36 h-20 md:w-44 md:h-24 rounded-xl bg-white border border-[var(--border)] p-4 transition-all duration-300 shadow-nawiri-sm hover:shadow-nawiri-md hover:border-[var(--brand-primary-50)]">
                    {/* Logo or fallback text */}
                    <div className="relative w-full h-full grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100">
                      {partner.logo_url &&
                      !partner.logo_url.includes("placeholder") ? (
                        <Image
                          src={partner.logo_url}
                          alt={`${partner.name} logo`}
                          fill
                          className="object-contain"
                          sizes="176px"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <span className="text-sm md:text-base font-bold font-ui text-[var(--brand-text-secondary)] text-center leading-tight">
                            {partner.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              ) : (
                <div className="flex items-center justify-center w-36 h-20 md:w-44 md:h-24 rounded-xl bg-white border border-[var(--border)] p-4 transition-all duration-300 shadow-nawiri-sm hover:shadow-nawiri-md hover:border-[var(--brand-primary-50)]">
                  <div className="relative w-full h-full grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100">
                    {partner.logo_url &&
                    !partner.logo_url.includes("placeholder") ? (
                      <Image
                        src={partner.logo_url}
                        alt={`${partner.name} logo`}
                        fill
                        className="object-contain"
                        sizes="176px"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <span className="text-sm md:text-base font-bold font-ui text-[var(--brand-text-secondary)] text-center leading-tight">
                          {partner.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
