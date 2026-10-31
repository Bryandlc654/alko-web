import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDbGuides, saveDbGuide, deleteDbGuide } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/server-session";
import { hasPermission } from "@/lib/auth/rbac";

export async function GET() {
  const guides = await getDbGuides();
  return NextResponse.json(guides);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!hasPermission(session, "guias")) {
    return NextResponse.json({ error: "Acceso denegado: permiso requerido 'guias'" }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
    }

    const saved = await saveDbGuide(body);

    revalidatePath("/conocimiento/guias");
    revalidatePath(`/conocimiento/guias/${saved.slug}`);
    revalidatePath("/admin/guias");

    return NextResponse.json({ success: true, guide: saved });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error guardando guía: " + err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!hasPermission(session, "guias")) {
    return NextResponse.json({ error: "Acceso denegado: permiso requerido 'guias'" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID de guía no especificado" }, { status: 400 });
    }

    const ok = await deleteDbGuide(id);
    if (!ok) {
      return NextResponse.json({ error: "No se pudo eliminar la guía" }, { status: 500 });
    }

    revalidatePath("/conocimiento/guias");
    revalidatePath("/admin/guias");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error eliminando guía: " + err.message },
      { status: 500 }
    );
  }
}
