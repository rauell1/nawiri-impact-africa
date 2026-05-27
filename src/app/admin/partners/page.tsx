"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Loader2, Pencil, Trash2, ArrowLeft, ExternalLink } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminFormFooter } from "@/components/admin/admin-form-footer";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  description: string;
  partner_type: string;
  sort_order: number;
  is_featured: boolean;
  status: string;
}

const emptyForm: Omit<Partner, "id"> = {
  name: "",
  logo_url: "/images/partner-placeholder.svg",
  website_url: "",
  description: "",
  partner_type: "Donor",
  sort_order: 0,
  is_featured: false,
  status: "draft",
};

const PARTNER_TYPES = ["Donor", "Implementing", "Government", "Corporate", "Academic", "NGO"];

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchPartners() {
    try {
      const res = await fetch("/api/admin/partners");
      if (res.ok) setPartners(await res.json());
    } catch {
      toast.error("Failed to fetch partners");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPartners();
  }, []);

  function startCreate() {
    setEditing("new");
    setForm(emptyForm);
    setLastSaved(null);
  }

  function startEdit(partner: Partner) {
    setEditing(partner.id);
    setForm({
      name: partner.name,
      logo_url: partner.logo_url,
      website_url: partner.website_url || "",
      description: partner.description || "",
      partner_type: partner.partner_type,
      sort_order: partner.sort_order,
      is_featured: partner.is_featured,
      status: partner.status,
    });
    setLastSaved(null);
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Partner name is required");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, sort_order: Number(form.sort_order) || 0 };

      const url = editing === "new" ? "/api/admin/partners" : `/api/admin/partners/${editing}`;
      const method = editing === "new" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editing === "new" ? "Partner added" : "Partner updated");
        setLastSaved(new Date().toLocaleTimeString());
        await fetchPartners();
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
      const res = await fetch(`/api/admin/partners/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Partner deleted");
        setPartners((prev) => prev.filter((p) => p.id !== deleteTarget.id));
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

  const typeColor = (type: string) => {
    switch (type) {
      case "Donor": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Implementing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Government": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Corporate": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Academic": return "bg-rose-100 text-rose-800 border-rose-200";
      case "NGO": return "bg-teal-100 text-teal-800 border-teal-200";
      default: return "";
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
              {editing === "new" ? "New Partner" : "Edit Partner"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {editing === "new" ? "Add a new partner organization" : `Editing: ${form.name}`}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Partner Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g. USAID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partner_type">Partner Type</Label>
                <Select value={form.partner_type} onValueChange={(v) => updateField("partner_type", v)}>
                  <SelectTrigger id="partner_type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PARTNER_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input id="logo_url" value={form.logo_url} onChange={(e) => updateField("logo_url", e.target.value)} placeholder="https://example.com/logo.png" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_url">Website URL</Label>
                <Input id="website_url" value={form.website_url} onChange={(e) => updateField("website_url", e.target.value)} placeholder="https://example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={3} placeholder="Brief description of the partnership..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input id="sort_order" type="number" value={form.sort_order} onChange={(e) => updateField("sort_order", parseInt(e.target.value) || 0)} />
              </div>
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
            </div>

            <div className="flex items-center space-x-3">
              <Switch id="is_featured" checked={form.is_featured} onCheckedChange={(v) => updateField("is_featured", v)} />
              <Label htmlFor="is_featured" className="cursor-pointer">Featured Partner</Label>
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
          <h1 className="text-2xl font-heading text-[var(--brand-text-primary)]">Partners</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage partner organizations and donors
          </p>
        </div>
        <Button onClick={startCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Partner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Partners ({partners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {partners.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No partners yet. Click &quot;Add Partner&quot; to create one.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 pr-4 font-medium text-muted-foreground">Name</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground hidden sm:table-cell">Logo</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground hidden md:table-cell">Type</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground hidden lg:table-cell">Featured</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner) => (
                    <tr key={partner.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 pr-4">
                        <div>
                          <p className="font-medium">{partner.name}</p>
                          {partner.website_url && (
                            <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 mt-0.5">
                              <ExternalLink className="h-3 w-3" />
                              Website
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 hidden sm:table-cell">
                        <Avatar className="h-8 w-8 rounded-md">
                          <AvatarImage src={partner.logo_url || undefined} alt={partner.name} />
                          <AvatarFallback className="text-[10px] rounded-md bg-muted">
                            {partner.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </td>
                      <td className="py-3 pr-4 hidden md:table-cell">
                        <Badge variant="outline" className={`text-[11px] ${typeColor(partner.partner_type)}`}>
                          {partner.partner_type}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 hidden lg:table-cell">
                        {partner.is_featured ? (
                          <Badge variant="outline" className="text-amber-600 border-amber-300 text-[11px]">Featured</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={partner.status === "published" ? "default" : "outline"}>
                          {partner.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(partner)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(partner)}>
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
        title="Delete Partner"
        description={`Are you sure you want to remove "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
