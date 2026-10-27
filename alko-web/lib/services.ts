import { decodeEntities, stripHtml } from "./utils";

export interface ServiceSection {
  title: string;
  /** HTML de la sección (sin el h2). */
  html: string;
  /** Elementos de la primera lista de la sección, en texto plano. */
  items: string[];
}

export interface ParsedService {
  /** Primer párrafo, en texto plano, para la promesa de la cabecera. */
  lead: string;
  /** Resto de párrafos anteriores al primer h2. */
  intro: string;
  sections: ServiceSection[];
}

/**
 * Divide el contenido de un servicio (HTML del CMS) en entradilla, introducción y secciones por h2.
 * Así la plantilla puede colocar cada parte donde corresponde en el recorrido de la landing:
 * «Qué incluye» pasa a ser una rejilla de ventajas y el resto se muestra como texto.
 */
export function parseService(html: string): ParsedService {
  const parts = html.split(/<h2[^>]*>/i);
  const head = parts[0] ?? "";

  const paragraphs = [...head.matchAll(/<p[^>]*>[\s\S]*?<\/p>/gi)].map((match) => match[0]);
  const lead = paragraphs[0] ? decodeEntities(stripHtml(paragraphs[0])) : "";
  const intro = paragraphs.slice(1).join("");

  const sections = parts.slice(1).map((part): ServiceSection => {
    const [rawTitle = "", ...rest] = part.split(/<\/h2>/i);
    const content = rest.join("</h2>").trim();
    const list = content.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
    const items = list
      ? [...list[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((li) => decodeEntities(stripHtml(li[1])))
      : [];
    return { title: decodeEntities(stripHtml(rawTitle)), html: content, items };
  });

  return { lead, intro, sections };
}
