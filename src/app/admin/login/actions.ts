"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";
import { db } from "@/lib/db";

// Simple in-memory throttle against password guessing (per server instance).
const attempts = new Map<string, { count: number; until: number }>();

export async function login(_prev: { error: string }, form: FormData) {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");

  const now = Date.now();
  const a = attempts.get(email);
  if (a && a.count >= 5 && a.until > now) {
    return { error: "Too many attempts. Please wait 15 minutes and try again." };
  }

  const user = await db.adminUser.findUnique({ where: { email } });
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !ok) {
    const count = (a && a.until > now ? a.count : 0) + 1;
    attempts.set(email, { count, until: now + 15 * 60 * 1000 });
    return { error: "Incorrect email or password." };
  }

  attempts.delete(email);
  const token = await createSessionToken({ userId: user.id, email: user.email });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}
