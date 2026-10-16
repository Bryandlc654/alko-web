"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ROUTES } from "@/lib/site";
import type { Project } from "@/lib/types";

const ALL = "Todos";

export interface ProjectSummary extends Project {
  /** Primer párrafo del contenido, sin HTML. */
  extracto: string;
}

/**
 * Listado de /proyectos: filas editoriales alternadas con filtro por tipología.
 *
 * Igual que en ArticlesIndex, las filas no usan `reveal-item` (SiteScripts solo
 * anima lo que existe al cargar la ruta y las filas nuevas quedarían ocultas).
 */
export default function ProjectsGallery({ projects }: { projects: ProjectSummary[] }) {
  const [active, setActive] = useState(ALL);

  const types = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      if (!project.tipologia) continue;
      counts.set(project.tipologia, (counts.get(project.tipologia) ?? 0) + 1);
    }
    return Array.from(counts, ([name, count]) => ({ name, count }));
  }, [projects]);

  const visible = active === ALL ? projects : projects.filter((p) => p.tipologia === active);
  const filters = [{ name: ALL, count: projects.length }, ...types];

  return (
    <div>
      <div className="reveal-item flex flex-col gap-6 md:flex-row md:items-end md:justify-between pb-8 border-b border-stone-300">
        <div>
          <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase mb-2">
            PORTFOLIO
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-stone-900 tracking-tight leading-none">
            Obras seleccionadas
          </h2>
        </div>

        {types.length > 1 && (
          <div role="group" aria-label="Filtrar por tipología" className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const selected = filter.name === active;
              return (
                <button
                  key={filter.name}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActive(filter.name)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-light uppercase tracking-[0.16em] transition-colors ${
                    selected
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900"
                  }`}
                >
                  {filter.name}
                  <span className={`font-mono ${selected ? "text-white/50" : "text-stone-400"}`}>
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <ul>
        {visible.map((project, i) => {
          const reversed = i % 2 === 1;
          return (
            <li key={project.id} className="border-b border-stone-300 last:border-b-0">
              <Link
                href={`${ROUTES.projects}/${project.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 py-14 sm:py-20 items-center"
              >
                <div className={`lg:col-span-7 ${reversed ? "lg:order-2" : ""}`}>
                  <div className="relative overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-stone-200">
                    <Image
                      src={project.imagen}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                    <span className="absolute left-0 top-0 bg-stone-950 px-4 py-2 font-mono text-[11px] tracking-[0.2em] uppercase text-white">
                      {project.anio}
                    </span>
                  </div>
                </div>

                <div className={`lg:col-span-5 ${reversed ? "lg:order-1" : ""}`}>
                  <div className="flex items-baseline justify-between gap-6">
                    <span className="font-serif font-light text-7xl sm:text-8xl text-stone-900/10 leading-none select-none">
                      {project.indice}
                    </span>
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                    </span>
                  </div>

                  <h3 className="mt-4 font-serif font-light text-2xl sm:text-3xl lg:text-4xl text-stone-900 leading-[1.1] tracking-tight group-hover:text-amber-800 transition-colors duration-300">
                    {project.title}
                  </h3>

                  {project.extracto && (
                    <p className="mt-5 text-base sm:text-lg text-stone-600 font-light leading-relaxed line-clamp-4">
                      {project.extracto}
                    </p>
                  )}

                  <dl className="mt-8 border-t border-stone-300 text-sm">
                    {[
                      ["Tipología", project.tipologia],
                      ["Ubicación", project.ubicacion],
                      ["Año", project.anio],
                    ]
                      .filter(([, value]) => value)
                      .map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-6 border-b border-stone-300 py-3">
                          <dt className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-stone-500">
                            {label}
                          </dt>
                          <dd className="text-right text-stone-900 font-light">{value}</dd>
                        </div>
                      ))}
                  </dl>

                  <span className="mt-8 inline-flex items-center gap-3 rounded-full border border-stone-900 px-6 py-3 text-[11px] font-light uppercase tracking-[0.16em] text-stone-900 transition-colors group-hover:bg-stone-900 group-hover:text-white">
                    Ver proyecto
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
