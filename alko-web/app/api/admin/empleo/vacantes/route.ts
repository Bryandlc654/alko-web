import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDbVacancies, saveDbVacancy, deleteDbVacancy } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";

export async function GET() {
  const vacancies = await getDbVacancies();
  return NextResponse.json(vacancies);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!hasPermission(session, "empleo")) {
    return NextResponse.json({ error: "Acceso denegado: permiso requerido 'empleo'" }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.titulo) {
      return NextResponse.json({ error: "El título de la vacante es obligatorio" }, { status: 400 });
    }

    const updatedList = await saveDbVacancy(body);
    revalidatePath("/trabaja-con-nosotros");
    revalidatePath("/admin/empleo");
    return NextResponse.json({ success: true, vacantes: updatedList });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error al guardar vacante" }, { status: 500 });
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
      return NextResponse.json({ error: "ID de vacante requerido" }, { status: 400 });
    }

    const updatedList = await deleteDbVacancy(id);
    revalidatePath("/trabaja-con-nosotros");
    revalidatePath("/admin/empleo");
    return NextResponse.json({ success: true, vacantes: updatedList });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error al eliminar vacante" }, { status: 500 });
  }
}
