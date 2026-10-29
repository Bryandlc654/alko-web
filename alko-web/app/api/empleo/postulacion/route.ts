import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { saveDbJobApplication } from "@/lib/db/mysql";

const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx"]);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const nombre = (formData.get("nombre") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const telefono = (formData.get("telefono") as string)?.trim();
    const puesto = (formData.get("puesto") as string)?.trim() || "Candidatura espontánea";
    const mensaje = (formData.get("mensaje") as string)?.trim() || "";
    const cvFile = formData.get("cv") as File | null;

    if (!nombre || !email || !telefono) {
      return NextResponse.json(
        { error: "Por favor, completa los campos requeridos: nombre, email y teléfono." },
        { status: 400 }
      );
    }

    let cvUrl = "";
    let cvNombre = "";

    if (cvFile && cvFile.size > 0) {
      if (cvFile.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: "El archivo del CV supera el límite máximo de 10MB." },
          { status: 400 }
        );
      }

      const originalName = cvFile.name || "curriculum.pdf";
      const extension = path.extname(originalName).toLowerCase();

      if (!ALLOWED_EXTENSIONS.has(extension)) {
        return NextResponse.json(
          { error: "Formato no válido. Solo se admiten archivos PDF, DOC o DOCX." },
          { status: 400 }
        );
      }

      const bytes = await cvFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const baseName = path
        .basename(originalName, extension)
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "-")
        .slice(0, 30);

      const fileName = `cv-${baseName}-${Date.now()}${extension}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "cvs");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      cvUrl = `/uploads/cvs/${fileName}`;
      cvNombre = originalName;
    }

    const saved = await saveDbJobApplication({
      nombre,
      email,
      telefono,
      puesto,
      mensaje,
      cvUrl,
      cvNombre,
      estado: "nueva",
    });

    return NextResponse.json({
      success: true,
      message: "¡Candidatura enviada correctamente! Revisaremos tu perfil en detalle.",
      candidatura: saved,
    });
  } catch (err: any) {
    console.error("Error al procesar candidatura:", err);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar tu postulación. Por favor intenta de nuevo." },
      { status: 500 }
    );
  }
}
