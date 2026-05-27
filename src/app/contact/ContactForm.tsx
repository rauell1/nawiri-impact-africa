"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";

const SUBJECT_OPTIONS = [
  "General Enquiry",
  "Programmes",
  "Partnerships",
  "Careers",
  "Safeguarding",
  "Media",
  "Other",
];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: subject || "General Enquiry",
          message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setSubject("");
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
        className="text-center py-12 px-6 rounded-xl bg-[var(--brand-primary-50)] border border-[var(--brand-primary)]/20"
      >
        <div className="w-14 h-14 bg-[var(--brand-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-heading text-xl font-bold text-[var(--brand-text-primary)] mb-2">
          Message Sent!
        </h3>
        <p className="text-sm text-[var(--brand-text-secondary)] font-body max-w-sm mx-auto">
          Thank you for reaching out. Our team will review your message and get back to you as soon as possible.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-bold text-[var(--brand-primary)] hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium font-ui text-[var(--brand-text-primary)] mb-1.5">
          Your Name <span className="text-[var(--brand-error)]">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Wanjiku"
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--brand-surface)] font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-shadow"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium font-ui text-[var(--brand-text-primary)] mb-1.5">
          Email Address <span className="text-[var(--brand-error)]">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--brand-surface)] font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-shadow"
        />
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium font-ui text-[var(--brand-text-primary)] mb-1.5">
          Subject <span className="text-[var(--brand-error)]">*</span>
        </label>
        <select
          id="contact-subject"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--brand-surface)] font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] cursor-pointer"
        >
          <option value="">Select a subject...</option>
          {SUBJECT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium font-ui text-[var(--brand-text-primary)] mb-1.5">
          Message <span className="text-[var(--brand-error)]">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help you?"
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
        className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-bold text-sm bg-[var(--brand-primary)] text-[var(--brand-text-on-green)] hover:bg-[var(--brand-primary-light)] transition-colors shadow-nawiri-sm disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
