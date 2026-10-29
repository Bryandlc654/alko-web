import { NextResponse } from "next/server";
import { getDbSectors, saveDbSector, deleteDbSector } from "@/lib/db/mysql";
import { cookies } from "next/headers";

export async function GET() {
  const sectors = await getDbSectors();
  return NextResponse.json(sectors);
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("alko_admin_auth");

  if (!auth || auth.value !== "true") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const saved = await saveDbSector(body);
    return NextResponse.json({ success: true, sector: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error guardando servicio" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("alko_admin_auth");

  if (!auth || auth.value !== "true") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID de servicio requerido" }, { status: 400 });
    }

    const success = await deleteDbSector(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error eliminando servicio" }, { status: 500 });
  }
}
