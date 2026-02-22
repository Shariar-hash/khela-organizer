import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, tournamentAdmins, announcements, users } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";

// Get announcements
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;

    const tournamentAnnouncements = await db
      .select({
        announcement: announcements,
        author: users,
      })
      .from(announcements)
      .innerJoin(users, eq(announcements.authorId, users.id))
      .where(eq(announcements.tournamentId, id))
      .orderBy(desc(announcements.createdAt));

    return NextResponse.json({
      announcements: tournamentAnnouncements.map(a => ({
        ...a.announcement,
        author: a.author,
      })),
    });
  } catch (error) {
    console.error("Get announcements error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Create announcement
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, content, type, imageUrl, isPinned } = body;

    // Check if user is admin
    const admin = await db
      .select()
      .from(tournamentAdmins)
      .where(
        and(
          eq(tournamentAdmins.tournamentId, id),
          eq(tournamentAdmins.userId, user.id)
        )
      )
      .limit(1);

    if (admin.length === 0) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const newAnnouncement = await db
      .insert(announcements)
      .values({
        tournamentId: id,
        authorId: user.id,
        title,
        content,
        type: type || "announcement",
        imageUrl,
        isPinned: isPinned || false,
      })
      .returning();

    return NextResponse.json({
      success: true,
      announcement: {
        ...newAnnouncement[0],
        author: user,
      },
    });
  } catch (error) {
    console.error("Create announcement error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Update announcement
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { announcementId, title, content, type, imageUrl, isPinned } = body;

    // Check if user is admin
    const admin = await db
      .select()
      .from(tournamentAdmins)
      .where(
        and(
          eq(tournamentAdmins.tournamentId, id),
          eq(tournamentAdmins.userId, user.id)
        )
      )
      .limit(1);

    if (admin.length === 0) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const updatedAnnouncement = await db
      .update(announcements)
      .set({
        ...(title && { title }),
        ...(content && { content }),
        ...(type && { type }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isPinned !== undefined && { isPinned }),
        updatedAt: new Date(),
      })
      .where(eq(announcements.id, announcementId))
      .returning();

    return NextResponse.json({
      success: true,
      announcement: updatedAnnouncement[0],
    });
  } catch (error) {
    console.error("Update announcement error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Delete announcement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const announcementId = searchParams.get("announcementId");

    if (!announcementId) {
      return NextResponse.json({ error: "Announcement ID is required" }, { status: 400 });
    }

    // Check if user is admin
    const admin = await db
      .select()
      .from(tournamentAdmins)
      .where(
        and(
          eq(tournamentAdmins.tournamentId, id),
          eq(tournamentAdmins.userId, user.id)
        )
      )
      .limit(1);

    if (admin.length === 0) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await db
      .delete(announcements)
      .where(eq(announcements.id, announcementId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete announcement error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
