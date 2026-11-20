import type { Locale } from "@/lib/i18n";
import type { SectorCapacidadTecnica, SectorCommitment, SectorFaq, SectorProblem } from "@/lib/types";

/**
 * Textos fijos de las páginas de servicio (/servicios/[slug] y /en/services/[slug]) y del listado
 * (/servicios y /en/services). Los textos propios de cada servicio están en el panel (castellano)
 * y en lib/i18n/services-content (inglés).
 */
export interface ServicePageCopy {
  meta: { title: (Keyword: string) => string; imageAlt: (name: string) => string };
  jsonLdName: (Keyword: string) => string;
  defaults: {
    commitments: SectorCommitment[];
    problems: SectorProblem[];
    faqs: SectorFaq[];
    includes: string[];
    capacidades: SectorCapacidadTecnica[];
    supportContent: string;
    ctaText: string;
  };
  funnel: { title: string; text: string }[];
  hero: {
    tagline: (name: string) => string;
    h1: (Keyword: string) => string;
    alt: (Keyword: string) => string;
    mobileCta: string;
    seeProjects: (count: number, name: string) => string;
    formStep: string;
    formTitle: string;
    formText: (name: string) => string;
  };
  cta: string;
  trust: { label: string; projects: string; contact: string };
  problems: { eyebrow: string; title: (keyword: string) => string; usual: string; withAlko: string };
  includes: {
    eyebrow: (keyword: string) => string;
    title: string;
    call: string;
    alt: (keyword: string) => string;
    capTitle: (keyword: string) => string;
    capSubtitle: string;
  };
  results: {
    eyebrow: string;
    titleProjects: (keyword: string) => string;
    titleReviews: string;
    all: string;
    alt: (title: string, keyword: string, place: string) => string;
    specs: { zone: string; area: string; duration: string };
    enlarge: (n: number) => string;
    stars: (n: number) => string;
    client: string;
  };
  process: {
    eyebrow: string;
    title: string;
    text: (keyword: string) => string;
    /** Sigue al texto anterior tras dos puntos. */
    textTail: string;
    phases: (count: number) => string;
    method: string;
    phase: string;
  };
  support: { eyebrow: string; title: (keyword: string) => string; cta: string; whatsapp: string };
  faq: { eyebrow: string; title: (keyword: string) => string; text: string; call: string };
  closing: (keyword: string) => string;
  index: {
    meta: { title: string; description: string };
    breadcrumb: string;
    eyebrow: string;
    title: string;
    description: string;
    caption: string;
    divisions: string;
    contact: string;
    seeAll: string;
    indexLabel: string;
    indexTitle: string;
    indexIntro: string;
    cardsLabel: string;
    cardsTitle: string;
    cardAlt: (name: string) => string;
    seeService: string;
    source: string;
  };
}

const es: ServicePageCopy = {
  meta: {
    title: (Keyword) => `${Keyword} en Madrid | ALKO`,
    imageAlt: (name) => `${name} en Madrid`,
  },
  jsonLdName: (Keyword) => `${Keyword} en Madrid`,
  defaults: {
    commitments: [
      { title: "Presupuesto cerrado", text: "Por partidas y acordado antes de empezar." },
      { title: "Plazo por escrito", text: "Con hitos de control durante toda la obra." },
      { title: "Un único equipo", text: "De proyecto a entrega, sin intermediarios." },
    ],
    problems: [
      { avoid: "Presupuestos que crecen a mitad de obra", promise: "Precio cerrado por partidas, firmado antes de empezar" },
      { avoid: "Plazos que nadie cumple", promise: "Calendario por escrito con hitos de control" },
      { avoid: "Gremios descoordinados y llamadas a cinco personas", promise: "Un único jefe de obra como interlocutor" },
      { avoid: "Licencias y trámites que paralizan la obra", promise: "Tramitamos licencias, tasas e inspecciones por ti" },
    ],
    faqs: [
      {
        q: "¿Cómo empieza el proceso y la valoración inicial?",
        a: "Nos cuentas qué necesitas por formulario, por teléfono o por WhatsApp. Un arquitecto técnico analiza la viabilidad del encargo, visita el inmueble y emite una propuesta formal con mediciones detalladas.",
      },
      {
        q: "¿Cómo se evita que haya sobrecostes?",
        a: "Trabajamos a precio cerrado por contrato. Cada partida, material y mano de obra queda fijada antes del inicio. Cualquier modificación que pida la propiedad se presupuesta y se aprueba por escrito antes de ejecutarse.",
      },
      {
        q: "¿Os encargáis de las licencias y los trámites en Madrid?",
        a: "Sí. Tramitamos las licencias de obra (declaración responsable, procedimiento ordinario o licencias de actividad con entidades colaboradoras), tasas e inspecciones municipales.",
      },
      {
        q: "¿Quién supervisa la obra día a día?",
        a: "Asignamos un jefe de obra y arquitecto técnico que coordina los gremios, controla la calidad, recepciona los materiales y te informa cada semana del avance.",
      },
    ],
    includes: [
      "Proyecto técnico y legalización completa",
      "Demoliciones selectivas y redistribución de espacios",
      "Renovación integral de fontanería, electricidad y saneamiento",
      "Climatización de alta eficiencia",
      "Carpinterías exteriores de altas prestaciones térmicas y acústicas",
      "Carpintería a medida e interiorismo",
    ],
    capacidades: [
      {
        codigo: "01",
        titulo: "Arquitectura y proyecto ejecutivo",
        metrica: "Planimetría · Detalle constructivo",
        resumen: "Desarrollo técnico, optimización de espacios y selección de materiales antes del inicio de la obra.",
        puntos: ["Detalles constructivos a escala", "Asesoramiento en interiorismo"],
      },
      {
        codigo: "02",
        titulo: "Gestión de licencias",
        metrica: "Ayuntamiento de Madrid",
        resumen: "Tramitación completa de licencias de obra y de actividad, con seguimiento directo del expediente.",
        puntos: ["Seguridad jurídica", "Trato directo con los técnicos municipales"],
      },
      {
        codigo: "03",
        titulo: "Instalaciones y eficiencia",
        metrica: "Clima · Ventilación · Electricidad",
        resumen: "Cálculo e instalación de climatización, ventilación con recuperación de calor y control domótico.",
        puntos: ["Menor consumo energético", "Confort térmico y acústico homogéneo"],
      },
      {
        codigo: "04",
        titulo: "Acabados y carpintería a medida",
        metrica: "Tolerancia milimétrica",
        resumen: "Panelados, armarios integrados, cerrajerías enrasadas y cocinas a medida.",
        puntos: ["Maderas, piedras y metales", "Encuentros limpios, sin molduras"],
      },
      {
        codigo: "05",
        titulo: "Dirección de obra diaria",
        metrica: "Supervisión a pie de obra",
        resumen: "Un arquitecto técnico presente para asegurar la calidad de ejecución y el cumplimiento de hitos.",
        puntos: ["Inspección de cada fase antes de cerrarla", "Coordinación de gremios"],
      },
      {
        codigo: "06",
        titulo: "Entrega llave en mano y garantía",
        metrica: "Documentación final",
        resumen: "Recepción tras las pruebas de instalaciones, planos finales y garantía posventa directa.",
        puntos: ["Manual de uso y mantenimiento", "Atención posventa prioritaria"],
      },
    ],
    supportContent:
      "Integramos bajo una sola dirección técnica el proyecto, el cálculo de instalaciones, las compras y la obra. Así evitamos las fricciones habituales entre proyectistas y constructoras, y el presupuesto pactado es el definitivo.",
    ctaText:
      "Cuéntanos qué necesitas y el equipo técnico te responderá con una valoración del alcance, el plazo y el presupuesto.",
  },
  funnel: [
    { title: "Nos cuentas tu proyecto", text: "Por el formulario, por teléfono o por WhatsApp. Solo necesitamos lo esencial." },
    { title: "Visita y valoración técnica", text: "Un arquitecto técnico visita el inmueble, analiza la viabilidad y toma mediciones." },
    { title: "Propuesta cerrada y obra", text: "Recibes un presupuesto por partidas y un plazo por escrito. Tú decides cuándo empezamos." },
  ],
  hero: {
    tagline: (name) => `${name} · Madrid`,
    h1: (Keyword) => `${Keyword} en Madrid`,
    alt: (Keyword) => `${Keyword} en Madrid, obra de ALKO`,
    mobileCta: "Pedir valoración",
    seeProjects: (count, name) => `Ver ${count} obras de ${name}`,
    formStep: "Paso 1 de 3 · Sin compromiso",
    formTitle: "Cuéntanos tu proyecto",
    formText: (name) => `Un técnico del equipo de ${name} revisa tu solicitud y te llama para concretar la visita.`,
  },
  cta: "Solicitar valoración",
  trust: { label: "Por qué ALKO", projects: "Obras publicadas de esta división", contact: "Interlocutor de principio a fin" },
  problems: {
    eyebrow: "¿Te suena?",
    title: (keyword) => `Lo que suele salir mal en ${keyword}`,
    usual: "Lo habitual",
    withAlko: "Con ALKO",
  },
  includes: {
    eyebrow: (keyword) => `Qué incluye nuestro servicio de ${keyword}`,
    title: "Todo en un mismo equipo técnico.",
    call: "Llamar",
    alt: (keyword) => `Qué incluye nuestro servicio de ${keyword}`,
    capTitle: (keyword) => `Capacidades técnicas para ${keyword}`,
    capSubtitle: "Disciplinas técnicas",
  },
  results: {
    eyebrow: "Resultados reales",
    titleProjects: (keyword) => `Obras de ${keyword} que ya hemos entregado`,
    titleReviews: "Lo que dicen nuestros clientes",
    all: "Ver todas las obras",
    alt: (title, keyword, place) => `${title}: ${keyword} en ${place}`,
    specs: { zone: "Zona", area: "Superficie", duration: "Plazo" },
    enlarge: (n) => `Ampliar imagen ${n}`,
    stars: (n) => `${n} de 5 estrellas`,
    client: "Cliente de ALKO",
  },
  process: {
    eyebrow: "Cómo funciona",
    title: "Empezar es sencillo",
    text: (keyword) => `Así planificamos y ejecutamos ${keyword}`,
    textTail: "un mismo equipo, con entregables y control en cada fase.",
    phases: (count) => `Ver las ${count} fases de la obra`,
    method: "· Método ALKO",
    phase: "Fase",
  },
  support: {
    eyebrow: "Nuestro compromiso por escrito",
    title: (keyword) => `Tu obra de ${keyword}, sin sorpresas.`,
    cta: "Quiero mi valoración",
    whatsapp: "Escribir por WhatsApp",
  },
  faq: {
    eyebrow: "Antes de decidir",
    title: (keyword) => `Preguntas frecuentes sobre ${keyword}`,
    text: "¿Tienes otra duda? Te la resuelve un técnico.",
    call: "Llamar",
  },
  closing: (keyword) => `Hablemos de tu proyecto\nde ${keyword}.`,
  index: {
    meta: {
      title: "Servicios de reformas y construcción en Madrid | ALKO",
      description:
        "Reformas integrales de pisos, oficinas y locales, viviendas unifamiliares, naves y carpintería en Madrid. Un único equipo y presupuesto cerrado por escrito.",
    },
    breadcrumb: "Servicios",
    eyebrow: "Servicios",
    title: "Especialidades",
    description: "Actuamos de forma transversal para reducir interfaces y garantizar la coherencia entre proyecto y obra.",
    caption: "Divisiones ALKO",
    divisions: "Divisiones",
    contact: "Interlocutor por obra",
    seeAll: "Ver todas las divisiones",
    indexLabel: "Índice",
    indexTitle: "Pensado con propósito,\nconstruido para durar",
    indexIntro:
      "Cada especialidad tiene su propio equipo técnico, con un mismo método de trabajo y un único interlocutor de principio a fin.",
    cardsLabel: "Divisiones",
    cardsTitle: "Elige tu división",
    cardAlt: (name) => `${name} en Madrid`,
    seeService: "Ver servicio",
    source: "Formulario divisiones · /servicios",
  },
};

const en: ServicePageCopy = {
  meta: {
    title: (Keyword) => `${Keyword} in Madrid | ALKO`,
    imageAlt: (name) => `${name} in Madrid`,
  },
  jsonLdName: (Keyword) => `${Keyword} in Madrid`,
  defaults: {
    commitments: [
      { title: "Fixed price", text: "Itemised and agreed before work starts." },
      { title: "Written schedule", text: "With control milestones throughout the build." },
      { title: "One single team", text: "From design to handover, with no middlemen." },
    ],
    problems: [
      { avoid: "Quotes that grow halfway through the build", promise: "Fixed, itemised price, signed before work starts" },
      { avoid: "Deadlines nobody meets", promise: "Written schedule with control milestones" },
      { avoid: "Uncoordinated trades and calls to five different people", promise: "One site manager as your single point of contact" },
      { avoid: "Permits and paperwork that bring the build to a halt", promise: "We handle permits, fees and inspections for you" },
    ],
    faqs: [
      {
        q: "How do the process and the initial assessment start?",
        a: "You tell us what you need using the form, by phone or on WhatsApp. A building surveyor assesses the feasibility of the brief, visits the property and issues a formal proposal with detailed measurements.",
      },
      {
        q: "How are cost overruns avoided?",
        a: "We work to a fixed price set by contract. Every work package, material and labour cost is agreed before work starts. Any change the owner requests is priced and approved in writing before it is carried out.",
      },
      {
        q: "Do you handle permits and paperwork in Madrid?",
        a: "Yes. We obtain building permits (responsible declaration, ordinary procedure or activity licences through accredited bodies), and handle municipal fees and inspections.",
      },
      {
        q: "Who supervises the build day to day?",
        a: "We assign a site manager and building surveyor who coordinates the trades, controls quality, receives materials and updates you on progress every week.",
      },
    ],
    includes: [
      "Technical design and full legalisation",
      "Selective demolition and reconfiguration of spaces",
      "Complete renewal of plumbing, electrics and drainage",
      "High-efficiency air conditioning",
      "External windows and doors with high thermal and acoustic performance",
      "Made-to-measure joinery and interior design",
    ],
    capacidades: [
      {
        codigo: "01",
        titulo: "Architecture and detailed design",
        metrica: "Drawings · Construction details",
        resumen: "Technical development, space optimisation and choice of materials before work starts.",
        puntos: ["Scale construction details", "Interior design advice"],
      },
      {
        codigo: "02",
        titulo: "Permit management",
        metrica: "Madrid City Council",
        resumen: "Full processing of building and activity permits, with direct follow-up of the application.",
        puntos: ["Legal certainty", "Direct contact with council officers"],
      },
      {
        codigo: "03",
        titulo: "Building services and efficiency",
        metrica: "Climate · Ventilation · Electrics",
        resumen: "Design and installation of air conditioning, ventilation with heat recovery and home automation.",
        puntos: ["Lower energy consumption", "Even thermal and acoustic comfort"],
      },
      {
        codigo: "04",
        titulo: "Finishes and made-to-measure joinery",
        metrica: "Millimetre tolerance",
        resumen: "Panelling, built-in wardrobes, flush metalwork and bespoke kitchens.",
        puntos: ["Wood, stone and metal", "Clean junctions, no mouldings"],
      },
      {
        codigo: "05",
        titulo: "Daily site management",
        metrica: "On-site supervision",
        resumen: "A building surveyor on site to ensure build quality and that milestones are met.",
        puntos: ["Each stage inspected before it is closed", "Coordination of trades"],
      },
      {
        codigo: "06",
        titulo: "Turnkey handover and guarantee",
        metrica: "Final documentation",
        resumen: "Handover after testing the installations, with final drawings and a direct after-sales guarantee.",
        puntos: ["User and maintenance manual", "Priority after-sales support"],
      },
    ],
    supportContent:
      "We bring design, building services engineering, procurement and construction together under a single technical lead. This avoids the usual friction between designers and contractors, and the agreed price is the final price.",
    ctaText: "Tell us what you need and the technical team will reply with an assessment of the scope, the schedule and the price.",
  },
  funnel: [
    { title: "Tell us about your project", text: "Using the form, by phone or on WhatsApp. We only need the essentials." },
    { title: "Visit and technical assessment", text: "A building surveyor visits the property, assesses feasibility and takes measurements." },
    { title: "Fixed proposal and build", text: "You receive an itemised quote and a written schedule. You decide when we start." },
  ],
  hero: {
    tagline: (name) => `${name} · Madrid`,
    h1: (Keyword) => `${Keyword} in Madrid`,
    alt: (Keyword) => `${Keyword} in Madrid, a project by ALKO`,
    mobileCta: "Request an assessment",
    seeProjects: (count, name) => `See ${count} ${name} projects`,
    formStep: "Step 1 of 3 · No obligation",
    formTitle: "Tell us about your project",
    formText: (name) => `A specialist from the ${name} team reviews your request and calls you to arrange the visit.`,
  },
  cta: "Request an assessment",
  trust: { label: "Why ALKO", projects: "Published projects in this division", contact: "Point of contact from start to finish" },
  problems: {
    eyebrow: "Sound familiar?",
    title: (keyword) => `What usually goes wrong with ${keyword}`,
    usual: "The usual",
    withAlko: "With ALKO",
  },
  includes: {
    eyebrow: (keyword) => `What our ${keyword} service includes`,
    title: "Everything in one technical team.",
    call: "Call",
    alt: (keyword) => `What our ${keyword} service includes`,
    capTitle: (keyword) => `Technical capabilities for ${keyword}`,
    capSubtitle: "Technical disciplines",
  },
  results: {
    eyebrow: "Real results",
    titleProjects: (keyword) => `${keyword.charAt(0).toUpperCase()}${keyword.slice(1)}: projects we have delivered`,
    titleReviews: "What our clients say",
    all: "See all projects",
    alt: (title, keyword, place) => `${title}: ${keyword} in ${place}`,
    specs: { zone: "Area", area: "Floor area", duration: "Duration" },
    enlarge: (n) => `Enlarge image ${n}`,
    stars: (n) => `${n} out of 5 stars`,
    client: "ALKO client",
  },
  process: {
    eyebrow: "How it works",
    title: "Getting started is easy",
    text: (keyword) => `This is how we plan and deliver ${keyword}`,
    textTail: "one team, with deliverables and control at every stage.",
    phases: (count) => `See the ${count} stages of the build`,
    method: "· The ALKO method",
    phase: "Stage",
  },
  support: {
    eyebrow: "Our commitment in writing",
    title: (keyword) => `Your ${keyword} project, with no surprises.`,
    cta: "Get my assessment",
    whatsapp: "Message us on WhatsApp",
  },
  faq: {
    eyebrow: "Before you decide",
    title: (keyword) => `Frequently asked questions about ${keyword}`,
    text: "Any other questions? A specialist will answer them.",
    call: "Call",
  },
  closing: (keyword) => `Let's talk about your\n${keyword} project.`,
  index: {
    meta: {
      title: "Renovation and construction services in Madrid | ALKO",
      description:
        "Full renovations of flats, offices and commercial premises, detached houses, industrial buildings and metalwork in Madrid. One team and a fixed price in writing.",
    },
    breadcrumb: "Services",
    eyebrow: "Services",
    title: "Specialities",
    description: "We work across disciplines to reduce hand-offs and keep design and construction consistent.",
    caption: "ALKO divisions",
    divisions: "Divisions",
    contact: "Point of contact per project",
    seeAll: "See all divisions",
    indexLabel: "Index",
    indexTitle: "Designed with purpose,\nbuilt to last",
    indexIntro: "Each speciality has its own technical team, with the same way of working and a single point of contact from start to finish.",
    cardsLabel: "Divisions",
    cardsTitle: "Choose your division",
    cardAlt: (name) => `${name} in Madrid`,
    seeService: "See service",
    // Origen interno que llega al correo del equipo (en castellano; FinalContact añade « · EN»).
    source: "Formulario divisiones · /en/services",
  },
};

export const SERVICE_PAGE_COPY: Record<Locale, ServicePageCopy> = { es, en };

/**
 * Fases del Método ALKO en inglés, por su título en castellano (vienen del panel o de DEFAULT_FASES).
 * Si una fase no está aquí, se muestra tal cual.
 */
export const FASES_EN: Record<string, { title: string; texto: string }> = {
  Construcción: {
    title: "Construction",
    texto:
      "Civil works, technical masonry, structural reinforcement and millimetre-precise setting out. Our own team ensures construction accuracy and complete fidelity to the architectural design.",
  },
  Instalaciones: {
    title: "Building services",
    texto:
      "Design and integration of concealed climate control (heat pumps and underfloor heating), advanced electrics, KNX home automation, plumbing and technical lighting to the highest energy-efficiency standards.",
  },
  Compras: {
    title: "Procurement",
    texto:
      "Selection of and direct negotiation with manufacturers of fine materials: natural stone, solid wood, minimalist joinery and designer fittings, with full traceability and a fixed cost.",
  },
  Coordinación: {
    title: "Coordination",
    texto:
      "Thorough synchronisation of specialist trades and technical control on site. A single point of contact coordinates every trade daily to eliminate downtime and mismatches.",
  },
  Control: {
    title: "Quality control",
    texto:
      "Continuous checking of tolerances, watertightness tests, acoustic tests and thorough inspection of finishes to ensure the schedule and the agreed quality are strictly met.",
  },
  Entrega: {
    title: "Handover",
    texto:
      "Final milestone with formal turnkey handover and a deep technical clean. We hand over the building log, system operating manuals, approved certificates and after-sales guarantee cover.",
  },
};
