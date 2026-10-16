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

/** Normaliza un valor desconocido a string (nunca devuelve `null`/`undefined`). */
export function text(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

/** Formatea una fecha ISO en un texto legible en español. */
export function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}
