import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (token) {
      await deleteSession(token);
    }

    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session_token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
