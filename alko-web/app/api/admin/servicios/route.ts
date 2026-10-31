import { NextResponse } from "next/server";
import { getDbSectors, saveDbSector, deleteDbSector } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/server-session";
import { hasPermission } from "@/lib/auth/rbac";

export async function GET() {
  const sectors = await getDbSectors();
  return NextResponse.json(sectors);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!hasPermission(session, "servicios")) {
    return NextResponse.json({ error: "Acceso denegado: permiso requerido 'servicios'" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const saved = await saveDbSector(body);
    return NextResponse.json({ success: true, sector: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error guardando servicio" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!hasPermission(session, "servicios")) {
    return NextResponse.json({ error: "Acceso denegado: permiso requerido 'servicios'" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID de servicio requerido" }, { status: 400 });
    }

    const success = await deleteDbSector(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error eliminando servicio" }, { status: 500 });
  }
}
