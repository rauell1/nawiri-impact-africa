import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth, stringifyJsonField } from "@/lib/admin-api";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const authError = await requireAdminAuth(request as unknown as NextRequest);
  if (authError) return authError;

  try {
    const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
    if (!settings) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...settings,
      footer_links: JSON.parse(settings.footer_links || "[]"),
    });
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const data: Record<string, unknown> = { ...body };

    if (Array.isArray(data.footer_links)) {
      data.footer_links = JSON.stringify(data.footer_links);
    }

    const updated = await db.siteSettings.upsert({
      where: { id: "main" },
      update: data,
      create: { id: "main", ...data },
    });

    return NextResponse.json({
      ...updated,
      footer_links: JSON.parse(updated.footer_links || "[]"),
    });
  } catch (error) {
    console.error("Error updating site settings:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
