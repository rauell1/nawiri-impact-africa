/**
 * Shared utility for admin API routes.
 * Validates session from cookies and returns an error response if not authenticated.
 */
import { NextRequest, NextResponse } from "next/server";
import {
  validateSession,
  getSessionCookieName,
} from "@/lib/admin-auth";

export async function requireAdminAuth(
  request: NextRequest
): Promise<NextResponse | null> {
  const token = request.cookies.get(getSessionCookieName())?.value;

  if (!validateSession(token)) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  return null; // Auth passed
}

/** Parse JSON string fields from Prisma models */
export function parseJsonField<T = unknown>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/** Stringify value if it's an array/object, otherwise return as-is */
export function stringifyJsonField(value: unknown): string {
  if (typeof value === "string") return value;
  return JSON.stringify(value ?? "");
}

/** Helper to build a slug from a title */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
