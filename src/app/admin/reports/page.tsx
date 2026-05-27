"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Loader2, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminFormFooter } from "@/components/admin/admin-form-footer";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";

interface Report {
  id: string;
  title: string;
  description: string;
  document_type: string;
  year: number;
  file_url: string;
  cover_image: string;
  is_featured: boolean;
  published_date: string;
  status: string;
}

const emptyForm: Omit<Report, "id"> = {
  title: "",
  description: "",
  document_type: "Annual Report",
  year: new Date().getFullYear(),
  file_url: "",
  cover_image: "",
  is_featured: false,
  published_date: new Date().toISOString().split("T")[0],
  status: "draft",
};

const DOC_TYPES = ["Annual Report", "Financial Report", "Evaluation", "Policy Brief", "Research Paper"];

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchReports() {
    try {
      const res = await fetch("/api/admin/reports");
      if (res.ok) setReports(await res.json());
    } catch {
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  function startCreate() {
    setEditing("new");
    setForm(emptyForm);
    setLastSaved(null);
  }

  function startEdit(report: Report) {
    setEditing(report.id);
    setForm({
      title: report.title,
      description: report.description || "",
      document_type: report.document_type,
      year: report.year,
      file_url: report.file_url,
      cover_image: report.cover_image || "",
      is_featured: report.is_featured,
      published_date: report.published_date?.split("T")[0] || new Date().toISOString().split("T")[0],
      status: report.status,
    });
    setLastSaved(null);
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
  }

  async function handleSave() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        year: Number(form.year) || new Date().getFullYear(),
        published_date: form.published_date ? new Date(form.published_date).toISOString() : new Date().toISOString(),
      };

      const url = editing === "new" ? "/api/admin/reports" : `/api/admin/reports/${editing}`;
      const method = editing === "new" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editing === "new" ? "Report created" : "Report updated");
        setLastSaved(new Date().toLocaleTimeString());
        await fetchReports();
        if (editing === "new") {
          cancelEdit();
        }
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/reports/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Report deleted");
        setReports((prev) => prev.filter((r) => r.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setDeleting(false);
    }
  }

  function updateField(field: string, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Form view
  if (editing) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={cancelEdit}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-heading text-[var(--brand-text-primary)]">
              {editing === "new" ? "New Report" : "Edit Report"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {editing === "new" ? "Add a new report to the library" : `Editing: ${form.title}`}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="e.g. Annual Report 2024" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document_type">Document Type</Label>
                <Select value={form.document_type} onValueChange={(v) => updateField("document_type", v)}>
                  <SelectTrigger id="document_type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DOC_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={3} placeholder="Brief description of the report" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" value={form.year} onChange={(e) => updateField("year", parseInt(e.target.value) || new Date().getFullYear())} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="published_date">Published Date</Label>
                <Input id="published_date" type="date" value={form.published_date} onChange={(e) => updateField("published_date", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="file_url">File URL</Label>
                <Input id="file_url" value={form.file_url} onChange={(e) => updateField("file_url", e.target.value)} placeholder="https://example.com/report.pdf" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover_image">Cover Image URL</Label>
                <Input id="cover_image" value={form.cover_image} onChange={(e) => updateField("cover_image", e.target.value)} placeholder="https://example.com/cover.jpg" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
                  <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-3 pt-7">
                <Switch id="is_featured" checked={form.is_featured} onCheckedChange={(v) => updateField("is_featured", v)} />
                <Label htmlFor="is_featured" className="cursor-pointer">Featured Report</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <AdminFormFooter onSave={handleSave} isSaving={saving} lastSaved={lastSaved} />
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading text-[var(--brand-text-primary)]">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage downloadable reports and documents
          </p>
        </div>
        <Button onClick={startCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Reports ({reports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No reports yet. Click &quot;Add Report&quot; to create one.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 pr-4 font-medium text-muted-foreground">Title</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground hidden md:table-cell">Year</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground hidden sm:table-cell">Type</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 pr-4">
                        <div>
                          <p className="font-medium">{report.title}</p>
                          {report.is_featured && (
                            <Badge variant="outline" className="text-amber-600 border-amber-300 mt-1 text-[10px]">Featured</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground hidden md:table-cell">{report.year}</td>
                      <td className="py-3 pr-4 hidden sm:table-cell">
                        <Badge variant="secondary" className="text-[11px]">{report.document_type}</Badge>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={report.status === "published" ? "default" : "outline"}>
                          {report.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(report)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(report)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AdminDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Report"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
