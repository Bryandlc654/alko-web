import { notFound } from "next/navigation";
import Image from "@/components/ui/Image";
import Link from "next/link";
import ContactTrigger from "@/components/contact/ContactTrigger";
import QuickContactForm from "@/components/ui/QuickContactForm";
import Lightbox from "@/components/ui/Lightbox";
import ContactCta from "@/components/sections/ContactCta";
import Materials from "@/components/sections/Materials";
import { parseService } from "@/lib/services";
import { ROUTES, SITE } from "@/lib/site";
import { sectorKeyword, sectorSlug } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import {
  getFabricantes,
  getFases,
  getHomeContent,
  getProjects,
  getSectorBySlug,
  getSectors,
  getSettings,
} from "@/lib/wordpress";

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
  // Canonical y Open Graph completos (nombre del sitio, idioma, URL e imagen con su alt).
  return pageMetadata({
    title: `${keyword.charAt(0).toUpperCase()}${keyword.slice(1)} en Madrid | ALKO`,
    description: sector.landing?.lead || sector.descripcion,
    path: `${ROUTES.sectors}/${sector.slug}`,
    image: sector.imagen || undefined,
    imageAlt: `${sector.title} en Madrid`,
  });
}

/** Compromisos por defecto si el servicio no tiene los suyos. */
const DEFAULT_COMMITMENTS = [
  { title: "Presupuesto cerrado", text: "Por partidas y acordado antes de empezar." },
  { title: "Plazo por escrito", text: "Con hitos de control durante toda la obra." },
  { title: "Un único equipo", text: "De proyecto a entrega, sin intermediarios." },
];

/** Dolores habituales si el servicio no tiene los suyos en el panel. */
const DEFAULT_PROBLEMS = [
  { avoid: "Presupuestos que crecen a mitad de obra", promise: "Precio cerrado por partidas, firmado antes de empezar" },
  { avoid: "Plazos que nadie cumple", promise: "Calendario por escrito con hitos de control" },
  { avoid: "Gremios descoordinados y llamadas a cinco personas", promise: "Un único jefe de obra como interlocutor" },
  { avoid: "Licencias y trámites que paralizan la obra", promise: "Tramitamos licencias, tasas e inspecciones por ti" },
];

/** Los tres pasos del embudo, desde el formulario hasta el inicio de la obra. */
const FUNNEL_STEPS = [
  { title: "Nos cuentas tu proyecto", text: "Por el formulario, por teléfono o por WhatsApp. Solo necesitamos lo esencial." },
  { title: "Visita y valoración técnica", text: "Un arquitecto técnico visita el inmueble, analiza la viabilidad y toma mediciones." },
  { title: "Propuesta cerrada y obra", text: "Recibes un presupuesto por partidas y un plazo por escrito. Tú decides cuándo empezamos." },
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

export default async function SectorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [sector, projects, fases, fabricantes, settings, homeContent] = await Promise.all([
    getSectorBySlug(slug),
    getProjects(),
    getFases(),
    getFabricantes(),
    getSettings(),
    getHomeContent(),
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

  // Solo proyectos de este servicio: sin obras propias no se muestran proyectos ni galería de otro tipo de obra.
  const ownProjects = projects.filter((project) => sectorSlug(project.servicio) === sector.slug);
  const showcase = ownProjects.slice(0, 3);
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

  // Fotos del «Método ALKO» propias de cada servicio: primero las de sus obras que no salen ya en la
  // página; si no tiene obras, sus propias fotos y después fotos de obra en curso de la portada.
  const usedImages = new Set([heroImage, introImage, introDetailImage, includesImage]);
  // Alterna entre las obras del servicio (una foto de cada una por turno) para que no salgan todas de la misma.
  const perProject = showcase.map((p) =>
    [p.imagen, ...(p.galeria || [])].filter((src): src is string => !!src && !usedImages.has(src)),
  );
  const ownProcessPhotos: string[] = [];
  for (let round = 0; perProject.some((list) => list.length > round); round++) {
    for (const list of perProject) if (list[round]) ownProcessPhotos.push(list[round]);
  }
  const obraPhotos = (homeContent.fases ?? []).map((f) => f.imagen).filter(Boolean) as string[];
  const processPool = Array.from(
    new Set(
      ownProcessPhotos.length >= fases.length
        ? ownProcessPhotos
        : [...ownProcessPhotos, introImage, includesImage, heroImage, ...obraPhotos],
    ),
  ).filter(Boolean);
  const processImage = (i: number, fallback?: string) =>
    processPool.length > 0 ? processPool[i % processPool.length] : fallback;

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

  const pad = (v: number) => String(v).padStart(2, "0");
  const telHref = `tel:${settings.telefono.replace(/[^+\d]/g, "")}`;
  const whatsappHref = `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`;
  const pains = problems.length > 0 ? problems : DEFAULT_PROBLEMS;

  // Prueba social: reseñas de las obras del servicio y, si no hay, de cualquier obra.
  const withReview = (list: typeof projects) => list.filter((p) => p.resenaTexto?.trim());
  const reviews = (withReview(ownProjects).length > 0 ? withReview(ownProjects) : withReview(projects)).slice(0, 3);

  /** Botón principal del embudo: abre el formulario completo con la división marcada. */
  const Cta = ({ where, label = "Solicitar valoración", className = "btn btn-ink" }: { where: string; label?: string; className?: string }) => (
    <ContactTrigger mode="avanzado" source={`Landing ${name} · ${where}`} tipo={name} className={className}>
      {label} <span aria-hidden="true">→</span>
    </ContactTrigger>
  );

  return (
    <main className="bg-paper text-ink">
      {jsonLd.map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}

      {/* 1 · Hero de captación: propuesta de valor a la izquierda y formulario corto a la derecha. */}
      <section id="valoracion" className="relative isolate overflow-hidden bg-ink text-paper">
        <Image src={heroImage} alt={`${Keyword} en Madrid, obra de ALKO`} fill priority sizes="100vw" className="hh-zoom -z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/65 to-black/40" />

        <div className="site-wrap grid grid-cols-12 items-center gap-x-6 gap-y-12 pb-16 pt-28 sm:pb-24 sm:pt-36 lg:min-h-[100svh] lg:pt-32">
          <div className="hh-rise col-span-12 lg:col-span-7">
            <p className="inline-flex items-center gap-3 border border-paper/25 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-paper/80">
              <span className="h-1.5 w-1.5 rounded-full bg-bronze-light" aria-hidden="true" />
              {landing?.heroTagline || `${name} · Madrid`}
            </p>
            <h1 className="display-title mt-8 max-w-[16ch] text-[2.7rem] leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              {/* Un titular que solo repite el nombre de la división («Residencial») no dice nada a
                  Google: entonces manda el H1 con la búsqueda («Reformas de viviendas en Madrid»). */}
              {landing?.heroHeadline && landing.heroHeadline.trim().toLowerCase() !== name.trim().toLowerCase()
                ? landing.heroHeadline
                : `${Keyword} en Madrid`}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/80">{lead}</p>

            <a href="#formulario" className="btn btn-paper mt-8 sm:hidden">
              Pedir valoración <span aria-hidden="true">↓</span>
            </a>

            <ul className="mt-8 hidden max-w-2xl grid-cols-1 gap-3 sm:grid sm:grid-cols-3">
              {commitments.slice(0, 3).map((item) => (
                <li key={item.title} className="flex gap-3 border-t border-paper/20 pt-3">
                  <span aria-hidden="true" className="text-bronze-light">✓</span>
                  <span>
                    <span className="block text-sm font-medium text-paper">{item.title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-paper/60">{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-paper/75">
              <a href={telHref} className="inline-flex items-center gap-2 transition-colors hover:text-paper">
                <span aria-hidden="true" className="text-bronze-light">☎</span> {settings.telefono}
              </a>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-paper">
                <span aria-hidden="true" className="text-bronze-light">↗</span> WhatsApp
              </a>
              {ownProjects.length > 0 && (
                <a href="#obras" className="inline-flex items-center gap-2 transition-colors hover:text-paper">
                  <span aria-hidden="true" className="text-bronze-light">↓</span> Ver {ownProjects.length} obras de {name}
                </a>
              )}
            </div>
          </div>

          <div className="hh-rise col-span-12 lg:col-span-5" style={{ animationDelay: ".15s" }}>
            <div id="formulario" className="scroll-mt-24 border border-paper/15 bg-ink/95 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.22em] text-bronze-light">Paso 1 de 3 · Sin compromiso</p>
              <h2 className="display-title mt-3 text-2xl leading-tight sm:text-3xl">Cuéntanos tu proyecto</h2>
              <p className="mb-6 mt-2 text-sm leading-relaxed text-paper/60">
                Un técnico del equipo de {name} revisa tu solicitud y te llama para concretar la visita.
              </p>
              <QuickContactForm compact source={`Landing ${name} · Hero`} email={settings.email} whatsappHref={whatsappHref} />
            </div>
          </div>
        </div>
      </section>

      {/* 2 · Barra de confianza: obras, compromisos y fabricantes. */}
      <section aria-label="Por qué ALKO" className="border-b border-ink/10 bg-paper">
        <div className="site-wrap grid grid-cols-2 lg:grid-cols-4">
          {[
            ownProjects.length > 0
              ? { value: pad(ownProjects.length), label: "Obras publicadas de esta división" }
              : { value: "01", label: "Interlocutor de principio a fin" },
            ...commitments.slice(0, 3).map((c) => ({ value: "✓", label: c.title })),
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-4 py-6 ${i % 2 === 1 ? "border-l border-ink/10 pl-5" : "pr-5"} ${i > 0 ? "lg:border-l lg:border-ink/10 lg:pl-6" : ""}`}>
              <span className="display-title text-3xl text-bronze sm:text-4xl">{item.value}</span>
              <span className="text-[11px] uppercase leading-snug tracking-[0.16em] text-mid">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3 · Problema: lo que suele salir mal y lo que garantizamos. */}
      <section className="bg-paper">
        <div className="site-wrap py-20 sm:py-28">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="reveal-item col-span-12 lg:col-span-5">
              <p className="eyebrow">¿Te suena?</p>
              <h2 className="display-title mt-5 text-[2.3rem] leading-[1.03] sm:text-5xl lg:text-6xl">
                {landing?.problemsHeadline || `Lo que suele salir mal en ${keyword}`}
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-mid">{sector.descripcion}</p>
              <Cta where="Problemas" className="btn btn-ink mt-8" />
            </div>
            <div className="reveal-item col-span-12 lg:col-span-7">
              <div className="grid grid-cols-2 gap-4 border-b border-ink pb-3 text-[10px] uppercase tracking-[0.22em]">
                <span className="text-mid">Lo habitual</span>
                <span className="text-bronze">Con ALKO</span>
              </div>
              <ul>
                {pains.map((p, i) => (
                  <li key={i} className="grid grid-cols-2 gap-4 border-b border-ink/15 py-5">
                    <span className="flex gap-3 text-mid">
                      <span aria-hidden="true" className="text-ink/30">✕</span>
                      <span className="line-through decoration-ink/20">{p.avoid}</span>
                    </span>
                    <span className="flex gap-3">
                      <span aria-hidden="true" className="text-bronze">✓</span>
                      {p.promise}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · Solución: qué incluye, con foto y capacidades resumidas. */}
      <section id="incluye" className="scroll-mt-24 bg-ink text-paper">
        <div className="site-wrap py-20 sm:py-28">
          <div className="grid grid-cols-12 gap-x-6 gap-y-12">
            <div className="col-span-12 lg:col-span-6">
              <p className="eyebrow eyebrow-light reveal-item">
                {landing?.includesSubtitle || parsedIncludes?.title || `Qué incluye nuestro servicio de ${keyword}`}
              </p>
              <h2 className="reveal-item display-title mt-5 text-[2.3rem] leading-[1.03] sm:text-5xl lg:text-6xl">
                {landing?.includesHeadline || "Todo en un mismo equipo técnico."}
              </h2>
              <ul className="reveal-item mt-10 border-t border-paper/15">
                {includesItems.map((item, i) => (
                  <li key={i} className="flex items-baseline gap-4 border-b border-paper/15 py-4">
                    <span aria-hidden="true" className="text-bronze-light">✓</span>
                    <span className="leading-snug text-paper/90">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="reveal-item mt-10 flex flex-wrap items-center gap-4">
                <Cta where="Qué incluye" className="btn btn-paper" />
                <a href={telHref} className="btn btn-ghost-light">
                  Llamar · {settings.telefono}
                </a>
              </div>
            </div>
            <div className="reveal-item col-span-12 lg:col-span-5 lg:col-start-8">
              <div className="relative aspect-[4/3] overflow-hidden bg-paper/10 lg:aspect-[4/5]">
                <Image src={includesImage} alt={`Qué incluye nuestro servicio de ${keyword}`} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
              </div>
            </div>
          </div>

          {/* Capacidades en formato compacto. */}
          <div className="mt-20 border-t border-paper/15 pt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="display-title text-2xl sm:text-3xl">
                {landing?.capacidadesHeadline || `Capacidades técnicas para ${keyword}`}
              </h3>
              <p className="text-[10px] uppercase tracking-[0.22em] text-paper/50">
                {landing?.capacidadesSubtitle || "Disciplinas técnicas"}
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden bg-paper/15 sm:grid-cols-2 lg:grid-cols-3">
              {capacidades.map((cap) => (
                <article key={cap.codigo} className="reveal-item bg-ink p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[11px] tracking-[0.18em] text-bronze-light">{cap.codigo}</span>
                    <span className="text-right text-[10px] uppercase tracking-[0.2em] text-paper/45">{cap.metrica}</span>
                  </div>
                  <h4 className="display-title mt-4 text-xl leading-tight">{cap.titulo}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-paper/60">{cap.resumen}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5 · Prueba: obras del servicio y reseñas de clientes. */}
      {(showcase.length > 0 || reviews.length > 0) && (
        <section id="obras" className="scroll-mt-24 bg-white">
          <div className="site-wrap py-20 sm:py-28">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow reveal-item">Resultados reales</p>
                <h2 className="reveal-item display-title mt-5 max-w-3xl text-[2.3rem] leading-[1.03] sm:text-5xl lg:text-6xl">
                  {showcase.length > 0 ? `Obras de ${keyword} que ya hemos entregado` : "Lo que dicen nuestros clientes"}
                </h2>
              </div>
              {showcase.length > 0 && (
                <Link href={ROUTES.projects} className="arrow-link self-start sm:self-auto">
                  Ver todas las obras <span aria-hidden="true">↗</span>
                </Link>
              )}
            </div>

            {showcase.length > 0 && (
              <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {showcase.map((p) => (
                  <li key={p.slug} className="reveal-item">
                    <Link href={`${ROUTES.projects}/${p.slug}`} className="group flex h-full flex-col">
                      <span className="relative block aspect-[4/3] overflow-hidden bg-piedra">
                        <Image
                          src={p.imagen}
                          alt={`${p.title}: ${keyword} en ${p.ubicacion || "Madrid"}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.04]"
                        />
                      </span>
                      <span className="display-title mt-5 block text-2xl leading-tight transition-colors group-hover:text-bronze">{p.title}</span>
                      <span className="mt-4 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/15 pt-3 text-[10px] uppercase tracking-[0.18em]">
                        {[
                          ["Zona", p.ubicacion?.split(",")[0] || "Madrid"],
                          ["Superficie", p.superficie],
                          ["Plazo", p.plazo],
                        ]
                          .filter(([, v]) => v)
                          .map(([k, v]) => (
                            <span key={k}>
                              <span className="block text-ink/40">{k}</span>
                              <span className="mt-1 block text-ink">{v}</span>
                            </span>
                          ))}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {galleryPhotos.length >= 3 && (
              <Lightbox className="mt-12 grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
                {galleryPhotos.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    data-lightbox-src={src}
                    data-lightbox-alt={`${Keyword} ${i + 1}`}
                    aria-label={`Ampliar imagen ${i + 1}`}
                    className="group relative block aspect-square cursor-zoom-in overflow-hidden bg-piedra"
                  >
                    <Image src={src} alt={`${Keyword} ${i + 1}`} fill sizes="(max-width: 1024px) 33vw, 16vw" className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.06]" />
                  </button>
                ))}
              </Lightbox>
            )}

            {reviews.length > 0 && (
              <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${showcase.length > 0 ? "mt-16 border-t border-ink/15 pt-12" : "mt-12"}`}>
                {reviews.map((p) => (
                  <figure key={p.id} className="reveal-item flex flex-col border border-ink/10 bg-paper p-6 sm:p-8">
                    <div className="flex gap-1 text-bronze" role="img" aria-label={`${p.resenaValoracion || 5} de 5 estrellas`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg key={i} viewBox="0 0 20 20" aria-hidden="true" className={`h-4 w-4 ${i < (p.resenaValoracion || 5) ? "fill-current" : "fill-ink/15"}`}>
                          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="display-title mt-5 line-clamp-6 text-xl leading-snug">«{p.resenaTexto?.trim()}»</blockquote>
                    <figcaption className="mt-auto border-t border-ink/10 pt-4 text-sm [&:not(:first-child)]:mt-6">
                      <span className="block font-medium">{p.resenaAutor || p.cliente || "Cliente de ALKO"}</span>
                      <span className="mt-0.5 block text-[10px] uppercase tracking-[0.2em] text-mid">{p.resenaCargo || p.title}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6 · Cómo funciona: tres pasos desde el formulario hasta la obra. */}
      <section className="bg-paper">
        <div className="site-wrap py-20 sm:py-28">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="reveal-item col-span-12 lg:col-span-4">
              <p className="eyebrow">Cómo funciona</p>
              <h2 className="display-title mt-5 text-[2.3rem] leading-[1.03] sm:text-5xl">Empezar es sencillo</h2>
              <p className="mt-6 max-w-sm leading-relaxed text-mid">
                {landing?.processHeadline || `Así planificamos y ejecutamos ${keyword}`}: un mismo equipo, con entregables y control en cada fase.
              </p>
            </div>
            <ol className="col-span-12 grid grid-cols-1 gap-px overflow-hidden bg-ink/10 sm:grid-cols-3 lg:col-span-8">
              {FUNNEL_STEPS.map((step, i) => (
                <li key={step.title} className="reveal-item flex flex-col bg-paper p-6 sm:p-7">
                  <span className="display-title text-5xl text-bronze">{pad(i + 1)}</span>
                  <h3 className="display-title mt-6 text-xl leading-tight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mid">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>

          {fases.length > 0 && (
            <details className="group mt-10 border-y border-ink/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[11px] uppercase tracking-[0.2em]">
                <span>
                  Ver las {fases.length} fases de la obra <span className="text-mid">· Método ALKO</span>
                </span>
                <span aria-hidden="true" className="text-xl leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <ol className="grid grid-cols-1 gap-x-8 pb-6 sm:grid-cols-2 lg:grid-cols-3">
                {fases.map((fase, i) => {
                  const src = processImage(i, fase.imagen);
                  return (
                    <li key={fase.id} className="flex gap-4 border-t border-ink/10 py-5">
                      <span className="relative aspect-square w-16 shrink-0 overflow-hidden bg-piedra">
                        {src && <Image src={src} alt="" fill sizes="64px" className="object-cover" />}
                      </span>
                      <span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-bronze">Fase {pad(i + 1)}</span>
                        <span className="display-title mt-1 block text-lg">{fase.title}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-mid">{fase.texto}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </details>
          )}
        </div>
      </section>

      {/* 7 · Oferta y garantías, con llamada a la acción fuerte. */}
      <section className="relative isolate overflow-hidden bg-ink text-paper">
        <Image src={introImage} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-25" />
        <div className="site-wrap py-20 sm:py-28">
          <div className="grid grid-cols-12 items-end gap-x-6 gap-y-10">
            <div className="reveal-item col-span-12 lg:col-span-7">
              <p className="eyebrow eyebrow-light">Nuestro compromiso por escrito</p>
              <h2 className="display-title mt-5 text-[2.4rem] leading-[1.02] sm:text-6xl lg:text-7xl">
                {landing?.supportTitle || `Tu obra de ${keyword}, sin sorpresas.`}
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/75">
                {landing?.supportContent ||
                  "Integramos bajo una sola dirección técnica el proyecto, el cálculo de instalaciones, las compras y la obra. Así evitamos las fricciones habituales entre proyectistas y constructoras, y el presupuesto pactado es el definitivo."}
              </p>
            </div>
            <div className="reveal-item col-span-12 lg:col-span-4 lg:col-start-9">
              <ul className="border-t border-paper/20">
                {commitments.slice(0, 3).map((c, i) => (
                  <li key={c.title} className="flex gap-4 border-b border-paper/20 py-4">
                    <span className="text-[10px] tracking-[0.18em] text-bronze-light">{pad(i + 1)}</span>
                    <span>
                      <span className="display-title block text-lg">{c.title}</span>
                      <span className="block text-sm text-paper/60">{c.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3">
                <Cta where="Garantías" label="Quiero mi valoración" className="btn btn-paper justify-center" />
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light justify-center">
                  Escribir por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {fabricantes.length > 0 && <Materials fabricantes={fabricantes} />}

      {/* 8 · Objeciones: preguntas frecuentes. */}
      <section id="preguntas" className="scroll-mt-24 bg-paper">
        <div className="site-wrap py-20 sm:py-28">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="reveal-item col-span-12 lg:col-span-4">
              <p className="eyebrow">Antes de decidir</p>
              <h2 className="display-title mt-5 text-[2.3rem] leading-[1.03] sm:text-5xl">
                {landing?.faqHeadline || `Preguntas frecuentes sobre ${keyword}`}
              </h2>
              <p className="mt-6 leading-relaxed text-mid">¿Tienes otra duda? Te la resuelve un técnico.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={telHref} className="btn btn-outline">
                  Llamar
                </a>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  WhatsApp
                </a>
              </div>
            </div>
            <div className="col-span-12 border-t border-ink/15 lg:col-span-7 lg:col-start-6">
              {faqList.map((faq, i) => (
                <details key={i} className="group border-b border-ink/15 py-6" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-start gap-5">
                    <h3 className="display-title flex-1 text-xl leading-snug sm:text-2xl">{faq.q}</h3>
                    <span aria-hidden="true" className="text-2xl leading-none transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl leading-relaxed text-mid">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9 · Cierre: formulario completo con la división marcada. */}
      <ContactCta
        settings={settings}
        titulo={landing?.ctaHeadline || `Hablemos de tu proyecto\nde ${keyword}.`}
        descripcion={
          landing?.ctaText ||
          "Cuéntanos qué necesitas y el equipo técnico te responderá con una valoración del alcance, el plazo y el presupuesto."
        }
        imagen={landing?.ctaImage || includesImage}
        source={`Landing ${name} · Cierre`}
        sectorSlug={sector.slug}
      />
    </main>
  );
}
