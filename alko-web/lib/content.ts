import type {
  Article,
  Descarga,
  Fabricante,
  Fase,
  Guide,
  Project,
  Sector,
  HomeContent,
  SiteSettings,
  Slide,
} from "./types";

/**
 * Contenido por defecto.
 *
 * Respaldo cuando WordPress no está configurado o todavía no tiene entradas
 * publicadas. Reproduce el contenido original del sitio estático (con slugs y
 * contenido de detalle) para que todas las rutas funcionen desde el primer
 * momento. En cuanto el CMS tenga contenido, la capa de datos lo reemplaza.
 *
 * Todas las imágenes son locales (carpeta /public) para no depender de hosts
 * externos y mantener la optimización de next/image.
 */

export const DEFAULT_HERO_SLIDES: Slide[] = [
  { id: "hero-1", image: "/slide1.jpg", alt: "Proyecto de Arquitectura y Reforma 1" },
  { id: "hero-2", image: "/slide2.jpg", alt: "Proyecto de Arquitectura y Reforma 2" },
];

export const DEFAULT_SHOWCASE_SLIDES: Slide[] = [
  {
    id: "showcase-1",
    image: "/start-research-1.jpg",
    alt: "START RESEARCH - Chimenea suspendida, hormigón visto y carpinterías a medida",
  },
  {
    id: "showcase-2",
    image: "/start-research-2.jpg",
    alt: "START RESEARCH - Ventanales panorámicos y apertura a terraza",
  },
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "p-1",
    slug: "start-research",
    title: "START RESEARCH",
    indice: "01",
    anio: "2024",
    ubicacion: "Pozuelo de Alarcón, Madrid",
    tipologia: "Vivienda Unifamiliar Aislada",
    cliente: "Cliente particular",
    servicio: "viviendas",
    superficie: "520 m²",
    plazo: "14 meses",
    imagen: "/start-research-1.jpg",
    fotoAntes: "/start-research-1.jpg",
    fotoDespues: "/start-research-2.jpg",
    galeria: ["/start-research-1.jpg", "/start-research-2.jpg", "/setart.jpg"],
    enlace: "/proyectos/start-research",
    content: "<p>Vivienda unifamiliar de arquitectura contemporánea que combina hormigón visto, grandes paños acristalados y carpinterías a medida de alta eficiencia térmica.</p>",
    reto: "Integrar la estructura de hormigón arquitectónico visto con carpinterías de suelo a techo sin perfiles vistos, garantizando el aislamiento acústico y térmico de estándar passivhaus.",
    solucion: "Coordinación milimétrica entre la estructura de hormigón autocompactante y las carpinterías embutidas en suelo y techo, con rotura de puente térmico y suelo radiante-refrescante zonificado.",
    alcance: ["Estructura de hormigón visto", "Carpinterías de suelo a techo embutidas", "Suelo radiante-refrescante y aerotermia", "Domótica KNX integral"],
    cifras: [
      { valor: "520 m²", etiqueta: "Superficie construida" },
      { valor: "14", etiqueta: "Meses de ejecución" },
      { valor: "A", etiqueta: "Calificación energética" },
      { valor: "0", etiqueta: "Desviación de presupuesto" },
    ],
    cronograma: [
      { periodo: "Meses 1-4", titulo: "Cimentación y estructura", texto: "Excavación, contención y ejecución de muros y losas en hormigón visto." },
      { periodo: "Meses 5-8", titulo: "Envolvente y carpinterías", texto: "Impermeabilización, aislamientos y montaje de carpinterías ocultas." },
      { periodo: "Meses 9-12", titulo: "Instalaciones y climatización", texto: "Aerotermia, suelo radiante, ventilación mecánica con recuperador de calor." },
      { periodo: "Meses 13-14", titulo: "Acabados y puesta en marcha", texto: "Pavimentos continuos, revestimientos de madera natural y calibración domótica." },
    ],
    materiales: [
      { elemento: "Estructura", detalle: "Hormigón blanco autocompactante con acabado visto de tabla fenólico" },
      { elemento: "Carpinterías", detalle: "Aluminio de hoja oculta con triple vidrio bajo emisivo y control solar" },
      { elemento: "Pavimentos", detalle: "Microcemento continuo en planta baja y tarima de roble natural en planta alta" },
      { elemento: "Climatización", detalle: "Sistema de aerotermia reversible con fancoils integrados en falso techo" },
    ],
    resultado: "Vivienda de altísima eficiencia y confort, entregada en el plazo pactado y con un estándar estético riguroso y depurado.",
  },
  {
    id: "p-2",
    slug: "reforma-integral-velazquez",
    title: "REFORMA VELÁZQUEZ",
    indice: "02",
    anio: "2024",
    ubicacion: "Barrio de Salamanca, Madrid",
    tipologia: "Residencial de Alta Gama",
    cliente: "Cliente particular",
    servicio: "reformas-integrales",
    superficie: "280 m²",
    plazo: "6 meses",
    imagen: "/el-viso.jpg",
    fotoAntes: "/slide1.jpg",
    fotoDespues: "/el-viso.jpg",
    galeria: ["/el-viso.jpg", "/slide1.jpg"],
    enlace: "/proyectos/reforma-integral-velazquez",
    content: "<p>Rehabilitación integral de vivienda señorial de principios del siglo XX, conservando molduras y elementos originales combinados con distribución contemporánea de espacios fluidos.</p>",
    reto: "Restaurar elementos protegidos de escayola y carpinterías originales incorporando un sistema invisible de climatización por conductos y domótica avanzada.",
    solucion: "Falsos techos técnicos acústicos descolgados perimetralmente para alojar conductos de impulsión lineal sin tocar las molduras históricas restauradas por maestros artesanos.",
    alcance: ["Restauración de molduras históricas", "Carpintería artesanal lacada a medida", "Climatización invisible por conductos", "Suelos de mármol y espiga de roble"],
    cifras: [
      { valor: "280 m²", etiqueta: "Superficie útil" },
      { valor: "6", etiqueta: "Meses de obra" },
      { valor: "100%", etiqueta: "Molduras preservadas" },
      { valor: "±0%", etiqueta: "Cumplimiento de plazos" },
    ],
    cronograma: [
      { periodo: "Mes 1", titulo: "Demolición selectiva", texto: "Retirada cuidadosa de particiones conservando elementos protegidos." },
      { periodo: "Meses 2-3", titulo: "Refuerzo estructural e instalaciones", texto: "Refuerzo de forjados de madera e instalación completa de redes ocultas." },
      { periodo: "Meses 4-5", titulo: "Restauración y revestimientos", texto: "Trabajos de escayola, colocación de parquet en espiga y aplacados de piedra natural." },
      { periodo: "Mes 6", titulo: "Carpintería y entrega", texto: "Montaje de armarios a medida, iluminación indirecta y limpieza exhaustiva." },
    ],
    materiales: [
      { elemento: "Suelos", detalle: "Parquet de roble macizo colocado en espiga húngara con barniz al agua mate" },
      { elemento: "Mármoles", detalle: "Mármol Calacatta pulido en baños principales y cocina" },
      { elemento: "Griferías", detalle: "Latón envejecido con tecnología termostática oculta" },
      { elemento: "Mecanismos", detalle: "Interruptores metálicos con acabado bronce cepillado" },
    ],
    resultado: "Equilibrio sereno entre la memoria patrimonial del inmueble y el confort tecnológico contemporáneo más exigente.",
  },
  {
    id: "p-3",
    slug: "sede-corporativa-almagro",
    title: "SEDE ALMAGRO",
    indice: "03",
    anio: "2023",
    ubicacion: "Chamberí, Madrid",
    tipologia: "Oficinas y Espacio Corporativo",
    cliente: "Firma de servicios profesionales",
    servicio: "oficinas",
    superficie: "850 m²",
    plazo: "5 meses",
    imagen: "/oficinas.jpg",
    fotoAntes: "/slide2.jpg",
    fotoDespues: "/oficinas.jpg",
    galeria: ["/oficinas.jpg", "/slide2.jpg", "/sector-oficinas.jpg"],
    enlace: "/proyectos/sede-corporativa-almagro",
    content: "<p>Acondicionamiento integral de tres plantas para sede corporativa de alta representación, combinando despachos privados, salas de consejo acústicamente aisladas y áreas de trabajo colaborativo abiertas.</p>",
    reto: "Ejecutar la obra completa sin interrumpir la actividad de los inquilinos de las plantas colindantes del edificio representativo.",
    solucion: "Planificación de trabajos ruidosos en horario nocturno, uso de tabiquería fonoabsorbente de altas prestaciones (Rw = 52 dB) y climatización VRV zonificada.",
    alcance: ["Mamparas acústicas de doble vidrio", "Suelo técnico elevado con acabado textil", "Iluminación circadiana inteligente", "Salas de reuniones con absorción acústica"],
    cifras: [
      { valor: "850 m²", etiqueta: "Superficie acondicionada" },
      { valor: "5", etiqueta: "Meses de obra" },
      { valor: "52 dB", etiqueta: "Aislamiento acústico" },
      { valor: "70", etiqueta: "Puestos de trabajo" },
    ],
    cronograma: [
      { periodo: "Mes 1", titulo: "Desmantelamiento y adecuación", texto: "Vaciado del espacio, trazado topográfico e inspección de acometidas." },
      { periodo: "Meses 2-3", titulo: "Suelo técnico y climatización VRV", texto: "Montaje de estructura portante de suelo y canalizaciones de climatización y telecomunicaciones." },
      { periodo: "Mes 4", titulo: "Mamparas y techos acústicos", texto: "Instalación de divisiones de vidrio óptico y paneles fonoabsorbentes de madera ranurada." },
      { periodo: "Mes 5", titulo: "Mobiliario técnico y puesta en marcha", texto: "Conexión de puestos electrificados, pruebas de red Cat 6A y certificación acústica." },
    ],
    materiales: [
      { elemento: "Mamparas", detalle: "Vidrio laminado acústico Silence con carpintería perimetral negra ultrafina" },
      { elemento: "Techos", detalle: "Paneles fonoabsorbentes de lamas de madera natural microperforada" },
      { elemento: "Pavimento", detalle: "Moqueta en losetas de fibras recicladas de alta resistencia al tráfico" },
      { elemento: "Luminarias", detalle: "Perfiles LED suspendidos con control DALI y sensores de presencia y aporte solar" },
    ],
    resultado: "Espacio de trabajo sofisticado y silencioso que proyecta solvencia institucional y maximiza la productividad del equipo.",
  },
];

export const DEFAULT_SECTORS: Sector[] = [
  {
    id: "s-1",
    slug: "viviendas",
    numero: "01",
    title: "Viviendas Unifamiliares",
    descripcion: "Construcción y reforma de chalets y residencias singulares con máxima exigencia en acabados y eficiencia.",
    imagen: "/p1.jpg",
    enlace: "/servicios/viviendas",
    content: "<p>Acompañamos a arquitectos y propietarios en la materialización de residencias exclusivas. Desde la cimentación hasta el último detalle de cerrajería y domótica, aportamos rigor constructivo y transparencia financiera en cada fase.</p>",
  },
  {
    id: "s-2",
    slug: "reformas-integrales",
    numero: "02",
    title: "Reformas Integrales de Alta Gama",
    descripcion: "Transformación completa de pisos señoriales, áticos y viviendas exclusivas en las mejores zonas de Madrid.",
    imagen: "/p2.jpg",
    enlace: "/servicios/reformas-integrales",
    content: "<p>Especialistas en redistribución espacial, refuerzo estructural y restauración de elementos arquitectónicos protegidos. Coordinamos a todos los gremios especializados bajo la batuta de un arquitecto técnico asignado a tu proyecto.</p>",
  },
  {
    id: "s-3",
    slug: "oficinas",
    numero: "03",
    title: "Sedes Corporativas & Oficinas",
    descripcion: "Implantación de espacios de trabajo que potencian la cultura de empresa y cumplen los más altos estándares técnicos.",
    imagen: "/p3.jpg",
    enlace: "/servicios/oficinas",
    content: "<p>Acondicionamiento y fit-out corporativo llave en mano. Minimizamos los tiempos de inactividad con cronogramas exigentes, garantizando el aislamiento acústico y la flexibilidad de instalaciones requeridas por las compañías líderes.</p>",
  },
  {
    id: "s-4",
    slug: "retail",
    numero: "04",
    title: "Espacios Comerciales & Retail",
    descripcion: "Locales comerciales, boutiques y showrooms donde la imagen de marca y los plazos de apertura son innegociables.",
    imagen: "/p1.jpg",
    enlace: "/servicios/retail",
    content: "<p>Ejecución ágil de proyectos comerciales con estricto control de costes y plazos de apertura al público. Cumplimiento exhaustivo de normativas de accesibilidad, seguridad y licencias de actividad en Madrid.</p>",
  },
];

export const DEFAULT_FASES: Fase[] = [
  {
    id: "f-1",
    tag: "(01)",
    title: "Análisis técnico y viabilidad",
    texto: "Estudio minucioso de la planimetría, estado actual de la estructura, acometidas existentes y normativa urbanística aplicable para evitar cualquier imprevisto.",
    imagen: "/fase1.jpg",
  },
  {
    id: "f-2",
    tag: "(02)",
    title: "Planificación y presupuesto cerrado",
    texto: "Elaboración de mediciones pormenorizadas, comparativos de precios de subcontratas y cronograma detallado Gantt con hitos claros de certificación.",
    imagen: "/fase2.jpg",
  },
  {
    id: "f-3",
    tag: "(03)",
    title: "Gestión de licencias y permisos",
    texto: "Tramitación integral de licencias de obra mayor, declaraciones responsables, tasas municipales y coordinación de seguridad y salud con los organismos competentes.",
    imagen: "/fase3.jpg",
  },
  {
    id: "f-4",
    tag: "(04)",
    title: "Ejecución y dirección de obra",
    texto: "Presencia continua a pie de obra de nuestro jefe de obra y arquitecto técnico, supervisando la calidad de ejecución de cada partida e instalador.",
    imagen: "/fase4.jpg",
  },
  {
    id: "f-5",
    tag: "(05)",
    title: "Control de calidad y pruebas técnicas",
    texto: "Ensayos de estanqueidad, pruebas de presión de tuberías, equilibrado de circuitos de climatización y mediciones acústicas in situ antes de cerrar falsos techos.",
    imagen: "/fase5.jpg",
  },
  {
    id: "f-6",
    tag: "(06)",
    title: "Entrega llave en mano y postventa",
    texto: "Revisión exhaustiva con lista cero defectos, entrega de libro del edificio con garantías técnicas de materiales y servicio postventa ágil y resolutivo.",
    imagen: "/fase6.jpg",
  },
];

export const DEFAULT_FABRICANTES: Fabricante[] = [
  { id: "fab-1", name: "Porcelanosa", logo: "/logos/porcelanosa.svg", url: "https://www.porcelanosa.com" },
  { id: "fab-2", name: "Cortizo", logo: "/logos/cortizo.svg", url: "https://www.cortizo.com" },
  { id: "fab-3", name: "Daikin", logo: "/logos/daikin.svg", url: "https://www.daikin.es" },
  { id: "fab-4", name: "Cosentino", logo: "/logos/cosentino.svg", url: "https://www.cosentino.com" },
  { id: "fab-5", name: "Jung", logo: "/logos/jung.svg", url: "https://www.jung.de" },
  { id: "fab-6", name: "Grohe", logo: "/logos/grohe.svg", url: "https://www.grohe.es" },
];

export const DEFAULT_ARTICLES: Article[] = [
  {
    id: "art-1",
    slug: "como-planificar-una-reforma-integral-sin-desviaciones",
    title: "Cómo planificar una reforma integral en Madrid sin desviaciones de plazo ni presupuesto",
    category: "Metodología",
    excerpt: "Las claves que marcan la diferencia entre una obra fluida y un cúmulo de sorpresas: proyecto ejecutivo completo, mediciones cerradas y dirección técnica rigurosa.",
    content: "<p>Emprender una reforma de gran calado requiere método y anticipación. En este artículo desgranamos los 5 pilares para blindar tu inversión.</p>",
    image: "/art1.jpg",
    date: "2024-03-15",
  },
  {
    id: "art-2",
    slug: "aerotermia-y-suelo-radiante-en-rehabilitacion",
    title: "Aerotermia y suelo radiante-refrescante: viabilidad y ventajas en edificios existentes",
    category: "Instalaciones",
    excerpt: "Analizamos los requisitos técnicos de potencia eléctrica, alturas libres de techos y espesores de solera necesarios para instalar aerotermia en pisos de fincas clásicas.",
    content: "<p>La sustitución de calderas de gasóleo o gas por sistemas de bomba de calor aerotérmica permite reducir el consumo hasta un 70%, mejorando el confort estacional.</p>",
    image: "/art2.jpg",
    date: "2024-02-28",
  },
  {
    id: "art-3",
    slug: "carpinterias-de-aluminio-de-hoja-oculta",
    title: "Carpinterías de aluminio de hoja oculta: luz natural y aislamiento de altas prestaciones",
    category: "Materiales",
    excerpt: "Descubre cómo los perfiles minimalistas embutidos en obra transforman la relación entre interior y exterior sin renunciar a valores de transmitancia térmica excepcionales.",
    content: "<p>La arquitectura moderna exige la máxima transparencia. Las soluciones de hoja oculta logran frentes acristalados continuos con perfiles vistos de apenas 20 mm.</p>",
    image: "/art3.jpg",
    date: "2024-01-20",
  },
];

export const DEFAULT_GUIDES: Guide[] = [
  {
    id: "g-1",
    slug: "guia-reforma-integral",
    numero: "01",
    title: "Guía completa para afrontar una reforma integral",
    tema: "PLANIFICACIÓN",
    descripcion: "Paso a paso desde la definición de necesidades hasta la entrega de llaves y contratos con garantías.",
    lectura: "10 min",
    imagen: "/p2.jpg",
    content: "<p>Una guía técnica y práctica diseñada para propietarios que buscan entender el proceso constructivo.</p>",
  },
];

export const DEFAULT_DESCARGAS: Descarga[] = [
  {
    id: "d-1",
    slug: "checklist-obra",
    title: "Checklist técnico para recepción de obra",
    descripcion: "Documento en PDF con más de 60 puntos de control para verificar antes de firmar el acta final de recepción de obra.",
    archivo: "/descargas/checklist.pdf",
    formato: "PDF",
    peso: "180 KB",
    guia: "guia-reforma-integral",
  },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  telefono: "+34 910 000 000",
  email: "info@alkoreformas.com",
  whatsapp: "+34 600 000 000",
  direccion: "Calle Velázquez 12, 28001 Madrid",
  horario: "8:30am - 5pm",
  linkedin: "#",
  facebook: "#",
  instagram: "#",
};

export const DEFAULT_HOME_CONTENT: HomeContent = {
  heroTitulo: "Construcción",
  heroSubtitulo: "y reformas integrales en Madrid.",
  heroDescripcion: "Ejecutamos proyectos residenciales y corporativos de alta exigencia, coordinando construcción, instalaciones, acabados y gestión técnica hasta la entrega final.",
  heroCtaTexto: "SOLICITAR PRESUPUESTO",
  heroSecundarioTexto: "Explorar",
  heroSlides: DEFAULT_HERO_SLIDES,

  proyectosTitulo: "PROYECTOS",
  proyectosSubtitulo: "Cada proyecto rige planificación, ejecución, coordinación técnica y control hasta la entrega.",
  proyectosCtaTexto: "DESCUBRIR PROYECTOS",

  procesoTitulo: "Nuestro proceso",
  procesoSubtitulo: "SECUENCIA DE COORDINACIÓN INTEGRAL · 6 FASES · 1 EQUIPO",

  serviciosTag: "SERVICIOS Y SECTORES",
  serviciosTitulo: "ESPECIALIDADES",
  serviciosDescripcion: "Actuamos de forma transversal en rehabilitación, reforma integral, obra nueva y gestión de instalaciones técnicas con un único responsable de proyecto.",

  workshopBadge: "START RESEARCH",
  workshopTitulo: "Soluciones arquitectónicas y técnicas con criterio constructivo.",
  workshopDescripcion: "Investigar, coordinar y ejecutar: cada detalle responde a una exigencia funcional, constructiva y estética.",
  workshopSlides: DEFAULT_SHOWCASE_SLIDES,

  experienciaImagen: "/90dias.jpg",
  experienciaBadges: ["Climatización", "Ventilación", "Red de Datos", "Acabados H2"],

  materialesTag: "ESPECIFICACIÓN TÉCNICA & CALIDAD",
  materialesTitulo: "Materiales y fabricantes",
  materialesDescripcion: "Soluciones y materiales seleccionados según las necesidades técnicas de cada proyecto.",

  articulosTag: "BIBLIOTECA TÉCNICA",
  articulosTitulo: "Conocimiento",
  articulosCtaTexto: "Ver todo",

  contactoTitulo: "Hablemos de tu\npróximo proyecto.",
  contactoDescripcion: "Una única interlocución para coordinar arquitectura, compras, instalaciones y obra completa. Sin intermediarios ni imprevistos.",
  contactoBgImagen: "/cta-bg.jpg",
};

export const DEFAULT_PROJECTS_PAGE_CONTENT: import('./types').ProjectsPageContent = {
  headerBadge: "PROYECTOS",
  headerTitulo: "Obra hecha,\nobra entregada.",
  headerDescripcion: "Una selección de obras donde la planificación, la coordinación y la ejecución garantizan los objetivos de plazo y calidad.",
  headerBgImage: "/start-research-1.jpg",
  portfolioTag: "PORTFOLIO",
  portfolioTitulo: "Obras seleccionadas",
};

export const DEFAULT_NOSOTROS_PAGE_CONTENT: import('./types').NosotrosPageContent = {
  headerBadge: "NOSOTROS",
  headerTitulo: "Arquitectura.\nConstrucción.\nDirección integrada.",
  headerDescripcion: "Estudio de construcción y reformas integrales en Madrid. Menos interfaces, más control.",
  headerBgImage: "/oficinas.jpg",

  introTag: "Sobre ALKO · Desde 1996",
  introTitulo: "Un criterio único para cada obra.",
  introLead: "Construimos y reformamos espacios en los que querrías vivir y trabajar, con un único responsable desde la primera visita hasta la entrega.",
  introCol1: "Coordinamos proyecto, compras, instalaciones y acabados bajo una misma dirección técnica. Así cada decisión se toma con toda la obra a la vista.",
  introCol2: "Reformas integrales, obra nueva y adecuaciones de viviendas, oficinas y espacios comerciales, sin intermediarios ni imprevistos.",

  cifras: [
    { valor: "1996", etiqueta: "Construyendo y reformando en Madrid" },
    { valor: "1", etiqueta: "Interlocutor para todo el proyecto" },
    { valor: "7", etiqueta: "Servicios y sectores especializados" },
    { valor: "6", etiqueta: "Fases de control por obra" },
  ],

  pilaresTag: "Cómo trabajamos",
  pilaresTitulo: "Tres disciplinas, una sola dirección.",
  pilaresDescripcion: "Lo que en otras obras son tres empresas distintas, en ALKO es un mismo equipo que responde de principio a fin.",
  pilares: [
    {
      numero: "01",
      titulo: "Arquitectura",
      texto: "Partimos del proyecto y de su viabilidad técnica: mediciones, soluciones constructivas y materiales definidos antes de empezar la obra.",
      imagen: "/proceso-control.jpg",
    },
    {
      numero: "02",
      titulo: "Construcción",
      texto: "Ejecutamos la obra civil, las instalaciones y los acabados con una secuencia por fases y control de tolerancias en cada partida.",
      imagen: "/proceso-construccion.jpg",
    },
    {
      numero: "03",
      titulo: "Dirección integrada",
      texto: "Un mismo equipo coordina compras, gremios y plazos, de modo que proyecto y obra responden a una sola dirección técnica.",
      imagen: "/proceso-coordinacion.jpg",
    },
  ],

  metodoTag: "El método ALKO",
  metodoTitulo: "Una dirección, muchas manos.",
  metodoLead: "Coordinar antes que ejecutar: un único equipo mantiene construcción, instalaciones, compras y gestión técnica bajo control de principio a fin.",
  metodoCol1: "Trabajamos como un solo equipo, no como departamentos aislados. Antes de empezar la obra definimos la secuencia, el calendario y las compras críticas para que cada oficio entre en el momento exacto.",
  metodoCol2: "Esa coordinación reduce interfaces, acelera decisiones y mantiene la coherencia técnica del proyecto. El resultado es una ejecución previsible, sin sorpresas de plazo ni de coste.",
  metodoImagen: "/proceso-compras.jpg",

  valoresTag: "Valores",
  valoresTitulo: "Lo que marca la diferencia.",
  valoresDescripcion: "Cuatro compromisos que aplicamos igual en una vivienda que en una sede corporativa.",
    valores: [
    {
      numero: "01",
      titulo: "Un interlocutor",
      texto: "Una sola dirección técnica responde de proyecto, compras, gremios y obra. Sin intermediarios ni versiones contradictorias.",
    },
    {
      numero: "02",
      titulo: "Plazos controlados",
      texto: "Planificación por fases con hitos claros y seguimiento continuo del avance de la obra.",
    },
    {
      numero: "03",
      titulo: "Costes previsibles",
      texto: "Partidas definidas desde el presupuesto y compras anticipadas para reducir imprevistos.",
    },
    {
      numero: "04",
      titulo: "Calidad verificada",
      texto: "Control técnico en cada fase, pruebas y revisión de acabados hasta la entrega.",
    },
  ],

  enlaceEquipoEtiqueta: "Equipo",
  enlaceEquipoTitulo: "Las personas detrás de cada obra",
  enlaceEquipoImagen: "/proceso-entrega.jpg",
  enlaceEmpleoEtiqueta: "Trabaja con nosotros",
  enlaceEmpleoTitulo: "Buscamos profesionales con criterio",
  enlaceEmpleoImagen: "/proceso-instalaciones.jpg",

  procesoTitulo: "Nuestro proceso",
  procesoSubtitulo: "SECUENCIA DE COORDINACIÓN INTEGRAL · 6 FASES · 1 EQUIPO",
  procesoColHeading: "Una única dirección para todo el proyecto",
  procesoColText: "Un único equipo coordina construcción, instalaciones, compras y gestión técnica para mantener el proyecto bajo control.",
  fases: DEFAULT_FASES,
};

export const DEFAULT_CONTACTO_PAGE_CONTENT: import('./types').ContactoPageContent = {
  headerBadge: "CONTACTO",
  headerTitulo: "Hablemos de tu\npróximo proyecto.",
  headerDescripcion: "Cuéntanos tus necesidades y te proponemos un planteamiento técnico claro, con plazos definidos y sin sorpresas.",
  headerBgImage: "/cta-bg.jpg",

  canalesTag: "ALKO MADRID",
  canalesTitulo: "Un único interlocutor, desde la primera llamada.",
  canalesDescripcion: "Elige el canal que prefieras. Te atenderá directamente el equipo técnico que llevará tu obra.",

  formTag: "SOLICITUD DE PRESUPUESTO",
  formTitulo: "Cuéntanos tu\nproyecto",

  pasosTag: "DESPUÉS DE ESCRIBIRNOS",
  pasosTitulo: "Qué pasa a continuación",
  pasos: [
    {
      title: "Revisamos tu consulta",
      text: "El equipo técnico estudia el alcance y te contacta para concretar necesidades.",
    },
    {
      title: "Visita técnica",
      text: "Vemos el espacio, tomamos medidas y detectamos condicionantes de obra e instalaciones.",
    },
    {
      title: "Propuesta cerrada",
      text: "Presupuesto por partidas, calidades definidas y calendario de ejecución.",
    },
  ],

  oficinaTag: "VISÍTANOS",
  oficinaTitulo: "Nuestra oficina",
  oficinaImagen: "/oficinas.jpg",
};


export const DEFAULT_SERVICIOS_PAGE_CONTENT: import('./types').ServiciosPageContent = {
  headerBadge: "SERVICIOS",
  headerTitulo: "Especialidades",
  headerDescripcion: "Actuamos de forma transversal para reducir interfaces y garantizar la coherencia entre proyecto y obra.",
  headerBgImage: "/sector-oficinas.jpg",
};


export const DEFAULT_EQUIPO_MEMBERS: import('./types').MiembroEquipo[] = [
  {
    nombre: "Alejandro Kort",
    rol: "Dirección técnica",
    foto: "/oficinas.jpg",
  },
  {
    nombre: "Marta Ruiz",
    rol: "Arquitectura",
    foto: "/start-research-1.jpg",
  },
  {
    nombre: "Javier Ortega",
    rol: "Jefatura de obra",
    foto: "/proceso-construccion.jpg",
  },
  {
    nombre: "Laura Méndez",
    rol: "Instalaciones",
    foto: "/proceso-instalaciones.jpg",
  },
  {
    nombre: "Diego Salas",
    rol: "Compras y materiales",
    foto: "/proceso-compras.jpg",
  },
  {
    nombre: "Elena Castro",
    rol: "Atención al cliente",
    foto: "/proceso-entrega.jpg",
  },
];

export const DEFAULT_EQUIPO_PAGE_CONTENT: import('./types').EquipoPageContent = {
  headerBadge: "EQUIPO",
  headerTitulo: "Personas detrás de cada obra",
  headerDescripcion: "Un equipo multidisciplinar que comparte un mismo criterio constructivo. Dirección técnica, arquitectura, obra, instalaciones y atención al cliente.",
  headerBgImage: "/proceso-coordinacion.jpg",

  imagenDestacada: "/90dias.jpg",

  filosofiaTitulo: "Menos compartimentos. Más equipo.",
  filosofiaTexto: "Trabajamos como un solo equipo, no como departamentos aislados. Eso reduce interfaces, acelera decisiones y mantiene la coherencia del proyecto de principio a fin.",

  gridTag: "Nuestro equipo",
  gridTitulo: "Nuestros profesionales",
  gridDescripcion: "Perfiles que comparten un mismo criterio constructivo y una sola dirección de obra.",
  miembros: DEFAULT_EQUIPO_MEMBERS,

  ctaTitulo: "¿Sumamos tu proyecto al equipo?",
  ctaDescripcion: "Cuéntanos qué necesitas y te ponemos en contacto con la persona adecuada.",
  ctaBgImage: "/cta-bg.jpg",
};


export const DEFAULT_POSICIONES_EMPLEO: import('./types').PosicionEmpleo[] = [
  {
    titulo: "Jefatura de obra",
    departamento: "Ejecución",
    ubicacion: "Madrid",
    tipo: "Jornada completa",
    resumen: "Planificación y coordinación de oficios en obra, control de plazo y calidad por fase.",
  },
  {
    titulo: "Arquitectura técnica",
    departamento: "Proyecto",
    ubicacion: "Madrid",
    tipo: "Jornada completa",
    resumen: "Desarrollo de documentación, mediciones, detalles constructivos y seguimiento técnico.",
  },
  {
    titulo: "Ingeniería de instalaciones",
    departamento: "Instalaciones",
    ubicacion: "Madrid",
    tipo: "Jornada completa",
    resumen: "Diseño y coordinación de climatización, ventilación, saneamiento y redes de datos.",
  },
  {
    titulo: "Compras y aprovisionamiento",
    departamento: "Compras",
    ubicacion: "Madrid",
    tipo: "Jornada completa",
    resumen: "Gestión de proveedores, compras críticas anticipadas y control de suministros en obra.",
  },
];

export const DEFAULT_EMPLEO_PAGE_CONTENT: import('./types').EmpleoPageContent = {
  headerBadge: "TRABAJA CON NOSOTROS",
  headerTitulo: "Construimos con las personas",
  headerDescripcion: "Buscamos profesionales que compartan nuestro criterio técnico y quieran crecer dentro de un equipo que trabaja como una dirección única.",
  headerBgImage: "/proceso-control.jpg",

  culturaTag: "El equipo ALKO",
  culturaTitulo: "Un equipo pequeño, con criterio y sin intermediarios",
  culturaParrafo1: "En ALKO cada persona tiene responsabilidad real sobre el proyecto. Trabajamos cerca de la obra, con decisiones rápidas y una única dirección técnica.",
  culturaParrafo2: "Buscamos perfiles con oficio y ambición de crecer: gente que disfrute resolviendo problemas constructivos y cuidando el detalle hasta la entrega.",
  culturaImagen: "/proceso-construccion.jpg",

  posicionesTag: "POSICIONES ABIERTAS",
  posicionesTitulo: "Únete al equipo",
  posicionesSubtitulo: "Envíanos tu candidatura por correo. Valoramos perfiles técnicos con experiencia en obra.",
  posiciones: DEFAULT_POSICIONES_EMPLEO,

  ctaTitulo: "¿No encuentras tu puesto ideal?",
  ctaDescripcion: "Envíanos una candidatura espontánea. Nos interesa conocer perfiles con criterio técnico, aunque no haya una posición abierta.",
  ctaBgImage: "/cta-bg.jpg",
};
