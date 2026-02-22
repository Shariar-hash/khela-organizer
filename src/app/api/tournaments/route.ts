import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, generateTournamentCode } from "@/lib/auth";
import { db, tournaments, tournamentAdmins, tournamentPlayers, teams, teamMembers, announcements } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";

// Get all tournaments for current user
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get tournaments created by user
    const createdTournaments = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.creatorId, user.id))
      .orderBy(desc(tournaments.createdAt));

    // Get tournaments user has joined
    const joinedTournamentIds = await db
      .select({ tournamentId: tournamentPlayers.tournamentId })
      .from(tournamentPlayers)
      .where(eq(tournamentPlayers.userId, user.id));

    const joinedTournaments = await db
      .select()
      .from(tournaments)
      .where(
        and(
          eq(tournaments.isActive, true)
        )
      )
      .orderBy(desc(tournaments.createdAt));

    // Filter joined tournaments
    const joinedIds = new Set(joinedTournamentIds.map(t => t.tournamentId));
    const filteredJoined = joinedTournaments.filter(
      t => joinedIds.has(t.id) && t.creatorId !== user.id
    );

    return NextResponse.json({
      created: createdTournaments,
      joined: filteredJoined,
    });
  } catch (error) {
    console.error("Get tournaments error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Create a new tournament
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, startDate, endDate, maxPlayers } = body;

    if (!name) {
      return NextResponse.json({ error: "Tournament name is required" }, { status: 400 });
    }

    const code = generateTournamentCode();

    // Create tournament
    const newTournament = await db
      .insert(tournaments)
      .values({
        name,
        code,
        description,
        creatorId: user.id,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        maxPlayers: maxPlayers || null,
      })
      .returning();

    // Add creator as admin
    await db.insert(tournamentAdmins).values({
      tournamentId: newTournament[0].id,
      userId: user.id,
      role: "creator",
    });

    // Add creator as player
    await db.insert(tournamentPlayers).values({
      tournamentId: newTournament[0].id,
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      tournament: newTournament[0],
    });
  } catch (error) {
    console.error("Create tournament error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
