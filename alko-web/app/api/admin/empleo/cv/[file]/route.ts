import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server-session";
import { hasPermission } from "@/lib/auth/rbac";
import { CV_DIR } from "@/lib/cv-storage";

const TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/** Descarga de un CV: solo para quien tiene el permiso de Empleo. */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!hasPermission(session, "empleo")) {
    return NextResponse.json({ error: "Acceso denegado: permiso requerido 'empleo'" }, { status: 403 });
  }

  const { file } = await params;
  const ext = path.extname(file).toLowerCase();
  if (!/^[a-z0-9_-]+\.(pdf|doc|docx)$/.test(file) || !TYPES[ext]) {
    return NextResponse.json({ error: "Archivo no válido" }, { status: 400 });
  }

  const filePath = path.join(CV_DIR, file);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(fs.readFileSync(filePath)), {
    headers: {
      "Content-Type": TYPES[ext],
      "Content-Disposition": `attachment; filename="${file}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
