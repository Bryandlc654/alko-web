import type { Locale } from "@/lib/i18n";

/**
 * Textos del listado de proyectos (/proyectos y /en/projects). Los datos de cada obra
 * (nombre, tipología, ubicación, extracto) vienen del panel y no se traducen.
 */
const es = {
  meta: {
    title: "Proyectos de reformas integrales en Madrid | ALKO",
    description:
      "Obras de ALKO en Madrid: reformas integrales de viviendas, oficinas y locales, con fotos, alcance y acabados. Un único equipo de proyecto a entrega.",
    /** Nombre de la lista de obras en los datos estructurados. */
    listName: "Proyectos de ALKO",
  },
  sourceSuffix: "",
  breadcrumb: "Proyectos",
  /** Valores por defecto de la cabecera (en castellano manda el panel). */
  header: {
    eyebrow: "Proyectos",
    title: "Proyectos",
    description: "Obras residenciales y corporativas ejecutadas con dirección técnica unificada y rigor constructivo.",
  },
  stats: { works: "Obras", types: "Tipologías", period: "Periodo" },
  gallery: {
    eyebrow: "Portfolio",
    title: "Todas las obras.",
    text: "Viviendas, oficinas y locales ejecutados con dirección técnica unificada. Entra en cada uno para ver su ficha completa.",
    all: "Todos",
    filterLabel: "Filtrar por tipología",
    exclusive: "ALKO Exclusiva",
    loadingMore: "Cargando más obras...",
    showMore: "Mostrar más obras",
    showing: (shown: number, total: number) => `Mostrando ${shown} de ${total} proyectos`,
    seenAll: (total: number) => `Has visto todas las obras (${total})`,
    /** Nombre visible de cada categoría del filtro (la clave es la categoría interna). */
    categories: {} as Record<string, string>,
    /** El extracto viene del panel en castellano: solo se muestra en castellano. */
    showExcerpt: true,
  },
};

export type ProjectsCopy = typeof es;

const en: ProjectsCopy = {
  meta: {
    title: "Renovation projects in Madrid | ALKO",
    description:
      "Renovation projects by ALKO in Madrid: full renovations of homes, offices and commercial spaces, with photos, scope and finishes, delivered by a single team.",
    listName: "ALKO projects",
  },
  sourceSuffix: " · EN",
  breadcrumb: "Projects",
  header: {
    eyebrow: "Projects",
    title: "Projects",
    description: "Residential and commercial projects delivered with unified technical management and careful construction.",
  },
  stats: { works: "Projects", types: "Types", period: "Period" },
  gallery: {
    eyebrow: "Portfolio",
    title: "All our work.",
    text: "Homes, offices and commercial spaces delivered with unified technical management. Open each one to see its full case study (in Spanish).",
    all: "All",
    filterLabel: "Filter by type",
    exclusive: "ALKO Exclusive",
    loadingMore: "Loading more projects...",
    showMore: "Show more projects",
    showing: (shown: number, total: number) => `Showing ${shown} of ${total} projects`,
    seenAll: (total: number) => `You’ve seen all our projects (${total})`,
    categories: {
      "Reformas integrales": "Full renovations",
      "Vivienda unifamiliar": "Detached houses",
      Cocinas: "Kitchens",
      Baños: "Bathrooms",
    },
    showExcerpt: false,
  },
};

export const PROJECTS_COPY: Record<Locale, ProjectsCopy> = { es, en };
