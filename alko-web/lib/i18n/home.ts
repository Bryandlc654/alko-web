import type { Locale } from "@/lib/i18n";

/**
 * Textos de la portada en cada idioma. El castellano es el texto original de la web; el
 * inglés es su adaptación (no una traducción palabra por palabra).
 *
 * El contenido que viene del panel (proyectos, servicios, fabricantes, artículos) no se
 * traduce aquí: se muestra tal cual.
 */
const es = {
  meta: {
    title: "Reformas integrales y construcción en Madrid | ALKO",
    description:
      "Reformas integrales de viviendas, oficinas y locales en Madrid. Un único equipo de proyecto a entrega, con presupuesto cerrado y plazo por escrito.",
  },
  /** Sufijo del origen de los formularios (para saber desde qué idioma llega el lead). */
  sourceSuffix: "",
  hero: {
    label: "Ámbitos de ALKO",
    roledescription: "carrusel",
    keyword: "Reformas integrales y construcción en Madrid",
    titleA: "Construimos espacios",
    titleB: "que permanecen.",
    explore: "Explorar proyectos",
    present: "Presentar proyecto",
    prev: "Imagen anterior",
    next: "Imagen siguiente",
    view: "Ver",
    captions: ["Construcción integral", "Residential", "Arquitectura interior", "Corporate"],
    /** Texto alternativo de las fotos por defecto (las del panel usan el suyo). */
    alts: {} as Record<string, string>,
  },
  positioning: {
    label: "Posicionamiento",
    eyebrow: "Construcción con sensibilidad arquitectónica",
    title: "La obra es un proceso de decisiones coordinadas. Nosotros lo dirigimos de principio a fin.",
    text: "Definición técnica, planificación, ejecución y entrega, con un único interlocutor y atención al resultado final. Construimos para quien valora la calidad que se puede verificar.",
    facts: ["Un interlocutor", "Divisiones", "Etapas de método"],
    cta: "Conocer el estudio",
    alt: "Dirección de obra de una cocina integral por ALKO",
    captionA: "Interior",
    captionB: "Detalle",
  },
  divisions: {
    eyebrow: "01 / Qué hacemos",
    titleA: "Cuatro ámbitos.",
    titleB: "Un mismo criterio.",
    text: "Un mismo sistema de trabajo, adaptado a lo que necesita cada cliente: tranquilidad en casa, continuidad en la empresa, experiencia en el local y rendimiento en la nave.",
    explore: "Explorar",
    exploreDivision: "Explorar división",
    disclaimer: "Imágenes de referencia · No representan obras de ALKO",
    all: "Explorar divisiones",
    desc: {
      residential: "Viviendas, reformas integrales y proyectos residenciales de alta gama.",
      corporate: "Oficinas, sedes empresariales e implantación de empresas.",
      hospitality: "Hoteles, restauración, boutiques, locales comerciales y showrooms.",
      industrial: "Adecuación de naves, rehabilitación e instalaciones complejas.",
    },
  },
  works: {
    eyebrow: "02 / Proyectos seleccionados",
    titleA: "Obra a obra.",
    titleB: "Detalle a detalle.",
    text: "Cada intervención tiene su propia ficha: punto de partida, condicionantes, intervención de ALKO y resultado.",
    project: "Proyecto",
    specs: { tipologia: "Tipología", ubicacion: "Ubicación", superficie: "Superficie", plazo: "Plazo" },
    viewSheet: "Ver ficha del proyecto",
    viewShort: "Ver ficha",
    documented: "Cada obra, documentada de principio a fin",
    all: "Ver todos los proyectos",
  },
  materialStrip: {
    label: "Materialidad",
    title: "Materia y oficio",
    text: "Piedra, madera y luz. Seleccionamos cada material según el proyecto aprobado y lo ejecutamos con oficios coordinados.",
    alts: [
      "Salón con chimenea, madera y grandes ventanales en una reforma de ALKO",
      "Detalle de mármol, latón y vegetación en un interior reformado por ALKO",
      "Terraza frente al mar con mobiliario de madera y tejidos naturales",
    ],
  },
  method: {
    eyebrow: "03 / Método ALKO",
    titleA: "Cinco etapas.",
    titleB: "Una sola dirección.",
    text: "Del primer encuentro a la entrega, cada fase tiene responsables, criterios y documentación.",
    cta: "Conocer nuestro método",
    steps: [
      {
        title: "Escuchar y evaluar",
        text: "Revisamos necesidades, documentación existente y características del inmueble para delimitar el encargo.",
      },
      {
        title: "Definir el alcance",
        text: "Establecemos las soluciones y partidas a estudiar, los criterios técnicos y las responsabilidades de cada interviniente.",
      },
      {
        title: "Planificar y comprar",
        text: "Organizamos los oficios, el calendario de ejecución y la selección de materiales de acuerdo con el proyecto aprobado.",
      },
      {
        title: "Ejecutar y coordinar",
        text: "Trabajamos con control de calidad, seguimiento del avance y comunicación de incidencias durante la obra.",
      },
      {
        title: "Verificar y entregar",
        text: "Comprobamos los trabajos y formalizamos la entrega conforme al alcance contratado.",
      },
    ],
  },
  manifesto: {
    label: "Manifiesto",
    title: "Construimos hoy espacios que permanecen mañana",
    text: "Coordinamos arquitectura, oficios e instalaciones para entregar espacios bien resueltos y duraderos.",
    cta: "Hablar con el equipo",
  },
  team: {
    eyebrow: "Nuestro equipo",
    title: "Conoce al equipo que construye tu proyecto",
    text: "Jefes de obra, técnicos y oficios coordinados por un mismo equipo, con cada decisión documentada.",
    cta: "Ver el equipo",
    alt: "Pasillo de una reforma en ejecución, con iluminación LED y un operario rematando el suelo",
    /** Nombre de los servicios del panel en este idioma (si falta, se usa el del panel). */
    sectors: {} as Record<string, string>,
  },
  materials: {
    /** En castellano manda el texto del panel; estos son los valores por defecto. */
    tag: "Materiales de confianza",
    title: "Trabajamos con fabricantes de referencia",
    text: "",
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    titleA: "Preguntas que",
    titleB: "merece la pena hacer",
    answer: "Respuesta",
    ask: "Haz tu pregunta",
  },
  contact: {
    title: "Hablemos",
    description: "Cuéntanos lo esencial. Un técnico de la división correspondiente revisará tu solicitud y te contactará.",
  },
};

export type HomeCopy = typeof es;

const en: HomeCopy = {
  meta: {
    title: "Renovation and construction company in Madrid | ALKO",
    description:
      "Full renovations of homes, offices and commercial spaces in Madrid. One team from design to handover, with a fixed price and a written schedule.",
  },
  sourceSuffix: " · EN",
  hero: {
    label: "ALKO divisions",
    roledescription: "carousel",
    keyword: "Full renovation and construction in Madrid",
    titleA: "We build spaces",
    titleB: "that endure.",
    explore: "Explore projects",
    present: "Tell us about your project",
    prev: "Previous image",
    next: "Next image",
    view: "View",
    captions: ["Integrated construction", "Residential", "Interior architecture", "Corporate"],
    alts: {
      "/hero-dormitorio.jpg": "Bedroom with indirect lighting, made-to-measure wardrobe and natural light",
      "/hero-cocina.jpg": "Kitchen with island, integrated appliances and wooden floor",
      "/hero-salon-bar.jpg": "Living room with a green lacquered bar cabinet, fireplace and doors to the garden",
    },
  },
  positioning: {
    label: "Our approach",
    eyebrow: "Construction with an architectural eye",
    title: "A build is a process of coordinated decisions. We lead it from start to finish.",
    text: "Technical definition, planning, execution and handover, with a single point of contact and close attention to the final result. We build for clients who value quality they can verify.",
    facts: ["Point of contact", "Divisions", "Method stages"],
    cta: "About the studio",
    alt: "ALKO site management on a full kitchen renovation",
    captionA: "Interior",
    captionB: "Detail",
  },
  divisions: {
    eyebrow: "01 / What we do",
    titleA: "Four fields.",
    titleB: "One standard.",
    text: "One way of working, tailored to what each client needs: peace of mind at home, continuity for businesses, experience in hospitality and retail, and performance in industrial spaces.",
    explore: "Explore",
    exploreDivision: "Explore division",
    disclaimer: "Reference images · Not ALKO projects",
    all: "Explore divisions",
    desc: {
      residential: "Homes, full renovations and high-end residential projects.",
      corporate: "Offices, headquarters and company fit-outs.",
      hospitality: "Hotels, restaurants, boutiques, retail units and showrooms.",
      industrial: "Warehouse fit-outs, refurbishment and complex installations.",
    },
  },
  works: {
    eyebrow: "02 / Selected projects",
    titleA: "Project by project.",
    titleB: "Detail by detail.",
    text: "Every project has its own case study: starting point, constraints, what ALKO did and the result.",
    project: "Project",
    specs: { tipologia: "Type", ubicacion: "Location", superficie: "Area", plazo: "Timeframe" },
    viewSheet: "View case study",
    viewShort: "View project",
    documented: "Every project, documented from start to finish",
    all: "View all projects",
  },
  materialStrip: {
    label: "Materials",
    title: "Materials and craft",
    text: "Stone, wood and light. We choose every material to match the approved design and install it with coordinated trades.",
    alts: [
      "Living room with fireplace, wood and large windows in an ALKO renovation",
      "Marble, brass and greenery in an interior renovated by ALKO",
      "Seafront terrace with wooden furniture and natural fabrics",
    ],
  },
  method: {
    eyebrow: "03 / The ALKO method",
    titleA: "Five stages.",
    titleB: "One direction.",
    text: "From the first meeting to handover, every stage has clear owners, criteria and documentation.",
    cta: "Discover our method",
    steps: [
      {
        title: "Listen and assess",
        text: "We review your needs, the existing documentation and the property itself to define the scope of the brief.",
      },
      {
        title: "Define the scope",
        text: "We set out the solutions and work packages to price, the technical criteria and who is responsible for what.",
      },
      {
        title: "Plan and procure",
        text: "We organise the trades, the build schedule and the choice of materials in line with the approved design.",
      },
      {
        title: "Build and coordinate",
        text: "We work with quality control, progress tracking and clear reporting of any issues throughout the build.",
      },
      {
        title: "Check and hand over",
        text: "We inspect the work and formally hand over the project in line with the agreed scope.",
      },
    ],
  },
  manifesto: {
    label: "Manifesto",
    title: "We build spaces today that will endure tomorrow",
    text: "We coordinate architecture, trades and building services to deliver spaces that are well resolved and built to last.",
    cta: "Talk to the team",
  },
  team: {
    eyebrow: "Our team",
    title: "Meet the team that builds your project",
    text: "Site managers, technical staff and trades coordinated by one team, with every decision documented.",
    cta: "Meet the team",
    alt: "Hallway of a renovation in progress, with LED lighting and a tradesman finishing the floor",
    sectors: {
      Oficinas: "Offices",
      Residencial: "Residential",
      Retail: "Retail",
      Hospitality: "Hospitality",
      "Viviendas unifamiliares": "Detached houses",
      "Naves industriales": "Industrial buildings",
      "Restauración de locales": "Commercial premises restoration",
      "Carpintería metálica": "Metalwork",
      "Ventanas acústicas": "Acoustic windows",
      "Cabinas acústicas para oficinas": "Office acoustic pods",
      "Concierge para familias extranjeras": "Concierge for international families",
      "Implantación de empresas internacionales": "International company set-up",
      "Reformas integrales": "Full renovations",
    },
  },
  materials: {
    tag: "Trusted materials",
    title: "We work with leading manufacturers",
    text: "Brands we specify and install regularly, chosen for their quality, durability and after-sales support.",
  },
  faq: {
    eyebrow: "FAQ",
    titleA: "Questions",
    titleB: "worth asking",
    answer: "Answer",
    ask: "Ask us a question",
  },
  contact: {
    title: "Let’s talk",
    description: "Tell us the essentials. A specialist from the relevant division will review your request and get in touch.",
  },
};

export const HOME_COPY: Record<Locale, HomeCopy> = { es, en };
