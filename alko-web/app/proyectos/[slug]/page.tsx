import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
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

  // Galería de imágenes adicionales del proyecto
  const galeriaImagenes = [project.imagen, ...project.galeria].filter(
    (src, i, arr) => arr.indexOf(src) === i
  );

  // Lista de datos del proyecto para la columna izquierda
  const infoResumida = [
    { label: "Cliente", value: project.cliente },
    {
      label: "Servicio",
      value: servicio ? (
        <Link
          href={`${ROUTES.sectors}/${servicio.slug}`}
          className="text-ink underline decoration-amber-700/60 underline-offset-4 hover:text-amber-700 transition-colors"
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
    <main className="bg-paper text-ink">
      {/* 1. Cabecera (hero de la propuesta 6) con la ficha técnica */}
      <PageHero
        breadcrumbs={[{ label: "Proyectos", href: ROUTES.projects }, { label: project.title }]}
        eyebrow={project.indice ? `Proyecto ${project.indice}` : "Proyecto"}
        title={project.title}
        image={project.imagen}
        imageAlt={project.title}
      >
        {ficha.length > 0 && (
          <dl className={`mt-12 grid grid-cols-1 border-t border-paper/20 ${FICHA_COLS[ficha.length]}`}>
            {ficha.map(([label, value], i) => (
              <div
                key={label}
                className={`flex items-baseline justify-between gap-4 border-b border-paper/20 py-4 sm:block sm:border-b-0 sm:py-5 sm:pr-4 ${
                  i > 0 ? "sm:border-l sm:pl-4" : ""
                }`}
              >
                <dt className="text-[10px] uppercase tracking-[0.22em] text-paper/60">{label}</dt>
                <dd className="display-title text-right text-lg sm:mt-2 sm:text-left sm:text-2xl">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </PageHero>

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
                  <span className="eyebrow">
                    Memoria del proyecto
                  </span>
                </div>

                {infoResumida.length > 0 && (
                  <dl className="mt-8 border-t border-stone-900/15">
                    {infoResumida.map((item) => (
                      <div key={item.label} className="border-b border-stone-900/15 py-4">
                        <dt className="eyebrow">
                          {item.label}
                        </dt>
                        <dd className="display-title mt-1 text-base sm:text-lg text-ink">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </div>

            {/* Columna Derecha: Fotos Antes/Después + Galería Integrada */}
            <div className="lg:col-span-8 reveal-item space-y-12 sm:space-y-16" style={{ transitionDelay: "120ms" }}>
              {/* Bloque 1: Comparativa Antes y Después */}
              <div>
                <div className="mb-6 flex items-center gap-4">
                  <span className="eyebrow">
                    Registro fotográfico · Antes y Después
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  {/* Foto ANTES */}
                  <div className="group relative overflow-hidden bg-stone-100 border border-stone-200/80">
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
                      <span className="text-[10px] tracking-[0.22em] uppercase text-stone-400">
                        Estado Inicial
                      </span>
                      <span className="display-title text-sm uppercase tracking-wider text-amber-500">
                        Antes
                      </span>
                    </div>
                  </div>

                  {/* Foto DESPUÉS */}
                  <div className="group relative overflow-hidden bg-stone-100 border border-stone-200/80">
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
                      <span className="text-[10px] tracking-[0.22em] uppercase text-amber-200">
                        Obra Entregada
                      </span>
                      <span className="display-title text-sm uppercase tracking-wider text-white">
                        Después
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloque 2: Galería de Imágenes dentro de la misma sección */}
              {galeriaImagenes.length > 0 && (
                <div className="pt-10 border-t border-stone-200">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="eyebrow">
                      Galería del proyecto · {galeriaImagenes.length} imágenes
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {galeriaImagenes.map((src, i, all) => {
                      const wide = i === 0 || (all.length % 2 === 1 && i === all.length - 1);
                      return (
                        <figure
                          key={`${src}-${i}`}
                          className={`relative overflow-hidden bg-stone-200 border border-stone-200/80 group ${
                            wide ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                          }`}
                        >
                          <Image
                            src={src}
                            alt={`${project.title} — imagen ${i + 1}`}
                            fill
                            sizes={wide ? "(max-width: 1280px) 100vw, 1000px" : "(max-width: 640px) 100vw, 500px"}
                            className="object-cover object-center transition duration-700 ease-out group-hover:scale-105"
                          />
                        </figure>
                      );
                    })}
                  </div>
                </div>
              )}
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
                  <span className="text-[10px] tracking-[0.22em] uppercase text-white/60">
                    {arrow === "←" ? `${arrow} ${label}` : `${label} ${arrow}`}
                  </span>
                  <span className="display-title mt-3 block text-2xl sm:text-3xl lg:text-4xl leading-tight">
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
      <ContactCta settings={settings} source={`Proyecto · ${project.title}`} />
    </main>
  );
}
