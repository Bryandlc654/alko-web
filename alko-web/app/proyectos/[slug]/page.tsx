import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import ContactCta from "@/components/sections/ContactCta";
import { ROUTES } from "@/lib/site";
import { getProjectBySlug, getProjects, getSectorBySlug, getSettings } from "@/lib/wordpress";
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
  const [project, projects, settings] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
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

  // Proyecto anterior y siguiente (circular) para seguir navegando.
  const index = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects.length > 1 && index >= 0 ? projects[(index - 1 + projects.length) % projects.length] : null;
  const next = projects.length > 1 && index >= 0 ? projects[(index + 1) % projects.length] : null;
  const neighbours = [
    prev && { label: "Proyecto anterior", project: prev, arrow: "←" },
    next && next.slug !== prev?.slug && { label: "Proyecto siguiente", project: next, arrow: "→" },
  ].filter(Boolean) as { label: string; project: typeof project; arrow: string }[];

  // Fotos de Antes y Después
  const fotoAntes = project.fotoAntes || project.galeria[1] || "/start-research-1.jpg";
  const fotoDespues = project.fotoDespues || project.imagen || "/p1.jpg";

  // Lista detallada de datos del proyecto para la columna izquierda
  const infoResumida = [
    { label: "Cliente", value: project.cliente },
    {
      label: "Servicio",
      value: servicio ? (
        <Link
          href={`${ROUTES.sectors}/${servicio.slug}`}
          className="text-stone-900 underline decoration-amber-700/60 underline-offset-4 hover:text-amber-700 transition-colors"
        >
          {servicio.title}
        </Link>
      ) : null,
    },
    { label: "Tipología", value: project.tipologia },
    { label: "Ubicación", value: project.ubicacion },
    { label: "Superficie", value: project.superficie },
    { label: "Plazo", value: project.plazo },
    { label: "Año", value: project.anio },
  ].filter((item) => Boolean(item.value));

  return (
    <main className="bg-white text-stone-900">
      {/* 1. Header Hero Principal */}
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
          <Breadcrumbs items={[{ label: "Proyectos", href: ROUTES.projects }, { label: project.title }]} />

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

      {/* 2. Bloque Memoria del Proyecto Simplificado */}
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
            {/* Columna Izquierda: Información Resumida en Lista */}
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

                {infoResumida.length > 0 && (
                  <dl className="mt-8 border-t border-stone-900/15">
                    {infoResumida.map((item) => (
                      <div key={item.label} className="border-b border-stone-900/15 py-4">
                        <dt className="font-mono text-[10px] tracking-[0.25em] uppercase text-stone-500">
                          {item.label}
                        </dt>
                        <dd className="mt-1 font-serif text-base sm:text-lg text-stone-900">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </div>

            {/* Columna Derecha: Texto Memoria + Fotos Antes y Después */}
            <div className="lg:col-span-8 reveal-item" style={{ transitionDelay: "120ms" }}>
              {lead && (
                <p className="font-serif font-light text-2xl sm:text-3xl lg:text-4xl text-stone-900 leading-snug tracking-tight">
                  {lead}
                </p>
              )}

              {rest && (
                <div className="mt-8 border-t border-stone-300 pt-8">
                  <Prose html={rest} />
                </div>
              )}

              {/* Comparativa Fotos Antes y Después */}
              <div className="mt-12 sm:mt-16 pt-10 border-t border-stone-200">
                <div className="mb-6 flex items-center gap-4">
                  <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                    Registro fotográfico · Antes y Después
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  {/* Foto ANTES */}
                  <div className="group relative overflow-hidden bg-stone-100 border border-stone-200/80 rounded-sm">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={fotoAntes}
                        alt={`Estado inicial / antes de ${project.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        className="object-cover object-center grayscale contrast-125 transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
                      <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-stone-400">
                        Estado Inicial
                      </span>
                      <span className="font-serif text-sm font-light uppercase tracking-wider text-amber-500">
                        Antes
                      </span>
                    </div>
                  </div>

                  {/* Foto DESPUÉS */}
                  <div className="group relative overflow-hidden bg-stone-100 border border-stone-200/80 rounded-sm shadow-md">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={fotoDespues}
                        alt={`Resultado / después de ${project.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        className="object-cover object-center transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 bg-amber-700 text-white flex items-center justify-between">
                      <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-amber-200">
                        Obra Entregada
                      </span>
                      <span className="font-serif text-sm font-light uppercase tracking-wider text-white">
                        Después
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Navegación entre más proyectos */}
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

      {/* 4. Contacto CTA Final */}
      <ContactCta settings={settings} />
    </main>
  );
}
