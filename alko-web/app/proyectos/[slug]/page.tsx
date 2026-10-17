import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import ContactCta from "@/components/sections/ContactCta";
import { ROUTES } from "@/lib/site";
import { getFases, getProjectBySlug, getProjects, getSectorBySlug, getSettings } from "@/lib/wordpress";
import { splitLead } from "@/lib/utils";

export const revalidate = 60;

// Columnas de la ficha en escritorio según el número de datos (clases literales para Tailwind).
const FICHA_COLS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-3 lg:grid-cols-5",
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — ALKO`,
    description: splitLead(project.content).lead.slice(0, 160),
    openGraph: { images: project.imagen ? [project.imagen] : undefined },
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, projects, fases, settings] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getFases(),
    getSettings(),
  ]);
  if (!project) return notFound();
  const servicio = project.servicio ? await getSectorBySlug(project.servicio) : null;

  const { lead, rest } = splitLead(project.content);
  const ficha = [
    ["Tipología", project.tipologia],
    ["Ubicación", project.ubicacion],
    ["Superficie", project.superficie],
    ["Plazo", project.plazo],
    ["Año", project.anio],
  ].filter(([, value]) => value);
  const enfoque = [
    { tag: "01", label: "El reto", texto: project.reto },
    { tag: "02", label: "La solución", texto: project.solucion },
  ].filter((item) => item.texto);

  // Proyecto anterior y siguiente (circular) para seguir navegando.
  const index = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects.length > 1 && index >= 0 ? projects[(index - 1 + projects.length) % projects.length] : null;
  const next = projects.length > 1 && index >= 0 ? projects[(index + 1) % projects.length] : null;
  const neighbours = [
    prev && { label: "Proyecto anterior", project: prev, arrow: "←" },
    next && next.slug !== prev?.slug && { label: "Proyecto siguiente", project: next, arrow: "→" },
  ].filter(Boolean) as { label: string; project: typeof project; arrow: string }[];

  return (
    <main className="bg-white text-stone-900">
      {/* Hero */}
      <header className="relative isolate flex min-h-[640px] sm:min-h-[720px] lg:min-h-[92vh] items-end overflow-hidden bg-stone-950 text-white pt-36 sm:pt-44 pb-10 sm:pb-14">
        <Image
          src={project.imagen}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-stone-950/80 via-stone-950/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-stone-950/95 via-stone-950/45 to-transparent" />
        <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-stone-950/70 to-transparent" />

        <Container className="relative">
          <Link
            href={ROUTES.projects}
            className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase text-white/70 hover:text-white transition-colors"
          >
            <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Proyectos
          </Link>

          <div className="mt-8 flex items-end gap-6">
            <span className="hidden sm:block font-serif font-light text-8xl lg:text-9xl text-white/20 leading-[0.8] select-none">
              {project.indice}
            </span>
            <h1 className="max-w-5xl font-display font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[-0.02em] leading-[1.02] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
              {project.title}
            </h1>
          </div>

          {ficha.length > 0 && (
            <dl className={`mt-12 sm:mt-16 grid grid-cols-1 ${FICHA_COLS[ficha.length]} border-t border-white/20`}>
              {ficha.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-4 sm:block border-b border-white/20 py-4 sm:py-6 sm:pr-6"
                >
                  <dt className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/60">
                    {label}
                  </dt>
                  <dd className="sm:mt-2 text-right sm:text-left font-serif font-light text-lg sm:text-xl lg:text-2xl text-white">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </Container>
      </header>

      {/* Memoria */}
      <section className="relative isolate overflow-clip">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 mx-auto hidden max-w-7xl grid-cols-6 px-6 sm:px-10 lg:grid lg:px-12"
        >
          <div className="h-full border-x border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
        </div>

        <Container className="py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-4 reveal-item">
              <div className="lg:sticky lg:top-32">
                <div className="flex items-center gap-4">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                  </span>
                  <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                    Memoria del proyecto
                  </span>
                </div>
                {(project.cliente || servicio) && (
                  <dl className="mt-8 max-w-xs border-t border-stone-900/15">
                    {project.cliente && (
                      <div className="border-b border-stone-900/15 py-4">
                        <dt className="font-mono text-[10px] tracking-[0.25em] uppercase text-stone-500">Cliente</dt>
                        <dd className="mt-1 font-serif text-lg text-stone-900">{project.cliente}</dd>
                      </div>
                    )}
                    {servicio && (
                      <div className="border-b border-stone-900/15 py-4">
                        <dt className="font-mono text-[10px] tracking-[0.25em] uppercase text-stone-500">Servicio</dt>
                        <dd className="mt-1 font-serif text-lg">
                          <Link
                            href={`${ROUTES.sectors}/${servicio.slug}`}
                            className="text-stone-900 underline decoration-amber-700/60 underline-offset-4 hover:text-amber-700 transition-colors"
                          >
                            {servicio.title}
                          </Link>
                        </dd>
                      </div>
                    )}
                  </dl>
                )}
              </div>
            </div>
            <div className="lg:col-span-8 reveal-item" style={{ transitionDelay: "120ms" }}>
              {lead && (
                <p className="font-serif font-light text-2xl sm:text-3xl lg:text-4xl text-stone-900 leading-snug tracking-tight">
                  {lead}
                </p>
              )}
              {rest && (
                <div className="mt-10 border-t border-stone-300 pt-10">
                  <Prose html={rest} />
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Cifras */}
      {project.cifras.length > 0 && (
        <section aria-label="Cifras del proyecto" className="bg-stone-950 text-white">
          <Container className="py-16 sm:py-20">
            <dl
              className={`grid grid-cols-2 gap-x-6 gap-y-10 ${project.cifras.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}
            >
              {project.cifras.map((cifra, i) => (
                <div
                  key={`${cifra.valor}-${i}`}
                  className="reveal-item flex flex-col-reverse justify-end border-t border-white/20 pt-6"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <dt className="mt-4 max-w-[16rem] text-sm sm:text-base font-light text-white/70 leading-snug">
                    {cifra.etiqueta}
                  </dt>
                  <dd className="font-serif font-light text-4xl sm:text-5xl lg:text-6xl tracking-tight text-amber-500 leading-none">
                    {cifra.valor}
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      )}

      {/* Reto y solución */}
      {enfoque.length > 0 && (
        <section className="bg-stone-100">
          <Container className="py-20 sm:py-28">
            <div className={`grid grid-cols-1 gap-12 lg:gap-0 ${enfoque.length > 1 ? "lg:grid-cols-2" : ""}`}>
              {enfoque.map((item, i) => (
                <div
                  key={item.tag}
                  className={`reveal-item ${i === 1 ? "lg:border-l lg:border-stone-900/15 lg:pl-16" : "lg:pr-16"}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-amber-700">{item.tag}</span>
                    <h2 className="font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase text-stone-500">
                      {item.label}
                    </h2>
                  </div>
                  <p className="mt-6 font-serif font-light text-2xl sm:text-3xl text-stone-900 leading-snug tracking-tight">
                    {item.texto}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Cronograma */}
      {project.cronograma.length > 0 && (
        <section className="bg-white">
          <Container className="py-20 sm:py-28">
            <div className="reveal-item flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                  Cronograma de la obra
                </span>
                <h2 className="mt-6 font-serif font-light text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-tight tracking-tight">
                  Cómo avanzó, etapa a etapa.
                </h2>
              </div>
              {project.plazo && (
                <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-stone-500">
                  Plazo total · <span className="text-stone-900">{project.plazo}</span>
                </p>
              )}
            </div>
            {/* Línea de tiempo (pseudo-elemento): vertical en móvil, horizontal en escritorio */}
            <ol className="relative mt-12 sm:mt-16 grid grid-cols-1 gap-10 lg:grid-flow-col lg:auto-cols-fr lg:gap-8 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-px before:bg-stone-900/15 lg:before:left-0 lg:before:right-0 lg:before:top-[5px] lg:before:bottom-auto lg:before:h-px lg:before:w-auto">
              {project.cronograma.map((etapa, i) => (
                <li
                  key={`${etapa.periodo}-${i}`}
                  className="reveal-item relative pl-8 lg:pl-0 lg:pt-10"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <span aria-hidden="true" className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-white bg-amber-700 ring-1 ring-amber-700 lg:top-0" />
                  <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-amber-700">{etapa.periodo}</p>
                  <h3 className="mt-3 font-serif font-light text-xl sm:text-2xl text-stone-900 leading-snug">
                    {etapa.titulo}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base font-light text-stone-600 leading-relaxed">{etapa.texto}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}

      {/* Alcance de los trabajos */}
      {project.alcance.length > 0 && (
        <section>
          <Container className="py-20 sm:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-4 reveal-item">
                <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                  Alcance de los trabajos
                </span>
                <h2 className="mt-6 font-serif font-light text-3xl sm:text-4xl text-stone-900 leading-tight tracking-tight">
                  Todo lo que ejecutamos en esta obra.
                </h2>
              </div>
              <ol className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10 border-t border-stone-900/15">
                {project.alcance.map((partida, i) => (
                  <li
                    key={`${partida}-${i}`}
                    className="reveal-item flex items-baseline gap-5 border-b border-stone-900/15 py-5"
                    style={{ transitionDelay: `${(i % 6) * 60}ms` }}
                  >
                    <span className="font-mono text-[11px] tracking-[0.2em] text-amber-700 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base sm:text-lg font-light text-stone-800">{partida}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </section>
      )}

      {/* Materiales y acabados */}
      {project.materiales.length > 0 && (
        <section className="bg-stone-100">
          <Container className="py-20 sm:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-4 reveal-item">
                <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                  Materiales y acabados
                </span>
                <h2 className="mt-6 font-serif font-light text-3xl sm:text-4xl text-stone-900 leading-tight tracking-tight">
                  Lo que se eligió, y por qué se nota.
                </h2>
              </div>
              <dl className="lg:col-span-8 border-t border-stone-900/20">
                {project.materiales.map((material, i) => (
                  <div
                    key={`${material.elemento}-${i}`}
                    className="reveal-item grid grid-cols-1 gap-1 border-b border-stone-900/20 py-5 sm:grid-cols-3 sm:gap-6"
                    style={{ transitionDelay: `${(i % 6) * 60}ms` }}
                  >
                    <dt className="font-mono text-[11px] tracking-[0.2em] uppercase text-stone-500 sm:pt-1">
                      {material.elemento}
                    </dt>
                    <dd className="sm:col-span-2 text-base sm:text-lg font-light text-stone-900">{material.detalle}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </section>
      )}

      {/* Galería */}
      <section className="py-20 sm:py-28">
        <Container>
          <span className="reveal-item block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
            Galería · {[project.imagen, ...project.galeria].length} imágenes
          </span>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[project.imagen, ...project.galeria].map((src, i, all) => {
              // La primera ocupa todo el ancho; si el resto es impar, la última también.
              const wide = i === 0 || (all.length % 2 === 0 && i === all.length - 1);
              return (
                <figure
                  key={`${src}-${i}`}
                  className={`reveal-item relative overflow-hidden bg-stone-200 ${
                    wide ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                  }`}
                  data-parallax={wide ? "8" : undefined}
                >
                  <Image
                    src={src}
                    alt={`${project.title} — imagen ${i + 1}`}
                    fill
                    sizes={wide ? "(max-width: 1280px) 100vw, 1200px" : "(max-width: 640px) 100vw, 600px"}
                    className="object-cover object-center"
                  />
                </figure>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Resultado */}
      {project.resultado && (
        <section className="relative isolate overflow-hidden bg-stone-950 text-white">
          <Image
            src={project.galeria[0] || project.imagen}
            alt=""
            fill
            sizes="100vw"
            className="-z-10 object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-stone-950/30" />
          <Container className="py-24 sm:py-32">
            <div className="reveal-item max-w-4xl">
              <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase text-amber-500">
                El resultado
              </span>
              <p className="mt-8 font-serif font-light text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
                {project.resultado}
              </p>
              <Link
                href={project.enlace || ROUTES.contact}
                className="group mt-10 inline-flex items-center gap-3 rounded-full border border-white/50 px-7 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-white hover:bg-white hover:text-stone-950 transition-colors"
              >
                Quiero un proyecto así
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* Servicio relacionado */}
      {servicio && (
        <section className="bg-white">
          <Container className="py-16 sm:py-20">
            <Link
              href={`${ROUTES.sectors}/${servicio.slug}`}
              className="group reveal-item grid grid-cols-1 items-center gap-8 md:grid-cols-12"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-200 md:col-span-5">
                <Image
                  src={servicio.imagen}
                  alt={servicio.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  className="object-cover object-center transition duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="md:col-span-7">
                <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-stone-500">
                  Servicio relacionado · {servicio.numero}
                </span>
                <h2 className="mt-4 font-serif font-light text-3xl sm:text-4xl text-stone-900 leading-tight tracking-tight group-hover:text-amber-700 transition-colors">
                  {servicio.title}
                </h2>
                {servicio.descripcion && (
                  <p className="mt-4 max-w-xl text-base sm:text-lg font-light text-stone-600 leading-relaxed">
                    {servicio.descripcion}
                  </p>
                )}
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase text-stone-900">
                  Ver servicio
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </Container>
        </section>
      )}

      {/* Método */}
      {fases.length > 0 && (
        <section className="border-t border-stone-300 bg-white">
          <Container className="py-20 sm:py-28">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="reveal-item max-w-2xl">
                <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                  Cómo lo ejecutamos
                </span>
                <h2 className="mt-6 font-serif font-light text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-tight tracking-tight">
                  Un mismo método en cada obra.
                </h2>
              </div>
              <Link
                href={ROUTES.method}
                className="group reveal-item inline-flex shrink-0 items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase text-stone-900 hover:text-amber-700 transition-colors"
              >
                Conoce el método
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
            <ol className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-900/15 border border-stone-900/15">
              {fases.map((fase, i) => (
                <li
                  key={fase.id}
                  className="reveal-item bg-white p-6 sm:p-8"
                  style={{ transitionDelay: `${(i % 3) * 90}ms` }}
                >
                  <span className="font-mono text-[11px] tracking-[0.2em] text-amber-700 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-serif font-light text-xl sm:text-2xl text-stone-900 leading-snug">
                    {fase.title}
                  </h3>
                  {fase.texto && (
                    <p className="mt-3 text-sm sm:text-base font-light text-stone-600 leading-relaxed line-clamp-3">
                      {fase.texto}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}

      {/* Más proyectos */}
      {neighbours.length > 0 && (
        <nav aria-label="Más proyectos" className="border-t border-stone-300">
          <div className={`grid grid-cols-1 ${neighbours.length > 1 ? "md:grid-cols-2" : ""}`}>
            {neighbours.map(({ label, project: other, arrow }, i) => (
              <Link
                key={other.id}
                href={`${ROUTES.projects}/${other.slug}`}
                className={`group relative isolate flex min-h-[280px] sm:min-h-[340px] items-end overflow-hidden bg-stone-950 p-6 sm:p-10 lg:p-12 text-white ${
                  i === 1 ? "md:text-right md:justify-end" : ""
                }`}
              >
                <Image
                  src={other.imagen}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="-z-10 object-cover object-center opacity-50 transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-70"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />
                <div>
                  <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-white/60">
                    {arrow === "←" ? `${arrow} ${label}` : `${label} ${arrow}`}
                  </span>
                  <span className="mt-3 block font-serif font-light text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight">
                    {other.title}
                  </span>
                  <span className="mt-2 block text-sm text-white/60 font-light">
                    {[other.tipologia, other.anio].filter(Boolean).join(" · ")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </nav>
      )}

      <ContactCta settings={settings} />
    </main>
  );
}
