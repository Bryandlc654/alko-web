import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ContactTrigger from "@/components/contact/ContactTrigger";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Prose from "@/components/ui/Prose";
import ContactCta from "@/components/sections/ContactCta";
import { ROUTES } from "@/lib/site";
import { getProjects, getSectorBySlug, getSectors, getSettings } from "@/lib/wordpress";
import { splitLead } from "@/lib/utils";

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

export default async function SectorDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [sector, sectors, projects, settings] = await Promise.all([
    getSectorBySlug(slug),
    getSectors(),
    getProjects(),
    getSettings(),
  ]);
  if (!sector) return notFound();

  const { lead, rest } = splitLead(sector.content);
  // Proyectos que declaran este servicio (campo «Servicio relacionado» del proyecto).
  const relacionados = projects.filter((project) => project.servicio === sector.slug);
  const otros = sectors.filter((item) => item.slug !== sector.slug);

  return (
    <main className="bg-white text-stone-900">
      <PageHero
        eyebrow={`Servicio ${sector.numero}`}
        title={sector.title}
        description={sector.descripcion}
        image={sector.imagen}
        imageAlt={sector.title}
      />

      {/* Qué hacemos */}
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
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="reveal-item lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <div className="flex items-center gap-4">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                  </span>
                  <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                    Qué hacemos
                  </span>
                </div>
                <div className="mt-8 flex max-w-xs flex-col items-start gap-5">
                  <ContactTrigger
                    mode="avanzado"
                    source={`Servicio ${sector.title}`}
                    tipo={sector.title}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-700 px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-amber-800"
                  >
                    Solicitar valoración
                  </ContactTrigger>
                  <Link
                    href={ROUTES.sectors}
                    className="group inline-flex items-center gap-2 border-b border-stone-900 pb-1.5 text-xs font-semibold uppercase tracking-[0.22em] transition hover:border-amber-700 hover:text-amber-700"
                  >
                    <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
                      ←
                    </span>
                    Todos los servicios
                  </Link>
                </div>
              </div>
            </div>

            <div className="reveal-item lg:col-span-8" style={{ transitionDelay: "120ms" }}>
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

      {/* Proyectos de este servicio */}
      {relacionados.length > 0 && (
        <section className="bg-stone-100 py-20 sm:py-28">
          <Container>
            <div className="reveal-item flex flex-col gap-4 border-b border-stone-900/15 pb-10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                  Obra ejecutada
                </span>
                <h2 className="mt-6 font-serif font-light text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-tight tracking-tight">
                  Proyectos de este servicio.
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

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {relacionados.map((project, i) => (
                <Link
                  key={project.id}
                  href={`${ROUTES.projects}/${project.slug}`}
                  className="group reveal-item block"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                    <Image
                      src={project.imagen}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover object-center transition duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <span className="mt-5 block font-mono text-[11px] tracking-[0.2em] uppercase text-stone-500">
                    {[project.tipologia, project.anio].filter(Boolean).join(" · ")}
                  </span>
                  <span className="mt-2 flex items-center gap-3 font-serif font-light text-2xl sm:text-3xl text-stone-900 leading-tight tracking-tight">
                    {project.title}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Otros servicios */}
      {otros.length > 0 && (
        <section className="py-20 sm:py-28">
          <Container>
            <div className="reveal-item max-w-2xl">
              <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                Más servicios
              </span>
              <h2 className="mt-6 font-serif font-light text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-tight tracking-tight">
                Todo lo que ALKO puede coordinar.
              </h2>
            </div>

            <ul className="mt-12 grid grid-cols-1 border-t border-stone-900/15 sm:grid-cols-2 sm:gap-x-12">
              {otros.map((item) => (
                <li key={item.id} className="border-b border-stone-900/15">
                  <Link
                    href={`${ROUTES.sectors}/${item.slug}`}
                    className="group flex items-baseline gap-5 py-6"
                  >
                    <span className="font-mono text-[11px] tracking-[0.2em] text-amber-700 tabular-nums">
                      {item.numero}
                    </span>
                    <span className="flex-1">
                      <span className="block font-serif font-light text-2xl text-stone-900 transition-colors group-hover:text-amber-700">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm font-light text-stone-600 leading-relaxed line-clamp-2">
                        {item.descripcion}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-stone-400 transition-all group-hover:translate-x-1 group-hover:text-amber-700"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <ContactCta settings={settings} />
    </main>
  );
}
