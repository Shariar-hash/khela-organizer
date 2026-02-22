import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, tournamentAdmins, tournamentPlayers, users } from "@/lib/db";
import { eq, and } from "drizzle-orm";

// Add admin
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
    const { userId } = body;

    // Check if current user is admin
    const currentAdmin = await db
      .select()
      .from(tournamentAdmins)
      .where(
        and(
          eq(tournamentAdmins.tournamentId, id),
          eq(tournamentAdmins.userId, user.id)
        )
      )
      .limit(1);

    if (currentAdmin.length === 0) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if target user is a player
    const isPlayer = await db
      .select()
      .from(tournamentPlayers)
      .where(
        and(
          eq(tournamentPlayers.tournamentId, id),
          eq(tournamentPlayers.userId, userId)
        )
      )
      .limit(1);

    if (isPlayer.length === 0) {
      return NextResponse.json({ error: "User is not a player in this tournament" }, { status: 400 });
    }

    // Check if already admin
    const existingAdmin = await db
      .select()
      .from(tournamentAdmins)
      .where(
        and(
          eq(tournamentAdmins.tournamentId, id),
          eq(tournamentAdmins.userId, userId)
        )
      )
      .limit(1);

    if (existingAdmin.length > 0) {
      return NextResponse.json({ error: "User is already an admin" }, { status: 400 });
    }

    // Add as admin
    const newAdmin = await db
      .insert(tournamentAdmins)
      .values({
        tournamentId: id,
        userId,
        role: "admin",
      })
      .returning();

    // Get user info
    const adminUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return NextResponse.json({
      success: true,
      admin: { ...newAdmin[0], user: adminUser[0] },
    });
  } catch (error) {
    console.error("Add admin error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Remove admin
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
    const adminId = searchParams.get("adminId");

    if (!adminId) {
      return NextResponse.json({ error: "Admin ID is required" }, { status: 400 });
    }

    // Check if current user is creator
    const currentAdmin = await db
      .select()
      .from(tournamentAdmins)
      .where(
        and(
          eq(tournamentAdmins.tournamentId, id),
          eq(tournamentAdmins.userId, user.id),
          eq(tournamentAdmins.role, "creator")
        )
      )
      .limit(1);

    if (currentAdmin.length === 0) {
      return NextResponse.json({ error: "Only creator can remove admins" }, { status: 403 });
    }

    // Can't remove creator
    const targetAdmin = await db
      .select()
      .from(tournamentAdmins)
      .where(eq(tournamentAdmins.id, adminId))
      .limit(1);

    if (targetAdmin.length > 0 && targetAdmin[0].role === "creator") {
      return NextResponse.json({ error: "Cannot remove creator" }, { status: 400 });
    }

    await db
      .delete(tournamentAdmins)
      .where(eq(tournamentAdmins.id, adminId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove admin error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
