import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-api";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const authError = await requireAdminAuth(request as unknown as NextRequest);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const [contacts, total] = await Promise.all([
      db.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.contactSubmission.count(),
    ]);

    return NextResponse.json({ contacts, total, page, limit });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}


