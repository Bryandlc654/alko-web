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
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      images: [image ? { url: image, alt: title } : OG_IMAGE],
    },
  };
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
