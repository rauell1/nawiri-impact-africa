import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth, parseJsonField, stringifyJsonField, slugify } from "@/lib/admin-api";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;
  const { id } = await params;

  try {
    const story = await db.story.findUnique({ where: { id } });
    if (!story) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...story,
      photo_gallery: parseJsonField(story.photo_gallery, []),
      tags: parseJsonField(story.tags, []),
    });
  } catch (error) {
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
    if (Array.isArray(data.photo_gallery)) data.photo_gallery = stringifyJsonField(data.photo_gallery);
    if (Array.isArray(data.tags)) data.tags = stringifyJsonField(data.tags);
    if (data.published_date) data.published_date = new Date(data.published_date as string);

    const story = await db.story.update({ where: { id }, data });

    return NextResponse.json({
      ...story,
      photo_gallery: parseJsonField(story.photo_gallery, []),
      tags: parseJsonField(story.tags, []),
    });
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
    await db.story.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
