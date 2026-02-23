import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, phone } = body;

    // Build update object
    const updateData: { name?: string; phone?: string; updatedAt: Date } = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        return NextResponse.json(
          { error: "Name is required" },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (phone !== undefined) {
      if (!phone || phone.trim().length === 0) {
        return NextResponse.json(
          { error: "Phone is required" },
          { status: 400 }
        );
      }
      updateData.phone = phone.trim();
    }

    // Update user
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, user.id));

    // Get updated user
    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    return NextResponse.json({ user: updatedUser[0] });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
