import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── POST /api/home-settings/reorder-stats ───
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

    if (!Array.isArray(body.stats)) {
      return NextResponse.json(
        { error: "Invalid request: 'stats' must be an array" },
        { status: 400 }
      );
    }

    const updated = await db.homeSettings.upsert({
      where: { id: "main" },
      update: {
        stats: JSON.stringify(body.stats),
      },
      create: {
        id: "main",
        stats: JSON.stringify(body.stats),
      },
    });

    let parsedStats: unknown[] = [];
    try {
      parsedStats = JSON.parse(updated.stats);
    } catch {
      parsedStats = [];
    }

    return NextResponse.json({
      ...updated,
      stats: parsedStats,
    });
  } catch (error) {
    console.error("Error reordering stats:", error);
    return NextResponse.json(
      { error: "Failed to reorder stats" },
      { status: 500 }
    );
  }
}
