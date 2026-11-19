/**
 * Idiomas del sitio. El castellano es el idioma principal y vive en la raíz; el inglés,
 * bajo /en. Tienen versión inglesa las páginas de TRANSLATED (portada, proyectos, estudio y equipo);
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
};

/**
 * Ruta de una página en un idioma, a partir de su ruta en castellano. Si no está traducida,
 * se queda en castellano (los enlaces a páginas sin traducir siguen funcionando).
 */
export function localizedPath(esPath: string, locale: Locale): string {
  if (locale === "es") return esPath;
  const [path, hash] = esPath.split("#");
  const target = TRANSLATED[path];
  return target ? `${target}${hash ? `#${hash}` : ""}` : esPath;
}

/**
 * Ruta equivalente en otro idioma (para el selector). Si la página actual no está traducida,
 * se lleva a la portada de ese idioma.
 */
export function pathInLocale(pathname: string, target: Locale): string {
  const path = pathname.replace(/\/+$/, "") || "/";
  const esPath = localeFromPath(path) === "es" ? path : Object.keys(TRANSLATED).find((es) => TRANSLATED[es] === path);
  if (!esPath || !(esPath in TRANSLATED)) return HOME_PATHS[target];
  return target === "es" ? esPath : TRANSLATED[esPath];
}

/** Alternativas hreflang de una página traducida (para metadatos y sitemap), en rutas relativas. */
export function languageAlternates(esPath: string) {
  return { es: esPath, en: TRANSLATED[esPath] ?? esPath, "x-default": esPath };
}

/** Datos de cada idioma para el selector y los metadatos. */
export const LOCALE_META: Record<Locale, { short: string; name: string; htmlLang: string; ogLocale: string }> = {
  es: { short: "ES", name: "Español", htmlLang: "es", ogLocale: "es_ES" },
  en: { short: "EN", name: "English", htmlLang: "en", ogLocale: "en_GB" },
};
