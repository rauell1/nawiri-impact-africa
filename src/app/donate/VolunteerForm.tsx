"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";

interface VolunteerFormProps {
  apiEndpoint: string;
}

export default function VolunteerForm({ apiEndpoint }: VolunteerFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState("");
  const [availability, setAvailability] = useState("");
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
          name,
          email,
          subject: "Volunteer Application",
          message: `Skills: ${skills}\n\nAvailability: ${availability}`,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setSkills("");
        setAvailability("");
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
          Application Received!
        </h3>
        <p className="text-sm text-[var(--brand-text-secondary)] font-body">
          Thank you for volunteering! We will review your application and get back to you.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-bold text-[var(--brand-primary)] hover:underline"
        >
          Submit another application
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="vol-name" className="block text-sm font-medium font-ui text-[var(--brand-text-primary)] mb-1.5">
          Full Name
        </label>
        <input
          id="vol-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Kamau"
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--brand-surface)] font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-shadow"
        />
      </div>

      <div>
        <label htmlFor="vol-email" className="block text-sm font-medium font-ui text-[var(--brand-text-primary)] mb-1.5">
          Email Address
        </label>
        <input
          id="vol-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--brand-surface)] font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-shadow"
        />
      </div>

      <div>
        <label htmlFor="vol-skills" className="block text-sm font-medium font-ui text-[var(--brand-text-primary)] mb-1.5">
          Skills &amp; Experience
        </label>
        <textarea
          id="vol-skills"
          required
          rows={3}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="e.g. Project management, community mobilization, data analysis..."
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--brand-surface)] font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-shadow resize-y"
        />
      </div>

      <div>
        <label htmlFor="vol-availability" className="block text-sm font-medium font-ui text-[var(--brand-text-primary)] mb-1.5">
          Availability
        </label>
        <select
          id="vol-availability"
          required
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--brand-surface)] font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] cursor-pointer"
        >
          <option value="">Select availability...</option>
          <option value="Full-time (40+ hours/week)">Full-time (40+ hours/week)</option>
          <option value="Part-time (10-20 hours/week)">Part-time (10-20 hours/week)</option>
          <option value="Weekends only">Weekends only</option>
          <option value="Flexible / As needed">Flexible / As needed</option>
        </select>
      </div>

      {status === "error" && (
        <p className="text-sm text-[var(--brand-error)] font-ui">{errorMsg}</p>
      )}

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
            Apply to Volunteer
          </>
        )}
      </button>
    </form>
  );
}
