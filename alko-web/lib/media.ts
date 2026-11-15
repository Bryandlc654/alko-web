import fs from "fs";
import path from "path";
import { deleteGithubUpload, githubMediaEnabled, listGithubUploads } from "./github-media";

export interface MediaItem {
  /** Identificador estable para borrar: nombre del archivo dentro de su origen. */
  id: string;
  url: string;
  name: string;
  size: number;
  /** «subida» = desde el panel (se puede borrar); «web» = imagen fija del proyecto. */
  source: "subida" | "web";
  /** Marca de tiempo del nombre (las subidas terminan en -<ms>.ext), para ordenar. */
  uploadedAt: number | null;
}

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)$/i;
const PUBLIC_DIR = path.join(process.cwd(), "public");
const LOCAL_UPLOADS = path.join(PUBLIC_DIR, "uploads");

function timestampOf(name: string): number | null {
  const match = name.match(/-(\d{12,})\.[a-z0-9]+$/i);
  return match ? Number(match[1]) : null;
}

function readImages(dir: string): { name: string; size: number }[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && IMAGE_EXT.test(entry.name))
    .map((entry) => ({ name: entry.name, size: fs.statSync(path.join(dir, entry.name)).size }));
}

/**
 * Biblioteca de medios: las imágenes subidas desde el panel (GitHub en producción, public/uploads en local)
 * y las imágenes fijas de la web (carpeta public/). Las subidas van primero, de la más reciente a la más antigua.
 */
export async function listMedia(): Promise<MediaItem[]> {
  let uploads: MediaItem[];
  if (githubMediaEnabled()) {
    uploads = (await listGithubUploads()).map((item) => ({
      id: item.name,
      url: item.url,
      name: item.name,
      size: item.size,
      source: "subida",
      uploadedAt: timestampOf(item.name),
    }));
  } else {
    uploads = readImages(LOCAL_UPLOADS).map((item) => ({
      id: item.name,
      url: `/uploads/${item.name}`,
      name: item.name,
      size: item.size,
      source: "subida",
      uploadedAt: timestampOf(item.name),
    }));
  }
  uploads.sort((a, b) => (b.uploadedAt ?? 0) - (a.uploadedAt ?? 0));

  const web: MediaItem[] = readImages(PUBLIC_DIR)
    .filter((item) => !/^(logo|favicon|icon|apple-touch)/i.test(item.name))
    .map((item) => ({
      id: item.name,
      url: `/${item.name}`,
      name: item.name,
      size: item.size,
      source: "web",
      uploadedAt: null,
    }));

  return [...uploads, ...web];
}

/** Borra una imagen subida desde el panel. Las imágenes fijas de la web no se pueden borrar. */
export async function deleteMedia(name: string): Promise<void> {
  if (!/^[a-z0-9_.-]+$/i.test(name) || !IMAGE_EXT.test(name)) throw new Error("Nombre de archivo no válido");
  if (githubMediaEnabled()) {
    const found = (await listGithubUploads()).find((item) => item.name === name);
    if (!found) throw new Error("La imagen no existe");
    await deleteGithubUpload(name, found.sha);
    return;
  }
  const filePath = path.join(LOCAL_UPLOADS, name);
  if (!fs.existsSync(filePath)) throw new Error("La imagen no existe");
  fs.unlinkSync(filePath);
}
