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

/** Etapa del cronograma de una obra. */
export interface ProjectEtapa {
  periodo: string;
  titulo: string;
  texto: string;
}

/** Línea de la ficha de materiales y acabados. */
export interface ProjectMaterial {
  elemento: string;
  detalle: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  indice: string;
  anio: string;
  ubicacion: string;
  tipologia: string;
  /** Cliente o tipo de cliente (p. ej. «Cliente particular»). */
  cliente: string;
  /** Slug del servicio relacionado (p. ej. «oficinas»). */
  servicio: string;
  /** Superficie intervenida (p. ej. «1.450 m²»). */
  superficie: string;
  /** Duración de la obra (p. ej. «20 semanas»). */
  plazo: string;
  imagen: string;
  fotoAntes?: string;
  fotoDespues?: string;
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
  /** Etapas de la obra, en orden. */
  cronograma: ProjectEtapa[];
  /** Materiales y acabados principales. */
  materiales: ProjectMaterial[];
  /** Cierre: qué se consiguió con el proyecto. */
  resultado: string;
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

/** Recurso descargable (PDF) que acompaña a una guía. */
export interface Descarga {
  id: string;
  slug: string;
  title: string;
  descripcion: string;
  /** Ruta o URL del archivo (p. ej. /descargas/checklist.pdf). */
  archivo: string;
  /** Formato en mayúsculas (p. ej. PDF); si no se indica, sale de la extensión. */
  formato: string;
  /** Peso orientativo (p. ej. 14 KB). */
  peso: string;
  /** Slug de la guía a la que acompaña (puede estar vacío). */
  guia: string;
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

/** Contenido editable de los bloques y textos de la página de inicio. */
export interface HomeContent {
  // Hero
  heroTitulo: string;
  heroSubtitulo: string;
  heroDescripcion: string;
  heroCtaTexto: string;
  heroSecundarioTexto: string;
  heroSlides?: Slide[];

  // Bloque Proyectos
  proyectosTitulo: string;
  proyectosSubtitulo: string;
  proyectosCtaTexto: string;

  // Bloque Proceso / Método
  procesoTitulo: string;
  procesoSubtitulo: string;

  // Bloque Servicios
  serviciosTag: string;
  serviciosTitulo: string;
  serviciosDescripcion: string;

  // Bloque Showcase / Taller
  workshopBadge: string;
  workshopTitulo: string;
  workshopDescripcion: string;
  workshopSlides?: Slide[];

  // Bloque Experiencia (90 días)
  experienciaImagen: string;
  experienciaBadges: string[];

  // Bloque Materiales y Fabricantes
  materialesTag: string;
  materialesTitulo: string;
  materialesDescripcion: string;

  // Bloque Artículos
  articulosTag: string;
  articulosTitulo: string;
  articulosCtaTexto: string;

  // Bloque Contacto Final
  contactoTitulo: string;
  contactoDescripcion: string;
  contactoBgImagen?: string;
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
  homeContent: HomeContent;
}

export interface ProjectsPageContent {
  headerBadge: string;
  headerTitulo: string;
  headerDescripcion: string;
  headerBgImage: string;
  portfolioTag: string;
  portfolioTitulo: string;
}

export interface PilarNosotros {
  numero: string;
  titulo: string;
  texto: string;
  imagen: string;
}

export interface ValorNosotros {
  numero: string;
  titulo: string;
  texto: string;
}

export interface CifraNosotros {
  valor: string;
  etiqueta: string;
}

export interface NosotrosPageContent {
  headerBadge: string;
  headerTitulo: string;
  headerDescripcion: string;
  headerBgImage: string;

  // Intro
  introTag: string;
  introTitulo: string;
  introLead: string;
  introCol1: string;
  introCol2: string;

  // Cifras
  cifras: CifraNosotros[];

  // Pilares (Cómo trabajamos)
  pilaresTag: string;
  pilaresTitulo: string;
  pilaresDescripcion: string;
  pilares: PilarNosotros[];

  // Método ALKO
  metodoTag: string;
  metodoTitulo: string;
  metodoLead: string;
  metodoCol1: string;
  metodoCol2: string;
  metodoImagen: string;

  // Valores
  valoresTag: string;
  valoresTitulo: string;
  valoresDescripcion: string;
  valores: ValorNosotros[];

  // Fases del Proceso
  procesoTitulo?: string;
  procesoSubtitulo?: string;
  procesoColHeading?: string;
  procesoColText?: string;
  fases?: Fase[];

  // Enlaces inferiores (Equipo y Empleo)
  enlaceEquipoEtiqueta: string;
  enlaceEquipoTitulo: string;
  enlaceEquipoImagen: string;
  enlaceEmpleoEtiqueta: string;
  enlaceEmpleoTitulo: string;
  enlaceEmpleoImagen: string;
}

export interface PasoContacto {
  title: string;
  text: string;
}

export interface ContactoPageContent {
  headerBadge: string;
  headerTitulo: string;
  headerDescripcion: string;
  headerBgImage: string;

  canalesTag: string;
  canalesTitulo: string;
  canalesDescripcion: string;

  formTag: string;
  formTitulo: string;

  pasosTag: string;
  pasosTitulo: string;
  pasos: PasoContacto[];

  oficinaTag: string;
  oficinaTitulo: string;
  oficinaImagen: string;
}


export interface ServiciosPageContent {
  headerBadge: string;
  headerTitulo: string;
  headerDescripcion: string;
  headerBgImage: string;
}


export interface MiembroEquipo {
  nombre: string;
  rol: string;
  foto: string;
}

export interface EquipoPageContent {
  headerBadge: string;
  headerTitulo: string;
  headerDescripcion: string;
  headerBgImage: string;

  imagenDestacada: string;

  filosofiaTitulo: string;
  filosofiaTexto: string;

  gridTag: string;
  gridTitulo: string;
  gridDescripcion: string;
  miembros: MiembroEquipo[];

  ctaTitulo: string;
  ctaDescripcion: string;
  ctaBgImage: string;
}


export interface PosicionEmpleo {
  titulo: string;
  departamento: string;
  ubicacion: string;
  tipo: string;
  resumen: string;
}

export interface EmpleoPageContent {
  headerBadge: string;
  headerTitulo: string;
  headerDescripcion: string;
  headerBgImage: string;

  culturaTag: string;
  culturaTitulo: string;
  culturaParrafo1: string;
  culturaParrafo2: string;
  culturaImagen: string;

  posicionesTag: string;
  posicionesTitulo: string;
  posicionesSubtitulo: string;
  posiciones: PosicionEmpleo[];

  ctaTitulo: string;
  ctaDescripcion: string;
  ctaBgImage: string;
}


export interface OficinasMetrica {
  valor: string;
  label: string;
}

export interface OficinasCapacidad {
  codigo: string;
  titulo: string;
  metrica: string;
  resumen: string;
}

export interface OficinasMetodologia {
  fase: string;
  semanas: string;
  titulo: string;
  resumen: string;
}

export interface OficinasPageContent {
  headerBadge: string;
  headerTitulo: string;
  headerDescripcion: string;
  headerBgImage: string;

  metricasTag: string;
  metricasTitulo: string;
  metricasDescripcion: string;
  metricas: OficinasMetrica[];

  capacidadesTag: string;
  capacidadesTitulo: string;
  capacidadesSubtitulo: string;
  capacidades: OficinasCapacidad[];

  metodologiaTag: string;
  metodologiaTitulo: string;
  metodologiaSubtitulo: string;
  metodologia: OficinasMetodologia[];
}


export interface ArticulosPageContent {
  headerBadge: string;
  headerTitulo: string;
  headerDescripcion: string;
  headerBgImage: string;
}

export interface GuiasPageContent {
  headerBadge: string;
  headerTitulo: string;
  headerDescripcion: string;
  headerBgImage: string;
}
