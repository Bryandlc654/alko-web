import { NextResponse } from "next/server";
import { getDbArticleCategories, saveDbArticleCategories } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const categories = await getDbArticleCategories();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!Array.isArray(body.categories)) {
      return NextResponse.json({ error: "Se espera un arreglo de categorías" }, { status: 400 });
    }

    const saved = await saveDbArticleCategories(body.categories);
    return NextResponse.json({ success: true, categories: saved });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error guardando categorías: " + err.message },
      { status: 500 }
    );
  }
}
