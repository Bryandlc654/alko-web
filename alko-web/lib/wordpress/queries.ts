import {
  DEFAULT_ARTICLES,
  DEFAULT_FABRICANTES,
  DEFAULT_FASES,
  DEFAULT_HERO_SLIDES,
  DEFAULT_PROJECTS,
  DEFAULT_SECTORS,
  DEFAULT_SETTINGS,
  DEFAULT_SHOWCASE_SLIDES,
} from "../content";
import type {
  Article,
  Fabricante,
  Fase,
  HomeData,
  Project,
  Sector,
  SiteSettings,
  Slide,
} from "../types";
import { wpGet, type WpPost } from "./client";
import {
  toArticle,
  toFabricante,
  toFase,
  toProject,
  toSector,
  toSettings,
  toSlide,
} from "./normalizers";

/**
 * Consultas públicas de contenido.
 *
 * Cada función intenta primero WordPress y, si no hay CMS o no hay datos,
 * devuelve el contenido por defecto. De este modo las páginas no necesitan
 * saber de dónde viene el contenido.
 */

const SLIDES_QUERY = "slides?per_page=50&orderby=menu_order&order=asc&_embed";
const COLLECTION_ORDER = "per_page=50&orderby=menu_order&order=asc&_embed";

async function collection(path: string): Promise<WpPost[] | null> {
  return wpGet<WpPost[]>(path);
}

function withFallbackImage<T extends { imagen: string }>(item: T, fallback?: string): T {
  if (item.imagen || !fallback) return item;
  return { ...item, imagen: fallback };
}

/* --------------------------------- Slides --------------------------------- */

export async function getHeroSlides(): Promise<Slide[]> {
  const posts = await collection(SLIDES_QUERY);
  const hero = (posts ?? []).filter((p) => (p.acf ?? p.scf)?.grupo !== "showcase");
  if (hero.length === 0) return DEFAULT_HERO_SLIDES;
  return hero.map(toSlide);
}

export async function getShowcaseSlides(): Promise<Slide[]> {
  const posts = await collection(SLIDES_QUERY);
  const showcase = (posts ?? []).filter((p) => (p.acf ?? p.scf)?.grupo === "showcase");
  if (showcase.length === 0) return DEFAULT_SHOWCASE_SLIDES;
  return showcase.map(toSlide);
}

/* ------------------------------- Proyectos -------------------------------- */

export async function getProjects(): Promise<Project[]> {
  const posts = await collection(`proyectos?${COLLECTION_ORDER}`);
  if (!posts || posts.length === 0) return DEFAULT_PROJECTS;
  return posts.map((post, i) =>
    withFallbackImage(toProject(post, i), DEFAULT_PROJECTS[i % DEFAULT_PROJECTS.length]?.imagen),
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const posts = await wpGet<WpPost[]>(`proyectos?slug=${encodeURIComponent(slug)}&_embed`);
  if (posts && posts.length > 0) return toProject(posts[0], 0);
  return DEFAULT_PROJECTS.find((project) => project.slug === slug) ?? null;
}

/* -------------------------------- Sectores -------------------------------- */

export async function getSectors(): Promise<Sector[]> {
  const posts = await collection(`sectores?${COLLECTION_ORDER}`);
  if (!posts || posts.length === 0) return DEFAULT_SECTORS;
  return posts.map((post, i) =>
    withFallbackImage(toSector(post, i), DEFAULT_SECTORS[i % DEFAULT_SECTORS.length]?.imagen),
  );
}

export async function getSectorBySlug(slug: string): Promise<Sector | null> {
  const posts = await wpGet<WpPost[]>(`sectores?slug=${encodeURIComponent(slug)}&_embed`);
  if (posts && posts.length > 0) return toSector(posts[0], 0);
  return DEFAULT_SECTORS.find((sector) => sector.slug === slug) ?? null;
}

/* --------------------------------- Fases ---------------------------------- */

export async function getFases(): Promise<Fase[]> {
  const posts = await collection(`fases?${COLLECTION_ORDER}`);
  if (!posts || posts.length === 0) return DEFAULT_FASES;
  return posts.map(toFase);
}

/* ------------------------------ Fabricantes ------------------------------- */

export async function getFabricantes(): Promise<Fabricante[]> {
  const posts = await collection(`fabricantes?${COLLECTION_ORDER}`);
  if (!posts || posts.length === 0) return DEFAULT_FABRICANTES;
  return posts.map(toFabricante);
}

/* ------------------------------- Artículos -------------------------------- */

export async function getArticles(limit = 6): Promise<Article[]> {
  const posts = await wpGet<WpPost[]>(`posts?per_page=${limit}&_embed`);
  if (!posts || posts.length === 0) return DEFAULT_ARTICLES;
  return posts.map((post, i) =>
    toArticle(post, DEFAULT_ARTICLES[i % DEFAULT_ARTICLES.length]?.image),
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const posts = await wpGet<WpPost[]>(`posts?slug=${encodeURIComponent(slug)}&_embed`);
  if (posts && posts.length > 0) return toArticle(posts[0]);
  return DEFAULT_ARTICLES.find((article) => article.slug === slug) ?? null;
}

/* ------------------------------- Ajustes ---------------------------------- */

export async function getSettings(): Promise<SiteSettings> {
  const posts = await wpGet<WpPost[]>("ajustes?per_page=1");
  if (!posts || posts.length === 0) return DEFAULT_SETTINGS;
  const remote = toSettings(posts[0]);
  return {
    telefono: remote.telefono || DEFAULT_SETTINGS.telefono,
    email: remote.email || DEFAULT_SETTINGS.email,
    whatsapp: remote.whatsapp || DEFAULT_SETTINGS.whatsapp,
    direccion: remote.direccion || DEFAULT_SETTINGS.direccion,
    horario: remote.horario || DEFAULT_SETTINGS.horario,
    linkedin: remote.linkedin || DEFAULT_SETTINGS.linkedin,
    facebook: remote.facebook || DEFAULT_SETTINGS.facebook,
    instagram: remote.instagram || DEFAULT_SETTINGS.instagram,
  };
}

/* --------------------------------- Inicio --------------------------------- */

export async function getHomeData(): Promise<HomeData> {
  const [heroSlides, showcaseSlides, projects, sectors, fases, fabricantes, articles, settings] =
    await Promise.all([
      getHeroSlides(),
      getShowcaseSlides(),
      getProjects(),
      getSectors(),
      getFases(),
      getFabricantes(),
      getArticles(),
      getSettings(),
    ]);

  return { heroSlides, showcaseSlides, projects, sectors, fases, fabricantes, articles, settings };
}
