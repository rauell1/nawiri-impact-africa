"use client";

import { motion } from "framer-motion";
import { FileText, Download, Shield, Clock } from "lucide-react";

interface PolicyCardProps {
  title: string;
  index: number;
}

function PolicyCard({ title, index }: PolicyCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="rounded-xl bg-[var(--brand-surface)] border border-[var(--border)] p-6 shadow-nawiri-sm card-lift flex flex-col"
    >
      <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary-50)] flex items-center justify-center mb-4">
        <FileText className="w-6 h-6 text-[var(--brand-primary)]" />
      </div>
      <h3 className="font-heading text-base font-bold text-[var(--brand-text-primary)] mb-3">
        {title}
      </h3>
      <div className="mt-auto pt-4">
        <a
          href="#"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-[var(--brand-primary)] text-[var(--brand-text-on-green)] hover:bg-[var(--brand-primary-light)] transition-colors shadow-nawiri-sm"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </a>
      </div>
    </motion.article>
  );
}

const POLICIES = [
  "Safeguarding Policy (Child Protection & PSEA)",
  "Code of Conduct",
  "Complaints & Feedback Mechanism",
  "Anti-Fraud and Corruption Policy",
  "Data Protection Policy",
];

export default function SafeguardingContent() {
  return (
    <>
      {/* Commitment Statement */}
      <section className="section-padding gradient-section-warm" aria-label="Our commitment">
        <div className="container-narrow text-center">
          <div className="rounded-2xl bg-[var(--brand-surface)] border border-[var(--border)] p-8 md:p-12 shadow-nawiri-md">
            <div className="w-16 h-16 rounded-full bg-[var(--brand-primary)] flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-h3 mb-6">Our Commitment</h2>
            <p className="text-prose-lg text-[var(--brand-text-secondary)] max-w-3xl mx-auto leading-relaxed">
              Nawiri Impact Africa is committed to the safety, dignity, and
              protection of all people we work with, particularly children and
              vulnerable adults. We have zero tolerance for abuse, exploitation,
              or harassment in any form. All staff, volunteers, and partners are
              required to uphold our Safeguarding Policy and report concerns
              immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Documents */}
      <section className="section-padding" aria-label="Policy documents">
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="text-overline text-brand-gold inline-block mb-3">
              Our Policies
            </span>
            <h2 className="text-h2">Key Policies &amp; Documents</h2>
            <p className="text-prose mt-3 max-w-2xl mx-auto">
              Our policies are reviewed regularly and are available for download.
              These documents reflect our commitment to operating with integrity
              and transparency.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {POLICIES.map((policy, i) => (
              <PolicyCard key={policy} title={policy} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Reporting Contact */}
      <section className="section-padding gradient-section-warm" aria-label="Report a concern">
        <div className="container-narrow">
          <div className="rounded-2xl gradient-green-dark p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-h3 text-white mb-4">Report a Concern</h2>
            <p className="text-white/80 font-body text-lg max-w-xl mx-auto mb-6">
              If you wish to raise a safeguarding concern, report misconduct,
              or share feedback about our programmes, please contact us
              confidentially.
            </p>
            <a
              href="mailto:safeguarding@nawiriimpactafrica.org"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-lg font-bold text-[var(--brand-text-on-gold)] bg-[var(--brand-secondary)] hover:opacity-90 transition-opacity shadow-nawiri-sm text-lg"
            >
              <Shield className="w-5 h-5" />
              safeguarding@nawiriimpactafrica.org
            </a>
            <p className="text-white/50 text-sm font-ui mt-4">
              All reports are treated with strict confidentiality.
            </p>
          </div>
        </div>
      </section>

      {/* Last Reviewed */}
      <section className="section-padding-compact" aria-label="Policy review date">
        <div className="container-narrow text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-surface-warm)] border border-[var(--border)]">
            <Clock className="w-4 h-4 text-[var(--brand-text-muted)]" />
            <span className="text-sm font-ui text-[var(--brand-text-muted)]">
              Policies last reviewed:{" "}
              <span className="font-semibold text-[var(--brand-text-primary)]">
                January 2025
              </span>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
