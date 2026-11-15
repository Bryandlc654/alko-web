"use client";

import Image from "@/components/ui/Image";
import Link from "next/link";
import { useMemo, useState, useEffect, useRef } from "react";
import { ROUTES } from "@/lib/site";
import ExclusiveSeal, { EXCLUSIVE_GOLD } from "@/components/ui/ExclusiveSeal";
import type { Project } from "@/lib/types";
import { CATEGORY_ORDER, projectCategory } from "@/lib/project-category";
import { Loader2 } from "lucide-react";

const ALL = "Todos";
const INITIAL_PAGE_SIZE = 6;
const LOAD_MORE_STEP = 3;


export interface ProjectSummary extends Project {
  /** Primer párrafo del contenido, sin HTML. */
  extracto: string;
}

/**
 * Listado de /proyectos: rejilla de fotos a sangre (una a todo el ancho y dos en pareja) con filtro por tipología
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
      const category = projectCategory(project.tipologia || "");
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
    return CATEGORY_ORDER.filter((name) => counts.has(name)).map((name) => ({ name, count: counts.get(name)! }));
  }, [projects]);

  const filtered = useMemo(() => {
    return active === ALL ? projects : projects.filter((p) => projectCategory(p.tipologia || "") === active);
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
      <div className="reveal-item grid grid-cols-12 items-end gap-6">
        <div className="col-span-12 lg:col-span-7">
          <p className="eyebrow">Portfolio</p>
          <h2 className="display-title mt-6 text-5xl leading-none sm:text-6xl xl:text-[5.5rem]">
            Todas las obras.
          </h2>
        </div>
        <p className="col-span-12 leading-relaxed text-mid lg:col-span-4 lg:col-start-9">
          Viviendas, oficinas y locales ejecutados con dirección técnica unificada. Entra en cada uno para ver su
          ficha completa.
        </p>
      </div>

      {types.length > 1 && (
        // Filtros como fichas cuadradas: la activa en tinta.
        <div
          role="group"
          aria-label="Filtrar por tipología"
          className="no-scrollbar -mx-[var(--gutter)] mt-12 flex gap-2 overflow-x-auto px-[var(--gutter)] sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {filters.map((filter) => {
            const selected = filter.name === active;
            return (
              <button
                key={filter.name}
                type="button"
                aria-pressed={selected}
                onClick={() => handleFilterChange(filter.name)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap border px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                  selected
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/20 text-ink hover:border-ink"
                }`}
              >
                {filter.name}
                <span className={`text-[10px] tracking-normal ${selected ? "text-paper/60" : "text-mid"}`}>
                  {String(filter.count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <ul className="mt-10 grid grid-cols-1 gap-2 md:grid-cols-2">
        {visibleProjects.map((project, i) => {
          // Ritmo de tres: una obra a todo el ancho y dos en pareja.
          const wide = i % 3 === 0;
          const meta = [project.tipologia, project.ubicacion].filter(Boolean).join(" · ");
          return (
            <li key={project.id} className={`hh-rise ${wide ? "md:col-span-2" : ""}`} style={{ animationDuration: "1s" }}>
              <Link
                href={`${ROUTES.projects}/${project.slug}`}
                className={`group relative block aspect-[4/5] overflow-hidden bg-ink text-white ${
                  wide ? "md:aspect-[16/8]" : "md:aspect-[57/60]"
                }`}
              >
                <Image
                  src={project.imagen}
                  alt={project.title}
                  fill
                  sizes={wide ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                  className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />

                <span className="absolute left-4 top-4 border border-white/50 px-2 py-1 text-[10px] uppercase tracking-[0.18em] md:left-6 md:top-6">
                  {project.indice}
                  {project.anio && ` · ${project.anio}`}
                </span>
                {project.exclusivo && (
                  <span className="absolute right-4 top-4 bg-stone-950/55 p-1.5 backdrop-blur-sm md:right-6 md:top-6">
                    <ExclusiveSeal
                      size={wide ? 92 : 76}
                      className="transition-transform duration-1000 ease-out group-hover:rotate-[20deg]"
                    />
                  </span>
                )}

                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-6 md:inset-x-8 md:bottom-8">
                  <div className="max-w-2xl">
                    {project.exclusivo && (
                      <span
                        className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em]"
                        style={{ color: EXCLUSIVE_GOLD }}
                      >
                        <span aria-hidden="true" className="h-px w-8" style={{ backgroundColor: EXCLUSIVE_GOLD }} />
                        ALKO Exclusiva
                      </span>
                    )}
                    {meta && <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">{meta}</p>}
                    <h3 className={`display-title mt-3 ${wide ? "text-3xl md:text-5xl" : "text-3xl md:text-4xl"}`}>
                      {project.title}
                    </h3>
                    {project.extracto && (
                      <p
                        className={`mt-4 max-w-xl text-sm leading-relaxed text-white/80 ${
                          wide ? "line-clamp-2" : "line-clamp-2 md:hidden"
                        }`}
                      >
                        {project.extracto}
                      </p>
                    )}
                  </div>
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/70 text-lg transition-colors group-hover:bg-paper group-hover:text-ink"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Centinela de Scroll y Botón Mostrar Más */}
      <div ref={sentinelRef} className="pt-16 pb-4 flex flex-col items-center justify-center">
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
