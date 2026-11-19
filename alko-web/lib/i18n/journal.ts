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
  languageNote: "Our articles and guides are written in Spanish. Here you’ll find what each one covers.",
  featured: "Featured",
  readArticle: "Read article (in Spanish)",
  archive: {
    label: "Archive",
    title: "All articles",
    intro: "Filter by topic. Every article is written by the people who do the work on site.",
    all: "All",
    filterLabel: "Filter by category",
    read: "Read (in Spanish)",
    empty: "There are no articles in this category yet.",
  },
  guidesSection: {
    label: "Step-by-step guides",
    title: "Guides",
    intro: "Step-by-step walkthroughs of the key decisions in a project: planning, budget, materials and handover.",
    guide: "Guide",
    reading: (time: string) => `${time} read`,
    read: "Read guide (in Spanish)",
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
  articles: {
    "suelo-radiante-con-aerotermia": {
      title: "Underfloor heating with aerothermal heat pumps: how it works, what it costs and when it pays off",
      excerpt:
        "The most efficient way to heat and cool a home: low-temperature water, heat spread across the whole floor and summer cooling from the same system. What you need to know before deciding.",
    },
    "porcelanico-de-gran-formato-instalacion": {
      title: "Large-format porcelain tiles: the keys to an installation without lippage or broken pieces",
      excerpt:
        "Tiles of 120×120, 160×320 or larger transform a space, but they don’t forgive mistakes. Substrate, adhesive, joints and handling: what separates a flawless finish from one that has to be ripped out.",
    },
    "como-planificar-una-reforma-integral-sin-desviaciones": {
      title: "How to plan a full renovation without time or budget overruns",
      excerpt:
        "A complete construction design, an itemised quote, a phased schedule and every change in writing: the method that gets the job finished when and how it was agreed.",
    },
    "domotica-y-electricidad-en-viviendas-unifamiliares": {
      title: "Home automation and electrics in detached houses: how to design a connected home",
      excerpt:
        "Lighting, climate, blinds, security and energy controlled from a single system. What to decide before the first cable goes in, so the house works today and can grow tomorrow.",
    },
    "construir-una-piscina-en-enero": {
      title: "Building a pool in January: why winter is the best time to start",
      excerpt:
        "Start your pool in spring and you’ll usually first swim in it at the end of summer. Permit, excavation, shell, services and finishes: how the work is organised so it’s ready in June.",
    },
    "reforma-de-oficinas-sin-parar-la-actividad": {
      title: "Renovating offices without stopping work: how a phased project is organised",
      excerpt:
        "Phasing plans, internal moves, site hoarding and noisy work out of hours: how a headquarters is renewed while the team keeps working.",
    },
    "carpinteria-a-medida": {
      title: "Bespoke joinery: wardrobes, doors and panelling designed with the home",
      excerpt:
        "Bespoke interior joinery makes use of every centimetre and brings the whole home together. Materials, hardware, manufacturing lead times and how it is coordinated with the rest of the works.",
    },
    "climatizacion-industrial": {
      title: "Industrial HVAC: how to choose the system for warehouses and large-volume spaces",
      excerpt:
        "In a warehouse the challenge isn’t just cooling or heating: it’s doing it at great heights, with open doors, internal loads and controlled consumption. Systems, design criteria and mistakes that raise running costs.",
    },
    "acabados-para-hosteleria-y-retail": {
      title: "Finishes for hospitality and retail: materials that stand up to heavy use",
      excerpt:
        "Floors, walls and work surfaces for hotels, restaurants and shops: how to choose materials that withstand foot traffic, daily cleaning and the passing years.",
    },
  },
  guides: {
    "guia-reforma-integral": {
      title: "The complete guide to taking on a full renovation",
      descripcion:
        "Step by step, from defining your needs to handing over the keys: budget, design, permits in Madrid, contract, order of works, acceptance and guarantees.",
    },
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
    translated: locale === "es" || !!tr,
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
    translated: locale === "es" || !!tr,
  };
}

export type LocalizedArticle = ReturnType<typeof localizeArticle>;
export type LocalizedGuide = ReturnType<typeof localizeGuide>;
