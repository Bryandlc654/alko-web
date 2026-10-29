import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDbArticles, saveDbArticle, deleteDbArticle } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const articles = await getDbArticles();
  return NextResponse.json(articles);
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

    const saved = await saveDbArticle(body);

    revalidatePath("/conocimiento/articulos");
    revalidatePath(`/conocimiento/${saved.slug}`);
    revalidatePath("/");
    revalidatePath("/admin/articulos");

    return NextResponse.json({ success: true, article: saved });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error guardando artículo: " + err.message },
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
      return NextResponse.json({ error: "ID de artículo no especificado" }, { status: 400 });
    }

    const ok = await deleteDbArticle(id);
    if (!ok) {
      return NextResponse.json({ error: "No se pudo eliminar el artículo" }, { status: 500 });
    }

    revalidatePath("/conocimiento/articulos");
    revalidatePath("/");
    revalidatePath("/admin/articulos");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error eliminando artículo: " + err.message },
      { status: 500 }
    );
  }
}
