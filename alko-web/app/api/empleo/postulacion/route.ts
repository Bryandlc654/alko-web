import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { CV_DIR, CV_URL_PREFIX } from "@/lib/cv-storage";
import fs from "fs";
import path from "path";
import { saveDbJobApplication } from "@/lib/db/mysql";
import { clientIp, isSameOrigin } from "@/lib/http";
import { createRateLimiter } from "@/lib/rate-limit";

const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx"]);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const checkRateLimit = createRateLimiter();

/** Mensajes al candidato en cada idioma (el formulario envía el idioma de la página en la cabecera). */
const MESSAGES = {
  es: {
    forbidden: "Petición no permitida",
    tooMany: "Has superado el límite de envíos de candidaturas. Inténtalo más tarde.",
    required: "Por favor, completa los campos requeridos: nombre, email y teléfono.",
    tooBig: "El archivo del CV supera el límite máximo de 10MB.",
    format: "Formato no válido. Solo se admiten archivos PDF, DOC o DOCX.",
    sent: "¡Candidatura enviada correctamente! Revisaremos tu perfil en detalle.",
    failed: "Ocurrió un error al procesar tu postulación. Por favor intenta de nuevo.",
  },
  en: {
    forbidden: "Request not allowed",
    tooMany: "You have reached the limit of applications. Please try again later.",
    required: "Please fill in the required fields: name, email and phone.",
    tooBig: "The CV file is larger than the 10 MB limit.",
    format: "Invalid format. Only PDF, DOC or DOCX files are accepted.",
    sent: "Application sent! We will review your profile in detail.",
    failed: "Something went wrong while processing your application. Please try again.",
  },
} as const;

export async function POST(req: NextRequest) {
  const m = MESSAGES[req.headers.get("x-form-locale") === "en" ? "en" : "es"];
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: m.forbidden }, { status: 403 });
  }

  // Rate limiting: máximo 5 postulaciones por IP cada 15 minutos
  const rate = checkRateLimit(clientIp(req), {
    limit: 5,
    windowMs: 15 * 60 * 1000,
    dailyLimit: 30,
  });

  if (!rate.ok) {
    return NextResponse.json(
      { error: m.tooMany },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } }
    );
  }

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
        { error: m.required },
        { status: 400 }
      );
    }

    let cvUrl = "";
    let cvNombre = "";

    if (cvFile && cvFile.size > 0) {
      if (cvFile.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: m.tooBig },
          { status: 400 }
        );
      }

      const originalName = cvFile.name || "curriculum.pdf";
      const extension = path.extname(originalName).toLowerCase();

      if (!ALLOWED_EXTENSIONS.has(extension)) {
        return NextResponse.json(
          { error: m.format },
          { status: 400 }
        );
      }

      const bytes = await cvFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `cv-${randomBytes(12).toString("hex")}${extension}`;

      fs.mkdirSync(CV_DIR, { recursive: true });
      fs.writeFileSync(path.join(CV_DIR, fileName), buffer);

      cvUrl = `${CV_URL_PREFIX}${fileName}`;
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
      message: m.sent,
      candidatura: saved,
    });
  } catch (err: any) {
    console.error("Error al procesar candidatura:", err);
    return NextResponse.json(
      { error: m.failed },
      { status: 500 }
    );
  }
}
