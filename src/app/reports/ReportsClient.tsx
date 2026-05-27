"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Calendar, Search } from "lucide-react";

interface Report {
  id: string;
  title: string;
  description: string | null;
  document_type: string;
  year: number;
  file_url: string;
  is_featured: boolean;
}

interface ReportsClientProps {
  reports: Report[];
  years: number[];
  docTypes: string[];
}

const typeColors: Record<string, string> = {
  "Annual Report": "bg-[var(--brand-primary-50)] text-[var(--brand-primary-dark)]",
  "Financial Report": "bg-[var(--brand-secondary-50)] text-[var(--brand-text-on-gold)]",
  "Evaluation": "bg-[var(--brand-accent-earth)]/10 text-[var(--brand-accent-earth-dark)]",
};

export default function ReportsClient({
  reports,
  years,
  docTypes,
}: ReportsClientProps) {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (selectedYear !== "all" && r.year !== Number(selectedYear)) return false;
      if (selectedType !== "all" && r.document_type !== selectedType) return false;
      if (
        searchQuery.trim() &&
        !r.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(r.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [reports, selectedYear, selectedType, searchQuery]);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <label htmlFor="report-search" className="sr-only">Search reports</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--brand-text-muted)]" />
          <input
            id="report-search"
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--brand-surface)] font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-shadow"
          />
        </div>

        {/* Year Filter */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="year-filter"
            className="text-sm font-ui font-medium text-[var(--brand-text-secondary)] whitespace-nowrap"
          >
            Year:
          </label>
          <select
            id="year-filter"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--brand-surface)] font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] cursor-pointer"
          >
            <option value="all">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="type-filter"
            className="text-sm font-ui font-medium text-[var(--brand-text-secondary)] whitespace-nowrap"
          >
            Type:
          </label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--brand-surface)] font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] cursor-pointer"
          >
            <option value="all">All Types</option>
            {docTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-[var(--brand-text-muted)] font-ui mb-6">
        Showing {filtered.length} of {reports.length} publications
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((report, i) => (
            <motion.article
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-xl bg-[var(--brand-surface)] border border-[var(--border)] p-6 shadow-nawiri-sm card-lift flex flex-col"
            >
              {/* Type badge */}
              <span
                className={`inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                  typeColors[report.document_type] ||
                  "bg-[var(--brand-surface-warm)] text-[var(--brand-text-secondary)]"
                }`}
              >
                <FileText className="w-3 h-3" />
                {report.document_type}
              </span>

              {/* Title */}
              <h3 className="font-heading text-base font-bold text-[var(--brand-text-primary)] mb-2 leading-snug">
                {report.title}
              </h3>

              {/* Year */}
              <span className="inline-flex items-center gap-1.5 text-xs text-[var(--brand-text-muted)] font-ui mb-3">
                <Calendar className="w-3 h-3" />
                {report.year}
              </span>

              {/* Description */}
              {report.description && (
                <p className="text-sm text-[var(--brand-text-secondary)] font-body line-clamp-3 mb-6 flex-1">
                  {report.description}
                </p>
              )}

              {/* Download button */}
              {report.file_url && (
                <a
                  href={report.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 mt-auto px-5 py-2.5 rounded-lg font-bold text-sm bg-[var(--brand-primary)] text-[var(--brand-text-on-green)] hover:bg-[var(--brand-primary-light)] transition-colors shadow-nawiri-sm"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
              )}
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-[var(--brand-text-muted)]/40 mx-auto mb-4" />
          <p className="text-[var(--brand-text-muted)] font-ui">
            No reports match your filters.
          </p>
          <button
            onClick={() => {
              setSelectedYear("all");
              setSelectedType("all");
              setSearchQuery("");
            }}
            className="mt-4 text-sm font-bold text-[var(--brand-primary)] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </>
  );
}
