import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, tournamentAdmins, tournamentPlayers, teamMembers } from "@/lib/db";
import { eq, and } from "drizzle-orm";

// Update player category
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
    const { playerId, category } = body;

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

    const updatedPlayer = await db
      .update(tournamentPlayers)
      .set({ category })
      .where(eq(tournamentPlayers.id, playerId))
      .returning();

    return NextResponse.json({
      success: true,
      player: updatedPlayer[0],
    });
  } catch (error) {
    console.error("Update player error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Remove player from tournament
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
    const playerId = searchParams.get("playerId");

    if (!playerId) {
      return NextResponse.json({ error: "Player ID is required" }, { status: 400 });
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

    // Get player
    const player = await db
      .select()
      .from(tournamentPlayers)
      .where(eq(tournamentPlayers.id, playerId))
      .limit(1);

    if (player.length === 0) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Check if player is creator - can't remove creator
    const isCreator = await db
      .select()
      .from(tournamentAdmins)
      .where(
        and(
          eq(tournamentAdmins.tournamentId, id),
          eq(tournamentAdmins.userId, player[0].userId),
          eq(tournamentAdmins.role, "creator")
        )
      )
      .limit(1);

    if (isCreator.length > 0) {
      return NextResponse.json({ error: "Cannot remove tournament creator" }, { status: 400 });
    }

    // Remove from any teams first
    await db
      .delete(teamMembers)
      .where(eq(teamMembers.playerId, playerId));

    // Remove admin status if any
    await db
      .delete(tournamentAdmins)
      .where(
        and(
          eq(tournamentAdmins.tournamentId, id),
          eq(tournamentAdmins.userId, player[0].userId)
        )
      );

    // Remove from tournament
    await db
      .delete(tournamentPlayers)
      .where(eq(tournamentPlayers.id, playerId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove player error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
