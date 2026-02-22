import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, tournamentAdmins, playerCategories } from "@/lib/db";
import { eq, and } from "drizzle-orm";

// Create category
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
    const { name, description, minPerTeam, maxPerTeam, color } = body;

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
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const newCategory = await db
      .insert(playerCategories)
      .values({
        tournamentId: id,
        name,
        description,
        minPerTeam: minPerTeam || 0,
        maxPerTeam,
        color,
      })
      .returning();

    return NextResponse.json({
      success: true,
      category: newCategory[0],
    });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Delete category
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
    const categoryId = searchParams.get("categoryId");

    if (!categoryId) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
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
      .delete(playerCategories)
      .where(eq(playerCategories.id, categoryId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
