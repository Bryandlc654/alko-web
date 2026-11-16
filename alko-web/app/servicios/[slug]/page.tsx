import { notFound } from "next/navigation";
import Image from "@/components/ui/Image";
import Link from "next/link";
import ContactTrigger from "@/components/contact/ContactTrigger";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import EditorialSection from "@/components/editorial/EditorialSection";
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

export default async function SectorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [sector, sectors, projects, fases, fabricantes, settings, articles, homeContent] = await Promise.all([
    getSectorBySlug(slug),
    getSectors(),
    getProjects(),
    getFases(),
    getFabricantes(),
    getSettings(),
    getArticles(3),
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

  // Numeración de las secciones según las que aparecen.
  let n = 0;
  const num = () => String(++n).padStart(2, "0");
  const pad = (v: number) => String(v).padStart(2, "0");

  const index = [
    { id: "enfoque", label: "Enfoque" },
    { id: "incluye", label: "Qué incluye" },
    { id: "capacidades", label: "Capacidades" },
    ...(fases.length > 0 ? [{ id: "proceso", label: "Método" }] : []),
    ...(showcase.length > 0 ? [{ id: "proyectos", label: "Proyectos" }] : []),
    { id: "preguntas", label: "Preguntas" },
  ];

  return (
    <main className="bg-paper text-ink">
      {jsonLd.map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}

      <EditorialHeader
        breadcrumbs={[{ label: "Servicios", href: ROUTES.sectors }, { label: name }]}
        eyebrow="Servicio"
        index={sector.numero || undefined}
        title={landing?.heroHeadline || `${Keyword} en Madrid`}
        description={lead}
        image={heroImage}
        imageAlt={`${Keyword} en Madrid, obra de ALKO`}
        caption={name}
        aside={
          <div>
            <ul className="border-t border-ink/15">
              {commitments.slice(0, 3).map((item, i) => (
                <li key={item.title} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 border-b border-ink/15 py-4">
                  <span className="pt-1 text-[10px] tracking-[0.18em] text-bronze">{pad(i + 1)}</span>
                  <span>
                    <span className="display-title block text-lg leading-tight">{item.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-mid">{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <ContactTrigger mode="avanzado" source={`Servicio ${name}`} tipo={name} className="btn btn-ink">
                Solicitar valoración <span aria-hidden="true">→</span>
              </ContactTrigger>
              {showcase.length > 0 && (
                <a href="#proyectos" className="btn btn-outline">
                  Ver proyectos <span aria-hidden="true">↓</span>
                </a>
              )}
            </div>
          </div>
        }
      />

      {/* Índice de la página. */}
      <nav aria-label={`Contenido de ${name}`} className="bg-paper">
        <div className="site-wrap">
          <ul className="no-scrollbar -mx-[var(--gutter)] flex overflow-x-auto border-y border-ink/15 px-[var(--gutter)] sm:mx-0 sm:px-0">
            {index.map((item, i) => (
              <li key={item.id} className="shrink-0 sm:flex-1">
                <a
                  href={`#${item.id}`}
                  className={`flex items-baseline gap-3 whitespace-nowrap py-4 pr-6 text-[10px] uppercase tracking-[0.22em] text-mid transition-colors hover:text-ink sm:pr-4 ${
                    i > 0 ? "border-l border-ink/15 pl-6 sm:pl-4" : ""
                  }`}
                >
                  <span className="text-bronze">{pad(i + 1)}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Enfoque: texto, composición de fotos y lo que evitamos frente a lo que garantizamos. */}
      <EditorialSection
        id="enfoque"
        number={num()}
        label={landing?.statsTitle || `${name} con ALKO`}
        title={landing?.problemsHeadline || `Especialistas en ${keyword} en Madrid`}
        intro={sector.descripcion}
      >
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="reveal-item col-span-12 xl:col-span-5">
            <p className="leading-relaxed text-mid">
              {landing?.supportContent ||
                "Integramos bajo una sola dirección técnica el proyecto, el cálculo de instalaciones, las compras y la obra. Así evitamos las fricciones habituales entre proyectistas y constructoras, y el presupuesto pactado es el definitivo."}
            </p>
            <ContactTrigger mode="avanzado" source={`Servicio ${name}`} tipo={name} className="arrow-link mt-8">
              Hablar con un técnico <span aria-hidden="true">→</span>
            </ContactTrigger>
          </div>
          <div className="reveal-item col-span-12 grid grid-cols-12 gap-4 xl:col-span-7">
            <figure className="col-span-8">
              <div className="relative aspect-[4/5] overflow-hidden bg-piedra">
                <Image src={introImage} alt={`${Keyword} en Madrid por ALKO`} fill sizes="(max-width: 1280px) 60vw, 35vw" className="object-cover" />
              </div>
            </figure>
            <figure className="col-span-4 flex flex-col justify-end">
              <div className="relative aspect-[3/4] overflow-hidden bg-piedra">
                <Image src={introDetailImage} alt={`Detalle de ${keyword}`} fill sizes="(max-width: 1280px) 30vw, 18vw" className="object-cover" />
              </div>
              <figcaption className="mt-3 text-[10px] uppercase tracking-[0.22em] text-mid">Detalle · {name}</figcaption>
            </figure>
          </div>
        </div>

        {problems.length > 0 && (
          <div className="reveal-item mt-16 sm:mt-20">
            <div className="grid grid-cols-2 gap-6 border-b border-ink pb-3 text-[10px] uppercase tracking-[0.22em]">
              <span className="text-mid">Lo que evitamos</span>
              <span className="text-bronze">Lo que garantizamos</span>
            </div>
            <ul>
              {problems.map((p, i) => (
                <li key={i} className="grid grid-cols-1 gap-2 border-b border-ink/15 py-5 sm:grid-cols-2 sm:gap-6">
                  <span className="text-mid line-through decoration-ink/25">{p.avoid}</span>
                  <span className="flex gap-3">
                    <span aria-hidden="true" className="text-bronze">↘</span>
                    {p.promise}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </EditorialSection>

      {/* Qué incluye: lista numerada a dos columnas y foto, sobre carbón. */}
      <EditorialSection
        id="incluye"
        tone="ink"
        number={num()}
        label={landing?.includesSubtitle || parsedIncludes?.title || "Qué incluye"}
        title={landing?.includesHeadline || "Todo en un mismo equipo técnico."}
      >
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <ol className="reveal-item col-span-12 grid grid-cols-1 content-start border-t border-paper/15 sm:grid-cols-2 sm:gap-x-8 xl:col-span-7">
            {includesItems.map((item, i) => (
              <li key={i} className="flex items-baseline gap-4 border-b border-paper/15 py-4">
                <span className="text-[10px] tracking-[0.18em] text-bronze-light">{pad(i + 1)}</span>
                <span className="leading-snug text-paper/90">{item}</span>
              </li>
            ))}
          </ol>
          <figure className="reveal-item col-span-12 xl:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden bg-paper/10 xl:aspect-[4/5]">
              <Image src={includesImage} alt={`Qué incluye nuestro servicio de ${keyword}`} fill sizes="(max-width: 1280px) 100vw, 30vw" className="object-cover" />
            </div>
            <figcaption className="mt-3 text-[10px] uppercase tracking-[0.22em] text-paper/50">{Keyword}</figcaption>
          </figure>
        </div>
      </EditorialSection>

      {/* Capacidades técnicas: rejilla de celdas con filetes. */}
      <EditorialSection
        id="capacidades"
        tone="white"
        number={num()}
        label={landing?.capacidadesSubtitle || "Disciplinas técnicas"}
        title={landing?.capacidadesHeadline || `Capacidades técnicas para ${keyword}`}
        intro="Coordinamos las disciplinas críticas de cada proyecto bajo una sola responsabilidad."
        wide
      >
        <div className="grid grid-cols-1 overflow-hidden border-l border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-3">
          {capacidades.map((cap) => (
            <article key={cap.codigo} className="reveal-item flex flex-col border-b border-r border-ink/15 p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <span className="display-title text-4xl text-bronze">{cap.codigo}</span>
                <span className="text-right text-[10px] uppercase tracking-[0.22em] text-mid">{cap.metrica}</span>
              </div>
              <h3 className="display-title mt-8 text-2xl leading-tight">{cap.titulo}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mid">{cap.resumen}</p>
              {cap.puntos.length > 0 && (
                <ul className="mt-auto space-y-1.5 border-t border-ink/10 pt-4 text-sm [&:not(:first-child)]:mt-6">
                  {cap.puntos.map((punto, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span aria-hidden="true" className="text-bronze">—</span>
                      {punto}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </EditorialSection>

      {/* Método: fases en filas con miniatura. */}
      {fases.length > 0 && (
        <EditorialSection
          id="proceso"
          number={num()}
          label="Método ALKO"
          title={landing?.processHeadline || `Cómo planificamos y ejecutamos ${keyword}`}
          intro="Un mismo equipo recorre todas las fases, con entregables y control en cada una."
        >
          <ol className="border-t border-ink/15">
            {fases.map((fase, i) => {
              const src = processImage(i, fase.imagen);
              return (
                <li key={fase.id} className="reveal-item grid grid-cols-12 items-start gap-x-6 gap-y-3 border-b border-ink/15 py-6">
                  <span className="col-span-12 text-[10px] uppercase tracking-[0.22em] text-bronze sm:col-span-2 sm:pt-2">
                    Fase {pad(i + 1)}
                  </span>
                  <h3 className="display-title col-span-12 text-2xl leading-tight sm:col-span-4">{fase.title}</h3>
                  <p className="col-span-8 text-sm leading-relaxed text-mid sm:col-span-4">{fase.texto}</p>
                  <div className="relative col-span-4 aspect-[4/3] overflow-hidden bg-piedra sm:col-span-2">
                    {src && <Image src={src} alt={`Fase ${i + 1}: ${fase.title}`} fill sizes="(max-width: 640px) 30vw, 12vw" className="object-cover" />}
                  </div>
                </li>
              );
            })}
          </ol>
        </EditorialSection>
      )}

      {/* Proyectos del servicio y fotos de obra. */}
      {showcase.length > 0 && (
        <EditorialSection
          id="proyectos"
          tone="white"
          number={num()}
          label={`${pad(ownProjects.length)} ${ownProjects.length === 1 ? "proyecto" : "proyectos"}`}
          title={`Proyectos de ${keyword}`}
          wide
        >
          <ul className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {showcase.map((p, i) => (
              <li key={p.slug} className="reveal-item">
                <Link href={`${ROUTES.projects}/${p.slug}`} className="group flex h-full flex-col">
                  <span className="relative block aspect-[4/5] overflow-hidden bg-piedra">
                    <Image
                      src={p.imagen}
                      alt={`${p.title}: ${keyword} en ${p.ubicacion || "Madrid"}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-4 top-4 bg-paper px-2 py-1 text-[10px] tracking-[0.18em] text-ink">{pad(i + 1)}</span>
                  </span>
                  <span className="mt-5 flex items-center justify-between gap-4 border-t border-ink/15 pt-4 text-[10px] uppercase tracking-[0.22em] text-mid">
                    <span>{p.ubicacion || "Madrid"}</span>
                    <span>{[p.superficie, p.anio].filter(Boolean).join(" · ")}</span>
                  </span>
                  <span className="display-title mt-3 block text-2xl leading-tight transition-colors group-hover:text-bronze">{p.title}</span>
                  <span className="mt-auto block pt-5">
                    <span className="arrow-link">
                      Ver proyecto <span aria-hidden="true">↗</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {galleryPhotos.length >= 3 && (
            <Lightbox className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
              {galleryPhotos.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  data-lightbox-src={src}
                  data-lightbox-alt={`${Keyword} ${i + 1}`}
                  aria-label={`Ampliar imagen ${i + 1}`}
                  className="group relative block aspect-square cursor-zoom-in overflow-hidden bg-piedra"
                >
                  <Image
                    src={src}
                    alt={`${Keyword} ${i + 1}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 16vw"
                    className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.06]"
                  />
                </button>
              ))}
            </Lightbox>
          )}

          <div className="mt-12 flex justify-end">
            <Link href={ROUTES.projects} className="arrow-link">
              Ver todas las obras <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </EditorialSection>
      )}

      {/* Bloque de apoyo editable (título e imagen propios del servicio). */}
      {landing?.supportTitle && (
        <section className="bg-paper">
          <div className="site-wrap py-20 sm:py-28">
            <div className="grid grid-cols-12 items-end gap-x-6 gap-y-10 border-t border-ink/15 pt-8">
              <h2 className="reveal-item display-title col-span-12 text-[2.2rem] leading-[1.05] sm:text-5xl lg:col-span-6 lg:text-6xl">
                {landing.supportTitle}
              </h2>
              {landing.supportImage && (
                <div className="reveal-item relative col-span-12 aspect-[4/3] overflow-hidden bg-piedra lg:col-span-5 lg:col-start-8">
                  <Image src={landing.supportImage} alt={landing.supportTitle} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {fabricantes.length > 0 && <Materials fabricantes={fabricantes} />}

      {/* Preguntas frecuentes. */}
      <EditorialSection
        id="preguntas"
        number={num()}
        label="Preguntas frecuentes"
        title={landing?.faqHeadline || `Preguntas frecuentes sobre ${keyword}`}
        intro="¿No encuentras tu pregunta? Escríbenos y te responde un técnico."
      >
        <div className="border-t border-ink/15">
          {faqList.map((faq, i) => (
            <details key={i} className="group border-b border-ink/15 py-6" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-start gap-5">
                <span className="pt-1.5 text-[10px] tracking-[0.18em] text-bronze">{pad(i + 1)}</span>
                <h3 className="display-title flex-1 text-xl leading-snug sm:text-2xl">{faq.q}</h3>
                <span aria-hidden="true" className="text-2xl leading-none transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="ml-9 mt-4 max-w-2xl leading-relaxed text-mid">{faq.a}</p>
            </details>
          ))}
        </div>
      </EditorialSection>

      {/* Otros servicios: índice en filas con miniatura. */}
      {otrosServicios.length > 0 && (
        <section className="bg-ink text-paper">
          <div className="site-wrap py-20 sm:py-28">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow eyebrow-light">Divisiones</p>
                <h2 className="display-title mt-4 text-4xl leading-none sm:text-5xl lg:text-6xl">Otros servicios</h2>
              </div>
              <Link href={ROUTES.sectors} className="arrow-link self-start text-paper sm:self-auto">
                Todos los servicios <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <ul className="mt-12 border-t border-paper/15">
              {otrosServicios.map((item, i) => (
                <li key={item.id}>
                  <Link
                    href={`${ROUTES.sectors}/${item.slug}`}
                    className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 border-b border-paper/15 py-5 sm:grid-cols-[3rem_minmax(0,4fr)_minmax(0,5fr)_6rem_auto] sm:gap-6"
                  >
                    <span className="text-[10px] tracking-[0.18em] text-bronze-light">{item.numero || pad(i + 1)}</span>
                    <span className="display-title text-xl leading-tight transition-colors group-hover:text-bronze-light sm:text-2xl">
                      {item.title}
                    </span>
                    <span className="hidden truncate text-sm text-paper/55 sm:block">{item.descripcion}</span>
                    <span className="relative hidden aspect-[4/3] overflow-hidden bg-paper/10 sm:block">
                      {item.imagen && (
                        <Image
                          src={item.imagen}
                          alt=""
                          fill
                          sizes="96px"
                          className="object-cover opacity-80 transition duration-700 group-hover:scale-110 group-hover:opacity-100"
                        />
                      )}
                    </span>
                    <span aria-hidden="true" className="text-paper/50 transition-transform group-hover:translate-x-1 group-hover:text-paper">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Artículos relacionados. */}
      {articles.length > 0 && (
        <section className="bg-paper">
          <div className="site-wrap py-20 sm:py-28">
            <div className="flex flex-col gap-4 border-t border-ink/15 pt-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-mid">Journal</p>
                <h2 className="display-title mt-4 text-4xl leading-none sm:text-5xl">Para saber más</h2>
              </div>
              <Link href={ROUTES.journal} className="arrow-link self-start sm:self-auto">
                Ver el Journal <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactCta settings={settings} source={`Servicio ${sector.title}`} sectorSlug={sector.slug} />
    </main>
  );
}
