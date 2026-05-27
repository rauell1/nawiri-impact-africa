"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Heart } from "lucide-react";

interface DonateCtaProps {
  heading: string;
  body?: string;
  button_label: string;
  button_url: string;
  background_color: string;
}

export default function DonateCta({
  heading,
  body,
  button_label,
  button_url,
  background_color,
}: DonateCtaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  // Determine text color based on background
  const isGold =
    background_color === "#D4A017" ||
    background_color === "#E8C84A" ||
    background_color === "#d4a017";
  const textColor = isGold ? "#3E2C00" : "#FFFFFF";
  const buttonBg = isGold ? "#1B5E20" : "#FFFFFF";
  const buttonText = isGold ? "#FFFFFF" : "#1B5E20";

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: background_color }}
      aria-label="Get involved"
    >
      {/* Decorative subtle pattern */}
      <div className="absolute inset-0 opacity-[0.07]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0,0,0,0.3) 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, rgba(0,0,0,0.2) 1px, transparent 1px),
              radial-gradient(circle at 60% 80%, rgba(0,0,0,0.25) 1px, transparent 1px)`,
            backgroundSize: "60px 60px, 80px 80px, 70px 70px",
          }}
        />
      </div>

      <div className="relative container-site section-padding-generous">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{ backgroundColor: `${buttonBg}20` }}
          >
            <Heart
              className="w-8 h-8"
              style={{ color: buttonBg }}
              fill={buttonBg}
              fillOpacity={0.3}
            />
          </motion.div>

          {/* Heading */}
          <h2
            className="mb-4"
            style={{ color: textColor }}
          >
            {heading}
          </h2>

          {/* Body */}
          {body && (
            <p
              className="text-prose-lg mb-8 max-w-2xl mx-auto leading-relaxed"
              style={{ color: `${textColor}CC` }}
            >
              {body}
            </p>
          )}

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Link
              href={button_url}
              className="inline-flex items-center gap-2.5 px-8 py-4 text-base font-bold rounded-lg transition-all duration-200 hover:opacity-90 hover:shadow-lg font-ui"
              style={{
                backgroundColor: buttonBg,
                color: buttonText,
              }}
            >
              <Heart className="w-5 h-5" />
              <span>{button_label}</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
