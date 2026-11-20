import Image from "@/components/ui/Image";
import Link from "next/link";
import { ROUTES } from "@/lib/site";
import { localizedPath, type Locale } from "@/lib/i18n";
import type { Article } from "@/lib/types";

const DATE_FMT: Record<Locale, Intl.DateTimeFormat> = {
  es: new Intl.DateTimeFormat("es-ES", { month: "short", year: "numeric" }),
  en: new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }),
};

function shortDate(iso: string, locale: Locale) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : DATE_FMT[locale].format(date).replace(".", "");
}

/** Tarjeta de artículo · Propuesta 6 (tarjeta blanca de la V5). */
export default function ArticleCard({
  article,
  index,
  className = "",
  locale = "es",
}: {
  article: Article;
  index?: number;
  className?: string;
  /** Idioma de la página: la tarjeta enlaza al artículo en ese idioma. */
  locale?: Locale;
}) {
  const date = shortDate(article.date, locale);

  return (
    <article className={`reveal-item bg-white p-1.5 ${className}`}>
      <Link href={localizedPath(`${ROUTES.articles}/${article.slug}`, locale)} className="group flex h-full flex-col">
        <span className="relative block aspect-[368/278] overflow-hidden bg-piedra">
          <Image
            src={article.image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-alko group-hover:scale-105"
          />
        </span>
        <span className="flex flex-1 flex-col p-3.5 pt-5">
          {index != null && (
            <span className="mb-2 text-[10px] uppercase tracking-[0.22em] text-bronze">{String(index + 1).padStart(2, "0")}</span>
          )}
          <span className="block min-h-[56px] text-[19px] leading-snug text-ink transition-colors group-hover:text-bronze">
            {article.title}
          </span>
          <span className="mt-auto flex items-center justify-between pt-8">
            <span className="text-[10px] uppercase tracking-[0.18em]">
              {article.category && <span className="bg-paper px-1.5 py-1">{article.category}</span>}
              {date && <span className="ml-1.5 text-mid">{date}</span>}
            </span>
            <span
              className="grid h-7 w-7 place-items-center bg-ink text-paper transition-colors group-hover:bg-bronze"
              aria-hidden="true"
            >
              →
            </span>
          </span>
        </span>
      </Link>
    </article>
  );
}
