import type { Locale } from "@/lib/i18n";
import { ROUTES } from "@/lib/site";

/**
 * Textos de la cabecera, el pie y los elementos flotantes en cada idioma. Los enlaces a
 * páginas sin traducir siguen apuntando a la versión en castellano.
 */
const es = {
  nav: {
    label: "Principal",
    mobileLabel: "Principal móvil",
    home: "ALKO · Inicio",
    items: {
      [ROUTES.home]: "Inicio",
      [ROUTES.projects]: "Proyectos",
      [ROUTES.sectors]: "Divisiones",
      [ROUTES.company]: "Estudio",
      [ROUTES.journal]: "Journal",
      [ROUTES.team]: "Equipo",
      [ROUTES.careers]: "Trabaja con nosotros",
    } as Record<string, string>,
    /** Submenú de Estudio: nombre y descripción de cada enlace. */
    company: {
      [ROUTES.company]: { label: "Nosotros", description: "Trayectoria y forma de trabajar" },
      [ROUTES.team]: { label: "Equipo", description: "Personas y responsabilidades" },
      [ROUTES.careers]: { label: "Trabaja con nosotros", description: "Vacantes y candidaturas" },
    } as Record<string, { label: string; description: string }>,
    mega: {
      [ROUTES.sectors]: {
        tag: "Divisiones ALKO",
        title: "Cuatro ámbitos. Un mismo criterio.",
        text: "Una estructura de obra integrada para cada tipo de cliente.",
        cta: "Ver todas las divisiones",
      },
      [ROUTES.company]: {
        tag: "Estudio",
        title: "Una constructora con sensibilidad arquitectónica.",
        text: "Equipo, trayectoria y forma de trabajar.",
        cta: "Conocer ALKO",
      },
    } as Record<string, { tag: string; title: string; text: string; cta: string }>,
    cta: "Presentar proyecto",
    ctaSource: "Cabecera",
    ctaSourceMobile: "Cabecera Móvil",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    viewAll: "Ver todo",
    contact: "Contacto",
    language: "Idioma",
  },
  footer: {
    tagline: "Construimos espacios que permanecen",
    explore: "Explorar",
    resources: "Recursos",
    project: "Proyecto",
    social: "Redes",
    present: "Presentar",
    privacy: "Política de privacidad",
    place: "Madrid · España",
    links: {
      [ROUTES.home]: "Inicio",
      [ROUTES.projects]: "Proyectos",
      [ROUTES.sectors]: "Divisiones",
      [ROUTES.company]: "Estudio",
      [ROUTES.team]: "Equipo",
      [ROUTES.careers]: "Trabaja con nosotros",
      [ROUTES.journal]: "Journal",
      [ROUTES.contact]: "Contacto",
    } as Record<string, string>,
    guides: "Guías",
    faq: "Preguntas frecuentes",
    method: "Nuestro método",
  },
  whatsapp: {
    label: "Contactar por WhatsApp",
    hover: "Escríbenos por WhatsApp",
    message: "Hola ALKO, quiero información sobre un proyecto.",
  },
};

export type LayoutCopy = typeof es;

const en: LayoutCopy = {
  nav: {
    label: "Main",
    mobileLabel: "Main mobile",
    home: "ALKO · Home",
    items: {
      [ROUTES.home]: "Home",
      [ROUTES.projects]: "Projects",
      [ROUTES.sectors]: "Divisions",
      [ROUTES.company]: "Studio",
      [ROUTES.journal]: "Journal",
      [ROUTES.team]: "Team",
      [ROUTES.careers]: "Careers",
    },
    company: {
      [ROUTES.company]: { label: "About us", description: "Our story and how we work" },
      [ROUTES.team]: { label: "Team", description: "People and responsibilities" },
      [ROUTES.careers]: { label: "Careers", description: "Vacancies and applications" },
    },
    mega: {
      [ROUTES.sectors]: {
        tag: "ALKO divisions",
        title: "Four fields. One standard.",
        text: "An integrated construction team for every type of client.",
        cta: "View all divisions",
      },
      [ROUTES.company]: {
        tag: "Studio",
        title: "A construction company with an architectural eye.",
        text: "Team, track record and way of working.",
        cta: "About ALKO",
      },
    },
    cta: "Start your project",
    ctaSource: "Cabecera · EN",
    ctaSourceMobile: "Cabecera Móvil · EN",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    viewAll: "View all",
    contact: "Contact",
    language: "Language",
  },
  footer: {
    tagline: "We build spaces that endure",
    explore: "Explore",
    resources: "Resources",
    project: "Your project",
    social: "Social",
    present: "Get in touch",
    privacy: "Privacy policy",
    place: "Madrid · Spain",
    links: {
      [ROUTES.home]: "Home",
      [ROUTES.projects]: "Projects",
      [ROUTES.sectors]: "Divisions",
      [ROUTES.company]: "Studio",
      [ROUTES.team]: "Team",
      [ROUTES.careers]: "Careers",
      [ROUTES.journal]: "Journal",
      [ROUTES.contact]: "Contact",
    },
    guides: "Guides",
    faq: "FAQ",
    method: "Our method",
  },
  whatsapp: {
    label: "Contact us on WhatsApp",
    hover: "Message us on WhatsApp",
    message: "Hello ALKO, I would like information about a project.",
  },
};

export const LAYOUT_COPY: Record<Locale, LayoutCopy> = { es, en };
