import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDbHomeContent, saveDbHomeContent } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/server-session";
import { hasPermission } from "@/lib/auth/rbac";

export async function GET() {
  const content = await getDbHomeContent();
  return NextResponse.json(content);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!hasPermission(session, "editor")) {
    return NextResponse.json({ error: "Acceso denegado: permiso requerido 'editor'" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updated = await saveDbHomeContent(body);

    // Revalidar inmediatamente la página principal en Next.js
    revalidatePath("/");

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error guardando contenido: " + err.message },
      { status: 500 }
    );
  }
}
