import type { Locale } from "@/lib/i18n";
import type { PosicionEmpleo } from "@/lib/types";

/**
 * Textos de «Trabaja con nosotros» (/trabaja-con-nosotros y /en/careers), incluido el formulario
 * de candidatura.
 *
 * En castellano mandan los textos del panel (estos son los de respaldo). En inglés no hay panel:
 * se usan estos, y los puestos del panel se traducen con `positions` (lo que no esté en la lista
 * se muestra tal cual). La candidatura llega siempre con el nombre del puesto en castellano, el
 * del panel, para que el equipo sepa a qué vacante corresponde.
 */
const es = {
  meta: {
    title: "Empleo en construcción en Madrid: trabaja en ALKO",
    /** Descripción con los puestos abiertos (o sin ellos). */
    description: (puestos: string[]) =>
      puestos.length === 0
        ? "Únete al equipo de ALKO, empresa de construcción y reformas integrales en Madrid. Envíanos tu candidatura espontánea."
        : // Separados solo por comas: un puesto puede llevar «y» en su nombre.
          `Trabaja en ALKO, reformas en Madrid. Buscamos: ${puestos.map((p) => p.toLowerCase()).join(", ")}.`,
    listName: "Posiciones abiertas",
  },
  breadcrumbParent: "Nosotros",
  breadcrumb: "Trabaja con nosotros",
  header: {
    eyebrow: "Trabaja con nosotros",
    title: "Construimos con las personas",
    description:
      "Buscamos profesionales que compartan nuestro criterio técnico y quieran crecer dentro de un equipo que trabaja como una dirección única.",
    open: "Posiciones abiertas",
    see: "Ver puestos",
    alt: "Operario de ALKO trabajando en una obra en Madrid",
    caption: "Trabajo en obra",
  },
  culture: {
    tag: "El equipo ALKO",
    title: "Un equipo pequeño, con criterio y sin intermediarios",
    p1: "En ALKO cada persona tiene responsabilidad real sobre el proyecto. Trabajamos cerca de la obra, con decisiones rápidas y una única dirección técnica.",
    p2: "Buscamos perfiles con oficio y ambición de crecer: gente que disfrute resolviendo problemas constructivos y cuidando el detalle hasta la entrega.",
    alt: "Equipo de obra de ALKO trabajando en una reforma",
  },
  positionsSection: {
    tag: "Posiciones abiertas",
    title: "Únete al equipo",
    intro: "Envíanos tu candidatura por correo. Valoramos perfiles técnicos con experiencia en obra.",
  },
  cta: {
    label: "Candidatura espontánea",
    title: "¿No encuentras tu puesto ideal?",
    description:
      "Envíanos una candidatura espontánea. Nos interesa conocer perfiles con criterio técnico, aunque no haya una posición abierta.",
    button: "Enviar candidatura",
    mailSubject: "Candidatura espontánea ALKO",
  },
  list: {
    empty:
      "Actualmente no hay vacantes específicas abiertas, pero en ALKO siempre estamos abiertos a incorporar talento cualificado en obra, instalaciones y proyectos.",
    emptyButton: "Enviar candidatura espontánea",
    apply: "Postular",
  },
  modal: {
    eyebrow: "Trabaja con nosotros",
    title: "Envía tu candidatura",
    close: "Cerrar",
    successTitle: "Candidatura recibida",
    successText:
      "Gracias por tu interés en unirte a ALKO. Nuestro equipo de dirección técnica revisará tu perfil y nos pondremos en contacto contigo.",
    position: "Puesto o vacante",
    spontaneous: "Candidatura espontánea (general)",
    name: "Nombre y apellidos *",
    namePlaceholder: "Ej.: Marcos Gómez",
    email: "Correo electrónico *",
    emailPlaceholder: "marcos@ejemplo.com",
    phone: "Teléfono *",
    cv: "Currículum (PDF o DOCX, máx. 10 MB)",
    cvSelect: "Selecciona tu CV",
    cvTypes: "PDF, DOC o DOCX",
    cvChange: "Pulsa para cambiarlo",
    upload: "↑ Subir",
    message: "Carta de presentación o comentarios (opcional)",
    messagePlaceholder: "Cuéntanos brevemente tu experiencia en obra o proyectos…",
    privacy: "Usaremos tus datos solo para este proceso de selección.",
    privacyLink: "Política de privacidad",
    sending: "Enviando…",
    submit: "Enviar candidatura",
    tooBig: "El archivo supera el tamaño máximo permitido de 10MB.",
    error: "No se pudo enviar la postulación.",
  },
  /** Traducción de los textos de cada puesto, por su texto en castellano (vacío en castellano). */
  positions: {} as Record<string, string>,
};

export type CareersCopy = typeof es;

const en: CareersCopy = {
  meta: {
    title: "Construction jobs in Madrid: work at ALKO",
    description: (puestos: string[]) =>
      puestos.length === 0
        ? "Join the ALKO team, a construction and full renovation company in Madrid. Send us a speculative application."
        : `Work at ALKO, full renovations in Madrid. We are hiring: ${puestos.map((p) => p.toLowerCase()).join(", ")}.`,
    listName: "Open positions",
  },
  breadcrumbParent: "About",
  breadcrumb: "Careers",
  header: {
    eyebrow: "Careers",
    title: "We build with people",
    description:
      "We are looking for professionals who share our technical standards and want to grow in a team that works under a single management.",
    open: "Open positions",
    see: "See roles",
    alt: "ALKO tradesman working on a site in Madrid",
    caption: "Work on site",
  },
  culture: {
    tag: "The ALKO team",
    title: "A small team, with judgement and no middlemen",
    p1: "At ALKO everyone has real responsibility for the project. We work close to the site, with quick decisions and a single technical lead.",
    p2: "We look for people with craft and the drive to grow: people who enjoy solving construction problems and caring for detail all the way to handover.",
    alt: "ALKO site team working on a renovation",
  },
  positionsSection: {
    tag: "Open positions",
    title: "Join the team",
    intro: "Send us your application. We value technical profiles with on-site experience.",
  },
  cta: {
    label: "Speculative application",
    title: "Can’t find the right role?",
    description:
      "Send us a speculative application. We want to hear from people with technical judgement, even when there is no open position.",
    button: "Send application",
    mailSubject: "Speculative application ALKO",
  },
  list: {
    empty:
      "There are no specific openings right now, but ALKO is always open to qualified people in site work, building services and design.",
    emptyButton: "Send a speculative application",
    apply: "Apply",
  },
  modal: {
    eyebrow: "Careers",
    title: "Send your application",
    close: "Close",
    successTitle: "Application received",
    successText:
      "Thank you for your interest in joining ALKO. Our technical management team will review your profile and get in touch with you.",
    position: "Position",
    spontaneous: "Speculative application (general)",
    name: "Full name *",
    namePlaceholder: "e.g. Mark Gomez",
    email: "Email *",
    emailPlaceholder: "mark@example.com",
    phone: "Phone *",
    cv: "CV (PDF or DOCX, max. 10 MB)",
    cvSelect: "Choose your CV",
    cvTypes: "PDF, DOC or DOCX",
    cvChange: "Click to change it",
    upload: "↑ Upload",
    message: "Cover letter or comments (optional)",
    messagePlaceholder: "Tell us briefly about your experience on site or on projects…",
    privacy: "We will only use your data for this recruitment process.",
    privacyLink: "Privacy policy",
    sending: "Sending…",
    submit: "Send application",
    tooBig: "The file is larger than the 10 MB limit.",
    error: "The application could not be sent.",
  },
  positions: {
    // Puestos
    "Jefatura de obra": "Site manager",
    "Jefatura de obras": "Site manager",
    "Jefe de obra": "Site manager",
    "Arquitectura técnica": "Building engineer",
    "Arquitecto técnico": "Building engineer",
    "Ingeniería de instalaciones": "Building services engineer",
    "Compras y aprovisionamiento": "Procurement and supply",
    Encargado: "Site foreman",
    "Encargado de obra": "Site foreman",
    // Resúmenes
    "Planificación y coordinación de oficios en obra, control de plazo y calidad por fase.":
      "Planning and coordinating trades on site, with time and quality control at every stage.",
    "Desarrollo de documentación, mediciones, detalles constructivos y seguimiento técnico.":
      "Preparing documentation, measurements and construction details, and technical follow-up.",
    "Diseño y coordinación de climatización, ventilación, saneamiento y redes de datos.":
      "Design and coordination of HVAC, ventilation, drainage and data networks.",
    "Gestión de proveedores, compras críticas anticipadas y control de suministros en obra.":
      "Supplier management, early critical purchasing and control of deliveries on site.",
    // Departamentos
    Ejecución: "Construction",
    Proyecto: "Design",
    Instalaciones: "Building services",
    Compras: "Procurement",
    Administración: "Administration",
    // Jornada
    "Jornada completa": "Full-time",
    "Media jornada": "Part-time",
    Prácticas: "Internship",
    Autónomo: "Freelance",
  },
};

export const CAREERS_COPY: Record<Locale, CareersCopy> = { es, en };

/**
 * Puesto con sus textos en el idioma de la página. `titulo` es el que se muestra; `valor`, el del
 * panel en castellano, que es el que se envía con la candidatura.
 */
export function localizePosition(p: PosicionEmpleo, locale: Locale) {
  const tr = CAREERS_COPY[locale].positions;
  const t = (value: string) => tr[value?.trim()] ?? value;
  return {
    ...p,
    valor: p.titulo,
    titulo: t(p.titulo),
    resumen: t(p.resumen),
    departamento: t(p.departamento),
    ubicacion: t(p.ubicacion),
    tipo: t(p.tipo),
  };
}

export type LocalizedPosition = ReturnType<typeof localizePosition>;

/** Valor que identifica una candidatura espontánea en el panel (no se traduce). */
export const SPONTANEOUS_VALUE = "Candidatura espontánea";
