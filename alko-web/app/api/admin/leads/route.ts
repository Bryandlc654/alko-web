import { NextResponse } from "next/server";
import { getDbLeads, updateDbLead, deleteDbLead } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!hasPermission(session, "leads")) {
    return NextResponse.json({ error: "Acceso denegado: permiso requerido 'leads'" }, { status: 403 });
  }

  const leads = await getDbLeads();
  return NextResponse.json(leads);
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!hasPermission(session, "leads")) {
    return NextResponse.json({ error: "Acceso denegado: permiso requerido 'leads'" }, { status: 403 });
  }

  try {
    const { id, estado, notas } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const updates: any = {};
    if (estado !== undefined) updates.estado = estado;
    if (notas !== undefined) updates.notas = notas;

    const success = await updateDbLead(id, updates);
    if (!success) {
      return NextResponse.json({ error: "No se encontró el lead" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error al actualizar lead" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!hasPermission(session, "leads")) {
    return NextResponse.json({ error: "Acceso denegado: permiso requerido 'leads'" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const success = await deleteDbLead(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error al eliminar lead" },
      { status: 500 }
    );
  }
}
