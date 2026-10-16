import { decodeEntities, slugify, stripHtml, text } from "../utils";
import type {
  Article,
  Fabricante,
  Fase,
  Project,
  Sector,
  SiteSettings,
  Slide,
} from "../types";
import type { WpMedia, WpPost, WpTerm } from "./client";

/**
 * Funciones puras que convierten las respuestas de WordPress en objetos de
 * dominio. Mantenerlas separadas del cliente HTTP y de las consultas facilita
 * probarlas y reutilizarlas.
 */

export function wpFields(post: WpPost): Record<string, unknown> {
  return (post.acf ?? post.scf ?? {}) as Record<string, unknown>;
}

export function wpTitle(post: WpPost): string {
  return decodeEntities(stripHtml(post.title?.rendered ?? ""));
}

function wpMedia(post: WpPost): WpMedia | undefined {
  const media = post._embedded?.["wp:featuredmedia"] as WpMedia[] | undefined;
  return media?.[0];
}

export function wpFeaturedImage(post: WpPost): string {
  return wpMedia(post)?.source_url ?? "";
}

export function wpFeaturedAlt(post: WpPost): string {
  return wpMedia(post)?.alt_text ?? "";
}

/** Lee un campo de imagen de ACF/SCF que puede venir como URL o como objeto. */
export function wpImageField(post: WpPost, key: string): string {
  const value = wpFields(post)[key];
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "url" in value) {
    return text((value as { url: unknown }).url);
  }
  return "";
}

export function toSlide(post: WpPost): Slide {
  return {
    id: `slide-${post.id}`,
    image: wpImageField(post, "imagen") || wpFeaturedImage(post),
    alt: text(wpFields(post).alt) || wpTitle(post) || wpFeaturedAlt(post),
  };
}

export function toProject(post: WpPost, index: number): Project {
  const fields = wpFields(post);
  const title = wpTitle(post);
  return {
    id: `project-${post.id}`,
    slug: post.slug || slugify(title),
    title,
    indice: text(fields.indice) || String(index + 1).padStart(2, "0"),
    anio: text(fields.anio),
    ubicacion: text(fields.ubicacion),
    tipologia: text(fields.tipologia),
    imagen: wpImageField(post, "imagen") || wpFeaturedImage(post),
    enlace: text(fields.enlace) || "/contacto",
    content: post.content?.rendered ?? "",
  };
}

export function toSector(post: WpPost, index: number): Sector {
  const fields = wpFields(post);
  const title = wpTitle(post);
  return {
    id: `sector-${post.id}`,
    slug: post.slug || slugify(title),
    numero: text(fields.numero) || String(index + 1).padStart(2, "0"),
    title,
    descripcion: text(fields.descripcion),
    imagen: wpImageField(post, "imagen") || wpFeaturedImage(post),
    enlace: text(fields.enlace) || "/proyectos",
    content: post.content?.rendered ?? "",
  };
}

export function toFase(post: WpPost, index: number): Fase {
  const fields = wpFields(post);
  return {
    id: `fase-${post.id}`,
    tag: text(fields.tag) || `${String(index + 1).padStart(2, "0")} / FASE`,
    title: wpTitle(post),
    texto: text(fields.texto),
    imagen: wpImageField(post, "imagen") || wpFeaturedImage(post),
  };
}

export function toFabricante(post: WpPost): Fabricante {
  const fields = wpFields(post);
  return {
    id: `fabricante-${post.id}`,
    name: wpTitle(post),
    logo: wpImageField(post, "logo") || wpFeaturedImage(post),
    url: text(fields.url) || "#",
  };
}

export function toArticle(post: WpPost, fallbackImage = ""): Article {
  const terms = (post._embedded?.["wp:term"] as WpTerm[][] | undefined) ?? [];
  const category = terms.flat().find((term) => term.taxonomy === "category");
  const title = wpTitle(post);
  return {
    id: `article-${post.id}`,
    slug: post.slug || slugify(title),
    title,
    category: category?.name ?? "",
    excerpt: decodeEntities(stripHtml(post.excerpt?.rendered ?? "")),
    content: post.content?.rendered ?? "",
    image: wpFeaturedImage(post) || fallbackImage,
    date: post.date ?? "",
  };
}

export function toSettings(post: WpPost): Partial<SiteSettings> {
  const fields = wpFields(post);
  return {
    telefono: text(fields.telefono),
    email: text(fields.email),
    whatsapp: text(fields.whatsapp),
    direccion: text(fields.direccion),
    horario: text(fields.horario),
    linkedin: text(fields.linkedin),
    facebook: text(fields.facebook),
    instagram: text(fields.instagram),
  };
}
