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

interface Career {
  id: string;
  job_title: string;
  slug: string;
  department: string;
  location: string;
  employment_type: string;
  description: string;
  requirements: string;
  how_to_apply: string;
  application_email: string;
  application_deadline: string;
  salary_range: string;
  is_urgent: boolean;
  status: string;
  published_date: string;
}

const emptyForm: Omit<Career, "id"> = {
  job_title: "",
  slug: "",
  department: "Programmes",
  location: "Nairobi",
  employment_type: "Full-time",
  description: "",
  requirements: "",
  how_to_apply: "",
  application_email: "",
  application_deadline: new Date().toISOString().split("T")[0],
  salary_range: "",
  is_urgent: false,
  status: "open",
  published_date: new Date().toISOString().split("T")[0],
};

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Consultancy", "Internship"];

export default function AdminCareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Career | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchCareers() {
    try {
      const res = await fetch("/api/admin/careers");
      if (res.ok) setCareers(await res.json());
    } catch {
      toast.error("Failed to fetch careers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCareers();
  }, []);

  function startCreate() {
    setEditing("new");
    setForm(emptyForm);
    setLastSaved(null);
  }

  function startEdit(career: Career) {
    setEditing(career.id);
    setForm({
      job_title: career.job_title,
      slug: career.slug,
      department: career.department,
      location: career.location,
      employment_type: career.employment_type,
      description: career.description,
      requirements: career.requirements,
      how_to_apply: career.how_to_apply || "",
      application_email: career.application_email || "",
      application_deadline: career.application_deadline?.split("T")[0] || "",
      salary_range: career.salary_range || "",
      is_urgent: career.is_urgent,
      status: career.status,
      published_date: career.published_date?.split("T")[0] || "",
    });
    setLastSaved(null);
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
  }

  async function handleSave() {
    if (!form.job_title.trim()) {
      toast.error("Job title is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        published_date: form.published_date ? new Date(form.published_date).toISOString() : new Date().toISOString(),
        application_deadline: form.application_deadline ? new Date(form.application_deadline).toISOString() : null,
      };

      const url = editing === "new" ? "/api/admin/careers" : `/api/admin/careers/${editing}`;
      const method = editing === "new" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editing === "new" ? "Job posting created" : "Job posting updated");
        setLastSaved(new Date().toLocaleTimeString());
        await fetchCareers();
        if (editing === "new") cancelEdit();
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
      const res = await fetch(`/api/admin/careers/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Job posting deleted");
        setCareers((prev) => prev.filter((c) => c.id !== deleteTarget.id));
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

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return "No deadline";
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }

  const statusColor = (s: string) => {
    switch (s) {
      case "open": return "default" as const;
      case "closed": return "secondary" as const;
      default: return "outline" as const;
    }
  };

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
              {editing === "new" ? "New Job Posting" : "Edit Job Posting"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {editing === "new" ? "Post a new career opportunity" : `Editing: ${form.job_title}`}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title *</Label>
                <Input id="job_title" value={form.job_title} onChange={(e) => updateField("job_title", e.target.value)} placeholder="e.g. Programme Manager" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" value={form.department} onChange={(e) => updateField("department", e.target.value)} placeholder="e.g. Programmes" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={form.location} onChange={(e) => updateField("location", e.target.value)} placeholder="e.g. Nairobi, Kenya" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employment_type">Employment Type</Label>
                <Select value={form.employment_type} onValueChange={(v) => updateField("employment_type", v)}>
                  <SelectTrigger id="employment_type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={4} placeholder="Job description..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea id="requirements" value={form.requirements} onChange={(e) => updateField("requirements", e.target.value)} rows={4} placeholder="Required qualifications and skills..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="how_to_apply">How to Apply</Label>
              <Textarea id="how_to_apply" value={form.how_to_apply} onChange={(e) => updateField("how_to_apply", e.target.value)} rows={3} placeholder="Application instructions..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="application_email">Application Email</Label>
                <Input id="application_email" type="email" value={form.application_email} onChange={(e) => updateField("application_email", e.target.value)} placeholder="careers@nawiri.org" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_range">Salary Range</Label>
                <Input id="salary_range" value={form.salary_range} onChange={(e) => updateField("salary_range", e.target.value)} placeholder="e.g. KES 150,000 - 200,000" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="application_deadline">Application Deadline</Label>
                <Input id="application_deadline" type="date" value={form.application_deadline} onChange={(e) => updateField("application_deadline", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="published_date">Published Date</Label>
                <Input id="published_date" type="date" value={form.published_date} onChange={(e) => updateField("published_date", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
                  <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-3 pt-7">
                <Switch id="is_urgent" checked={form.is_urgent} onCheckedChange={(v) => updateField("is_urgent", v)} />
                <Label htmlFor="is_urgent" className="cursor-pointer">Urgent Hiring</Label>
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
          <h1 className="text-2xl font-heading text-[var(--brand-text-primary)]">Careers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage job postings and career opportunities
          </p>
        </div>
        <Button onClick={startCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Job
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Jobs ({careers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {careers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No job postings yet. Click &quot;Add Job&quot; to create one.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 pr-4 font-medium text-muted-foreground">Title</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground hidden md:table-cell">Department</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground hidden lg:table-cell">Location</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground hidden sm:table-cell">Type</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground hidden md:table-cell">Deadline</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {careers.map((career) => (
                    <tr key={career.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 pr-4">
                        <div>
                          <p className="font-medium">{career.job_title}</p>
                          {career.is_urgent && (
                            <Badge variant="destructive" className="mt-1 text-[10px]">Urgent</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground hidden md:table-cell">{career.department}</td>
                      <td className="py-3 pr-4 text-muted-foreground hidden lg:table-cell">{career.location}</td>
                      <td className="py-3 pr-4 hidden sm:table-cell">
                        <Badge variant="secondary" className="text-[11px]">{career.employment_type}</Badge>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground hidden md:table-cell">{formatDate(career.application_deadline)}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={statusColor(career.status)}>{career.status}</Badge>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(career)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(career)}>
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
        title="Delete Job Posting"
        description={`Are you sure you want to delete "${deleteTarget?.job_title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
