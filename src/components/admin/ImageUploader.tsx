"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Link as LinkIcon, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  description?: string;
  fallbackPlaceholder?: string;
}

export default function ImageUploader({
  label,
  value,
  onChange,
  description,
  fallbackPlaceholder = "/images/logo-placeholder.svg",
}: ImageUploaderProps) {
  // Determine if the current value is a custom uploaded image (usually starts with /uploads)
  const [isUploadMode, setIsUploadMode] = useState(value.startsWith("/uploads") || value === "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize state if value changes externally
  useEffect(() => {
    if (value.startsWith("/uploads")) {
      setIsUploadMode(true);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WebP, SVG).");
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image file size exceeds the 5MB limit.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        onChange(data.url);
        setSuccess(true);
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || "Failed to upload image. Please try again.");
      }
    } catch {
      setError("Network error occurred during image upload.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    onChange("");
    setError("");
    setSuccess(false);
  };

  return (
    <div className="space-y-3.5 rounded-xl border border-[var(--border)] p-5 bg-white shadow-sm transition-all">
      {/* Label and description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <label className="block text-sm font-bold font-ui text-[var(--brand-text-primary)]">
            {label}
          </label>
          {description && (
            <p className="text-xs text-[var(--brand-text-muted)] font-ui mt-0.5">
              {description}
            </p>
          )}
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-2 bg-[var(--brand-surface-warm)] p-1 rounded-lg border border-[var(--border)] w-fit">
          <button
            type="button"
            onClick={() => setIsUploadMode(true)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold font-ui transition-all ${
              isUploadMode
                ? "bg-[var(--brand-primary)] text-white shadow-sm"
                : "text-[var(--brand-text-secondary)] hover:bg-[var(--border)]/40"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 inline mr-1" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setIsUploadMode(false)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold font-ui transition-all ${
              !isUploadMode
                ? "bg-[var(--brand-primary)] text-white shadow-sm"
                : "text-[var(--brand-text-secondary)] hover:bg-[var(--border)]/40"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 inline mr-1" />
            Text Path URL
          </button>
        </div>
      </div>

      {/* Mode Viewports */}
      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {isUploadMode ? (
          /* --- UPLOAD MODE --- */
          <div className="space-y-4">
            {value && value.startsWith("/uploads") ? (
              /* Uploaded Image Preview Card */
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-[var(--brand-primary)]/20 bg-[var(--brand-primary-50)]/30">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[var(--border)] bg-slate-50 flex items-center justify-center shrink-0">
                  <Image
                    src={value}
                    alt="Uploaded preview"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold font-ui uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                      Custom Upload Active
                    </span>
                  </div>
                  <p className="text-xs text-[var(--brand-text-muted)] font-mono truncate max-w-full">
                    {value}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="text-xs font-bold font-ui text-[var(--brand-primary)] hover:underline"
                    >
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-xs font-bold font-ui text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Drag-and-drop Uploader Box */
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className="w-full border-2 border-dashed border-[var(--border)] hover:border-[var(--brand-primary)] rounded-xl py-6 px-4 bg-slate-50/50 text-center cursor-pointer transition-colors group flex flex-col items-center justify-center min-h-[120px]"
              >
                {uploading ? (
                  <div className="space-y-2">
                    <Loader2 className="w-8 h-8 mx-auto text-[var(--brand-primary)] animate-spin" />
                    <p className="text-xs font-bold font-ui text-[var(--brand-text-primary)]">
                      Uploading image securely...
                    </p>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 mx-auto text-[var(--brand-text-muted)] group-hover:text-[var(--brand-primary)] transition-colors mb-2" />
                    <p className="text-xs font-bold font-ui text-[var(--brand-text-primary)]">
                      Drag &amp; drop image here, or <span className="text-[var(--brand-primary)] underline">browse files</span>
                    </p>
                    <p className="text-[10px] text-[var(--brand-text-muted)] font-ui mt-0.5">
                      Supports JPG, PNG, WEBP, or SVG up to 5MB.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          /* --- TEXT PATH URL MODE --- */
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="e.g. /images/hero-bg.jpg"
                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-white font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all shadow-sm"
              />
              {value && (
                <div className="relative w-11 h-11 border rounded-lg overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                  <Image
                    src={value.startsWith("/") ? value : fallbackPlaceholder}
                    alt="Preview"
                    fill
                    className="object-contain"
                    onError={(e) => {
                      // Fallback if URL is invalid
                      (e.target as any).src = fallbackPlaceholder;
                    }}
                  />
                </div>
              )}
            </div>
            <p className="text-[10px] text-[var(--brand-text-muted)] font-ui">
              Enter any path within the codebase (e.g. <code>/images/logo.svg</code>) or an external image link.
            </p>
          </div>
        )}
      </div>

      {/* Success/Error Notifications */}
      {success && (
        <div className="flex items-center gap-2 text-xs font-ui text-green-700 bg-green-50 border border-green-200 p-2.5 rounded-lg">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Image uploaded and codebase reference updated successfully!</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-xs font-ui text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
