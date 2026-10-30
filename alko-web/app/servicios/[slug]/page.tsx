import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ContactTrigger from "@/components/contact/ContactTrigger";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import ContactCta from "@/components/sections/ContactCta";
import Materials from "@/components/sections/Materials";
import { parseService } from "@/lib/services";
import { ROUTES, SITE } from "@/lib/site";
import {
  getFabricantes,
  getFases,
  getProjects,
  getSectorBySlug,
  getSectors,
  getSettings,
} from "@/lib/wordpress";
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Check,
  Layers,
  Sparkles,
  Award,
  Ruler,
  Compass,
  FileCheck2,
} from "lucide-react";

export const revalidate = 60;

export async function generateStaticParams() {
  const sectors = await getSectors();
  return sectors.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sector = await getSectorBySlug(slug);
  if (!sector) return {};
  return {
    title: `${sector.title} — ALKO`,
    description: sector.descripcion,
    openGraph: { images: sector.imagen ? [sector.imagen] : undefined },
  };
}

/** Compromisos por defecto para las métricas superiores si no se especifican */
const DEFAULT_COMMITMENTS = [
  { title: "Presupuesto cerrado", text: "Por partidas y acordado antes de empezar" },
  { title: "Plazo por escrito", text: "Con hitos de control durante la obra" },
  { title: "Un único equipo", text: "De proyecto a entrega, sin intermediarios" },
];

/** FAQs por defecto */
const DEFAULT_FAQS = [
  {
    q: "¿Cómo empieza el proceso y valoración inicial?",
    a: "Nos cuentas qué necesitas por formulario, por teléfono o por WhatsApp. Un arquitecto técnico analiza la viabilidad del encargo, visita el inmueble y emite una propuesta formal con mediciones detalladas.",
  },
  {
    q: "¿Cómo se garantiza que no habrá sobrecostes?",
    a: "Trabajamos a precio cerrado por contrato. Cada partida, material y repercusión de mano de obra queda fijada antes del inicio. Cualquier modificación posterior requerida por la propiedad se presupuesta y aprueba formalmente por escrito antes de ejecutarse.",
  },
  {
    q: "¿Os encargáis de las licencias y trámites administrativos en Madrid?",
    a: "Sí. Tramitamos íntegramente las licencias de obras (declaración responsable, procedimiento ordinario o licencias de actividad con entidades colaboradoras ECLU), tasas e inspecciones municipales.",
  },
  {
    q: "¿Quién supervisa la obra día a día?",
    a: "Asignamos un jefe de obra / arquitecto técnico exclusivo que coordina las subcontratas, realiza el control de calidad, recepciona los materiales y te reporta el avance semanal de hitos.",
  },
];

export default async function SectorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [sector, sectors, projects, fases, fabricantes, settings] = await Promise.all([
    getSectorBySlug(slug),
    getSectors(),
    getProjects(),
    getFases(),
    getFabricantes(),
    getSettings(),
  ]);

  if (!sector) return notFound();

  const { lead: parsedLead, sections } = parseService(sector.content);
  const parsedIncludes = sections.find((s) => s.items.length > 0 && /incluye/i.test(s.title)) ?? sections.find((s) => s.items.length > 0);
  const others = sections.filter((s) => s !== parsedIncludes);

  const landing = sector.landing;
  const lead = landing?.lead || parsedLead || sector.descripcion;
  const commitments = landing?.commitments && landing.commitments.length > 0 ? landing.commitments : DEFAULT_COMMITMENTS;
  const includesItems = landing?.includes && landing.includes.length > 0 ? landing.includes : (parsedIncludes?.items || [
    "Proyecto técnico y legalización completa",
    "Demoliciones selectivas y redistribución de espacios",
    "Renovación integral de fontanería, electricidad y saneamiento",
    "Climatización de alta eficiencia (aerotermia / suelo radiante / VRF)",
    "Carpinterías exteriores de altas prestaciones térmicas y acústicas",
    "Carpintería a medida e interiorismo de alta gama",
  ]);
  const includesHeadline = landing?.includesHeadline || "Todo en un mismo equipo técnico.";
  const includesSubtitle = landing?.includesSubtitle || parsedIncludes?.title || "QUÉ INCLUYE EL SERVICIO";
  const faqList = landing?.faqs && landing.faqs.length > 0 ? landing.faqs : DEFAULT_FAQS;

  // Proyectos representativos de este servicio
  const ownProjects = projects.filter((project) => project.servicio === sector.slug);
  const showcase = ownProjects.length > 0 
    ? ownProjects.slice(0, 4) 
    : projects.slice(0, 4);

  // Otros servicios para navegación
  const otrosServicios = sectors.filter((item) => item.slug !== sector.slug);

  // Métricas de cabecera superiores
  const metricas = [
    { valor: "0 €", label: "de desviaciones en contratos a precio cerrado" },
    { valor: "100%", label: "cumplimiento de cronogramas con penalización de plazo" },
    { valor: "1", label: "único interlocutor técnico para compras, diseño y obra" },
    { valor: `+${projects.length || 15}`, label: "proyectos singulares entregados con éxito" },
  ];

  // Capacidades Técnicas / Pilares específicos (editables desde el admin con fallback)
  const CAPACIDADES_DEFAULT = [
    {
      codigo: "01",
      titulo: "Arquitectura & Proyecto Ejecutivo",
      metrica: "Modelado BIM · Planimetría",
      resumen: "Desarrollo técnico minucioso, optimización de espacios y selección de materiales nobles previa al inicio de obra.",
      puntos: ["Detalles constructivos a escala 1:1", "Asesoramiento continuo en interiorismo"],
      icon: Compass,
    },
    {
      codigo: "02",
      titulo: "Gestión Integral de Licencias",
      metrica: "Ayuntamiento · ECLU Madrid",
      resumen: "Tramitación técnica completa de licencias de obra mayor, menor y proyectos de actividad sin retrasos burocráticos.",
      puntos: ["Seguridad jurídica garantizada", "Gestión directa con técnicos municipales"],
      icon: ShieldCheck,
    },
    {
      codigo: "03",
      titulo: "Instalaciones & Eficiencia",
      metrica: "Aerotermia · Suelo Radiante · Clima",
      resumen: "Cálculo e instalación de envolventes térmicas, ventilación mecánica con recuperación y domótica de vanguardia.",
      puntos: ["Ahorros energéticos de hasta el 70%", "Confort acústico y térmico homogéneo"],
      icon: Layers,
    },
    {
      codigo: "04",
      titulo: "Acabados & Carpintería a Medida",
      metrica: "Tolerancia milimétrica",
      resumen: "Fabricación propia de panelados, armarios integrados, cerrajerías enrasadas y cocinas de diseño exclusivo.",
      puntos: ["Materiales nobles: maderas, piedras y metales", "Alineaciones enrasadas sin molduras visibles"],
      icon: Ruler,
    },
    {
      codigo: "05",
      titulo: "Control y Dirección de Obra Diaria",
      metrica: "Supervisión a pie de obra",
      resumen: "Presencia continua de un arquitecto técnico para garantizar la calidad de colocación y el cumplimiento de hitos.",
      puntos: ["Inspecciones en cada fase antes de cerrar", "Coordinación estricta de gremios especializados"],
      icon: Sparkles,
    },
    {
      codigo: "06",
      titulo: "Entrega Llave en Mano & Garantía",
      metrica: "Dossier As-Built · Certificaciones",
      resumen: "Recepción de obra tras pruebas exhaustivas de estanqueidad, planos finales y garantía legal posventa directa.",
      puntos: ["Manual de mantenimiento del inmueble", "Respuesta posventa prioritaria"],
      icon: Award,
    },
  ];

  const ICONS_MAP = [Compass, ShieldCheck, Layers, Ruler, Sparkles, Award];

  const capacidades = landing?.capacidades && landing.capacidades.length > 0
    ? landing.capacidades.map((cap, i) => ({
        ...cap,
        icon: ICONS_MAP[i % ICONS_MAP.length],
      }))
    : CAPACIDADES_DEFAULT;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: sector.title,
      description: sector.descripcion,
      url: `${SITE.url}${ROUTES.sectors}/${sector.slug}`,
      provider: { "@type": "Organization", name: "ALKO", url: SITE.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqList.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <main className="bg-white text-stone-900 selection:bg-[#c98300]/20">
      {jsonLd.map((data, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}

      {/* ========================================================
          HERO PRINCIPAL (Mismo formato premium y refinado de Oficinas)
          ======================================================== */}
      <PageHero
        breadcrumbs={[
          { label: "Servicios", href: ROUTES.sectors },
          { label: sector.title },
        ]}
        eyebrow={`SERVICIO ${sector.numero || "01"} — ALKO ESPECIALIDADES`}
        title={landing?.heroHeadline || sector.title}
        description={lead}
        image={sector.imagen || "/p1.jpg"}
        imageAlt={`Especialidad de ${sector.title} en Madrid por ALKO`}
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <ContactTrigger
            mode="avanzado"
            source={`Servicio ${sector.title}`}
            tipo={sector.title}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#c98300] hover:bg-[#b87600] text-stone-950 font-semibold text-xs tracking-widest uppercase transition-all shadow-lg active:scale-95"
          >
            <span>Solicitar valoración de proyecto</span>
            <ArrowRight className="w-4 h-4" />
          </ContactTrigger>
          <Link
            href={ROUTES.projects}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs tracking-widest uppercase backdrop-blur-sm transition-all"
          >
            <span>Ver casos de éxito</span>
          </Link>
        </div>
      </PageHero>

      {/* ========================================================
          FRANJA DE MÉTRICAS / KPIS DE CONFIANZA
          ======================================================== */}
      <section className="border-b border-stone-200 bg-[#fbfbfa]">
        <Container className="py-12 sm:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-y sm:divide-y-0 sm:divide-x divide-stone-200">
            {metricas.map((m, idx) => (
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

      {/* ========================================================
          PROPUESTA DE VALOR & ENFOQUE CONSTRUCTIVO
          ======================================================== */}
      <section className="py-16 sm:py-24 border-b border-stone-200">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="font-mono text-xs text-[#c98300] uppercase tracking-[0.2em] font-semibold">
                EL ENFOQUE ALKO EN {sector.title.toUpperCase()}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 leading-tight">
                {landing?.problemsHeadline || "Rigor constructivo, fidelidad al diseño y presupuesto cerrado."}
              </h2>
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-light">
                {sector.descripcion}
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
                  src={landing?.includesImage || sector.imagen || "/p2.jpg"}
                  alt={`Obra destacada de ${sector.title}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#c98300] block mb-1">
                    ESTÁNDAR ALKO
                  </span>
                  <p className="text-sm sm:text-base font-serif font-light">
                    {commitments[0]?.title}: {commitments[0]?.text}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================
          CAPACIDADES TÉCNICAS (6 Tarjetas con diseño idéntico a Oficinas)
          ======================================================== */}
      <section className="py-16 sm:py-24 bg-[#fafaf8] border-b border-stone-200">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 mb-10 border-b border-stone-200">
            <div>
              <span className="font-mono text-xs text-[#c98300] uppercase tracking-[0.25em] font-semibold">
                {landing?.capacidadesSubtitle || "DISCIPLINAS TÉCNICAS & METODOLOGÍA"}
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-light text-stone-900">
                {landing?.capacidadesHeadline || "Capacidades Técnicas"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm font-light">
              Coordinación transversal de las disciplinas críticas en cada proyecto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capacidades.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.codigo}
                  className="bg-white border border-stone-200/90 p-6 sm:p-7 shadow-xs hover:border-[#c98300]/60 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs text-stone-400 font-medium">
                        {cap.codigo}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-[#c98300]">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <span className="inline-block font-mono text-[10px] uppercase tracking-wider text-[#b87600] bg-[#c98300]/10 px-2 py-0.5 rounded-xs border border-[#c98300]/20 mb-3">
                      {cap.metrica}
                    </span>

                    <h3 className="font-serif text-xl font-normal text-stone-900 mb-2">
                      {cap.titulo}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed mb-4">
                      {cap.resumen}
                    </p>
                  </div>

                  <ul className="pt-3 border-t border-stone-100 space-y-1.5">
                    {cap.puntos.map((punto, pIdx) => (
                      <li
                        key={pIdx}
                        className="flex items-center gap-2 text-xs text-stone-700 font-light"
                      >
                        <Check className="w-3.5 h-3.5 text-[#c98300] shrink-0" />
                        <span>{punto}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ========================================================
          ALCANCE / QUÉ INCLUYE EL SERVICIO
          ======================================================== */}
      <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs text-[#c98300] uppercase tracking-[0.2em] font-semibold">
              {includesSubtitle}
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-light text-stone-900">
              {includesHeadline}
            </h2>
            <p className="mt-4 text-stone-600 font-light">
              Partidas integradas y gestionadas de inicio a fin bajo una misma responsabilidad contractual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {includesItems.map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-[#fbfbfa] border border-stone-200/90 flex items-start gap-3 hover:border-[#c98300]/40 transition-colors"
              >
                <FileCheck2 className="w-5 h-5 text-[#c98300] shrink-0 mt-0.5" />
                <span className="text-sm font-light text-stone-800 leading-snug">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ========================================================
          CASOS DE ÉXITO Y PROYECTOS REPRESENTATIVOS
          ======================================================== */}
      {showcase.length > 0 && (
        <section className="py-16 sm:py-24 border-b border-stone-200 bg-[#fafaf8]">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
              <div>
                <span className="font-mono text-xs text-[#c98300] uppercase tracking-[0.2em] font-semibold">
                  PROYECTOS REPRESENTATIVOS
                </span>
                <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-light text-stone-900">
                  Obras ejecutadas en Madrid
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
              {showcase.slice(0, 2).map((p) => (
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
                      <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider bg-stone-950/80 backdrop-blur-sm text-white">
                        {p.tipologia || "Proyecto"}
                      </span>
                      {p.ubicacion && (
                        <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider bg-stone-950/80 backdrop-blur-sm text-white">
                          {p.ubicacion}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-4 text-xs font-mono text-stone-500 mb-3">
                      <span>{p.superficie || "Medida personalizada"}</span>
                      <span>•</span>
                      <span>Plazo: {p.plazo || "Cronograma cerrado"}</span>
                    </div>
                    <h3 className="font-serif text-2xl font-light text-stone-900 group-hover:text-[#c98300] transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-sm text-stone-600 leading-relaxed font-light">
                      {p.reto || p.solucion || p.resultado}
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
      )}

      {/* ========================================================
          SECUENCIA OPERATIVA / METODOLOGÍA (5 Fases en carril homogéneo)
          ======================================================== */}
      <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 mb-10 border-b border-stone-200">
            <div>
              <span className="font-mono text-xs text-[#c98300] uppercase tracking-[0.25em] font-semibold">
                SECUENCIA OPERATIVA
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-light text-stone-900">
                Metodología de Ejecución
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm font-light">
              Etapas secuenciales con cronograma cerrado y entregables técnicos garantizados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {[
              {
                fase: "01",
                semanas: "Fase 1",
                titulo: "Auditoría & Viabilidad",
                resumen: "Levantamiento de planos, comprobación de acometidas y análisis técnico-estructural.",
                entregable: "Mediciones e informe de viabilidad",
              },
              {
                fase: "02",
                semanas: "Fase 2",
                titulo: "Presupuesto & Compras",
                resumen: "Partidas desglosadas a precio cerrado y acopio anticipado de materiales críticos.",
                entregable: "Contrato vinculante con calendario",
              },
              {
                fase: "03",
                semanas: "Fase 3",
                titulo: "Licencias & Permisos",
                resumen: "Tramitación integral de expedientes urbanísticos y permisos municipales.",
                entregable: "Expediente de licencia aprobado",
              },
              {
                fase: "04",
                semanas: "Fase 4",
                titulo: "Ejecución & Gremios",
                resumen: "Tendido simultáneo de instalaciones, albañilería y carpinterías bajo control diario.",
                entregable: "Supervisión técnica continua",
              },
              {
                fase: "05",
                semanas: "Fase 5",
                titulo: "Pruebas & Entrega",
                resumen: "Ensayos de estanqueidad, mediciones acústicas, limpieza integral y llave en mano.",
                entregable: "Dossier final y garantía legal",
              },
            ].map((etapa) => (
              <div
                key={etapa.fase}
                className="bg-[#fbfbfa] border border-stone-200 p-6 flex flex-col justify-between hover:border-[#c98300]/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-light text-[#c98300]">
                      ({etapa.fase})
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider bg-stone-200/70 text-stone-700 px-2 py-0.5 font-medium">
                      {etapa.semanas}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-normal text-stone-900 mb-2">
                    {etapa.titulo}
                  </h3>

                  <p className="text-xs text-stone-600 font-light leading-relaxed mb-4">
                    {etapa.resumen}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/80">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                    Entregable
                  </span>
                  <span className="text-xs text-stone-800 font-medium leading-tight block">
                    {etapa.entregable}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center justify-around gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#c98300] shrink-0" />
              <span className="text-xs font-mono tracking-wider uppercase text-stone-800 font-medium">
                Compras anticipadas en fábrica
              </span>
            </div>
            <span className="hidden sm:inline text-stone-300">•</span>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#c98300] shrink-0" />
              <span className="text-xs font-mono tracking-wider uppercase text-stone-800 font-medium">
                1 único interlocutor técnico
              </span>
            </div>
            <span className="hidden sm:inline text-stone-300">•</span>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#c98300] shrink-0" />
              <span className="text-xs font-mono tracking-wider uppercase text-stone-800 font-medium">
                Presupuesto y plazo cerrados
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Marcas y fabricantes colaboradores */}
      {fabricantes.length > 0 && <Materials fabricantes={fabricantes} />}

      {/* ========================================================
          PREGUNTAS FRECUENTES (FAQ) - Cuadrícula limpia
          ======================================================== */}
      <section className="py-16 sm:py-24 border-b border-stone-200 bg-[#fbfbfa]">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs text-[#c98300] uppercase tracking-[0.2em] font-semibold">
              RESOLVEMOS TUS DUDAS
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-light text-stone-900">
              Preguntas habituales sobre {sector.title.toLowerCase()}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqList.map((faq, idx) => (
              <div
                key={idx}
                className="p-8 bg-white border border-stone-200 space-y-3 shadow-xs"
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

      {/* ========================================================
          OTROS SERVICIOS (Carril de navegación inferior)
          ======================================================== */}
      {otrosServicios.length > 0 && (
        <section className="py-16 sm:py-20 border-b border-stone-200 bg-white">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-[#c98300] font-semibold">
                OTRAS ESPECIALIDADES ALKO
              </h2>
              <Link
                href={ROUTES.sectors}
                className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 border-b border-transparent hover:border-stone-900 transition-colors"
              >
                Ver todos los servicios →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otrosServicios.map((item) => (
                <Link
                  key={item.id}
                  href={`${ROUTES.sectors}/${item.slug}`}
                  className="group block border border-stone-200 bg-[#fbfbfa] p-6 hover:border-[#c98300]/60 hover:shadow-md transition-all"
                >
                  <span className="font-mono text-xs text-stone-400 block mb-2">
                    ({item.numero || "00"})
                  </span>
                  <h3 className="font-serif text-xl font-normal text-stone-900 group-hover:text-[#c98300] transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-stone-600 line-clamp-2 font-light">
                    {item.descripcion}
                  </p>
                  <div className="mt-4 pt-4 border-t border-stone-200/60 flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-stone-900 group-hover:text-[#c98300]">
                    <span>Explorar especialidad</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ========================================================
          CTA FINAL CORPORATIVO (Mismo de Oficinas)
          ======================================================== */}
      <ContactCta settings={settings} />
    </main>
  );
}
