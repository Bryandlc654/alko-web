import { NextResponse } from "next/server";
import { destroySession, COOKIE_NAME } from "@/lib/auth/session";

export async function POST() {
  await destroySession();
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    maxAge: 0,
    path: "/",
  });
  return res;
}
