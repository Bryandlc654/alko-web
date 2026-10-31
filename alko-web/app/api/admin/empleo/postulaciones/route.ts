import { NextResponse } from "next/server";
import {
  getDbJobApplications,
  updateDbJobApplicationStatus,
  deleteDbJobApplication,
} from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/server-session";
import { hasPermission } from "@/lib/auth/rbac";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!hasPermission(session, "empleo")) {
    return NextResponse.json({ error: "Acceso denegado: permiso requerido 'empleo'" }, { status: 403 });
  }

  const applications = await getDbJobApplications();
  return NextResponse.json(applications);
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!hasPermission(session, "empleo")) {
    return NextResponse.json({ error: "Acceso denegado: permiso requerido 'empleo'" }, { status: 403 });
  }

  try {
    const { id, estado } = await req.json();
    if (!id || !estado) {
      return NextResponse.json({ error: "ID y estado son requeridos" }, { status: 400 });
    }

    const success = await updateDbJobApplicationStatus(id, estado);
    if (!success) {
      return NextResponse.json({ error: "No se encontró la postulación" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error al actualizar estado" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!hasPermission(session, "empleo")) {
    return NextResponse.json({ error: "Acceso denegado: permiso requerido 'empleo'" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const success = await deleteDbJobApplication(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error al eliminar postulación" }, { status: 500 });
  }
}
