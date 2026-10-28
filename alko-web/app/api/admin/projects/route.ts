import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDbProjects, saveDbProject, deleteDbProject } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const projects = await getDbProjects();
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
    }

    const saved = await saveDbProject(body);

    revalidatePath("/proyectos");
    revalidatePath(`/proyectos/${saved.slug}`);
    revalidatePath("/");
    revalidatePath("/admin/proyectos");

    return NextResponse.json({ success: true, project: saved });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error guardando proyecto: " + err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID de proyecto no especificado" }, { status: 400 });
    }

    const ok = await deleteDbProject(id);
    if (!ok) {
      return NextResponse.json({ error: "No se pudo eliminar el proyecto" }, { status: 500 });
    }

    revalidatePath("/proyectos");
    revalidatePath("/");
    revalidatePath("/admin/proyectos");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error eliminando proyecto: " + err.message },
      { status: 500 }
    );
  }
}
