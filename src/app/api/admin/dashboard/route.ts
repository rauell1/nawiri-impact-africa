import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-api";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const authError = await requireAdminAuth(request as Parameters<typeof requireAdminAuth>[0]);
  if (authError) return authError;

  try {
    const [
      programmes,
      stories,
      blogPosts,
      reports,
      careers,
      teamMembers,
      partners,
      contacts,
    ] = await Promise.all([
      db.programme.count(),
      db.story.count(),
      db.blogPost.count(),
      db.report.count(),
      db.career.count(),
      db.teamMember.count(),
      db.partner.count(),
      db.contactSubmission.count(),
    ]);

    const [publishedProgrammes, publishedBlog, openCareers] = await Promise.all([
      db.programme.count({ where: { status: "published" } }),
      db.blogPost.count({ where: { status: "published" } }),
      db.career.count({ where: { status: "open" } }),
    ]);

    const recentContacts = await db.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      stats: {
        programmes,
        stories,
        blogPosts,
        reports,
        careers,
        teamMembers,
        partners,
        contacts,
        publishedProgrammes,
        publishedBlog,
        openCareers,
      },
      recentContacts,
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
