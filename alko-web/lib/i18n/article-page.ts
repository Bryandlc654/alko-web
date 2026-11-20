import type { Locale } from "@/lib/i18n";

/**
 * Textos fijos de las páginas de artículo (/journal/[slug], /en/journal/[slug]) y de guía
 * (/journal/guias/[slug], /en/journal/guides/[slug]).
 */
const es = {
  article: {
    reading: (minutes: number) => `${minutes} min de lectura`,
    share: "Compartir",
    back: "Volver al Journal",
    category: "Categoría",
    published: "Publicado",
    readingLabel: "Lectura",
    toc: "En este artículo",
    ctaLabel: "Tu proyecto",
    ctaTitle: "¿Tienes una obra parecida entre manos?",
    ctaText:
      "Cuéntanos qué necesitas y el equipo técnico de ALKO te responderá con una valoración del alcance, el plazo y el presupuesto.",
    cta: "Solicitar valoración",
    more: "Más del Journal",
    keepReading: "Sigue leyendo",
    seeJournal: "Ver el Journal",
  },
  guide: {
    breadcrumb: "Guías",
    guide: "Guía",
    stepByStep: "Guía paso a paso",
    reading: (time: string) => `${time} de lectura`,
    back: "Volver a las guías",
    topic: "Tema",
    readingLabel: "Lectura",
    toc: "En esta guía",
    ctaLabel: "Tu reforma",
    ctaTitle: "¿Estás preparando una reforma?",
    ctaText: "Cuéntanos qué tienes en mente y te ayudamos a plantearla: alcance, plazos y presupuesto.",
    cta: "Solicitar valoración",
    othersLabel: "Guías paso a paso",
    others: "Otras guías",
    seeAll: "Ver todas",
  },
};

export type ArticlePageCopy = typeof es;

const en: ArticlePageCopy = {
  article: {
    reading: (minutes: number) => `${minutes} min read`,
    share: "Share",
    back: "Back to the Journal",
    category: "Category",
    published: "Published",
    readingLabel: "Reading time",
    toc: "In this article",
    ctaLabel: "Your project",
    ctaTitle: "Working on a similar project?",
    ctaText: "Tell us what you need and the ALKO technical team will reply with an assessment of the scope, the schedule and the price.",
    cta: "Request an assessment",
    more: "More from the Journal",
    keepReading: "Keep reading",
    seeJournal: "See the Journal",
  },
  guide: {
    breadcrumb: "Guides",
    guide: "Guide",
    stepByStep: "Step-by-step guide",
    reading: (time: string) => `${time} read`,
    back: "Back to the guides",
    topic: "Topic",
    readingLabel: "Reading time",
    toc: "In this guide",
    ctaLabel: "Your renovation",
    ctaTitle: "Planning a renovation?",
    ctaText: "Tell us what you have in mind and we will help you plan it: scope, timescales and budget.",
    cta: "Request an assessment",
    othersLabel: "Step-by-step guides",
    others: "Other guides",
    seeAll: "See all",
  },
};

export const ARTICLE_PAGE_COPY: Record<Locale, ArticlePageCopy> = { es, en };
