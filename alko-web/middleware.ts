import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/auth/session";
import { hasPermission, type Permission } from "@/lib/auth/rbac";

const PATH_PERMISSION_MAP: Record<string, Permission> = {
  "/admin/editor": "editor",
  "/admin/proyectos": "proyectos",
  "/admin/servicios": "servicios",
  "/admin/articulos": "articulos",
  "/admin/guias": "guias",
  "/admin/empleo": "empleo",
  "/admin/equipo": "equipo",
  "/admin/leads": "leads",
  "/admin/ajustes": "ajustes",
  "/admin/usuarios": "usuarios",
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Solo interceptar rutas /admin
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const user = token ? await verifyToken(token) : null;

    // Si está intentando ir a /admin/login
    if (pathname === "/admin/login") {
      if (user) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }

    // Para cualquier otra ruta /admin, exigir sesión válida
    if (!user) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Comprobar control de acceso RBAC por módulo
    for (const [prefix, requiredPermission] of Object.entries(PATH_PERMISSION_MAP)) {
      if (pathname === prefix || pathname.startsWith(prefix + "/")) {
        if (!hasPermission(user, requiredPermission)) {
          // Si no tiene permiso, redirigir al dashboard con alerta
          const url = new URL("/admin", req.url);
          url.searchParams.set("error", "unauthorized");
          url.searchParams.set("modulo", requiredPermission);
          return NextResponse.redirect(url);
        }
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
