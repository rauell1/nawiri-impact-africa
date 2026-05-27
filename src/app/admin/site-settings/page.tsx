"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Globe, Palette, Phone, Share2, Footprints, Settings2, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminFormFooter } from "@/components/admin/admin-form-footer";
import { toast } from "sonner";

interface SiteSettings {
  id: string;
  site_name: string;
  site_tagline: string;
  logo_url: string;
  logo_dark_url: string | null;
  favicon_url: string;
  primary_color: string;
  secondary_color: string;
  font_heading: string;
  font_body: string;
  contact_email: string;
  contact_phone: string;
  physical_address: string;
  social_twitter: string | null;
  social_linkedin: string | null;
  social_facebook: string | null;
  social_youtube: string | null;
  footer_description: string;
  footer_links: { label: string; url: string }[];
  cookie_banner_text: string;
  maintenance_mode: boolean;
  google_analytics_id: string | null;
}

const defaultSettings: SiteSettings = {
  id: "main",
  site_name: "",
  site_tagline: "",
  logo_url: "",
  logo_dark_url: null,
  favicon_url: "",
  primary_color: "#1B5E20",
  secondary_color: "#D4A017",
  font_heading: "Playfair Display",
  font_body: "Source Serif 4",
  contact_email: "",
  contact_phone: "",
  physical_address: "",
  social_twitter: null,
  social_linkedin: null,
  social_facebook: null,
  social_youtube: null,
  footer_description: "",
  footer_links: [],
  cookie_banner_text: "",
  maintenance_mode: false,
  google_analytics_id: null,
};

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/site-settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        } else {
          toast.error("Failed to load settings");
        }
      } catch {
        toast.error("Network error");
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const updateField = useCallback(
    <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const addFooterLink = () => {
    setSettings((prev) => ({
      ...prev,
      footer_links: [...prev.footer_links, { label: "", url: "" }],
    }));
  };

  const removeFooterLink = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      footer_links: prev.footer_links.filter((_, i) => i !== index),
    }));
  };

  const updateFooterLink = (
    index: number,
    field: "label" | "url",
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      footer_links: prev.footer_links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { id, createdAt, updatedAt, ...saveData } = settings as unknown as Record<string, unknown>;
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saveData),
      });
      if (res.ok) {
        toast.success("Site settings saved successfully");
        setLastSaved(new Date().toLocaleTimeString());
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Network error");
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
          Site Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your website&apos;s global settings, branding, and content
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="general" className="gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-1.5">
            <Palette className="h-3.5 w-3.5" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-1.5">
            <Share2 className="h-3.5 w-3.5" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="footer" className="gap-1.5">
            <Footprints className="h-3.5 w-3.5" />
            Footer
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-1.5">
            <Settings2 className="h-3.5 w-3.5" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* ─── GENERAL TAB ─── */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic site information displayed across all pages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name}
                    onChange={(e) => updateField("site_name", e.target.value)}
                    placeholder="Nawiri Impact Africa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_tagline">Site Tagline</Label>
                  <Input
                    id="site_tagline"
                    value={settings.site_tagline}
                    onChange={(e) => updateField("site_tagline", e.target.value)}
                    placeholder="Rooted Here. Building Together."
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logo_url">Logo URL (Light)</Label>
                  <Input
                    id="logo_url"
                    value={settings.logo_url}
                    onChange={(e) => updateField("logo_url", e.target.value)}
                    placeholder="/images/logo.svg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Path or URL to the main logo used on light backgrounds
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo_dark_url">Logo URL (Dark)</Label>
                  <Input
                    id="logo_dark_url"
                    value={settings.logo_dark_url || ""}
                    onChange={(e) => updateField("logo_dark_url", e.target.value || null)}
                    placeholder="/images/logo-dark.svg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional alternate logo for dark backgrounds
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon_url">Favicon URL</Label>
                  <Input
                    id="favicon_url"
                    value={settings.favicon_url}
                    onChange={(e) => updateField("favicon_url", e.target.value)}
                    placeholder="/favicon.ico"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── BRANDING TAB ─── */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding &amp; Appearance</CardTitle>
              <CardDescription>
                Control your site&apos;s visual identity and typography
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_color" className="flex items-center gap-2">
                    Primary Color
                    <span
                      className="inline-block w-4 h-4 rounded border border-border"
                      style={{ backgroundColor: settings.primary_color }}
                    />
                  </Label>
                  <Input
                    id="primary_color"
                    value={settings.primary_color}
                    onChange={(e) => updateField("primary_color", e.target.value)}
                    placeholder="#1B5E20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary_color" className="flex items-center gap-2">
                    Secondary Color
                    <span
                      className="inline-block w-4 h-4 rounded border border-border"
                      style={{ backgroundColor: settings.secondary_color }}
                    />
                  </Label>
                  <Input
                    id="secondary_color"
                    value={settings.secondary_color}
                    onChange={(e) => updateField("secondary_color", e.target.value)}
                    placeholder="#D4A017"
                  />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="font_heading">Heading Font</Label>
                  <Input
                    id="font_heading"
                    value={settings.font_heading}
                    onChange={(e) => updateField("font_heading", e.target.value)}
                    placeholder="Playfair Display"
                  />
                  <p className="text-xs text-muted-foreground">
                    Font family used for headings (h1–h6)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="font_body">Body Font</Label>
                  <Input
                    id="font_body"
                    value={settings.font_body}
                    onChange={(e) => updateField("font_body", e.target.value)}
                    placeholder="Source Serif 4"
                  />
                  <p className="text-xs text-muted-foreground">
                    Font family used for body text
                  </p>
                </div>
              </div>
              {/* Color Preview */}
              <Separator />
              <div>
                <Label className="text-sm font-medium">Preview</Label>
                <div className="mt-2 rounded-lg border p-4 space-y-2">
                  <div className="flex gap-2">
                    <div
                      className="h-10 w-10 rounded-md flex-shrink-0"
                      style={{ backgroundColor: settings.primary_color }}
                    />
                    <div
                      className="h-10 w-10 rounded-md flex-shrink-0"
                      style={{ backgroundColor: settings.secondary_color }}
                    />
                    <div className="h-10 flex-1 rounded-md bg-muted" />
                  </div>
                  <p style={{ fontFamily: settings.font_heading, fontWeight: 700, fontSize: "1.25rem", color: "var(--brand-text-primary)" }}>
                    Heading Preview
                  </p>
                  <p style={{ fontFamily: settings.font_body, color: "var(--brand-text-secondary)" }}>
                    Body text preview in your chosen body font.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── CONTACT TAB ─── */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Contact details shown in the footer and contact page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => updateField("contact_email", e.target.value)}
                  placeholder="info@nawiri.org"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={settings.contact_phone}
                  onChange={(e) => updateField("contact_phone", e.target.value)}
                  placeholder="+254 700 000 000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="physical_address">Physical Address</Label>
                <Input
                  id="physical_address"
                  value={settings.physical_address}
                  onChange={(e) => updateField("physical_address", e.target.value)}
                  placeholder="Nairobi, Kenya"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── SOCIAL MEDIA TAB ─── */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Links displayed in the site footer and share buttons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="social_twitter">Twitter / X URL</Label>
                  <Input
                    id="social_twitter"
                    value={settings.social_twitter || ""}
                    onChange={(e) => updateField("social_twitter", e.target.value || null)}
                    placeholder="https://twitter.com/nawiri"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_linkedin">LinkedIn URL</Label>
                  <Input
                    id="social_linkedin"
                    value={settings.social_linkedin || ""}
                    onChange={(e) => updateField("social_linkedin", e.target.value || null)}
                    placeholder="https://linkedin.com/company/nawiri"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_facebook">Facebook URL</Label>
                  <Input
                    id="social_facebook"
                    value={settings.social_facebook || ""}
                    onChange={(e) => updateField("social_facebook", e.target.value || null)}
                    placeholder="https://facebook.com/nawiri"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_youtube">YouTube URL</Label>
                  <Input
                    id="social_youtube"
                    value={settings.social_youtube || ""}
                    onChange={(e) => updateField("social_youtube", e.target.value || null)}
                    placeholder="https://youtube.com/@nawiri"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── FOOTER TAB ─── */}
        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle>Footer Settings</CardTitle>
              <CardDescription>
                Customize the website footer content and links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="footer_description">Footer Description</Label>
                <Textarea
                  id="footer_description"
                  value={settings.footer_description}
                  onChange={(e) => updateField("footer_description", e.target.value)}
                  placeholder="A brief description shown in the footer..."
                  rows={3}
                />
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Footer Links</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addFooterLink}>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Link
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Links displayed in the footer navigation area
                </p>
                {settings.footer_links.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-md">
                    No footer links yet. Click &quot;Add Link&quot; to create one.
                  </p>
                )}
                <div className="space-y-2">
                  {settings.footer_links.map((link, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Input
                          value={link.label}
                          onChange={(e) =>
                            updateFooterLink(index, "label", e.target.value)
                          }
                          placeholder="Link label"
                        />
                        <Input
                          value={link.url}
                          onChange={(e) =>
                            updateFooterLink(index, "url", e.target.value)
                          }
                          placeholder="https://example.com"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive flex-shrink-0 mt-0 sm:mt-0"
                        onClick={() => removeFooterLink(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove link</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── ADVANCED TAB ─── */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Analytics, cookies, and maintenance mode
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cookie_banner_text">Cookie Banner Text</Label>
                <Textarea
                  id="cookie_banner_text"
                  value={settings.cookie_banner_text}
                  onChange={(e) => updateField("cookie_banner_text", e.target.value)}
                  placeholder="This website uses cookies to improve your experience..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                <Input
                  id="google_analytics_id"
                  value={settings.google_analytics_id || ""}
                  onChange={(e) => updateField("google_analytics_id", e.target.value || null)}
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to disable analytics tracking
                </p>
              </div>
              <Separator />
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance_mode" className="text-sm font-medium">
                    Maintenance Mode
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    When enabled, visitors see a maintenance page instead of the website
                  </p>
                </div>
                <Switch
                  id="maintenance_mode"
                  checked={settings.maintenance_mode}
                  onCheckedChange={(checked) => updateField("maintenance_mode", checked)}
                />
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
