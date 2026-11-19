/**
 * Idiomas del sitio. El castellano es el idioma principal y vive en la raíz; el inglés,
 * bajo /en. Por ahora solo la portada tiene versión inglesa (/en): el resto de páginas
 * siguen en castellano y el selector de idioma lleva a la portada inglesa.
 */

export type Locale = "es" | "en";

export const LOCALES: readonly Locale[] = ["es", "en"];
export const DEFAULT_LOCALE: Locale = "es";

/** Portada de cada idioma. */
export const HOME_PATHS: Record<Locale, string> = { es: "/", en: "/en" };

/** Prefijo de ruta de cada idioma ("" para el castellano). */
const PREFIX: Record<Locale, string> = { es: "", en: "/en" };

/** Idioma de una ruta: todo lo que cuelga de /en es inglés. */
export function localeFromPath(pathname?: string | null): Locale {
  return pathname === "/en" || pathname?.startsWith("/en/") ? "en" : "es";
}

/** Rutas que existen en ambos idiomas (las que tienen traducción). */
const TRANSLATED_PATHS = new Set<string>(["/"]);

/**
 * Ruta equivalente en otro idioma. Si la página actual no está traducida, se lleva a la
 * portada de ese idioma.
 */
export function pathInLocale(pathname: string, target: Locale): string {
  const current = localeFromPath(pathname);
  const base = current === "es" ? pathname : pathname.slice(PREFIX[current].length) || "/";
  if (!TRANSLATED_PATHS.has(base)) return HOME_PATHS[target];
  return target === "es" ? base : `${PREFIX[target]}${base === "/" ? "" : base}`;
}

/** Datos de cada idioma para el selector y los metadatos. */
export const LOCALE_META: Record<Locale, { short: string; name: string; htmlLang: string; ogLocale: string }> = {
  es: { short: "ES", name: "Español", htmlLang: "es", ogLocale: "es_ES" },
  en: { short: "EN", name: "English", htmlLang: "en", ogLocale: "en_GB" },
};
