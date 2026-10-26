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
  { valor: "100%", label: "cumplimiento de cronogramas cerrados" },
  { valor: "1", label: "único interlocutor técnico para compras, diseño y obra" },
  { valor: "+15.000 m²", label: "de superficie de trabajo ejecutada en Madrid" },
];

const CAPACIDADES_TECNICAS = [
  {
    codigo: "01",
    titulo: "Climatización VRF & IAQ",
    metrica: "VRF 3 tubos · Caudal IDA 2",
    resumen: "Sistemas zonificados con recuperación de calor, filtración F7/F9 y microdifusión lineal invisible.",
    puntos: ["Control térmico independiente por despacho", "Ahorro energético del 35% frente a split"],
    icon: Wind,
  },
  {
    codigo: "02",
    titulo: "Aislamiento Acústico",
    metrica: "Atenuación Rw 42–48 dB",
    resumen: "Mamparas modulares de doble vidrio laminado y puertas enrasadas con junta guillotina hermética.",
    puntos: ["Confidencialidad total en salas de juntas", "Atenuación fónica continua en plenum"],
    icon: Volume2,
  },
  {
    codigo: "03",
    titulo: "Redes, CPD & Suelo Técnico",
    metrica: "Cat 6A / 7 · Carga 14 kN/m²",
    resumen: "Cableado estructurado certificado, salas técnicas climatizadas y suelo registrable encapsulado.",
    puntos: ["Reconfiguración de puestos sin obra", "Conectividad certificada punto a punto"],
    icon: Cpu,
  },
  {
    codigo: "04",
    titulo: "Iluminación Circadiana",
    metrica: "UGR < 19 · Protocolo DALI-2",
    resumen: "Luminarias de bajo deslumbramiento con regulación según el aporte solar y ritmo biológico.",
    puntos: ["Cumplimiento estricto UNE-EN 12464", "Sensores de presencia y aporte natural"],
    icon: Sliders,
  },
  {
    codigo: "05",
    titulo: "Zonas Singulares & Lounge",
    metrica: "Diseño a medida · Piedra & Madera",
    resumen: "Recepciones representativas, phone booths insonorizados, offices de diseño y salas polivalentes.",
    puntos: ["Espacios para retener y atraer talento", "Materiales nobles de alto impacto"],
    icon: Layers,
  },
  {
    codigo: "06",
    titulo: "Licencias & Sostenibilidad",
    metrica: "ECLU Madrid · BREEAM / WELL Ready",
    resumen: "Gestión completa de licencias de actividad ante el Ayuntamiento de Madrid y cumplimiento del CTE.",
    puntos: ["Seguridad jurídica sin retrasos", "Materiales sostenibles con bajas emisiones COV"],
    icon: ShieldCheck,
  },
];

const METODOLOGIA_OFICINAS = [
  {
    fase: "01",
    semanas: "Sem. 1–2",
    titulo: "Auditoría & BIM",
    resumen: "Revisión de instalaciones del edificio, levantamiento 3D y tramitación de licencias.",
    entregable: "Expediente de licencia e informe técnico",
  },
  {
    fase: "02",
    semanas: "Sem. 3–4",
    titulo: "Compras Previas",
    resumen: "Bloqueo y acopio en fábrica de mamparas, máquinas VRF y materiales críticos.",
    entregable: "Cronograma de suministros garantizado",
  },
  {
    fase: "03",
    semanas: "Sem. 5–6",
    titulo: "Sectorización Limpia",
    resumen: "Cerramientos estancos antipolvo y horarios pactados para convivencia sin molestias.",
    entregable: "Convivencia operativa sin ruidos",
  },
  {
    fase: "04",
    semanas: "Sem. 7–12",
    titulo: "Instalaciones & Acabados",
    resumen: "Tendido simultáneo de clima, redes, electricidad y mamparas con dirección diaria.",
    entregable: "Actas de replanteo y tolerancias milimétricas",
  },
  {
    fase: "05",
    semanas: "Sem. 13–14",
    titulo: "Pruebas & As-Built",
    resumen: "Equilibrado de aire, certificación de red, limpieza técnica y planos finales.",
    entregable: "Llave en mano con dossier As-Built",
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
        eyebrow="SERVICIO 02 — ESPACIOS CORPORATIVOS & HEADQUARTERS"
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
          CAPACIDADES TÉCNICAS (Versión Sintética y Visual)
          ======================================================== */}
      <section className="py-16 sm:py-24 bg-[#fafaf8] border-b border-stone-200">
        <Container>
          {/* Cabecera */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 mb-10 border-b border-stone-200">
            <div>
              <span className="font-mono text-xs text-[#c98300] uppercase tracking-[0.25em] font-semibold">
                INGENIERÍA & DISCIPLINAS
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-light text-stone-900">
                Capacidades Técnicas
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm font-light">
              Coordinación transversal de las 6 disciplinas críticas del espacio de trabajo.
            </p>
          </div>

          {/* Grid conciso de 6 capacidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPACIDADES_TECNICAS.map((cap) => {
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
          METODOLOGÍA DE EJECUCIÓN (Secuencia Sintética de 5 Pasos)
          ======================================================== */}
      <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
        <Container>
          {/* Cabecera */}
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
              5 etapas secuenciales con cronograma cerrado y entregables técnicos garantizados.
            </p>
          </div>

          {/* 5 Pasos en Carril Horizontal / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {METODOLOGIA_OFICINAS.map((etapa) => (
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

          {/* Franja de 3 Garantías Clave */}
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
