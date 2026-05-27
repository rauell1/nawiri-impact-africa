"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Clock,
  Building2,
  AlertTriangle,
} from "lucide-react";

interface CareerDetailClientProps {
  department: string;
  location: string;
  employmentType: string;
  isUrgent: boolean;
}

export default function CareerDetailClient({
  department,
  location,
  employmentType,
  isUrgent,
}: CareerDetailClientProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45 }}
      className="flex flex-wrap items-center gap-3 mb-6"
    >
      {/* Department badge */}
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold font-ui rounded-full bg-[var(--brand-primary-50)] text-[var(--brand-primary)]">
        <Building2 className="w-3.5 h-3.5" />
        {department}
      </span>

      {/* Location badge */}
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold font-ui rounded-full bg-[var(--brand-surface-warm)] text-[var(--brand-text-secondary)] border border-[var(--border)]">
        <MapPin className="w-3.5 h-3.5" />
        {location}
      </span>

      {/* Employment type badge */}
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold font-ui rounded-full bg-[var(--brand-surface-warm)] text-[var(--brand-text-secondary)] border border-[var(--border)]">
        <Clock className="w-3.5 h-3.5" />
        {employmentType}
      </span>

      {/* Urgent badge */}
      {isUrgent && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold font-ui rounded-full bg-[var(--brand-error)] text-white">
          <AlertTriangle className="w-3.5 h-3.5" />
          Urgent
        </span>
      )}
    </motion.div>
  );
}
