"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect, useRef } from "react";
import { ROUTES } from "@/lib/site";
import type { Project } from "@/lib/types";
import { Loader2 } from "lucide-react";

const ALL = "Todos";
const INITIAL_PAGE_SIZE = 4;
const LOAD_MORE_STEP = 3;

export interface ProjectSummary extends Project {
  /** Primer párrafo del contenido, sin HTML. */
  extracto: string;
}

/**
 * Listado de /proyectos: filas editoriales alternadas con filtro por tipología
 * y carga progresiva (paginación infinita por scroll + botón de "Mostrar más obras").
 */
export default function ProjectsGallery({ projects }: { projects: ProjectSummary[] }) {
  const [active, setActive] = useState(ALL);
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const types = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      if (!project.tipologia) continue;
      counts.set(project.tipologia, (counts.get(project.tipologia) ?? 0) + 1);
    }
    return Array.from(counts, ([name, count]) => ({ name, count }));
  }, [projects]);

  const filtered = useMemo(() => {
    return active === ALL ? projects : projects.filter((p) => p.tipologia === active);
  }, [active, projects]);

  // Al cambiar de categoría restablecer el contador
  const handleFilterChange = (filterName: string) => {
    setActive(filterName);
    setVisibleCount(INITIAL_PAGE_SIZE);
  };

  const visibleProjects = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const loadMore = () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    // Simular una ligera pausa fluida para renderizado elegante
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + LOAD_MORE_STEP, filtered.length));
      setIsLoadingMore(false);
    }, 300);
  };

  // IntersectionObserver para cargar automáticamente con scroll cuando el usuario llega al final
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first && first.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "250px 0px" }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [hasMore, visibleCount, filtered.length, isLoadingMore]);

  const filters = [{ name: ALL, count: projects.length }, ...types];

  return (
    <div>
      <div className="reveal-item flex flex-col gap-10 border-b border-ink/15 pb-10">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h2 className="display-title mt-6 text-5xl leading-none sm:text-6xl xl:text-[5.5rem]">
            Obra a obra.
            <br />
            Detalle a detalle.
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
                  onClick={() => handleFilterChange(filter.name)}
                  className={`inline-flex items-center gap-2 border px-4 py-2.5 text-[12px] transition-colors ${
                    selected
                      ? "border-ink bg-ink text-paper"
                      : "border-piedra text-mid hover:border-ink hover:text-ink"
                  }`}
                >
                  {filter.name}
                  <span className={selected ? "text-paper/50" : "text-mid/60"}>
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <ul>
        {visibleProjects.map((project, i) => {
          const reversed = i % 2 === 1;
          return (
            <li key={project.id} className="border-b border-ink/15 last:border-b-0">
              <Link
                href={`${ROUTES.projects}/${project.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 py-14 sm:py-20 items-center"
              >
                <div className={`lg:col-span-7 ${reversed ? "lg:order-2" : ""}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-piedra sm:aspect-[16/10]">
                    <Image
                      src={project.imagen}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-4 top-4 border border-white/60 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white">
                      {project.anio}
                    </span>
                  </div>
                </div>

                <div className={`lg:col-span-5 ${reversed ? "lg:order-1" : ""}`}>
                  <span className="display-title select-none text-7xl text-bronze/70">{project.indice}</span>

                  <h3 className="display-title mt-4 text-3xl transition-colors group-hover:text-bronze lg:text-4xl">
                    {project.title}
                  </h3>

                  {project.extracto && (
                    <p className="mt-5 line-clamp-4 leading-relaxed text-mid">
                      {project.extracto}
                    </p>
                  )}

                  <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10 text-sm">
                    {[
                      ["Tipología", project.tipologia],
                      ["Ubicación", project.ubicacion],
                      ["Año", project.anio],
                    ]
                      .filter(([, value]) => value)
                      .map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-6 py-3">
                          <dt className="text-mid">
                            {label}
                          </dt>
                          <dd className="text-right">{value}</dd>
                        </div>
                      ))}
                  </dl>

                  <span className="arrow-link mt-8">
                    Ver ficha del proyecto <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Centinela de Scroll y Botón Mostrar Más */}
      <div ref={sentinelRef} className="pt-12 pb-4 flex flex-col items-center justify-center">
        {hasMore ? (
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={loadMore}
              disabled={isLoadingMore}
              className="btn btn-outline disabled:opacity-50"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Cargando más obras...</span>
                </>
              ) : (
                <>
                  <span>Mostrar más obras</span>
                  <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">
                    ↓
                  </span>
                </>
              )}
            </button>
            <span className="text-[10px] uppercase tracking-[0.22em] text-mid">
              Mostrando {visibleProjects.length} de {filtered.length} proyectos
            </span>
          </div>
        ) : (
          filtered.length > 0 && (
            <div className="mx-auto w-full max-w-xs border-t border-ink/15 py-6 text-center">
              <span className="text-[10px] uppercase tracking-[0.22em] text-mid">
                Has visto todas las obras ({filtered.length})
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
