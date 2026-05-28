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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminFormFooter } from "@/components/admin/admin-form-footer";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  email: string;
  linkedin_url: string;
  sort_order: number;
  is_leadership: boolean;
  status: string;
}

const emptyForm: Omit<TeamMember, "id"> = {
  name: "",
  role: "",
  bio: "",
  photo: "",
  email: "",
  linkedin_url: "",
  sort_order: 0,
  is_leadership: false,
  status: "draft",
};

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchTeam() {
    try {
      const res = await fetch("/api/admin/team");
      if (res.ok) setMembers(await res.json());
    } catch {
      toast.error("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeam();
  }, []);

  function startCreate() {
    setEditing("new");
    setForm(emptyForm);
    setLastSaved(null);
  }

  function startEdit(member: TeamMember) {
    setEditing(member.id);
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio || "",
      photo: member.photo || "",
      email: member.email || "",
      linkedin_url: member.linkedin_url || "",
      sort_order: member.sort_order,
      is_leadership: member.is_leadership,
      status: member.status,
    });
    setLastSaved(null);
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, sort_order: Number(form.sort_order) || 0 };

      const url = editing === "new" ? "/api/admin/team" : `/api/admin/team/${editing}`;
      const method = editing === "new" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editing === "new" ? "Team member added" : "Team member updated");
        setLastSaved(new Date().toLocaleTimeString());
        await fetchTeam();
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
      const res = await fetch(`/api/admin/team/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Team member deleted");
        setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
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
              {editing === "new" ? "New Team Member" : "Edit Team Member"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {editing === "new" ? "Add a new member to the team" : `Editing: ${form.name}`}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g. Jane Wanjiku" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role / Title</Label>
                <Input id="role" value={form.role} onChange={(e) => updateField("role", e.target.value)} placeholder="e.g. Executive Director" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={form.bio} onChange={(e) => updateField("bio", e.target.value)} rows={4} placeholder="Brief biography..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="photo">Photo URL</Label>
                <Input id="photo" value={form.photo} onChange={(e) => updateField("photo", e.target.value)} placeholder="https://example.com/photo.jpg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="jane@nawiri.org" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input id="linkedin_url" value={form.linkedin_url} onChange={(e) => updateField("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input id="sort_order" type="number" value={form.sort_order} onChange={(e) => updateField("sort_order", parseInt(e.target.value) || 0)} />
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
                <Switch id="is_leadership" checked={form.is_leadership} onCheckedChange={(v) => updateField("is_leadership", v)} />
                <Label htmlFor="is_leadership" className="cursor-pointer">Leadership Team</Label>
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
          <h1 className="text-2xl font-heading text-[var(--brand-text-primary)]">Team Members</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage team profiles displayed on the website
          </p>
        </div>
        <Button onClick={startCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No team members yet. Click &quot;Add Member&quot; to create one.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 pr-4 font-medium text-muted-foreground">Name</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground hidden md:table-cell">Role</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground hidden sm:table-cell">Leadership</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground hidden lg:table-cell">Order</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.photo || undefined} alt={member.name} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground hidden md:table-cell">{member.role || "-"}</td>
                      <td className="py-3 pr-4 hidden sm:table-cell">
                        {member.is_leadership ? (
                          <Badge variant="outline" className="text-amber-600 border-amber-300 text-[11px]">Leadership</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground hidden lg:table-cell">{member.sort_order}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={member.status === "published" ? "default" : "outline"}>
                          {member.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(member)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(member)}>
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
        title="Delete Team Member"
        description={`Are you sure you want to remove "${deleteTarget?.name}" from the team? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
