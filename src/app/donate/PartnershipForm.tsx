"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";

interface PartnershipFormProps {
  apiEndpoint: string;
}

export default function PartnershipForm({ apiEndpoint }: PartnershipFormProps) {
  const [orgName, setOrgName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email,
          subject: `Partnership Enquiry — ${orgName}`,
          message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setOrgName("");
        setContactName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10 px-6 rounded-xl bg-[var(--brand-primary-50)] border border-[var(--brand-primary)]/20"
      >
        <div className="w-12 h-12 bg-[var(--brand-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-heading text-lg font-bold text-[var(--brand-text-primary)] mb-2">
          Enquiry Received!
        </h3>
        <p className="text-sm text-[var(--brand-text-secondary)] font-body">
          Thank you for your interest in partnering with us. Our team will be in touch soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-bold text-[var(--brand-primary)] hover:underline"
        >
          Send another enquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Organization Name */}
      <div>
        <label htmlFor="org-name" className="block text-sm font-medium font-ui text-[var(--brand-text-primary)] mb-1.5">
          Organization Name
        </label>
        <input
          id="org-name"
          type="text"
          required
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="e.g. ABC Foundation"
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--brand-surface)] font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-shadow"
        />
      </div>

      {/* Contact Name */}
      <div>
        <label htmlFor="partner-contact" className="block text-sm font-medium font-ui text-[var(--brand-text-primary)] mb-1.5">
          Contact Person Name
        </label>
        <input
          id="partner-contact"
          type="text"
          required
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          placeholder="Jane Wanjiku"
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--brand-surface)] font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-shadow"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="partner-email" className="block text-sm font-medium font-ui text-[var(--brand-text-primary)] mb-1.5">
          Email Address
        </label>
        <input
          id="partner-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@abcfoundation.org"
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--brand-surface)] font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-shadow"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="partner-message" className="block text-sm font-medium font-ui text-[var(--brand-text-primary)] mb-1.5">
          Message
        </label>
        <textarea
          id="partner-message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your organization and how you'd like to partner with us..."
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--brand-surface)] font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-shadow resize-y"
        />
      </div>

      {/* Error */}
      {status === "error" && (
        <p className="text-sm text-[var(--brand-error)] font-ui">{errorMsg}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm bg-[var(--brand-primary)] text-[var(--brand-text-on-green)] hover:bg-[var(--brand-primary-light)] transition-colors shadow-nawiri-sm disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Enquiry
          </>
        )}
      </button>
    </form>
  );
}
