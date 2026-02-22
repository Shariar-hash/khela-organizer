import { nanoid } from "nanoid";
import { db, sessions, users, otpCodes } from "../db";
import { eq, and, gt } from "drizzle-orm";
import { cookies } from "next/headers";

// Generate a 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate a unique tournament code
export function generateTournamentCode(): string {
  return nanoid(8).toUpperCase();
}

// Generate session token
export function generateSessionToken(): string {
  return nanoid(64);
}

// Create OTP for phone number
export async function createOTP(phone: string): Promise<string> {
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

  await db.insert(otpCodes).values({
    phone,
    code,
    expiresAt,
  });

  return code;
}

// Verify OTP
export async function verifyOTP(phone: string, code: string): Promise<boolean> {
  const result = await db
    .select()
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.phone, phone),
        eq(otpCodes.code, code),
        eq(otpCodes.verified, false),
        gt(otpCodes.expiresAt, new Date())
      )
    )
    .limit(1);

  if (result.length === 0) {
    return false;
  }

  // Mark OTP as verified
  await db
    .update(otpCodes)
    .set({ verified: true })
    .where(eq(otpCodes.id, result[0].id));

  return true;
}

// Create session for user
export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await db.insert(sessions).values({
    userId,
    token,
    expiresAt,
  });

  return token;
}

// Get user from session token
export async function getUserFromSession(token: string) {
  const result = await db
    .select({
      user: users,
      session: sessions,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return result[0].user;
}

// Get current user from cookies
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return null;
  }

  return getUserFromSession(token);
}

// Delete session (logout)
export async function deleteSession(token: string) {
  await db.delete(sessions).where(eq(sessions.token, token));
}

// Create or get user by phone
export async function getOrCreateUser(phone: string, name: string) {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.phone, phone))
    .limit(1);

  if (existingUser.length > 0) {
    return existingUser[0];
  }

  const newUser = await db
    .insert(users)
    .values({
      phone,
      name,
    })
    .returning();

  return newUser[0];
}
