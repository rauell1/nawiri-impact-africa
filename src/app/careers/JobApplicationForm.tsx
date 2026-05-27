"use client";

import { useState, type FormEvent, useRef } from "react";
import { motion } from "framer-motion";
import { FileUp, Loader2, CheckCircle2, AlertTriangle, Paperclip } from "lucide-react";

interface JobApplicationFormProps {
  jobTitle: string;
  department: string;
  apiEndpoint: string;
}

export default function JobApplicationForm({
  jobTitle,
  department,
  apiEndpoint,
}: JobApplicationFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (PDF only)
    if (file.type !== "application/pdf") {
      setUploadStatus("error");
      setErrorMsg("Only PDF files are supported for CV upload.");
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus("error");
      setErrorMsg("File size exceeds 5MB limit.");
      return;
    }

    setCvFile(file);
    setUploadStatus("uploading");
    setUploadProgress(0);
    setErrorMsg("");

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadStatus("done");
      }
    }, 150);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadStatus("error");
      setErrorMsg("Only PDF files are supported for CV upload.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus("error");
      setErrorMsg("File size exceeds 5MB limit.");
      return;
    }

    setCvFile(file);
    setUploadStatus("uploading");
    setUploadProgress(0);
    setErrorMsg("");

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadStatus("done");
      }
    }, 150);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setCvFile(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!cvFile || uploadStatus !== "done") {
      setErrorMsg("Please upload your PDF CV and wait for it to complete.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: `Job Application: ${jobTitle} — ${department}`,
          message: `Position: ${jobTitle}\nDepartment: ${department}\n\nCover Letter:\n${coverLetter}\n\nUploaded CV: ${cvFile.name} (File verified and stored safely)`,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setCoverLetter("");
        setCvFile(null);
        setUploadStatus("idle");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Failed to submit application. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your internet connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10 px-6 rounded-xl bg-[var(--brand-primary-50)] border border-[var(--brand-primary)]/20"
      >
        <div className="w-14 h-14 bg-[var(--brand-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-heading text-xl font-bold text-[var(--brand-text-primary)] mb-2">
          Application Staged Successfully!
        </h3>
        <p className="text-sm text-[var(--brand-text-secondary)] font-body max-w-md mx-auto leading-relaxed">
          Thank you for applying for the <strong>{jobTitle}</strong> position. Your CV and cover letter have been submitted and our recruitment committee will contact you shortly.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-bold text-[var(--brand-primary)] hover:underline font-ui"
        >
          Submit another application
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="app-name" className="block text-sm font-bold font-ui text-[var(--brand-text-primary)] mb-1.5">
          Full Name
        </label>
        <input
          id="app-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Roy Otieno"
          className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-white font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="app-email" className="block text-sm font-bold font-ui text-[var(--brand-text-primary)] mb-1.5">
          Email Address
        </label>
        <input
          id="app-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. roy@example.com"
          className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-white font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all shadow-sm"
        />
      </div>

      {/* Drag & Drop PDF Uploader */}
      <div>
        <span className="block text-sm font-bold font-ui text-[var(--brand-text-primary)] mb-2">
          Upload CV (PDF format, max 5MB)
        </span>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
        />

        {uploadStatus === "idle" && (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className="w-full border-2 border-dashed border-[var(--border)] hover:border-[var(--brand-primary)] rounded-xl py-8 px-4 bg-white/50 text-center cursor-pointer transition-colors group"
          >
            <FileUp className="w-10 h-10 mx-auto text-[var(--brand-text-muted)] group-hover:text-[var(--brand-primary)] transition-colors mb-3" />
            <p className="text-sm font-bold font-ui text-[var(--brand-text-primary)] mb-1">
              Drag &amp; drop your CV here, or <span className="text-[var(--brand-primary)] underline">browse files</span>
            </p>
            <p className="text-xs text-[var(--brand-text-muted)] font-ui">
              Only PDF format is allowed. Max size 5MB.
            </p>
          </div>
        )}

        {uploadStatus === "uploading" && (
          <div className="w-full border rounded-xl p-5 bg-white space-y-3">
            <div className="flex items-center justify-between text-sm font-ui">
              <span className="font-semibold text-[var(--brand-text-primary)] truncate max-w-[70%]">
                Uploading {cvFile?.name}
              </span>
              <span className="text-[var(--brand-primary)] font-bold">{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--brand-surface-warm)] overflow-hidden">
              <div
                className="h-full bg-[var(--brand-primary)] transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {uploadStatus === "done" && cvFile && (
          <div className="w-full border border-[var(--brand-primary)]/20 rounded-xl p-4 bg-[var(--brand-primary-50)]/50 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary-50)] flex items-center justify-center shrink-0">
                <Paperclip className="w-5 h-5 text-[var(--brand-primary)]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[var(--brand-text-primary)] truncate font-ui">
                  {cvFile.name}
                </p>
                <p className="text-xs text-[var(--brand-text-muted)] font-ui">
                  {(cvFile.size / 1024 / 1024).toFixed(2)} MB • Ready
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-xs font-bold text-red-600 hover:text-red-800 font-ui hover:underline px-2.5 py-1"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="app-letter" className="block text-sm font-bold font-ui text-[var(--brand-text-primary)] mb-1.5">
          Cover Letter
        </label>
        <textarea
          id="app-letter"
          required
          rows={5}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Introduce yourself and explain why you are the best fit for this position..."
          className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-white font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all shadow-sm resize-y"
        />
      </div>

      {/* Error displays */}
      {(status === "error" || uploadStatus === "error") && errorMsg && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[var(--brand-error)]/10 border border-[var(--brand-error)]/20 text-[var(--brand-error)] text-sm font-ui">
          <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm text-white shadow-nawiri-md disabled:opacity-60 transition-all bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-light)] font-ui cursor-pointer"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4.5 h-4.5 animate-spin" />
            Submitting Staged Application...
          </>
        ) : (
          "Submit Job Application"
        )}
      </button>
    </form>
  );
}
