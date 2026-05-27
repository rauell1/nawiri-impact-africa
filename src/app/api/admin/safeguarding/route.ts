import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-api";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const authError = await requireAdminAuth(request as unknown as NextRequest);
  if (authError) return authError;

  try {
    const settings = await db.safeguardingSettings.findUnique({ where: { id: "main" } });
    if (!settings) {
      return NextResponse.json({ error: "Safeguarding settings not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...settings,
      policy_documents: JSON.parse(settings.policy_documents || "[]"),
    });
  } catch (error) {
    console.error("Error fetching safeguarding settings:", error);
    return NextResponse.json({ error: "Failed to fetch safeguarding settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const data: Record<string, unknown> = { ...body };

    if (Array.isArray(data.policy_documents)) {
      data.policy_documents = JSON.stringify(data.policy_documents);
    }
    
    // Parse last_reviewed_date if provided
    if (typeof data.last_reviewed_date === "string") {
      data.last_reviewed_date = new Date(data.last_reviewed_date);
    }

    const updated = await db.safeguardingSettings.upsert({
      where: { id: "main" },
      update: data,
      create: { id: "main", ...data },
    });

    return NextResponse.json({
      ...updated,
      policy_documents: JSON.parse(updated.policy_documents || "[]"),
    });
  } catch (error) {
    console.error("Error updating safeguarding settings:", error);
    return NextResponse.json({ error: "Failed to update safeguarding settings" }, { status: 500 });
  }
}
