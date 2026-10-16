import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import ContactCta from "@/components/sections/ContactCta";
import { ROUTES } from "@/lib/site";
import { getProjectBySlug, getProjects, getSettings } from "@/lib/wordpress";
import { splitLead } from "@/lib/utils";

export const revalidate = 60;

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

  const { lead, rest } = splitLead(project.content);
  const ficha = [
    ["Tipología", project.tipologia],
    ["Ubicación", project.ubicacion],
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
            <dl className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 border-t border-white/20">
              {ficha.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-4 sm:block border-b sm:border-b-0 sm:border-r last:border-r-0 border-white/20 py-4 sm:py-6 sm:pr-6 sm:[&:not(:first-child)]:pl-6"
                >
                  <dt className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/60">
                    {label}
                  </dt>
                  <dd className="sm:mt-2 text-right sm:text-left font-serif font-light text-lg sm:text-2xl text-white">
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
              <div className="flex items-center gap-4 lg:sticky lg:top-32">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                </span>
                <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                  Memoria del proyecto
                </span>
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

      {/* Galería */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
