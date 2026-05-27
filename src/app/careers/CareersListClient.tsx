"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Building2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

interface Career {
  id: string;
  job_title: string;
  slug: string;
  department: string;
  location: string;
  employment_type: string;
  application_deadline: Date;
  is_urgent: boolean;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isPastDeadline(date: Date): boolean {
  return new Date(date) < new Date();
}

export default function CareersListClient({ careers }: { careers: Career[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
    >
      {careers.map((job, index) => {
        const closed = isPastDeadline(job.application_deadline);

        return (
          <motion.article
            key={job.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 * (index % 6) }}
            className="group"
          >
            <Link href={`/careers/${job.slug}`} className="block">
              <div
                className={`bg-white rounded-xl overflow-hidden border transition-all ${
                  closed
                    ? "opacity-70 border-[var(--border)]"
                    : "shadow-nawiri-sm card-lift border-[var(--border)]"
                }`}
              >
                <div className="p-6 md:p-7">
                  {/* Top row: Urgent badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Department badge */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold font-ui rounded-full bg-[var(--brand-primary-50)] text-[var(--brand-primary)]">
                        <Building2 className="w-3 h-3" />
                        {job.department}
                      </span>
                      {/* Employment type badge */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold font-ui rounded-full bg-[var(--brand-surface-warm)] text-[var(--brand-text-secondary)]">
                        <Clock className="w-3 h-3" />
                        {job.employment_type}
                      </span>
                    </div>

                    {/* Urgent badge */}
                    {job.is_urgent && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold font-ui rounded-full bg-[var(--brand-error)] text-white shrink-0">
                        <AlertTriangle className="w-3 h-3" />
                        Urgent
                      </span>
                    )}
                  </div>

                  {/* Job title */}
                  <h3 className="text-lg md:text-xl font-bold text-[var(--brand-text-primary)] mb-2 group-hover:text-[var(--brand-primary)] transition-colors leading-snug">
                    {job.job_title}
                  </h3>

                  {/* Location + Deadline */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-[var(--brand-text-muted)] font-ui mb-4">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Closes {formatDate(job.application_deadline)}
                    </span>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-1.5 text-sm font-bold font-ui text-[var(--brand-primary)] group-hover:text-[var(--brand-primary-light)] transition-colors">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
