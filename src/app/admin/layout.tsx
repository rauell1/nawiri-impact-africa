"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";

type AdminAuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  isLoading: true,
});

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth/check");
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          router.push("/admin/login");
        }
      } catch {
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return (
      <>
        <head>
          <meta name="robots" content="noindex, nofollow" />
        </head>
        {children}
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading }}>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex-1">
              <nav className="text-sm text-muted-foreground font-ui" aria-label="Admin breadcrumb">
                Nawiri CMS / {getBreadcrumb(pathname)}
              </nav>
            </div>
          </header>
          <div className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster position="top-right" richColors />
    </AdminAuthContext.Provider>
  );
}

function getBreadcrumb(pathname: string): string {
  const map: Record<string, string> = {
    "/admin/dashboard": "Dashboard",
    "/admin/site-settings": "Site Settings",
    "/admin/home-settings": "Home Settings",
    "/admin/programmes": "Programmes",
    "/admin/stories": "Stories",
    "/admin/blog": "Blog Posts",
    "/admin/reports": "Reports",
    "/admin/careers": "Careers",
    "/admin/team": "Team Members",
    "/admin/partners": "Partners",
    "/admin/contacts": "Contact Messages",
  };

  return map[pathname] || "Admin";
}
