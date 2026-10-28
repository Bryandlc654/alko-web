import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDbPool } from "@/lib/db/mysql";
import { createSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña requeridos" },
        { status: 400 }
      );
    }

    let authenticatedUser = null;

    // 1. Intentar validar en la base de datos MySQL
    try {
      const db = getDbPool();
      const [rows] = await db.execute<any[]>(
        "SELECT id, username, email, name, password_hash, role FROM alko_users WHERE username = ? OR email = ? LIMIT 1",
        [username, username]
      );

      if (rows && rows.length > 0) {
        const user = rows[0];
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (isValid) {
          authenticatedUser = {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role || "admin",
          };
        }
      }
    } catch (dbErr: any) {
      console.warn("Error consultando MySQL:", dbErr.message);
    }

    // 2. Fallback de administrador si la BD aún no está sincronizada
    if (!authenticatedUser && username === "admin" && password === "alko2026!") {
      authenticatedUser = {
        id: 1,
        username: "admin",
        name: "Administrador ALKO",
        email: "admin@alkoreformas.com",
        role: "admin",
      };
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    // Crear sesión HTTP-only
    await createSession(authenticatedUser);

    return NextResponse.json({
      success: true,
      user: {
        username: authenticatedUser.username,
        name: authenticatedUser.name,
        email: authenticatedUser.email,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error en el servidor: " + err.message },
      { status: 500 }
    );
  }
}
