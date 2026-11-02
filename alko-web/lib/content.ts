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
];

/** Servicios anteriores que ahora forman parte de otro (los proyectos antiguos aún los usan). */
const SECTOR_ALIASES: Record<string, string> = {
  viviendas: "residencial",
  "reformas-integrales": "residencial",
};

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
  headerBadge: "CONOCIMIENTO · ARTÍCULOS",
  headerTitulo: "Criterio técnico,\npor escrito.",
  headerDescripcion: "Detalles constructivos, instalaciones y gestión de obra explicados por el equipo que los ejecuta cada día.",
  headerBgImage: "/proceso-instalaciones.jpg",
};

export const DEFAULT_GUIAS_PAGE_CONTENT: import('./types').GuiasPageContent = {
  headerBadge: "CONOCIMIENTO · GUÍAS",
  headerTitulo: "Guías",
  headerDescripcion: "Recorridos paso a paso por las decisiones clave de una obra: planificación, presupuesto, materiales y entrega.",
  headerBgImage: "/proceso-control.jpg",
};
