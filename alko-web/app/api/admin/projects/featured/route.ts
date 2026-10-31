import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getFeaturedProjectIds, saveFeaturedProjectIds } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/server-session";
import { hasPermission } from "@/lib/auth/rbac";

export async function GET() {
  const ids = await getFeaturedProjectIds();
  return NextResponse.json({ featuredIds: ids });
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
    const { featuredIds } = await req.json();

    if (!Array.isArray(featuredIds)) {
      return NextResponse.json(
        { error: "El formato debe ser un array de IDs" },
        { status: 400 }
      );
    }

    if (featuredIds.length > 3) {
      return NextResponse.json(
        { error: "Máximo 3 proyectos pueden ser destacados en la página de inicio" },
        { status: 400 }
      );
    }

    await saveFeaturedProjectIds(featuredIds.map(String));

    // Revalidar la portada y el editor
    revalidatePath("/");
    revalidatePath("/admin/editor");

    return NextResponse.json({ success: true, featuredIds });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error al actualizar destacados: " + err.message },
      { status: 500 }
    );
  }
}
