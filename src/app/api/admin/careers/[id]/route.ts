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

  const career = await db.career.findUnique({ where: { id } });
  if (!career) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(career);
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
    if (data.application_deadline) data.application_deadline = new Date(data.application_deadline as string);

    const career = await db.career.update({ where: { id }, data });
    return NextResponse.json(career);
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
    await db.career.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
