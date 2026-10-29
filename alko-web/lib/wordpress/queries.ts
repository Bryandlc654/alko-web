import { getDbHomeContent, getFeaturedProjectIds, getDbProjects, getDbSectors, getDbArticles, getDbGuides, getDbSettings } from "../db/mysql";
import {
  DEFAULT_ARTICLES,
  DEFAULT_DESCARGAS,
  DEFAULT_FABRICANTES,
  DEFAULT_FASES,
  DEFAULT_GUIDES,
  DEFAULT_HERO_SLIDES,
  DEFAULT_HOME_CONTENT,
  DEFAULT_PROJECTS,
  DEFAULT_SECTORS,
  DEFAULT_SETTINGS,
  DEFAULT_SHOWCASE_SLIDES,
} from "../content";
import type {
  Article,
  Descarga,
  Fabricante,
  Fase,
  Guide,
  HomeContent,
  HomeData,
  Project,
  Sector,
  SiteSettings,
  Slide,
} from "../types";
import { wpGet, type WpPost } from "./client";
import {
  toArticle,
  toDescarga,
  toFabricante,
  toFase,
  toGuide,
  toProject,
  toSector,
  toHomeContent,
  toSettings,
  toSlide,
} from "./normalizers";

/**
 * Consultas públicas de contenido.
 *
 * Prioriza los datos de MySQL / Editor visual. Si no están configurados,
 * consulta WordPress o recurre al contenido por defecto.
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
  try {
    const dbContent = await getDbHomeContent();
    if (dbContent.heroSlides && dbContent.heroSlides.length > 0) {
      return dbContent.heroSlides;
    }
  } catch (e) {
    // Continuar a fallback
  }

  const posts = await collection(SLIDES_QUERY);
  const hero = (posts ?? []).filter((p) => (p.acf ?? p.scf)?.grupo !== "showcase");
  if (hero.length === 0) return DEFAULT_HERO_SLIDES;
  return hero.map(toSlide);
}

export async function getShowcaseSlides(): Promise<Slide[]> {
  try {
    const dbContent = await getDbHomeContent();
    if (dbContent.workshopSlides && dbContent.workshopSlides.length > 0) {
      return dbContent.workshopSlides;
    }
  } catch (e) {
    // Continuar a fallback
  }

  const posts = await collection(SLIDES_QUERY);
  const showcase = (posts ?? []).filter((p) => (p.acf ?? p.scf)?.grupo === "showcase");
  if (showcase.length === 0) return DEFAULT_SHOWCASE_SLIDES;
  return showcase.map(toSlide);
}

/* ------------------------------- Proyectos -------------------------------- */

export async function getProjects(): Promise<Project[]> {
  try {
    const dbProjects = await getDbProjects();
    if (dbProjects && dbProjects.length > 0) {
      return dbProjects;
    }
  } catch (err) {
    console.warn("Error leyendo proyectos de MySQL:", err);
  }

  const posts = await collection(`proyectos?${COLLECTION_ORDER}`);
  if (!posts || posts.length === 0) return DEFAULT_PROJECTS;
  return posts.map((post, i) =>
    withFallbackImage(toProject(post, i), DEFAULT_PROJECTS[i % DEFAULT_PROJECTS.length]?.imagen),
  );
}

/**
 * Obtiene los proyectos que deben mostrarse en la portada:
 * Filtra por los que el usuario haya seleccionado en el módulo de proyectos (máx 3).
 * Si aún no ha seleccionado ninguno, muestra los primeros 3.
 */
export async function getFeaturedHomeProjects(): Promise<Project[]> {
  const allProjects = await getProjects();
  try {
    const featuredIds = await getFeaturedProjectIds();
    if (featuredIds.length > 0) {
      const selected = allProjects.filter((p) =>
        featuredIds.includes(String(p.id)) || featuredIds.includes(p.slug)
      );
      if (selected.length > 0) {
        return selected.slice(0, 3);
      }
    }
  } catch (err) {
    console.warn("Aviso: Error filtrando proyectos destacados de home:", err);
  }

  return allProjects.slice(0, 3);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const dbProjects = await getDbProjects();
    const found = dbProjects.find((p) => p.slug === slug || String(p.id) === slug);
    if (found) return found;
  } catch (err) {
    console.warn("Error buscando proyecto en MySQL:", err);
  }

  const posts = await wpGet<WpPost[]>(`proyectos?slug=${encodeURIComponent(slug)}&_embed`);
  if (posts && posts.length > 0) return toProject(posts[0], 0);
  return DEFAULT_PROJECTS.find((project) => project.slug === slug) ?? null;
}

export async function getProjectsBySector(sectorSlug: string): Promise<Project[]> {
  const all = await getProjects();
  return all.filter((p) => p.servicio === sectorSlug);
}

/* -------------------------------- Sectores -------------------------------- */

export async function getSectors(): Promise<Sector[]> {
  try {
    const dbSectors = await getDbSectors();
    if (dbSectors && dbSectors.length > 0) {
      return dbSectors;
    }
  } catch (err) {
    console.warn("Aviso: Error obteniendo sectores de MySQL:", err);
  }

  const posts = await collection(`sectores?${COLLECTION_ORDER}`);
  if (!posts || posts.length === 0) return DEFAULT_SECTORS;
  return posts.map((post, i) =>
    withFallbackImage(toSector(post, i), DEFAULT_SECTORS[i % DEFAULT_SECTORS.length]?.imagen),
  );
}

export async function getSectorBySlug(slug: string): Promise<Sector | null> {
  try {
    const dbSectors = await getDbSectors();
    const found = dbSectors.find((s) => s.slug === slug || String(s.id) === slug);
    if (found) return found;
  } catch (err) {
    console.warn("Aviso: Error buscando sector en MySQL:", err);
  }

  const posts = await wpGet<WpPost[]>(`sectores?slug=${encodeURIComponent(slug)}&_embed`);
  if (posts && posts.length > 0) return toSector(posts[0], 0);
  return DEFAULT_SECTORS.find((sector) => sector.slug === slug) ?? null;
}

/* ---------------------------------- Fases --------------------------------- */

export async function getFases(): Promise<Fase[]> {
  const posts = await collection(`fases?${COLLECTION_ORDER}`);
  if (!posts || posts.length === 0) return DEFAULT_FASES;
  return posts.map((post, i) =>
    withFallbackImage(toFase(post, i), DEFAULT_FASES[i % DEFAULT_FASES.length]?.imagen),
  );
}

/* ------------------------------- Fabricantes ------------------------------ */

export async function getFabricantes(): Promise<Fabricante[]> {
  const posts = await collection(`fabricantes?${COLLECTION_ORDER}`);
  if (!posts || posts.length === 0) return DEFAULT_FABRICANTES;
  return posts.map(toFabricante);
}

/* ------------------------------- Artículos -------------------------------- */

/** Categoría de WordPress cuyas entradas se muestran como «Actualidad» (dentro de Guías). */
const NEWS_CATEGORY_SLUG = "actualidad";

async function newsCategoryId(): Promise<number | null> {
  const categories = await wpGet<{ id: number }[]>(
    `categories?slug=${NEWS_CATEGORY_SLUG}&_fields=id`,
  );
  return categories && categories.length > 0 ? categories[0].id : null;
}

/** Artículos técnicos: todas las entradas salvo las de la categoría Actualidad. */
export async function getArticles(limit = 6): Promise<Article[]> {
  try {
    const dbArticles = await getDbArticles();
    if (dbArticles && dbArticles.length > 0) {
      return dbArticles.slice(0, limit);
    }
  } catch (err) {
    console.warn("Aviso: Error obteniendo artículos de MySQL:", err);
  }

  const newsId = await newsCategoryId();
  const exclude = newsId ? `&categories_exclude=${newsId}` : "";
  const posts = await wpGet<WpPost[]>(`posts?per_page=${limit}&_embed${exclude}`);
  if (!posts || posts.length === 0) return DEFAULT_ARTICLES;
  return posts.map((post, i) =>
    toArticle(post, DEFAULT_ARTICLES[i % DEFAULT_ARTICLES.length]?.image),
  );
}

/** Novedades de ALKO (categoría Actualidad). Sin respaldo: si no hay, la sección no se muestra. */
export async function getNews(limit = 4): Promise<Article[]> {
  const newsId = await newsCategoryId();
  if (!newsId) return [];
  const posts = await wpGet<WpPost[]>(`posts?per_page=${limit}&categories=${newsId}&_embed`);
  return (posts ?? []).map((post) => toArticle(post));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const dbArticles = await getDbArticles();
    const found = dbArticles.find((a) => a.slug === slug || String(a.id) === slug);
    if (found) return found;
  } catch (err) {
    console.warn("Aviso: Error buscando artículo en MySQL:", err);
  }

  const posts = await wpGet<WpPost[]>(`posts?slug=${encodeURIComponent(slug)}&_embed`);
  if (posts && posts.length > 0) return toArticle(posts[0]);
  return DEFAULT_ARTICLES.find((article) => article.slug === slug) ?? null;
}

/* --------------------------------- Guías ---------------------------------- */

/** Descargables (PDF) que acompañan a las guías. */
export async function getDescargas(): Promise<Descarga[]> {
  const posts = await collection(`descargas?${COLLECTION_ORDER}`);
  const items = (posts ?? []).map(toDescarga).filter((item) => item.archivo);
  return items.length > 0 ? items : DEFAULT_DESCARGAS;
}

export async function getGuides(): Promise<Guide[]> {
  try {
    const dbGuides = await getDbGuides();
    if (dbGuides && dbGuides.length > 0) {
      return dbGuides;
    }
  } catch (err) {
    console.warn("Aviso: Error obteniendo guías de MySQL:", err);
  }

  const posts = await collection(`guias?${COLLECTION_ORDER}`);
  if (!posts || posts.length === 0) return DEFAULT_GUIDES;
  return posts.map((post, i) =>
    withFallbackImage(toGuide(post, i), DEFAULT_GUIDES[i % DEFAULT_GUIDES.length]?.imagen),
  );
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  try {
    const dbGuides = await getDbGuides();
    const found = dbGuides.find((g) => g.slug === slug || String(g.id) === slug);
    if (found) return found;
  } catch (err) {
    console.warn("Aviso: Error buscando guía en MySQL:", err);
  }

  const posts = await wpGet<WpPost[]>(`guias?slug=${encodeURIComponent(slug)}&_embed`);
  if (posts && posts.length > 0) return toGuide(posts[0], 0);
  return DEFAULT_GUIDES.find((guide) => guide.slug === slug) ?? null;
}

/* -------------------------------- Ajustes --------------------------------- */

export async function getSettings(): Promise<SiteSettings> {
  try {
    const dbSettings = await getDbSettings();
    if (dbSettings && Object.keys(dbSettings).length > 0) {
      return dbSettings;
    }
  } catch (err) {
    console.warn("Aviso: Error obteniendo ajustes de MySQL:", err);
  }

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

/* -------------------------- Portada Completa ------------------------------ */

export async function getHomeContent(): Promise<HomeContent> {
  const dbHome = await getDbHomeContent();
  if (dbHome && Object.keys(dbHome).length > 0) {
    return dbHome;
  }

  const post = await wpGet<WpPost>("paginas/inicio");
  if (!post) return DEFAULT_HOME_CONTENT;
  const remote = toHomeContent(post);

  return {
    heroTitulo: remote.heroTitulo || DEFAULT_HOME_CONTENT.heroTitulo,
    heroSubtitulo: remote.heroSubtitulo || DEFAULT_HOME_CONTENT.heroSubtitulo,
    heroDescripcion: remote.heroDescripcion || DEFAULT_HOME_CONTENT.heroDescripcion,
    heroCtaTexto: remote.heroCtaTexto || DEFAULT_HOME_CONTENT.heroCtaTexto,
    heroSecundarioTexto: remote.heroSecundarioTexto || DEFAULT_HOME_CONTENT.heroSecundarioTexto,
    heroSlides: DEFAULT_HERO_SLIDES,

    proyectosTitulo: remote.proyectosTitulo || DEFAULT_HOME_CONTENT.proyectosTitulo,
    proyectosSubtitulo: remote.proyectosSubtitulo || DEFAULT_HOME_CONTENT.proyectosSubtitulo,
    proyectosCtaTexto: remote.proyectosCtaTexto || DEFAULT_HOME_CONTENT.proyectosCtaTexto,

    procesoTitulo: remote.procesoTitulo || DEFAULT_HOME_CONTENT.procesoTitulo,
    procesoSubtitulo: remote.procesoSubtitulo || DEFAULT_HOME_CONTENT.procesoSubtitulo,

    serviciosTag: remote.serviciosTag || DEFAULT_HOME_CONTENT.serviciosTag,
    serviciosTitulo: remote.serviciosTitulo || DEFAULT_HOME_CONTENT.serviciosTitulo,
    serviciosDescripcion: remote.serviciosDescripcion || DEFAULT_HOME_CONTENT.serviciosDescripcion,

    workshopBadge: remote.workshopBadge || DEFAULT_HOME_CONTENT.workshopBadge,
    workshopTitulo: remote.workshopTitulo || DEFAULT_HOME_CONTENT.workshopTitulo,
    workshopDescripcion: remote.workshopDescripcion || DEFAULT_HOME_CONTENT.workshopDescripcion,
    workshopSlides: DEFAULT_SHOWCASE_SLIDES,

    experienciaImagen: remote.experienciaImagen || DEFAULT_HOME_CONTENT.experienciaImagen,
    experienciaBadges:
      remote.experienciaBadges && remote.experienciaBadges.length > 0
        ? remote.experienciaBadges
        : DEFAULT_HOME_CONTENT.experienciaBadges,

    materialesTag: remote.materialesTag || DEFAULT_HOME_CONTENT.materialesTag,
    materialesTitulo: remote.materialesTitulo || DEFAULT_HOME_CONTENT.materialesTitulo,
    materialesDescripcion: remote.materialesDescripcion || DEFAULT_HOME_CONTENT.materialesDescripcion,

    articulosTag: remote.articulosTag || DEFAULT_HOME_CONTENT.articulosTag,
    articulosTitulo: remote.articulosTitulo || DEFAULT_HOME_CONTENT.articulosTitulo,
    articulosCtaTexto: remote.articulosCtaTexto || DEFAULT_HOME_CONTENT.articulosCtaTexto,

    contactoTitulo: remote.contactoTitulo || DEFAULT_HOME_CONTENT.contactoTitulo,
    contactoDescripcion: remote.contactoDescripcion || DEFAULT_HOME_CONTENT.contactoDescripcion,
    contactoBgImagen: DEFAULT_HOME_CONTENT.contactoBgImagen,
  };
}

export async function getHomeData(): Promise<HomeData> {
  const [heroSlides, showcaseSlides, projects, sectors, fases, fabricantes, articles, settings, homeContent] =
    await Promise.all([
      getHeroSlides(),
      getShowcaseSlides(),
      getFeaturedHomeProjects(),
      getSectors(),
      getFases(),
      getFabricantes(),
      getArticles(),
      getSettings(),
      getHomeContent(),
    ]);

  return { heroSlides, showcaseSlides, projects, sectors, fases, fabricantes, articles, settings, homeContent };
}
