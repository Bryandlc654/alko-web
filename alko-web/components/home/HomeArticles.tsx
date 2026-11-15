import Link from "next/link";
import Rail from "@/components/home/Rail";
import ArticleCard from "@/components/ui/ArticleCard";
import { ROUTES } from "@/lib/site";
import type { Article } from "@/lib/types";

/** Artículos y guías en carrusel horizontal (propuesta 6 · V5). */
export default function HomeArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section id="articulos" className="bg-paper pb-24 pt-10 text-ink">
      <div className="site-wrap flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow reveal-item">Artículos y guías</p>
          <h2 className="reveal-item display-title mt-5 text-[40px] md:text-[56px]">
            Criterio técnico,
            <br />
            por escrito
          </h2>
        </div>
        <Link href={ROUTES.articlesList} className="btn btn-ink self-start md:self-auto">
          Ver todos <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="site-wrap mt-14">
        <Rail label="Artículos">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              className="w-[80%] sm:w-[46%] md:w-[calc((100%-24px)/3.35)]"
            />
          ))}
        </Rail>
      </div>
    </section>
  );
}
