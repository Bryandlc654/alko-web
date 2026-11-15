"use client";

import Image from "@/components/ui/Image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ROUTES } from "@/lib/site";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const ALL = "Todos";

/**
 * Archivo del Journal: filtro por categoría y rejilla de tarjetas a tres columnas.
 *
 * Las tarjetas no usan `reveal-item`: SiteScripts solo anima los elementos que existen al cargar
 * la ruta, así que las que aparecen al filtrar se quedarían ocultas. Usan `hh-rise` (CSS), que se
 * dispara al montarse.
 */
export default function ArticlesIndex({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState(ALL);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const article of articles) {
      const category = article.category || "General";
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
    return Array.from(counts, ([name, count]) => ({ name, count }));
  }, [articles]);

  const visible =
    active === ALL ? articles : articles.filter((article) => (article.category || "General") === active);

  const filters = [{ name: ALL, count: articles.length }, ...categories];

  return (
    <div>
      {categories.length > 1 && (
        <div
          role="group"
          aria-label="Filtrar por categoría"
          className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {filters.map((filter) => {
            const selected = filter.name === active;
            return (
              <button
                key={filter.name}
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(filter.name)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap border px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                  selected ? "border-ink bg-ink text-paper" : "border-ink/20 text-ink hover:border-ink"
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

      <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((article, i) => (
          <li key={`${active}-${article.id}`} className="hh-rise" style={{ animationDuration: "1s", animationDelay: `${(i % 3) * 80}ms` }}>
            <Link href={`${ROUTES.articles}/${article.slug}`} className="group flex h-full flex-col">
              <span className="relative block aspect-[4/3] overflow-hidden bg-piedra">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.04]"
                />
              </span>
              <span className="mt-5 flex items-center justify-between gap-4 border-t border-ink/15 pt-4 text-[10px] uppercase tracking-[0.22em]">
                <span className="text-bronze">{article.category}</span>
                {article.date && <time className="text-mid">{formatDate(article.date)}</time>}
              </span>
              <span className="display-title mt-4 block text-2xl leading-tight transition-colors group-hover:text-bronze sm:text-[1.7rem]">
                {article.title}
              </span>
              {article.excerpt && (
                <span className="mt-3 line-clamp-3 block leading-relaxed text-mid">{article.excerpt}</span>
              )}
              <span className="mt-auto block pt-6">
                <span className="arrow-link">
                  Leer <span aria-hidden="true">↗</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {visible.length === 0 && <p className="py-16 text-center text-mid">No hay artículos en esta categoría todavía.</p>}
    </div>
  );
}
