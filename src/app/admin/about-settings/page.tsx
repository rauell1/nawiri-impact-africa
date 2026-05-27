"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Info, Compass, Target, Star, Calendar, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminFormFooter } from "@/components/admin/admin-form-footer";
import { toast } from "sonner";

interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

interface TimelineItem {
  year: string;
  event: string;
}

interface AboutSettings {
  about_headline: string;
  about_body: string;
  mission_statement: string;
  vision_statement: string;
  about_hero_image: string;
  values: ValueItem[];
  history_timeline: TimelineItem[];
}

const defaultSettings: AboutSettings = {
  about_headline: "About Nawiri Impact Africa",
  about_body: "",
  mission_statement: "",
  vision_statement: "",
  about_hero_image: "/images/about-hero.jpg",
  values: [],
  history_timeline: [],
};

export default function AboutSettingsPage() {
  const [settings, setSettings] = useState<AboutSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/about-settings");
        if (res.ok) {
          const data = await res.json();
          setSettings({
            ...defaultSettings,
            ...data,
            values: Array.isArray(data.values) ? data.values : [],
            history_timeline: Array.isArray(data.history_timeline) ? data.history_timeline : [],
          });
        } else {
          toast.error("Failed to load about settings");
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
    <K extends keyof AboutSettings>(key: K, value: AboutSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // ─── VALUES MANAGER ───
  const addValue = () => {
    setSettings((prev) => ({
      ...prev,
      values: [...prev.values, { icon: "ShieldCheck", title: "", description: "" }],
    }));
  };

  const removeValue = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  const updateValue = (index: number, field: keyof ValueItem, value: string) => {
    setSettings((prev) => ({
      ...prev,
      values: prev.values.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // ─── TIMELINE MANAGER ───
  const addTimeline = () => {
    setSettings((prev) => ({
      ...prev,
      history_timeline: [...prev.history_timeline, { year: "", event: "" }],
    }));
  };

  const removeTimeline = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      history_timeline: prev.history_timeline.filter((_, i) => i !== index),
    }));
  };

  const updateTimeline = (index: number, field: keyof TimelineItem, value: string) => {
    setSettings((prev) => ({
      ...prev,
      history_timeline: prev.history_timeline.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const moveTimelineItem = (index: number, direction: "up" | "down") => {
    setSettings((prev) => {
      const items = [...prev.history_timeline];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      
      if (targetIndex < 0 || targetIndex >= items.length) {
        return prev;
      }
      
      // Swap
      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;
      
      return {
        ...prev,
        history_timeline: items,
      };
    });
  };

  // ─── SAVE HANDLER ───
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/about-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("About page settings saved successfully");
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
          About Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Edit the About Us page, organizational values, mission and timeline
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="general" className="gap-1.5">
            <Info className="h-3.5 w-3.5" />
            General Content
          </TabsTrigger>
          <TabsTrigger value="goals" className="gap-1.5">
            <Compass className="h-3.5 w-3.5" />
            Mission &amp; Vision
          </TabsTrigger>
          <TabsTrigger value="values" className="gap-1.5">
            <Star className="h-3.5 w-3.5" />
            Core Values
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            History Timeline
          </TabsTrigger>
        </TabsList>

        {/* ─── GENERAL TAB ─── */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>About Narrative Settings</CardTitle>
              <CardDescription>
                Primary About Us copy and narrative page header configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about_headline">Page Title / Headline</Label>
                <Input
                  id="about_headline"
                  value={settings.about_headline}
                  onChange={(e) => updateField("about_headline", e.target.value)}
                  placeholder="About Nawiri Impact Africa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_hero_image">Hero Image Path</Label>
                <Input
                  id="about_hero_image"
                  value={settings.about_hero_image}
                  onChange={(e) => updateField("about_hero_image", e.target.value)}
                  placeholder="/images/about-hero.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Relative URL path or CDN URL for the top main header image
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_body">Organizational Story Narrative</Label>
                <Textarea
                  id="about_body"
                  value={settings.about_body}
                  onChange={(e) => updateField("about_body", e.target.value)}
                  placeholder="Enter the full narrative story of Nawiri Impact Africa..."
                  rows={8}
                />
                <p className="text-xs text-muted-foreground">
                  The primary text block displayed inside the &quot;Our Story&quot; column. Supports multiple lines.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── MISSION & VISION TAB ─── */}
        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Mission &amp; Vision Statements</CardTitle>
              <CardDescription>
                Define the high-priority direction statements highlighted at the top of the About page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mission_statement">Our Mission</Label>
                <Textarea
                  id="mission_statement"
                  value={settings.mission_statement}
                  onChange={(e) => updateField("mission_statement", e.target.value)}
                  placeholder="To walk alongside Kenyan communities..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vision_statement">Our Vision</Label>
                <Textarea
                  id="vision_statement"
                  value={settings.vision_statement}
                  onChange={(e) => updateField("vision_statement", e.target.value)}
                  placeholder="A Kenya where every community has the agency..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── CORE VALUES TAB ─── */}
        <TabsContent value="values">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Organizational Values</CardTitle>
                <CardDescription>
                  Manage the core values grid (titles, icons, and summaries)
                </CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addValue}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Value
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings.values.length === 0 && (
                <p className="text-sm text-muted-foreground py-6 text-center border border-dashed rounded-md">
                  No custom values created. The website will display fallback defaults until values are saved.
                </p>
              )}
              <div className="space-y-4">
                {settings.values.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-lg border bg-card relative shadow-sm">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`val-title-${index}`}>Value Title</Label>
                        <Input
                          id={`val-title-${index}`}
                          value={item.title}
                          onChange={(e) => updateValue(index, "title", e.target.value)}
                          placeholder="e.g. Integrity"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`val-icon-${index}`}>Lucide Icon Name</Label>
                        <Input
                          id={`val-icon-${index}`}
                          value={item.icon}
                          onChange={(e) => updateValue(index, "icon", e.target.value)}
                          placeholder="e.g. ShieldCheck, Users, Heart, Star"
                        />
                        <p className="text-[10px] text-muted-foreground">
                          Case-sensitive Lucide icon name string
                        </p>
                      </div>
                      <div className="space-y-2 md:col-span-3">
                        <Label htmlFor={`val-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`val-desc-${index}`}
                          value={item.description}
                          onChange={(e) => updateValue(index, "description", e.target.value)}
                          placeholder="Provide the value explanation..."
                          rows={2}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeValue(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── HISTORY TIMELINE TAB ─── */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>History &amp; Milestones Timeline</CardTitle>
                <CardDescription>
                  List organizational timeline events shown adjacent to the narrative story
                </CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addTimeline}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Milestone
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.history_timeline.length === 0 && (
                <p className="text-sm text-muted-foreground py-6 text-center border border-dashed rounded-md">
                  No timeline milestones added. Click &quot;Add Milestone&quot; to begin.
                </p>
              )}
              <div className="space-y-3">
                {settings.history_timeline.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-lg border bg-card items-center shadow-sm">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2 md:col-span-1">
                        <Label htmlFor={`time-year-${index}`}>Year</Label>
                        <Input
                          id={`time-year-${index}`}
                          value={item.year}
                          onChange={(e) => updateTimeline(index, "year", e.target.value)}
                          placeholder="e.g. 1994 or 2024"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-3">
                        <Label htmlFor={`time-event-${index}`}>Milestone Event Description</Label>
                        <Input
                          id={`time-event-${index}`}
                          value={item.event}
                          onChange={(e) => updateTimeline(index, "event", e.target.value)}
                          placeholder="Brief description of what happened..."
                        />
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => moveTimelineItem(index, "up")}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => moveTimelineItem(index, "down")}
                        disabled={index === settings.history_timeline.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeTimeline(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
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
