import Link from "next/link";
import Rail from "@/components/home/Rail";
import ArticleCard from "@/components/ui/ArticleCard";
import { ROUTES } from "@/lib/site";
import { localizedPath, type Locale } from "@/lib/i18n";
import { localizeArticle } from "@/lib/i18n/journal";
import type { Article } from "@/lib/types";

const COPY = {
  es: { eyebrow: "Artículos y guías", titleA: "Criterio técnico,", titleB: "por escrito", all: "Ver todos", rail: "Artículos" },
  en: { eyebrow: "Articles and guides", titleA: "Technical judgement,", titleB: "in writing", all: "See all", rail: "Articles" },
} as const;

/**
 * Artículos y guías en carrusel horizontal (propuesta 6 · V5). En inglés, solo los artículos que
 * tienen versión inglesa, con sus textos traducidos.
 */
export default function HomeArticles({ articles, locale = "es" }: { articles: Article[]; locale?: Locale }) {
  const t = COPY[locale];
  const list = articles.map((article) => localizeArticle(article, locale)).filter((article) => article.hasPage);
  if (list.length === 0) return null;

  return (
    <section id="articulos" className="bg-paper pb-24 pt-10 text-ink">
      <div className="site-wrap flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow reveal-item">{t.eyebrow}</p>
          <h2 className="reveal-item display-title mt-5 text-[40px] md:text-[56px]">
            {t.titleA}
            <br />
            {t.titleB}
          </h2>
        </div>
        <Link href={localizedPath(ROUTES.journal, locale)} className="btn btn-ink self-start md:self-auto">
          {t.all} <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="site-wrap mt-14">
        <Rail label={t.rail}>
          {list.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              locale={locale}
              className="w-[80%] sm:w-[46%] md:w-[calc((100%-24px)/3.35)]"
            />
          ))}
        </Rail>
      </div>
    </section>
  );
}
