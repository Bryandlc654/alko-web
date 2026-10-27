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

/** Lo que suele fallar en una obra frente a cómo lo resuelve ALKO. */
const PROBLEMS = [
  {
    problem: "Cada gremio trabaja por su cuenta y las decisiones se contradicen.",
    solution: "Un único equipo coordina proyecto, compras, instalaciones y obra.",
  },
  {
    problem: "Los retrasos y las partidas nuevas aparecen cuando la obra ya ha empezado.",
    solution: "Presupuesto por partidas y plazo fijados por escrito antes del primer día.",
  },
  {
    problem: "Nadie responde del conjunto cuando algo no sale como estaba previsto.",
    solution: "Un responsable técnico acompaña la obra a diario y te informa del avance.",
  },
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

  const { lead, intro, sections } = parseService(sector.content);
  const includes = sections.find((s) => s.items.length > 0 && /incluye/i.test(s.title)) ?? sections.find((s) => s.items.length > 0);
  const others = sections.filter((s) => s !== includes);

  // Obras de este servicio primero; si faltan, se completan con las demás.
  const own = projects.filter((project) => project.servicio === sector.slug);
  const showcase = [...own, ...projects.filter((project) => !own.includes(project))].slice(0, 3);
  const otros = sectors.filter((item) => item.slug !== sector.slug);

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
              <p className="mt-6 max-w-2xl font-sans text-lg font-light leading-relaxed text-white/85 sm:text-xl">
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

      {/* 3. Interés: lo que suele fallar y cómo se resuelve */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="reveal-item max-w-3xl">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500 sm:text-xs">
              El problema de siempre
            </span>
            <h2 className="mt-5 font-serif text-3xl font-light leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Lo que suele fallar en una obra, y cómo lo resolvemos.
            </h2>
            {intro && (
              <div className="mt-8">
                <Prose html={intro} />
              </div>
            )}
          </div>

          <div className="mt-14 border-t border-stone-300">
            {PROBLEMS.map((item, index) => (
              <div
                key={item.problem}
                className="reveal-item grid grid-cols-1 gap-4 border-b border-stone-300 py-8 md:grid-cols-12 md:gap-10"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-400 md:col-span-1">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="text-lg font-light leading-snug text-stone-500 md:col-span-5">{item.problem}</p>
                <p className="flex items-start gap-3 text-lg font-normal leading-snug text-stone-900 md:col-span-6">
                  <span aria-hidden="true" className="text-amber-700">
                    →
                  </span>
                  {item.solution}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Deseo: qué incluye */}
      {includes && (
        <section id="incluye" className="bg-stone-950 py-20 text-white sm:py-28">
          <Container>
            <div className="reveal-item grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/60 sm:text-xs">
                  {includes.title}
                </span>
                <h2 className="mt-5 font-serif text-3xl font-light leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Todo lo que entra en {sector.title.toLowerCase()}.
                </h2>
                <p className="mt-6 max-w-md font-light leading-relaxed text-white/70">{sector.descripcion}</p>
                <div className="mt-10">
                  <ContactTrigger mode="avanzado" source={`Servicio ${sector.title} (qué incluye)`} tipo={sector.title} className={cta}>
                    Solicitar valoración
                  </ContactTrigger>
                </div>
              </div>

              <ul className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:col-span-7">
                {includes.items.map((item, index) => (
                  <li key={item} className="flex items-start gap-4 bg-stone-950 p-6 sm:p-8">
                    <span className="font-mono text-xs tabular-nums text-amber-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-light leading-snug text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}

      {/* 5. Cómo trabajamos */}
      {fases.length > 0 && (
        <section id="como-trabajamos" className="scroll-mt-24 py-20 sm:py-28">
          <Container>
            <div className="reveal-item max-w-3xl">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500 sm:text-xs">
                Cómo trabajamos
              </span>
              <h2 className="mt-5 font-serif text-3xl font-light leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Del primer contacto a la entrega, en {fases.length} fases.
              </h2>
            </div>

            <ol className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {fases.map((fase, index) => (
                <li
                  key={fase.id}
                  className="reveal-item border-t border-stone-900 pt-6"
                  style={{ transitionDelay: `${(index % 3) * 80}ms` }}
                >
                  <span className="font-mono text-xs tabular-nums text-amber-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-serif text-2xl font-light leading-snug tracking-tight">{fase.title}</h3>
                  <p className="mt-3 line-clamp-4 text-base font-light leading-relaxed text-stone-600">{fase.texto}</p>
                </li>
              ))}
            </ol>

            <div className="mt-14">
              <ContactTrigger mode="rapido" source={`Servicio ${sector.title} (cómo trabajamos)`} className={`${cta} bg-stone-900 hover:bg-amber-700 hover:text-white`}>
                Empezar ahora
              </ContactTrigger>
            </div>
          </Container>
        </section>
      )}

      {/* Texto de apoyo del servicio (el resto de apartados del CMS) */}
      {others.length > 0 && (
        <section className="border-t border-stone-200 bg-stone-50 py-16 sm:py-24">
          <Container>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
              {others.map((section) => (
                <div key={section.title} className="reveal-item lg:col-span-8 lg:col-start-3">
                  <h2 className="font-serif text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                    {section.title}
                  </h2>
                  <div className="mt-6">
                    <Prose html={section.html} />
                  </div>
                </div>
              ))}
            </div>
          </Container>
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

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {showcase.map((project, index) => (
                <Link
                  key={project.id}
                  href={`${ROUTES.projects}/${project.slug}`}
                  className="group reveal-item block"
                  style={{ transitionDelay: `${index * 90}ms` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                    <Image
                      src={project.imagen}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center transition duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <span className="mt-5 block font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
                    {[project.tipologia, project.anio].filter(Boolean).join(" · ")}
                  </span>
                  <span className="mt-2 flex items-center gap-3 font-serif text-2xl font-light leading-tight tracking-tight text-stone-900 transition-colors group-hover:text-amber-700">
                    {project.title}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                  {(project.ubicacion || project.superficie) && (
                    <span className="mt-2 block text-sm font-light text-stone-600">
                      {[project.ubicacion, project.superficie].filter(Boolean).join(" · ")}
                    </span>
                  )}
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
            <ul className="mt-6 flex flex-wrap gap-3">
              {otros.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`${ROUTES.sectors}/${item.slug}`}
                    className="inline-flex rounded-full border border-stone-300 px-5 py-2.5 text-sm font-light text-stone-700 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white"
                  >
                    {item.title}
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
