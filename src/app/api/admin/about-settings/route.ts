import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-api";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const authError = await requireAdminAuth(request as unknown as NextRequest);
  if (authError) return authError;

  try {
    const settings = await db.aboutSettings.findUnique({ where: { id: "main" } });
    if (!settings) {
      return NextResponse.json({ error: "About settings not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...settings,
      values: JSON.parse(settings.values || "[]"),
      history_timeline: JSON.parse(settings.history_timeline || "[]"),
    });
  } catch (error) {
    console.error("Error fetching about settings:", error);
    return NextResponse.json({ error: "Failed to fetch about settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const data: Record<string, unknown> = { ...body };

    if (Array.isArray(data.values)) {
      data.values = JSON.stringify(data.values);
    }
    if (Array.isArray(data.history_timeline)) {
      data.history_timeline = JSON.stringify(data.history_timeline);
    }

    const updated = await db.aboutSettings.upsert({
      where: { id: "main" },
      update: data,
      create: { id: "main", ...data },
    });

    return NextResponse.json({
      ...updated,
      values: JSON.parse(updated.values || "[]"),
      history_timeline: JSON.parse(updated.history_timeline || "[]"),
    });
  } catch (error) {
    console.error("Error updating about settings:", error);
    return NextResponse.json({ error: "Failed to update about settings" }, { status: 500 });
  }
}
