import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth, parseJsonField, stringifyJsonField } from "@/lib/admin-api";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const authError = await requireAdminAuth(request as unknown as NextRequest);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = status && status !== "all" ? { status } : {};
    const programmes = await db.programme.findMany({
      where,
      orderBy: { sort_order: "asc" },
    });

    return NextResponse.json(
      programmes.map((p) => ({
        ...p,
        key_activities: parseJsonField(p.key_activities, []),
        gallery_images: parseJsonField(p.gallery_images, []),
      }))
    );
  } catch (error) {
    console.error("Error fetching programmes:", error);
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
    if (Array.isArray(data.key_activities)) data.key_activities = stringifyJsonField(data.key_activities);
    if (Array.isArray(data.gallery_images)) data.gallery_images = stringifyJsonField(data.gallery_images);

    const programme = await db.programme.create({ data: data as Parameters<typeof db.programme.create>[0]["data"] });

    return NextResponse.json(
      { ...programme, key_activities: parseJsonField(programme.key_activities, []), gallery_images: parseJsonField(programme.gallery_images, []) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating programme:", error);
    const msg = error instanceof Error && error.message.includes("Unique") ? "Slug already exists" : "Failed to create";
    return NextResponse.json({ error: msg }, { status: error instanceof Error && error.message.includes("Unique") ? 409 : 500 });
  }
}
