import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, tournaments, tournamentAdmins, tournamentPlayers, teams, teamMembers, announcements, users, playerCategories } from "@/lib/db";
import { eq, and } from "drizzle-orm";

// Get tournament details
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

    // Get tournament
    const tournament = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, id))
      .limit(1);

    if (tournament.length === 0) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    // Check if user has access
    const isPlayer = await db
      .select()
      .from(tournamentPlayers)
      .where(
        and(
          eq(tournamentPlayers.tournamentId, id),
          eq(tournamentPlayers.userId, user.id)
        )
      )
      .limit(1);

    if (isPlayer.length === 0) {
      return NextResponse.json({ error: "You don't have access to this tournament" }, { status: 403 });
    }

    // Get admins
    const admins = await db
      .select({
        admin: tournamentAdmins,
        user: users,
      })
      .from(tournamentAdmins)
      .innerJoin(users, eq(tournamentAdmins.userId, users.id))
      .where(eq(tournamentAdmins.tournamentId, id));

    // Get players
    const players = await db
      .select({
        player: tournamentPlayers,
        user: users,
      })
      .from(tournamentPlayers)
      .innerJoin(users, eq(tournamentPlayers.userId, users.id))
      .where(eq(tournamentPlayers.tournamentId, id));

    // Get teams with members
    const tournamentTeams = await db
      .select()
      .from(teams)
      .where(eq(teams.tournamentId, id));

    const teamsWithMembers = await Promise.all(
      tournamentTeams.map(async (team) => {
        const members = await db
          .select({
            member: teamMembers,
            player: tournamentPlayers,
            user: users,
          })
          .from(teamMembers)
          .innerJoin(tournamentPlayers, eq(teamMembers.playerId, tournamentPlayers.id))
          .innerJoin(users, eq(tournamentPlayers.userId, users.id))
          .where(eq(teamMembers.teamId, team.id));

        return {
          ...team,
          members,
        };
      })
    );

    // Get announcements
    const tournamentAnnouncements = await db
      .select({
        announcement: announcements,
        author: users,
      })
      .from(announcements)
      .innerJoin(users, eq(announcements.authorId, users.id))
      .where(eq(announcements.tournamentId, id))
      .orderBy(announcements.createdAt);

    // Get categories
    const categories = await db
      .select()
      .from(playerCategories)
      .where(eq(playerCategories.tournamentId, id));

    // Check if current user is admin
    const isAdmin = admins.some(a => a.user.id === user.id);

    return NextResponse.json({
      tournament: tournament[0],
      admins: admins.map(a => ({ ...a.admin, user: a.user })),
      players: players.map(p => ({ ...p.player, user: p.user })),
      teams: teamsWithMembers,
      announcements: tournamentAnnouncements.map(a => ({ ...a.announcement, author: a.author })),
      categories,
      isAdmin,
      currentUserId: user.id,
    });
  } catch (error) {
    console.error("Get tournament error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Update tournament
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

    const { name, description, logoUrl, startDate, endDate, maxPlayers, isActive } = body;

    const updatedTournament = await db
      .update(tournaments)
      .set({
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(maxPlayers !== undefined && { maxPlayers }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date(),
      })
      .where(eq(tournaments.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      tournament: updatedTournament[0],
    });
  } catch (error) {
    console.error("Update tournament error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
