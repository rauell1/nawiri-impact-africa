import type { Metadata } from "next";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[var(--brand-background)]">
      <div className="text-center space-y-6 px-4">
        <div className="text-8xl font-heading font-bold text-[var(--brand-primary)] opacity-20">
          404
        </div>
        <h1 className="text-2xl md:text-3xl font-heading text-[var(--brand-text-primary)]">
          Page Not Found
        </h1>
        <p className="text-[var(--brand-text-secondary)] max-w-md mx-auto">
          The page you are looking for may have been moved, renamed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold font-ui rounded-lg bg-[var(--brand-primary)] text-[var(--brand-text-inverse)] hover:bg-[var(--brand-primary-light)] transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Homepage
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold font-ui rounded-lg border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-text-inverse)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
