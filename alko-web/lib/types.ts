/**
 * Modelo de dominio compartido por toda la aplicación.
 *
 * Estos tipos son el contrato entre la capa de datos (WordPress o contenido por
 * defecto) y los componentes de la interfaz. Cualquier fuente de contenido debe
 * entregar estos objetos, de modo que añadir un CMS o una nueva sección no
 * obligue a tocar los componentes de presentación.
 */

export interface Slide {
  id: string;
  image: string;
  alt: string;
}

/** Resumen de un recurso enlazable (listados, tarjetas, navegación). */
export interface LinkItem {
  id: string;
  slug: string;
  title: string;
  href: string;
}

/** Dato destacado de un proyecto (p. ej. «0» + «días de cierre»). */
export interface ProjectCifra {
  valor: string;
  etiqueta: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  indice: string;
  anio: string;
  ubicacion: string;
  tipologia: string;
  /** Superficie intervenida (p. ej. «1.450 m²»). */
  superficie: string;
  /** Duración de la obra (p. ej. «20 semanas»). */
  plazo: string;
  imagen: string;
  /** Imágenes adicionales para la galería del detalle (puede estar vacía). */
  galeria: string[];
  enlace: string;
  /** Contenido en HTML del proyecto (descripción larga). */
  content: string;
  /** Punto de partida: condicionantes y exigencias del encargo. */
  reto: string;
  /** Cómo se resolvió el encargo. */
  solucion: string;
  /** Partidas o trabajos ejecutados. */
  alcance: string[];
  /** Cifras destacadas del proyecto. */
  cifras: ProjectCifra[];
}

export interface Sector {
  id: string;
  slug: string;
  numero: string;
  title: string;
  descripcion: string;
  imagen: string;
  enlace: string;
  content: string;
}

export interface Fase {
  id: string;
  tag: string;
  title: string;
  texto: string;
  imagen: string;
}

export interface Fabricante {
  id: string;
  name: string;
  logo: string;
  url: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  /** Fecha ISO 8601. */
  date: string;
}

/** Guía práctica paso a paso (sección Conocimiento → Guías). */
export interface Guide {
  id: string;
  slug: string;
  numero: string;
  title: string;
  /** Tema principal, en mayúsculas (p. ej. PLANIFICACIÓN). */
  tema: string;
  descripcion: string;
  /** Tiempo de lectura orientativo (p. ej. "8 min"). */
  lectura: string;
  imagen: string;
  /** Contenido en HTML de la guía. */
  content: string;
}

export interface SiteSettings {
  telefono: string;
  email: string;
  whatsapp: string;
  direccion: string;
  horario: string;
  linkedin: string;
  facebook: string;
  instagram: string;
}

/** Datos agregados que consume la página de inicio. */
export interface HomeData {
  heroSlides: Slide[];
  showcaseSlides: Slide[];
  projects: Project[];
  sectors: Sector[];
  fases: Fase[];
  fabricantes: Fabricante[];
  articles: Article[];
  settings: SiteSettings;
}
