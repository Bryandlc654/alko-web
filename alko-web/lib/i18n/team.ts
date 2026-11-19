import type { Locale } from "@/lib/i18n";

/**
 * Textos de la página del equipo (/equipo y /en/team).
 *
 * En castellano mandan los textos del panel (estos son los de respaldo). En inglés no hay panel:
 * se usan estos, los nombres de las personas salen del panel y su función se traduce con `roles`
 * (una función que no esté en la lista se muestra tal cual).
 */
const es = {
  meta: {
    title: "Equipo de ALKO, construcción y reformas en Madrid",
    description:
      "El equipo de ALKO: dirección técnica, arquitectura, jefatura de obra, instalaciones y atención al cliente, con un mismo criterio en cada obra de Madrid.",
  },
  breadcrumbParent: "Nosotros",
  breadcrumb: "Equipo",
  header: {
    eyebrow: "Equipo",
    title: "Personas detrás de cada obra",
    description:
      "Un equipo multidisciplinar que comparte un mismo criterio constructivo. Dirección técnica, arquitectura, obra, instalaciones y atención al cliente.",
    alt: "Jefe de obra de ALKO revisando planos con el equipo en obra",
    caption: "El equipo, en obra",
  },
  stats: { people: "Profesionales", lead: "Dirección de obra" },
  philosophy: {
    label: "Cómo trabajamos",
    title: "Menos compartimentos. Más equipo.",
    text: "Trabajamos como un solo equipo, no como departamentos aislados. Eso reduce interfaces, acelera decisiones y mantiene la coherencia del proyecto de principio a fin.",
    link: "Conoce el método ALKO",
  },
  grid: {
    tag: "Nuestro equipo",
    title: "Nuestros profesionales",
    intro: "Perfiles que comparten un mismo criterio constructivo y una sola dirección de obra.",
  },
  cta: {
    label: "Siguiente paso",
    title: "¿Sumamos tu proyecto al equipo?",
    description: "Cuéntanos qué necesitas y te ponemos en contacto con la persona adecuada.",
    button: "Solicitar consultoría",
    careers: "Trabaja con nosotros",
  },
  roles: {} as Record<string, string>,
};

export type TeamCopy = typeof es;

const en: TeamCopy = {
  meta: {
    title: "ALKO team, construction and renovation in Madrid",
    description:
      "Meet the ALKO team: technical management, architecture, site management, building services and client care, with one standard on every project in Madrid.",
  },
  breadcrumbParent: "About",
  breadcrumb: "Team",
  header: {
    eyebrow: "Team",
    title: "The people behind every project",
    description:
      "A multidisciplinary team that shares one construction standard. Technical management, architecture, site work, building services and client care.",
    alt: "ALKO site manager reviewing drawings with the team on site",
    caption: "The team, on site",
  },
  stats: { people: "Professionals", lead: "Site management" },
  philosophy: {
    label: "How we work",
    title: "Fewer silos. More team.",
    text: "We work as one team, not as separate departments. That cuts hand-offs, speeds up decisions and keeps the project consistent from start to finish.",
    link: "Discover the ALKO method",
  },
  grid: {
    tag: "Our team",
    title: "Our professionals",
    intro: "People who share one construction standard and a single site management team.",
  },
  cta: {
    label: "Next step",
    title: "Shall we add your project to the team?",
    description: "Tell us what you need and we’ll put you in touch with the right person.",
    button: "Request a consultation",
    careers: "Careers",
  },
  roles: {
    "Dirección técnica": "Technical management",
    Arquitectura: "Architecture",
    "Arquitectura técnica": "Building engineering",
    "Jefatura de obra": "Site management",
    "Jefe de obra": "Site manager",
    Instalaciones: "Building services",
    "Compras y materiales": "Procurement and materials",
    Compras: "Procurement",
    "Atención al cliente": "Client care",
    Administración: "Administration",
    Gerencia: "Management",
    Interiorismo: "Interior design",
    Encargado: "Site foreman",
  },
};

export const TEAM_COPY: Record<Locale, TeamCopy> = { es, en };
