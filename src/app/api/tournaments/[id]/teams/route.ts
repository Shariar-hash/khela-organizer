import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, tournamentAdmins, tournamentPlayers, teams, teamMembers, users } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { generateTeamColors, distributePlayersToTeams, distributePlayersByCategoryToTeams } from "@/lib/utils";

// Create team
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
    const { name, color, playerIds } = body;

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

    if (!name) {
      return NextResponse.json({ error: "Team name is required" }, { status: 400 });
    }

    // Create team
    const newTeam = await db
      .insert(teams)
      .values({
        tournamentId: id,
        name,
        color: color || generateTeamColors()[0],
      })
      .returning();

    // Add players if provided
    if (playerIds && playerIds.length > 0) {
      for (const playerId of playerIds) {
        await db.insert(teamMembers).values({
          teamId: newTeam[0].id,
          playerId,
        });
      }
    }

    // Get team with members
    const members = await db
      .select({
        member: teamMembers,
        player: tournamentPlayers,
        user: users,
      })
      .from(teamMembers)
      .innerJoin(tournamentPlayers, eq(teamMembers.playerId, tournamentPlayers.id))
      .innerJoin(users, eq(tournamentPlayers.userId, users.id))
      .where(eq(teamMembers.teamId, newTeam[0].id));

    return NextResponse.json({
      success: true,
      team: {
        ...newTeam[0],
        members,
      },
    });
  } catch (error) {
    console.error("Create team error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Generate random teams
export async function PUT(
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
    const { numberOfTeams, teamNames, useCategories, categoryRules } = body;

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

    if (!numberOfTeams || numberOfTeams < 2) {
      return NextResponse.json({ error: "At least 2 teams required" }, { status: 400 });
    }

    // Get all players
    const players = await db
      .select()
      .from(tournamentPlayers)
      .where(eq(tournamentPlayers.tournamentId, id));

    if (players.length < numberOfTeams) {
      return NextResponse.json({ error: "Not enough players" }, { status: 400 });
    }

    // Delete existing teams
    const existingTeams = await db
      .select()
      .from(teams)
      .where(eq(teams.tournamentId, id));

    for (const team of existingTeams) {
      await db.delete(teamMembers).where(eq(teamMembers.teamId, team.id));
      await db.delete(teams).where(eq(teams.id, team.id));
    }

    // Distribute players
    let distributedPlayers;
    if (useCategories && categoryRules) {
      distributedPlayers = distributePlayersByCategoryToTeams(
        players,
        numberOfTeams,
        categoryRules
      );
    } else {
      distributedPlayers = distributePlayersToTeams(players, numberOfTeams);
    }

    const colors = generateTeamColors();
    const createdTeams = [];

    // Create new teams
    for (let i = 0; i < numberOfTeams; i++) {
      const teamName = teamNames?.[i] || `Team ${i + 1}`;
      const newTeam = await db
        .insert(teams)
        .values({
          tournamentId: id,
          name: teamName,
          color: colors[i % colors.length],
        })
        .returning();

      // Add players to team
      for (const player of distributedPlayers[i]) {
        await db.insert(teamMembers).values({
          teamId: newTeam[0].id,
          playerId: player.id,
        });
      }

      // Get team with members
      const members = await db
        .select({
          member: teamMembers,
          player: tournamentPlayers,
          user: users,
        })
        .from(teamMembers)
        .innerJoin(tournamentPlayers, eq(teamMembers.playerId, tournamentPlayers.id))
        .innerJoin(users, eq(tournamentPlayers.userId, users.id))
        .where(eq(teamMembers.teamId, newTeam[0].id));

      createdTeams.push({
        ...newTeam[0],
        members,
      });
    }

    return NextResponse.json({
      success: true,
      teams: createdTeams,
    });
  } catch (error) {
    console.error("Generate teams error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
