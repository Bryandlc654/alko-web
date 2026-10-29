import { NextResponse } from "next/server";
import { getDbArticulosPageContent, saveDbArticulosPageContent } from "@/lib/db/mysql";
import { cookies } from "next/headers";

export async function GET() {
  const content = await getDbArticulosPageContent();
  return NextResponse.json(content);
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("alko_admin_auth");

  if (!auth || auth.value !== "true") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await saveDbArticulosPageContent(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al guardar contenido" }, { status: 500 });
  }
}
