import { NextResponse } from "next/server";
import { getDbSettingsFull, saveDbSettings } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/server-session";
import { hasPermission } from "@/lib/auth/rbac";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!hasPermission(session, "ajustes")) {
    return NextResponse.json({ error: "Acceso denegado: permiso requerido 'ajustes'" }, { status: 403 });
  }
  const settings = await getDbSettingsFull();
  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!hasPermission(session, "ajustes")) {
    return NextResponse.json({ error: "Acceso denegado: permiso requerido 'ajustes'" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updated = await saveDbSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error guardando ajustes de la empresa" },
      { status: 500 }
    );
  }
}
