import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-api";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const authError = await requireAdminAuth(request as unknown as NextRequest);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const where: Record<string, unknown> = status && status !== "all" ? { status } : {};

    const reports = await db.report.findMany({
      where,
      orderBy: { published_date: "desc" },
    });

    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    if (!body.title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const data: Record<string, unknown> = { ...body };
    if (data.published_date) data.published_date = new Date(data.published_date as string);
    else data.published_date = new Date();

    const report = await db.report.create({ data: data as Parameters<typeof db.report.create>[0]["data"] });
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
