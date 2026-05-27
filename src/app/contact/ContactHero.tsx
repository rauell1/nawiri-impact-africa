"use client";

import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <div className="relative z-10 container-site text-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-overline text-[var(--brand-secondary-light)] inline-block mb-4">
          We&apos;d Love to Hear From You
        </span>
        <h1 className="text-display text-white max-w-3xl mx-auto">
          Get in Touch
        </h1>
        <p className="text-prose-lg text-white/80 mt-4 max-w-2xl mx-auto">
          Have a question about our programmes, want to partner with us, or just
          want to say hello? Reach out — we&apos;re here for you.
        </p>
      </motion.div>
    </div>
  );
}
