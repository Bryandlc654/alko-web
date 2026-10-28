import { cookies } from "next/headers";

const SECRET = process.env.ADMIN_JWT_SECRET || "alko-reformas-super-secret-jwt-key-2026-production";
export const COOKIE_NAME = "alko_admin_session";

export interface AdminUser {
  id: number | string;
  username: string;
  name: string;
  email: string;
  role: string;
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  // Convert ArrayBuffer to base64url
  const bytes = new Uint8Array(signature);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createSession(user: AdminUser) {
  const payload = JSON.stringify({
    ...user,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  const encodedPayload = btoa(payload).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const sig = await hmacSign(encodedPayload, SECRET);
  const token = `${encodedPayload}.${sig}`;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    path: "/",
  });

  return token;
}

export async function getSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  return verifyToken(token);
}

export async function verifyToken(token: string): Promise<AdminUser | null> {
  try {
    const [encodedPayload, sig] = token.split(".");
    if (!encodedPayload || !sig) return null;

    const expectedSig = await hmacSign(encodedPayload, SECRET);
    if (sig !== expectedSig) return null;

    // Decode base64url payload
    const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = atob(base64);
    const data = JSON.parse(jsonStr);

    if (data.exp && Date.now() > data.exp) {
      return null;
    }

    return {
      id: data.id,
      username: data.username,
      name: data.name,
      email: data.email,
      role: data.role || "admin",
    };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
