import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/revalidate
 * Called by the admin dashboard after every successful save to purge
 * Next.js ISR cache for the affected paths.
 *
 * Body: { paths: string[], secret: string, tags?: string[] }
 */
export async function POST(req: NextRequest) {
  try {
    const { paths, secret, tags } = await req.json();

    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    if (!Array.isArray(paths)) {
      return NextResponse.json(
        { error: "paths must be an array" },
        { status: 400 }
      );
    }

    for (const path of paths) {
      revalidatePath(path, "page");
    }

    if (Array.isArray(tags)) {
      for (const tag of tags) {
        revalidateTag(tag);
      }
    }

    return NextResponse.json({ revalidated: true, paths, tags: tags ?? [] });
  } catch (err) {
    console.error("[revalidate] error:", err);
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}
