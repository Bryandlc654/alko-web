import type { Locale } from "@/lib/i18n";

/**
 * Textos de la página del estudio (/nosotros y /en/about).
 *
 * En castellano mandan los textos del panel (estos son solo los fijos de la página). En inglés
 * no hay panel: `content` adapta los textos que hoy tiene el panel y las fotos siguen saliendo
 * de él, así que una foto cambiada en el panel se ve en los dos idiomas.
 */
const es = {
  meta: {
    title: "ALKO, empresa de reformas integrales en Madrid desde 1996",
    description:
      "Empresa de reformas integrales y construcción en Madrid desde 1996: un único equipo responde de proyecto, compras, instalaciones y acabados hasta la entrega.",
  },
  breadcrumb: "Nosotros",
  eyebrow: "Estudio",
  headerAlt: "Cocina abierta al jardín y la piscina en una vivienda reformada por ALKO",
  caption: "Estudio ALKO",
  viewProjects: "Ver proyectos",
  method: "Conoce el método",
  projectLabel: "Proyecto",
  figuresLabel: "ALKO en cifras",
  methodAlt: "Equipo de ALKO revisando planos en obra",
  pillarAlt: (title: string) => `${title} en una obra de ALKO`,
  moreLabel: "Más sobre ALKO",
  links: {
    team: { tag: "Equipo", title: "Las personas detrás de cada obra", alt: "Jefe de obra de ALKO revisando planos con el equipo" },
    careers: { tag: "Trabaja con nosotros", title: "Buscamos profesionales con criterio", alt: "Operario de ALKO terminando una reforma en Madrid" },
  },
  process: { phase: "Fase" },
  /** Solo en inglés: el castellano usa el contenido del panel. */
  content: null as AboutContent | null,
};

/** Contenido de la página en un idioma sin panel (mismo orden que en el panel). */
export interface AboutContent {
  headerTitulo: string;
  headerDescripcion: string;
  introTag: string;
  introTitulo: string;
  introLead: string;
  introCol1: string;
  introCol2: string;
  /** Etiqueta de cada cifra del panel, por su texto en castellano. Las que no estén aquí no se muestran. */
  cifras: Record<string, string>;
  pilaresTag: string;
  pilaresTitulo: string;
  pilaresDescripcion: string;
  pilares: { titulo: string; texto: string }[];
  metodoTag: string;
  metodoTitulo: string;
  metodoLead: string;
  metodoCol1: string;
  metodoCol2: string;
  procesoTitulo: string;
  procesoSubtitulo: (fases: number) => string;
  procesoColText: string;
  valoresTag: string;
  valoresTitulo: string;
  valoresDescripcion: string;
  valores: { titulo: string; texto: string }[];
}

export type AboutCopy = typeof es;

const en: AboutCopy = {
  meta: {
    title: "About ALKO, renovation and construction company in Madrid",
    description:
      "Renovation and construction company in Madrid since 1996: one team takes responsibility for design, procurement, building services and finishes through to handover.",
  },
  breadcrumb: "About",
  eyebrow: "Studio",
  headerAlt: "Kitchen opening onto the garden and pool in a home renovated by ALKO",
  caption: "ALKO Studio",
  viewProjects: "View projects",
  method: "Discover our method",
  projectLabel: "Project",
  figuresLabel: "ALKO in figures",
  methodAlt: "ALKO team reviewing drawings on site",
  pillarAlt: (title: string) => `${title} on an ALKO project`,
  moreLabel: "More about ALKO",
  links: {
    team: { tag: "Team", title: "The people behind every project", alt: "ALKO site manager reviewing drawings with the team" },
    careers: { tag: "Careers", title: "We’re looking for professionals with judgement", alt: "ALKO tradesman finishing a renovation in Madrid" },
  },
  process: { phase: "Stage" },
  content: {
    headerTitulo: "Architecture.\nConstruction.\nIntegrated management.",
    headerDescripcion: "Construction and full renovation studio in Madrid. Fewer hand-offs, more control.",
    introTag: "About ALKO · Since 1996",
    introTitulo: "One standard for every project.",
    introLead:
      "We build and renovate spaces you would want to live and work in, with a single person in charge from the first visit to handover.",
    introCol1:
      "We coordinate design, procurement, building services and finishes under one technical management team, so every decision is taken with the whole project in view.",
    introCol2:
      "Full renovations, new builds and fit-outs of homes, offices and commercial spaces, with no middlemen and no surprises.",
    cifras: {
      "Construyendo y reformando en Madrid": "Building and renovating in Madrid",
      "Interlocutor para todo el proyecto": "Point of contact for the whole project",
      "Servicios y sectores especializados": "Specialist services and sectors",
      "Fases de control por obra": "Control stages per project",
    },
    pilaresTag: "How we work",
    pilaresTitulo: "Three disciplines, one management team.",
    pilaresDescripcion:
      "What would be three separate companies on other projects is, at ALKO, one team that is accountable from start to finish.",
    pilares: [
      {
        titulo: "Architecture",
        texto:
          "We start from the design and its technical feasibility: measurements, construction details and materials are defined before work begins.",
      },
      {
        titulo: "Construction",
        texto:
          "We carry out the structural work, building services and finishes in planned stages, with tolerances checked on every work package.",
      },
      {
        titulo: "Integrated management",
        texto:
          "One team coordinates procurement, trades and schedules, so design and construction answer to a single technical lead.",
      },
    ],
    metodoTag: "The ALKO method",
    metodoTitulo: "One lead, many hands.",
    metodoLead:
      "Coordinate before you build: a single team keeps construction, building services, procurement and technical management under control from start to finish.",
    metodoCol1:
      "We work as one team, not as separate departments. Before work starts we set the sequence, the schedule and the critical purchases so each trade comes in at exactly the right time.",
    metodoCol2:
      "That coordination cuts hand-offs, speeds up decisions and keeps the project technically consistent. The result is a predictable build, with no surprises on time or cost.",
    procesoTitulo: "Our process",
    procesoSubtitulo: (fases: number) => `Our process · ${fases} stages · 1 team`,
    procesoColText:
      "A single team coordinates construction, building services, procurement and technical management to keep the project under control.",
    valoresTag: "Values",
    valoresTitulo: "What makes the difference.",
    valoresDescripcion: "Four commitments we apply in the same way to a home and to a corporate headquarters.",
    valores: [
      {
        titulo: "One point of contact",
        texto:
          "A single technical lead is accountable for design, procurement, trades and construction. No middlemen, no conflicting versions.",
      },
      {
        titulo: "Controlled timelines",
        texto: "Planning in stages with clear milestones and continuous tracking of progress on site.",
      },
      {
        titulo: "Predictable costs",
        texto: "Work packages defined from the quote and purchases made in advance to reduce surprises.",
      },
      {
        titulo: "Verified quality",
        texto: "Technical checks at every stage, testing and a review of finishes through to handover.",
      },
    ],
  },
};

export const ABOUT_COPY: Record<Locale, AboutCopy> = { es, en };
