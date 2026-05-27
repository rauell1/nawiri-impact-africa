import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth, parseJsonField, stringifyJsonField } from "@/lib/admin-api";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;
  const { id } = await params;

  try {
    const programme = await db.programme.findUnique({ where: { id } });
    if (!programme) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...programme,
      key_activities: parseJsonField(programme.key_activities, []),
      gallery_images: parseJsonField(programme.gallery_images, []),
    });
  } catch (error) {
    console.error("Error fetching programme:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
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
    if (Array.isArray(data.key_activities)) data.key_activities = stringifyJsonField(data.key_activities);
    if (Array.isArray(data.gallery_images)) data.gallery_images = stringifyJsonField(data.gallery_images);

    const programme = await db.programme.update({ where: { id }, data });

    return NextResponse.json({
      ...programme,
      key_activities: parseJsonField(programme.key_activities, []),
      gallery_images: parseJsonField(programme.gallery_images, []),
    });
  } catch (error) {
    console.error("Error updating programme:", error);
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
    await db.programme.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting programme:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
