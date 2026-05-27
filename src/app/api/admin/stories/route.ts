import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth, parseJsonField, stringifyJsonField, slugify } from "@/lib/admin-api";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const authError = await requireAdminAuth(request as unknown as NextRequest);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const where: Record<string, unknown> = status && status !== "all" ? { status } : {};

    const stories = await db.story.findMany({
      where,
      orderBy: { published_date: "desc" },
    });

    return NextResponse.json(
      stories.map((s) => ({
        ...s,
        photo_gallery: parseJsonField(s.photo_gallery, []),
        tags: parseJsonField(s.tags, []),
      }))
    );
  } catch (error) {
    console.error("Error fetching stories:", error);
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
    if (!data.slug) data.slug = slugify(body.title);
    if (Array.isArray(data.photo_gallery)) data.photo_gallery = stringifyJsonField(data.photo_gallery);
    if (Array.isArray(data.tags)) data.tags = stringifyJsonField(data.tags);
    if (data.published_date) data.published_date = new Date(data.published_date as string);
    else data.published_date = new Date();

    const story = await db.story.create({ data: data as Parameters<typeof db.story.create>[0]["data"] });

    return NextResponse.json(
      { ...story, photo_gallery: parseJsonField(story.photo_gallery, []), tags: parseJsonField(story.tags, []) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating story:", error);
    const msg = error instanceof Error && error.message.includes("Unique") ? "Slug already exists" : "Failed to create";
    return NextResponse.json({ error: msg }, { status: error instanceof Error && error.message.includes("Unique") ? 409 : 500 });
  }
}
