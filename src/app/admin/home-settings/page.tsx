"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  ImageIcon,
  BarChart3,
  BookOpen,
  FileText,
  Megaphone,
  Plus,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminFormFooter } from "@/components/admin/admin-form-footer";
import { toast } from "sonner";
import ImageUploader from "@/components/admin/ImageUploader";

/* ─── Types ──────────────────────────────────────────────────── */

interface StatItem {
  number: string;
  label: string;
  icon: string;
  prefix: string;
  suffix: string;
}

interface StoryItem {
  id: string;
  title: string;
  slug: string;
  status: string;
}

interface HomeSettings {
  id: string;
  // Hero
  hero_headline: string;
  hero_subheadline: string;
  hero_cta_primary_label: string;
  hero_cta_primary_url: string;
  hero_cta_secondary_label: string;
  hero_cta_secondary_url: string;
  hero_background_image: string;
  hero_background_video_url: string | null;
  hero_overlay_opacity: number;
  hero_text_alignment: string;
  // Stats
  stats: StatItem[];
  stats_bar_bg_color: string;
  // Featured story
  featured_story_id: string | null;
  // Programmes
  home_programmes_heading: string;
  home_programmes_subtext: string;
  home_featured_programmes: string[];
  // CTA Banner
  home_cta_heading: string;
  home_cta_body: string;
  home_cta_button_label: string;
  home_cta_button_url: string;
  home_cta_background: string;
  home_cta_image: string | null;
}

const defaultSettings: HomeSettings = {
  id: "main",
  hero_headline: "",
  hero_subheadline: "",
  hero_cta_primary_label: "",
  hero_cta_primary_url: "",
  hero_cta_secondary_label: "",
  hero_cta_secondary_url: "",
  hero_background_image: "",
  hero_background_video_url: null,
  hero_overlay_opacity: 50,
  hero_text_alignment: "center",
  stats: [],
  stats_bar_bg_color: "#1B5E20",
  featured_story_id: null,
  home_programmes_heading: "",
  home_programmes_subtext: "",
  home_featured_programmes: [],
  home_cta_heading: "",
  home_cta_body: "",
  home_cta_button_label: "",
  home_cta_button_url: "",
  home_cta_background: "#D4A017",
  home_cta_image: null,
};

const emptyStat: StatItem = {
  number: "",
  label: "",
  icon: "Users",
  prefix: "",
  suffix: "+",
};

/* ─── Component ──────────────────────────────────────────────── */

export default function HomeSettingsPage() {
  const [settings, setSettings] = useState<HomeSettings>(defaultSettings);
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, storiesRes] = await Promise.all([
          fetch("/api/admin/home-settings"),
          fetch("/api/admin/stories?status=all"),
        ]);

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setSettings({
            ...data,
            stats: Array.isArray(data.stats) ? data.stats : [],
            home_featured_programmes: Array.isArray(data.home_featured_programmes)
              ? data.home_featured_programmes
              : [],
          });
        } else {
          toast.error("Failed to load home settings");
        }

        if (storiesRes.ok) {
          const storiesData = await storiesRes.json();
          setStories(storiesData);
        }
      } catch {
        toast.error("Network error");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const updateField = useCallback(
    <K extends keyof HomeSettings>(key: K, value: HomeSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  /* ─── Stats helpers ─── */

  const addStat = () => {
    setSettings((prev) => ({
      ...prev,
      stats: [...prev.stats, { ...emptyStat }],
    }));
  };

  const removeStat = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }));
  };

  const updateStat = (index: number, field: keyof StatItem, value: string) => {
    setSettings((prev) => ({
      ...prev,
      stats: prev.stats.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));
  };

  /* ─── Save ─── */

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { id, createdAt, updatedAt, featured_story, ...saveData } = settings as unknown as Record<string, unknown>;
      const res = await fetch("/api/admin/home-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saveData),
      });
      if (res.ok) {
        toast.success("Home settings saved successfully");
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
          Home Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your homepage hero, stats, featured content, and CTA banner
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero" className="gap-1.5">
            <ImageIcon className="h-3.5 w-3.5" />
            Hero
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            Stats Bar
          </TabsTrigger>
          <TabsTrigger value="featured" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Featured Story
          </TabsTrigger>
          <TabsTrigger value="programmes" className="gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            Programmes
          </TabsTrigger>
          <TabsTrigger value="cta" className="gap-1.5">
            <Megaphone className="h-3.5 w-3.5" />
            CTA Banner
          </TabsTrigger>
        </TabsList>

        {/* ─── HERO TAB ─── */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Configure the main hero banner at the top of your homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero_headline">Headline</Label>
                <Input
                  id="hero_headline"
                  value={settings.hero_headline}
                  onChange={(e) => updateField("hero_headline", e.target.value)}
                  placeholder="Rooted Here. Building Together."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero_subheadline">Subheadline</Label>
                <Textarea
                  id="hero_subheadline"
                  value={settings.hero_subheadline}
                  onChange={(e) => updateField("hero_subheadline", e.target.value)}
                  placeholder="A Kenyan organization, governed locally, serving communities..."
                  rows={2}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero_cta_primary_label">Primary CTA Label</Label>
                  <Input
                    id="hero_cta_primary_label"
                    value={settings.hero_cta_primary_label}
                    onChange={(e) => updateField("hero_cta_primary_label", e.target.value)}
                    placeholder="See Our Work"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_cta_primary_url">Primary CTA URL</Label>
                  <Input
                    id="hero_cta_primary_url"
                    value={settings.hero_cta_primary_url}
                    onChange={(e) => updateField("hero_cta_primary_url", e.target.value)}
                    placeholder="/programmes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_cta_secondary_label">Secondary CTA Label</Label>
                  <Input
                    id="hero_cta_secondary_label"
                    value={settings.hero_cta_secondary_label}
                    onChange={(e) => updateField("hero_cta_secondary_label", e.target.value)}
                    placeholder="Donate Now"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_cta_secondary_url">Secondary CTA URL</Label>
                  <Input
                    id="hero_cta_secondary_url"
                    value={settings.hero_cta_secondary_url}
                    onChange={(e) => updateField("hero_cta_secondary_url", e.target.value)}
                    placeholder="/donate"
                  />
                </div>
              </div>

              <Separator />

              <ImageUploader
                label="Hero Background Image"
                value={settings.hero_background_image}
                onChange={(val) => updateField("hero_background_image", val)}
                description="High-resolution primary banner image displayed on the landing page background. Recommend min 1920x1080px."
                fallbackPlaceholder="/images/hero-bg.jpg"
              />
              <div className="space-y-2">
                <Label htmlFor="hero_background_video_url">Background Video URL (optional)</Label>
                <Input
                  id="hero_background_video_url"
                  value={settings.hero_background_video_url || ""}
                  onChange={(e) => updateField("hero_background_video_url", e.target.value || null)}
                  placeholder="https://example.com/video.mp4"
                />
                <p className="text-xs text-muted-foreground">
                  MP4 video that plays behind the hero section (falls back to image)
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Overlay Opacity */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hero_overlay_opacity">Overlay Opacity</Label>
                    <span className="text-sm font-medium text-muted-foreground">
                      {settings.hero_overlay_opacity}%
                    </span>
                  </div>
                  <Slider
                    id="hero_overlay_opacity"
                    value={[settings.hero_overlay_opacity]}
                    onValueChange={(val) => updateField("hero_overlay_opacity", val[0])}
                    min={0}
                    max={100}
                    step={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls the darkness of the overlay on the hero background
                  </p>
                </div>

                {/* Text Alignment */}
                <div className="space-y-2">
                  <Label htmlFor="hero_text_alignment">Text Alignment</Label>
                  <Select
                    value={settings.hero_text_alignment}
                    onValueChange={(val) => updateField("hero_text_alignment", val)}
                  >
                    <SelectTrigger id="hero_text_alignment" className="w-full">
                      <SelectValue placeholder="Select alignment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── STATS TAB ─── */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Impact Stats Bar</CardTitle>
              <CardDescription>
                Define the statistics shown in the homepage impact bar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="stats_bar_bg_color" className="flex items-center gap-2">
                  Stats Bar Background Color
                  <span
                    className="inline-block w-4 h-4 rounded border border-border"
                    style={{ backgroundColor: settings.stats_bar_bg_color }}
                  />
                </Label>
                <Input
                  id="stats_bar_bg_color"
                  value={settings.stats_bar_bg_color}
                  onChange={(e) => updateField("stats_bar_bg_color", e.target.value)}
                  placeholder="#1B5E20"
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Stat Items</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addStat}>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Stat
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Each stat has a number, label, icon name, and optional prefix/suffix
                </p>

                {settings.stats.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-md">
                    No stats yet. Click &quot;Add Stat&quot; to create one.
                  </p>
                )}

                <div className="space-y-4">
                  {settings.stats.map((stat, index) => (
                    <div
                      key={index}
                      className="rounded-lg border p-4 space-y-3 bg-muted/30"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Stat #{index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive h-7 w-7"
                          onClick={() => removeStat(index)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Remove stat</span>
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Number</Label>
                          <Input
                            value={stat.number}
                            onChange={(e) => updateStat(index, "number", e.target.value)}
                            placeholder="50,000"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Label</Label>
                          <Input
                            value={stat.label}
                            onChange={(e) => updateStat(index, "label", e.target.value)}
                            placeholder="Lives impacted"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Icon</Label>
                          <Input
                            value={stat.icon}
                            onChange={(e) => updateStat(index, "icon", e.target.value)}
                            placeholder="Users"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Prefix</Label>
                          <Input
                            value={stat.prefix}
                            onChange={(e) => updateStat(index, "prefix", e.target.value)}
                            placeholder="K+"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Suffix</Label>
                          <Input
                            value={stat.suffix}
                            onChange={(e) => updateStat(index, "suffix", e.target.value)}
                            placeholder="+"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── FEATURED STORY TAB ─── */}
        <TabsContent value="featured">
          <Card>
            <CardHeader>
              <CardTitle>Featured Story</CardTitle>
              <CardDescription>
                Choose the story highlighted in the homepage featured story section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="featured_story_id">Select Featured Story</Label>
                <Select
                  value={settings.featured_story_id || "__none__"}
                  onValueChange={(val) =>
                    updateField("featured_story_id", val === "__none__" ? null : val)
                  }
                >
                  <SelectTrigger id="featured_story_id" className="w-full">
                    <SelectValue placeholder="Select a story" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None (no featured story)</SelectItem>
                    {stories.map((story) => (
                      <SelectItem key={story.id} value={story.id}>
                        {story.title}
                        {story.status === "draft" && (
                          <span className="ml-2 text-xs text-muted-foreground">(draft)</span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {stories.length === 0
                    ? "No stories found. Create stories in the Stories section first."
                    : `${stories.length} stories available`}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── PROGRAMMES TAB ─── */}
        <TabsContent value="programmes">
          <Card>
            <CardHeader>
              <CardTitle>Programmes Preview</CardTitle>
              <CardDescription>
                Customize the programmes section heading and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="home_programmes_heading">Section Heading</Label>
                <Input
                  id="home_programmes_heading"
                  value={settings.home_programmes_heading}
                  onChange={(e) => updateField("home_programmes_heading", e.target.value)}
                  placeholder="Our Programmes"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="home_programmes_subtext">Section Subtext</Label>
                <Textarea
                  id="home_programmes_subtext"
                  value={settings.home_programmes_subtext}
                  onChange={(e) => updateField("home_programmes_subtext", e.target.value)}
                  placeholder="A brief description of your programmes..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── CTA BANNER TAB ─── */}
        <TabsContent value="cta">
          <Card>
            <CardHeader>
              <CardTitle>Call-to-Action Banner</CardTitle>
              <CardDescription>
                Configure the donation/CTA banner at the bottom of the homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="home_cta_heading">CTA Heading</Label>
                <Input
                  id="home_cta_heading"
                  value={settings.home_cta_heading}
                  onChange={(e) => updateField("home_cta_heading", e.target.value)}
                  placeholder="Join Us in Building a Better Kenya"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="home_cta_body">CTA Body Text</Label>
                <Textarea
                  id="home_cta_body"
                  value={settings.home_cta_body}
                  onChange={(e) => updateField("home_cta_body", e.target.value)}
                  placeholder="Your support makes a difference..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="home_cta_button_label">Button Label</Label>
                  <Input
                    id="home_cta_button_label"
                    value={settings.home_cta_button_label}
                    onChange={(e) => updateField("home_cta_button_label", e.target.value)}
                    placeholder="Get Involved"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="home_cta_button_url">Button URL</Label>
                  <Input
                    id="home_cta_button_url"
                    value={settings.home_cta_button_url}
                    onChange={(e) => updateField("home_cta_button_url", e.target.value)}
                    placeholder="/donate"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="home_cta_background" className="flex items-center gap-2">
                    Background Color
                    <span
                      className="inline-block w-4 h-4 rounded border border-border"
                      style={{ backgroundColor: settings.home_cta_background }}
                    />
                  </Label>
                  <Input
                    id="home_cta_background"
                    value={settings.home_cta_background}
                    onChange={(e) => updateField("home_cta_background", e.target.value)}
                    placeholder="#D4A017"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="home_cta_image">Background Image URL (optional)</Label>
                  <Input
                    id="home_cta_image"
                    value={settings.home_cta_image || ""}
                    onChange={(e) => updateField("home_cta_image", e.target.value || null)}
                    placeholder="/images/cta-bg.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional background image that overlays the color
                  </p>
                </div>
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
