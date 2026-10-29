import { NextResponse } from "next/server";
import { getDbTeamMembers, saveDbTeamMember, deleteDbTeamMember } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const members = await getDbTeamMembers();
  return NextResponse.json(members);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.nombre || !body.rol) {
      return NextResponse.json(
        { error: "Nombre y cargo/rol son requeridos" },
        { status: 400 }
      );
    }

    const updatedList = await saveDbTeamMember(body);
    return NextResponse.json({ success: true, miembros: updatedList });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error al guardar miembro del equipo" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID de miembro requerido" }, { status: 400 });
    }

    const updatedList = await deleteDbTeamMember(id);
    return NextResponse.json({ success: true, miembros: updatedList });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error al eliminar miembro del equipo" },
      { status: 500 }
    );
  }
}
