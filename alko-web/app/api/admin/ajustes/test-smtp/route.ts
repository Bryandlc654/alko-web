import { NextResponse } from "next/server";
import { verifySmtpConnection } from "@/lib/email/mailer";
import { getSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const config = await req.json();
    const result = await verifySmtpConnection(config);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error || "No se pudo conectar al servidor SMTP" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, message: "Conexión SMTP exitosa" });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message || "Error al verificar conexión SMTP" },
      { status: 500 }
    );
  }
}
