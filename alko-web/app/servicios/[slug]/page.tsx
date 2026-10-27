import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ContactTrigger from "@/components/contact/ContactTrigger";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import QuickContactForm from "@/components/ui/QuickContactForm";
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

export const revalidate = 60;

export async function generateStaticParams() {
  const sectors = await getSectors();
  // Oficinas tiene su propia página (app/servicios/oficinas).
  return sectors.filter((s) => s.slug !== "oficinas").map((s) => ({ slug: s.slug }));
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

/** Compromisos que se repiten en toda la página (cabecera y franja de confianza). */
const COMMITMENTS = [
  { title: "Presupuesto cerrado", text: "Por partidas y acordado antes de empezar" },
  { title: "Plazo por escrito", text: "Con hitos de control durante la obra" },
  { title: "Un único equipo", text: "De proyecto a entrega, sin intermediarios" },
];

/** Fotografías de obra para completar el mosaico cuando un servicio tiene pocas imágenes propias. */
const EXTRA_PHOTOS = ["/service-interior-2.jpg", "/terrace-ocean.jpg", "/el-viso.jpg", "/setart.jpg"];

/** Lo que suele fallar en una obra y lo que ALKO pone en su lugar (frases cortas, con imagen). */
const PROBLEMS = [
  { avoid: "Gremios descoordinados", promise: "Un único equipo coordina toda la obra", phase: 2 },
  { avoid: "Sobrecostes y retrasos", promise: "Presupuesto y plazo cerrados por escrito", phase: 3 },
  { avoid: "Nadie responde del conjunto", promise: "Un responsable técnico a pie de obra", phase: 1 },
];

const FAQ = [
  {
    q: "¿Cómo empieza el proceso?",
    a: "Nos cuentas qué necesitas, por formulario, por teléfono o por WhatsApp. Un técnico estudia el encargo y te responde con una valoración del alcance, el plazo y el presupuesto.",
  },
  {
    q: "¿Qué necesito para pedir una valoración?",
    a: "Basta con tu nombre y un teléfono o un correo. Si tienes planos, fotografías o un listado de lo que quieres hacer, puedes enviarlos después por WhatsApp o por correo para afinar la valoración.",
  },
  {
    q: "¿Cómo se fija el precio?",
    a: "El presupuesto se desglosa por partidas y se acuerda antes de empezar. Si durante la obra surge algún cambio, se valora y se aprueba antes de ejecutarlo.",
  },
  {
    q: "¿Cuánto tarda una obra?",
    a: "Depende del alcance. El plazo se fija por escrito antes de comenzar, con hitos de control que permiten seguir el avance y anticipar cualquier desviación.",
  },
  {
    q: "¿Puedo seguir la obra mientras se ejecuta?",
    a: "Sí. Un responsable técnico la acompaña a diario y te mantiene informado. Cada fase se verifica antes de pasar a la siguiente, hasta la recepción final.",
  },
];

export default async function SectorDetail({
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

  const { lead, sections } = parseService(sector.content);
  const includes = sections.find((s) => s.items.length > 0 && /incluye/i.test(s.title)) ?? sections.find((s) => s.items.length > 0);
  const others = sections.filter((s) => s !== includes);

  // Obras de este servicio primero; si faltan, se completan con las demás.
  const own = projects.filter((project) => project.servicio === sector.slug);
  const showcase = [...own, ...projects.filter((project) => !own.includes(project))].slice(0, 3);
  const otros = sectors.filter((item) => item.slug !== sector.slug);

  // Imágenes para las secciones visuales (sin repetir): servicio, obras y fases.
  const phaseImage = (index: number) => fases[index]?.imagen || sector.imagen;
  const mosaic = [
    ...new Set(
      [
        sector.imagen,
        ...own.flatMap((project) => [project.imagen, ...project.galeria]),
        ...projects.flatMap((project) => [project.imagen, ...project.galeria]),
        ...EXTRA_PHOTOS,
      ].filter(Boolean),
    ),
  ].slice(0, 5);
  const supportImage = own[0]?.imagen || projects[0]?.imagen || sector.imagen;

  const whatsappHref = `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`;
  const telHref = `tel:${settings.telefono.replace(/[^+\d]/g, "")}`;
  const cta =
    "inline-flex items-center justify-center gap-2 rounded-full bg-amber-700 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-xl transition hover:bg-white hover:text-stone-900 active:scale-95";

  const stats = [
    { value: String(projects.length).padStart(2, "0"), label: "Proyectos entregados" },
    ...COMMITMENTS.map((item) => ({ value: item.title, label: item.text })),
  ];

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
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <main className="bg-white text-stone-900">
      {jsonLd.map((data, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}

      {/* 1. Atención: promesa, compromisos y formulario rápido a la vista */}
      <header className="relative isolate overflow-hidden bg-stone-950 pb-16 pt-36 text-white sm:pb-24 sm:pt-44">
        <Image
          src={sector.imagen}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-stone-950/95 via-stone-950/75 to-stone-950/40" />
        <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-stone-950/70 to-transparent" />

        <Container className="relative">
          <Breadcrumbs
            items={[{ label: "Servicios", href: ROUTES.sectors }, { label: sector.title }]}
            className="mb-10"
          />
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <span className="mb-5 block font-mono text-[11px] uppercase tracking-[0.25em] text-white/70 sm:text-xs">
                Servicio {sector.numero}
              </span>
              <h1 className="font-display text-4xl font-light leading-[1.03] tracking-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)] sm:text-5xl md:text-6xl lg:text-7xl">
                {sector.title}
              </h1>
              <p className="mt-6 max-w-xl font-sans text-lg font-light leading-relaxed text-white/85 sm:line-clamp-3 sm:text-xl">
                {lead || sector.descripcion}
              </p>

              <ul className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
                {COMMITMENTS.map((item) => (
                  <li key={item.title} className="flex items-start gap-3 text-sm font-light text-white/85">
                    <span aria-hidden="true" className="mt-1 text-amber-500">
                      ✓
                    </span>
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <ContactTrigger mode="avanzado" source={`Servicio ${sector.title} (cabecera)`} tipo={sector.title} className={cta}>
                  Solicitar valoración
                </ContactTrigger>
                <a
                  href="#como-trabajamos"
                  className="border-b border-white/60 pb-1 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:border-amber-500 hover:text-amber-500"
                >
                  Ver cómo trabajamos
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-white/15 bg-stone-950/85 p-6 shadow-2xl backdrop-blur sm:p-8">
                <span className="block font-mono text-[11px] uppercase tracking-[0.25em] text-amber-500">
                  Respuesta de un técnico
                </span>
                <h2 className="mb-6 mt-3 font-serif text-2xl font-light leading-tight tracking-tight sm:text-3xl">
                  Cuéntanos qué necesitas y te llamamos.
                </h2>
                <QuickContactForm
                  source={`Servicio ${sector.title} (formulario de cabecera)`}
                  email={settings.email}
                  whatsappHref={whatsappHref}
                />
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* 2. Confianza: cifras y compromisos */}
      <section aria-label="Compromisos" className="border-b border-stone-200 bg-stone-50">
        <Container>
          <dl className="grid grid-cols-2 divide-stone-200 lg:grid-cols-4 lg:divide-x">
            {stats.map((stat, index) => (
              <div
                key={stat.value}
                className={`px-2 py-8 sm:px-8 ${index % 2 === 1 ? "border-l border-stone-200 lg:border-l-0" : ""} ${index > 1 ? "border-t border-stone-200 lg:border-t-0" : ""}`}
              >
                <div className="flex flex-col-reverse">
                  <dt className="mt-2 text-sm font-light leading-snug text-stone-600">{stat.label}</dt>
                  <dd className="font-serif text-2xl font-light leading-tight tracking-tight text-stone-900 sm:text-3xl">
                    {stat.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* 3. Interés: lo que evitamos, en tres tarjetas con imagen */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="reveal-item max-w-3xl">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500 sm:text-xs">
              Por qué ALKO
            </span>
            <h2 className="mt-5 font-serif text-3xl font-light leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Una obra sin sorpresas.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {PROBLEMS.map((item, index) => (
              <div
                key={item.promise}
                className="group reveal-item relative isolate flex aspect-[4/5] flex-col justify-between overflow-hidden bg-stone-900 p-6 text-white sm:p-8 md:aspect-[3/4]"
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <Image
                  src={phaseImage(item.phase)}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="-z-10 object-cover object-center transition duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950/95 via-stone-950/35 to-stone-950/30" />
                <span className="self-start rounded-full border border-white/30 bg-stone-950/40 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/85 backdrop-blur">
                  Evita: {item.avoid}
                </span>
                <div>
                  <span className="font-mono text-xs tabular-nums text-amber-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 font-serif text-2xl font-light leading-snug tracking-tight sm:text-3xl">
                    {item.promise}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Deseo: qué incluye, con imagen grande */}
      {includes && (
        <section id="incluye" className="bg-stone-950 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[640px]">
              <Image
                src={mosaic[1] ?? sector.imagen}
                alt={sector.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-stone-950/40" />
            </div>

            <div className="reveal-item flex flex-col justify-center px-6 py-14 sm:px-12 lg:px-16 lg:py-24">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/60 sm:text-xs">
                {includes.title}
              </span>
              <h2 className="mt-5 font-serif text-3xl font-light leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Todo en un mismo equipo.
              </h2>
              <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                {includes.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base font-light leading-snug text-white/90">
                    <span aria-hidden="true" className="mt-0.5 text-amber-500">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-12">
                <ContactTrigger mode="avanzado" source={`Servicio ${sector.title} (qué incluye)`} tipo={sector.title} className={cta}>
                  Solicitar valoración
                </ContactTrigger>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mosaico de resultados: solo imágenes */}
      {mosaic.length >= 3 && (
        <section aria-label="Resultados" className="py-6 sm:py-8">
          <Container>
            <div className="grid h-[420px] grid-cols-2 grid-rows-3 gap-3 sm:h-[520px] sm:gap-4 lg:h-[620px] lg:grid-cols-4 lg:grid-rows-2">
              {mosaic.map((src, index) => (
                <div
                  key={src}
                  className={`group reveal-item relative overflow-hidden bg-stone-200 ${
                    index === 0 ? "col-span-2 row-span-2" : ""
                  } ${index === 3 && mosaic.length === 4 ? "col-span-2" : ""}`}
                  style={{ transitionDelay: `${index * 70}ms` }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes={index === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                    className="object-cover object-center transition duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 5. Cómo trabajamos: una tarjeta con imagen por fase */}
      {fases.length > 0 && (
        <section id="como-trabajamos" className="scroll-mt-24 py-20 sm:py-28">
          <Container>
            <div className="reveal-item flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500 sm:text-xs">
                  Cómo trabajamos
                </span>
                <h2 className="mt-5 font-serif text-3xl font-light leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  {fases.length} fases, un solo equipo.
                </h2>
              </div>
              <ContactTrigger mode="rapido" source={`Servicio ${sector.title} (cómo trabajamos)`} className={`${cta} self-start bg-stone-900 hover:bg-amber-700 hover:text-white`}>
                Empezar ahora
              </ContactTrigger>
            </div>

            <ol className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {fases.map((fase, index) => (
                <li
                  key={fase.id}
                  className="group reveal-item relative isolate flex aspect-[4/3] flex-col justify-end overflow-hidden bg-stone-900 p-6 text-white"
                  style={{ transitionDelay: `${(index % 3) * 80}ms` }}
                >
                  <Image
                    src={fase.imagen || sector.imagen}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="-z-10 object-cover object-center transition duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />
                  <span className="font-mono text-xs tabular-nums text-amber-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl font-light leading-snug tracking-tight sm:text-3xl">
                    {fase.title}
                  </h3>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}

      {/* Texto de apoyo del servicio (el resto de apartados del CMS), junto a una imagen */}
      {others.length > 0 && (
        <section className="border-t border-stone-200 bg-stone-50">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="reveal-item flex flex-col justify-center gap-10 px-6 py-14 sm:px-12 lg:px-16 lg:py-24">
              {others.map((section) => (
                <div key={section.title}>
                  <h2 className="font-serif text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                    {section.title}
                  </h2>
                  <div className="mt-5">
                    <Prose html={section.html} />
                  </div>
                </div>
              ))}
            </div>
            <div className="relative min-h-[300px] sm:min-h-[420px] lg:min-h-[520px]">
              <Image
                src={supportImage}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </section>
      )}

      {/* 6. Prueba: obras ejecutadas y marcas con las que trabajamos */}
      {showcase.length > 0 && (
        <section id="obras" className="py-20 sm:py-28">
          <Container>
            <div className="reveal-item flex flex-col gap-4 border-b border-stone-900/15 pb-10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500 sm:text-xs">
                  Obra ejecutada
                </span>
                <h2 className="mt-5 font-serif text-3xl font-light leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Resultados que se pueden visitar.
                </h2>
              </div>
              <Link
                href={ROUTES.projects}
                className="group inline-flex items-center gap-2 border-b border-stone-900 pb-1.5 text-xs font-semibold uppercase tracking-[0.22em] transition hover:border-amber-700 hover:text-amber-700"
              >
                Ver todos los proyectos
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
              {showcase.map((project, index) => (
                <Link
                  key={project.id}
                  href={`${ROUTES.projects}/${project.slug}`}
                  className="group reveal-item relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden bg-stone-900 p-6 text-white sm:p-8"
                  style={{ transitionDelay: `${index * 90}ms` }}
                >
                  <Image
                    src={project.imagen}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="-z-10 object-cover object-center transition duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
                    {[project.tipologia, project.anio].filter(Boolean).join(" · ")}
                  </span>
                  <span className="mt-2 flex items-center gap-3 font-serif text-2xl font-light leading-tight tracking-tight sm:text-3xl">
                    {project.title}
                    <span aria-hidden="true" className="text-amber-500 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {fabricantes.length > 0 && <Materials fabricantes={fabricantes} />}

      {/* 7. Dudas */}
      <section id="preguntas" className="bg-stone-100 py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="reveal-item lg:col-span-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500 sm:text-xs">
                Preguntas frecuentes
              </span>
              <h2 className="mt-5 font-serif text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                Lo que suelen preguntarnos antes de empezar.
              </h2>
            </div>
            <div className="reveal-item lg:col-span-8">
              <div className="border-t border-stone-300">
                {FAQ.map((item) => (
                  <details key={item.q} className="group border-b border-stone-300">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-normal leading-snug text-stone-900 transition-colors hover:text-amber-700 sm:text-xl">
                      {item.q}
                      <span
                        aria-hidden="true"
                        className="text-2xl font-light leading-none text-amber-700 transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="max-w-2xl pb-6 font-light leading-relaxed text-stone-600">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. Acción: cierre */}
      <section className="relative isolate overflow-hidden bg-stone-950 py-20 text-white sm:py-28">
        <Image src={sector.imagen} alt="" fill sizes="100vw" className="-z-10 object-cover object-center opacity-25" />
        <Container>
          <div className="reveal-item mx-auto max-w-3xl text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-amber-500 sm:text-xs">
              Siguiente paso
            </span>
            <h2 className="mt-5 font-serif text-4xl font-light leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Hablemos de tu proyecto de {sector.title.toLowerCase()}.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-white/75">
              Cuéntanos qué necesitas y el equipo técnico te responderá con una valoración del alcance, el plazo y
              el presupuesto.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ContactTrigger mode="avanzado" source={`Servicio ${sector.title} (cierre)`} tipo={sector.title} className={cta}>
                Solicitar valoración
              </ContactTrigger>
              <ContactTrigger
                mode="rapido"
                source={`Servicio ${sector.title} (cierre rápido)`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-stone-900"
              >
                Que me llamen
              </ContactTrigger>
            </div>
            <p className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-light text-white/70">
              <a href={telHref} className="underline underline-offset-4 transition hover:text-white">
                {settings.telefono}
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 transition hover:text-white"
              >
                WhatsApp
              </a>
              <a href={`mailto:${settings.email}`} className="underline underline-offset-4 transition hover:text-white">
                {settings.email}
              </a>
            </p>
          </div>
        </Container>
      </section>

      {/* Otros servicios */}
      {otros.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500 sm:text-xs">
              Otros servicios
            </h2>
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {otros.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <Link
                    href={`${ROUTES.sectors}/${item.slug}`}
                    className="group relative isolate flex aspect-[4/3] items-end overflow-hidden bg-stone-900 p-4 text-white sm:p-5"
                  >
                    <Image
                      src={item.imagen}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="-z-10 object-cover object-center transition duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950/85 to-transparent" />
                    <span className="font-serif text-lg font-light leading-snug tracking-tight sm:text-xl">
                      {item.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </main>
  );
}
