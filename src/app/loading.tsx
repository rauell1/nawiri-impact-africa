export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-background)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[var(--brand-text-muted)] font-ui">Loading...</p>
      </div>
    </div>
  );
}
