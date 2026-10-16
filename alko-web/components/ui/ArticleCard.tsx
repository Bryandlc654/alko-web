import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/site";
import type { Article } from "@/lib/types";

/** Tarjeta de artículo usada en el inicio y en el listado de conocimiento. */
export default function ArticleCard({
  article,
  index,
}: {
  article: Article;
  index?: number;
}) {
  const number = index != null ? `${String(index + 1).padStart(2, "0")} — ` : "";

  return (
    <article className="reveal-item group">
      <Link href={`${ROUTES.articles}/${article.slug}`} className="flex flex-col h-full">
        <div
          data-parallax="8"
          className="relative overflow-hidden aspect-[4/3] bg-stone-200 mb-5"
        >
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center filter brightness-[0.98] contrast-[1.02] transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        <span className="font-mono text-[10px] sm:text-[11px] text-stone-500 uppercase tracking-widest mb-2 block">
          {number}
          {article.category}
        </span>

        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif font-light text-xl sm:text-2xl text-stone-900 leading-snug tracking-tight group-hover:text-amber-800 transition-colors duration-300">
            {article.title}
          </h3>
          <span className="text-lg text-stone-400 group-hover:text-stone-900 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 shrink-0 pt-0.5">
            ↗
          </span>
        </div>
      </Link>
    </article>
  );
}
