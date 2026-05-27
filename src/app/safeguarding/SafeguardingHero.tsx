"use client";

import { motion } from "framer-motion";

export default function SafeguardingHero() {
  return (
    <div className="relative z-10 container-site text-center py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-overline text-[var(--brand-secondary-light)] inline-block mb-4">
          Protection &amp; Accountability
        </span>
        <h1 className="text-display text-white max-w-3xl mx-auto">
          Safeguarding &amp; Accountability
        </h1>
        <p className="text-prose-lg text-white/80 mt-4 max-w-2xl mx-auto">
          We hold ourselves to the highest standards of protection, transparency,
          and accountability in everything we do.
        </p>
      </motion.div>
    </div>
  );
}
