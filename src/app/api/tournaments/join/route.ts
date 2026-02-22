import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, tournaments, tournamentPlayers } from "@/lib/db";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: "Tournament code is required" }, { status: 400 });
    }

    // Find tournament by code
    const tournament = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.code, code.toUpperCase()))
      .limit(1);

    if (tournament.length === 0) {
      return NextResponse.json({ error: "Invalid tournament code" }, { status: 404 });
    }

    if (!tournament[0].isActive) {
      return NextResponse.json({ error: "This tournament is no longer active" }, { status: 400 });
    }

    // Check if already joined
    const existingPlayer = await db
      .select()
      .from(tournamentPlayers)
      .where(
        and(
          eq(tournamentPlayers.tournamentId, tournament[0].id),
          eq(tournamentPlayers.userId, user.id)
        )
      )
      .limit(1);

    if (existingPlayer.length > 0) {
      return NextResponse.json({ error: "You have already joined this tournament" }, { status: 400 });
    }

    // Check max players
    if (tournament[0].maxPlayers) {
      const playerCount = await db
        .select()
        .from(tournamentPlayers)
        .where(eq(tournamentPlayers.tournamentId, tournament[0].id));

      if (playerCount.length >= tournament[0].maxPlayers) {
        return NextResponse.json({ error: "Tournament is full" }, { status: 400 });
      }
    }

    // Join tournament
    await db.insert(tournamentPlayers).values({
      tournamentId: tournament[0].id,
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      tournament: tournament[0],
    });
  } catch (error) {
    console.error("Join tournament error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
