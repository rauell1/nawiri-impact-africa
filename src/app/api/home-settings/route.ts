import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── GET /api/home-settings ───
export async function GET() {
  try {
    const settings = await db.homeSettings.findUnique({
      where: { id: "main" },
    });

    if (!settings) {
      return NextResponse.json(
        { error: "Home settings not found" },
        { status: 404 }
      );
    }

    // Parse stats from JSON string to array of stat objects
    let parsedStats: unknown[] = [];
    try {
      parsedStats = JSON.parse(settings.stats);
    } catch {
      parsedStats = [];
    }

    // Parse home_featured_programmes from JSON string
    let parsedFeaturedProgrammes: unknown[] = [];
    try {
      parsedFeaturedProgrammes = JSON.parse(settings.home_featured_programmes);
    } catch {
      parsedFeaturedProgrammes = [];
    }

    // Fetch the related featured story manually (no explicit Prisma relation)
    let featuredStory = null;
    if (settings.featured_story_id) {
      featuredStory = await db.story.findUnique({
        where: { id: settings.featured_story_id },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          author_name: true,
          author_role: true,
          author_photo: true,
          cover_image: true,
          published_date: true,
          is_featured: true,
        },
      });
    }

    return NextResponse.json({
      ...settings,
      stats: parsedStats,
      home_featured_programmes: parsedFeaturedProgrammes,
      featured_story: featuredStory,
    });
  } catch (error) {
    console.error("Error fetching home settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch home settings" },
      { status: 500 }
    );
  }
}

// ─── POST /api/home-settings ───
export async function POST(request: NextRequest) {
  try {
    // Simple API key check
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== "NawiriCMS2024") {
      return NextResponse.json(
        { error: "Unauthorized: Invalid API key" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Stringify stats if it's an array
    const data: Record<string, unknown> = { ...body };
    if (Array.isArray(data.stats)) {
      data.stats = JSON.stringify(data.stats);
    }

    // Stringify home_featured_programmes if it's an array
    if (Array.isArray(data.home_featured_programmes)) {
      data.home_featured_programmes = JSON.stringify(
        data.home_featured_programmes
      );
    }

    const updated = await db.homeSettings.upsert({
      where: { id: "main" },
      update: data,
      create: { id: "main", ...data },
    });

    // Return with parsed JSON fields
    let parsedStats: unknown[] = [];
    try {
      parsedStats = JSON.parse(updated.stats);
    } catch {
      parsedStats = [];
    }

    let parsedFeaturedProgrammes: unknown[] = [];
    try {
      parsedFeaturedProgrammes = JSON.parse(updated.home_featured_programmes);
    } catch {
      parsedFeaturedProgrammes = [];
    }

    return NextResponse.json({
      ...updated,
      stats: parsedStats,
      home_featured_programmes: parsedFeaturedProgrammes,
    });
  } catch (error) {
    console.error("Error updating home settings:", error);
    return NextResponse.json(
      { error: "Failed to update home settings" },
      { status: 500 }
    );
  }
}
