"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Home,
  BookOpen,
  FileText,
  Megaphone,
  Briefcase,
  Users,
  Heart,
  Mail,
  LogOut,
  Leaf,
  ExternalLink,
  Info,
  Shield,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Settings",
    items: [
      { title: "Site Settings", href: "/admin/site-settings", icon: Settings },
      { title: "Home Settings", href: "/admin/home-settings", icon: Home },
      { title: "About Settings", href: "/admin/about-settings", icon: Info },
      { title: "Safeguarding", href: "/admin/safeguarding", icon: Shield },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Programmes", href: "/admin/programmes", icon: BookOpen },
      { title: "Stories", href: "/admin/stories", icon: FileText },
      { title: "Blog Posts", href: "/admin/blog", icon: Megaphone },
      { title: "Reports", href: "/admin/reports", icon: FileText },
      { title: "Careers", href: "/admin/careers", icon: Briefcase },
      { title: "Team Members", href: "/admin/team", icon: Users },
      { title: "Partners", href: "/admin/partners", icon: Heart },
    ],
  },

  {
    label: "Communications",
    items: [
      { title: "Contact Messages", href: "/admin/contacts", icon: Mail },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      toast.success("Logged out");
      window.location.href = "/admin/login";
    } catch {
      toast.error("Failed to log out");
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Leaf className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Nawiri CMS</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Admin Panel
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin/dashboard" &&
                      pathname.startsWith(item.href));
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="View Website">
              <Link href="/" target="_blank">
                <ExternalLink className="size-4" />
                <span>View Website</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Sign Out">
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
