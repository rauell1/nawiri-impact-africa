"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminFormFooter } from "@/components/admin/admin-form-footer";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";

interface Story {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author_name: string;
  author_role: string | null;
  author_photo: string | null;
  cover_image: string;
  body: string;
  programme_id: string | null;
  location: string | null;
  published_date: string;
  is_featured: boolean;
  status: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProgrammeOption {
  id: string;
  title: string;
  slug: string;
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  author_name: "",
  author_role: "",
  author_photo: "",
  cover_image: "",
  body: "",
  programme_id: "",
  location: "",
  published_date: new Date().toISOString().split("T")[0],
  is_featured: false,
  status: "draft",
  tags: "",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [programmes, setProgrammes] = useState<ProgrammeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Story | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStories = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/stories?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setStories(data);
      }
    } catch {
      toast.error("Failed to fetch stories");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const fetchProgrammes = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/programmes");
      if (res.ok) {
        const data = await res.json();
        setProgrammes(data);
      }
    } catch {
      // silently fail — programme select is optional
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchStories();
    fetchProgrammes();
  }, [fetchStories, fetchProgrammes]);

  function startCreate() {
    setForm(emptyForm);
    setCreating(true);
    setEditing(null);
    setLastSaved(null);
  }

  function startEdit(story: Story) {
    setForm({
      title: story.title,
      slug: story.slug,
      excerpt: story.excerpt,
      author_name: story.author_name,
      author_role: story.author_role || "",
      author_photo: story.author_photo || "",
      cover_image: story.cover_image,
      body: story.body,
      programme_id: story.programme_id || "",
      location: story.location || "",
      published_date: story.published_date
        ? new Date(story.published_date).toISOString().split("T")[0]
        : "",
      is_featured: story.is_featured,
      status: story.status,
      tags: Array.isArray(story.tags) ? story.tags.join(", ") : "",
    });
    setEditing(story.id);
    setCreating(false);
    setLastSaved(null);
  }

  function cancelEdit() {
    setCreating(false);
    setEditing(null);
    setLastSaved(null);
  }

  async function handleSave() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt,
        author_name: form.author_name,
        author_role: form.author_role || null,
        author_photo: form.author_photo || null,
        cover_image: form.cover_image || "/images/story-placeholder.jpg",
        body: form.body,
        programme_id: form.programme_id || null,
        location: form.location || null,
        published_date: form.published_date || new Date().toISOString(),
        is_featured: form.is_featured,
        status: form.status,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const url = creating
        ? "/api/admin/stories"
        : `/api/admin/stories/${editing}`;
      const method = creating ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
        return;
      }

      toast.success(creating ? "Story created" : "Story updated");
      setLastSaved(new Date().toLocaleTimeString());
      await fetchStories();

      if (creating) {
        setCreating(false);
        setForm(emptyForm);
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/stories/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Story deleted");
        setDeleteTarget(null);
        if (editing === deleteTarget.id) cancelEdit();
        await fetchStories();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  function updateField(field: string, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "title" && !editing) {
      setForm((prev) => ({ ...prev, slug: slugify(value as string) }));
    }
  }

  const showForm = creating || editing;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading text-[var(--brand-text-primary)]">
            Stories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage impact stories and testimonials
          </p>
        </div>
        {!showForm && (
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Story
          </Button>
        )}
      </div>

      {/* Status Filter */}
      {!showForm && (
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* List View */}
      {!showForm && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {stories.length} Storie{stories.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : stories.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No stories found. Click &quot;Add Story&quot; to create one.
                </p>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead className="text-right w-28">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stories.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {s.is_featured && (
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                            )}
                            <span className="font-medium truncate max-w-[200px]">
                              {s.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {s.author_name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={s.status === "published" ? "default" : "secondary"}
                            className={
                              s.status === "published"
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                                : ""
                            }
                          >
                            {s.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {s.published_date
                            ? new Date(s.published_date).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => startEdit(s)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteTarget(s)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {creating ? "Create New Story" : "Edit Story"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Story title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="auto-generated-from-title"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                placeholder="Brief summary for cards and previews"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                value={form.body}
                onChange={(e) => updateField("body", e.target.value)}
                placeholder="Full story content"
                rows={8}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cover_image">Cover Image URL</Label>
                <Input
                  id="cover_image"
                  value={form.cover_image}
                  onChange={(e) => updateField("cover_image", e.target.value)}
                  placeholder="/images/story-placeholder.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="programme_id">Related Programme</Label>
                <Select
                  value={form.programme_id}
                  onValueChange={(v) => updateField("programme_id", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select programme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {programmes.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Author Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Author Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author_name">Author Name</Label>
                  <Input
                    id="author_name"
                    value={form.author_name}
                    onChange={(e) => updateField("author_name", e.target.value)}
                    placeholder="Author name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author_role">Author Role</Label>
                  <Input
                    id="author_role"
                    value={form.author_role}
                    onChange={(e) => updateField("author_role", e.target.value)}
                    placeholder="e.g. Programme Manager"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="author_photo">Author Photo URL</Label>
                <Input
                  id="author_photo"
                  value={form.author_photo}
                  onChange={(e) => updateField("author_photo", e.target.value)}
                  placeholder="/images/author.jpg"
                />
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="e.g. Turkana County"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="published_date">Published Date</Label>
                <Input
                  id="published_date"
                  type="date"
                  value={form.published_date}
                  onChange={(e) => updateField("published_date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => updateField("status", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags + Featured */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={form.tags}
                  onChange={(e) => updateField("tags", e.target.value)}
                  placeholder="resilience, agriculture, youth"
                />
              </div>
              <div className="flex items-end pb-1">
                <div className="flex items-center gap-3">
                  <Switch
                    id="is_featured"
                    checked={form.is_featured}
                    onCheckedChange={(checked) => updateField("is_featured", checked)}
                  />
                  <Label htmlFor="is_featured" className="cursor-pointer">
                    Featured story
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>

          <AdminFormFooter
            onSave={handleSave}
            isSaving={saving}
            lastSaved={lastSaved}
          />
          <div className="px-4 pb-3">
            <Button variant="outline" onClick={cancelEdit} className="w-full sm:w-auto">
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Delete Dialog */}
      <AdminDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Story"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
