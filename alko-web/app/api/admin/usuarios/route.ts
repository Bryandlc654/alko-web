import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDbUsers, saveDbUser, deleteDbUser } from "@/lib/db/mysql";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (!hasPermission(session, "usuarios")) {
    return NextResponse.json({ error: "Acceso denegado: se requieren permisos de gestión de usuarios" }, { status: 403 });
  }

  const users = await getDbUsers();
  // Sanitizar respuesta: remover password_hash
  const safeUsers = users.map((u) => {
    const { password_hash, ...rest } = u;
    return rest;
  });

  return NextResponse.json(safeUsers);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (!hasPermission(session, "usuarios")) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, username, name, email, role, permissions, password, active } = body;

    if (!username || !email) {
      return NextResponse.json({ error: "El nombre de usuario y correo son obligatorios" }, { status: 400 });
    }

    const payloadToSave: any = {
      id: id || undefined,
      username: username.trim(),
      name: name?.trim() || username,
      email: email.trim().toLowerCase(),
      role: role || "editor",
      permissions: Array.isArray(permissions) ? permissions : [],
      active: active !== undefined ? Boolean(active) : true,
    };

    if (password && password.trim().length > 0) {
      if (password.length < 6) {
        return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
      }
      payloadToSave.password_hash = await bcrypt.hash(password, 10);
    }

    const saved = await saveDbUser(payloadToSave);
    const { password_hash, ...safeUser } = saved;

    return NextResponse.json({ success: true, user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error al procesar usuario" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (!hasPermission(session, "usuarios")) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 });
    }

    await deleteDbUser(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error al eliminar usuario" }, { status: 400 });
  }
}
