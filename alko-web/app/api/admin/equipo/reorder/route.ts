import { NextResponse } from "next/server";
import { reorderDbTeamMembers } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/session";

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
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
