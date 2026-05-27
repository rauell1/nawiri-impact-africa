"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface CookieBannerProps {
  text: string;
}

const COOKIE_KEY = "nawiri_cookie_consent";

export default function CookieBanner({ text }: CookieBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_KEY);
    if (!accepted) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, "1");
    setVisible(false);
  }

  if (!visible || !text) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl"
    >
      <div className="flex items-start justify-between gap-4 rounded-xl bg-[var(--brand-primary)] text-white px-5 py-4 shadow-[var(--shadow-xl)]">
        <p className="text-sm leading-relaxed flex-1">{text}</p>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          <button
            onClick={accept}
            className="text-xs font-semibold bg-white text-[var(--brand-primary)] px-3 py-1.5 rounded-md hover:bg-[var(--brand-primary-50)] transition-colors focus-visible:ring-2 ring-white"
          >
            Accept
          </button>
          <button
            onClick={accept}
            aria-label="Dismiss cookie notice"
            className="hover:opacity-75 transition-opacity focus-visible:ring-2 ring-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
