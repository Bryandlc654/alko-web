import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDbContactoPageContent, saveDbContactoPageContent } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/server-session";
import { hasPermission } from "@/lib/auth/rbac";

export async function GET() {
  const content = await getDbContactoPageContent();
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
    const updated = await saveDbContactoPageContent(body);

    revalidatePath("/contacto");
    revalidatePath("/admin/editor");

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error guardando contenido de contacto: " + err.message },
      { status: 500 }
    );
  }
}
