import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── GET /api/programmes ───
export async function GET() {
  try {
    const programmes = await db.programme.findMany({
      where: { status: "published" },
      orderBy: { sort_order: "asc" },
    });

    // Parse JSON string fields for each programme
    const parsed = programmes.map((programme) => {
      let keyActivities: unknown[] = [];
      try {
        keyActivities = JSON.parse(programme.key_activities);
      } catch {
        keyActivities = [];
      }

      let galleryImages: unknown[] = [];
      try {
        galleryImages = JSON.parse(programme.gallery_images);
      } catch {
        galleryImages = [];
      }

      return {
        ...programme,
        key_activities: keyActivities,
        gallery_images: galleryImages,
      };
    });

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error fetching programmes:", error);
    return NextResponse.json(
      { error: "Failed to fetch programmes" },
      { status: 500 }
    );
  }
}

// ─── POST /api/programmes ───
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

    // Validate required fields
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "Missing required fields: title and slug are required" },
        { status: 400 }
      );
    }

    // Stringify JSON fields if they are arrays
    const data: Record<string, unknown> = { ...body };
    if (Array.isArray(data.key_activities)) {
      data.key_activities = JSON.stringify(data.key_activities);
    }
    if (Array.isArray(data.gallery_images)) {
      data.gallery_images = JSON.stringify(data.gallery_images);
    }

    const programme = await db.programme.create({
      data: data as any,
    });

    // Return with parsed JSON fields
    let keyActivities: unknown[] = [];
    try {
      keyActivities = JSON.parse(programme.key_activities);
    } catch {
      keyActivities = [];
    }

    let galleryImages: unknown[] = [];
    try {
      galleryImages = JSON.parse(programme.gallery_images);
    } catch {
      galleryImages = [];
    }

    return NextResponse.json(
      {
        ...programme,
        key_activities: keyActivities,
        gallery_images: galleryImages,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating programme:", error);

    // Handle unique constraint violation on slug
    const message =
      error instanceof Error && error.message.includes("Unique")
        ? "A programme with this slug already exists"
        : "Failed to create programme";

    const status =
      error instanceof Error && error.message.includes("Unique") ? 409 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
