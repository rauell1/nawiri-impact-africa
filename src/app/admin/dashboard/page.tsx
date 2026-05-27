"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Megaphone,
  Briefcase,
  Users,
  Heart,
  Mail,
  TrendingUp,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  programmes: number;
  stories: number;
  blogPosts: number;
  reports: number;
  careers: number;
  teamMembers: number;
  partners: number;
  contacts: number;
  publishedProgrammes: number;
  publishedBlog: number;
  openCareers: number;
}

interface RecentContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentContacts(data.recentContacts || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const contentCards = [
    {
      title: "Programmes",
      count: stats?.programmes ?? 0,
      published: stats?.publishedProgrammes ?? 0,
      icon: BookOpen,
      href: "/admin/programmes",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Stories",
      count: stats?.stories ?? 0,
      icon: FileText,
      href: "/admin/stories",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Blog Posts",
      count: stats?.blogPosts ?? 0,
      published: stats?.publishedBlog ?? 0,
      icon: Megaphone,
      href: "/admin/blog",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Reports",
      count: stats?.reports ?? 0,
      icon: FileText,
      href: "/admin/reports",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Careers",
      count: stats?.careers ?? 0,
      open: stats?.openCareers ?? 0,
      icon: Briefcase,
      href: "/admin/careers",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Team Members",
      count: stats?.teamMembers ?? 0,
      icon: Users,
      href: "/admin/team",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      title: "Partners",
      count: stats?.partners ?? 0,
      icon: Heart,
      href: "/admin/partners",
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      title: "Messages",
      count: stats?.contacts ?? 0,
      icon: Mail,
      href: "/admin/contacts",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading text-[var(--brand-text-primary)]">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your website content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            CMS Active
          </Badge>
        </div>
      </div>

      {/* Content Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {contentCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[var(--brand-text-primary)]">
                  {card.count}
                </div>
                {card.published !== undefined && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.published} published
                  </p>
                )}
                {card.open !== undefined && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.open} open
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions + Recent Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Edit Homepage", href: "/admin/home-settings" },
              { label: "Add Blog Post", href: "/admin/blog" },
              { label: "Add Story", href: "/admin/stories" },
              { label: "Post a Job", href: "/admin/careers" },
              { label: "View Messages", href: "/admin/contacts" },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted transition-colors group">
                  <span className="text-sm">{action.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Contact Messages */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Messages</CardTitle>
              <CardDescription>Latest contact form submissions</CardDescription>
            </div>
            <Link href="/admin/contacts">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentContacts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No messages yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-start justify-between py-2 border-b last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {contact.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {contact.subject}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
