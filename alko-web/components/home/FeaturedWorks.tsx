import Image from "next/image";
import Link from "next/link";
import SectionHead from "@/components/home/SectionHead";
import { ROUTES } from "@/lib/site";
import type { Project } from "@/lib/types";

function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  const meta = [project.tipologia, project.ubicacion].filter(Boolean);
  const summary = project.reto || project.resultado;

  return (
    <Link href={`${ROUTES.projects}/${project.slug}`} className="reveal-item group block min-w-0">
      <div
        className={`relative overflow-hidden bg-piedra ${large ? "aspect-[1.08]" : "aspect-[1.4]"}`}
      >
        <Image
          src={project.imagen}
          alt={`Proyecto ${project.title}`}
          fill
          sizes={large ? "(max-width: 768px) 100vw, 56vw" : "(max-width: 768px) 100vw, 44vw"}
          className="object-cover transition-transform duration-[650ms] ease-alko group-hover:scale-105"
        />
      </div>
      {meta.length > 0 && (
        <div className="flex justify-between gap-4 pt-[18px] text-[10px] uppercase tracking-[0.12em] text-mid">
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      )}
      <h3 className="display-title mt-2 text-[clamp(25px,3vw,43px)] font-normal tracking-[-0.05em] transition-colors group-hover:text-bronze">
        {project.title} <span aria-hidden="true">↗</span>
      </h3>
      {summary && <p className="mt-2 line-clamp-2 max-w-[440px] text-[13px] leading-relaxed text-mid">{summary}</p>}
    </Link>
  );
}

/** Tres proyectos destacados de ALKO, enlazados a su ficha. */
export default function FeaturedWorks({ projects }: { projects: Project[] }) {
  const [first, ...rest] = projects.slice(0, 3);
  if (!first) return null;

  return (
    <section id="proyectos" className="section-y bg-warm text-ink">
      <div className="site-wrap">
        <SectionHead
          eyebrow="02 / Trabajo real"
          title={
            <>
              Obra a obra.
              <br />
              Detalle a detalle.
            </>
          }
          text="El portfolio es nuestra prueba principal. Cada intervención tiene su propia ficha, con fotografías y alcance comprobable."
        />

        <div className={`grid grid-cols-1 gap-10 md:gap-7 ${rest.length ? "md:grid-cols-[1.3fr_1fr]" : ""}`}>
          <ProjectCard project={first} large />
          {rest.length > 0 && (
            <div className="grid content-start gap-10">
              {rest.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-11 flex justify-end border-t border-line pt-6">
          <Link href={ROUTES.projects} className="arrow-link">
            Ver todos los proyectos <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
