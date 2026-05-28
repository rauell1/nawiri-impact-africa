import { NextRequest, NextResponse } from "next/server";
import { validateSession, getSessionCookieName } from "@/lib/admin-auth";

/**
 * Admin route protection — redirects unauthenticated users to /admin/login.
 * NOTE: Next.js 16 shows a deprecation warning for middleware.ts.
 * This still works correctly; it will be migrated to proxy.ts when the API stabilizes.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Log all matched incoming requests with a timestamp
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [REQUEST] ${request.method} ${pathname}${search}`);

  // Skip non-admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Check session
  const cookieName = getSessionCookieName();
  const token = request.cookies.get(cookieName)?.value;

  if (!token || !(await validateSession(token))) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - common static files (svg, png, jpg, jpeg, gif, webp, pdf, txt, css, js)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf|json|txt|xml|css|js)).*)",
  ],
};
