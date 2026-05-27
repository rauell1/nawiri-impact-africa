import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { validateSession, getSessionCookieName } from "@/lib/admin-auth";
import { cookies } from "next/headers";

/**
 * API route to securely handle image uploads from the CMS backend.
 * Saves files locally inside public/uploads and returns the accessible web path.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verify admin session cookie
    const cookieStore = await cookies();
    const token = cookieStore.get(getSessionCookieName())?.value;
    if (!token || !(await validateSession(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Create buffer and define safe pathways
    const buffer = Buffer.from(await file.arrayBuffer());
    
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure the public/uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Sanitize filename to prevent collisions or directory traversal
    const safeName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .toLowerCase();
    
    const uniqueName = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadsDir, uniqueName);
    
    // Write buffer directly to disk
    fs.writeFileSync(filePath, buffer);
    
    // 4. Return the accessible web URL path
    const publicUrl = `/uploads/${uniqueName}`;
    
    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (error) {
    console.error("Upload API crash:", error);
    return NextResponse.json(
      { error: "Image file upload failed" },
      { status: 500 }
    );
  }
}
