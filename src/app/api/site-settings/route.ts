import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── GET /api/site-settings ───
export async function GET() {
  try {
    const settings = await db.siteSettings.findUnique({
      where: { id: "main" },
    });

    if (!settings) {
      return NextResponse.json(
        { error: "Site settings not found" },
        { status: 404 }
      );
    }

    // Parse footer_links from JSON string to array
    let parsedFooterLinks: unknown[] = [];
    try {
      parsedFooterLinks = JSON.parse(settings.footer_links);
    } catch {
      parsedFooterLinks = [];
    }

    return NextResponse.json({
      ...settings,
      footer_links: parsedFooterLinks,
    });
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}

// ─── POST /api/site-settings ───
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

    // Stringify footer_links if it's an array
    const data: Record<string, unknown> = { ...body };
    if (Array.isArray(data.footer_links)) {
      data.footer_links = JSON.stringify(data.footer_links);
    }

    const updated = await db.siteSettings.upsert({
      where: { id: "main" },
      update: data,
      create: { id: "main", ...data },
    });

    // Return with parsed footer_links
    let parsedFooterLinks: unknown[] = [];
    try {
      parsedFooterLinks = JSON.parse(updated.footer_links);
    } catch {
      parsedFooterLinks = [];
    }

    return NextResponse.json({
      ...updated,
      footer_links: parsedFooterLinks,
    });
  } catch (error) {
    console.error("Error updating site settings:", error);
    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 }
    );
  }
}
