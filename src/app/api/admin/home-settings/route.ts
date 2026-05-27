import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth, parseJsonField, stringifyJsonField } from "@/lib/admin-api";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const authError = await requireAdminAuth(request as unknown as NextRequest);
  if (authError) return authError;

  try {
    const settings = await db.homeSettings.findUnique({ where: { id: "main" } });
    if (!settings) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 });
    }

    let featuredStory: { id: string; title: string; slug: string; excerpt: string | null; cover_image: string } | null = null;
    if (settings.featured_story_id) {
      featuredStory = await db.story.findUnique({
        where: { id: settings.featured_story_id },
        select: { id: true, title: true, slug: true, excerpt: true, cover_image: true },
      });
    }

    return NextResponse.json({
      ...settings,
      stats: parseJsonField(settings.stats, []),
      home_featured_programmes: parseJsonField(settings.home_featured_programmes, []),
      featured_story: featuredStory,
    });
  } catch (error) {
    console.error("Error fetching home settings:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const data: Record<string, unknown> = { ...body };

    if (Array.isArray(data.stats)) data.stats = stringifyJsonField(data.stats);
    if (Array.isArray(data.home_featured_programmes)) data.home_featured_programmes = stringifyJsonField(data.home_featured_programmes);

    // Remove non-table fields
    delete (data as Record<string, unknown>).featured_story;

    const updated = await db.homeSettings.upsert({
      where: { id: "main" },
      update: data,
      create: { id: "main", ...data },
    });

    return NextResponse.json({
      ...updated,
      stats: parseJsonField(updated.stats, []),
      home_featured_programmes: parseJsonField(updated.home_featured_programmes, []),
    });
  } catch (error) {
    console.error("Error updating home settings:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
