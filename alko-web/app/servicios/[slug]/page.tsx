import { notFound } from "next/navigation";
import Image from "@/components/ui/Image";
import Link from "next/link";
import ContactTrigger from "@/components/contact/ContactTrigger";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Lightbox from "@/components/ui/Lightbox";
import ArticleCard from "@/components/ui/ArticleCard";
import ContactCta from "@/components/sections/ContactCta";
import Materials from "@/components/sections/Materials";
import { parseService } from "@/lib/services";
import { ROUTES, SITE } from "@/lib/site";
import { sectorKeyword, sectorSlug } from "@/lib/content";
import {
  getArticles,
  getFabricantes,
  getFases,
  getProjects,
  getSectorBySlug,
  getSectors,
  getSettings,
} from "@/lib/wordpress";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";

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
  const keyword = sectorKeyword(sector);
  const title = `${keyword.charAt(0).toUpperCase()}${keyword.slice(1)} en Madrid — ALKO`;
  const description = sector.landing?.lead || sector.descripcion;
  return {
    title,
    description,
    alternates: { canonical: `${ROUTES.sectors}/${sector.slug}` },
    openGraph: { title, description, images: sector.imagen ? [sector.imagen] : undefined },
  };
}

/** Compromisos por defecto si el servicio no tiene los suyos. */
const DEFAULT_COMMITMENTS = [
  { title: "Presupuesto cerrado", text: "Por partidas y acordado antes de empezar." },
  { title: "Plazo por escrito", text: "Con hitos de control durante toda la obra." },
  { title: "Un único equipo", text: "De proyecto a entrega, sin intermediarios." },
];

const DEFAULT_FAQS = [
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
];

const DEFAULT_INCLUDES = [
  "Proyecto técnico y legalización completa",
  "Demoliciones selectivas y redistribución de espacios",
  "Renovación integral de fontanería, electricidad y saneamiento",
  "Climatización de alta eficiencia",
  "Carpinterías exteriores de altas prestaciones térmicas y acústicas",
  "Carpintería a medida e interiorismo",
];

const DEFAULT_CAPACIDADES = [
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
];

/** Secciones de la página, para el índice con anclas. */
const SECTIONS = [
  { id: "enfoque", label: "Enfoque" },
  { id: "incluye", label: "Qué incluye" },
  { id: "proceso", label: "Cómo trabajamos" },
  { id: "proyectos", label: "Proyectos" },
  { id: "preguntas", label: "Preguntas frecuentes" },
];

export default async function SectorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [sector, sectors, projects, fases, fabricantes, settings, articles] = await Promise.all([
    getSectorBySlug(slug),
    getSectors(),
    getProjects(),
    getFases(),
    getFabricantes(),
    getSettings(),
    getArticles(3),
  ]);

  if (!sector) return notFound();

  const name = sector.title;
  // Lo que se busca en Google («reformas de oficinas»): da forma al H1 y a los H2.
  const keyword = sectorKeyword(sector);
  const Keyword = `${keyword.charAt(0).toUpperCase()}${keyword.slice(1)}`;
  const { lead: parsedLead, sections } = parseService(sector.content);
  const parsedIncludes =
    sections.find((s) => s.items.length > 0 && /incluye/i.test(s.title)) ?? sections.find((s) => s.items.length > 0);

  const landing = sector.landing;
  const lead = landing?.lead || parsedLead || sector.descripcion;
  const commitments = landing?.commitments && landing.commitments.length > 0 ? landing.commitments : DEFAULT_COMMITMENTS;
  const includesItems =
    landing?.includes && landing.includes.length > 0 ? landing.includes : parsedIncludes?.items || DEFAULT_INCLUDES;
  const faqList = landing?.faqs && landing.faqs.length > 0 ? landing.faqs : DEFAULT_FAQS;
  const capacidades = landing?.capacidades && landing.capacidades.length > 0 ? landing.capacidades : DEFAULT_CAPACIDADES;
  const problems = (landing?.problems || []).filter((p) => p.avoid || p.promise);

  // Proyectos del servicio (si aún no hay, los más recientes) y fotos de obra para la galería.
  const ownProjects = projects.filter((project) => sectorSlug(project.servicio) === sector.slug);
  const showcase = (ownProjects.length > 0 ? ownProjects : projects).slice(0, 3);
  const galleryPhotos = Array.from(
    new Set(
      landing?.resultsImages && landing.resultsImages.length > 0
        ? landing.resultsImages
        : showcase.flatMap((p) => [p.fotoDespues, ...(p.galeria || [])]).filter((src): src is string => !!src),
    ),
  ).slice(0, 6);

  // Imágenes de apoyo: las del panel y, si faltan, fotos de los proyectos del servicio.
  const projectPhotos = showcase.flatMap((p) => [p.imagen, ...(p.galeria || [])]).filter(Boolean);
  const heroImage = sector.imagen || projectPhotos[0] || "/sector-oficinas.jpg";
  const introImage = landing?.supportImage || projectPhotos[0] || heroImage;
  const introDetailImage = projectPhotos.find((src) => src !== introImage && src !== heroImage) || heroImage;
  const includesImage = landing?.includesImage || projectPhotos[1] || heroImage;

  const otrosServicios = sectors.filter((item) => item.slug !== sector.slug);
  const url = `${SITE.url}${ROUTES.sectors}/${sector.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${Keyword} en Madrid`,
      serviceType: name,
      description: lead,
      url,
      image: heroImage.startsWith("http") ? heroImage : `${SITE.url}${heroImage}`,
      areaServed: { "@type": "City", name: "Madrid" },
      provider: { "@type": "GeneralContractor", name: "ALKO", url: SITE.url, telephone: settings.telefono },
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

  const eyebrowClass = "block font-mono text-[11px] sm:text-xs uppercase tracking-[0.25em] text-amber-700";
  const h2Class = "font-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.08] tracking-tight text-stone-900";

  return (
    <main className="bg-white text-stone-900">
      {jsonLd.map((data, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}

      {/* Cabecera */}
      <PageHero
        breadcrumbs={[{ label: "Servicios", href: ROUTES.sectors }, { label: name }]}
        eyebrow={`Servicio ${sector.numero || ""} · ${name}`}
        title={landing?.heroHeadline || `${Keyword} en Madrid`}
        description={lead}
        image={heroImage}
        imageAlt={`${Keyword} en Madrid, obra de ALKO`}
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <ContactTrigger
            mode="avanzado"
            source={`Servicio ${name}`}
            tipo={name}
            className="inline-flex items-center gap-2 rounded-full bg-amber-700 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg transition hover:bg-white hover:text-stone-900"
          >
            Solicitar valoración
            <ArrowRight className="h-4 w-4" />
          </ContactTrigger>
          <a
            href="#proyectos"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-xs uppercase tracking-[0.18em] text-white backdrop-blur-sm transition hover:bg-white/10"
          >
            Ver proyectos
          </a>
        </div>
      </PageHero>

      {/* Índice de la página */}
      <nav aria-label={`Contenido de ${name}`} className="border-b border-stone-200 bg-white">
        <Container>
          <ul className="-mx-2 flex gap-1 overflow-x-auto py-3 [scrollbar-width:none]">
            {SECTIONS.map((item) => (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  className="block rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {/* Compromisos */}
      <section aria-label="Compromisos" className="border-b border-stone-200 bg-stone-50">
        <Container className="grid grid-cols-1 divide-y divide-stone-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {commitments.slice(0, 3).map((item, i) => (
            <div key={item.title} className="flex gap-5 py-8 sm:px-8 sm:first:pl-0 sm:last:pr-0 lg:py-10">
              <span className="font-mono text-xs text-amber-700">0{i + 1}</span>
              <div>
                <h3 className="font-serif text-xl font-light text-stone-900">{item.title}</h3>
                <p className="mt-1.5 text-sm font-light leading-relaxed text-stone-600">{item.text}</p>
              </div>
            </div>
          ))}
        </Container>
      </section>

      {/* Enfoque: texto y composición de imágenes */}
      <section id="enfoque" className="scroll-mt-36 py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <span className={eyebrowClass}>{landing?.statsTitle || `${name} con ALKO`}</span>
              <h2 className={`mt-4 ${h2Class}`}>
                {landing?.problemsHeadline || `Especialistas en ${keyword} en Madrid`}
              </h2>
              <p className="mt-6 text-lg font-light leading-relaxed text-stone-700">{sector.descripcion}</p>
              <p className="mt-4 text-base font-light leading-relaxed text-stone-600">
                {landing?.supportContent ||
                  "Integramos bajo una sola dirección técnica el proyecto, el cálculo de instalaciones, las compras y la obra. Así evitamos las fricciones habituales entre proyectistas y constructoras, y el presupuesto pactado es el definitivo."}
              </p>
              <ContactTrigger
                mode="avanzado"
                source={`Servicio ${name}`}
                tipo={name}
                className="group mt-8 inline-flex items-center gap-2 border-b border-stone-900 pb-1.5 text-xs font-semibold uppercase tracking-[0.22em] transition hover:border-amber-700 hover:text-amber-700"
              >
                Hablar con un técnico
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </ContactTrigger>
            </div>

            <div className="relative lg:col-span-7">
              <div className="relative ml-auto aspect-[4/5] w-[82%] overflow-hidden bg-stone-200 sm:aspect-[5/4]">
                <Image src={introImage} alt={`${Keyword} en Madrid por ALKO`} fill sizes="(max-width: 1024px) 82vw, 45vw" className="object-cover" />
              </div>
              <div className="absolute bottom-[-8%] left-0 aspect-square w-[42%] overflow-hidden border-8 border-white bg-stone-200 shadow-2xl">
                <Image src={introDetailImage} alt={`Detalle de ${keyword}`} fill sizes="(max-width: 1024px) 42vw, 22vw" className="object-cover" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Lo que evitamos y lo que garantizamos (si el servicio lo tiene en el panel) */}
      {problems.length > 0 && (
        <section className="border-t border-stone-200 py-16 sm:py-24">
          <Container>
            <h2 className={`max-w-3xl ${h2Class}`}>Lo que evitamos y lo que garantizamos</h2>
            <div className="mt-12 divide-y divide-stone-200 border-y border-stone-200">
              {problems.map((p, i) => (
                <div key={i} className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-2 sm:gap-10">
                  <p className="text-base font-light text-stone-500 line-through decoration-stone-300">{p.avoid}</p>
                  <p className="flex items-start gap-3 text-base text-stone-900">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-amber-700" />
                    {p.promise}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Qué incluye: bloque oscuro con imagen */}
      <section id="incluye" className="scroll-mt-36 bg-stone-950 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[320px] sm:min-h-[460px] lg:min-h-full">
            <Image src={includesImage} alt={`Qué incluye nuestro servicio de ${keyword}`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="px-6 py-16 sm:px-12 sm:py-24 lg:px-16 xl:px-24">
            <span className="block font-mono text-[11px] uppercase tracking-[0.25em] text-amber-500 sm:text-xs">
              {landing?.includesSubtitle || parsedIncludes?.title || `Qué incluye nuestro servicio de ${keyword}`}
            </span>
            <h2 className="mt-4 font-serif text-3xl font-light leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
              {landing?.includesHeadline || "Todo en un mismo equipo técnico."}
            </h2>
            <ol className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {includesItems.map((item, i) => (
                <li key={i} className="flex items-baseline gap-5 py-4">
                  <span className="font-mono text-xs text-amber-500">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-base font-light leading-snug text-white/90 sm:text-lg">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Capacidades técnicas */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-6 border-b border-stone-200 pb-10 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <span className={eyebrowClass}>{landing?.capacidadesSubtitle || "Disciplinas técnicas"}</span>
              <h2 className={`mt-4 ${h2Class}`}>
                {landing?.capacidadesHeadline || `Capacidades técnicas para ${keyword}`}
              </h2>
            </div>
            <p className="max-w-sm text-sm font-light leading-relaxed text-stone-500">
              Coordinamos las disciplinas críticas de cada proyecto bajo una sola responsabilidad.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {capacidades.map((cap) => (
              <article key={cap.codigo} className="border-b border-stone-200 py-10">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-serif text-5xl font-light text-stone-300">{cap.codigo}</span>
                  <span className="text-right font-mono text-[10px] uppercase tracking-[0.2em] text-amber-700">{cap.metrica}</span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-light text-stone-900">{cap.titulo}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-stone-600">{cap.resumen}</p>
                {cap.puntos.length > 0 && (
                  <ul className="mt-5 space-y-2">
                    {cap.puntos.map((punto, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-stone-800">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                        {punto}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Cómo trabajamos: fases con imagen */}
      {fases.length > 0 && (
        <section id="proceso" className="scroll-mt-36 bg-stone-100 py-20 sm:py-28">
          <Container>
            <div className="max-w-3xl">
              <span className={eyebrowClass}>Método ALKO</span>
              <h2 className={`mt-4 ${h2Class}`}>
                {landing?.processHeadline || `Cómo planificamos y ejecutamos ${keyword}`}
              </h2>
              <p className="mt-5 text-base font-light leading-relaxed text-stone-600">
                Un mismo equipo recorre todas las fases, con entregables y control en cada una.
              </p>
            </div>
            <ol className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {fases.map((fase, i) => (
                <li key={fase.id} className="group overflow-hidden bg-white">
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
                    {fase.imagen && (
                      <Image
                        src={fase.imagen}
                        alt={`Fase ${i + 1}: ${fase.title}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <span className="absolute left-4 top-4 bg-stone-950/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                      Fase {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="p-6 sm:p-7">
                    <h3 className="font-serif text-2xl font-light text-stone-900">{fase.title}</h3>
                    <p className="mt-3 text-sm font-light leading-relaxed text-stone-600">{fase.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}

      {/* Proyectos del servicio */}
      {showcase.length > 0 && (
        <section id="proyectos" className="scroll-mt-36 py-20 sm:py-28">
          <Container>
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <span className={eyebrowClass}>Proyectos</span>
                <h2 className={`mt-4 ${h2Class}`}>
                  {ownProjects.length > 0 ? `Proyectos de ${keyword}` : "Proyectos recientes de ALKO"}
                </h2>
              </div>
              <Link
                href={ROUTES.projects}
                className="group inline-flex items-center gap-2 self-start border-b border-stone-900 pb-1.5 text-xs font-semibold uppercase tracking-[0.22em] transition hover:border-amber-700 hover:text-amber-700 sm:self-auto"
              >
                Ver todos los proyectos
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:grid-rows-2">
              {showcase.map((p, i) => (
                <Link
                  key={p.slug}
                  href={`${ROUTES.projects}/${p.slug}`}
                  className={`group relative block overflow-hidden bg-stone-900 ${
                    i === 0 ? "aspect-[4/3] lg:row-span-2 lg:aspect-auto" : "aspect-[16/9]"
                  }`}
                >
                  <Image
                    src={p.imagen}
                    alt={`${p.title}: ${keyword} en ${p.ubicacion || "Madrid"}`}
                    fill
                    sizes={i === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 100vw, 50vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white sm:p-8">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                        {[p.ubicacion, p.superficie, p.plazo].filter(Boolean).join(" · ")}
                      </span>
                      <h3 className="mt-2 font-serif text-2xl font-light sm:text-3xl">{p.title}</h3>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 transition group-hover:bg-white group-hover:text-stone-900">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Imágenes de obra */}
      {galleryPhotos.length >= 3 && (
        <section aria-label={`Imágenes de ${keyword}`} className="pb-20 sm:pb-28">
          <Container>
            <Lightbox className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {galleryPhotos.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  data-lightbox-src={src}
                  data-lightbox-alt={`${Keyword} ${i + 1}`}
                  className={`group relative block overflow-hidden bg-stone-200 ${i === 0 ? "col-span-2 row-span-2 aspect-square lg:col-span-2" : "aspect-square"}`}
                  aria-label={`Ampliar imagen ${i + 1}`}
                >
                  <Image
                    src={src}
                    alt={`${Keyword} ${i + 1}`}
                    fill
                    sizes={i === 0 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 50vw, 33vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </button>
              ))}
            </Lightbox>
          </Container>
        </section>
      )}

      {/* Bloque de apoyo editable (título e imagen propios del servicio) */}
      {landing?.supportTitle && (
        <section className="border-t border-stone-200 py-20 sm:py-28">
          <Container>
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <h2 className={h2Class}>{landing.supportTitle}</h2>
              {landing.supportImage && (
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                  <Image src={landing.supportImage} alt={landing.supportTitle} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {fabricantes.length > 0 && <Materials fabricantes={fabricantes} />}

      {/* Preguntas frecuentes */}
      <section id="preguntas" className="scroll-mt-36 border-t border-stone-200 py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-4">
              <span className={eyebrowClass}>Preguntas frecuentes</span>
              <h2 className={`mt-4 ${h2Class}`}>
                {landing?.faqHeadline || `Preguntas frecuentes sobre ${keyword}`}
              </h2>
              <p className="mt-5 text-base font-light leading-relaxed text-stone-600">
                ¿No encuentras tu pregunta? Escríbenos y te responde un técnico.
              </p>
            </div>
            <div className="divide-y divide-stone-200 border-y border-stone-200 lg:col-span-8">
              {faqList.map((faq, i) => (
                <details key={i} className="group py-6" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                    <h3 className="font-serif text-xl font-light text-stone-900 sm:text-2xl">{faq.q}</h3>
                    <span aria-hidden="true" className="mt-1 text-2xl leading-none text-amber-700 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-stone-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Otros servicios */}
      {otrosServicios.length > 0 && (
        <section className="bg-stone-950 py-20 text-white sm:py-28">
          <Container>
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <h2 className="font-serif text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl">Otros servicios</h2>
              <Link
                href={ROUTES.sectors}
                className="group inline-flex items-center gap-2 self-start border-b border-white pb-1.5 text-xs font-semibold uppercase tracking-[0.22em] transition hover:border-amber-500 hover:text-amber-500 sm:self-auto"
              >
                Todos los servicios
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otrosServicios.map((item) => (
                <Link key={item.id} href={`${ROUTES.sectors}/${item.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-800">
                    {item.imagen && (
                      <Image
                        src={item.imagen}
                        alt={`${item.title} en Madrid`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                      />
                    )}
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-light transition-colors group-hover:text-amber-500">{item.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm font-light leading-relaxed text-white/60">{item.descripcion}</p>
                    </div>
                    <ArrowUpRight className="mt-1.5 h-5 w-5 shrink-0 text-white/50 transition group-hover:text-amber-500" />
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Artículos relacionados */}
      {articles.length > 0 && (
        <section className="py-20 sm:py-28">
          <Container>
            <div className="flex flex-col justify-between gap-6 border-b border-stone-200 pb-8 sm:flex-row sm:items-end">
              <h2 className="font-serif text-3xl font-light tracking-tight sm:text-4xl">Para saber más</h2>
              <Link
                href={ROUTES.articlesList}
                className="group inline-flex items-center gap-2 self-start border-b border-stone-900 pb-1.5 text-xs font-semibold uppercase tracking-[0.22em] transition hover:border-amber-700 hover:text-amber-700 sm:self-auto"
              >
                Ver todos los artículos
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <ContactCta settings={settings} />
    </main>
  );
}
