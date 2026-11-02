/**
 * Utilidades puras compartidas (sin dependencias de React ni del CMS).
 */

/** Convierte un texto en un slug seguro para URLs (quita acentos y símbolos). */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Elimina las etiquetas HTML de una cadena. */
export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

const NAMED_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&hellip;": "…",
  "&mdash;": "—",
  "&ndash;": "–",
};

/** Decodifica las entidades HTML más habituales devueltas por WordPress. */
export function decodeEntities(value: string): string {
  return value
    .replace(/&#0?(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&[a-z#0-9]+;/gi, (entity) => NAMED_ENTITIES[entity] ?? entity);
}

/** Texto plano y recortado (sin cortar palabras) a partir de HTML, para resúmenes. */
export function plainExcerpt(html: string | undefined, max = 220): string {
  const plain = decodeEntities(stripHtml((html || "").replace(/<\/?(p|br|li|h\d)[^>]*>/gi, " "))).replace(/\s+/g, " ").trim();
  return plain.length > max ? plain.slice(0, max).replace(/\s+\S*$/, "") + "…" : plain;
}

/** Normaliza un valor desconocido a string (nunca devuelve `null`/`undefined`). */
export function text(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

/** Formatea una fecha ISO en un texto legible en español. */
export function formatDate(value: string): string {
  if (!value) return "";
  // «2026-10-28» se interpreta como medianoche UTC: en España (UTC-) o en el navegador de
  // otra zona salía el día anterior. Las fechas sin hora se leen como día del calendario.
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = new Date(dateOnly ? `${value}T12:00:00Z` : value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...(dateOnly ? { timeZone: "UTC" } : {}),
  }).format(date);
}

/**
 * Separa el primer párrafo de un contenido HTML (como texto plano, para usarlo
 * de entradilla) del resto del HTML.
 */
export function splitLead(html: string): { lead: string; rest: string } {
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!match || match.index == null) {
    return { lead: decodeEntities(stripHtml(html)), rest: "" };
  }
  return {
    lead: decodeEntities(stripHtml(match[1])),
    rest: (html.slice(0, match.index) + html.slice(match.index + match[0].length)).trim(),
  };
}
