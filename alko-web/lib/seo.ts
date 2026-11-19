import type { Metadata } from "next";
import { OG_IMAGE, SITE } from "@/lib/site";

/**
 * Metadatos completos de una página: título, descripción, canonical y Open Graph.
 * Next sustituye el objeto openGraph entero si la página define uno, así que aquí se repiten
 * nombre del sitio, idioma e imagen para que no se pierdan.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  article,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  /** Texto alternativo de la imagen (por defecto, el título). */
  imageAlt?: string;
  /** Artículos del Journal: Open Graph de tipo article con su fecha. */
  article?: { publishedTime?: string };
}): Metadata {
  const desc = metaDescription(description);
  return {
    title: { absolute: title },
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: desc,
      url: path,
      locale: SITE.locale,
      siteName: SITE.name,
      images: [image ? { url: image, alt: imageAlt || title } : OG_IMAGE],
      ...(article
        ? { type: "article" as const, ...(article.publishedTime && { publishedTime: article.publishedTime }) }
        : { type: "website" as const }),
    },
  };
}

/** Descripción para buscadores: texto plano de 155 caracteres como mucho, sin cortar palabras. */
export function metaDescription(text: string | undefined, max = 155): string {
  const plain = (text || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (plain.length <= max) return plain;
  return plain.slice(0, max - 1).replace(/\s+\S*$/, "").replace(/[\s,;:.—-]+$/, "") + "…";
}

/** Nombre de una obra para los títulos: las que se escriben en mayúsculas («SEDE ALMAGRO») pasan a «Sede Almagro». */
export function displayName(name: string): string {
  if (name !== name.toUpperCase()) return name;
  return name.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}

/** Nodo de la empresa para los datos estructurados (el mismo @id que en la portada). */
export function organizationNode(extra: Record<string, unknown> = {}) {
  return {
    "@type": "GeneralContractor",
    "@id": `${SITE.url}/#empresa`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: `${SITE.url}/logo.webp`,
    areaServed: { "@type": "City", name: "Madrid" },
    ...extra,
  };
}

/** Datos estructurados de una página interna: la página y la empresa de la que trata. */
export function pageJsonLd({
  type = "WebPage",
  path,
  name,
  description,
  organization = {},
  extra = {},
}: {
  type?: string;
  path: string;
  name: string;
  description: string;
  organization?: Record<string, unknown>;
  extra?: Record<string, unknown>;
}) {
  const org = organizationNode(organization);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${SITE.url}${path}#pagina`,
        url: `${SITE.url}${path}`,
        name,
        description,
        inLanguage: "es-ES",
        isPartOf: { "@type": "WebSite", "@id": `${SITE.url}/#web`, name: SITE.name, url: SITE.url },
        about: { "@id": org["@id"] },
        ...extra,
      },
      org,
    ],
  };
}
