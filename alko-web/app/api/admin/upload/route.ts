import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { getSession } from "@/lib/auth/server-session";
import { hasPermission, type Permission } from "@/lib/auth/rbac";
import { githubMediaEnabled, uploadImageToGithub } from "@/lib/github-media";

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const UPLOAD_PERMISSIONS: Permission[] = ["editor", "proyectos", "servicios", "articulos", "guias", "equipo", "empleo"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB máximo

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!UPLOAD_PERMISSIONS.some((permission) => hasPermission(session, permission))) {
    return NextResponse.json({ error: "Acceso denegado: no tienes permiso para subir imágenes" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    // Validación de tamaño
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "El archivo supera el límite permitido de 10MB" },
        { status: 400 }
      );
    }

    const originalName = file.name || "imagen.jpg";
    const extension = path.extname(originalName).toLowerCase() || ".jpg";

    // Validación de tipo de archivo permitido
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json(
        { error: "Formato no permitido. Solo se admiten imágenes JPG, PNG, WEBP o AVIF." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    // Las fotos de cámara (5000-7000 px) son demasiado grandes para el optimizador de imágenes del servidor,
    // que acababa sirviendo el original. Se guardan ya reducidas a 1920 px de ancho y en WebP.
    let buffer: Buffer;
    try {
      buffer = await sharp(Buffer.from(bytes))
        .rotate()
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toBuffer();
    } catch {
      return NextResponse.json({ error: "No se pudo procesar la imagen" }, { status: 400 });
    }

    // Sanitizar nombre de archivo contra path traversal
    const baseName = path
      .basename(originalName, extension)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 40);

    const fileName = `${baseName}-${Date.now()}.webp`;
    // Con GITHUB_TOKEN las imágenes viven en GitHub; sin él (desarrollo local) se guardan en public/uploads.
    let publicUrl: string;
    if (githubMediaEnabled()) {
      publicUrl = await uploadImageToGithub(fileName, buffer);
    } else {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
      publicUrl = `/uploads/${fileName}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error subiendo archivo: " + err.message },
      { status: 500 }
    );
  }
}
