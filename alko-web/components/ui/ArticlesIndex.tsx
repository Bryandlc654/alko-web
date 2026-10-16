"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ROUTES } from "@/lib/site";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const ALL = "TODOS";

/**
 * Índice editorial de artículos con filtro por categoría.
 *
 * Las filas no usan `reveal-item`: SiteScripts solo anima los elementos que
 * existen al cargar la ruta, así que las filas que aparecen al filtrar se
 * quedarían ocultas. La animación de entrada se aplica al contenedor.
 */
export default function ArticlesIndex({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState(ALL);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const article of articles) {
      const category = article.category || "GENERAL";
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
    return Array.from(counts, ([name, count]) => ({ name, count }));
  }, [articles]);

  const visible =
    active === ALL
      ? articles
      : articles.filter((article) => (article.category || "GENERAL") === active);

  const filters = [{ name: ALL, count: articles.length }, ...categories];

  return (
    <div className="reveal-item">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between pb-8 border-b border-stone-300/60">
        <div>
          <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase mb-2">
            ARCHIVO
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-stone-900 tracking-tight leading-none">
            Todos los artículos
          </h2>
        </div>

        {categories.length > 1 && (
          <div role="group" aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
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
        {visible.map((article, i) => (
          <li key={article.id} className="border-b border-[#e1e1df]">
            <Link
              href={`${ROUTES.articles}/${article.slug}`}
              className="group grid grid-cols-12 gap-x-4 gap-y-3 sm:gap-x-8 py-8 sm:py-10 items-center"
            >
              <span className="col-span-12 sm:col-span-2 font-mono text-[11px] tracking-widest uppercase text-stone-400 group-hover:text-stone-900 transition-colors">
                {String(i + 1).padStart(2, "0")}
                {article.date && (
                  <span className="sm:block sm:mt-2">
                    <span className="sm:hidden"> · </span>
                    {formatDate(article.date)}
                  </span>
                )}
              </span>

              <div className="col-span-12 sm:col-span-7 lg:col-span-6">
                <span className="block font-mono text-[10px] sm:text-[11px] text-amber-800 uppercase tracking-widest mb-2">
                  {article.category}
                </span>
                <h3 className="font-serif font-light text-2xl sm:text-3xl lg:text-4xl text-stone-900 leading-tight tracking-tight group-hover:text-amber-800 transition-colors duration-300">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="mt-3 max-w-xl text-sm sm:text-base text-stone-600 font-light leading-relaxed">
                    {article.excerpt}
                  </p>
                )}
              </div>

              <div className="hidden sm:block sm:col-span-3 lg:col-span-3 lg:col-start-9">
                <div className="relative overflow-hidden aspect-[4/3] bg-stone-200">
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 25vw, 22vw"
                    className="object-cover object-center grayscale-[35%] transition duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
                  />
                </div>
              </div>

              <span
                aria-hidden="true"
                className="hidden lg:flex lg:col-span-1 justify-end text-2xl text-stone-300 group-hover:text-stone-900 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                ↗
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="py-16 text-center text-stone-500 font-light">
          No hay artículos en esta categoría todavía.
        </p>
      )}
    </div>
  );
}
