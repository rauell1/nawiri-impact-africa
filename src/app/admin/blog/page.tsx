"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
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

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image: string;
  category: string;
  author_name: string | null;
  published_date: string;
  is_featured: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  cover_image: "",
  category: "News",
  author_name: "",
  published_date: new Date().toISOString().split("T")[0],
  is_featured: false,
  status: "draft",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const categoryColors: Record<string, string> = {
  News: "bg-blue-100 text-blue-800",
  "Programme Updates": "bg-emerald-100 text-emerald-800",
  Humanitarian: "bg-amber-100 text-amber-800",
  Opinion: "bg-purple-100 text-purple-800",
  Events: "bg-rose-100 text-rose-800",
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/blog?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch {
      toast.error("Failed to fetch blog posts");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    setLoading(true);
    fetchPosts();
  }, [fetchPosts]);

  function startCreate() {
    setForm(emptyForm);
    setCreating(true);
    setEditing(null);
    setLastSaved(null);
  }

  function startEdit(post: BlogPost) {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      body: post.body,
      cover_image: post.cover_image,
      category: post.category,
      author_name: post.author_name || "",
      published_date: post.published_date
        ? new Date(post.published_date).toISOString().split("T")[0]
        : "",
      is_featured: post.is_featured,
      status: post.status,
    });
    setEditing(post.id);
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
      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt || null,
        body: form.body,
        cover_image: form.cover_image || "/images/blog-placeholder.jpg",
        category: form.category || "News",
        author_name: form.author_name || null,
        published_date: form.published_date || new Date().toISOString(),
        is_featured: form.is_featured,
        status: form.status,
      };

      const url = creating
        ? "/api/admin/blog"
        : `/api/admin/blog/${editing}`;
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

      toast.success(creating ? "Blog post created" : "Blog post updated");
      setLastSaved(new Date().toLocaleTimeString());
      await fetchPosts();

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
      const res = await fetch(`/api/admin/blog/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Blog post deleted");
        setDeleteTarget(null);
        if (editing === deleteTarget.id) cancelEdit();
        await fetchPosts();
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
            Blog Posts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your news, updates, and articles
          </p>
        </div>
        {!showForm && (
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Blog Post
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
              {posts.length} Post{posts.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No blog posts found. Click &quot;Add Blog Post&quot; to create one.
                </p>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead className="text-right w-28">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {p.is_featured && (
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                            )}
                            <span className="font-medium truncate max-w-[200px]">
                              {p.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            variant="secondary"
                            className={
                              categoryColors[p.category] || "bg-gray-100 text-gray-800"
                            }
                          >
                            {p.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={p.status === "published" ? "default" : "secondary"}
                            className={
                              p.status === "published"
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                                : ""
                            }
                          >
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {p.published_date
                            ? new Date(p.published_date).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => startEdit(p)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteTarget(p)}
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
              {creating ? "Create New Blog Post" : "Edit Blog Post"}
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
                  placeholder="Blog post title"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => updateField("category", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="News">News</SelectItem>
                    <SelectItem value="Programme Updates">Programme Updates</SelectItem>
                    <SelectItem value="Humanitarian">Humanitarian</SelectItem>
                    <SelectItem value="Opinion">Opinion</SelectItem>
                    <SelectItem value="Events">Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="author_name">Author Name</Label>
                <Input
                  id="author_name"
                  value={form.author_name}
                  onChange={(e) => updateField("author_name", e.target.value)}
                  placeholder="Author name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image">Cover Image URL</Label>
              <Input
                id="cover_image"
                value={form.cover_image}
                onChange={(e) => updateField("cover_image", e.target.value)}
                placeholder="/images/blog-placeholder.jpg"
              />
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
                placeholder="Full blog post content"
                rows={10}
              />
            </div>

            {/* Meta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div className="flex items-end pb-1">
                <div className="flex items-center gap-3">
                  <Switch
                    id="is_featured"
                    checked={form.is_featured}
                    onCheckedChange={(checked) => updateField("is_featured", checked)}
                  />
                  <Label htmlFor="is_featured" className="cursor-pointer">
                    Featured post
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
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
