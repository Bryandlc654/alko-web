/**
 * Configuración global del sitio: identidad, navegación y mapa de rutas.
 *
 * Centralizar esto aquí evita duplicar rutas y textos entre la navegación, el
 * sitemap y los metadatos, y hace trivial añadir una sección nueva.
 */

export const SITE = {
  name: "ALKO",
  legalName: "ALKO Construcción y Reformas Integrales",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.alko.es").replace(/\/+$/, ""),
  locale: "es_ES",
  title: "ALKO - Construcción y Reformas Integrales en Madrid",
  description:
    "Ejecutamos proyectos residenciales y corporativos de alta exigencia, coordinando construcción, instalaciones, acabados y gestión técnica hasta la entrega final.",
  keywords: ["construcción", "reformas integrales", "Madrid", "arquitectura", "obra", "ALKO"],
} as const;

export interface NavItem {
  href: string;
  label: string;
  /** Submenú opcional (se despliega en la cabecera). */
  children?: NavLink[];
}

export interface NavLink {
  href: string;
  label: string;
}

/** Rutas base de cada colección de contenido. */
export const ROUTES = {
  home: "/",
  projects: "/proyectos",
  sectors: "/servicios",
  company: "/nosotros",
  team: "/equipo",
  method: "/metodo",
  careers: "/trabaja-con-nosotros",
  articles: "/conocimiento",
  contact: "/contacto",
} as const;

/** Navegación principal (cabecera y menú móvil). */
export const MAIN_NAV: NavItem[] = [
  { href: ROUTES.projects, label: "Proyectos" },
  { href: ROUTES.sectors, label: "Servicios" },
  {
    href: ROUTES.company,
    label: "Empresa",
    children: [
      { href: ROUTES.company, label: "Nosotros" },
      { href: ROUTES.team, label: "Equipo" },
      { href: ROUTES.method, label: "Método" },
      { href: ROUTES.careers, label: "Trabaja con nosotros" },
    ],
  },
  { href: ROUTES.articles, label: "Conocimiento" },
  { href: ROUTES.contact, label: "Contacto" },
];

/**
 * Rutas en las que la cabecera es transparente al hacer scroll hasta arriba
 * (páginas con un hero oscuro a pantalla completa). En el resto, la cabecera
 * arranca con fondo sólido para mantener la legibilidad.
 */
export const TRANSPARENT_HEADER_ROUTES: string[] = [ROUTES.home];

/** Elementos del pie de página. */
export const FOOTER_NAV: NavItem[] = [
  { href: ROUTES.projects, label: "Proyectos" },
  { href: ROUTES.sectors, label: "Servicios" },
  { href: ROUTES.company, label: "Empresa" },
  { href: ROUTES.team, label: "Equipo" },
  { href: ROUTES.method, label: "Método" },
  { href: ROUTES.careers, label: "Trabaja con nosotros" },
  { href: ROUTES.articles, label: "Conocimiento" },
  { href: ROUTES.contact, label: "Contacto" },
];
