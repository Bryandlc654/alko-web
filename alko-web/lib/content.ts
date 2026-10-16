import type {
  Article,
  Fabricante,
  Fase,
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
    imagen: "/start-research-1.jpg",
    enlace: "/contacto",
    content:
      "<p>Transformación arquitectónica e infraestructural completa de una sede corporativa de dos plantas en Madrid, manteniendo la operatividad continua de la compañía durante toda la obra.</p><p>El proyecto integró áreas de trabajo abiertas, laboratorios analíticos, climatización VRF, renovación forzada de aire, cableado estructurado y acabados de especificación H2, todo con una única dirección facultativa.</p>",
  },
  {
    id: "p-2",
    slug: "oficinas-castellana",
    title: "REFORMA INTEGRAL DE OFICINAS EN MADRID",
    indice: "02",
    anio: "2024",
    ubicacion: "Paseo de la Castellana, Madrid",
    tipologia: "Reforma integral de oficinas",
    imagen: "/oficinas.jpg",
    enlace: "/contacto",
    content:
      "<p>Reforma integral de una planta corporativa de oficinas con redistribución de espacios, nuevas instalaciones de climatización y datos, y acabados de alta gama.</p><p>La coordinación de gremios y las compras anticipadas permitieron cumplir un cronograma cerrado sin afectar a la actividad de las plantas contiguas.</p>",
  },
  {
    id: "p-3",
    slug: "residencia-el-viso",
    title: "RESIDENCIA EL VISO",
    indice: "03",
    anio: "2023",
    ubicacion: "El Viso, Chamartín, Madrid",
    tipologia: "Reforma residencial",
    imagen: "/el-viso.jpg",
    enlace: "/contacto",
    content:
      "<p>Reforma integral de una vivienda unifamiliar en El Viso, con renovación completa de instalaciones, carpinterías minimalistas y materiales nobles seleccionados con los fabricantes.</p><p>El resultado combina confort, eficiencia energética y un control milimétrico de tolerancias y acabados.</p>",
  },
];

export const DEFAULT_SECTORS: Sector[] = [
  {
    id: "s-1",
    slug: "oficinas",
    numero: "01",
    title: "Oficinas",
    descripcion:
      "Reformas integrales de espacios corporativos, instalaciones, climatización, ventilación, datos y acabados.",
    imagen: "/sector-oficinas.jpg",
    enlace: "/proyectos",
    content:
      "<p>Ejecutamos reformas integrales de espacios corporativos donde clima, ventilación, conectividad y acabados deben convivir sin comprometer la operación diaria.</p><p>Coordinamos en paralelo instalaciones, compras e ingeniería para entregar oficinas listas para trabajar en plazos cerrados.</p>",
  },
  {
    id: "s-2",
    slug: "residencial",
    numero: "02",
    title: "Residencial",
    descripcion: "Reformas integrales y ejecución de viviendas de alta exigencia.",
    imagen: "/service-interior-1.jpg",
    enlace: "/proyectos",
    content:
      "<p>Reformas integrales y ejecución de viviendas de alta exigencia, con especial atención a la eficiencia energética, el confort acústico y la calidad de los acabados.</p><p>Trabajamos con materiales nobles y soluciones técnicas adaptadas a cada vivienda.</p>",
  },
  {
    id: "s-3",
    slug: "retail",
    numero: "03",
    title: "Retail",
    descripcion:
      "Espacios comerciales diseñados para operar, recibir clientes y cumplir los requisitos técnicos del proyecto.",
    imagen: "/sector-retail.jpg",
    enlace: "/proyectos",
    content:
      "<p>Espacios comerciales diseñados para operar y recibir clientes, cumpliendo los requisitos técnicos, de accesibilidad y de imagen de marca de cada proyecto.</p><p>Ajustamos plazos y ejecución para minimizar el impacto en la actividad comercial.</p>",
  },
  {
    id: "s-4",
    slug: "hospitality",
    numero: "04",
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
