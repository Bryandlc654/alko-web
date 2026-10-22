import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import ContactCta from "@/components/sections/ContactCta";
import { ROUTES } from "@/lib/site";
import { getSettings } from "@/lib/wordpress";
import {
  ArrowRight,
  ChevronRight,
  Wind,
  Volume2,
  Cpu,
  Sliders,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Check,
  FileCheck2,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Reformas Integrales de Oficinas en Madrid — ALKO",
  description:
    "Especialistas en reformas integrales de oficinas corporativas y sedes empresariales en Madrid. Plazos garantizados, presupuesto cerrado y ejecución sin interrumpir la actividad de la compañía.",
  openGraph: {
    title: "Reformas Integrales de Oficinas en Madrid — ALKO",
    description:
      "Transformamos plantas corporativas y espacios de trabajo con un único interlocutor técnico y máxima exigencia acústica y de climatización.",
    images: ["/sector-oficinas.jpg"],
  },
};

const METRICAS = [
  { valor: "0 días", label: "de interrupción en la actividad de la empresa" },
  { valor: "100%", label: "cumplimiento de cronogramas cerrados con fecha vinculante" },
  { valor: "1", label: "único interlocutor técnico para compras, diseño y obra" },
  { valor: "+15.000 m²", label: "de superficie de trabajo ejecutada en Madrid" },
];

const CAPACIDADES_TECNICAS = [
  {
    codigo: "CAP-01",
    titulo: "Climatización VRF y Calidad Ambiental (IAQ)",
    especificacion: "Caudal exterior IDA 2 · Recuperación entálpica · VRF 3 tubos",
    descripcion:
      "Diseño y montaje de sistemas de caudal variable con recuperación de calor para permitir frío y calor simultáneo por zonas. Filtración de aire F7/F9, monitorización continua de CO2 y difusión por microtoberas o ranuras lineales integradas en techos.",
    beneficio:
      "Máximo confort térmico individual en despachos y salas de reunión, con ahorro de hasta un 38% en consumo respecto a sistemas convencionales.",
    icon: Wind,
    tags: ["VRF Zonificado", "Filtración F9", "Microdifusión invisible"],
  },
  {
    codigo: "CAP-02",
    titulo: "Aislamiento Acústico y Compartimentación Modular",
    especificacion: "Atenuación acústica Rw = 42–48 dB · Vidrio laminado acústico",
    descripcion:
      "Mamparas modulares con perfiles de aluminio ocultos y doble vidrio laminado acústico. Puertas enrasadas de suelo a techo con junta guillotina automática inferior y fajeados perimetrales con lana de roca de alta densidad para evitar puentes fónicos por el falso techo.",
    beneficio:
      "Confidencialidad absoluta en salas de consejo y despachos ejecutivos, eliminando la contaminación sonora en zonas operativas abiertas.",
    icon: Volume2,
    tags: ["Rw hasta 48 dB", "Puertas con guillotina", "Atenuación plenum"],
  },
  {
    codigo: "CAP-03",
    titulo: "Infraestructura IT, CPD y Suelo Técnico Elevado",
    especificacion: "Categoría 6A / 7 · Fibra OM4 · Carga concentrada 14 kN/m²",
    descripcion:
      "Tendido ordenado de cableado estructurado en bandejas independientes para evitar interferencias electromagnéticas. Construcción de salas CPD con redundancia SAI, climatización in-row de precisión y suelo técnico registrable encapsulado en chapa de acero.",
    beneficio:
      "Capacidad para reubicar puestos de trabajo en menos de 2 horas sin obra húmeda ni canaletas vistas, con conectividad certificada punto a punto.",
    icon: Cpu,
    tags: ["Cableado Cat 6A", "Sala CPD redundante", "Suelo registrable"],
  },
  {
    codigo: "CAP-04",
    titulo: "Iluminación Dinámica DALI y Confort Circadiano",
    especificacion: "UGR < 19 en puestos · Tunable White 2700K–5000K · Protocolo DALI-2",
    descripcion:
      "Luminarias lineales de bajo deslumbramiento integradas en la arquitectura. Regulación de temperatura de color que acompaña el ritmo biológico humano y sensores de presencia y aporte solar que atenúan automáticamente los puestos junto a fachada.",
    beneficio:
      "Reducción notable de la fatiga visual del equipo humano y cumplimiento estricto de las normativas europeas de ergonomía lumínica UNE-EN 12464-1.",
    icon: Sliders,
    tags: ["UGR < 19", "Ritmo circadiano", "Control solar"],
  },
  {
    codigo: "CAP-05",
    titulo: "Zonas Singulares, Lounges y Espacios Colaborativos",
    especificacion: "Panelados de madera noble acústica · Piedra natural · Phone booths",
    descripcion:
      "Fabricación e instalación de recepciones con mostradores escultóricos retroiluminados, cabinas individuales insonorizadas para videollamadas, cantinas corporativas equipadas con extracción técnica y auditorios polivalentes con integración audiovisual invisible.",
    beneficio:
      "Imagen corporativa de alto impacto ante visitas e inversores, ofreciendo a los empleados entornos que favorecen la creatividad y la desconexión.",
    icon: Layers,
    tags: ["Carpintería singular", "Cabinas acústicas", "Offices de diseño"],
  },
  {
    codigo: "CAP-06",
    titulo: "Licencias de Actividad, CTE y Sellos BREEAM / WELL",
    especificacion: "Gestión ECLU Madrid · CTE-DBSI · Parámetros BREEAM / WELL Ready",
    descripcion:
      "Gestión documental integral ante el Ayuntamiento de Madrid para la obtención de licencias de funcionamiento o declaraciones responsables. Justificación técnica de evacuación de incendios, accesibilidad y selección de materiales con baja emisión de COVs (formaldehídos).",
    beneficio:
      "Seguridad jurídica inmediata para el inicio de la actividad sin riesgo de paralizaciones administrativas o sanciones municipales.",
    icon: ShieldCheck,
    tags: ["ECLU Madrid", "Materiales Low-VOC", "BREEAM / WELL Ready"],
  },
];

const METODOLOGIA_OFICINAS = [
  {
    fase: "01",
    tag: "SEMANAS 1–2",
    titulo: "Auditoría de Sede, Levantamiento BIM y Licencias",
    descripcion:
      "Inspección de las instalaciones del edificio (montantes de climatización comunitarias, potencia asignada, redes de evacuación y limitaciones de sobrecarga). Elaboración del modelo tridimensional BIM y presentación del expediente de licencia ante el Ayuntamiento de Madrid.",
    entregable: "Informe de diagnóstico estructural y registro oficial de la licencia.",
    garantia: "Elimina sorpresas de costes por patologías ocultas del inmueble.",
  },
  {
    fase: "02",
    tag: "SEMANAS 2–4",
    titulo: "Cierre de Compras Críticas y Fabricación Anticipada",
    descripcion:
      "Se bloquean y reservan en fábrica los suministros de mayor tiempo de entrega antes de iniciar la demolición: perfilería y vidrios de mamparas, máquinas de climatización VRF, cuadros eléctricos y pavimento registrable.",
    entregable: "Cronograma de compras con fechas de entrega garantizadas por fabricante.",
    garantia: "Cero días de parón en obra por retrasos en la cadena de suministros.",
  },
  {
    fase: "03",
    tag: "SEMANAS 4–6",
    titulo: "Sectorización Estanca y Convivencia Operativa",
    descripcion:
      "Si la empresa o las plantas contiguas permanecen en activo, se montan cerramientos estancos antipolvo con presión negativa. Los acopios y trabajos de ruido se restringen a horarios no lectivos consensuados con la comunidad de propietarios del edificio.",
    entregable: "Protocolo de convivencia, accesos y horarios visado por la propiedad del inmueble.",
    garantia: "La compañía sigue trabajando con normalidad sin molestias acústicas ni polvo.",
  },
  {
    fase: "04",
    tag: "SEMANAS 6–12",
    titulo: "Instalaciones Simultáneas y Acabados de Alta Tolerancia",
    descripcion:
      "Montaje ordenado en falso techo y suelo técnico de conductos de climatización, bandejas de red, fontanería y extinción de incendios. Ejecución paralela de trasdosados acústicos, mamparas de vidrio y pavimentos técnicos bajo supervisión facultativa diaria.",
    entregable: "Dossier fotográfico semanal y actas de replanteo de cada partida técnica.",
    garantia: "Encuentros limpios, tolerancias milimétricas y trazabilidad total.",
  },
  {
    fase: "05",
    tag: "SEMANAS 13–14",
    titulo: "Commissioning, Certificación de Red y Dossier As-Built",
    descripcion:
      "Equilibrado de caudales de aire por anemómetro, pruebas de estanqueidad de conductos, certificación reflectométrica de fibra y red Cat 6A, limpieza técnica profunda y entrega del dossier 'As-Built' con esquemas unifilares y manuales de mantenimiento.",
    entregable: "Certificados de red punto a punto, libro del edificio y planos finales As-Built.",
    garantia: "Recepción de la sede lista para operar desde el primer minuto.",
  },
];

const PROYECTOS_OFICINAS = [
  {
    slug: "oficinas-castellana",
    title: "Reforma Integral de Oficinas en Paseo de la Castellana",
    superficie: "900 m²",
    plazo: "14 semanas",
    destacado: "Ejecución completa sin detener la actividad del edificio corporativo.",
    imagen: "/oficinas.jpg",
    tags: ["Corporativo", "Mamparas acústicas", "VRF"],
  },
  {
    slug: "start-research",
    title: "Sede Start Research — Espacio Corporativo y Laboratorios",
    superficie: "2 plantas",
    plazo: "20 semanas",
    destacado: "Convivencia de áreas diáfanas con laboratorios de atmósfera controlada y terrazas panorámicas.",
    imagen: "/start-research-1.jpg",
    tags: ["Investigación", "Climatización avanzada", "Carpintería a medida"],
  },
];

const FAQS_OFICINAS = [
  {
    q: "¿Podemos hacer la reforma sin trasladar a todo el personal fuera de la sede?",
    a: "Sí. Gran parte de nuestras reformas corporativas se ejecutan 'en convivencia': dividimos el espacio en fases estancas aisladas acústica y térmicamente, o bien programamos trabajos ruidosos y de acopio en franjas nocturnas o fines de semana.",
  },
  {
    q: "¿Qué garantías ofrecemos sobre el plazo de entrega?",
    a: "Fijamos una fecha de finalización vinculante en contrato. Nuestra metodología de compras anticipadas y dirección de obra directa elimina los imprevistos de suministros y solapamiento entre gremios.",
  },
  {
    q: "¿Os encargáis de la gestión de licencias ante el Ayuntamiento de Madrid?",
    a: "Sí. Nuestro equipo técnico redacta el proyecto de actividad y tramita las licencias correspondientes (declaración responsable o procedimiento ordinario a través de ECLU), gestionando también las inspecciones finales.",
  },
  {
    q: "¿Cómo se define el presupuesto de una reforma corporativa?",
    a: "Elaboramos una memoria de calidades detallada partida por partida tras visitar la sede. El presupuesto se formaliza a precio cerrado, sin desviaciones imprevistas durante la ejecución.",
  },
];

export default async function OficinasPage() {
  const settings = await getSettings();

  return (
    <main className="bg-white text-stone-900 selection:bg-[#c98300]/20">
      {/* Hero Principal con imagen de oficinas de alta gama */}
      <PageHero
        eyebrow="SECTOR 01 — ESPACIOS CORPORATIVOS & HEADQUARTERS"
        title="Reformas Integrales de Oficinas en Madrid"
        description="Transformamos sedes corporativas y centros de trabajo con un estricto control de plazos, presupuesto cerrado y la capacidad técnica de ejecutar la obra sin detener la actividad de tu empresa."
        image="/sector-oficinas.jpg"
        imageAlt="Reforma integral de oficinas corporativas en Madrid por ALKO"
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#c98300] hover:bg-[#b87600] text-stone-950 font-semibold text-xs tracking-widest uppercase transition-all shadow-lg active:scale-95"
          >
            <span>Solicitar valoración de sede</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={ROUTES.projects}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs tracking-widest uppercase backdrop-blur-sm transition-all"
          >
            <span>Ver casos de éxito</span>
          </Link>
        </div>
      </PageHero>

      {/* Franja de Métricas / KPIs */}
      <section className="border-b border-stone-200 bg-[#fbfbfa]">
        <Container className="py-12 sm:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-y sm:divide-y-0 sm:divide-x divide-stone-200">
            {METRICAS.map((m, idx) => (
              <div
                key={idx}
                className={`pt-6 sm:pt-0 ${idx !== 0 ? "sm:pl-8 lg:pl-12" : ""}`}
              >
                <span className="block font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-950 tracking-tight">
                  {m.valor}
                </span>
                <span className="block font-sans text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Propuesta de Valor y Filosofía de Obra */}
      <section className="py-16 sm:py-24 border-b border-stone-200">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="font-mono text-xs text-[#c98300] uppercase tracking-[0.2em] font-semibold">
                EL ENFOQUE ALKO EN EL ESPACIO DE TRABAJO
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 leading-tight">
                Espacios que potencian la cultura y retienen el talento.
              </h2>
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-light">
                Una reforma de oficina no es solo una renovación estética: es una inversión estratégica
                en la productividad, el bienestar acústico y la imagen de marca de la organización.
              </p>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">
                En ALKO integramos bajo una sola dirección técnica la arquitectura interior, el cálculo
                de instalaciones y la gestión de compras. Así evitamos las fricciones habituales entre proyectistas
                y contratistas, garantizando que el presupuesto pactado sea el definitivo.
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-stone-50 border border-stone-200">
                  <CheckCircle2 className="w-5 h-5 text-[#c98300] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900">Dirección 360°</h3>
                    <p className="text-xs text-stone-500 mt-1">Un solo responsable para obra, clima y licencias.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-stone-50 border border-stone-200">
                  <CheckCircle2 className="w-5 h-5 text-[#c98300] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900">Plazos Innegociables</h3>
                    <p className="text-xs text-stone-500 mt-1">Planificación milimétrica con compras anticipadas.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden shadow-2xl bg-stone-200">
                <Image
                  src="/oficinas.jpg"
                  alt="Planta de oficinas diáfana y luminosa reformada por ALKO"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#c98300] block mb-1">
                    CASO DESTACADO
                  </span>
                  <p className="text-sm sm:text-base font-serif font-light">
                    Sede corporativa en Paseo de la Castellana — 900 m² reformados en 14 semanas sin afectar a las plantas vecinas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================
          REDISEÑO: CAPACIDADES TÉCNICAS (Dossier de Ingeniería)
          ======================================================== */}
      <section className="py-20 sm:py-28 bg-[#fbfbfa] border-b border-stone-200">
        <Container>
          {/* Cabecera del bloque */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-stone-300/70">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block w-2 h-2 rounded-full bg-[#c98300]" />
                <span className="font-mono text-xs text-[#c98300] uppercase tracking-[0.25em] font-semibold">
                  INGENIERÍA & ESPECIFICACIONES
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 leading-tight">
                Capacidades Técnicas para Oficinas de Alta Exigencia
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
                Coordinamos de manera transversal las 6 disciplinas críticas que condicionan el confort,
                la confidencialidad y la vida útil de una sede corporativa.
              </p>
            </div>
          </div>

          {/* Grid Técnico Editorial */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CAPACIDADES_TECNICAS.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.codigo}
                  className="group relative flex flex-col justify-between bg-white border border-stone-200/90 p-8 shadow-xs hover:shadow-xl hover:border-[#c98300]/50 transition-all duration-300"
                >
                  {/* Top: Código técnico e icono */}
                  <div>
                    <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-100">
                      <span className="font-mono text-xs tracking-widest text-stone-400 font-medium">
                        {cap.codigo}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-[#c98300] group-hover:bg-[#c98300] group-hover:text-white transition-colors duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Especificación clave destacada */}
                    <div className="mb-4">
                      <span className="inline-block font-mono text-[11px] tracking-wide text-[#b87600] bg-[#c98300]/10 px-2.5 py-1 rounded-sm border border-[#c98300]/20">
                        {cap.especificacion}
                      </span>
                    </div>

                    {/* Título de la disciplina */}
                    <h3 className="font-serif text-2xl font-normal text-stone-900 mb-3 group-hover:text-[#c98300] transition-colors">
                      {cap.titulo}
                    </h3>

                    {/* Descripción técnica */}
                    <p className="text-sm text-stone-600 font-light leading-relaxed mb-6">
                      {cap.descripcion}
                    </p>
                  </div>

                  {/* Bottom: Impacto de negocio y Tags */}
                  <div className="pt-6 border-t border-stone-100 space-y-4">
                    <div className="bg-stone-50/80 p-3.5 border-l-2 border-[#c98300]">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-stone-500 block mb-1">
                        Impacto Operativo
                      </span>
                      <p className="text-xs text-stone-700 leading-snug font-medium">
                        {cap.beneficio}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cap.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono uppercase tracking-wider bg-stone-100 text-stone-600 px-2 py-0.5 rounded-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner complementario de rigor técnico */}
          <div className="mt-12 bg-white border border-stone-200 p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#c98300]/10 border border-[#c98300]/30 flex items-center justify-center text-[#c98300] shrink-0">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-normal text-stone-900">
                  Protocolo de Ensayos y Mediciones In-Situ
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 font-light">
                  No damos por buena ninguna partida sin pruebas previas de aislamiento acústico (sonómetro), pruebas de estanqueidad de conductos y reflectometría de fibra óptica.
                </p>
              </div>
            </div>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-mono text-xs uppercase tracking-wider transition-colors shrink-0"
            >
              <span>Consultar pliego técnico</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Casos de Éxito de Oficinas */}
      <section className="py-16 sm:py-24 border-b border-stone-200">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-mono text-xs text-[#c98300] uppercase tracking-[0.2em] font-semibold">
                PROYECTOS REPRESENTATIVOS
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-light text-stone-900">
                Obras de oficinas ejecutadas en Madrid
              </h2>
            </div>
            <Link
              href={ROUTES.projects}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-900 hover:text-[#c98300] border-b border-stone-900 hover:border-[#c98300] pb-1 transition-colors"
            >
              <span>Ver todos los proyectos</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {PROYECTOS_OFICINAS.map((p) => (
              <article
                key={p.slug}
                className="group border border-stone-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
                  <Image
                    src={p.imagen}
                    alt={p.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {p.tags.map((t, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider bg-stone-950/80 backdrop-blur-sm text-white"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-4 text-xs font-mono text-stone-500 mb-3">
                    <span>{p.superficie}</span>
                    <span>•</span>
                    <span>Plazo: {p.plazo}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-light text-stone-900 group-hover:text-[#c98300] transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm text-stone-600 leading-relaxed font-light">
                    {p.destacado}
                  </p>
                  <div className="mt-6 pt-6 border-t border-stone-100 flex items-center justify-between">
                    <Link
                      href={`/proyectos/${p.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-stone-900 group-hover:text-[#c98300] transition-colors"
                    >
                      <span>Ver ficha técnica completa</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ========================================================
          REDISEÑO: METODOLOGÍA DE EJECUCIÓN (Secuencia Editorial)
          ======================================================== */}
      <section className="py-20 sm:py-32 bg-white border-b border-stone-200">
        <Container>
          {/* Cabecera del bloque */}
          <div className="pb-14 border-b border-stone-300/70">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-2 h-2 rounded-full bg-[#c98300]" />
              <span className="font-mono text-xs text-[#c98300] uppercase tracking-[0.25em] font-semibold">
                SECUENCIA OPERATIVA · 5 ETAPAS
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 leading-tight">
              Metodología de Ejecución: Plazo y Coste Bajo Control
            </h2>
            <p className="mt-4 max-w-2xl text-base text-stone-600 font-light leading-relaxed">
              La diferencia entre una reforma caótica y una entrega impecable reside en la anticipación.
              Desglosamos cada fase con hitos verificables y entregables técnicos por escrito.
            </p>
          </div>

          {/* Línea de tiempo secuencial editorial */}
          <div className="mt-14 space-y-12 sm:space-y-16">
            {METODOLOGIA_OFICINAS.map((etapa, idx) => (
              <div
                key={etapa.fase}
                className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 sm:pb-16 border-b border-stone-200/80 last:border-b-0 items-start"
              >
                {/* Columna 1: Indicador de fase y cronología */}
                <div className="lg:col-span-3 flex lg:flex-col justify-between lg:justify-start items-center lg:items-start gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-3xl sm:text-4xl font-light text-[#c98300]">
                      ({etapa.fase})
                    </span>
                    <span className="font-mono text-xs tracking-widest text-stone-400 uppercase">
                      FASE
                    </span>
                  </div>
                  <span className="inline-block px-3 py-1 font-mono text-xs uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-200 font-medium">
                    {etapa.tag}
                  </span>
                </div>

                {/* Columna 2: Título y descripción detallada */}
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-stone-900 leading-snug">
                    {etapa.titulo}
                  </h3>
                  <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
                    {etapa.descripcion}
                  </p>
                </div>

                {/* Columna 3: Entregables y Garantías contra imprevistos */}
                <div className="lg:col-span-4 bg-[#fbfbfa] border border-stone-200 p-6 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs tracking-wider uppercase font-mono mb-1.5">
                      <FileCheck2 className="w-4 h-4 text-[#c98300]" />
                      <span>Entregable Técnico</span>
                    </div>
                    <p className="text-xs text-stone-600 font-light leading-relaxed">
                      {etapa.entregable}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-200">
                    <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs tracking-wider uppercase font-mono mb-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Garantía ALKO</span>
                    </div>
                    <p className="text-xs text-stone-600 font-light leading-relaxed">
                      {etapa.garantia}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen comparativo: Modelo Tradicional vs Método ALKO */}
          <div className="mt-16 bg-[#fafaf8] border border-stone-300 p-8 sm:p-12">
            <div className="max-w-2xl mb-8">
              <span className="font-mono text-xs text-[#c98300] uppercase tracking-[0.2em] font-semibold">
                COMPARATIVA DE CONTROL
              </span>
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-light text-stone-900">
                ¿Por qué el Método ALKO neutraliza los desvíos habituales?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-stone-200">
              <div className="space-y-4">
                <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-rose-700 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  Modelo Tradicional de Reforma
                </span>
                <ul className="space-y-2.5 text-xs text-stone-600 font-light">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Los suministros críticos se piden cuando la demolición ya ha terminado (semanas de parón).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>El instalador de clima, el electricista y el montador de mamparas no se coordinan previamente.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Modificaciones imprevistas durante la obra que encarecen el presupuesto original.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 md:pt-0 md:pl-8 space-y-4">
                <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Método Integrado ALKO
                </span>
                <ul className="space-y-2.5 text-xs text-stone-800 font-normal">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Compras anticipadas:</strong> todo el material crítico está fabricado antes de empezar.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Un solo interlocutor técnico:</strong> arquitectura, cálculo e instalaciones 100% integradas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Presupuesto cerrado vinculante:</strong> sin adicionales ni sorpresas de liquidación.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Preguntas Frecuentes (FAQ) */}
      <section className="py-16 sm:py-24 border-b border-stone-200">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs text-[#c98300] uppercase tracking-[0.2em] font-semibold">
              RESOLVEMOS TUS DUDAS
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-light text-stone-900">
              Preguntas habituales sobre reformas de oficinas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FAQS_OFICINAS.map((faq, idx) => (
              <div
                key={idx}
                className="p-8 bg-[#fbfbfa] border border-stone-200 rounded-none space-y-3"
              >
                <h3 className="font-serif text-lg font-normal text-stone-900">
                  {faq.q}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed font-light">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Final */}
      <ContactCta settings={settings} />
    </main>
  );
}
