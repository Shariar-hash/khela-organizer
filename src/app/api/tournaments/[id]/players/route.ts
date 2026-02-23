import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, tournamentAdmins, tournamentPlayers, teamMembers, users } from "@/lib/db";
import { eq, and } from "drizzle-orm";

// Add manual player (admin only)
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
    const { name, phone } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Player name is required" }, { status: 400 });
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

    // Create manual player (no userId)
    const newPlayer = await db
      .insert(tournamentPlayers)
      .values({
        tournamentId: id,
        name: name.trim(),
        phone: phone?.trim() || null,
      })
      .returning();

    // Return player with mock user object for consistency
    return NextResponse.json({
      success: true,
      player: {
        ...newPlayer[0],
        user: {
          id: newPlayer[0].id,
          name: newPlayer[0].name,
          phone: newPlayer[0].phone || "",
          avatarUrl: null,
        },
        isManualPlayer: true,
      },
    });
  } catch (error) {
    console.error("Add manual player error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Update player (category by admin, or name/phone by self or admin)
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
    const { playerId, category, name, phone } = body;

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

    const isAdmin = admin.length > 0;

    // Get the player
    const player = await db
      .select()
      .from(tournamentPlayers)
      .where(eq(tournamentPlayers.id, playerId))
      .limit(1);

    if (player.length === 0) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Check authorization:
    // - Admin can update category, name, and phone
    // - Player can only update their own name
    const isSelf = player[0].userId ? player[0].userId === user.id : false;
    
    if (!isAdmin && !isSelf) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // If not admin and trying to change category or phone, deny
    if (!isAdmin && category !== undefined) {
      return NextResponse.json({ error: "Only admins can change category" }, { status: 403 });
    }
    if (!isAdmin && phone !== undefined) {
      return NextResponse.json({ error: "Only admins can change phone" }, { status: 403 });
    }

    // Update player category if admin
    if (isAdmin && category !== undefined) {
      await db
        .update(tournamentPlayers)
        .set({ category })
        .where(eq(tournamentPlayers.id, playerId));
    }

    // Update name - handle both regular and manual players
    if (name && (isSelf || isAdmin)) {
      if (player[0].userId) {
        // Regular player - update users table
        await db
          .update(users)
          .set({ name, updatedAt: new Date() })
          .where(eq(users.id, player[0].userId));
      } else {
        // Manual player - update tournamentPlayers table directly
        await db
          .update(tournamentPlayers)
          .set({ name })
          .where(eq(tournamentPlayers.id, playerId));
      }
    }

    // Update phone - admin only, handle both regular and manual players
    if (phone && isAdmin) {
      if (player[0].userId) {
        // Regular player - update users table
        await db
          .update(users)
          .set({ phone, updatedAt: new Date() })
          .where(eq(users.id, player[0].userId));
      } else {
        // Manual player - update tournamentPlayers table directly
        await db
          .update(tournamentPlayers)
          .set({ phone })
          .where(eq(tournamentPlayers.id, playerId));
      }
    }

    // Get updated player info
    const updatedPlayer = await db
      .select({
        player: tournamentPlayers,
        user: users,
      })
      .from(tournamentPlayers)
      .leftJoin(users, eq(tournamentPlayers.userId, users.id))
      .where(eq(tournamentPlayers.id, playerId))
      .limit(1);

    // Handle manual player response
    const playerData = updatedPlayer[0];
    const responsePlayer = {
      ...playerData.player,
      user: playerData.user ? playerData.user : {
        id: playerData.player.id,
        name: playerData.player.name || "Unknown",
        phone: playerData.player.phone || "",
        avatarUrl: null,
      },
      isManualPlayer: !playerData.player.userId,
    };

    return NextResponse.json({
      success: true,
      player: responsePlayer,
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

    // Check if player is creator - can't remove creator (only for registered players)
    if (player[0].userId) {
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
    }

    // Remove from any teams first
    await db
      .delete(teamMembers)
      .where(eq(teamMembers.playerId, playerId));

    // Remove admin status if any (only for registered players)
    if (player[0].userId) {
      await db
        .delete(tournamentAdmins)
        .where(
          and(
            eq(tournamentAdmins.tournamentId, id),
            eq(tournamentAdmins.userId, player[0].userId)
          )
        );
    }

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
