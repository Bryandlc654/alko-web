import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getShowcaseProjectId, saveShowcaseProjectId } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/server-session";
import { hasPermission } from "@/lib/auth/rbac";

export async function GET() {
  return NextResponse.json({ projectId: await getShowcaseProjectId() });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!hasPermission(session, "proyectos")) {
    return NextResponse.json({ error: "Acceso denegado: permiso requerido 'proyectos'" }, { status: 403 });
  }

  try {
    const { projectId } = await req.json();
    if (projectId !== null && typeof projectId !== "string") {
      return NextResponse.json({ error: "Proyecto no válido" }, { status: 400 });
    }

    await saveShowcaseProjectId(projectId || null);

    revalidatePath("/");
    revalidatePath("/admin/editor");

    return NextResponse.json({ success: true, projectId: projectId || null });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error al guardar el proyecto del bloque: " + err.message },
      { status: 500 }
    );
  }
}
