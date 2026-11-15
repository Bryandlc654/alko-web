import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/site";
import type { Project } from "@/lib/types";

/** Imagen de la tarjeta: si coincide con la del hero, usa otra de la obra para no repetirla. */
function cardImage(project: Project, avoid?: string) {
  if (!avoid || project.imagen !== avoid) return project.imagen;
  return [project.fotoDespues, ...project.galeria].find((src) => src && src !== avoid) ?? project.imagen;
}

/** Tres proyectos destacados: uno grande con ficha y dos escalonados (propuesta 6 · V4). */
export default function FeaturedWorks({ projects, heroImage }: { projects: Project[]; heroImage?: string }) {
  const [first, ...rest] = projects.slice(0, 3);
  if (!first) return null;

  const specs = [
    { label: "Tipología", value: first.tipologia },
    { label: "Ubicación", value: first.ubicacion },
    { label: "Superficie", value: first.superficie },
    { label: "Plazo", value: first.plazo },
  ].filter((row) => row.value);
  const href = (project: Project) => `${ROUTES.projects}/${project.slug}`;

  return (
    <section id="proyectos" className="bg-piedra/45 text-ink">
      <div className="site-wrap py-24 lg:py-36">
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 lg:col-span-7">
            <p className="eyebrow reveal-item">02 / Proyectos seleccionados</p>
            <h2 className="reveal-item display-title mt-6 text-5xl leading-none sm:text-6xl xl:text-[5.5rem]">
              Obra a obra.
              <br />
              Detalle a detalle.
            </h2>
          </div>
          <p className="reveal-item col-span-12 leading-relaxed text-mid lg:col-span-4 lg:col-start-9">
            Cada intervención tiene su propia ficha: punto de partida, condicionantes, intervención de ALKO y
            resultado.
          </p>
        </div>

        <article className="mt-16 grid grid-cols-12 items-end gap-6 lg:mt-24">
          <Link href={href(first)} className="reveal-scale group relative col-span-12 block aspect-[16/10] overflow-hidden bg-piedra lg:col-span-8">
            <Image
              src={cardImage(first, heroImage)}
              alt={`Proyecto ${first.title}`}
              fill
              sizes="(max-width: 1024px) 100vw, 64vw"
              className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.04]"
            />
          </Link>
          <div className="reveal-item col-span-12 lg:col-span-4 lg:pl-6">
            <p className="display-title text-7xl text-bronze/70">01</p>
            <h3 className="display-title mt-4 text-3xl">{first.title}</h3>
            {specs.length > 0 && (
              <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10 text-sm">
                {specs.map((row) => (
                  <div key={row.label} className="flex justify-between gap-6 py-3">
                    <dt className="text-mid">{row.label}</dt>
                    <dd className="text-right">{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <Link href={href(first)} className="arrow-link mt-8">
              Ver ficha del proyecto <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </article>

        {rest.length > 0 && (
          <div className="mt-20 grid grid-cols-12 gap-x-6 gap-y-16 lg:mt-28">
            {rest.map((project, i) => (
              <article
                key={project.id}
                className={
                  i === 0
                    ? "col-span-12 md:col-span-6 lg:col-span-5 lg:col-start-2"
                    : "col-span-12 md:col-span-6 md:mt-32 lg:col-span-4 lg:col-start-8"
                }
              >
                <Link href={href(project)} className="reveal-scale group relative block aspect-[4/5] overflow-hidden bg-piedra">
                  <Image
                    src={cardImage(project, heroImage)}
                    alt={`Proyecto ${project.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.04]"
                  />
                </Link>
                <div className="reveal-item mt-6 flex items-start justify-between gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-mid">
                      {String(i + 2).padStart(2, "0")}
                      {project.tipologia && ` · ${project.tipologia}`}
                    </p>
                    <h3 className="display-title mt-2 text-2xl">{project.title}</h3>
                  </div>
                  <Link
                    href={href(project)}
                    className="shrink-0 border-b border-ink pb-1 text-[10px] uppercase tracking-[0.22em] transition-colors hover:border-bronze hover:text-bronze"
                  >
                    Ver ficha ↗
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-ink/15 pt-8 sm:flex-row sm:items-center">
          <p className="text-[10px] uppercase tracking-[0.22em] text-mid">Cada obra, documentada de principio a fin</p>
          <Link href={ROUTES.projects} className="btn btn-ink">
            Ver todos los proyectos <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
