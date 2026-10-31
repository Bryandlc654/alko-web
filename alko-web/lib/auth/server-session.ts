import { cookies } from "next/headers";
import { COOKIE_NAME, verifyToken, type AdminUser } from "./session";
import { ROLE_DEFINITIONS, type Permission } from "./rbac";
import { getDbUsers } from "@/lib/db/mysql";

const CACHE_MS = 30_000;
let cache: { at: number; users: Awaited<ReturnType<typeof getDbUsers>> } | null = null;

async function users() {
  if (!cache || Date.now() - cache.at > CACHE_MS) {
    cache = { at: Date.now(), users: await getDbUsers() };
  }
  return cache.users;
}

/**
 * Sesión del servidor (rutas API y páginas del panel). Además de validar la firma del token,
 * comprueba que el usuario siga existiendo y activo, y usa su rol y permisos actuales: así
 * desactivar a alguien o cambiarle permisos surte efecto enseguida (con un retraso máximo de 30 s).
 */
export async function getSession(): Promise<AdminUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifyToken(token);
  if (!session) return null;

  const record = (await users()).find((u) => String(u.id) === String(session.id));
  if (!record || record.active === false) return null;

  const roleDef = ROLE_DEFINITIONS[record.role as keyof typeof ROLE_DEFINITIONS];
  return {
    ...session,
    username: record.username,
    name: record.name,
    email: record.email,
    role: record.role,
    permissions: (record.permissions ?? roleDef?.permissions ?? []) as Permission[],
  };
}
