import type { Locale } from "@/lib/i18n";
import { projectCategory } from "@/lib/project-category";
import type { Project } from "@/lib/types";

/**
 * Los proyectos vienen del panel solo en castellano. En las páginas inglesas se muestran con el
 * título, la ubicación y la tipología traducidos con estas reglas (sin tocar los datos guardados).
 */

/** Títulos que no siguen el patrón «Reforma …». */
const TITLES_EN: Record<string, string> = {
  "Reforma Integral de Cocina": "Full kitchen renovation",
};

/** «Reforma Columela» → «Columela renovation»; «Reforma Piso Juan Montalvo» → «Juan Montalvo flat renovation». */
export function projectTitleEn(title: string): string {
  const exact = TITLES_EN[title.trim()];
  if (exact) return exact;
  const flat = title.match(/^Reforma\s+(?:de\s+)?piso\s+(.+)$/i);
  if (flat) return `${flat[1].trim()} flat renovation`;
  const generic = title.match(/^Reforma\s+(.+)$/i);
  if (generic) return `${generic[1].trim()} renovation`;
  return title;
}

/** Partes de las ubicaciones que tienen nombre en inglés; el resto son nombres propios. */
const PLACES_EN: [RegExp, string][] = [
  [/\bEspaña\b/g, "Spain"],
  [/\bEntorno de (.+?)(?=,|$)/g, "$1 area"],
  [/\bBarrio de Salamanca\b/g, "Salamanca district"],
  [/\bComunidad de Madrid\b/g, "Community of Madrid"],
];

export function placeEn(place: string): string {
  return PLACES_EN.reduce((text, [re, to]) => text.replace(re, to), place.trim().replace(/\.+$/, ""));
}

/** Plazos del panel («12 meses», «6 semanas») en inglés. */
export function durationEn(text: string): string {
  return text
    .replace(/\b(\d+)\s*mes(es)?\b/gi, (_, n: string) => `${n} ${n === "1" ? "month" : "months"}`)
    .replace(/\b(\d+)\s*semanas?\b/gi, (_, n: string) => `${n} ${n === "1" ? "week" : "weeks"}`)
    .replace(/\b(\d+)\s*días?\b/gi, (_, n: string) => `${n} ${n === "1" ? "day" : "days"}`);
}

/** Tipología → categoría en inglés (las mismas del filtro del listado). */
const CATEGORIES_EN: Record<string, string> = {
  "Reformas integrales": "Full renovation",
  "Vivienda unifamiliar": "Detached house",
  Cocinas: "Kitchen",
  Baños: "Bathroom",
};

export function typologyEn(tipologia: string): string {
  return CATEGORIES_EN[projectCategory(tipologia)] ?? tipologia;
}

/**
 * El proyecto con sus textos visibles en el idioma de la página. Con `keepTypology` se conserva la
 * tipología original (el listado la usa para filtrar y ya la traduce al mostrarla).
 */
export function localizeProject<T extends Project>(project: T, locale: Locale, { keepTypology = false } = {}): T {
  if (locale === "es") return project;
  return {
    ...project,
    title: projectTitleEn(project.title),
    ubicacion: project.ubicacion ? placeEn(project.ubicacion) : project.ubicacion,
    plazo: project.plazo ? durationEn(project.plazo) : project.plazo,
    tipologia: keepTypology || !project.tipologia ? project.tipologia : typologyEn(project.tipologia),
  };
}
