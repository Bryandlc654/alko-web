import type {
  Article,
  Fabricante,
  Fase,
  Guide,
  Project,
  Sector,
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
    ubicacion: "Madrid",
    tipologia: "Reforma integral de oficinas",
    cliente: "Start Research",
    servicio: "oficinas",
    superficie: "1.450 m²",
    plazo: "20 semanas",
    imagen: "/start-research-1.jpg",
    galeria: ["/start-research-2.jpg", "/sector-oficinas.jpg", "/proceso-instalaciones.jpg", "/proceso-coordinacion.jpg"],
    enlace: "/contacto",
    content:
      "<p>Transformación arquitectónica e infraestructural completa de una sede corporativa de dos plantas en Madrid, manteniendo la operatividad continua de la compañía durante toda la obra.</p><p>El proyecto integró áreas de trabajo abiertas, laboratorios analíticos, climatización VRF, renovación forzada de aire, cableado estructurado y acabados de especificación H2, todo con una única dirección facultativa.</p><h3>Una obra con la empresa dentro</h3><p>La intervención se planificó por fases y por zonas, de forma que cada equipo pudiera trasladarse a un área terminada antes de liberar la siguiente. Los trabajos ruidosos y las conexiones de instalaciones se concentraron fuera del horario laboral.</p><p>Los laboratorios exigían un control específico de ventilación, tomas técnicas y acabados lavables, que se resolvió con la ingeniería de instalaciones desde la fase de proyecto, no en obra.</p><h3>Instalaciones pensadas desde el proyecto</h3><p>La climatización VRF se dividió por zonas para que cada área —puestos abiertos, salas de reunión y laboratorios— tuviera su propio control. La renovación de aire con recuperación de calor mantiene la calidad del ambiente interior sin disparar el consumo.</p><p>Todo el recorrido de instalaciones se resolvió en el falso techo registrable, de modo que el mantenimiento futuro no obligue a abrir paramentos ni a interrumpir el trabajo.</p>",
    reto: "Renovar por completo una sede de dos plantas —espacios de trabajo, laboratorios e instalaciones— sin interrumpir en ningún momento la actividad de la compañía ni la operación de sus laboratorios analíticos.",
    solucion: "Dividimos la obra en fases por zonas con un plan de traslados acordado con el cliente, trabajamos en horario nocturno las partidas más críticas y coordinamos ingeniería, compras e instalaciones bajo una única dirección facultativa.",
    alcance: [
      "Demolición y redistribución de espacios",
      "Áreas de trabajo abiertas y salas de reunión",
      "Laboratorios analíticos",
      "Climatización VRF por zonas",
      "Renovación forzada de aire",
      "Cableado estructurado y red de datos",
      "Iluminación técnica",
      "Acabados de especificación H2",
    ],
    cifras: [
      { valor: "2", etiqueta: "plantas renovadas" },
      { valor: "0", etiqueta: "días de cierre de la actividad" },
      { valor: "VRF", etiqueta: "climatización por zonas" },
      { valor: "1", etiqueta: "única dirección facultativa" },
    ],
    cronograma: [
      { periodo: "Semanas 1–2", titulo: "Planificación y replanteo", texto: "Levantamiento del estado actual, plan de fases por zonas y calendario de traslados acordado con el cliente." },
      { periodo: "Semanas 3–6", titulo: "Fase 1 · Planta baja", texto: "Demoliciones, redistribución y primeras instalaciones mientras la plantilla seguía trabajando en la planta superior." },
      { periodo: "Semanas 7–12", titulo: "Laboratorios", texto: "Ventilación forzada, tomas técnicas y acabados lavables, con pruebas de caudal antes de la puesta en uso." },
      { periodo: "Semanas 13–18", titulo: "Fase 2 · Planta alta", texto: "Mismo proceso en la planta superior, tras trasladar a los equipos a la zona ya terminada." },
      { periodo: "Semanas 19–20", titulo: "Pruebas y entrega", texto: "Puesta en marcha de la climatización, certificación de la red de datos y entrega con la documentación final." },
    ],
    materiales: [
      { elemento: "Climatización", detalle: "Sistema VRF con control independiente por zonas" },
      { elemento: "Ventilación", detalle: "Renovación forzada de aire con recuperación de calor" },
      { elemento: "Techos", detalle: "Falso techo registrable con absorción acústica" },
      { elemento: "Pavimentos", detalle: "Vinílico técnico en oficinas y pavimento continuo en laboratorios" },
      { elemento: "Divisiones", detalle: "Mamparas de vidrio y tabiquería seca con aislamiento acústico" },
      { elemento: "Iluminación", detalle: "LED regulable en puestos de trabajo y salas" },
      { elemento: "Datos", detalle: "Cableado estructurado categoría 6A" },
    ],
    resultado: "Una sede preparada para crecer: espacios de trabajo abiertos, laboratorios con control ambiental e instalaciones nuevas, entregados sin que la compañía dejara de trabajar un solo día.",
  },
  {
    id: "p-2",
    slug: "oficinas-castellana",
    title: "REFORMA INTEGRAL DE OFICINAS EN MADRID",
    indice: "02",
    anio: "2024",
    ubicacion: "Paseo de la Castellana, Madrid",
    tipologia: "Reforma integral de oficinas",
    cliente: "Cliente corporativo (confidencial)",
    servicio: "oficinas",
    superficie: "900 m²",
    plazo: "14 semanas",
    imagen: "/oficinas.jpg",
    galeria: ["/proceso-construccion.jpg", "/proceso-compras.jpg", "/proceso-control.jpg"],
    enlace: "/contacto",
    content:
      "<p>Reforma integral de una planta corporativa de oficinas con redistribución de espacios, nuevas instalaciones de climatización y datos, y acabados de alta gama.</p><p>La coordinación de gremios y las compras anticipadas permitieron cumplir un cronograma cerrado sin afectar a la actividad de las plantas contiguas.</p><h3>Planificar para no detenerse</h3><p>Antes de empezar se cerraron las compras de los materiales de mayor plazo de entrega —carpinterías, mamparas y equipos de climatización—, de modo que el suministro no condicionara el calendario.</p><p>La convivencia con las plantas contiguas, ocupadas durante toda la obra, obligó a fijar horarios para los trabajos ruidosos, recorridos de acopio y medidas de protección de las zonas comunes del edificio.</p><h3>Una planta más luminosa y silenciosa</h3><p>La nueva distribución lleva los puestos de trabajo a las fachadas y concentra en el núcleo central las salas, los aseos y el office. Las mamparas de vidrio reparten la luz natural hacia el interior y mantienen la privacidad acústica de los despachos.</p><p>El falso techo registrable y la iluminación regulable completan una planta cómoda para trabajar y fácil de mantener.</p>",
    reto: "Reformar íntegramente una planta corporativa dentro de un edificio de oficinas en uso, con un cronograma cerrado e innegociable y sin afectar a la actividad de las plantas contiguas.",
    solucion: "Compras anticipadas de los suministros críticos, coordinación diaria de gremios y un plan de convivencia con la propiedad del edificio para ordenar horarios, accesos y acopios.",
    alcance: [
      "Redistribución de la planta",
      "Mamparas y divisiones de vidrio",
      "Climatización e instalaciones de datos",
      "Falsos techos registrables",
      "Iluminación LED",
      "Pavimentos y revestimientos de alta gama",
      "Aseos y office",
    ],
    cifras: [
      { valor: "1", etiqueta: "planta corporativa completa" },
      { valor: "100%", etiqueta: "de la actividad del edificio mantenida" },
      { valor: "0", etiqueta: "días de retraso sobre el plan" },
    ],
    cronograma: [
      { periodo: "Semanas 1–2", titulo: "Proyecto y compras", texto: "Cierre de mediciones y pedido anticipado de carpinterías, mamparas y equipos de climatización." },
      { periodo: "Semanas 3–5", titulo: "Demolición y redistribución", texto: "Desmontaje de la planta y nueva tabiquería según el layout aprobado, con horarios de ruido pactados con el edificio." },
      { periodo: "Semanas 6–9", titulo: "Instalaciones", texto: "Climatización, electricidad, datos e iluminación, coordinadas dentro del falso techo." },
      { periodo: "Semanas 10–13", titulo: "Acabados", texto: "Pavimentos, revestimientos, mamparas, aseos y office." },
      { periodo: "Semana 14", titulo: "Pruebas y entrega", texto: "Puesta en marcha, limpieza técnica y entrega con los planos finales de obra." },
    ],
    materiales: [
      { elemento: "Divisiones", detalle: "Mamparas de vidrio con perfilería de aluminio" },
      { elemento: "Techos", detalle: "Falso techo registrable" },
      { elemento: "Climatización", detalle: "Equipos por zonas con control individual" },
      { elemento: "Iluminación", detalle: "LED regulable" },
      { elemento: "Pavimentos", detalle: "Moqueta técnica en zonas de trabajo y gres porcelánico en zonas comunes" },
      { elemento: "Aseos", detalle: "Revestimientos porcelánicos y sanitarios suspendidos" },
    ],
    resultado: "Una planta corporativa nueva, entregada en el plazo comprometido y sin afectar a las empresas vecinas: más luz, mejor acústica e instalaciones preparadas para los próximos años.",
  },
  {
    id: "p-3",
    slug: "residencia-el-viso",
    title: "RESIDENCIA EL VISO",
    indice: "03",
    anio: "2023",
    ubicacion: "El Viso, Chamartín, Madrid",
    tipologia: "Reforma residencial",
    cliente: "Cliente particular",
    servicio: "residencial",
    superficie: "420 m²",
    plazo: "9 meses",
    imagen: "/el-viso.jpg",
    galeria: ["/slide1.jpg", "/slide2.jpg", "/proceso-entrega.jpg"],
    enlace: "/contacto",
    content:
      "<p>Reforma integral de una vivienda unifamiliar en El Viso, con renovación completa de instalaciones, carpinterías minimalistas y materiales nobles seleccionados con los fabricantes.</p><p>El resultado combina confort, eficiencia energética y un control milimétrico de tolerancias y acabados.</p><h3>Materiales escogidos con el fabricante</h3><p>Carpinterías, pavimentos y revestimientos se seleccionaron junto a los fabricantes, con muestras en obra y pruebas de acabado antes de cada pedido.</p><p>La renovación completa de instalaciones —climatización, fontanería, electricidad y aislamiento— mejora el confort y la eficiencia energética de la vivienda sin renunciar a su carácter.</p><h3>Confort que no se ve</h3><p>La aerotermia con suelo radiante sustituye a la antigua calefacción y mantiene una temperatura estable en toda la casa sin radiadores ni equipos a la vista. El nuevo aislamiento de fachada y cubierta reduce las pérdidas de energía y el ruido exterior.</p><p>La domótica reúne en un único control la iluminación, el clima y las persianas, pensada para que la vivienda sea sencilla de usar en el día a día.</p>",
    reto: "Actualizar una vivienda unifamiliar de un barrio histórico de Madrid a los estándares actuales de confort y eficiencia, con un nivel de acabado en el que cada tolerancia se nota.",
    solucion: "Renovación integral de instalaciones y envolvente, carpinterías minimalistas de altas prestaciones y un control de calidad por partidas, con muestras y pruebas antes de cada pedido.",
    alcance: [
      "Renovación integral de instalaciones",
      "Aislamiento térmico y acústico",
      "Carpinterías minimalistas",
      "Climatización y suelo radiante",
      "Cocina y baños a medida",
      "Pavimentos y revestimientos nobles",
      "Iluminación y domótica",
    ],
    cifras: [
      { valor: "1", etiqueta: "vivienda unifamiliar" },
      { valor: "100%", etiqueta: "de instalaciones renovadas" },
      { valor: "A medida", etiqueta: "cocina, baños y carpinterías" },
    ],
    cronograma: [
      { periodo: "Mes 1", titulo: "Proyecto y licencias", texto: "Levantamiento, proyecto de ejecución, primera selección de materiales y tramitación." },
      { periodo: "Meses 2–3", titulo: "Demoliciones y estructura", texto: "Vaciado interior, refuerzos puntuales y nueva distribución." },
      { periodo: "Meses 4–5", titulo: "Instalaciones y envolvente", texto: "Climatización, suelo radiante, fontanería, electricidad, domótica y aislamiento." },
      { periodo: "Meses 6–8", titulo: "Carpinterías y acabados", texto: "Carpinterías minimalistas, pavimentos, revestimientos, cocina y baños a medida." },
      { periodo: "Mes 9", titulo: "Remates y entrega", texto: "Ajustes finales, limpieza técnica y entrega con los manuales de los sistemas." },
    ],
    materiales: [
      { elemento: "Carpinterías", detalle: "Correderas minimalistas de altas prestaciones" },
      { elemento: "Climatización", detalle: "Aerotermia con suelo radiante" },
      { elemento: "Pavimentos", detalle: "Madera natural y piedra" },
      { elemento: "Cocina", detalle: "Mobiliario a medida con encimera de piedra" },
      { elemento: "Baños", detalle: "Revestimientos porcelánicos de gran formato" },
      { elemento: "Domótica", detalle: "Control de iluminación, clima y persianas" },
    ],
    resultado: "Una vivienda que conserva su carácter y gana en confort: temperatura estable todo el año, mejor aislamiento acústico y unos acabados en los que cada encuentro está resuelto.",
  },
];

export const DEFAULT_SECTORS: Sector[] = [
  {
    id: "s-1",
    slug: "reformas-integrales",
    numero: "01",
    title: "Reformas integrales",
    descripcion:
      "Transformación completa de viviendas, oficinas y locales: proyecto, obra, instalaciones y acabados bajo una única dirección.",
    imagen: "/proceso-construccion.jpg",
    enlace: "/proyectos",
    content:
      "<p>Transformamos por completo viviendas, oficinas y locales: desde el proyecto y las demoliciones hasta las instalaciones, los acabados y la entrega, con un único responsable de toda la obra.</p><p>Una reforma integral afecta a todo el espacio a la vez. Por eso planificamos juntos arquitectura, instalaciones y compras, de modo que cada decisión se toma con la obra completa a la vista.</p><h2>Qué incluye</h2><ul><li>Estudio previo, mediciones y proyecto de ejecución</li><li>Demoliciones, refuerzos y nueva distribución</li><li>Instalaciones de climatización, electricidad, fontanería y datos</li><li>Carpinterías, pavimentos, revestimientos y acabados</li><li>Gestión de licencias y coordinación con la propiedad</li><li>Entrega con documentación final y garantía postventa</li></ul><h2>Cómo lo ejecutamos</h2><p>Trabajamos por fases, con el calendario y las compras cerradas antes de empezar. Un mismo equipo coordina a los gremios y verifica cada partida hasta la entrega.</p>",
  },
  {
    id: "s-2",
    slug: "oficinas",
    numero: "02",
    title: "Reformas de oficinas",
    descripcion:
      "Reformas integrales de espacios corporativos, instalaciones, climatización, ventilación, datos y acabados.",
    imagen: "/sector-oficinas.jpg",
    enlace: "/proyectos",
    content:
      "<p>Ejecutamos reformas integrales de espacios corporativos donde clima, ventilación, conectividad y acabados deben convivir sin comprometer la operación diaria.</p><p>Coordinamos en paralelo instalaciones, compras e ingeniería para entregar oficinas listas para trabajar en plazos cerrados.</p>",
  },
  {
    id: "s-3",
    slug: "residencial",
    numero: "03",
    title: "Reformas de viviendas",
    descripcion:
      "Reformas integrales y ejecución de viviendas de alta exigencia.",
    imagen: "/el-viso.jpg",
    enlace: "/proyectos",
    content:
      "<p>Reformas integrales y ejecución de viviendas de alta exigencia, con especial atención a la eficiencia energética, el confort acústico y la calidad de los acabados.</p><p>Trabajamos con materiales nobles y soluciones técnicas adaptadas a cada vivienda, respetando su carácter y mejorando su confort.</p><h2>Qué incluye</h2><ul><li>Renovación integral de instalaciones</li><li>Aislamiento térmico y acústico</li><li>Carpinterías minimalistas de altas prestaciones</li><li>Climatización eficiente, con suelo radiante si el proyecto lo pide</li><li>Cocinas y baños a medida</li><li>Pavimentos y revestimientos nobles</li><li>Iluminación técnica y domótica</li></ul><h2>Cómo lo ejecutamos</h2><p>Seleccionamos los materiales junto a los fabricantes, con muestras en obra y pruebas de acabado antes de cada pedido, y controlamos las tolerancias partida a partida.</p>",
  },
  {
    id: "s-4",
    slug: "interiorismo",
    numero: "04",
    title: "Interiorismo",
    descripcion:
      "Diseño y ejecución de interiores: distribución, iluminación, materiales y mobiliario a medida, coordinados con la obra.",
    imagen: "/slide1.jpg",
    enlace: "/proyectos",
    content:
      "<p>Diseñamos y ejecutamos interiores completos: distribución, iluminación, materiales y mobiliario a medida, siempre coordinados con la obra para que el resultado final sea el proyectado.</p><p>El interiorismo no es una capa final: se decide junto a la arquitectura y las instalaciones. Así evitamos que el diseño obligue a rehacer trabajo ya ejecutado.</p><h2>Qué incluye</h2><ul><li>Propuesta de distribución y ambientes</li><li>Selección de materiales, colores y acabados</li><li>Proyecto de iluminación técnica y decorativa</li><li>Mobiliario y carpintería a medida</li><li>Coordinación con proveedores y fabricantes</li><li>Supervisión del montaje y remates finales</li></ul><h2>Cómo lo ejecutamos</h2><p>Presentamos cada propuesta con muestras y calidades definidas, y la validamos contigo antes de comprar. El equipo de obra ejecuta con el mismo criterio de diseño.</p>",
  },
  {
    id: "s-5",
    slug: "instalaciones",
    numero: "05",
    title: "Instalaciones",
    descripcion:
      "Climatización, electricidad, fontanería, ventilación y datos proyectadas y ejecutadas dentro de la propia obra.",
    imagen: "/proceso-instalaciones.jpg",
    enlace: "/proyectos",
    content:
      "<p>Proyectamos y ejecutamos las instalaciones del edificio —climatización, electricidad, fontanería, ventilación y datos— integradas en la obra y pensadas para su mantenimiento futuro.</p><p>Las instalaciones condicionan el resto de la reforma. Las resolvemos desde el proyecto, con recorridos coordinados y registros accesibles, para que funcionen bien y no obliguen a abrir paramentos más adelante.</p><h2>Qué incluye</h2><ul><li>Climatización y ventilación (aerotermia, VRF, renovación de aire)</li><li>Instalación eléctrica, iluminación técnica y domótica</li><li>Fontanería, saneamiento y producción de agua caliente</li><li>Cableado estructurado y redes de datos</li><li>Pruebas, puesta en marcha y certificados</li><li>Manuales y documentación de cada sistema</li></ul><h2>Cómo lo ejecutamos</h2><p>Coordinamos las instalaciones con la obra civil y los acabados, hacemos pruebas antes de cerrar los falsos techos y entregamos cada sistema con su documentación.</p>",
  },
  {
    id: "s-6",
    slug: "gestion-tecnica",
    numero: "06",
    title: "Gestión técnica",
    descripcion:
      "Dirección de obra, control de plazos y costes, compras y coordinación de gremios con un único interlocutor.",
    imagen: "/proceso-coordinacion.jpg",
    enlace: "/proyectos",
    content:
      "<p>Dirigimos tu obra de principio a fin: planificación, control de plazos y costes, compras, coordinación de gremios y verificación de la calidad, con un único interlocutor.</p><p>La gestión técnica es lo que hace previsible una obra. Anticipamos decisiones, cerramos las compras de plazo largo y seguimos el avance con hitos claros para que el resultado coincida con lo acordado.</p><h2>Qué incluye</h2><ul><li>Planificación por fases y calendario de obra</li><li>Presupuesto por partidas y control de costes</li><li>Compras anticipadas y gestión de proveedores</li><li>Coordinación diaria de gremios en obra</li><li>Control de calidad, tolerancias y pruebas por fase</li><li>Informes de seguimiento y recepción final</li></ul><h2>Cómo lo ejecutamos</h2><p>Un responsable técnico acompaña la obra a diario y te informa del avance. Cada fase se verifica antes de pasar a la siguiente, hasta la recepción formal.</p>",
  },
  {
    id: "s-7",
    slug: "retail",
    numero: "07",
    title: "Retail",
    descripcion:
      "Espacios comerciales diseñados para operar, recibir clientes y cumplir los requisitos técnicos del proyecto.",
    imagen: "/sector-retail.jpg",
    enlace: "/proyectos",
    content:
      "<p>Espacios comerciales diseñados para operar y recibir clientes, cumpliendo los requisitos técnicos, de accesibilidad y de imagen de marca de cada proyecto.</p><p>Ajustamos plazos y ejecución para minimizar el impacto en la actividad comercial.</p>",
  },
  {
    id: "s-8",
    slug: "hospitality",
    numero: "08",
    title: "Hospitality",
    descripcion:
      "Intervenciones donde arquitectura, instalaciones, materiales y operación deben funcionar conjuntamente.",
    imagen: "/sector-hospitality.jpg",
    enlace: "/proyectos",
    content:
      "<p>Intervenciones en hoteles y espacios de hostelería donde arquitectura, instalaciones, materiales y operación deben funcionar como un único sistema.</p><p>Priorizamos la durabilidad, el mantenimiento y la experiencia del usuario final.</p>",
  },
];

export const DEFAULT_FASES: Fase[] = [
  {
    id: "f-1",
    tag: "01 / FASE · CONSTRUCCIÓN",
    title: "Construcción",
    texto:
      "Ejecución de obra civil, albañilería técnica, refuerzos estructurales y replanteos milimétricos. Nuestro equipo propio asegura precisión constructiva y fidelidad absoluta al proyecto arquitectónico.",
    imagen: "/proceso-construccion.jpg",
  },
  {
    id: "f-2",
    tag: "02 / FASE · INSTALACIONES",
    title: "Instalaciones",
    texto:
      "Diseño e integración de climatización oculta (aerotermia y suelo radiante), electricidad avanzada, domótica KNX, fontanería e iluminación técnica con estándares máximos de eficiencia energética.",
    imagen: "/proceso-instalaciones.jpg",
  },
  {
    id: "f-3",
    tag: "03 / FASE · COMPRAS",
    title: "Compras",
    texto:
      "Selección y negociación directa con fabricantes de materiales nobles: piedra natural, maderas macizas, carpinterías minimalistas y mecanismos de autor, garantizando trazabilidad y coste cerrado.",
    imagen: "/proceso-compras.jpg",
  },
  {
    id: "f-4",
    tag: "04 / FASE · COORDINACIÓN",
    title: "Coordinación",
    texto:
      "Sincronización exhaustiva de gremios especializados y control técnico en obra. Un interlocutor único coordina cada oficio diariamente para eliminar tiempos muertos y desajustes de ejecución.",
    imagen: "/proceso-coordinacion.jpg",
  },
  {
    id: "f-5",
    tag: "05 / FASE · CONTROL",
    title: "Control",
    texto:
      "Auditoría continua de tolerancias, pruebas de estanqueidad, ensayos acústicos y verificación exhaustiva de acabados para asegurar el cumplimiento estricto del cronograma y las calidades pactadas.",
    imagen: "/proceso-control.jpg",
  },
  {
    id: "f-6",
    tag: "06 / HITO · ENTREGA",
    title: "Entrega",
    texto:
      "Hito final con recepción formal llave en mano y limpieza técnica profunda. Entregamos el libro de obra, manuales de funcionamiento de sistemas, certificados visados y cobertura de garantía postventa.",
    imagen: "/proceso-entrega.jpg",
  },
];

export const DEFAULT_FABRICANTES: Fabricante[] = [
  { id: "fab-1", name: "CORTIZO", logo: "/logo-cortizo.png", url: "#" },
  { id: "fab-2", name: "KÖMMERLING", logo: "/logo-koemmerling.png", url: "#" },
  { id: "fab-3", name: "PORCELANOSA PARTNERS", logo: "/logo-porcelanosa.png", url: "#" },
];

export const DEFAULT_ARTICLES: Article[] = [
  {
    id: "a-1",
    slug: "climatizacion-invisible-aerotermia",
    title: "Climatización invisible y aerotermia en falso techo.",
    category: "CLIMATIZACIÓN",
    excerpt:
      "Cómo integrar climatización y ventilación en falsos techos limitados sin renunciar a confort ni eficiencia.",
    content:
      "<p>La integración de climatización y ventilación en alturas de falso techo limitadas exige planificar los trazados antes de empezar la obra.</p><p>La aerotermia y los sistemas VRF permiten obtener confort y eficiencia energética con un impacto mínimo en la arquitectura.</p>",
    image: "/proceso-instalaciones.jpg",
    date: "2024-06-12",
  },
  {
    id: "a-2",
    slug: "piedra-natural-carpinterias-enrasadas",
    title: "Encuentro entre piedra natural y carpinterías enrasadas.",
    category: "MATERIALES",
    excerpt:
      "El detalle como seña de identidad: cómo resolver el encuentro entre materiales nobles sin juntas visibles.",
    content:
      "<p>El encuentro entre piedra natural y carpinterías enrasadas es uno de los detalles que más define la calidad percibida de un proyecto.</p><p>La selección con fabricantes y el control de tolerancias en obra son clave para lograr juntas limpias y continuas.</p>",
    image: "/proceso-compras.jpg",
    date: "2024-04-03",
  },
  {
    id: "a-3",
    slug: "control-plazos-compras-anticipadas",
    title: "Control de plazos cerrados y compras anticipadas.",
    category: "GESTIÓN TÉCNICA",
    excerpt:
      "Anticipar las compras críticas es la mejor herramienta para proteger el plazo de entrega.",
    content:
      "<p>Anticipar las compras críticas de maquinaria y materiales es la herramienta más eficaz para proteger un plazo cerrado.</p><p>Un único equipo coordinando compras, instalaciones y obra elimina desviaciones y asegura la entrega con verificación técnica total.</p>",
    image: "/proceso-control.jpg",
    date: "2024-02-20",
  },
];

export const DEFAULT_GUIDES: Guide[] = [
  {
    id: "g-1",
    slug: "planificar-reforma-integral",
    numero: "01",
    title: "Cómo planificar una reforma integral",
    tema: "PLANIFICACIÓN",
    descripcion:
      "Del primer programa de necesidades a la entrega de llaves: las decisiones que conviene tomar antes de empezar la obra.",
    lectura: "8 min",
    imagen: "/proceso-coordinacion.jpg",
    content:
      "<h2>1. Programa de necesidades</h2><p>Antes de pedir presupuestos, define cómo se va a usar el espacio: estancias, almacenamiento, instalaciones y prioridades. Un programa claro evita cambios de criterio a mitad de obra.</p><h2>2. Proyecto y mediciones</h2><p>Con el proyecto definido se pueden medir partidas y comparar ofertas en igualdad de condiciones. Sin mediciones, los presupuestos no son comparables.</p><h2>3. Compras críticas</h2><p>Carpinterías, piedra, climatización y cocina tienen plazos de fabricación largos. Cerrarlas al inicio protege el calendario.</p><h2>4. Ejecución y control</h2><p>Un único interlocutor coordina oficios, instalaciones y acabados, con visitas de control y actas en cada hito.</p><h2>5. Entrega</h2><p>Revisión conjunta de acabados, pruebas de instalaciones y documentación final.</p>",
  },
  {
    id: "g-2",
    slug: "presupuesto-de-obra",
    numero: "02",
    title: "Cómo leer y comparar un presupuesto de obra",
    tema: "PRESUPUESTO",
    descripcion:
      "Qué debe incluir un presupuesto bien hecho y cómo detectar partidas abiertas antes de firmar.",
    lectura: "6 min",
    imagen: "/proceso-compras.jpg",
    content:
      "<h2>Partidas cerradas frente a partidas abiertas</h2><p>Un presupuesto fiable describe cada partida con su unidad, medición y calidad. Las partidas «a justificar» o sin medición son la principal fuente de desviaciones.</p><h2>Calidades y marcas</h2><p>Comprueba que materiales y equipos están definidos con marca y modelo, o con una referencia equivalente acordada.</p><h2>Qué suele quedar fuera</h2><ul><li>Licencias y tasas.</li><li>Gestión de residuos.</li><li>Ayudas de albañilería a instalaciones.</li><li>Limpieza final.</li></ul><h2>Calendario de pagos</h2><p>Vincula los pagos a hitos verificables de obra, no a fechas.</p>",
  },
  {
    id: "g-3",
    slug: "elegir-materiales-y-acabados",
    numero: "03",
    title: "Cómo elegir materiales y acabados",
    tema: "MATERIALES",
    descripcion:
      "Criterios para seleccionar pavimentos, revestimientos y carpinterías pensando en uso, mantenimiento y plazos.",
    lectura: "7 min",
    imagen: "/service-interior-1.jpg",
    content:
      "<h2>Uso antes que estética</h2><p>El tránsito, la humedad y la exposición solar de cada estancia determinan qué materiales funcionan a largo plazo.</p><h2>Mantenimiento</h2><p>La piedra natural, la madera y los microcementos exigen cuidados distintos. Conviene conocerlos antes de elegir.</p><h2>Muestras en obra</h2><p>Valida siempre las muestras con la luz real del espacio y junto al resto de acabados.</p><h2>Plazos de suministro</h2><p>Algunos acabados se fabrican bajo pedido: incorpora sus plazos al calendario de compras.</p>",
  },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  telefono: "+34 910 000 000",
  email: "hola@alkoreformas.com",
  whatsapp: "34910000000",
  direccion: "Calle de Velázquez, 28001 Madrid, España",
  horario: "8:30am - 5pm",
  linkedin: "#",
  facebook: "#",
  instagram: "#",
};
