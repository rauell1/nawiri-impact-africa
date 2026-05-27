"use client";

import { motion } from "framer-motion";
import { FileText, Download, Shield, Clock } from "lucide-react";

interface PolicyCardProps {
  title: string;
  file_url: string;
  index: number;
}

function PolicyCard({ title, file_url, index }: PolicyCardProps) {
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
          href={file_url || "#"}
          target={file_url && file_url !== "#" ? "_blank" : undefined}
          rel={file_url && file_url !== "#" ? "noopener noreferrer" : undefined}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-opacity shadow-nawiri-sm"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </a>
      </div>
    </motion.article>
  );
}

interface SafeguardingContentProps {
  safeguarding: {
    safeguarding_headline: string;
    commitment_statement: string;
    reporting_contact_email: string;
    policy_documents: string; // JSON string: { title: string, file_url: string }[]
    last_reviewed_date: string | Date;
  } | null;
}

export default function SafeguardingContent({ safeguarding }: SafeguardingContentProps) {
  // Extract commitment statement
  const commitment = safeguarding?.commitment_statement || 
    "Nawiri Impact Africa is committed to the safety, dignity, and protection of all people we work with, particularly children and vulnerable adults. We have zero tolerance for abuse, exploitation, or harassment in any form. All staff, volunteers, and partners are required to uphold our Safeguarding Policy and report concerns immediately.";
  
  // Extract contact email
  const contactEmail = safeguarding?.reporting_contact_email || "safeguarding@nawiriimpactafrica.org";

  // Parse policies
  let policiesList: { title: string; file_url: string }[] = [];
  try {
    policiesList = JSON.parse(safeguarding?.policy_documents || "[]");
  } catch {
    policiesList = [];
  }
  if (policiesList.length === 0 || policiesList.every(p => p.file_url === "#")) {
    policiesList = [
      { title: "Safeguarding Policy (Child Protection & PSEA)", file_url: "/reports/safeguarding-policy.pdf" },
      { title: "Code of Conduct", file_url: "/reports/code-of-conduct.pdf" },
      { title: "Complaints & Feedback Mechanism", file_url: "/reports/complaints-mechanism.pdf" },
      { title: "Anti-Fraud and Corruption Policy", file_url: "/reports/anti-fraud-policy.pdf" },
      { title: "Data Protection Policy", file_url: "/reports/data-protection-policy.pdf" }
    ];
  }

  // Format last reviewed date
  const lastReviewedText = safeguarding?.last_reviewed_date
    ? new Date(safeguarding.last_reviewed_date).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "January 2025";

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
            <p className="text-prose-lg text-[var(--brand-text-secondary)] max-w-3xl mx-auto leading-relaxed whitespace-pre-line">
              {commitment}
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
            {policiesList.map((policy, i) => (
              <PolicyCard key={policy.title} title={policy.title} file_url={policy.file_url} index={i} />
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
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-lg font-bold text-[var(--brand-text-on-gold)] bg-[var(--brand-secondary)] hover:opacity-90 transition-opacity shadow-nawiri-sm text-lg"
            >
              <Shield className="w-5 h-5" />
              {contactEmail}
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
                {lastReviewedText}
              </span>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

