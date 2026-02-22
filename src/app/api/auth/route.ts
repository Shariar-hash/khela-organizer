import { NextRequest, NextResponse } from "next/server";
import { createOTP, getOrCreateUser, createSession, verifyOTP } from "@/lib/auth";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, name, otp, action } = body;

    // Step 1: Send OTP
    if (action === "send_otp") {
      if (!phone) {
        return NextResponse.json(
          { error: "Phone number is required" },
          { status: 400 }
        );
      }

      const otpCode = await createOTP(phone);
      
      // In production, send OTP via SMS service
      // For demo, we'll return it (remove in production!)
      console.log(`OTP for ${phone}: ${otpCode}`);

      return NextResponse.json({
        success: true,
        message: "OTP sent successfully",
        // Remove the line below in production
        debug_otp: otpCode,
      });
    }

    // Step 2: Verify OTP and login/signup
    if (action === "verify_otp") {
      if (!phone || !otp) {
        return NextResponse.json(
          { error: "Phone and OTP are required" },
          { status: 400 }
        );
      }

      const isValid = await verifyOTP(phone, otp);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid or expired OTP" },
          { status: 400 }
        );
      }

      // Check if user exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.phone, phone))
        .limit(1);

      if (existingUser.length > 0) {
        // Login existing user
        const user = existingUser[0];
        const sessionToken = await createSession(user.id);

        const response = NextResponse.json({
          success: true,
          user,
          isNewUser: false,
        });

        response.cookies.set("session_token", sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/",
        });

        return response;
      }

      // New user - need name for signup
      if (!name) {
        return NextResponse.json({
          success: true,
          requiresName: true,
          message: "Please provide your name to complete signup",
        });
      }

      // Create new user
      const user = await getOrCreateUser(phone, name);
      const sessionToken = await createSession(user.id);

      const response = NextResponse.json({
        success: true,
        user,
        isNewUser: true,
      });

      response.cookies.set("session_token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
