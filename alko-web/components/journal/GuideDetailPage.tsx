import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "@/components/ui/Image";
import Link from "next/link";
import ContactTrigger from "@/components/contact/ContactTrigger";
import HtmlLang from "@/components/i18n/HtmlLang";
import TableOfContents from "@/components/article/TableOfContents";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import EditorialCta from "@/components/editorial/EditorialCta";
import Prose from "@/components/ui/Prose";
import { prepareArticle } from "@/lib/articles";
import { metaDescription } from "@/lib/seo";
import { GUIDES_HREF, OG_IMAGE, ROUTES, SITE, ogImage, siteKeywords } from "@/lib/site";
import { LOCALE_META, languageAlternates, localizedPath, type Locale } from "@/lib/i18n";
import { ARTICLE_PAGE_COPY } from "@/lib/i18n/article-page";
import { localizeGuide } from "@/lib/i18n/journal";
import { getGuideBySlug, getGuides } from "@/lib/wordpress";

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

/** Metadatos de una guía en cada idioma. */
export async function guideMetadata(slug: string, locale: Locale): Promise<Metadata> {
  const raw = await getGuideBySlug(slug);
  if (!raw) return {};
  const guide = localizeGuide(raw, locale);
  if (!guide.hasPage) return {};
  return journalItemMetadata({
    esPath: `${ROUTES.guides}/${raw.slug}`,
    locale,
    title: guide.title,
    description: guide.descripcion,
    image: guide.imagen || undefined,
    translated: localizeGuide(raw, "en").hasPage,
  });
}

/**
 * Página de una guía, compartida por /journal/guias/[slug] y /en/journal/guides/[slug]. En inglés solo
 * existe si la guía está traducida en lib/i18n/journal-content.
 */
export default async function GuideDetailPage({ slug, locale }: { slug: string; locale: Locale }) {
  const t = ARTICLE_PAGE_COPY[locale].guide;
  const [raw, rawGuides] = await Promise.all([getGuideBySlug(slug), getGuides()]);
  if (!raw) return notFound();
  const guide = localizeGuide(raw, locale);
  if (!guide.hasPage) return notFound();
  const guidesHref = localizedPath(GUIDES_HREF, locale);

  const others = rawGuides.map((g) => localizeGuide(g, locale)).filter((g) => g.slug !== guide.slug && g.hasPage);
  // Igual que en los artículos: entradilla, índice con los apartados (h2) y tiempo de lectura.
  const { lead, body, toc, minutes } = prepareArticle(guide.content);
  const showToc = toc.length >= 3;
  const lectura = guide.lectura || `${minutes} min`;

  return (
    <main className="bg-paper text-ink">
      <HtmlLang locale={locale} />
      {/* Cabecera clara, como la de los artículos. */}
      <header className="bg-paper">
        <div className="site-wrap pt-28 sm:pt-36 lg:pt-40">
          <div className="hh-rise flex items-center justify-between gap-6 border-b border-ink/15 pb-5">
            <Breadcrumbs
              items={[
                { label: "Journal", href: localizedPath(ROUTES.journal, locale) },
                { label: t.breadcrumb, href: guidesHref },
                { label: guide.title },
              ]}
              tone="dark"
              className="min-w-0"
              locale={locale}
            />
            <span className="hidden shrink-0 text-[10px] uppercase tracking-[0.22em] text-mid sm:block">
              {t.guide} <span className="text-bronze">{guide.numero}</span>
            </span>
          </div>

          <p className="hh-rise mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.22em] sm:mt-16">
            <span className="bg-ink px-2 py-1 text-paper">{t.stepByStep}</span>
            {guide.tema && <span className="text-mid">{guide.tema}</span>}
            <span className="text-mid">· {t.reading(lectura)}</span>
          </p>
          <h1 className="hh-rise display-title mt-6 max-w-[20ch] text-[2.6rem] leading-[1] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
            {guide.title}
          </h1>

          {guide.descripcion && (
            <div className="hh-rise mt-12 grid grid-cols-12 gap-6 border-t border-ink/15 pt-8 sm:mt-16" style={{ animationDelay: ".15s" }}>
              <p className="col-span-12 max-w-2xl text-lg leading-relaxed text-mid sm:text-xl lg:col-span-7">{guide.descripcion}</p>
            </div>
          )}
        </div>

        {guide.imagen && (
          <figure className="site-wrap mt-14 sm:mt-20">
            <div className="hh-rise relative aspect-[4/3] overflow-hidden bg-piedra sm:aspect-[21/9]" style={{ animationDelay: ".25s" }}>
              <Image src={guide.imagen} alt={guide.title} fill priority sizes="100vw" className="hh-zoom object-cover" />
            </div>
            <figcaption className="mt-4 flex items-center gap-4 text-mid">
              <span className="text-[10px] uppercase tracking-[0.22em]">{t.guide} {guide.numero}</span>
              <span className="cota flex-1 text-ink" aria-hidden="true" />
              <span className="text-[10px] uppercase tracking-[0.22em]">{guide.tema || "ALKO"}</span>
            </figcaption>
          </figure>
        )}
      </header>

      <div className="site-wrap py-16 sm:py-24">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <article className="col-span-12 lg:col-span-7 lg:col-start-2">
            {lead && (
              <p className="display-title mb-14 text-2xl leading-snug sm:text-[2rem]">
                <span aria-hidden="true" className="mr-3 text-bronze">↘</span>
                {lead}
              </p>
            )}
            <Prose html={body} variant="article" />

            <div className="mt-16 border-t border-ink/15 pt-8">
              <Link href={guidesHref} className="arrow-link">
                <span aria-hidden="true">←</span> {t.back}
              </Link>
            </div>
          </article>

          {/* Columna derecha: ficha e índice, fijos al hacer scroll. */}
          <aside className="order-first col-span-12 lg:order-none lg:col-span-3 lg:col-start-10">
            <div className="lg:sticky lg:top-32">
              <dl className="grid grid-cols-3 border-t border-ink/15 lg:grid-cols-1">
                {[
                  { label: t.guide, value: guide.numero },
                  { label: t.topic, value: guide.tema },
                  { label: t.readingLabel, value: lectura },
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
        <ContactTrigger mode="avanzado" source={`Guía ${raw.title}${locale === "en" ? " · EN" : ""}`} className="btn btn-paper">
          {t.cta} <span aria-hidden="true">→</span>
        </ContactTrigger>
      </EditorialCta>

      {/* Otras guías. */}
      {others.length > 0 && (
        <section className="bg-paper">
          <div className="site-wrap py-20 sm:py-28">
            <div className="flex flex-col gap-4 border-t border-ink/15 pt-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-mid">{t.othersLabel}</p>
                <h2 className="display-title mt-4 text-4xl leading-none sm:text-5xl">{t.others}</h2>
              </div>
              <Link href={guidesHref} className="arrow-link self-start sm:self-auto">
                {t.seeAll} <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <ul className="mt-10 border-t border-ink/15">
              {others.map((other) => (
                <li key={other.id}>
                  <Link
                    href={localizedPath(`${ROUTES.guides}/${other.slug}`, locale)}
                    className="group grid grid-cols-[3rem_minmax(0,1fr)_auto] items-baseline gap-4 border-b border-ink/15 py-6 sm:grid-cols-[4rem_minmax(0,3fr)_minmax(0,1fr)_auto] sm:gap-6"
                  >
                    <span className="display-title text-2xl text-bronze">{other.numero}</span>
                    <span className="display-title text-xl leading-snug transition-colors group-hover:text-bronze sm:text-2xl">
                      {other.title}
                    </span>
                    <span className="hidden text-[10px] uppercase tracking-[0.22em] text-mid sm:block">
                      {[other.tema, other.lectura].filter(Boolean).join(" · ")}
                    </span>
                    <span aria-hidden="true" className="text-mid transition-transform group-hover:translate-x-1 group-hover:text-ink">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
