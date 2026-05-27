import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth, slugify } from "@/lib/admin-api";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const authError = await requireAdminAuth(request as unknown as NextRequest);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const where: Record<string, unknown> = status && status !== "all" ? { status } : {};

    const posts = await db.blogPost.findMany({
      where,
      orderBy: { published_date: "desc" },
    });

    return NextResponse.json(posts);
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
    if (!data.slug) data.slug = slugify(body.title);
    if (data.published_date) data.published_date = new Date(data.published_date as string);
    else data.published_date = new Date();

    const post = await db.blogPost.create({ data: data as Parameters<typeof db.blogPost.create>[0]["data"] });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error && error.message.includes("Unique") ? "Slug already exists" : "Failed to create";
    return NextResponse.json({ error: msg }, { status: error instanceof Error && error.message.includes("Unique") ? 409 : 500 });
  }
}
