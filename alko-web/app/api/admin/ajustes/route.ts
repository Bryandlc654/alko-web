import { NextResponse } from "next/server";
import { getDbSettings, saveDbSettings } from "@/lib/db/mysql";
import { cookies } from "next/headers";

export async function GET() {
  const settings = await getDbSettings();
  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("alko_admin_auth");

  if (!auth || auth.value !== "true") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await saveDbSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error guardando ajustes de la empresa" },
      { status: 500 }
    );
  }
}
