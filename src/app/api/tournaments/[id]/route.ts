import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, tournaments, tournamentAdmins, tournamentPlayers, teams, teamMembers, announcements, users, playerCategories } from "@/lib/db";
import { eq, and, inArray } from "drizzle-orm";

// Get tournament details - OPTIMIZED
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

    // Run all queries in parallel for better performance
    const [
      tournamentResult,
      isPlayerResult,
      adminsResult,
      playersResult,
      tournamentTeamsResult,
      announcementsResult,
      categoriesResult,
    ] = await Promise.all([
      // Get tournament
      db.select().from(tournaments).where(eq(tournaments.id, id)).limit(1),
      // Check if user has access
      db.select().from(tournamentPlayers).where(
        and(
          eq(tournamentPlayers.tournamentId, id),
          eq(tournamentPlayers.userId, user.id)
        )
      ).limit(1),
      // Get admins
      db.select({ admin: tournamentAdmins, user: users })
        .from(tournamentAdmins)
        .innerJoin(users, eq(tournamentAdmins.userId, users.id))
        .where(eq(tournamentAdmins.tournamentId, id)),
      // Get players
      db.select({ player: tournamentPlayers, user: users })
        .from(tournamentPlayers)
        .innerJoin(users, eq(tournamentPlayers.userId, users.id))
        .where(eq(tournamentPlayers.tournamentId, id)),
      // Get teams
      db.select().from(teams).where(eq(teams.tournamentId, id)),
      // Get announcements
      db.select({ announcement: announcements, author: users })
        .from(announcements)
        .innerJoin(users, eq(announcements.authorId, users.id))
        .where(eq(announcements.tournamentId, id))
        .orderBy(announcements.createdAt),
      // Get categories
      db.select().from(playerCategories).where(eq(playerCategories.tournamentId, id)),
    ]);

    if (tournamentResult.length === 0) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    if (isPlayerResult.length === 0) {
      return NextResponse.json({ error: "You don't have access to this tournament" }, { status: 403 });
    }

    // Get all team members in one query if there are teams
    let teamsWithMembers: Array<typeof tournamentTeamsResult[0] & { members: Array<{ member: typeof teamMembers.$inferSelect; player: typeof tournamentPlayers.$inferSelect; user: typeof users.$inferSelect }> }> = [];
    if (tournamentTeamsResult.length > 0) {
      const teamIds = tournamentTeamsResult.map(t => t.id);
      const allMembers = await db
        .select({
          member: teamMembers,
          player: tournamentPlayers,
          user: users,
        })
        .from(teamMembers)
        .innerJoin(tournamentPlayers, eq(teamMembers.playerId, tournamentPlayers.id))
        .innerJoin(users, eq(tournamentPlayers.userId, users.id))
        .where(inArray(teamMembers.teamId, teamIds));

      // Group members by team
      const membersByTeam = new Map<string, typeof allMembers>();
      allMembers.forEach(m => {
        const teamId = m.member.teamId;
        if (!membersByTeam.has(teamId)) {
          membersByTeam.set(teamId, []);
        }
        membersByTeam.get(teamId)!.push(m);
      });

      teamsWithMembers = tournamentTeamsResult.map(team => ({
        ...team,
        members: membersByTeam.get(team.id) || [],
      }));
    }

    // Check if current user is admin
    const isAdmin = adminsResult.some(a => a.user.id === user.id);

    return NextResponse.json({
      tournament: tournamentResult[0],
      admins: adminsResult.map(a => ({ ...a.admin, user: a.user })),
      players: playersResult.map(p => ({ ...p.player, user: p.user })),
      teams: teamsWithMembers,
      announcements: announcementsResult.map(a => ({ ...a.announcement, author: a.author })),
      categories: categoriesResult,
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
