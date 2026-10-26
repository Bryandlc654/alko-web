import type { NextRequest } from "next/server";

/** IP del visitante. Tras Cloudflare/Render, `cf-connecting-ip` no se puede falsificar. */
export function clientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "desconocida"
  );
}

/** Rechaza peticiones desde otros sitios web (los navegadores envían `Origin`). */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // sin Origin (curl, servidores): lo frena el límite por IP
  try {
    const host = new URL(origin).host;
    const own = [req.headers.get("host"), req.headers.get("x-forwarded-host")];
    return own.some((value) => value && value.split(",")[0].trim() === host);
  } catch {
    return false;
  }
}
