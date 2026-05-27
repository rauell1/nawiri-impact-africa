import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-api";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;
  const { id } = await params;

  const report = await db.report.findUnique({ where: { id } });
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(report);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;
  const { id } = await params;

  try {
    const body = await request.json();
    const data: Record<string, unknown> = { ...body };
    if (data.published_date) data.published_date = new Date(data.published_date as string);

    const report = await db.report.update({ where: { id }, data });
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;
  const { id } = await params;

  try {
    await db.report.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
