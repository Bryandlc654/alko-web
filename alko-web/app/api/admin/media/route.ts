import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server-session";
import { canUseMedia } from "@/lib/auth/rbac";
import { deleteMedia, listMedia } from "@/lib/media";

export const dynamic = "force-dynamic";

async function authorize() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!canUseMedia(session)) {
    return NextResponse.json({ error: "Acceso denegado: no tienes permiso para la biblioteca de medios" }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const denied = await authorize();
  if (denied) return denied;
  try {
    return NextResponse.json({ items: await listMedia() });
  } catch (err: any) {
    console.warn("[media] Error listando imágenes:", err.message);
    return NextResponse.json({ error: "No se pudo cargar la biblioteca de medios" }, { status: 502 });
  }
}

export async function DELETE(req: Request) {
  const denied = await authorize();
  if (denied) return denied;
  const name = new URL(req.url).searchParams.get("name") || "";
  try {
    await deleteMedia(name);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "No se pudo eliminar la imagen" }, { status: 400 });
  }
}
