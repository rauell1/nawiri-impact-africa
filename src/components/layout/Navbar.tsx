"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface NavLink {
  label: string;
  url: string;
}

interface SiteSettingsData {
  site_name: string;
  site_tagline: string;
  logo_url: string;
  footer_links: NavLink[];
  primary_color: string;
  secondary_color: string;
}

interface NavbarProps {
  settings: SiteSettingsData;
}

export default function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks: NavLink[] = settings.footer_links || [];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Primary nav links (first 6 + donate)
  const mainLinks = navLinks.slice(0, 7);
  const donateLink = navLinks.find((l) =>
    l.label.toLowerCase().includes("donate")
  );

  return (
    <>
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[var(--brand-primary)] focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
      >
        Skip to content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[var(--shadow-sm)]"
            : "bg-transparent"
        }`}
        role="banner"
      >
        <nav
          className="container-site flex items-center justify-between h-16 md:h-20"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 z-10"
            aria-label={`${settings.site_name} — Home`}
          >
            <Image
              src={settings.logo_url}
              alt={settings.site_name}
              width={140}
              height={40}
              className="h-8 md:h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {mainLinks.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  scrolled
                    ? "text-[var(--brand-text-secondary)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary-50)]"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Donate Button */}
          <div className="hidden lg:flex items-center gap-3">
            {donateLink && (
              <Link
                href={donateLink.url}
                className="px-5 py-2.5 text-sm font-bold rounded-md text-[var(--brand-text-on-gold)] hover:opacity-90 transition-opacity shadow-[var(--shadow-sm)]"
                style={{
                  backgroundColor:
                    settings.secondary_color || "var(--brand-secondary)",
                }}
              >
                {donateLink.label}
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="lg:hidden z-10 p-2 rounded-md"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <X
                className={`w-6 h-6 ${
                  scrolled ? "text-[var(--brand-text-primary)]" : "text-white"
                }`}
              />
            ) : (
              <Menu
                className={`w-6 h-6 ${
                  scrolled ? "text-[var(--brand-text-primary)]" : "text-white"
                }`}
              />
            )}
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 top-0 z-40 lg:hidden"
            >
              {/* Dark backdrop */}
              <div
                className="absolute inset-0 bg-[var(--brand-primary-dark)]/95 backdrop-blur-lg"
                onClick={() => setIsOpen(false)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsOpen(false); }}
                role="button"
                tabIndex={0}
                aria-label="Close menu"
              />

              {/* Menu content */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="relative flex flex-col items-center justify-center h-full px-8 pt-20"
              >
                <div className="w-full max-w-sm space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.url}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <Link
                        href={link.url}
                        onClick={() => setIsOpen(false)}
                        className="block py-3 px-4 text-lg font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  {donateLink && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.05 * navLinks.length }}
                      className="pt-4"
                    >
                      <Link
                        href={donateLink.url}
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-center py-3 px-6 rounded-lg text-lg font-bold shadow-lg"
                        style={{
                          backgroundColor:
                            settings.secondary_color ||
                            "var(--brand-secondary)",
                          color: "var(--brand-text-on-gold)",
                        }}
                      >
                        {donateLink.label}
                      </Link>
                    </motion.div>
                  )}
                </div>

                {/* Tagline at bottom */}
                <p className="absolute bottom-12 text-white/40 text-sm font-ui text-center">
                  {settings.site_tagline}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
