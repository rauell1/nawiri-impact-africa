"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

interface Programme {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  cover_image: string;
  icon: string;
  color_accent: string;
  target_beneficiaries: string;
  impact_stat_1_number: string | null;
  impact_stat_1_label: string | null;
  impact_stat_2_number: string | null;
  impact_stat_2_label: string | null;
  impact_stat_3_number: string | null;
  impact_stat_3_label: string | null;
  status: string;
  sort_order: number;
  key_activities: unknown[];
  gallery_images: unknown[];
  createdAt: string;
  updatedAt: string;
}

const emptyForm: Omit<Programme, "id" | "key_activities" | "gallery_images" | "createdAt" | "updatedAt"> = {
  title: "",
  slug: "",
  short_description: "",
  full_description: "",
  cover_image: "",
  icon: "Leaf",
  color_accent: "",
  target_beneficiaries: "",
  impact_stat_1_number: "",
  impact_stat_1_label: "",
  impact_stat_2_number: "",
  impact_stat_2_label: "",
  impact_stat_3_number: "",
  impact_stat_3_label: "",
  status: "draft",
  sort_order: 0,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Programme | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProgrammes = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/programmes?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setProgrammes(data);
      }
    } catch {
      toast.error("Failed to fetch programmes");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    setLoading(true);
    fetchProgrammes();
  }, [fetchProgrammes]);

  function startCreate() {
    setForm(emptyForm);
    setCreating(true);
    setEditing(null);
    setLastSaved(null);
  }

  function startEdit(programme: Programme) {
    setForm({
      title: programme.title,
      slug: programme.slug,
      short_description: programme.short_description,
      full_description: programme.full_description,
      cover_image: programme.cover_image,
      icon: programme.icon,
      color_accent: programme.color_accent || "",
      target_beneficiaries: programme.target_beneficiaries,
      impact_stat_1_number: programme.impact_stat_1_number || "",
      impact_stat_1_label: programme.impact_stat_1_label || "",
      impact_stat_2_number: programme.impact_stat_2_number || "",
      impact_stat_2_label: programme.impact_stat_2_label || "",
      impact_stat_3_number: programme.impact_stat_3_number || "",
      impact_stat_3_label: programme.impact_stat_3_label || "",
      status: programme.status,
      sort_order: programme.sort_order,
    });
    setEditing(programme.id);
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
      const payload = { ...form };
      if (!payload.slug.trim()) {
        payload.slug = slugify(payload.title);
      }

      const url = creating
        ? "/api/admin/programmes"
        : `/api/admin/programmes/${editing}`;
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

      toast.success(creating ? "Programme created" : "Programme updated");
      setLastSaved(new Date().toLocaleTimeString());
      await fetchProgrammes();

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
      const res = await fetch(`/api/admin/programmes/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Programme deleted");
        setDeleteTarget(null);
        if (editing === deleteTarget.id) cancelEdit();
        await fetchProgrammes();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  function updateField(field: string, value: string | number) {
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
            Programmes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your programmes and impact areas
          </p>
        </div>
        {!showForm && (
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Programme
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
              {programmes.length} Programme{programmes.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : programmes.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No programmes found. Click &quot;Add Programme&quot; to create one.
                </p>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Slug</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell w-20">Order</TableHead>
                      <TableHead className="text-right w-28">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programmes.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.title}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                          {p.slug}
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
                        <TableCell className="hidden sm:table-cell">{p.sort_order}</TableCell>
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
              {creating ? "Create New Programme" : "Edit Programme"}
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
                  placeholder="Programme title"
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
                <Label htmlFor="icon">Icon Name</Label>
                <Input
                  id="icon"
                  value={form.icon}
                  onChange={(e) => updateField("icon", e.target.value)}
                  placeholder="Leaf, Heart, Shield..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color_accent">Color Accent</Label>
                <Input
                  id="color_accent"
                  value={form.color_accent}
                  onChange={(e) => updateField("color_accent", e.target.value)}
                  placeholder="#1B5E20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => updateField("sort_order", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image">Cover Image URL</Label>
              <Input
                id="cover_image"
                value={form.cover_image}
                onChange={(e) => updateField("cover_image", e.target.value)}
                placeholder="/images/programme-placeholder.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Short Description</Label>
              <Textarea
                id="short_description"
                value={form.short_description}
                onChange={(e) => updateField("short_description", e.target.value)}
                placeholder="Brief summary for cards and previews"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_description">Full Description</Label>
              <Textarea
                id="full_description"
                value={form.full_description}
                onChange={(e) => updateField("full_description", e.target.value)}
                placeholder="Detailed programme description"
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_beneficiaries">Target Beneficiaries</Label>
              <Input
                id="target_beneficiaries"
                value={form.target_beneficiaries}
                onChange={(e) => updateField("target_beneficiaries", e.target.value)}
                placeholder="e.g. Women, Children, Farmers"
              />
            </div>

            {/* Impact Stats */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Impact Statistics
              </h3>
              {[1, 2, 3].map((num) => (
                <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`stat_${num}_number`}>
                      Stat {num} Number
                    </Label>
                    <Input
                      id={`stat_${num}_number`}
                      value={form[`impact_stat_${num}_number` as keyof typeof form] as string}
                      onChange={(e) =>
                        updateField(`impact_stat_${num}_number`, e.target.value)
                      }
                      placeholder="e.g. 10,000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`stat_${num}_label`}>
                      Stat {num} Label
                    </Label>
                    <Input
                      id={`stat_${num}_label`}
                      value={form[`impact_stat_${num}_label` as keyof typeof form] as string}
                      onChange={(e) =>
                        updateField(`impact_stat_${num}_label`, e.target.value)
                      }
                      placeholder="e.g. Lives Impacted"
                    />
                  </div>
                </div>
              ))}
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
        title="Delete Programme"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
