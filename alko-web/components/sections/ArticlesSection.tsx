import Link from "next/link";
import { ROUTES } from "@/lib/site";
import type { Article } from "@/lib/types";
import ArticleCard from "@/components/ui/ArticleCard";

export default function ArticlesSection({ articles }: { articles: Article[] }) {
  const items = articles.slice(0, 3);

  return (
    <section
      id="articulos"
      className="relative bg-white text-stone-900 py-24 sm:py-32 border-t border-stone-300/70 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <div className="flex items-end justify-between pb-8 border-b border-stone-300/60 mb-12 sm:mb-16">
          <div className="reveal-item">
            <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase mb-2">
              BIBLIOTECA TÉCNICA
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light text-stone-900 tracking-tight leading-none">
              Conocimiento
            </h2>
          </div>
          <div className="reveal-item">
            <Link
              href={ROUTES.articles}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-800 hover:text-amber-800 transition group/all"
            >
              <span className="underline underline-offset-4 decoration-stone-900/30 group-hover/all:decoration-stone-900">
                Ver todo
              </span>
              <span className="transition-transform group-hover/all:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {items.map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
