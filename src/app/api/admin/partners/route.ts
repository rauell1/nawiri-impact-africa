import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-api";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const authError = await requireAdminAuth(request as unknown as NextRequest);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const where: Record<string, unknown> = status && status !== "all" ? { status } : {};

    const partners = await db.partner.findMany({
      where,
      orderBy: { sort_order: "asc" },
    });

    return NextResponse.json(partners);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    if (!body.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const partner = await db.partner.create({ data: body });
    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
