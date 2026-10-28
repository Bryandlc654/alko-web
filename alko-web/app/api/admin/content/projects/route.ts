import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDbProjectsPageContent, saveDbProjectsPageContent } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const content = await getDbProjectsPageContent();
  return NextResponse.json(content);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await saveDbProjectsPageContent(body);

    revalidatePath("/proyectos");
    revalidatePath("/admin/editor");

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error guardando contenido de proyectos: " + err.message },
      { status: 500 }
    );
  }
}
