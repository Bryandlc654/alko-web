/**
 * Idiomas del sitio. El castellano es el idioma principal y vive en la raíz; el inglés,
 * bajo /en. Tienen versión inglesa las páginas de TRANSLATED (portada, proyectos, estudio, equipo, empleo, contacto,
 * el Journal, servicios y privacidad) y las fichas de TRANSLATED_PREFIXES (servicios, proyectos, artículos y guías);
 * el resto siguen en castellano y el selector de idioma lleva a la portada inglesa.
 */

export type Locale = "es" | "en";

export const LOCALES: readonly Locale[] = ["es", "en"];
export const DEFAULT_LOCALE: Locale = "es";

/** Portada de cada idioma. */
export const HOME_PATHS: Record<Locale, string> = { es: "/", en: "/en" };

/** Idioma de una ruta: todo lo que cuelga de /en es inglés. */
export function localeFromPath(pathname?: string | null): Locale {
  return pathname === "/en" || pathname?.startsWith("/en/") ? "en" : "es";
}

/**
 * Páginas traducidas: ruta en castellano → ruta en inglés. Las URL inglesas usan palabras
 * inglesas (/en/projects), que es lo que se busca en ese idioma.
 */
const TRANSLATED: Record<string, string> = {
  "/": "/en",
  "/proyectos": "/en/projects",
  "/nosotros": "/en/about",
  "/equipo": "/en/team",
  "/trabaja-con-nosotros": "/en/careers",
  "/contacto": "/en/contact",
  "/journal": "/en/journal",
  "/servicios": "/en/services",
  "/politica-de-privacidad": "/en/privacy-policy",
};

/** Fichas traducidas: el slug se mantiene y cambia el prefijo (/servicios/retail → /en/services/retail). */
const TRANSLATED_PREFIXES: Record<string, string> = {
  "/servicios/": "/en/services/",
  "/proyectos/": "/en/projects/",
  "/journal/guias/": "/en/journal/guides/",
  "/journal/": "/en/journal/",
};

/** Ruta inglesa de una ruta en castellano, o undefined si no está traducida. */
function englishPath(esPath: string): string | undefined {
  if (TRANSLATED[esPath]) return TRANSLATED[esPath];
  for (const [es, en] of Object.entries(TRANSLATED_PREFIXES)) {
    const slug = esPath.startsWith(es) ? esPath.slice(es.length) : "";
    if (slug && !slug.includes("/")) return en + slug;
  }
  return undefined;
}

/** Ruta en castellano de una ruta inglesa, o undefined si no es una página traducida. */
function spanishPath(enPath: string): string | undefined {
  const page = Object.keys(TRANSLATED).find((es) => TRANSLATED[es] === enPath);
  if (page) return page;
  for (const [es, en] of Object.entries(TRANSLATED_PREFIXES)) {
    const slug = enPath.startsWith(en) ? enPath.slice(en.length) : "";
    if (slug && !slug.includes("/")) return es + slug;
  }
  return undefined;
}

/**
 * Ruta de una página en un idioma, a partir de su ruta en castellano. Si no está traducida,
 * se queda en castellano (los enlaces a páginas sin traducir siguen funcionando).
 */
export function localizedPath(esPath: string, locale: Locale): string {
  if (locale === "es") return esPath;
  const [path, hash] = esPath.split("#");
  const target = englishPath(path);
  return target ? `${target}${hash ? `#${hash}` : ""}` : esPath;
}

/**
 * Ruta equivalente en otro idioma (para el selector). Si la página actual no está traducida,
 * se lleva a la portada de ese idioma.
 */
export function pathInLocale(pathname: string, target: Locale): string {
  const path = pathname.replace(/\/+$/, "") || "/";
  const esPath = localeFromPath(path) === "es" ? path : spanishPath(path);
  const enPath = esPath && englishPath(esPath);
  if (!esPath || !enPath) return HOME_PATHS[target];
  return target === "es" ? esPath : enPath;
}

/** Alternativas hreflang de una página traducida (para metadatos y sitemap), en rutas relativas. */
export function languageAlternates(esPath: string) {
  return { es: esPath, en: englishPath(esPath) ?? esPath, "x-default": esPath };
}

/** Datos de cada idioma para el selector y los metadatos. */
export const LOCALE_META: Record<Locale, { short: string; name: string; htmlLang: string; ogLocale: string }> = {
  es: { short: "ES", name: "Español", htmlLang: "es", ogLocale: "es_ES" },
  en: { short: "EN", name: "English", htmlLang: "en", ogLocale: "en_GB" },
};
