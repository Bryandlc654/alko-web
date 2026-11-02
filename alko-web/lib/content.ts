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
    servicio: "residencial",
    superficie: "520 m²",
    plazo: "14 meses",
    imagen: "/start-research-1.jpg",
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
    servicio: "residencial",
    superficie: "280 m²",
    plazo: "6 meses",
    imagen: "/el-viso.jpg",
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
    slug: "oficinas",
    numero: "01",
    title: "Oficinas",
    descripcion: "Implantación de espacios de trabajo que potencian la cultura de empresa y cumplen los más altos estándares técnicos.",
    imagen: "/sector-oficinas.jpg",
    enlace: "/servicios/oficinas",
    content: "<p>Acondicionamiento y fit-out corporativo llave en mano. Minimizamos los tiempos de inactividad con cronogramas exigentes, garantizando el aislamiento acústico y la flexibilidad de instalaciones requeridas por las compañías líderes.</p>",
  },
  {
    id: "s-2",
    slug: "residencial",
    numero: "02",
    title: "Residencial",
    descripcion: "Viviendas unifamiliares, pisos y áticos: obra nueva y reformas integrales con máxima exigencia en acabados y eficiencia.",
    imagen: "/service-interior-1.jpg",
    enlace: "/servicios/residencial",
    content: "<p>Acompañamos a arquitectos y propietarios desde la cimentación o la demolición hasta el último detalle de carpintería y domótica. Redistribución espacial, refuerzo estructural y restauración de elementos protegidos, con un arquitecto técnico asignado y un presupuesto cerrado en cada fase.</p>",
  },
  {
    id: "s-3",
    slug: "retail",
    numero: "03",
    title: "Retail",
    descripcion: "Locales comerciales, boutiques y showrooms donde la imagen de marca y los plazos de apertura son innegociables.",
    imagen: "/sector-retail.jpg",
    enlace: "/servicios/retail",
    content: "<p>Ejecución ágil de proyectos comerciales con estricto control de costes y plazos de apertura al público. Cumplimiento exhaustivo de normativas de accesibilidad, seguridad y licencias de actividad en Madrid.</p>",
  },
  {
    id: "s-4",
    slug: "hospitality",
    numero: "04",
    title: "Hospitality",
    descripcion: "Hoteles, restaurantes y espacios de ocio donde la experiencia del cliente y la fecha de apertura marcan cada decisión.",
    imagen: "/sector-hospitality.jpg",
    enlace: "/servicios/hospitality",
    content: "<p>Obra por fases para mantener la actividad cuando hace falta, instalaciones dimensionadas para un uso intensivo y acabados resistentes que conservan la imagen del espacio. Coordinamos licencias de actividad, protección contra incendios y accesibilidad en Madrid.</p>",
  },
  {
    id: "s-5",
    slug: "viviendas-unifamiliares",
    numero: "05",
    title: "Viviendas unifamiliares",
    descripcion: "Proyecto y obra de viviendas unifamiliares completas: obra nueva, ampliaciones y rehabilitaciones integrales con un único responsable.",
    imagen: "/el-viso.jpg",
    enlace: "/servicios/viviendas-unifamiliares",
    content: "<p>Desarrollamos la vivienda unifamiliar completa, del proyecto y la licencia a la entrega llave en mano: cimentación, estructura, envolvente eficiente, instalaciones, interiorismo y exteriores. Un único equipo técnico y un presupuesto cerrado por fases.</p>",
    landing: {
      "lead": "Proyecto y obra de viviendas unifamiliares en Madrid: obra nueva, ampliaciones y rehabilitaciones integrales con un único equipo técnico, presupuesto cerrado y calendario por fases, desde la licencia hasta la entrega.",
      "supportContent": "Coordinamos arquitectura, estructura, instalaciones e interiorismo como un solo proyecto. La casa se diseña pensando en cómo se va a vivir y en lo que costará mantenerla: envolvente bien aislada, aerotermia, fotovoltaica y domótica integradas desde el principio.",
      "commitments": [
        {
          "title": "Proyecto completo",
          "text": "Arquitectura, estructura e instalaciones definidas antes de empezar."
        },
        {
          "title": "Presupuesto por fases",
          "text": "Cerrado por partidas y certificado según avance."
        },
        {
          "title": "Casa eficiente",
          "text": "Envolvente, aerotermia y fotovoltaica proyectadas juntas."
        }
      ],
      "problems": [
        {
          "avoid": "Proyectos que llegan a obra sin definir instalaciones ni acabados.",
          "promise": "Proyecto ejecutivo completo con memoria de calidades cerrada antes de la licencia."
        },
        {
          "avoid": "Varios contratistas que se pasan la responsabilidad entre ellos.",
          "promise": "Un único responsable desde la cimentación hasta la última carpintería."
        },
        {
          "avoid": "Casas que gastan mucho en clima y mantenimiento.",
          "promise": "Envolvente y sistemas calculados para un consumo bajo durante toda la vida de la vivienda."
        }
      ],
      "includes": [
        "Estudio de parcela, anteproyecto y proyecto básico y de ejecución",
        "Licencia de obra y coordinación con el ayuntamiento",
        "Movimiento de tierras, cimentación y estructura",
        "Fachadas, cubiertas y carpinterías de altas prestaciones",
        "Aerotermia, suelo radiante, ventilación y fotovoltaica",
        "Electricidad, domótica y red de datos",
        "Interiorismo, cocinas, baños y carpintería a medida",
        "Urbanización de la parcela, piscina y jardín"
      ],
      "capacidades": [
        {
          "codigo": "01",
          "titulo": "Proyecto y licencia",
          "metrica": "Básico · Ejecución",
          "resumen": "Diseño adaptado a la parcela y a la normativa urbanística del municipio.",
          "puntos": [
            "Estudio de edificabilidad",
            "Tramitación completa"
          ]
        },
        {
          "codigo": "02",
          "titulo": "Estructura y envolvente",
          "metrica": "Hormigón · Acero · Madera",
          "resumen": "Cimentación y estructura calculadas, y una envolvente continua sin puentes térmicos.",
          "puntos": [
            "Aislamiento por el exterior",
            "Carpinterías de rotura de puente térmico"
          ]
        },
        {
          "codigo": "03",
          "titulo": "Instalaciones eficientes",
          "metrica": "Aerotermia · Fotovoltaica",
          "resumen": "Clima, agua caliente y energía dimensionados para el uso real de la casa.",
          "puntos": [
            "Suelo radiante y refrescante",
            "Ventilación con recuperación de calor"
          ]
        },
        {
          "codigo": "04",
          "titulo": "Interiores y exteriores",
          "metrica": "Llave en mano",
          "resumen": "Acabados, carpintería a medida, piscina y jardín dentro del mismo proyecto.",
          "puntos": [
            "Un solo calendario",
            "Entrega con documentación final"
          ]
        }
      ],
      "processHeadline": "Cómo construimos una vivienda unifamiliar",
      "faqs": [
        {
          "q": "¿Cuánto se tarda en construir una vivienda unifamiliar?",
          "a": "Depende del tamaño y del sistema constructivo, pero una vivienda de tamaño medio suele necesitar entre doce y dieciocho meses de obra, a los que se suma la redacción del proyecto y la licencia."
        },
        {
          "q": "¿Os encargáis del proyecto o necesito un arquitecto aparte?",
          "a": "Podemos asumir el proyecto completo con nuestro equipo técnico o trabajar con el arquitecto que elijas, coordinando su proyecto con la ejecución."
        },
        {
          "q": "¿Hacéis ampliaciones y rehabilitaciones de casas existentes?",
          "a": "Sí. Ampliamos, reforzamos estructuras y rehabilitamos viviendas completas, incluida la mejora energética de la envolvente y las instalaciones."
        },
        {
          "q": "¿El presupuesto es cerrado?",
          "a": "Sí. Se cierra por partidas sobre el proyecto de ejecución y se certifica por fases. Los cambios se valoran y se aprueban por escrito antes de hacerlos."
        }
      ]
    },
  },
  {
    id: "s-6",
    slug: "naves-industriales",
    numero: "06",
    title: "Naves industriales",
    descripcion: "Acondicionamiento y adecuación de naves, almacenes y talleres: licencia de actividad, instalaciones, oficinas interiores y protección contra incendios.",
    imagen: "/proceso-compras.jpg",
    enlace: "/servicios/naves-industriales",
    content: "<p>Convertimos naves en bruto o antiguas en espacios listos para operar: adecuación a la actividad, protección contra incendios, instalaciones industriales, soleras, oficinas y vestuarios, con la licencia de actividad incluida.</p>",
    landing: {
      "lead": "Acondicionamiento de naves industriales en Madrid: adecuación de naves, almacenes y talleres a la actividad, con licencia, protección contra incendios, instalaciones, soleras y oficinas interiores, en el plazo que necesita la operación.",
      "supportContent": "Partimos de la actividad que se va a desarrollar: flujos de mercancía, maquinaria, personal y normativa. Con eso definimos la distribución, las instalaciones y las medidas contra incendios, y tramitamos la licencia para que la nave pueda abrir en la fecha prevista.",
      "commitments": [
        {
          "title": "Licencia incluida",
          "text": "Proyecto de actividad y tramitación con el ayuntamiento."
        },
        {
          "title": "Plazo de apertura",
          "text": "Calendario cerrado ajustado a la puesta en marcha."
        },
        {
          "title": "Obra por fases",
          "text": "Sin parar la actividad si la nave ya está operativa."
        }
      ],
      "problems": [
        {
          "avoid": "Naves que no pasan la inspección de protección contra incendios.",
          "promise": "Proyecto de seguridad contra incendios según el reglamento para establecimientos industriales."
        },
        {
          "avoid": "Instalaciones eléctricas o de aire insuficientes para la maquinaria.",
          "promise": "Cálculo de potencias, aire comprimido, iluminación y climatización según el proceso."
        },
        {
          "avoid": "Retrasos en la apertura por licencias mal planteadas.",
          "promise": "Licencia de actividad tramitada en paralelo a la obra desde el primer día."
        }
      ],
      "includes": [
        "Proyecto de actividad y licencia de apertura",
        "Protección contra incendios: sectorización, detección y extinción",
        "Soleras industriales, pinturas y señalización",
        "Instalación eléctrica de baja tensión e iluminación LED",
        "Climatización, ventilación y extracción",
        "Oficinas, vestuarios y aseos interiores",
        "Muelles de carga, puertas seccionales y abrigos",
        "Reparación de cubiertas y lucernarios"
      ],
      "capacidades": [
        {
          "codigo": "01",
          "titulo": "Licencias y normativa",
          "metrica": "Actividad · Incendios",
          "resumen": "Proyecto técnico y tramitación de la licencia de actividad y de las instalaciones.",
          "puntos": [
            "Reglamento de seguridad contra incendios",
            "Accesibilidad y medio ambiente"
          ]
        },
        {
          "codigo": "02",
          "titulo": "Obra civil industrial",
          "metrica": "Soleras · Estructura",
          "resumen": "Soleras de alta resistencia, refuerzos estructurales, fosos y entreplantas.",
          "puntos": [
            "Pavimentos para tráfico de carretillas",
            "Entreplantas metálicas"
          ]
        },
        {
          "codigo": "03",
          "titulo": "Instalaciones",
          "metrica": "Eléctrica · Clima · Aire",
          "resumen": "Instalaciones dimensionadas para la maquinaria y el número de trabajadores.",
          "puntos": [
            "Cuadros y líneas de potencia",
            "Climatización por zonas"
          ]
        },
        {
          "codigo": "04",
          "titulo": "Espacios de personal",
          "metrica": "Oficinas · Vestuarios",
          "resumen": "Oficinas, salas, vestuarios y aseos integrados en la nave.",
          "puntos": [
            "Aislamiento acústico frente a la zona de producción",
            "Acabados resistentes"
          ]
        }
      ],
      "processHeadline": "Cómo acondicionamos una nave industrial",
      "faqs": [
        {
          "q": "¿Tramitáis la licencia de actividad de la nave?",
          "a": "Sí. Redactamos el proyecto de actividad y de instalaciones y lo tramitamos con el ayuntamiento, coordinado con la obra para que la apertura no se retrase."
        },
        {
          "q": "¿Podéis trabajar con la nave en funcionamiento?",
          "a": "Sí. Planificamos la obra por zonas y horarios para que la actividad continúe, separando las áreas de trabajo y manteniendo los accesos."
        },
        {
          "q": "¿Qué exige la normativa contra incendios en una nave?",
          "a": "Depende de la superficie, la actividad y la carga de fuego. Puede requerir sectorización, detección, extintores, bocas de incendio, rociadores o evacuación de humos. Lo determinamos en el proyecto."
        },
        {
          "q": "¿Hacéis también las oficinas dentro de la nave?",
          "a": "Sí. Construimos oficinas, vestuarios y aseos, en planta baja o en entreplanta, con sus instalaciones y aislamiento frente a la zona industrial."
        }
      ]
    },
  },
  {
    id: "s-7",
    slug: "restauracion-de-locales",
    numero: "07",
    title: "Restauración de locales",
    descripcion: "Recuperación de locales antiguos o en desuso: estructura, fachada, instalaciones y adaptación a la normativa para darles una nueva actividad.",
    imagen: "/proceso-construccion.jpg",
    enlace: "/servicios/restauracion-de-locales",
    content: "<p>Recuperamos locales comerciales antiguos, cerrados o deteriorados: diagnóstico del estado, refuerzo estructural, saneamiento de humedades, renovación de instalaciones, fachada y escaparate, y adaptación a la normativa de accesibilidad y actividad.</p>",
    landing: {
      "lead": "Restauración de locales en Madrid: recuperamos bajos comerciales antiguos, cerrados o deteriorados con refuerzo estructural, tratamiento de humedades, instalaciones nuevas, fachada y adaptación a la normativa, listos para una nueva actividad.",
      "supportContent": "Un local antiguo esconde casi siempre sorpresas: forjados dañados, humedades, instalaciones fuera de norma o una fachada protegida. Empezamos con un diagnóstico técnico del estado real para que el presupuesto refleje lo que hay que hacer y no aparezcan sorpresas a mitad de obra.",
      "commitments": [
        {
          "title": "Diagnóstico previo",
          "text": "Inspección técnica del estado antes de presupuestar."
        },
        {
          "title": "Normativa al día",
          "text": "Accesibilidad, incendios y licencia de actividad."
        },
        {
          "title": "Patrimonio respetado",
          "text": "Fachadas y elementos protegidos recuperados con criterio."
        }
      ],
      "problems": [
        {
          "avoid": "Presupuestos que se disparan al abrir suelos y techos.",
          "promise": "Diagnóstico con catas y revisión estructural antes de cerrar el presupuesto."
        },
        {
          "avoid": "Humedades que reaparecen a los pocos meses.",
          "promise": "Tratamiento del origen: capilaridad, filtraciones o condensaciones, no solo del acabado."
        },
        {
          "avoid": "Locales que no obtienen la licencia de la nueva actividad.",
          "promise": "Adaptación a accesibilidad, incendios y ventilación según el uso previsto."
        }
      ],
      "includes": [
        "Diagnóstico técnico, catas e informe del estado",
        "Refuerzo de forjados, vigas y muros",
        "Tratamiento de humedades e impermeabilización",
        "Renovación completa de electricidad, fontanería y saneamiento",
        "Ventilación, extracción y climatización",
        "Restauración de fachada, escaparate y cierres",
        "Adaptación a accesibilidad y protección contra incendios",
        "Licencia de obra y de actividad"
      ],
      "capacidades": [
        {
          "codigo": "01",
          "titulo": "Diagnóstico y estructura",
          "metrica": "Catas · Refuerzos",
          "resumen": "Evaluación del estado real y refuerzo de forjados, vigas y muros de carga.",
          "puntos": [
            "Informe técnico previo",
            "Soluciones compatibles con el edificio"
          ]
        },
        {
          "codigo": "02",
          "titulo": "Humedades y saneamiento",
          "metrica": "Origen · Tratamiento",
          "resumen": "Eliminación de humedades por capilaridad, filtración o condensación.",
          "puntos": [
            "Barreras y drenajes",
            "Revestimientos transpirables"
          ]
        },
        {
          "codigo": "03",
          "titulo": "Fachadas y patrimonio",
          "metrica": "Recuperación",
          "resumen": "Restauración de fachadas, carpinterías y elementos protegidos según la normativa municipal.",
          "puntos": [
            "Coordinación con patrimonio",
            "Materiales tradicionales"
          ]
        },
        {
          "codigo": "04",
          "titulo": "Adaptación a la actividad",
          "metrica": "Licencia · Accesibilidad",
          "resumen": "El local queda listo para la nueva actividad, con la licencia tramitada.",
          "puntos": [
            "Accesibilidad y aseos adaptados",
            "Ventilación y extracción"
          ]
        }
      ],
      "processHeadline": "Cómo restauramos un local",
      "faqs": [
        {
          "q": "¿Qué incluye el diagnóstico inicial?",
          "a": "Una visita técnica con catas en suelos, techos y muros, revisión de la estructura, las humedades y las instalaciones, y un informe con las actuaciones necesarias y su valoración."
        },
        {
          "q": "¿Podéis trabajar en locales con fachada protegida?",
          "a": "Sí. Restauramos fachadas y elementos protegidos siguiendo las condiciones de la normativa municipal y de patrimonio, y tramitamos los permisos necesarios."
        },
        {
          "q": "¿El local queda listo para abrir?",
          "a": "Sí. Lo adaptamos a la actividad prevista en accesibilidad, protección contra incendios y ventilación, y tramitamos la licencia de actividad."
        },
        {
          "q": "¿Cuánto tarda la restauración de un local?",
          "a": "Depende del estado y la superficie. Tras el diagnóstico entregamos un calendario por fases con el plazo cerrado."
        }
      ]
    },
  },
  {
    id: "s-8",
    slug: "carpinteria-metalica",
    numero: "08",
    title: "Carpintería metálica",
    descripcion: "Ventanas, cerramientos, puertas, barandillas y estructuras ligeras en aluminio y acero, fabricadas a medida e instaladas por nuestro equipo.",
    imagen: "/90dias.jpg",
    enlace: "/servicios/carpinteria-metalica",
    content: "<p>Diseñamos, fabricamos e instalamos carpintería metálica a medida: ventanas y correderas de aluminio con rotura de puente térmico, cerramientos de terraza, puertas, barandillas, celosías y estructuras ligeras de acero.</p>",
    landing: {
      "lead": "Carpintería metálica en Madrid: ventanas y correderas de aluminio, cerramientos, puertas, barandillas, celosías y estructuras de acero fabricadas a medida e instaladas por nuestro equipo, con medición en obra y remates limpios.",
      "supportContent": "Trabajamos con sistemas de aluminio de fabricantes reconocidos y con talleres de cerrajería de confianza. Medimos en obra, definimos perfiles, vidrios y herrajes según el uso y la orientación, y coordinamos la instalación con albañilería y acabados para que los encuentros queden limpios.",
      "commitments": [
        {
          "title": "Medición en obra",
          "text": "Cada hueco medido y replanteado antes de fabricar."
        },
        {
          "title": "Sistemas de calidad",
          "text": "Perfiles con rotura de puente térmico y vidrios adecuados."
        },
        {
          "title": "Instalación propia",
          "text": "Montaje, sellado y remates por el mismo equipo."
        }
      ],
      "problems": [
        {
          "avoid": "Ventanas que dejan pasar aire, agua o ruido.",
          "promise": "Sistemas ensayados en permeabilidad, estanqueidad y viento, con instalación sellada."
        },
        {
          "avoid": "Perfiles y vidrios elegidos solo por precio.",
          "promise": "Selección según orientación, altura del edificio y exigencia térmica y acústica."
        },
        {
          "avoid": "Remates mal resueltos con la obra.",
          "promise": "Coordinación con albañilería, premarcos y acabados interiores."
        }
      ],
      "includes": [
        "Ventanas y balconeras de aluminio con rotura de puente térmico",
        "Correderas elevables y de grandes dimensiones",
        "Cerramientos de terrazas y porches",
        "Puertas de entrada, cancelas y puertas de garaje",
        "Barandillas de acero, vidrio y aluminio",
        "Celosías, lamas y protección solar",
        "Escaleras y estructuras ligeras de acero",
        "Sustitución de carpinterías en edificios habitados"
      ],
      "capacidades": [
        {
          "codigo": "01",
          "titulo": "Aluminio",
          "metrica": "Rotura de puente térmico",
          "resumen": "Ventanas, correderas y cerramientos con sistemas de altas prestaciones.",
          "puntos": [
            "Hojas ocultas y perfiles mínimos",
            "Acabados lacados y anodizados"
          ]
        },
        {
          "codigo": "02",
          "titulo": "Acero y cerrajería",
          "metrica": "Fabricación a medida",
          "resumen": "Barandillas, escaleras, puertas, cancelas y estructuras ligeras.",
          "puntos": [
            "Soldadura y galvanizado",
            "Diseño con el interiorismo"
          ]
        },
        {
          "codigo": "03",
          "titulo": "Vidrio",
          "metrica": "Térmico · Acústico · Seguridad",
          "resumen": "Vidrios bajo emisivos, de control solar, laminados y acústicos según el hueco.",
          "puntos": [
            "Doble y triple acristalamiento",
            "Vidrio de seguridad"
          ]
        },
        {
          "codigo": "04",
          "titulo": "Instalación",
          "metrica": "Sellado y remates",
          "resumen": "Montaje con premarco, sellado perimetral y remates interiores y exteriores.",
          "puntos": [
            "Coordinación con la obra",
            "Ajuste y revisión final"
          ]
        }
      ],
      "processHeadline": "Cómo trabajamos la carpintería metálica",
      "faqs": [
        {
          "q": "¿Aluminio o PVC?",
          "a": "Ambos ofrecen buen aislamiento si el sistema es de calidad. El aluminio con rotura de puente térmico permite perfiles más finos y grandes dimensiones; lo recomendamos según el hueco, el diseño y el presupuesto."
        },
        {
          "q": "¿Podéis cambiar las ventanas con la vivienda habitada?",
          "a": "Sí. Sustituimos las carpinterías por estancias, normalmente en una jornada por hueco, con protección del interior y retirada de las antiguas."
        },
        {
          "q": "¿Hacéis piezas de acero a medida?",
          "a": "Sí. Barandillas, escaleras, puertas, celosías y estructuras ligeras diseñadas con el proyecto y fabricadas en taller."
        },
        {
          "q": "¿Necesito permiso para cambiar las ventanas?",
          "a": "En muchos casos basta con una comunicación al ayuntamiento, pero en fachadas protegidas o si cambia el aspecto exterior puede hacer falta autorización de la comunidad y licencia. Lo revisamos antes de empezar."
        }
      ]
    },
  },
  {
    id: "s-9",
    slug: "ventanas-acusticas",
    numero: "09",
    title: "Ventanas acústicas",
    descripcion: "Ventanas de alto aislamiento acústico para viviendas, oficinas y hoteles junto a calles con tráfico, ocio nocturno o aeropuertos.",
    imagen: "/start-research-2.jpg",
    enlace: "/servicios/ventanas-acusticas",
    content: "<p>Instalamos ventanas acústicas que reducen de forma notable el ruido exterior: perfiles de altas prestaciones, vidrios laminados acústicos con cámaras asimétricas, cajones de persiana aislados y una instalación completamente sellada.</p>",
    landing: {
      "lead": "Ventanas acústicas en Madrid: carpinterías de alto aislamiento con vidrio laminado acústico, cámaras asimétricas, cajones de persiana aislados e instalación sellada para viviendas, oficinas y hoteles expuestos al ruido.",
      "supportContent": "El aislamiento acústico de una ventana depende del conjunto: perfil, vidrio, juntas, cajón de persiana y, sobre todo, la instalación. Medimos el ruido, analizamos su origen y proponemos la combinación que consigue la mejora necesaria, sin sobredimensionar.",
      "commitments": [
        {
          "title": "Estudio del ruido",
          "text": "Análisis del origen y del nivel antes de proponer la solución."
        },
        {
          "title": "Sistema completo",
          "text": "Perfil, vidrio, cajón y juntas pensados juntos."
        },
        {
          "title": "Instalación sellada",
          "text": "Sin puntos débiles por donde se cuele el ruido."
        }
      ],
      "problems": [
        {
          "avoid": "Cambiar las ventanas y seguir oyendo la calle.",
          "promise": "Vidrios laminados acústicos y cámaras asimétricas elegidos para el tipo de ruido."
        },
        {
          "avoid": "El cajón de persiana como principal entrada de ruido.",
          "promise": "Cajones aislados o soluciones sin cajón integradas en la ventana."
        },
        {
          "avoid": "Instalaciones con huecos en el perímetro del marco.",
          "promise": "Sellado perimetral con espumas y cintas acústicas y comprobación final."
        }
      ],
      "includes": [
        "Estudio del ruido exterior y de la exposición de la fachada",
        "Ventanas de aluminio o PVC con altas prestaciones acústicas",
        "Vidrios laminados acústicos con cámaras asimétricas",
        "Cajones de persiana aislados o sistemas sin cajón",
        "Doble ventana para exigencias muy altas",
        "Aireadores acústicos para cumplir la ventilación",
        "Instalación con sellado perimetral acústico",
        "Retirada y gestión de las carpinterías antiguas"
      ],
      "capacidades": [
        {
          "codigo": "01",
          "titulo": "Diagnóstico acústico",
          "metrica": "Origen del ruido",
          "resumen": "Identificamos si el ruido es de tráfico, ocio o aviones, porque cada uno se aísla de forma distinta.",
          "puntos": [
            "Revisión de fachada y huecos",
            "Objetivo de mejora definido"
          ]
        },
        {
          "codigo": "02",
          "titulo": "Vidrio acústico",
          "metrica": "Laminado · Cámaras asimétricas",
          "resumen": "Vidrios con láminas acústicas y espesores distintos para evitar resonancias.",
          "puntos": [
            "Combinable con control solar",
            "Seguridad incluida"
          ]
        },
        {
          "codigo": "03",
          "titulo": "Carpintería",
          "metrica": "Juntas · Cierres",
          "resumen": "Perfiles con varias juntas y cierres perimetrales que garantizan la hermeticidad.",
          "puntos": [
            "Aluminio o PVC",
            "Hojas practicables u oscilobatientes"
          ]
        },
        {
          "codigo": "04",
          "titulo": "Instalación",
          "metrica": "Sellado acústico",
          "resumen": "Montaje sin puentes acústicos en el perímetro, el cajón y el alféizar.",
          "puntos": [
            "Cintas y espumas específicas",
            "Prueba final"
          ]
        }
      ],
      "processHeadline": "Cómo instalamos ventanas acústicas",
      "faqs": [
        {
          "q": "¿Cuánto ruido reduce una ventana acústica?",
          "a": "Depende del vidrio, la carpintería y la instalación. Una buena ventana acústica puede reducir el ruido percibido a menos de la mitad respecto a una ventana antigua; definimos el objetivo tras analizar el ruido de tu fachada."
        },
        {
          "q": "¿Basta con cambiar solo el vidrio?",
          "a": "A veces mejora, pero si el marco no cierra bien o el cajón de persiana no está aislado, el ruido seguirá entrando por ahí. Revisamos el conjunto antes de recomendar."
        },
        {
          "q": "¿Y la ventilación si las ventanas cierran tan bien?",
          "a": "Se puede resolver con aireadores acústicos o con ventilación mecánica, de forma que la vivienda se ventile sin abrir las ventanas."
        },
        {
          "q": "¿Sirven para hoteles y oficinas?",
          "a": "Sí. Las instalamos en habitaciones de hotel, despachos y salas de reuniones en calles con mucho tráfico o zonas de ocio."
        }
      ]
    },
  },
  {
    id: "s-10",
    slug: "cabinas-acusticas-oficinas",
    numero: "10",
    title: "Cabinas acústicas para oficinas",
    descripcion: "Cabinas y salas acústicas para llamadas, videollamadas y reuniones en oficinas abiertas, instaladas y conectadas sin obra.",
    imagen: "/oficinas.jpg",
    enlace: "/servicios/cabinas-acusticas-oficinas",
    content: "<p>Diseñamos e instalamos cabinas acústicas para oficinas: unipersonales para llamadas, de dos a cuatro personas para reuniones y salas a medida, con aislamiento, ventilación, iluminación y electricidad integradas.</p>",
    landing: {
      "lead": "Cabinas acústicas para oficinas en Madrid: cabinas para llamadas y videollamadas, pequeñas salas de reunión y espacios de concentración en oficinas abiertas, con aislamiento, ventilación, iluminación y electricidad integradas, instaladas sin obra.",
      "supportContent": "En una oficina abierta las llamadas y las reuniones improvisadas son la principal fuente de ruido. Analizamos cómo trabaja el equipo para decidir cuántas cabinas hacen falta, de qué tamaño y dónde, y las integramos con la climatización, la electricidad y la imagen de la oficina.",
      "commitments": [
        {
          "title": "Sin obra",
          "text": "Montaje rápido y sin parar el trabajo de la oficina."
        },
        {
          "title": "Integradas",
          "text": "Electricidad, ventilación y datos conectados."
        },
        {
          "title": "A medida",
          "text": "Tamaños, acabados y colores según la oficina."
        }
      ],
      "problems": [
        {
          "avoid": "Llamadas y videollamadas que interrumpen al resto del equipo.",
          "promise": "Cabinas unipersonales con aislamiento suficiente para hablar con normalidad."
        },
        {
          "avoid": "Cabinas calurosas en las que nadie quiere entrar.",
          "promise": "Ventilación forzada silenciosa que renueva el aire de forma continua."
        },
        {
          "avoid": "Pocas salas de reunión siempre ocupadas.",
          "promise": "Cabinas de dos a cuatro personas y salas modulares para reuniones cortas."
        }
      ],
      "includes": [
        "Estudio de necesidades y ubicación en la planta",
        "Cabinas unipersonales para llamadas y videollamadas",
        "Cabinas de dos a cuatro personas para reuniones",
        "Salas acústicas modulares a medida",
        "Ventilación silenciosa e iluminación regulable",
        "Electricidad, USB y red de datos",
        "Acabados, tapicerías y colores corporativos",
        "Montaje, traslado y reubicación"
      ],
      "capacidades": [
        {
          "codigo": "01",
          "titulo": "Aislamiento acústico",
          "metrica": "Paneles · Vidrio laminado",
          "resumen": "Cerramientos y puertas diseñados para mantener la privacidad de la conversación.",
          "puntos": [
            "Absorción interior que evita el eco",
            "Puertas con cierre hermético"
          ]
        },
        {
          "codigo": "02",
          "titulo": "Confort interior",
          "metrica": "Ventilación · Luz",
          "resumen": "Renovación de aire silenciosa, iluminación regulable y detección de presencia.",
          "puntos": [
            "Temperatura agradable",
            "Encendido automático"
          ]
        },
        {
          "codigo": "03",
          "titulo": "Integración",
          "metrica": "Electricidad · Datos",
          "resumen": "Conexión a la red eléctrica y de datos de la oficina, y adaptación a la protección contra incendios.",
          "puntos": [
            "Tomas y USB integrados",
            "Coordinación con el edificio"
          ]
        },
        {
          "codigo": "04",
          "titulo": "Diseño",
          "metrica": "Acabados a medida",
          "resumen": "Tamaños, materiales y colores que encajan con la imagen de la empresa.",
          "puntos": [
            "Mobiliario interior incluido",
            "Opciones accesibles"
          ]
        }
      ],
      "processHeadline": "Cómo instalamos cabinas acústicas en oficinas",
      "faqs": [
        {
          "q": "¿Necesitan obra o licencia?",
          "a": "Normalmente no. Son elementos modulares que se montan en pocas horas y se conectan a un enchufe. Revisamos su encaje con la protección contra incendios y la climatización del edificio."
        },
        {
          "q": "¿Cuántas cabinas necesita mi oficina?",
          "a": "Depende del número de personas, de cuántas llamadas y videollamadas hacen y del número de salas disponibles. Lo calculamos con el equipo antes de proponer."
        },
        {
          "q": "¿Se pueden trasladar si cambiamos de oficina?",
          "a": "Sí. Se desmontan y se vuelven a montar en la nueva ubicación sin perder prestaciones."
        },
        {
          "q": "¿Hacéis salas acústicas a medida además de cabinas?",
          "a": "Sí. Diseñamos salas de reunión y despachos acústicos a medida dentro de reformas de oficinas completas."
        }
      ]
    },
  },
  {
    id: "s-11",
    slug: "concierge-familias-extranjeras",
    numero: "11",
    title: "Concierge para familias extranjeras",
    descripcion: "Acompañamos a familias que se mudan a Madrid desde el extranjero: búsqueda y compra de la vivienda, proyecto, reforma e interiorismo, todo gestionado en remoto.",
    imagen: "/proceso-entrega.jpg",
    enlace: "/servicios/concierge-familias-extranjeras",
    content: "<p>Un único interlocutor para familias que quieren vivir en Madrid sin estar aquí durante el proceso: búsqueda de la vivienda, acompañamiento en la compra con abogados y gestores colaboradores, proyecto, licencias, reforma, interiorismo y entrega lista para entrar a vivir, con seguimiento online de cada fase.</p>",
    landing: {
      "lead": "Concierge inmobiliario para familias extranjeras en Madrid: te acompañamos desde la búsqueda y la compra de la vivienda hasta su reforma, interiorismo y entrega lista para vivir, con un único interlocutor y seguimiento online de todo el proceso.",
      "supportContent": "Mudarse a otro país ya es suficiente trabajo. Nos ocupamos de que la casa no sea una preocupación más: visitamos inmuebles por ti, evaluamos su estado técnico antes de que compres, coordinamos la compra con abogados y gestores colaboradores, y diseñamos y ejecutamos la reforma mientras sigues el avance por videollamada, fotos e informes semanales.",
      "statsTitle": "Familias extranjeras con ALKO",
      "problemsHeadline": "Tu casa en Madrid, gestionada desde donde estés",
      "capacidadesHeadline": "Qué hacemos por tu familia",
      "commitments": [
        {
          "title": "Un solo interlocutor",
          "text": "Desde la búsqueda hasta la entrega de llaves."
        },
        {
          "title": "Todo en remoto",
          "text": "Visitas por vídeo, firmas digitales e informes semanales."
        },
        {
          "title": "Lista para vivir",
          "text": "Reforma, mobiliario y suministros dados de alta."
        }
      ],
      "problems": [
        {
          "avoid": "Comprar una vivienda sin saber qué obra necesita ni cuánto costará.",
          "promise": "Informe técnico y presupuesto orientativo de la reforma antes de firmar la compra."
        },
        {
          "avoid": "Gestionar desde otro país a agentes, notarías, gremios y proveedores por separado.",
          "promise": "Un único coordinador en Madrid, en tu idioma, con red de abogados y gestores colaboradores."
        },
        {
          "avoid": "Llegar a Madrid y encontrar la casa sin terminar.",
          "promise": "Calendario cerrado de compra, obra y entrega, con seguimiento online de cada hito."
        }
      ],
      "includesSubtitle": "Qué incluye el servicio de concierge",
      "includes": [
        "Búsqueda de vivienda según zona, colegios, presupuesto y estilo de vida",
        "Visitas por videollamada e informe técnico del estado del inmueble",
        "Coordinación de la compraventa con abogados, gestores y notaría colaboradores",
        "Proyecto de reforma e interiorismo con presentación online",
        "Licencias de obra y trámites con el ayuntamiento",
        "Ejecución de la reforma con informes semanales de avance",
        "Mobiliario, equipamiento y alta de suministros",
        "Entrega lista para entrar a vivir y servicio posventa"
      ],
      "capacidades": [
        {
          "codigo": "01",
          "titulo": "Búsqueda y evaluación",
          "metrica": "Antes de comprar",
          "resumen": "Seleccionamos inmuebles y revisamos su estado técnico, estructura e instalaciones antes de que tomes una decisión.",
          "puntos": [
            "Informe técnico por vivienda",
            "Estimación del coste de reforma"
          ]
        },
        {
          "codigo": "02",
          "titulo": "Compra acompañada",
          "metrica": "Red de colaboradores",
          "resumen": "Coordinamos la operación con abogados, gestores y notaría colaboradores, que se encargan de la parte legal y fiscal.",
          "puntos": [
            "Seguimiento de plazos y firmas",
            "Comunicación en tu idioma"
          ]
        },
        {
          "codigo": "03",
          "titulo": "Proyecto y reforma",
          "metrica": "Gestión en remoto",
          "resumen": "Diseño, licencias y obra con un arquitecto técnico al frente y seguimiento online.",
          "puntos": [
            "Presentaciones y aprobaciones por vídeo",
            "Informes semanales con fotos"
          ]
        },
        {
          "codigo": "04",
          "titulo": "Llegada",
          "metrica": "Llave en mano",
          "resumen": "Mobiliario, equipamiento, suministros y limpieza final para entrar a vivir desde el primer día.",
          "puntos": [
            "Domótica y conectividad listas",
            "Atención posventa"
          ]
        }
      ],
      "processHeadline": "Cómo acompañamos a una familia que se muda a Madrid",
      "faqs": [
        {
          "q": "¿Puedo hacer todo el proceso sin viajar a Madrid?",
          "a": "Sí. Las visitas se hacen por videollamada, los documentos se firman de forma digital o mediante poder notarial, y la obra se sigue con informes semanales, fotos y reuniones online."
        },
        {
          "q": "¿Os encargáis de la parte legal y fiscal de la compra?",
          "a": "La coordinamos con abogados, gestores y notaría colaboradores, que son quienes asesoran en lo legal y fiscal. Nosotros nos ocupamos de que todo avance en plazo y de que el inmueble sea técnicamente adecuado."
        },
        {
          "q": "¿En qué idiomas trabajáis?",
          "a": "Atendemos en español e inglés, y coordinamos traducción con nuestros colaboradores cuando hace falta otro idioma."
        },
        {
          "q": "¿Cuánto tiempo pasa desde la búsqueda hasta entrar a vivir?",
          "a": "Depende del mercado y de la obra que necesite la vivienda. Tras la compra entregamos un calendario cerrado de reforma con la fecha de entrega."
        }
      ]
    },
  },
  {
    id: "s-12",
    slug: "implantacion-de-empresas",
    numero: "12",
    title: "Implantación de empresas internacionales",
    descripcion: "Para empresas internacionales que necesitan su sede en Madrid: búsqueda del local u oficina, licencia de actividad, reforma e implantación llave en mano.",
    imagen: "/sector-oficinas.jpg",
    enlace: "/servicios/implantacion-de-empresas",
    content: "<p>Acompañamos a empresas internacionales que abren sede en Madrid: búsqueda y evaluación técnica del local u oficina, licencia de apertura y actividad, proyecto, reforma e implantación llave en mano, y coordinación con asesores fiscales y legales colaboradores.</p>",
    landing: {
      "lead": "Implantación de sedes de empresas internacionales en Madrid: búsqueda del local u oficina, evaluación técnica, licencia de actividad, proyecto, reforma e implantación llave en mano, con un único interlocutor y coordinación con asesores fiscales y legales.",
      "supportContent": "Abrir una sede en otro país implica decisiones inmobiliarias, técnicas, administrativas y fiscales a la vez. Actuamos como el equipo local de la empresa: buscamos el espacio adecuado, comprobamos que la actividad es viable antes de firmar, tramitamos la licencia y ejecutamos la implantación, mientras nuestros colaboradores se ocupan de la constitución, la fiscalidad y los contratos.",
      "statsTitle": "Empresas internacionales con ALKO",
      "problemsHeadline": "Su sede en Madrid, lista para operar",
      "capacidadesHeadline": "Qué hacemos por su empresa",
      "commitments": [
        {
          "title": "Viabilidad antes de firmar",
          "text": "Revisamos usos, licencia y obra antes del contrato."
        },
        {
          "title": "Licencia incluida",
          "text": "Proyecto de actividad y apertura tramitados por nosotros."
        },
        {
          "title": "Fecha de apertura",
          "text": "Calendario cerrado de obra e implantación."
        }
      ],
      "problems": [
        {
          "avoid": "Firmar el alquiler de un local en el que la actividad no es viable.",
          "promise": "Informe de compatibilidad urbanística, licencia y obra necesaria antes de la firma."
        },
        {
          "avoid": "Coordinar desde el extranjero a agentes, ingenierías, constructoras y asesores.",
          "promise": "Un único interlocutor local con red de asesores fiscales y legales colaboradores."
        },
        {
          "avoid": "Retrasos en la apertura por licencias y obras mal planificadas.",
          "promise": "Licencia, obra e implantación planificadas en paralelo con una fecha de apertura cerrada."
        }
      ],
      "includesSubtitle": "Qué incluye la implantación de su sede",
      "includes": [
        "Búsqueda de oficinas, locales o naves según la actividad y la plantilla",
        "Informe de viabilidad urbanística y técnica antes de firmar",
        "Licencia de apertura y de actividad",
        "Proyecto de implantación e imagen corporativa",
        "Reforma, instalaciones y protección contra incendios",
        "Mobiliario, tecnología, cableado y puestos de trabajo",
        "Coordinación con asesores fiscales, legales y laborales colaboradores",
        "Mantenimiento y servicio posventa tras la apertura"
      ],
      "capacidades": [
        {
          "codigo": "01",
          "titulo": "Búsqueda y viabilidad",
          "metrica": "Antes de firmar",
          "resumen": "Seleccionamos espacios y comprobamos el uso permitido, la licencia y la obra necesaria.",
          "puntos": [
            "Informe por inmueble",
            "Estimación de plazo y coste"
          ]
        },
        {
          "codigo": "02",
          "titulo": "Licencias",
          "metrica": "Apertura · Actividad",
          "resumen": "Proyecto técnico y tramitación de la licencia con el ayuntamiento o entidades colaboradoras.",
          "puntos": [
            "Accesibilidad e incendios",
            "Seguimiento del expediente"
          ]
        },
        {
          "codigo": "03",
          "titulo": "Implantación llave en mano",
          "metrica": "Proyecto · Obra · Equipamiento",
          "resumen": "Diseño del espacio de trabajo, obra, instalaciones, mobiliario y tecnología.",
          "puntos": [
            "Estándares corporativos de la empresa",
            "Fecha de apertura cerrada"
          ]
        },
        {
          "codigo": "04",
          "titulo": "Coordinación local",
          "metrica": "Red de colaboradores",
          "resumen": "Enlace con asesores fiscales, legales y laborales para la constitución y la operativa en España.",
          "puntos": [
            "Un único interlocutor",
            "Comunicación en inglés"
          ]
        }
      ],
      "processHeadline": "Cómo implantamos la sede de una empresa en Madrid",
      "faqs": [
        {
          "q": "¿Nos ayudáis a encontrar la oficina o el local?",
          "a": "Sí. Buscamos espacios según la actividad, la plantilla y la ubicación deseada, y evaluamos cada opción técnicamente antes de que firméis."
        },
        {
          "q": "¿Os ocupáis de la parte fiscal y de la constitución de la empresa?",
          "a": "Lo coordinamos con asesores fiscales, legales y laborales colaboradores, que son quienes prestan ese asesoramiento. Nosotros integramos sus plazos en el calendario de la implantación."
        },
        {
          "q": "¿Podéis aplicar nuestros estándares corporativos?",
          "a": "Sí. Adaptamos el manual de imagen y los estándares técnicos del grupo a la normativa española y a los proveedores locales."
        },
        {
          "q": "¿Cuánto se tarda en abrir la sede?",
          "a": "Depende del inmueble, la licencia y la obra. Tras el informe de viabilidad entregamos un calendario con la fecha de apertura."
        }
      ]
    },
  },
];

/** Servicios anteriores que ahora forman parte de otro (los proyectos antiguos aún los usan). */
const SECTOR_ALIASES: Record<string, string> = {
  viviendas: "residencial",
  "reformas-integrales": "residencial",
};

/** Búsqueda principal de cada servicio (títulos y textos de su página, para posicionarla). */
const SECTOR_KEYWORDS: Record<string, string> = {
  oficinas: "reformas de oficinas",
  residencial: "reformas de viviendas",
  retail: "reformas de locales comerciales",
  hospitality: "reformas de hoteles y restaurantes",
  "viviendas-unifamiliares": "construcción de viviendas unifamiliares",
  "naves-industriales": "acondicionamiento de naves industriales",
  "restauracion-de-locales": "restauración de locales",
  "carpinteria-metalica": "carpintería metálica",
  "ventanas-acusticas": "ventanas acústicas",
  "cabinas-acusticas-oficinas": "cabinas acústicas para oficinas",
  "concierge-familias-extranjeras": "concierge inmobiliario para familias extranjeras",
  "implantacion-de-empresas": "implantación de sedes de empresas internacionales",
};

/** Frase de búsqueda del servicio, en minúsculas (p. ej. «reformas de oficinas»). */
export function sectorKeyword(sector: { slug: string; title: string }): string {
  return SECTOR_KEYWORDS[sectorSlug(sector.slug)] ?? `obras de ${sector.title.toLowerCase()}`;
}

/** Slug vigente de un servicio, traduciendo los antiguos. */
export function sectorSlug(slug: string | undefined): string {
  const value = slug || "";
  return SECTOR_ALIASES[value] ?? value;
}

export const DEFAULT_FASES: Fase[] = [
  {
    id: "f-1",
    tag: "(01)",
    title: "Construcción",
    texto: "Ejecución de obra civil, albañilería técnica, refuerzos estructurales y replanteos milimétricos. Nuestro equipo propio asegura precisión constructiva y fidelidad absoluta al proyecto arquitectónico.",
    imagen: "/proceso-construccion.jpg",
  },
  {
    id: "f-2",
    tag: "(02)",
    title: "Instalaciones",
    texto: "Diseño e integración de climatización oculta (aerotermia y suelo radiante), electricidad avanzada, domótica KNX, fontanería e iluminación técnica con estándares máximos de eficiencia energética.",
    imagen: "/proceso-instalaciones.jpg",
  },
  {
    id: "f-3",
    tag: "(03)",
    title: "Compras",
    texto: "Selección y negociación directa con fabricantes de materiales nobles: piedra natural, maderas macizas, carpinterías minimalistas y mecanismos de autor, garantizando trazabilidad y coste cerrado.",
    imagen: "/proceso-compras.jpg",
  },
  {
    id: "f-4",
    tag: "(04)",
    title: "Coordinación",
    texto: "Sincronización exhaustiva de gremios especializados y control técnico en obra. Un interlocutor único coordina cada oficio diariamente para eliminar tiempos muertos y desajustes de ejecución.",
    imagen: "/proceso-coordinacion.jpg",
  },
  {
    id: "f-5",
    tag: "(05)",
    title: "Control",
    texto: "Auditoría continua de tolerancias, pruebas de estanqueidad, ensayos acústicos y verificación exhaustiva de acabados para asegurar el cumplimiento estricto del cronograma y las calidades pactadas.",
    imagen: "/proceso-control.jpg",
  },
  {
    id: "f-6",
    tag: "(06)",
    title: "Entrega",
    texto: "Hito final con recepción formal llave en mano y limpieza técnica profunda. Entregamos el libro de obra, manuales de funcionamiento de sistemas, certificados visados y cobertura de garantía postventa.",
    imagen: "/proceso-entrega.jpg",
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
    id: "art-4",
    slug: "suelo-radiante-con-aerotermia",
    title: "Suelo radiante con aerotermia: cómo funciona, qué cuesta y cuándo compensa",
    category: "Instalaciones",
    excerpt: "La combinación más eficiente para climatizar una vivienda: agua a baja temperatura, calor repartido por todo el suelo y refrigeración en verano con la misma instalación. Qué hay que saber antes de decidir.",
    content: "<p>Si hoy se proyecta una vivienda nueva o una reforma integral, el suelo radiante con aerotermia es casi siempre la primera opción que estudiamos para calefacción y agua caliente. No es una moda: es la pareja que mejor aprovecha cómo trabaja una bomba de calor, y la que da un confort más uniforme. Pero tiene condiciones, y conviene conocerlas antes de levantar el suelo.</p>\n<h2>Cómo funciona el sistema</h2>\n<p>La aerotermia es una bomba de calor que extrae energía del aire exterior y la cede a un circuito de agua. Por cada kWh de electricidad que consume entrega entre tres y cinco kWh de calor, según la temperatura exterior y la del agua que tiene que producir. Esa es la clave: cuanto más baja es la temperatura de impulsión, más eficiente es la máquina.</p>\n<p>El suelo radiante es justamente el emisor que menos temperatura necesita. Al ocupar toda la superficie de la estancia, trabaja con agua a 30–35 °C, frente a los 55–70 °C de un radiador convencional. La bomba de calor rinde así en su mejor punto durante todo el invierno.</p>\n<blockquote>El suelo radiante no calienta el aire: calienta las superficies, y por eso se percibe el mismo confort con uno o dos grados menos en el termostato.</blockquote>\n<h2>Ventajas frente a radiadores o splits</h2>\n<ul>\n<li><strong>Confort uniforme.</strong> El calor sube desde el suelo de forma homogénea, sin corrientes de aire ni zonas frías junto a las ventanas.</li>\n<li><strong>Eficiencia.</strong> La baja temperatura de impulsión mejora el rendimiento estacional de la aerotermia de forma notable respecto a radiadores.</li>\n<li><strong>Refrigeración en verano.</strong> Con una bomba reversible, el mismo circuito puede enfriar el suelo. Se recomienda complementarlo con deshumectación o un fancoil para controlar la humedad.</li>\n<li><strong>Espacio libre.</strong> Sin radiadores ni unidades interiores en las paredes, la distribución y el mobiliario no quedan condicionados.</li>\n<li><strong>Una sola instalación.</strong> La misma máquina produce el agua caliente sanitaria con un depósito acumulador.</li>\n</ul>\n<h2>Qué exige la obra</h2>\n<p>El sistema se compone, de abajo arriba, de un panel aislante con tetones, el tubo de polietileno reticulado (PEX o PE-RT) con barrera antioxígeno, un mortero autonivelante de unos 4–5 cm y el pavimento final. En total hay que contar con unos 7–9 cm de altura sobre el forjado. En obra nueva no es un problema; en rehabilitación obliga a demoler el suelo existente o a usar sistemas de bajo espesor.</p>\n<p>Cada estancia lleva uno o varios circuitos que vuelven a un colector, donde se regula el caudal. El diseño debe partir de un cálculo de cargas térmicas por estancia, no de una regla genérica: la separación entre tubos, la longitud de los circuitos y la temperatura de impulsión salen de ese cálculo.</p>\n<h2>El pavimento importa</h2>\n<p>El calor tiene que atravesar el acabado, así que su resistencia térmica condiciona el rendimiento.</p>\n<table>\n<thead><tr><th>Pavimento</th><th>Comportamiento</th></tr></thead>\n<tbody>\n<tr><td>Porcelánico y piedra</td><td>El mejor: conducen bien el calor y no se deforman</td></tr>\n<tr><td>Microcemento</td><td>Muy bueno, con espesor reducido y sin juntas</td></tr>\n<tr><td>Madera multicapa</td><td>Adecuado si el fabricante lo certifica para suelo radiante, mejor encolado</td></tr>\n<tr><td>Madera maciza gruesa y moquetas</td><td>Poco recomendable: aíslan y reducen la potencia emitida</td></tr>\n</tbody>\n</table>\n<h2>Cuánto cuesta y cuándo compensa</h2>\n<p>La instalación conjunta de aerotermia y suelo radiante supone una inversión inicial superior a una caldera de gas con radiadores. A cambio, el consumo anual baja de forma significativa, desaparece la factura de gas y el término fijo asociado, y la vivienda mejora su calificación energética.</p>\n<p>Compensa especialmente cuando:</p>\n<ul>\n<li>Se hace obra nueva o una reforma integral en la que el suelo se va a levantar igualmente.</li>\n<li>La envolvente está bien aislada, porque la demanda es baja y la máquina puede ser más pequeña.</li>\n<li>La vivienda se usa todo el año y de forma continua: el suelo radiante tiene inercia y funciona mejor con un régimen estable.</li>\n<li>Hay posibilidad de instalar placas fotovoltaicas que cubran parte del consumo eléctrico.</li>\n</ul>\n<h2>Errores habituales</h2>\n<ol>\n<li>Dimensionar la máquina sin cálculo de cargas, lo que provoca arranques continuos o falta de potencia.</li>\n<li>Olvidar el aislamiento perimetral y bajo el panel, que hace que parte del calor se pierda hacia el forjado.</li>\n<li>Usar un único termostato para toda la vivienda en lugar de regulación por estancias.</li>\n<li>Elegir el pavimento después de diseñar la instalación.</li>\n<li>Activar la refrigeración sin control de humedad, con riesgo de condensación en la superficie.</li>\n</ol>\n<h2>Cómo lo planteamos en ALKO</h2>\n<p>Calculamos las cargas de cada estancia, dimensionamos máquina, circuitos y colectores, y coordinamos la instalación con la albañilería y el pavimento elegido para que todo encaje en altura y en plazo. Al terminar, se hace la prueba de presión, el equilibrado de circuitos y la puesta en marcha con el fabricante.</p>",
    image: "/slide1.jpg",
    date: "2026-11-02",
  },
  {
    id: "art-5",
    slug: "porcelanico-de-gran-formato-instalacion",
    title: "Porcelánico de gran formato: claves de una instalación sin cejas ni piezas rotas",
    category: "Materiales",
    excerpt: "Las piezas de 120×120, 160×320 o más grandes transforman un espacio, pero no perdonan errores. Soporte, adhesivo, juntas y manipulación: lo que separa un acabado impecable de uno que hay que levantar.",
    content: "<p>El porcelánico de gran formato se ha convertido en el acabado de referencia en viviendas de alto nivel, locales y hoteles. Menos juntas, superficies continuas y una imagen que recuerda a la piedra natural sin sus inconvenientes. El problema es que una pieza de 1,20 × 2,40 m no se coloca como una baldosa de 30 × 30: cualquier defecto del soporte o de la técnica se ve, y una pieza rota cuesta mucho más que una pequeña.</p>\n<h2>Qué se considera gran formato</h2>\n<p>Hablamos de gran formato a partir de piezas con algún lado mayor de 60 cm, y de lámina o placa cuando superan 1 × 3 m con espesores de 6 a 12 mm. Cuanto mayor es la pieza, más exigentes son la planimetría del soporte, el adhesivo y la manipulación.</p>\n<h2>El soporte: la mitad del resultado</h2>\n<p>La regla práctica es que la planeidad del soporte debe estar por debajo de 3 mm medidos con regla de 2 m. Con piezas grandes, una desviación que en formato pequeño se absorbería con el adhesivo se traduce en cejas visibles entre piezas o en huecos bajo la baldosa que acaban en roturas.</p>\n<ul>\n<li><strong>Soleras y recrecidos.</strong> Deben estar curados y secos: un mortero de cemento necesita varias semanas antes de recibir el pavimento.</li>\n<li><strong>Autonivelantes.</strong> Son la forma más fiable de conseguir la planeidad necesaria en grandes superficies.</li>\n<li><strong>Paredes.</strong> El enlucido o la placa de yeso laminado tienen que estar a plomo y con la resistencia adecuada al peso de las piezas.</li>\n<li><strong>Juntas de movimiento.</strong> Las del edificio se respetan siempre en el pavimento, y se añaden perimetrales y cada cierta superficie.</li>\n</ul>\n<h2>Adhesivo y técnica de colocación</h2>\n<p>Se utilizan cementos cola de altas prestaciones, como mínimo C2 y con deformabilidad S1 o S2 según el formato y el soporte. La técnica obligatoria es el doble encolado: adhesivo en el soporte y en el dorso de la pieza, para que no queden huecos.</p>\n<blockquote>Una pieza de gran formato con huecos bajo su superficie suena a hueco al pisarla y, tarde o temprano, se rompe por una esquina.</blockquote>\n<ol>\n<li>Replanteo completo antes de empezar, para que los cortes queden en zonas poco visibles y se aprovechen las piezas.</li>\n<li>Limpieza del dorso y comprobación de cada pieza antes de colocarla.</li>\n<li>Doble encolado con llana dentada del tamaño adecuado.</li>\n<li>Asentamiento con maza de goma o vibrador específico para expulsar el aire.</li>\n<li>Uso de sistemas de nivelación con cuñas para eliminar cejas entre piezas.</li>\n<li>Comprobación del contacto levantando alguna pieza al principio del trabajo.</li>\n</ol>\n<h2>Juntas: mínimas, pero nunca cero</h2>\n<p>El gran formato permite juntas finas, normalmente de 2 a 3 mm, rellenas con mortero o epoxi del color de la pieza. Colocar a junta cero es un error: las piezas necesitan absorber pequeños movimientos y, sin junta, aparecen tensiones que terminan en desconchones o despegues.</p>\n<h2>Manipulación y herramientas</h2>\n<table>\n<thead><tr><th>Fase</th><th>Lo necesario</th></tr></thead>\n<tbody>\n<tr><td>Transporte</td><td>Bastidores con ventosas y carros específicos; las piezas se mueven siempre de canto</td></tr>\n<tr><td>Corte</td><td>Mesas de corte de gran longitud y discos para porcelánico; huecos con corona de diamante</td></tr>\n<tr><td>Colocación</td><td>Dos operarios por pieza como mínimo, ventosas y nivelación con cuñas</td></tr>\n<tr><td>Protección</td><td>Cartón o lámina transpirable hasta el final de la obra</td></tr>\n</tbody>\n</table>\n<p>Hay que comprobar también el acceso: ascensores, escaleras y huecos de puerta limitan el tamaño máximo que puede llegar a la estancia, y es mejor saberlo antes de pedir el material.</p>\n<h2>Dónde funciona mejor</h2>\n<ul>\n<li>Salones y zonas de día amplias, donde la continuidad visual se aprecia.</li>\n<li>Baños con paredes de pieza completa sin juntas horizontales.</li>\n<li>Encimeras, frentes de cocina y revestimiento de islas con la misma pieza que el suelo.</li>\n<li>Vestíbulos de hoteles, oficinas y locales comerciales de tráfico intenso.</li>\n<li>Suelo radiante: su conductividad lo convierte en uno de los mejores acabados para este sistema.</li>\n</ul>\n<h2>Cómo lo trabajamos en ALKO</h2>\n<p>Revisamos la planeidad del soporte antes de empezar, hacemos el despiece con el cliente y trabajamos con colocadores especializados en gran formato y la herramienta adecuada. Así el pavimento llega al final de la obra igual que se proyectó.</p>",
    image: "/setart.jpg",
    date: "2026-10-30",
  },
  {
    id: "art-6",
    slug: "domotica-y-electricidad-en-viviendas-unifamiliares",
    title: "Domótica y electricidad en viviendas unifamiliares: cómo proyectar una casa conectada",
    category: "Instalaciones",
    excerpt: "Iluminación, clima, persianas, seguridad y energía controlados desde un mismo sistema. Lo que hay que decidir antes de tirar el primer cable para que la casa funcione hoy y pueda crecer mañana.",
    content: "<p>En una vivienda unifamiliar la instalación eléctrica deja de ser un conjunto de enchufes e interruptores. Hay jardín, garaje, a veces piscina, una bomba de calor, placas solares, un punto de recarga para el coche y muchas más estancias que controlar. La domótica ordena todo eso en un solo sistema. Pero solo funciona bien si se proyecta junto con la electricidad, no como un añadido final.</p>\n<h2>La base: una instalación eléctrica bien dimensionada</h2>\n<p>Antes de hablar de automatización, la vivienda necesita una instalación eléctrica a la altura del uso real. En una casa con aerotermia, inducción, recarga de vehículo y piscina, la potencia y la distribución cambian por completo respecto a un piso.</p>\n<ul>\n<li><strong>Previsión de potencia.</strong> Se calcula sumando los consumos reales y la simultaneidad. Con vehículo eléctrico y bomba de calor es habitual pasar a suministros de mayor potencia o incluso trifásicos.</li>\n<li><strong>Cuadro amplio y ordenado.</strong> Circuitos separados por zonas y usos, con espacio libre para ampliaciones y para los equipos domóticos.</li>\n<li><strong>Protecciones adecuadas.</strong> Diferenciales por grupos de circuitos y protección contra sobretensiones, imprescindible con electrónica sensible.</li>\n<li><strong>Canalizaciones de reserva.</strong> Tubos vacíos hacia jardín, garaje, cubierta y salón: dejarlos cuesta poco y evita rozas futuras.</li>\n</ul>\n<h2>Qué se puede automatizar</h2>\n<table>\n<thead><tr><th>Sistema</th><th>Qué permite</th></tr></thead>\n<tbody>\n<tr><td>Iluminación</td><td>Escenas por estancia, regulación, encendido por presencia y horarios exteriores</td></tr>\n<tr><td>Climatización</td><td>Temperatura por estancia, programación horaria y control remoto de la aerotermia</td></tr>\n<tr><td>Persianas y toldos</td><td>Control por fachada según sol, viento o lluvia</td></tr>\n<tr><td>Seguridad</td><td>Alarma, cámaras, videoportero y control de accesos integrados</td></tr>\n<tr><td>Energía</td><td>Gestión de fotovoltaica, baterías y recarga del coche según producción</td></tr>\n<tr><td>Riego y piscina</td><td>Programación, sensores de humedad y control de la depuradora</td></tr>\n</tbody>\n</table>\n<h2>Sistemas cableados o inalámbricos</h2>\n<p>En obra nueva o reforma integral recomendamos un sistema cableado de estándar abierto, como KNX. Los dispositivos se comunican por un bus propio, no dependen de la wifi, no se quedan obsoletos con un fabricante y cualquier integrador certificado puede mantenerlo o ampliarlo.</p>\n<p>Los sistemas inalámbricos tienen su sitio en reformas parciales o para complementar una instalación existente, pero en una vivienda completa la fiabilidad del cableado compensa con creces la diferencia de precio.</p>\n<blockquote>La mejor domótica es la que no se nota: la casa responde como se espera y los mecanismos siguen siendo sencillos de usar para cualquiera.</blockquote>\n<h2>Cómo se proyecta</h2>\n<ol>\n<li>Definir con el cliente cómo vive la casa: rutinas, estancias, quién la usa y qué quiere controlar.</li>\n<li>Elaborar el esquema eléctrico y domótico conjunto, con cada punto de luz, mecanismo, sensor y actuador.</li>\n<li>Dimensionar el cuadro con espacio para los módulos domóticos y una reserva de crecimiento.</li>\n<li>Coordinar con climatización, carpintería exterior y seguridad para que todos los equipos sean integrables.</li>\n<li>Programar escenas, probar con el cliente y entregar la documentación y el acceso remoto.</li>\n</ol>\n<h2>Errores que vemos a menudo</h2>\n<ul>\n<li>Decidir la domótica cuando la instalación eléctrica ya está hecha, lo que obliga a soluciones inalámbricas limitadas.</li>\n<li>Mezclar varias aplicaciones de distintos fabricantes que no se comunican entre sí.</li>\n<li>Quitar todos los interruptores físicos: la casa debe poder usarse sin móvil.</li>\n<li>No dejar documentado el sistema, de modo que nadie más que el instalador original puede tocarlo.</li>\n<li>Olvidar la red de datos: un buen cableado de red y puntos de acceso bien situados son parte de la instalación.</li>\n</ul>\n<h2>Cómo lo hacemos en ALKO</h2>\n<p>Proyectamos electricidad, domótica, climatización y energía como una sola instalación, la ejecutamos con nuestro equipo y la dejamos programada y documentada. El cliente recibe una casa que funciona desde el primer día y que puede ampliarse sin abrir paredes.</p>",
    image: "/proceso-instalaciones.jpg",
    date: "2026-10-23",
  },
  {
    id: "art-7",
    slug: "construir-una-piscina-en-enero",
    title: "Construir una piscina en enero: por qué el invierno es el mejor momento para empezar",
    category: "Estructuras",
    excerpt: "Quien empieza la piscina en primavera suele estrenarla a finales de verano. Licencia, excavación, vaso, instalaciones y acabados: cómo se organiza la obra para que esté lista en junio.",
    content: "<p>La mayoría de las personas piensan en la piscina cuando llega el calor. Es justo el peor momento para empezar: las empresas tienen la agenda llena, los permisos tardan y la obra se come el verano. Si se quiere bañarse en junio, la decisión se toma en otoño y la obra arranca en enero.</p>\n<h2>Por qué empezar en invierno</h2>\n<ul>\n<li><strong>Plazos de licencia.</strong> En la mayoría de los municipios de Madrid una piscina necesita licencia o declaración responsable, con proyecto técnico. Tramitarla lleva semanas o meses.</li>\n<li><strong>Disponibilidad.</strong> En invierno hay menos demanda y es más fácil cerrar un calendario y conseguir los equipos y materiales a tiempo.</li>\n<li><strong>Jardín.</strong> La obra con maquinaria daña el césped y las plantas. Hacerla en reposo vegetativo permite replantar en primavera.</li>\n<li><strong>Margen para imprevistos.</strong> Lluvia, terreno rocoso o agua freática: con la obra empezada en enero, un retraso no compromete el verano.</li>\n</ul>\n<h2>Las fases de la obra</h2>\n<ol>\n<li><strong>Proyecto y licencia.</strong> Ubicación, dimensiones, distancias a linderos, sistema constructivo y cálculo de la depuración.</li>\n<li><strong>Replanteo y excavación.</strong> Marcado del vaso, acceso de maquinaria y retirada de tierras.</li>\n<li><strong>Estructura del vaso.</strong> Armado de acero y hormigón proyectado, el sistema más habitual por su resistencia y libertad de formas.</li>\n<li><strong>Instalaciones.</strong> Tuberías de impulsión y retorno, sumideros, skimmers, iluminación y conexión al cuarto técnico.</li>\n<li><strong>Impermeabilización y revestimiento.</strong> Gresite, porcelánico, piedra o lámina armada sobre un vaso estanco.</li>\n<li><strong>Coronación y entorno.</strong> Piedra de borde, playa, tarima o pavimento exterior antideslizante.</li>\n<li><strong>Llenado y puesta en marcha.</strong> Prueba de estanqueidad, equilibrado del agua y formación sobre el mantenimiento.</li>\n</ol>\n<p>Una piscina de obra de tamaño medio suele necesitar entre dos y tres meses de ejecución, a los que hay que sumar la tramitación previa.</p>\n<blockquote>El hormigón no se apresura: respetar los tiempos de curado del vaso es lo que garantiza que no aparezcan fisuras ni fugas años después.</blockquote>\n<h2>Decisiones que hay que tomar antes</h2>\n<table>\n<thead><tr><th>Decisión</th><th>Opciones y criterio</th></tr></thead>\n<tbody>\n<tr><td>Tipo de vaso</td><td>Skimmer, más económico, o desbordante, con lámina de agua a ras y vaso de compensación</td></tr>\n<tr><td>Tratamiento del agua</td><td>Cloro convencional o electrólisis salina, más cómoda y suave con la piel</td></tr>\n<tr><td>Revestimiento</td><td>Gresite, porcelánico de exterior, piedra natural o lámina armada</td></tr>\n<tr><td>Climatización</td><td>Bomba de calor para alargar la temporada; con cubierta, mucho más eficiente</td></tr>\n<tr><td>Seguridad</td><td>Cubierta, vallado o alarma, especialmente con niños</td></tr>\n</tbody>\n</table>\n<h2>Lo que suele olvidarse</h2>\n<ul>\n<li><strong>El cuarto técnico.</strong> Depuradora, filtro y cuadro necesitan un espacio ventilado, accesible y cerca del vaso.</li>\n<li><strong>La potencia eléctrica.</strong> Bomba, iluminación y climatización pueden exigir ampliar el suministro.</li>\n<li><strong>El drenaje.</strong> Hay que prever dónde se vacía la piscina y cómo se evacua el agua de lluvia de la playa.</li>\n<li><strong>La orientación.</strong> Una piscina que recibe sol buena parte del día se calienta sola y prolonga la temporada.</li>\n<li><strong>El entorno.</strong> Iluminación del jardín, duchas y zona de sombra se proyectan a la vez, no después.</li>\n</ul>\n<h2>Calendario orientativo</h2>\n<p>Para estrenarla a principios de verano, un calendario razonable es: proyecto y solicitud de licencia en otoño, inicio de obra en enero o febrero, estructura e instalaciones hasta marzo, revestimientos y entorno en abril y mayo, y llenado y puesta a punto antes de junio.</p>\n<h2>Cómo lo hacemos en ALKO</h2>\n<p>Redactamos el proyecto, gestionamos la licencia y ejecutamos la piscina completa con su entorno: estructura, instalaciones, revestimiento, jardín y electricidad exterior, con un único responsable y un calendario cerrado.</p>",
    image: "/el-viso.jpg",
    date: "2026-10-19",
  },
  {
    id: "art-8",
    slug: "carpinteria-a-medida",
    title: "Carpintería a medida: armarios, puertas y revestimientos que se diseñan con la casa",
    category: "Materiales",
    excerpt: "La carpintería interior a medida aprovecha cada centímetro y da coherencia a toda la vivienda. Materiales, herrajes, plazos de fabricación y cómo se coordina con el resto de la obra.",
    content: "<p>Pocas partidas cambian tanto la percepción de una vivienda como la carpintería interior. Armarios que llegan del suelo al techo sin huecos, puertas enrasadas con la pared, revestimientos que esconden almacenaje o una escalera de madera que es el centro de la casa. Todo eso solo se consigue a medida, y solo sale bien si se diseña desde el proyecto.</p>\n<h2>Qué incluye la carpintería a medida</h2>\n<ul>\n<li><strong>Armarios y vestidores.</strong> Interiores distribuidos según lo que se va a guardar, con frentes continuos y aprovechamiento de rincones y bajo escaleras.</li>\n<li><strong>Puertas de paso.</strong> Abatibles, correderas empotradas o pivotantes, a techo y con marcos ocultos.</li>\n<li><strong>Revestimientos de pared.</strong> Paneles de madera, lamas o boiseries que integran puertas ocultas, televisión o almacenaje.</li>\n<li><strong>Mobiliario fijo.</strong> Librerías, bancos, cabeceros, muebles de baño y zonas de trabajo.</li>\n<li><strong>Escaleras y barandillas.</strong> Peldaños de madera maciza, volados o sobre zanca, combinados con vidrio o acero.</li>\n</ul>\n<h2>Materiales: cada uno en su sitio</h2>\n<table>\n<thead><tr><th>Material</th><th>Uso recomendado</th></tr></thead>\n<tbody>\n<tr><td>Madera maciza</td><td>Escaleras, encimeras y piezas vistas donde se aprecia la veta y el canto</td></tr>\n<tr><td>Tablero chapado en madera natural</td><td>Frentes de armario y revestimientos: aspecto de madera con estabilidad dimensional</td></tr>\n<tr><td>MDF lacado</td><td>Frentes lisos de cualquier color y puertas enrasadas</td></tr>\n<tr><td>Tablero hidrófugo</td><td>Baños, cocinas y zonas con humedad</td></tr>\n<tr><td>Laminados de alta presión</td><td>Interiores de armario y superficies de uso intensivo</td></tr>\n</tbody>\n</table>\n<h2>Los herrajes marcan la diferencia</h2>\n<p>Un armario bien diseñado con herrajes mediocres se nota a los dos años. Bisagras con cierre amortiguado, guías de extracción total, sistemas push sin tiradores y correderas de calidad son parte de la inversión, no un extra. En puertas a techo, las bisagras ocultas regulables y los marcos enrasados permiten que la puerta desaparezca en la pared.</p>\n<blockquote>La carpintería a medida no se elige al final de la obra: condiciona tabiques, instalaciones e iluminación, y por eso se diseña con ellos.</blockquote>\n<h2>Cómo se coordina con la obra</h2>\n<ol>\n<li><strong>Diseño en proyecto.</strong> Se definen alzados, materiales y herrajes junto con la distribución.</li>\n<li><strong>Preinstalaciones.</strong> Iluminación interior de armarios, enchufes en muebles o televisión empotrada se dejan previstos en la instalación eléctrica.</li>\n<li><strong>Toma de medidas en obra.</strong> Con tabiques, yesos y pavimentos terminados, nunca sobre plano.</li>\n<li><strong>Fabricación en taller.</strong> Suele requerir entre cuatro y ocho semanas según la complejidad, y debe encajar en el calendario de obra.</li>\n<li><strong>Montaje y ajuste.</strong> Al final, tras la pintura, para proteger los acabados.</li>\n</ol>\n<h2>Ventajas frente al mueble de serie</h2>\n<ul>\n<li>Aprovechamiento total del espacio, sin huecos de relleno ni remates.</li>\n<li>Continuidad de materiales en toda la vivienda: puertas, armarios y revestimientos con el mismo acabado.</li>\n<li>Soluciones para techos inclinados, pilares, esquinas y alturas no estándar.</li>\n<li>Calidad de fabricación y durabilidad muy superiores.</li>\n</ul>\n<h2>Errores frecuentes</h2>\n<ul>\n<li>Medir antes de terminar los paramentos, con el resultado de piezas que no encajan.</li>\n<li>Olvidar ventilación en armarios de zonas húmedas o con equipos.</li>\n<li>No prever la iluminación interior y tener que añadirla con soluciones vistas.</li>\n<li>Elegir el acabado con una muestra pequeña sin verla junto al pavimento real.</li>\n</ul>\n<h2>Cómo la trabajamos en ALKO</h2>\n<p>Diseñamos la carpintería dentro del proyecto, coordinamos sus preinstalaciones con el resto de gremios y la fabricamos con talleres de confianza. El montaje se programa al final de la obra para entregar cada pieza ajustada y protegida.</p>",
    image: "/slide2.jpg",
    date: "2026-10-09",
  },
  {
    id: "art-9",
    slug: "climatizacion-industrial",
    title: "Climatización industrial: cómo elegir el sistema para naves, almacenes y espacios de gran volumen",
    category: "Instalaciones",
    excerpt: "En una nave el reto no es solo enfriar o calentar: es hacerlo en grandes alturas, con puertas abiertas, cargas internas y consumo controlado. Sistemas, criterios de diseño y errores que encarecen la explotación.",
    content: "<p>Climatizar una nave industrial, un almacén logístico o un taller no tiene nada que ver con climatizar una vivienda o una oficina. Hay alturas de ocho o diez metros, muelles de carga abiertos durante horas, maquinaria que genera calor y personas trabajando en zonas concretas. Elegir mal el sistema se traduce en facturas eléctricas desproporcionadas y en un confort que no llega a los puestos de trabajo.</p>\n<h2>Qué condiciona el diseño</h2>\n<ul>\n<li><strong>Volumen y altura.</strong> El aire caliente se acumula bajo cubierta y el frío se queda abajo: la estratificación es el principal enemigo de la eficiencia.</li>\n<li><strong>Envolvente.</strong> Cubiertas y fachadas de panel sándwich con poco aislamiento, lucernarios y puertas seccionales disparan la demanda.</li>\n<li><strong>Cargas internas.</strong> Maquinaria, iluminación, carretillas y procesos aportan calor de forma continua.</li>\n<li><strong>Uso y ocupación.</strong> No es lo mismo un almacén con pocos operarios que una línea de producción o una zona de atención al público.</li>\n<li><strong>Requisitos de producto.</strong> Alimentación, farmacia o electrónica pueden exigir temperatura y humedad controladas.</li>\n</ul>\n<h2>Sistemas más habituales</h2>\n<table>\n<thead><tr><th>Sistema</th><th>Cuándo conviene</th></tr></thead>\n<tbody>\n<tr><td>Rooftop</td><td>Equipos compactos en cubierta para naves con conductos; climatizan y renuevan aire</td></tr>\n<tr><td>Enfriamiento evaporativo</td><td>Talleres y naves con puertas abiertas: muy bajo consumo, eficaz en clima seco como el de Madrid</td></tr>\n<tr><td>Calefacción por radiación</td><td>Paneles o tubos radiantes que calientan personas y superficies, no todo el volumen de aire</td></tr>\n<tr><td>Bomba de calor VRF o enfriadora</td><td>Zonas de oficinas, laboratorios o almacenes con temperatura controlada</td></tr>\n<tr><td>Desestratificadores</td><td>Complemento en naves altas para devolver al suelo el aire caliente acumulado</td></tr>\n</tbody>\n</table>\n<blockquote>En una nave no hay que climatizar el aire bajo la cubierta, sino los dos o tres metros donde trabaja la gente.</blockquote>\n<h2>Climatizar por zonas</h2>\n<p>La estrategia más eficiente suele ser separar la nave en zonas con exigencias distintas: oficinas y vestuarios con un sistema de confort convencional, puestos de trabajo con climatización localizada, almacén con control mínimo de temperatura y muelles protegidos con abrigos y cortinas de aire. Tratar todo el volumen por igual es la forma más cara de hacerlo.</p>\n<h2>Ventilación y calidad del aire</h2>\n<p>La normativa exige un caudal mínimo de aire exterior según la ocupación y la actividad. En grandes espacios, la recuperación de calor del aire de extracción reduce mucho la energía necesaria para tratar ese aire nuevo. En procesos con polvo, humos o vapores, la extracción localizada en origen es prioritaria frente a la ventilación general.</p>\n<h2>Cómo se proyecta</h2>\n<ol>\n<li>Auditoría de la envolvente y de las cargas internas reales.</li>\n<li>Definición de zonas, horarios y condiciones interiores por uso.</li>\n<li>Cálculo de cargas térmicas y selección del sistema para cada zona.</li>\n<li>Estudio de mejoras de envolvente que reduzcan la potencia necesaria, como aislamiento de cubierta o abrigos de muelle.</li>\n<li>Integración con el control centralizado para programar horarios, consignas y alarmas.</li>\n<li>Ejecución por fases para no detener la actividad, puesta en marcha y mantenimiento preventivo.</li>\n</ol>\n<h2>Errores que encarecen la explotación</h2>\n<ul>\n<li>Sobredimensionar los equipos «por si acaso»: más inversión, más consumo y peor regulación.</li>\n<li>Impulsar el aire desde la cubierta sin desestratificación, de modo que nunca llega al suelo.</li>\n<li>Ignorar las infiltraciones por puertas y muelles, que pueden ser la mayor carga del edificio.</li>\n<li>No prever el acceso para mantenimiento de equipos en cubierta o en altura.</li>\n<li>Prescindir del control centralizado y dejar la instalación funcionando fuera de horario.</li>\n</ul>\n<h2>Cómo lo hacemos en ALKO</h2>\n<p>Estudiamos el uso real de la nave, proyectamos la climatización por zonas junto con las mejoras de envolvente que tengan sentido y ejecutamos la instalación coordinada con la obra civil y eléctrica, por fases cuando la actividad no puede parar.</p>",
    image: "/proceso-construccion.jpg",
    date: "2026-10-05",
  },
  {
    id: "art-1",
    slug: "como-planificar-una-reforma-integral-sin-desviaciones",
    title: "Cómo planificar una reforma integral sin desviaciones de plazo ni presupuesto",
    category: "Metodología",
    excerpt: "Proyecto ejecutivo completo, presupuesto por partidas, calendario por fases y cambios siempre por escrito: el método para que la obra termine cuando y como se acordó.",
    content: "<p>Una reforma integral se gana o se pierde antes de que entre el primer operario. Casi todas las desviaciones de plazo y de presupuesto que vemos en obras ajenas tienen el mismo origen: se empezó a construir con decisiones pendientes. Planificar bien no es hacer un calendario bonito, es cerrar el proyecto, medir lo que se va a ejecutar y fijar quién decide qué y cuándo.</p>\n<h2>Por qué se desvían las reformas</h2>\n<p>Cuando una obra se retrasa o se encarece, rara vez es por mala suerte. Las causas se repiten con una regularidad casi estadística:</p>\n<ul>\n<li><strong>Proyecto incompleto.</strong> Se presupuesta con planos de distribución, pero sin definir instalaciones, carpinterías ni acabados. Cada indefinición se convierte después en una partida nueva.</li>\n<li><strong>Mediciones a ojo.</strong> Un presupuesto con partidas alzadas («fontanería completa», «electricidad de la vivienda») no permite comparar ofertas ni controlar lo que se paga.</li>\n<li><strong>Decisiones tardías.</strong> Elegir el pavimento cuando ya está hecha la solera o el sanitario cuando el alicatado está terminado obliga a deshacer trabajo.</li>\n<li><strong>Gremios descoordinados.</strong> Si el electricista, el fontanero y el carpintero no comparten un mismo plan, se pisan, esperan unos a otros o rehacen lo que hizo el anterior.</li>\n<li><strong>Sorpresas ocultas sin margen.</strong> En edificios con años, al abrir tabiques y suelos aparecen bajantes, vigas o instalaciones que no estaban en ningún plano.</li>\n</ul>\n<h2>Antes de pedir presupuesto: el proyecto ejecutivo</h2>\n<p>El documento que protege tu inversión es el proyecto ejecutivo, no el presupuesto. Debe incluir, como mínimo, planos de estado actual y reformado, esquemas de electricidad, fontanería, saneamiento y climatización, memoria de calidades con marcas y modelos, y un mapa de acabados por estancia.</p>\n<p>Con ese nivel de definición, cualquier constructora puede ofertar exactamente lo mismo, y las diferencias de precio pasan a explicarse por organización y márgenes, no por lo que cada una ha supuesto que querías.</p>\n<blockquote>Cada decisión que se deja para la obra se paga dos veces: en dinero y en días.</blockquote>\n<h2>Un presupuesto que se pueda controlar</h2>\n<p>Un buen presupuesto se lee como una lista de la compra: capítulos, partidas, unidades, mediciones y precio unitario. Así se sabe qué se ha contratado, se puede certificar lo ejecutado cada mes y cualquier cambio se valora con los mismos precios.</p>\n<table>\n<thead><tr><th>Capítulo</th><th>Qué debe detallar</th></tr></thead>\n<tbody>\n<tr><td>Demoliciones</td><td>Metros de tabique, suelos y alicatados que se retiran, y la gestión de residuos</td></tr>\n<tr><td>Albañilería</td><td>Tabiquería nueva por tipo, recrecidos, ayudas a instalaciones</td></tr>\n<tr><td>Instalaciones</td><td>Número de puntos de luz y enchufes, tomas de agua, máquinas y su potencia</td></tr>\n<tr><td>Carpinterías</td><td>Cada hueco con su medida, material, vidrio y herrajes</td></tr>\n<tr><td>Acabados</td><td>Metros de cada pavimento y revestimiento con su referencia</td></tr>\n</tbody>\n</table>\n<p>Conviene reservar además una partida de imprevistos, entre un 5 y un 10 % según la antigüedad del edificio, que solo se utiliza con aprobación expresa del cliente.</p>\n<h2>Plazos realistas: el calendario por fases</h2>\n<p>El calendario de obra no es una fecha de fin, es una secuencia de fases que dependen unas de otras. En una vivienda tipo, el orden suele ser este:</p>\n<ol>\n<li>Demoliciones y desescombro.</li>\n<li>Replanteo de la nueva distribución y tabiquería.</li>\n<li>Instalaciones empotradas: electricidad, fontanería, saneamiento y conductos.</li>\n<li>Recrecidos, soleras y yesos.</li>\n<li>Alicatados, pavimentos y falsos techos.</li>\n<li>Carpinterías, pintura, sanitarios y mecanismos.</li>\n<li>Limpieza, pruebas y repaso final.</li>\n</ol>\n<p>Hay elementos con plazos de fabricación largos, como las carpinterías exteriores, la cocina o algunas piezas cerámicas. Deben pedirse en cuanto se aprueba el proyecto, no cuando llega su fase, porque si no la obra se para esperando material.</p>\n<h2>Durante la obra: control semanal y cambios por escrito</h2>\n<p>Una obra bien llevada tiene una reunión semanal con un responsable único, que revisa el avance frente al calendario, las decisiones pendientes y los pedidos en curso. Todo cambio se pide, se valora y se aprueba por escrito antes de ejecutarse, con su efecto en coste y plazo.</p>\n<p>Este método no elimina los imprevistos, pero los convierte en decisiones informadas en lugar de facturas inesperadas al final.</p>\n<h2>Qué puedes hacer tú</h2>\n<ul>\n<li>Exige un proyecto con instalaciones y acabados definidos antes de comparar precios.</li>\n<li>Compara presupuestos partida a partida, no por el importe total.</li>\n<li>Cierra todas las elecciones de materiales antes de empezar.</li>\n<li>Pide un calendario por fases y un único interlocutor técnico.</li>\n<li>No aceptes cambios de palabra: todos por escrito y valorados.</li>\n</ul>\n<p>En ALKO trabajamos así en cada reforma: proyecto cerrado, presupuesto por partidas y un arquitecto técnico al frente de la obra de principio a fin.</p>",
    image: "/proceso-coordinacion.jpg",
    date: "2026-10-28",
  },
  {
    id: "art-2",
    slug: "reforma-de-oficinas-sin-parar-la-actividad",
    title: "Reforma de oficinas sin parar la actividad: cómo se organiza una obra por fases",
    category: "Oficinas",
    excerpt: "Plano de fases, traslados internos, cerramientos de obra y trabajos ruidosos fuera de horario: así se renueva una sede mientras el equipo sigue trabajando.",
    content: "<p>Reformar una oficina no tiene por qué significar cerrarla. Con una obra organizada por fases, la mayoría de empresas pueden seguir trabajando mientras se renuevan sus espacios. La clave está en planificar los traslados internos, separar físicamente la zona de obra y concentrar los trabajos más molestos en los horarios en que la oficina está vacía.</p>\n<h2>¿Cerrar o seguir trabajando?</h2>\n<p>La primera decisión es de negocio, no de obra. Cerrar la oficina acorta el plazo y abarata los trabajos, pero obliga a buscar un espacio temporal o a pasar al teletrabajo. Mantener la actividad alarga la obra y exige más coordinación, a cambio de no interrumpir la operativa.</p>\n<p>Como orientación, cerrar compensa en superficies pequeñas o en reformas muy profundas, con cambios de instalaciones generales o de fachada. Trabajar por fases suele ser la mejor opción en plantas grandes que se pueden dividir y en empresas con atención presencial o equipos que no pueden trasladarse.</p>\n<h2>Cómo se divide una oficina en fases</h2>\n<p>El punto de partida es un plano de fases: la planta se divide en zonas que se reforman de una en una, mientras el personal ocupa el resto. Cada fase tiene su fecha de inicio, su fecha de entrega y un plan de traslado de puestos.</p>\n<ol>\n<li><strong>Fase cero.</strong> Se habilitan puestos provisionales y se trasladan los equipos de la primera zona.</li>\n<li><strong>Fases de obra.</strong> Se reforma una zona, se entrega, se traslada el personal de la siguiente y se repite.</li>\n<li><strong>Zonas comunes al final.</strong> Recepción, aseos y office se reforman cuando el resto está terminado, o en horario nocturno si no hay alternativa.</li>\n</ol>\n<p>Las instalaciones generales, como el cuadro eléctrico, la climatización central o el rack de datos, condicionan el orden. Hay que prever cortes programados y circuitos provisionales para que ninguna zona en uso se quede sin servicio.</p>\n<h2>Ruido, polvo y seguridad</h2>\n<p>Convivir con una obra es posible si se controla lo que más molesta:</p>\n<ul>\n<li><strong>Cerramientos de obra</strong> de suelo a techo, con lámina de polietileno y puertas con cierre, para aislar polvo y ruido.</li>\n<li><strong>Trabajos ruidosos fuera de horario:</strong> demoliciones, rozas y taladros se concentran a primera hora, por la tarde o en fin de semana.</li>\n<li><strong>Accesos separados</strong> para operarios y materiales, con un recorrido que no cruce las zonas de trabajo.</li>\n<li><strong>Extracción y limpieza diaria</strong> de la zona de obra y de los recorridos comunes.</li>\n<li><strong>Señalización y vías de evacuación</strong> siempre libres, revisadas en cada fase.</li>\n</ul>\n<blockquote>La mejor obra en una oficina ocupada es la que el equipo apenas nota.</blockquote>\n<h2>Instalaciones que no se pueden improvisar</h2>\n<p>Una oficina moderna depende de sus instalaciones tanto como de su distribución. Antes de empezar conviene definir:</p>\n<table>\n<thead><tr><th>Instalación</th><th>Qué decidir</th></tr></thead>\n<tbody>\n<tr><td>Climatización</td><td>Zonificación por áreas, salas de reunión con control propio y renovación de aire</td></tr>\n<tr><td>Iluminación</td><td>Nivel de luz por puesto, regulación según luz natural y detección de presencia</td></tr>\n<tr><td>Datos</td><td>Puntos por puesto, cobertura wifi, ubicación del rack y canalizaciones</td></tr>\n<tr><td>Acústica</td><td>Absorción en zonas abiertas, aislamiento en salas y despachos</td></tr>\n<tr><td>Electricidad</td><td>Circuitos por zona, alimentación en mesas y salas, sistema de alimentación ininterrumpida</td></tr>\n</tbody>\n</table>\n<h2>El calendario y la mudanza interna</h2>\n<p>En una obra por fases, el calendario es tan importante para la empresa como para la constructora. Recursos humanos y sistemas tienen que saber con antelación qué equipos se mueven, cuándo y adónde, para preparar los puestos, las conexiones y la comunicación interna.</p>\n<p>Por eso recomendamos fijar las fechas de cada traslado al aprobar el proyecto y no moverlas salvo causa mayor. Un retraso en una fase desplaza a todas las siguientes y a todas las personas afectadas.</p>\n<h2>Claves para una obra sin sobresaltos</h2>\n<ul>\n<li>Decide al principio si se cierra o se trabaja por fases.</li>\n<li>Exige un plano de fases con fechas y un plan de traslados.</li>\n<li>Asegura cerramientos de obra y trabajos ruidosos fuera de horario.</li>\n<li>Define climatización, datos e iluminación antes de empezar.</li>\n<li>Nombra un interlocutor interno que coordine con la dirección de obra.</li>\n</ul>\n<p>En ALKO hemos reformado sedes corporativas manteniendo la actividad con este método: una sola dirección técnica que coordina obra, instalaciones y calendario de la empresa.</p>",
    image: "/oficinas.jpg",
    date: "2026-10-14",
  },
  {
    id: "art-3",
    slug: "acabados-para-hosteleria-y-retail",
    title: "Acabados para hostelería y retail: materiales que resisten el uso intensivo",
    category: "Materiales",
    excerpt: "Pavimentos, paredes y superficies de trabajo para hoteles, restaurantes y tiendas: cómo elegir materiales que aguanten el tránsito, la limpieza diaria y el paso de los años.",
    content: "<p>En un hotel, un restaurante o una tienda, los acabados trabajan mucho más que en una vivienda. Reciben miles de pasos al día, limpiezas intensivas, golpes de carros y maletas, humedad y grasa. Elegirlos solo por estética es la forma más rápida de que un local recién abierto parezca envejecido en dos temporadas.</p>\n<h2>Qué significa uso intensivo</h2>\n<p>Antes de hablar de materiales conviene concretar a qué se va a enfrentar cada superficie. No es lo mismo el suelo de la entrada de un hotel que el de una habitación, ni la barra de un bar que el mostrador de una tienda de moda. Para cada zona hay que preguntarse:</p>\n<ul>\n<li>Cuánto tránsito recibe y de qué tipo: personas, carros, mobiliario que se arrastra.</li>\n<li>Con qué productos y con qué frecuencia se limpia.</li>\n<li>Si está expuesta a agua, grasa, calor o luz solar directa.</li>\n<li>Qué pasa si una pieza se rompe: si se puede sustituir sola o hay que levantar toda la superficie.</li>\n</ul>\n<h2>Pavimentos: resistencia y mantenimiento</h2>\n<p>El pavimento es la decisión más importante, porque es la superficie que más sufre y la más difícil de cambiar con el local abierto.</p>\n<table>\n<thead><tr><th>Material</th><th>Dónde funciona</th><th>A tener en cuenta</th></tr></thead>\n<tbody>\n<tr><td>Porcelánico técnico</td><td>Accesos, comedores, cocinas, aseos</td><td>Elegir la clase de resbaladicidad adecuada a cada zona</td></tr>\n<tr><td>Piedra natural</td><td>Recepciones y zonas nobles</td><td>Necesita tratamiento y mantenimiento periódico</td></tr>\n<tr><td>Vinílico de alto tránsito</td><td>Habitaciones, tiendas, pasillos</td><td>Buena acústica; conviene que sea de gama comercial</td></tr>\n<tr><td>Madera</td><td>Zonas de estancia con tránsito moderado</td><td>Mejor con capa de uso gruesa para poder lijarla</td></tr>\n<tr><td>Microcemento</td><td>Retail y restauración de imagen continua</td><td>Depende mucho de la ejecución y del sellado</td></tr>\n</tbody>\n</table>\n<p>En zonas húmedas o con riesgo de derrame, la resistencia al deslizamiento no es opcional: el Código Técnico de la Edificación exige una clase mínima según el uso y la ubicación del pavimento.</p>\n<h2>Paredes y protecciones</h2>\n<p>Las paredes de un local sufren sobre todo a la altura de los golpes: entre el suelo y un metro y medio. Algunas soluciones que alargan mucho su vida útil:</p>\n<ul>\n<li><strong>Zócalos altos</strong> de madera, metal o porcelánico en pasillos y zonas de carga.</li>\n<li><strong>Cantoneras</strong> en esquinas expuestas, integradas en el diseño.</li>\n<li><strong>Pinturas lavables</strong> de alta resistencia al frote en lugar de pinturas plásticas convencionales.</li>\n<li><strong>Revestimientos vinílicos o laminados</strong> en zonas de servicio y office.</li>\n</ul>\n<blockquote>El acabado más caro no es el de mayor precio por metro, sino el que hay que sustituir antes de tiempo.</blockquote>\n<h2>Mostradores, barras y superficies de trabajo</h2>\n<p>Las encimeras de barras, mostradores y cocinas reciben calor, cortes, manchas y productos de limpieza agresivos. Los compactos de cuarzo, los porcelánicos de gran formato y el acero inoxidable son los más fiables en restauración. En retail, donde manda la imagen, se pueden usar maderas o lacados siempre que la superficie de apoyo esté protegida con un material más duro.</p>\n<h2>Pensar en el mantenimiento desde el proyecto</h2>\n<p>Un acabado resistente puede fallar si nadie ha previsto cómo se mantiene. Desde el proyecto conviene:</p>\n<ol>\n<li>Pedir a cada fabricante las instrucciones de limpieza y compatibilidad con productos químicos.</li>\n<li>Reservar material de reposición del mismo lote para futuras reparaciones.</li>\n<li>Diseñar despieces que permitan cambiar piezas sueltas.</li>\n<li>Entregar al cliente un manual de uso y mantenimiento de cada superficie.</li>\n</ol>\n<h2>En resumen</h2>\n<ul>\n<li>Define el uso real de cada zona antes de elegir el material.</li>\n<li>Prioriza el pavimento: es lo que más sufre y lo más difícil de cambiar.</li>\n<li>Protege paredes y esquinas a la altura de los golpes.</li>\n<li>Elige superficies de trabajo pensando en el calor, los cortes y la limpieza.</li>\n<li>Deja previsto el mantenimiento y material de reposición.</li>\n</ul>\n<p>En ALKO acompañamos a operadores de hostelería y retail en la selección de materiales con este criterio: que el espacio siga igual de bien el día de la apertura y años después.</p>",
    image: "/sector-hospitality.jpg",
    date: "2026-09-30",
  },
];

export const DEFAULT_GUIDES: Guide[] = [
  {
    id: "g-1",
    slug: "guia-reforma-integral",
    numero: "01",
    title: "Guía completa para afrontar una reforma integral",
    tema: "PLANIFICACIÓN",
    descripcion: "Paso a paso, de la definición de necesidades a la entrega de llaves: presupuesto, proyecto, permisos en Madrid, contrato, orden de los trabajos, recepción y garantías.",
    lectura: "8 min",
    imagen: "/p2.jpg",
    content: "<p>Una reforma integral es la obra más importante que se hace en una vivienda después de comprarla. Bien planteada, se termina en plazo, dentro del presupuesto y con una casa que funciona durante décadas. Mal planteada, se alarga meses y acaba costando bastante más de lo previsto. Esta guía recorre el proceso completo, de la primera idea a la entrega de llaves, con lo que conviene decidir en cada fase y los errores que vemos repetirse.</p>\n<h2>Qué es una reforma integral</h2>\n<p>Hablamos de reforma integral cuando se renueva la vivienda casi por completo: distribución, instalaciones de electricidad, fontanería y climatización, cocina, baños, pavimentos, carpinterías y acabados. No es una suma de pequeñas obras, sino un proyecto único en el que cada decisión afecta a las demás. El trazado de una tubería condiciona dónde va un mueble; la altura del suelo radiante condiciona las puertas; el pavimento elegido condiciona la potencia de la climatización.</p>\n<p>Por eso la regla de oro es sencilla: <strong>todo lo que se decide antes de empezar, se ahorra durante la obra.</strong> Un cambio sobre plano cuesta un trazo; el mismo cambio con el tabique levantado cuesta demolición, material y días.</p>\n<blockquote>La mayor parte de los sobrecostes de una reforma no nacen en la obra, sino en decisiones que no se tomaron a tiempo.</blockquote>\n<h2>Fase 1. Definir necesidades y presupuesto</h2>\n<p>Antes de hablar de materiales hay que hablar de cómo se vive la casa. Quién la habita, cómo se cocina, si se teletrabaja, cuántos baños hacen falta, qué espacio de almacenaje se echa en falta y qué se quiere conservar. Esa lista de necesidades es la base del proyecto y la mejor herramienta para comparar propuestas.</p>\n<p>Al mismo tiempo conviene fijar un presupuesto realista y, sobre todo, un margen. Recomendamos reservar entre un <strong>10 y un 15 % para imprevistos</strong>: en viviendas antiguas siempre aparece algo al abrir paredes y suelos. Como referencia, el reparto habitual de una reforma integral de piso es este:</p>\n<table>\n<thead><tr><th>Partida</th><th>Peso orientativo</th></tr></thead>\n<tbody>\n<tr><td>Demoliciones y albañilería</td><td>20–25 %</td></tr>\n<tr><td>Instalaciones (electricidad, fontanería, climatización)</td><td>20–25 %</td></tr>\n<tr><td>Cocina y baños (mobiliario, sanitarios, grifería)</td><td>20–25 %</td></tr>\n<tr><td>Pavimentos y revestimientos</td><td>10–15 %</td></tr>\n<tr><td>Carpintería interior y exterior</td><td>10–15 %</td></tr>\n<tr><td>Pintura, remates y limpieza</td><td>5–8 %</td></tr>\n</tbody>\n</table>\n<p>El peso de cada partida cambia mucho según el nivel de acabados. Lo importante es que el presupuesto se reparta con intención: es preferible una cocina sencilla con buenas instalaciones que lo contrario, porque las instalaciones quedan ocultas y cambiarlas después obliga a volver a abrir.</p>\n<h2>Fase 2. Conocer el estado real de la vivienda</h2>\n<p>Ningún proyecto serio empieza sin una visita técnica y una toma de datos precisa. En esa visita se mide la vivienda y se revisa lo que no se ve a simple vista:</p>\n<ul>\n<li><strong>Estructura.</strong> Muros de carga, vigas y forjados. Determina qué tabiques se pueden mover y cuáles necesitan refuerzo y cálculo.</li>\n<li><strong>Instalaciones existentes.</strong> Bajantes comunitarias, acometida eléctrica, contador de agua y salida de humos. Limitan dónde pueden ir cocina y baños.</li>\n<li><strong>Humedades y patologías.</strong> Filtraciones, condensaciones o grietas que hay que resolver antes de cerrar con acabados nuevos.</li>\n<li><strong>Materiales a retirar.</strong> En edificios anteriores a 2002 puede haber fibrocemento con amianto en bajantes o depósitos, que exige una empresa inscrita y un plan de trabajo específico.</li>\n<li><strong>Normas de la comunidad.</strong> Horarios de obra, uso del ascensor, protección de zonas comunes y condiciones para tocar fachada o elementos comunes.</li>\n</ul>\n<h2>Fase 3. Proyecto y diseño</h2>\n<p>Con las necesidades y el estado de la vivienda claros se desarrolla el proyecto. Para una reforma integral debería incluir, como mínimo:</p>\n<ol>\n<li>Planos del estado actual y del estado reformado, con cotas.</li>\n<li>Planos de instalaciones: electricidad (puntos de luz, enchufes, cuadro), fontanería y saneamiento, climatización y ventilación.</li>\n<li>Plano de techos con iluminación y registros.</li>\n<li>Memoria de calidades con marca, modelo o gama de cada material.</li>\n<li>Mediciones por partidas, que son la base del presupuesto.</li>\n<li>Imágenes o renders de cocina, baños y zonas principales si ayudan a decidir.</li>\n</ol>\n<p>Es el momento de cerrar las decisiones que más cambian la obra: distribución, ubicación de cocina y baños, sistema de climatización, tipo de pavimento y carpinterías. Elegir los acabados antes de empezar permite pedirlos con antelación y evita que la obra se pare esperando un material.</p>\n<h2>Fase 4. Permisos y comunidad</h2>\n<p>En Madrid, la mayoría de las reformas interiores de vivienda se tramitan mediante <strong>declaración responsable</strong> ante el Ayuntamiento, que permite empezar la obra al presentarla con la documentación técnica correspondiente. Las obras que afectan a la estructura, a la fachada o a elementos protegidos pueden requerir proyecto firmado por técnico competente y, en algunos casos, licencia. El tipo de trámite depende del alcance exacto de la obra, por lo que conviene confirmarlo durante el proyecto.</p>\n<p>Además del trámite municipal hay que contar con:</p>\n<ul>\n<li>Autorización de ocupación de vía pública si se instala contenedor o andamio en la calle.</li>\n<li>Comunicación a la comunidad de propietarios y, si se tocan elementos comunes, su acuerdo.</li>\n<li>Gestión de residuos de construcción a través de un gestor autorizado.</li>\n</ul>\n<h2>Fase 5. Comparar presupuestos y firmar el contrato</h2>\n<p>Comparar presupuestos solo tiene sentido si todos responden al mismo proyecto y a las mismas mediciones. Si cada empresa presupuesta su propia idea, el más barato suele ser el que menos incluye. Al revisar cada oferta, comprueba:</p>\n<ul>\n<li>Que las partidas estén desglosadas con unidades, mediciones y precio unitario.</li>\n<li>Qué materiales incluye cada partida y cuáles quedan fuera o a elegir.</li>\n<li>Si incluye licencias, contenedores, gestión de residuos, limpieza final y protección de zonas comunes.</li>\n<li>Si incluye los boletines y certificados de las instalaciones.</li>\n<li>El plazo de ejecución y el calendario de trabajos.</li>\n</ul>\n<p>El contrato debe recoger el alcance y el presupuesto aprobados, la forma de pago, el plazo con fecha de inicio y de fin, el procedimiento para los cambios y las garantías. Recomendamos que los pagos vayan ligados a <strong>hitos de obra terminados</strong>, no a fechas, y que la empresa acredite un seguro de responsabilidad civil en vigor.</p>\n<h2>Fase 6. Planificación y orden de los trabajos</h2>\n<p>Una reforma integral sigue un orden lógico: de lo grueso a lo fino y de lo oculto a lo visible. Para un piso de unos 90 m², los plazos orientativos son estos:</p>\n<table>\n<thead><tr><th>Fase</th><th>Trabajos</th><th>Duración orientativa</th></tr></thead>\n<tbody>\n<tr><td>Demoliciones</td><td>Retirada de tabiques, suelos, alicatados e instalaciones antiguas</td><td>1–2 semanas</td></tr>\n<tr><td>Albañilería</td><td>Nueva distribución, recrecidos, ayudas a instalaciones</td><td>2–3 semanas</td></tr>\n<tr><td>Instalaciones</td><td>Electricidad, fontanería, saneamiento, climatización y ventilación</td><td>2–3 semanas</td></tr>\n<tr><td>Cerramientos</td><td>Ventanas, aislamiento y falsos techos</td><td>1–2 semanas</td></tr>\n<tr><td>Revestimientos y pavimentos</td><td>Alicatados, solados, tarima o microcemento</td><td>2–3 semanas</td></tr>\n<tr><td>Carpintería y montaje</td><td>Puertas, armarios, cocina y sanitarios</td><td>1–2 semanas</td></tr>\n<tr><td>Pintura y remates</td><td>Pintura, mecanismos, iluminación, limpieza final</td><td>1–2 semanas</td></tr>\n</tbody>\n</table>\n<p>Varias fases se solapan, por lo que el plazo total habitual se sitúa entre <strong>10 y 14 semanas</strong>. Hay que sumar los plazos de entrega de los materiales que se fabrican a medida, como la cocina, las ventanas o la carpintería, que conviene encargar al inicio de la obra.</p>\n<h2>Fase 7. Durante la obra</h2>\n<p>Una obra bien dirigida no exige que el propietario esté encima a diario, pero sí que reciba información clara y a tiempo. Lo recomendable es:</p>\n<ul>\n<li>Un único responsable de obra que coordine a todos los oficios y sea el interlocutor del cliente.</li>\n<li>Visitas programadas en los momentos clave: replanteo de tabiques, instalaciones antes de cerrar, colocación de pavimentos y montaje de cocina.</li>\n<li>Fotografías de las instalaciones antes de cubrirlas, para saber siempre por dónde pasan tubos y cables.</li>\n<li>Cualquier cambio, por escrito y con su precio y su efecto en el plazo aprobados antes de ejecutarlo.</li>\n</ul>\n<p>Los cambios sobre la marcha son la primera causa de retrasos. No significa que no se puedan hacer, sino que deben valorarse antes de decidir.</p>\n<h2>Fase 8. Recepción de la obra y garantías</h2>\n<p>La obra no termina cuando se va el último operario, sino cuando se firma el acta de recepción. Antes de firmarla conviene revisar la vivienda estancia por estancia, con buena luz y con calma: acabados, juntas, puertas y ventanas, funcionamiento de grifos, desagües, enchufes, iluminación y climatización. Los defectos se anotan en el acta y se fija un plazo para corregirlos.</p>\n<p>En la entrega debes recibir:</p>\n<ul>\n<li>El certificado de la instalación eléctrica (boletín) y, si procede, el de gas y el de climatización.</li>\n<li>Los manuales y garantías de los equipos: caldera o aerotermia, electrodomésticos, ventanas.</li>\n<li>Los planos finales de instalaciones tal como se han ejecutado.</li>\n<li>Las condiciones de garantía de la obra, por escrito.</li>\n</ul>\n<p>Cuando la obra afecta a la estructura, la Ley de Ordenación de la Edificación fija plazos de responsabilidad de uno, tres y diez años según el tipo de defecto. En el resto de trabajos, las garantías de mano de obra y acabados deben constar en el contrato.</p>\n<h2>Errores frecuentes</h2>\n<ol>\n<li>Empezar la obra sin proyecto ni mediciones, con un presupuesto cerrado a ojo.</li>\n<li>No reservar margen para imprevistos en una vivienda antigua.</li>\n<li>Ahorrar en instalaciones para invertir en acabados.</li>\n<li>Elegir los materiales con la obra empezada y esperar semanas a que lleguen.</li>\n<li>Coordinar por separado a varios gremios sin un responsable único.</li>\n<li>Aceptar cambios de palabra, sin precio ni plazo por escrito.</li>\n<li>Firmar la recepción sin revisar ni anotar los defectos pendientes.</li>\n</ol>\n<h2>Recursos descargables</h2>\n<p>Hemos preparado tres documentos para acompañar esta guía:</p>\n<ul>\n<li><a href=\"/descargas/checklist-planificar-reforma.pdf\">Checklist para planificar la reforma</a>: todas las decisiones que conviene tomar antes de empezar.</li>\n<li><a href=\"/descargas/plantilla-comparar-presupuestos.pdf\">Plantilla para comparar presupuestos</a>: partida por partida, con lo que incluye y lo que no.</li>\n<li><a href=\"/descargas/ficha-calidades-acabados.pdf\">Ficha de calidades y acabados</a>: para dejar elegido cada material con marca y modelo.</li>\n</ul>\n<h2>Cómo lo hacemos en ALKO</h2>\n<p>En ALKO llevamos la reforma integral de principio a fin con un único responsable: visita técnica y toma de datos, proyecto con mediciones y memoria de calidades, tramitación de permisos, ejecución con equipos propios y coordinados, y entrega con toda la documentación. El presupuesto se cierra sobre el proyecto, los pagos van por hitos y los cambios se aprueban por escrito antes de hacerse. Si estás pensando en reformar, cuéntanos tu caso y te diremos cómo lo plantearíamos.</p>",
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
  smtp: {
    enabled: false,
    host: "smtp.hostinger.com",
    port: 465,
    user: "notificaciones@alkoreformas.com",
    password: "",
    from: '"ALKO Reformas" <notificaciones@alkoreformas.com>',
    to: "info@alkoreformas.com",
    secure: true,
  },
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
  procesoColHeading: "Una única dirección para todo el proyecto",
  procesoColText: "Un único equipo coordina construcción, instalaciones, compras y gestión técnica para mantener el proyecto bajo control.",
  fases: DEFAULT_FASES,

  serviciosTag: "SERVICIOS Y SECTORES",
  serviciosTitulo: "ESPECIALIDADES",
  serviciosDescripcion: "Actuamos de forma transversal en rehabilitación, reforma integral, obra nueva y gestión de instalaciones técnicas con un único responsable de proyecto.",

  workshopBadge: "START RESEARCH",
  workshopTitulo: "Soluciones arquitectónicas y técnicas con criterio constructivo.",
  workshopDescripcion: "Investigar, coordinar y ejecutar: cada detalle responde a una exigencia funcional, constructiva y estética.",
  workshopBotonTexto: "Ver Solución",
  workshopSlides: DEFAULT_SHOWCASE_SLIDES,

  experienciaImagen: "/90dias.jpg",
  experienciaBadges: ["Climatización", "Ventilación", "Red de Datos", "Acabados H2"],

  materialesTag: "ESPECIFICACIÓN TÉCNICA & CALIDAD",
  materialesTitulo: "Materiales y fabricantes",
  materialesDescripcion: "Soluciones y materiales seleccionados según las necesidades técnicas de cada proyecto.",

  articulosTag: "BIBLIOTECA TÉCNICA",
  articulosTitulo: "Journal",
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


export const DEFAULT_OFICINAS_METRICAS: import('./types').OficinasMetrica[] = [
  { valor: "0 días", label: "de interrupción en la actividad de la empresa" },
  { valor: "100%", label: "cumplimiento de cronogramas cerrados" },
  { valor: "1", label: "único interlocutor técnico para compras, diseño y obra" },
  { valor: "+15.000 m²", label: "de superficie de trabajo ejecutada en Madrid" },
];

export const DEFAULT_OFICINAS_CAPACIDADES: import('./types').OficinasCapacidad[] = [
  {
    codigo: "01",
    titulo: "Climatización VRF & IAQ",
    metrica: "VRF 3 tubos · Caudal IDA 2",
    resumen: "Sistemas zonificados con recuperación de calor, filtración F7/F9 y microdifusión lineal invisible.",
  },
  {
    codigo: "02",
    titulo: "Aislamiento Acústico",
    metrica: "Atenuación Rw 42–48 dB",
    resumen: "Mamparas modulares de doble vidrio laminado y puertas enrasadas con junta guillotina hermética.",
  },
  {
    codigo: "03",
    titulo: "Redes, CPD & Suelo Técnico",
    metrica: "Cat 6A / 7 · Carga 14 kN/m²",
    resumen: "Cableado estructurado certificado, salas técnicas climatizadas y suelo registrable encapsulado.",
  },
  {
    codigo: "04",
    titulo: "Iluminación Circadiana",
    metrica: "UGR < 19 · Protocolo DALI-2",
    resumen: "Luminarias de bajo deslumbramiento con regulación según el aporte solar y ritmo biológico.",
  },
  {
    codigo: "05",
    titulo: "Zonas Singulares & Lounge",
    metrica: "Diseño a medida · Piedra & Madera",
    resumen: "Recepciones representativas, phone booths insonorizados, offices de diseño y salas polivalentes.",
  },
  {
    codigo: "06",
    titulo: "Licencias & Sostenibilidad",
    metrica: "ECLU Madrid · BREEAM / WELL Ready",
    resumen: "Gestión completa de licencias de actividad ante el Ayuntamiento de Madrid y cumplimiento del CTE.",
  },
];

export const DEFAULT_OFICINAS_METODOLOGIA: import('./types').OficinasMetodologia[] = [
  {
    fase: "01",
    semanas: "Sem. 1–2",
    titulo: "Auditoría & BIM",
    resumen: "Revisión de instalaciones del edificio, levantamiento 3D y tramitación de licencias.",
  },
  {
    fase: "02",
    semanas: "Sem. 3–4",
    titulo: "Compras Críticas",
    resumen: "Adquisición anticipada de climatización, mamparas y luminarias para evitar paradas.",
  },
  {
    fase: "03",
    semanas: "Sem. 5–12",
    titulo: "Obra por Fases",
    resumen: "Intervenciones sectorizadas nocturnas o modulares sin afectar al equipo de la empresa.",
  },
  {
    fase: "04",
    semanas: "Sem. 13+",
    titulo: "Commissioning & Entrega",
    resumen: "Pruebas de equilibrado hidráulico, certificación de redes y entrega llave en mano.",
  },
];

export const DEFAULT_OFICINAS_PAGE_CONTENT: import('./types').OficinasPageContent = {
  headerBadge: "SECTOR TERCIARIO · OFICINAS CORPORATIVAS",
  headerTitulo: "Reformas Integrales de Oficinas en Madrid",
  headerDescripcion: "Espacios de trabajo diseñados para el rendimiento y la acústica, ejecutados sin interrumpir la operativa diaria de tu organización.",
  headerBgImage: "/sector-oficinas.jpg",

  metricasTag: "GARANTÍAS CONTRACTUALES",
  metricasTitulo: "Cifras que garantizan la viabilidad de la intervención",
  metricasDescripcion: "Asumimos penalizaciones por retraso en contrato. Cuando nos comprometemos con una fecha de entrega, la operativa de tu empresa no se detiene.",
  metricas: DEFAULT_OFICINAS_METRICAS,

  capacidadesTag: "INGENIERÍA APLICADA",
  capacidadesTitulo: "Capacidades técnicas en oficinas y sedes",
  capacidadesSubtitulo: "Instalaciones de alto rendimiento diseñadas por nuestro propio equipo de ingeniería.",
  capacidades: DEFAULT_OFICINAS_CAPACIDADES,

  metodologiaTag: "CRONOGRAMA DE EJECUCIÓN",
  metodologiaTitulo: "Cómo ejecutamos tu reforma de oficinas",
  metodologiaSubtitulo: "Metodología secuencial para cumplir plazos sin sorpresas de presupuesto.",
  metodologia: DEFAULT_OFICINAS_METODOLOGIA,
};


export const DEFAULT_ARTICULOS_PAGE_CONTENT: import('./types').ArticulosPageContent = {
  headerBadge: "JOURNAL",
  headerTitulo: "Criterio técnico,\npor escrito.",
  headerDescripcion: "Detalles constructivos, instalaciones y gestión de obra explicados por el equipo que los ejecuta cada día.",
  headerBgImage: "/proceso-instalaciones.jpg",
};

export const DEFAULT_GUIAS_PAGE_CONTENT: import('./types').GuiasPageContent = {
  headerBadge: "JOURNAL · GUÍAS",
  headerTitulo: "Guías",
  headerDescripcion: "Recorridos paso a paso por las decisiones clave de una obra: planificación, presupuesto, materiales y entrega.",
  headerBgImage: "/proceso-control.jpg",
};
