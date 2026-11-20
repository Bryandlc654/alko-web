import { ARTICLES_EN_A } from "@/lib/i18n/journal/articles-en-a";
import { ARTICLES_EN_B } from "@/lib/i18n/journal/articles-en-b";
import { GUIDES_EN } from "@/lib/i18n/journal/guides-en";

/**
 * Traducción al inglés de los artículos y guías del Journal (/en/journal/[slug] y
 * /en/journal/guides/[slug]). Es la única fuente de sus textos en inglés: el listado toma de aquí
 * títulos y extractos.
 *
 * Los artículos y guías se escriben en el panel solo en castellano. Esta traducción se hizo a partir
 * de lo publicado el 2026-11-19: si se edita o se publica un artículo, hay que añadir o actualizar
 * aquí su versión inglesa. Un artículo sin traducción no tiene página en inglés (su tarjeta enlaza a
 * la versión en castellano).
 */
export interface ArticleContentEn {
  title: string;
  excerpt: string;
  /** Cuerpo en HTML, con la misma estructura que el original (entradilla, h2, tablas...). */
  content: string;
}

export interface GuideContentEn {
  title: string;
  descripcion: string;
  content: string;
}

export const ARTICLES_EN: Record<string, ArticleContentEn> = { ...ARTICLES_EN_A, ...ARTICLES_EN_B };
export { GUIDES_EN };
