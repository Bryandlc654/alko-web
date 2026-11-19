/**
 * Configuración global del sitio: identidad, navegación y mapa de rutas.
 *
 * Centralizar esto aquí evita duplicar rutas y textos entre la navegación, el
 * sitemap y los metadatos, y hace trivial añadir una sección nueva.
 */

export const SITE = {
  name: "ALKO",
  legalName: "ALKO Construcción y Reformas Integrales",
  // Dominio con el que Google ya conoce la web (canonical actual, sin www). Ojo: alko.es es de
  // otra empresa; si se usara como respaldo, canonical, sitemap y datos estructurados apuntarían allí.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://alkoreformas.com").replace(/\/+$/, ""),
  locale: "es_ES",
  title: "Reformas integrales y construcción en Madrid | ALKO",
  description:
    "Reformas integrales de viviendas, oficinas y locales en Madrid. Un único equipo de proyecto a entrega, con presupuesto cerrado y plazo por escrito.",
  keywords: [
    "reformas integrales Madrid",
    "empresa de reformas Madrid",
    "reforma de pisos Madrid",
    "construcción Madrid",
    "reforma de oficinas",
    "reforma de locales",
    "ALKO",
  ],
} as const;

/** Imagen por defecto al compartir la web (Open Graph y X): 1200 × 630. */
export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "ALKO, reformas integrales y construcción en Madrid",
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
  /** Línea breve bajo el enlace en el mega menú. */
  description?: string;
}

/** Rutas base de cada colección de contenido. */
export const ROUTES = {
  home: "/",
  projects: "/proyectos",
  sectors: "/servicios",
  company: "/nosotros",
  team: "/equipo",
  careers: "/trabaja-con-nosotros",
  /** Journal: artículos y guías en una sola página. */
  journal: "/journal",
  /** Base de las URL de cada artículo (/journal/<slug>). */
  articles: "/journal",
  /** Base de las URL de cada guía (/journal/guias/<slug>); el listado está en el Journal. */
  guides: "/journal/guias",
  contact: "/contacto",
  privacy: "/politica-de-privacidad",
} as const;

/** Datos del titular para los textos legales. Si se rellena el NIF, aparece en la política de privacidad. */
export const LEGAL = {
  titular: "ALKO Construcción y Reformas Integrales",
  nif: "",
  actualizada: "noviembre de 2026",
} as const;

/** Redes de ALKO: solo Instagram y Facebook. La URL del panel manda; si está vacía, se usa la de aquí. */
export const SOCIAL_LINKS = [
  { key: "instagram", label: "Instagram", fallback: "https://www.instagram.com/alkoreformas" },
  { key: "facebook", label: "Facebook", fallback: "https://www.facebook.com/alkoreformas/" },
] as const;

/** Listado de guías dentro del Journal. */
export const GUIDES_HREF = `${ROUTES.journal}#guias`;

/** El método ALKO es una sección de Nosotros (antes tenía página propia en /metodo). */
export const METHOD_HREF = `${ROUTES.company}#metodo`;

/**
 * Navegación principal (cabecera y menú móvil). Dirección V3: una navegación corta
 * con cuatro entradas; «Presentar proyecto» vive como CTA fijo de la cabecera.
 * Contacto sigue enlazado desde el pie y el CTA.
 */
export const MAIN_NAV: NavItem[] = [
  { href: ROUTES.home, label: "Inicio" },
  { href: ROUTES.projects, label: "Proyectos" },
  { href: ROUTES.sectors, label: "Divisiones" },
  {
    href: ROUTES.company,
    label: "Estudio",
    children: [
      { href: ROUTES.company, label: "Nosotros", description: "Trayectoria y forma de trabajar" },
      { href: ROUTES.team, label: "Equipo", description: "Personas y responsabilidades" },
      { href: ROUTES.careers, label: "Trabaja con nosotros", description: "Vacantes y candidaturas" },
    ],
  },
  { href: ROUTES.journal, label: "Journal" },
];

/** Servicio mínimo que necesita el menú (los datos vienen del CMS). */
export interface ServiceLink {
  slug: string;
  title: string;
  descripcion?: string;
}

/**
 * Navegación principal con el desplegable de Divisiones construido a partir de los
 * servicios del CMS: uno nuevo aparece en el menú sin tocar el código.
 */
export function buildMainNav(services: ServiceLink[] = []): NavItem[] {
  return MAIN_NAV.map((item) =>
    item.href === ROUTES.sectors && services.length > 0
      ? {
          ...item,
          children: services.map((service) => ({
            href: `${ROUTES.sectors}/${service.slug}`,
            label: service.title,
            description: service.descripcion,
          })),
        }
      : item,
  );
}

/**
 * Rutas en las que la cabecera es transparente al hacer scroll hasta arriba
 * (páginas con un hero oscuro con imagen). Una entrada terminada en "/*" se
 * aplica a todas sus subrutas. En el resto, la cabecera arranca con fondo
 * sólido para mantener la legibilidad.
 *
 * Hoy todas las páginas (también la 404) empiezan con un hero con imagen
 * (Hero, PageHero o uno propio), así que se aplica a todo el sitio.
 */
export const TRANSPARENT_HEADER_ROUTES: string[] = ["/*"];

/**
 * Excepciones: páginas con cabecera editorial clara (sin foto detrás), donde la navegación
 * arranca sólida. Coincidencia exacta; «/journal/:slug» cubre los artículos (no las guías).
 */
export const SOLID_HEADER_ROUTES: string[] = [
  "/contacto",
  "/nosotros",
  "/equipo",
  "/trabaja-con-nosotros",
  "/journal",
  "/journal/:slug",
  "/journal/guias/:slug",
  "/proyectos",
  "/en/projects",
  "/en/about",
  "/en/team",
  "/en/careers",
  "/en/contact",
  "/en/journal",
  "/proyectos/:slug",
  "/servicios",
  "/politica-de-privacidad",
];

/** ¿La ruta lleva la navegación sólida desde el principio? */
export function isSolidHeaderRoute(pathname: string) {
  const path = pathname.replace(/\/+$/, "") || "/";
  return SOLID_HEADER_ROUTES.some((route) =>
    route.endsWith("/:slug")
      ? new RegExp(`^${route.slice(0, -6)}/(?!guias(/|$))[^/]+$`).test(path)
      : path === route,
  );
}

/** Columnas del pie de página. */
export const FOOTER_NAV: NavItem[] = [
  { href: ROUTES.home, label: "Inicio" },
  { href: ROUTES.projects, label: "Proyectos" },
  { href: ROUTES.sectors, label: "Divisiones" },
  { href: ROUTES.company, label: "Estudio" },
];

export const FOOTER_NAV_SECONDARY: NavItem[] = [
  { href: ROUTES.team, label: "Equipo" },
  { href: ROUTES.careers, label: "Trabaja con nosotros" },
  { href: ROUTES.journal, label: "Journal" },
  { href: ROUTES.contact, label: "Contacto" },
];
