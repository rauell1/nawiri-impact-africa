"use client";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface AdminFormFooterProps {
  onSave: () => void;
  isSaving: boolean;
  lastSaved?: string | null;
}

export function AdminFormFooter({ onSave, isSaving, lastSaved }: AdminFormFooterProps) {
  return (
    <div className="sticky bottom-0 z-10 bg-background border-t px-4 py-3 flex items-center justify-between">
      <p className="text-xs text-muted-foreground">
        {lastSaved ? `Last saved: ${lastSaved}` : "Unsaved changes"}
      </p>
      <Button onClick={onSave} disabled={isSaving}>
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        Save Changes
      </Button>
    </div>
  );
}
