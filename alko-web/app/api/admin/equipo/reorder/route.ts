import { NextResponse } from "next/server";
import { reorderDbTeamMembers } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/server-session";
import { hasPermission } from "@/lib/auth/rbac";

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!hasPermission(session, "equipo")) {
    return NextResponse.json({ error: "Acceso denegado: permiso requerido 'equipo'" }, { status: 403 });
  }

  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: "Lista de IDs requerida" }, { status: 400 });
    }

    const updatedList = await reorderDbTeamMembers(ids);
    return NextResponse.json({ success: true, miembros: updatedList });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error al reordenar equipo" },
      { status: 500 }
    );
  }
}
