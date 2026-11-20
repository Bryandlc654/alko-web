import { ARTICLES_EN, GUIDES_EN } from "@/lib/i18n/journal-content";
import type { Locale } from "@/lib/i18n";
import type { Article, Guide } from "@/lib/types";

/**
 * Textos del listado del Journal (/journal y /en/journal).
 *
 * Los artículos y guías están escritos en castellano. En la versión inglesa, el listado traduce
 * el título, la entradilla y la categoría de cada tarjeta (por su slug, en `articles` y `guides`)
 * y avisa de que el texto completo está en castellano. Lo que no tenga traducción aquí se
 * muestra tal cual, así que un artículo nuevo aparece en castellano hasta que se añada.
 */
const es = {
  meta: {
    title: "Blog de reformas: guías y consejos técnicos | ALKO Journal",
    description:
      "Artículos y guías de ALKO para planificar una reforma en Madrid: costes, plazos, materiales, climatización, instalaciones y gestión de obra.",
    listName: "Artículos y guías del Journal de ALKO",
  },
  breadcrumb: "Journal",
  header: {
    eyebrow: "Journal",
    title: "Criterio técnico,\npor escrito.",
    description: "Detalles constructivos, instalaciones y gestión de obra explicados por el equipo que los ejecuta cada día.",
    nav: "Secciones del Journal",
    articles: "Artículos",
    guides: "Guías",
    latest: "Última publicación",
  },
  /** Aviso de idioma bajo la cabecera (solo en otros idiomas). */
  languageNote: "",
  featured: "Destacado",
  readArticle: "Leer artículo",
  archive: {
    label: "Archivo",
    title: "Todos los artículos",
    intro: "Filtra por tema. Cada artículo, escrito por quien lo ejecuta en obra.",
    all: "Todos",
    filterLabel: "Filtrar por categoría",
    read: "Leer",
    empty: "No hay artículos en esta categoría todavía.",
  },
  guidesSection: {
    label: "Guías paso a paso",
    title: "Guías",
    intro: "Recorridos paso a paso por las decisiones clave de una obra: planificación, presupuesto, materiales y entrega.",
    guide: "Guía",
    reading: (time: string) => `${time} de lectura`,
    read: "Leer guía",
  },
  source: "Formulario journal · /journal",
  categories: {} as Record<string, string>,
  articles: {} as Record<string, { title: string; excerpt?: string }>,
  guides: {} as Record<string, { title: string; descripcion?: string }>,
  themes: {} as Record<string, string>,
};

export type JournalCopy = typeof es;

const en: JournalCopy = {
  meta: {
    title: "Renovation blog: guides and technical advice | ALKO Journal",
    description:
      "ALKO articles and guides for planning a renovation in Madrid: costs, timelines, materials, HVAC, building services and site management.",
    listName: "ALKO Journal articles and guides",
  },
  breadcrumb: "Journal",
  header: {
    eyebrow: "Journal",
    title: "Technical judgement,\nin writing.",
    description: "Construction details, building services and site management, explained by the team that delivers them every day.",
    nav: "Journal sections",
    articles: "Articles",
    guides: "Guides",
    latest: "Latest post",
  },
  languageNote: "",
  featured: "Featured",
  readArticle: "Read article",
  archive: {
    label: "Archive",
    title: "All articles",
    intro: "Filter by topic. Every article is written by the people who do the work on site.",
    all: "All",
    filterLabel: "Filter by category",
    read: "Read",
    empty: "There are no articles in this category yet.",
  },
  guidesSection: {
    label: "Step-by-step guides",
    title: "Guides",
    intro: "Step-by-step walkthroughs of the key decisions in a project: planning, budget, materials and handover.",
    guide: "Guide",
    reading: (time: string) => `${time} read`,
    read: "Read guide",
  },
  source: "Formulario journal · /en/journal",
  categories: {
    Instalaciones: "Building services",
    Materiales: "Materials",
    Metodología: "Method",
    Estructuras: "Structures",
    Oficinas: "Offices",
    General: "General",
    Noticias: "News",
    Climatización: "HVAC",
    Diseño: "Design",
  },
  // Títulos y extractos en inglés: los de la traducción completa (lib/i18n/journal-content).
  articles: Object.fromEntries(Object.entries(ARTICLES_EN).map(([slug, a]) => [slug, { title: a.title, excerpt: a.excerpt }])),
  guides: {
    ...Object.fromEntries(Object.entries(GUIDES_EN).map(([slug, g]) => [slug, { title: g.title, descripcion: g.descripcion }])),
    "checklist-obra": {
      title: "Technical checklist for accepting finished works",
    },
  },
  themes: {
    PLANIFICACIÓN: "PLANNING",
    PRESUPUESTO: "BUDGET",
    MATERIALES: "MATERIALS",
    ENTREGA: "HANDOVER",
    RECEPCIÓN: "ACCEPTANCE",
    INSTALACIONES: "BUILDING SERVICES",
  },
};

export const JOURNAL_COPY: Record<Locale, JournalCopy> = { es, en };

/** Artículo con sus textos de tarjeta en el idioma; `translated` indica si hay traducción. */
export function localizeArticle(article: Article, locale: Locale) {
  const t = JOURNAL_COPY[locale];
  const tr = t.articles[article.slug];
  const category = article.category || "General";
  return {
    ...article,
    title: tr?.title ?? article.title,
    excerpt: tr ? (tr.excerpt ?? "") : article.excerpt,
    category: t.categories[category] ?? category,
    // Cuerpo completo: en inglés, el de la traducción (vacío si no la hay).
    content: locale === "es" ? article.content : (ARTICLES_EN[article.slug]?.content ?? ""),
    translated: locale === "es" || !!tr,
    /** Si tiene página propia en este idioma (en inglés, solo si el artículo entero está traducido). */
    hasPage: locale === "es" || !!ARTICLES_EN[article.slug],
  };
}

/** Guía con sus textos de tarjeta en el idioma; `translated` indica si hay traducción. */
export function localizeGuide(guide: Guide, locale: Locale) {
  const t = JOURNAL_COPY[locale];
  const tr = t.guides[guide.slug];
  return {
    ...guide,
    title: tr?.title ?? guide.title,
    descripcion: tr ? (tr.descripcion ?? "") : guide.descripcion,
    tema: t.themes[guide.tema?.trim().toUpperCase()] ?? guide.tema,
    content: locale === "es" ? guide.content : (GUIDES_EN[guide.slug]?.content ?? ""),
    translated: locale === "es" || !!tr,
    hasPage: locale === "es" || !!GUIDES_EN[guide.slug],
  };
}

export type LocalizedArticle = ReturnType<typeof localizeArticle>;
export type LocalizedGuide = ReturnType<typeof localizeGuide>;
