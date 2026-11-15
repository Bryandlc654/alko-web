import Link from "next/link";
import { ROUTES } from "@/lib/site";
import type { Article, HomeContent } from "@/lib/types";
import ArticleCard from "@/components/ui/ArticleCard";

export default function ArticlesSection({ articles, content }: { articles: Article[]; content?: HomeContent }) {
  const items = articles.slice(0, 3);

  return (
    <section
      id="articulos"
      className="relative bg-white text-ink py-24 sm:py-32 border-t border-stone-300/70 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <div className="flex items-end justify-between pb-8 border-b border-stone-300/60 mb-12 sm:mb-16">
          <div className="reveal-item">
            <span className="eyebrow block mb-2">
              {content?.articulosTag ?? "BIBLIOTECA TÉCNICA"}
            </span>
            <h2 className="display-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink leading-none">
              {content?.articulosTitulo ?? "Journal"}
            </h2>
          </div>
          <div className="reveal-item">
            <Link
              href={ROUTES.journal}
              className="text-[10px] tracking-[0.22em] inline-flex items-center gap-2 uppercase text-stone-800 hover:text-amber-800 transition group/all"
            >
              <span className="underline underline-offset-4 decoration-stone-900/30 group-hover/all:decoration-stone-900">
                {content?.articulosCtaTexto ?? "Ver todo"}
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
