import { NextResponse } from "next/server";
import { getDbGuiasPageContent, saveDbGuiasPageContent } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/server-session";
import { hasPermission } from "@/lib/auth/rbac";

export async function GET() {
  const content = await getDbGuiasPageContent();
  return NextResponse.json(content);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!hasPermission(session, "guias") && !hasPermission(session, "editor")) {
    return NextResponse.json({ error: "Acceso denegado: permisos insuficientes" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updated = await saveDbGuiasPageContent(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al guardar contenido" }, { status: 500 });
  }
}
