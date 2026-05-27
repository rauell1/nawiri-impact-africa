"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

const PAGE_SIZE = 50;

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewing, setViewing] = useState<ContactSubmission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactSubmission | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchContacts() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/contacts?page=${page}&limit=${PAGE_SIZE}`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts);
        setTotal(data.total);
      }
    } catch {
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContacts();
  }, [page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/contacts/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Message deleted");
        setContacts((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setTotal((prev) => prev - 1);
        setDeleteTarget(null);
        if (viewing?.id === deleteTarget.id) setViewing(null);
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setDeleting(false);
    }
  }

  function formatDateTime(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function truncate(str: string, len: number) {
    return str.length > len ? str.slice(0, len) + "..." : str;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading text-[var(--brand-text-primary)]">Contact Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {total} total message{total !== 1 ? "s" : ""} from the contact form
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Messages (Page {page} of {totalPages || 1})</CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No contact messages yet. Messages from the public contact form will appear here.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 pr-4 font-medium text-muted-foreground">Name</th>
                      <th className="pb-3 pr-4 font-medium text-muted-foreground hidden md:table-cell">Email</th>
                      <th className="pb-3 pr-4 font-medium text-muted-foreground">Subject</th>
                      <th className="pb-3 pr-4 font-medium text-muted-foreground hidden lg:table-cell">Message</th>
                      <th className="pb-3 pr-4 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="border-b last:border-0 hover:bg-muted/50 cursor-pointer"
                        onClick={() => setViewing(contact)}
                      >
                        <td className="py-3 pr-4">
                          <p className="font-medium">{contact.name}</p>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground hidden md:table-cell">
                          <span className="text-xs">{contact.email}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant="secondary" className="text-[11px] max-w-[180px] truncate block">
                            {contact.subject}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground hidden lg:table-cell max-w-xs">
                          <span className="text-xs">{truncate(contact.message, 80)}</span>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground hidden sm:table-cell whitespace-nowrap text-xs">
                          {formatDateTime(contact.createdAt)}
                        </td>
                        <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewing(contact)}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(contact)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* View Message Dialog */}
      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewing?.subject || "Message"}</DialogTitle>
            <DialogDescription>
              From {viewing?.name} ({viewing?.email}) on {viewing && formatDateTime(viewing.createdAt)}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Subject</p>
              <p className="text-sm">{viewing?.subject}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">From</p>
              <p className="text-sm">{viewing?.name} &lt;{viewing?.email}&gt;</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Message</p>
              <div className="bg-muted rounded-md p-4 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                {viewing?.message}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="destructive" size="sm" onClick={() => {
              if (viewing) setDeleteTarget(viewing);
              setViewing(null);
            }}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Delete
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewing(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AdminDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Message"
        description={`Are you sure you want to delete the message from "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
