import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/site";
import type { Project } from "@/lib/types";

/** Listado editorial de proyectos (reutilizado en el inicio y en /proyectos). */
export default function ProjectsList({ projects }: { projects: Project[] }) {
  return (
    <div className="mt-8 space-y-6">
      {projects.map((project, i) => (
        <Link
          key={project.id}
          href={`${ROUTES.projects}/${project.slug}`}
          className="project-card reveal-item block border-b border-stone-300/70 pb-6 group"
          style={{ transitionDelay: `${(i + 1) * 100}ms` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 cursor-pointer">
            <div className="flex items-center gap-4">
              <h3 className="text-xl sm:text-2xl font-sans font-light text-stone-900 tracking-tight leading-snug group-hover:text-amber-800 transition">
                {project.title}
              </h3>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-12 text-xs text-stone-600">
              <span className="font-light tracking-wide text-stone-500">
                {project.ubicacion}
              </span>
              <span className="px-4 py-1 rounded-full border border-stone-300 text-[11px] font-mono text-stone-700 bg-white/70">
                {project.anio}
              </span>
              <span className="font-light tracking-wider text-stone-900 group-hover:underline flex items-center gap-1">
                Ver Proyecto [{project.indice}] ↗
              </span>
            </div>
          </div>

          <div
            data-parallax="10"
            className="reveal-scale relative mt-4 w-full h-[380px] sm:h-[500px] lg:h-[600px] overflow-hidden shadow-lg rounded-none"
          >
            <Image
              src={project.imagen}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover object-center filter brightness-100 contrast-[1.02] transition-transform duration-1000 ease-out group-hover:scale-105 rounded-none"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
