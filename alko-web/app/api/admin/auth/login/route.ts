import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDbPool, getDbUserForAuth, saveDbUser } from "@/lib/db/mysql";
import { createSession } from "@/lib/auth/session";
import { ROLE_DEFINITIONS } from "@/lib/auth/rbac";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña requeridos" },
        { status: 400 }
      );
    }

    let authenticatedUser: any = null;

    // 1. Buscar primero en la base de datos de usuarios administradores RBAC
    const storedUser = await getDbUserForAuth(username);
    if (storedUser) {
      if (storedUser.active === false) {
        return NextResponse.json(
          { error: "Tu cuenta ha sido desactivada por un administrador" },
          { status: 403 }
        );
      }

      // Validar contraseña si tiene hash
      if (storedUser.password_hash) {
        const isValid = await bcrypt.compare(password, storedUser.password_hash);
        if (isValid) {
          const roleDef = ROLE_DEFINITIONS[storedUser.role as keyof typeof ROLE_DEFINITIONS];
          const permissions = storedUser.permissions || (roleDef ? roleDef.permissions : []);

          authenticatedUser = {
            id: storedUser.id,
            username: storedUser.username,
            name: storedUser.name,
            email: storedUser.email,
            role: storedUser.role,
            permissions,
          };

          // Actualizar último login
          saveDbUser({ id: storedUser.id, last_login: new Date().toISOString() }).catch(() => {});
        }
      } else if (storedUser.username === "admin" && password === "alko2026!") {
        // Inicializar contraseña por defecto para el superadmin
        const hash = await bcrypt.hash("alko2026!", 10);
        saveDbUser({ id: storedUser.id, password_hash: hash, last_login: new Date().toISOString() }).catch(() => {});

        authenticatedUser = {
          id: storedUser.id,
          username: storedUser.username,
          name: storedUser.name,
          email: storedUser.email,
          role: "superadmin",
          permissions: ROLE_DEFINITIONS.superadmin.permissions,
        };
      }
    }

    // 2. Fallback de administrador si la BD aún no tiene usuarios
    if (!authenticatedUser && username === "admin" && password === "alko2026!") {
      authenticatedUser = {
        id: 1,
        username: "admin",
        name: "Administrador ALKO",
        email: "admin@alkoreformas.com",
        role: "superadmin",
        permissions: ROLE_DEFINITIONS.superadmin.permissions,
      };
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    // Crear sesión HTTP-only con datos de usuario y permisos RBAC
    await createSession(authenticatedUser);

    return NextResponse.json({
      success: true,
      user: {
        username: authenticatedUser.username,
        name: authenticatedUser.name,
        email: authenticatedUser.email,
        role: authenticatedUser.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error en el servidor: " + err.message },
      { status: 500 }
    );
  }
}
