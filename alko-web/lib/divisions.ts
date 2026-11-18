/**
 * Dirección V3: las cuatro divisiones comerciales de ALKO y las cinco etapas del
 * método (copy de Alko-recomendacion/BRIEF_EJECUCION_V3.md y su prototipo).
 *
 * Por ahora es contenido fijo: las landings propias de cada división
 * (/residencial/, /oficinas/…) y su edición desde el panel llegan en fases
 * posteriores. Mientras tanto cada división enlaza al servicio existente que más
 * se le parece (`sectorSlugs`) o, si no hay ninguno, al índice de servicios.
 */

export interface Division {
  id: "residential" | "corporate" | "hospitality" | "industrial";
  num: string;
  name: string;
  /** Nombre en castellano (para formularios y textos accesibles). */
  label: string;
  desc: string;
  /** Imagen provisional: sustituir por obra real de ALKO con permiso fotográfico. */
  image: string;
  /** Slugs de servicios actuales a los que puede enlazar, por orden de preferencia. */
  sectorSlugs: string[];
}

export const DIVISIONS: Division[] = [
  {
    id: "residential",
    num: "01",
    name: "Residential",
    label: "Residencial",
    desc: "Viviendas, reformas integrales y proyectos residenciales de alta gama.",
    image: "/division-residencial.jpg",
    sectorSlugs: ["reformas-integrales", "viviendas"],
  },
  {
    id: "corporate",
    num: "02",
    name: "Corporate",
    label: "Corporativo",
    desc: "Oficinas, sedes empresariales e implantación de empresas.",
    image: "/division-corporate.jpg",
    sectorSlugs: ["oficinas"],
  },
  {
    id: "hospitality",
    num: "03",
    name: "Hospitality & Retail",
    label: "Hospitalidad y comercio",
    desc: "Hoteles, restauración, boutiques, locales comerciales y showrooms.",
    image: "/division-hospitality.jpg",
    sectorSlugs: ["retail", "hoteles-y-locales"],
  },
  {
    id: "industrial",
    num: "04",
    name: "Industrial & Technical",
    label: "Industrial y técnico",
    desc: "Adecuación de naves, rehabilitación e instalaciones complejas.",
    image: "/division-industrial.jpg",
    sectorSlugs: ["naves-industriales", "industrial"],
  },
];

/** Método ALKO: cinco etapas, sin compromisos universales no contratados. */
export const METHOD_STEPS: { num: string; title: string; text: string; image: string }[] = [
  {
    num: "01",
    title: "Escuchar y evaluar",
    image: "/metodo-escuchar.jpg",
    text: "Revisamos necesidades, documentación existente y características del inmueble para delimitar el encargo.",
  },
  {
    num: "02",
    title: "Definir el alcance",
    image: "/metodo-definir-alcance.jpg",
    text: "Establecemos las soluciones y partidas a estudiar, los criterios técnicos y las responsabilidades de cada interviniente.",
  },
  {
    num: "03",
    title: "Planificar y comprar",
    image: "/metodo-planificar.jpg",
    text: "Organizamos los oficios, el calendario de ejecución y la selección de materiales de acuerdo con el proyecto aprobado.",
  },
  {
    num: "04",
    title: "Ejecutar y coordinar",
    image: "/metodo-ejecutar.jpg",
    text: "Trabajamos con control de calidad, seguimiento del avance y comunicación de incidencias durante la obra.",
  },
  {
    num: "05",
    title: "Verificar y entregar",
    image: "/metodo-entregar.jpg",
    text: "Comprobamos los trabajos y formalizamos la entrega conforme al alcance contratado.",
  },
];

/** Opciones del campo «División» de los formularios (las cuatro divisiones + «Otro»). */
export const DIVISION_OPTIONS: string[] = [...DIVISIONS.map((division) => division.name), "Otro"];

/** División a la que pertenece un servicio actual, para preseleccionarla en su CTA. */
export function divisionForSector(sectorSlug?: string): string | undefined {
  if (!sectorSlug) return undefined;
  return DIVISIONS.find((division) => division.sectorSlugs.includes(sectorSlug))?.name;
}
