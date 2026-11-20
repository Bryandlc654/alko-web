import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ContactTrigger from "@/components/contact/ContactTrigger";
import HtmlLang from "@/components/i18n/HtmlLang";
import ReadingProgress from "@/components/article/ReadingProgress";
import ShareButtons from "@/components/article/ShareButtons";
import TableOfContents from "@/components/article/TableOfContents";
import ArticleCard from "@/components/ui/ArticleCard";
import EditorialCta from "@/components/editorial/EditorialCta";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Image from "@/components/ui/Image";
import Prose from "@/components/ui/Prose";
import { prepareArticle } from "@/lib/articles";
import { metaDescription } from "@/lib/seo";
import { GUIDES_HREF, OG_IMAGE, ROUTES, SITE, ogImage, siteKeywords } from "@/lib/site";
import { LOCALE_META, languageAlternates, localizedPath, type Locale } from "@/lib/i18n";
import { ARTICLE_PAGE_COPY } from "@/lib/i18n/article-page";
import { localizeArticle } from "@/lib/i18n/journal";
import { getArticleBySlug, getArticles } from "@/lib/wordpress";
import { formatDate } from "@/lib/utils";

/** Metadatos de una página del Journal en cada idioma, con canonical propio y alternativas hreflang. */
function journalItemMetadata({
  esPath,
  locale,
  title,
  description,
  image,
  publishedTime,
  translated,
}: {
  esPath: string;
  locale: Locale;
  title: string;
  description: string;
  image?: string;
  publishedTime?: string;
  translated: boolean;
}): Metadata {
  const path = localizedPath(esPath, locale);
  const desc = metaDescription(description);
  return {
    title: { absolute: `${title} | ALKO` },
    description: desc,
    // Solo se anuncian las dos versiones si el contenido está traducido.
    alternates: { canonical: path, ...(translated && { languages: languageAlternates(esPath) }) },
    keywords: siteKeywords(locale),
    openGraph: {
      title: `${title} | ALKO`,
      description: desc,
      url: path,
      locale: LOCALE_META[locale].ogLocale,
      ...(translated && { alternateLocale: [LOCALE_META[locale === "es" ? "en" : "es"].ogLocale] }),
      siteName: SITE.name,
      images: [image ? { url: image, alt: title } : locale === "es" ? OG_IMAGE : ogImage(locale)],
      ...(publishedTime ? { type: "article" as const, publishedTime } : { type: "website" as const }),
    },
  };
}

/** Metadatos de un artículo en cada idioma. */
export async function articleMetadata(slug: string, locale: Locale): Promise<Metadata> {
  const raw = await getArticleBySlug(slug);
  if (!raw) return {};
  const article = localizeArticle(raw, locale);
  if (!article.hasPage) return {};
  return journalItemMetadata({
    esPath: `${ROUTES.articles}/${raw.slug}`,
    locale,
    title: article.title,
    description: article.excerpt || article.content,
    image: article.image || undefined,
    publishedTime: article.date || undefined,
    translated: localizeArticle(raw, "en").hasPage,
  });
}

/**
 * Página de un artículo, compartida por /journal/[slug] y /en/journal/[slug]. En inglés solo existe si
 * el artículo está traducido en lib/i18n/journal-content.
 */
export default async function ArticleDetailPage({ slug, locale }: { slug: string; locale: Locale }) {
  const t = ARTICLE_PAGE_COPY[locale].article;
  const raw = await getArticleBySlug(slug);
  if (!raw) return notFound();
  const article = localizeArticle(raw, locale);
  if (!article.hasPage) return notFound();
  const journalHref = localizedPath(ROUTES.journal, locale);

  // Las novedades (categoría Actualidad) viven dentro de Guías.
  const isNews = false;
  const { lead, body, toc, minutes } = prepareArticle(article.content);
  const showToc = toc.length >= 3;
  const url = `${SITE.url}${localizedPath(`${ROUTES.articles}/${article.slug}`, locale)}`;

  // Más lecturas: primero las de la misma categoría y, si faltan, las demás.
  // En inglés, solo los artículos que tienen versión inglesa.
  const pool = (await getArticles(50))
    .map((item) => localizeArticle(item, locale))
    .filter((item) => item.slug !== article.slug && item.hasPage);
  const related = [
    ...pool.filter((item) => item.category === article.category),
    ...pool.filter((item) => item.category !== article.category),
  ].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt || lead,
    image: article.image || undefined,
    datePublished: article.date || undefined,
    mainEntityOfPage: url,
    publisher: { "@type": "Organization", name: "ALKO" },
    inLanguage: locale === "es" ? "es-ES" : "en",
  };

  return (
    <main className="bg-paper text-ink">
      <HtmlLang locale={locale} />
      <ReadingProgress targetId="articulo" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Cabecera editorial clara: migas, ficha en una línea, titular grande y entradilla. */}
      <header className="bg-paper">
        <div className="site-wrap pt-28 sm:pt-36 lg:pt-40">
          <div className="hh-rise flex items-center justify-between gap-6 border-b border-ink/15 pb-5">
            <Breadcrumbs
              items={[{ label: "Journal", href: isNews ? localizedPath(GUIDES_HREF, locale) : journalHref }, { label: article.title }]}
              tone="dark"
              className="min-w-0"
              locale={locale}
            />
            <span className="hidden shrink-0 text-[10px] uppercase tracking-[0.22em] text-mid sm:block">
              {t.reading(minutes)}
            </span>
          </div>

          <p className="hh-rise mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.22em] sm:mt-16">
            {article.category && <span className="bg-ink px-2 py-1 text-paper">{article.category}</span>}
            {article.date && (
              <time dateTime={article.date} className="text-mid">
                {formatDate(article.date, locale)}
              </time>
            )}
            <span className="text-mid sm:hidden">· {minutes} min</span>
          </p>
          <h1 className="hh-rise display-title mt-6 max-w-[20ch] text-[2.6rem] leading-[1] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
            {article.title}
          </h1>

          {article.excerpt && (
            <div
              className="hh-rise mt-12 grid grid-cols-12 gap-6 border-t border-ink/15 pt-8 sm:mt-16"
              style={{ animationDelay: ".15s" }}
            >
              <p className="col-span-12 max-w-2xl text-lg leading-relaxed text-mid sm:text-xl lg:col-span-7">{article.excerpt}</p>
              <div className="col-span-12 hidden lg:col-span-3 lg:col-start-10 lg:block">
                <span className="mb-3 block text-[10px] uppercase tracking-[0.22em] text-mid">{t.share}</span>
                <ShareButtons url={url} title={article.title} />
              </div>
            </div>
          )}
        </div>

        {article.image && (
          <figure className="site-wrap mt-14 sm:mt-20">
            <div className="hh-rise relative aspect-[4/3] overflow-hidden bg-piedra sm:aspect-[21/9]" style={{ animationDelay: ".25s" }}>
              <Image
                src={article.image}
                alt={article.title}
                fill
                priority
                sizes="100vw"
                className="hh-zoom object-cover"
              />
            </div>
            <figcaption className="mt-4 flex items-center gap-4 text-mid">
              <span className="text-[10px] uppercase tracking-[0.22em]">{article.category || "Journal"}</span>
              <span className="cota flex-1 text-ink" aria-hidden="true" />
              <span className="text-[10px] uppercase tracking-[0.22em]">ALKO</span>
            </figcaption>
          </figure>
        )}
      </header>

      <div className="site-wrap py-16 sm:py-24">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <article id="articulo" className="col-span-12 lg:col-span-7 lg:col-start-2">
            {lead && (
              <p className="display-title mb-14 text-2xl leading-snug text-ink sm:text-[2rem]">
                <span aria-hidden="true" className="mr-3 text-bronze">↘</span>
                {lead}
              </p>
            )}
            <Prose html={body} variant="article" />

            <div className="mt-16 flex flex-col gap-6 border-t border-ink/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="lg:hidden">
                <span className="mb-3 block text-[10px] uppercase tracking-[0.22em] text-mid">{t.share}</span>
                <ShareButtons url={url} title={article.title} />
              </div>
              <Link href={isNews ? localizedPath(GUIDES_HREF, locale) : journalHref} className="arrow-link self-start sm:self-auto">
                <span aria-hidden="true">←</span> {t.back}
              </Link>
            </div>
          </article>

          {/* Columna derecha: ficha e índice, fijos al hacer scroll. */}
          <aside className="order-first col-span-12 lg:order-none lg:col-span-3 lg:col-start-10">
            <div className="lg:sticky lg:top-32">
              <dl className="grid grid-cols-3 border-t border-ink/15 lg:grid-cols-1">
                {[
                  { label: t.category, value: article.category },
                  { label: t.published, value: article.date ? formatDate(article.date, locale) : "" },
                  { label: t.readingLabel, value: `${minutes} min` },
                ]
                  .filter((item) => item.value)
                  .map((item) => (
                    <div key={item.label} className="border-b border-ink/15 py-4 pr-3">
                      <dt className="text-[10px] uppercase tracking-[0.22em] text-mid">{item.label}</dt>
                      <dd className="mt-1 text-sm">{item.value}</dd>
                    </div>
                  ))}
              </dl>

              {showToc && (
                <>
                  {/* Móvil: índice plegable. */}
                  <details className="group mt-6 border border-ink/15 lg:hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[10px] uppercase tracking-[0.22em]">
                      {t.toc}
                      <span aria-hidden="true" className="text-lg leading-none transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="border-t border-ink/15 px-5 py-4">
                      <TableOfContents items={toc} />
                    </div>
                  </details>

                  <div className="mt-10 hidden lg:block">
                    <span className="mb-5 block text-[10px] uppercase tracking-[0.22em] text-mid">{t.toc}</span>
                    <TableOfContents items={toc} />
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>

      <EditorialCta
        label={t.ctaLabel}
        title={t.ctaTitle}
        description={t.ctaText}
      >
        <ContactTrigger mode="avanzado" source={`Artículo ${raw.title}${locale === "en" ? " · EN" : ""}`} className="btn btn-paper">
          {t.cta} <span aria-hidden="true">→</span>
        </ContactTrigger>
      </EditorialCta>

      {related.length > 0 && (
        <section className="bg-paper">
          <div className="site-wrap py-20 sm:py-28">
            <div className="flex flex-col gap-4 border-t border-ink/15 pt-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-mid">{t.more}</p>
                <h2 className="display-title mt-4 text-4xl leading-none sm:text-5xl">{t.keepReading}</h2>
              </div>
              <Link href={journalHref} className="arrow-link self-start sm:self-auto">
                {t.seeJournal} <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item.id} article={item} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
