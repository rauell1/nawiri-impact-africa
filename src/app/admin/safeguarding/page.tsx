"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Shield, Clock, FileText, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminFormFooter } from "@/components/admin/admin-form-footer";
import { toast } from "sonner";

interface PolicyDocument {
  title: string;
  file_url: string;
}

interface SafeguardingSettings {
  safeguarding_headline: string;
  commitment_statement: string;
  reporting_contact_email: string;
  policy_documents: PolicyDocument[];
  last_reviewed_date: string;
}

const defaultSettings: SafeguardingSettings = {
  safeguarding_headline: "Safeguarding & Accountability",
  commitment_statement: "",
  reporting_contact_email: "safeguarding@nawiriimpactafrica.org",
  policy_documents: [],
  last_reviewed_date: new Date().toISOString().split("T")[0],
};

export default function SafeguardingAdminPage() {
  const [settings, setSettings] = useState<SafeguardingSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("commitment");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/safeguarding");
        if (res.ok) {
          const data = await res.json();
          let parsedDate = "";
          if (data.last_reviewed_date) {
            parsedDate = new Date(data.last_reviewed_date).toISOString().split("T")[0];
          } else {
            parsedDate = new Date().toISOString().split("T")[0];
          }

          setSettings({
            ...defaultSettings,
            ...data,
            policy_documents: Array.isArray(data.policy_documents) ? data.policy_documents : [],
            last_reviewed_date: parsedDate,
          });
        } else {
          toast.error("Failed to load safeguarding settings");
        }
      } catch {
        toast.error("Network error loading settings");
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const updateField = useCallback(
    <K extends keyof SafeguardingSettings>(key: K, value: SafeguardingSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // ─── POLICY DOCUMENTS MANAGER ───
  const addPolicy = () => {
    setSettings((prev) => ({
      ...prev,
      policy_documents: [...prev.policy_documents, { title: "", file_url: "" }],
    }));
  };

  const removePolicy = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      policy_documents: prev.policy_documents.filter((_, i) => i !== index),
    }));
  };

  const updatePolicy = (index: number, field: keyof PolicyDocument, value: string) => {
    setSettings((prev) => ({
      ...prev,
      policy_documents: prev.policy_documents.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // ─── SAVE HANDLER ───
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/safeguarding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Safeguarding settings saved successfully");
        setLastSaved(new Date().toLocaleTimeString());
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Network error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-heading text-[var(--brand-text-primary)]">
          Safeguarding &amp; Accountability Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage policies, safeguarding commitments, and reporting routes
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="commitment" className="gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            Commitment &amp; Support
          </TabsTrigger>
          <TabsTrigger value="policies" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Policy Documents
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Compliance &amp; Audits
          </TabsTrigger>
        </TabsList>

        {/* ─── COMMITMENT TAB ─── */}
        <TabsContent value="commitment">
          <Card>
            <CardHeader>
              <CardTitle>Safeguarding Commitment</CardTitle>
              <CardDescription>
                Configure the primary organization statements and contacts shown to the public
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="safeguarding_headline">Page Title / Headline</Label>
                <Input
                  id="safeguarding_headline"
                  value={settings.safeguarding_headline}
                  onChange={(e) => updateField("safeguarding_headline", e.target.value)}
                  placeholder="Safeguarding & Accountability"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reporting_contact_email">Confidential Reporting Email</Label>
                <Input
                  id="reporting_contact_email"
                  type="email"
                  value={settings.reporting_contact_email}
                  onChange={(e) => updateField("reporting_contact_email", e.target.value)}
                  placeholder="safeguarding@nawiriimpactafrica.org"
                />
                <p className="text-xs text-muted-foreground">
                  Secure email inbox for receiving confidential safeguarding reports
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="commitment_statement">Safeguarding Commitment Statement</Label>
                <Textarea
                  id="commitment_statement"
                  value={settings.commitment_statement}
                  onChange={(e) => updateField("commitment_statement", e.target.value)}
                  placeholder="Enter the official commitment text..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── POLICY DOCUMENTS TAB ─── */}
        <TabsContent value="policies">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Policy PDF Documents</CardTitle>
                <CardDescription>
                  Upload and manage the PDF policies downloadable by auditors and donors
                </CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addPolicy}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Policy File
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings.policy_documents.length === 0 && (
                <p className="text-sm text-muted-foreground py-6 text-center border border-dashed rounded-md">
                  No policy PDFs created yet. Falling back to default list until saved.
                </p>
              )}
              <div className="space-y-4">
                {settings.policy_documents.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-lg border bg-card relative shadow-sm items-start">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`policy-title-${index}`}>Policy Document Label</Label>
                        <Input
                          id={`policy-title-${index}`}
                          value={item.title}
                          onChange={(e) => updatePolicy(index, "title", e.target.value)}
                          placeholder="e.g. Safeguarding Policy (Child Protection)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`policy-url-${index}`}>PDF File Path / URL</Label>
                        <Input
                          id={`policy-url-${index}`}
                          value={item.file_url}
                          onChange={(e) => updatePolicy(index, "file_url", e.target.value)}
                          placeholder="e.g. /reports/safeguarding-policy.pdf"
                        />
                      </div>
                    </div>
                    <div className="flex items-center mt-6">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removePolicy(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── AUDITING TAB ─── */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Audits</CardTitle>
              <CardDescription>
                Auditing tracking details visible on the public page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="last_reviewed_date">Policies Last Reviewed Date</Label>
                <Input
                  id="last_reviewed_date"
                  type="date"
                  value={settings.last_reviewed_date}
                  onChange={(e) => updateField("last_reviewed_date", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The official date these compliance policies were last validated by leadership
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sticky Save Footer */}
      <AdminFormFooter onSave={handleSave} isSaving={isSaving} lastSaved={lastSaved} />
    </div>
  );
}
