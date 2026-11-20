import type { Metadata } from "next";
import Image from "@/components/ui/Image";
import Link from "next/link";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import EditorialSection from "@/components/editorial/EditorialSection";
import HtmlLang from "@/components/i18n/HtmlLang";
import FinalContact from "@/components/sections/FinalContact";
import ArticlesIndex from "@/components/ui/ArticlesIndex";
import GuidesIndex from "@/components/ui/GuidesIndex";
import { getDbArticulosPageContent, getDbGuiasPageContent } from "@/lib/db/mysql";
import { LOCALE_META, languageAlternates, localizedPath, type Locale } from "@/lib/i18n";
import { JOURNAL_COPY, localizeArticle, localizeGuide } from "@/lib/i18n/journal";
import { pageJsonLd } from "@/lib/seo";
import { OG_IMAGE, ogImage, siteKeywords, ROUTES, SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { getArticles, getGuides, getSettings } from "@/lib/wordpress";

/** Metadatos del Journal en cada idioma, con canonical propio y alternativas hreflang. */
export function journalMetadata(locale: Locale): Metadata {
  const t = JOURNAL_COPY[locale].meta;
  const path = localizedPath(ROUTES.journal, locale);
  return {
    title: { absolute: t.title },
    description: t.description,
    alternates: { canonical: path, languages: languageAlternates(ROUTES.journal) },
    keywords: siteKeywords(locale),
    openGraph: {
      title: t.title,
      description: t.description,
      url: path,
      type: "website",
      locale: LOCALE_META[locale].ogLocale,
      alternateLocale: [LOCALE_META[locale === "es" ? "en" : "es"].ogLocale],
      siteName: SITE.name,
      images: [ogImage(locale)],
    },
  };
}

const absolute = (src: string) => (!src ? undefined : /^https?:\/\//.test(src) ? src : `${SITE.url}${src}`);

/**
 * Journal: artículos y guías en una sola página, compartida por /journal y /en/journal. Los
 * artículos están en castellano; en inglés se traducen los textos de las tarjetas y se avisa.
 */
export default async function JournalPage({ locale }: { locale: Locale }) {
  const t = JOURNAL_COPY[locale];
  const es = locale === "es";
  const [allArticles, allGuides, settings, panel, guidesPanel] = await Promise.all([
    getArticles(50),
    getGuides(),
    getSettings(),
    getDbArticulosPageContent(),
    getDbGuiasPageContent(),
  ]);
  const articles = [...allArticles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((a) => localizeArticle(a, locale));
  const guides = allGuides.map((g) => localizeGuide(g, locale));
  const [featured] = articles;

  // En castellano manda el panel (con el diccionario de respaldo); en inglés, el diccionario.
  const pick = (value: string | undefined, fallback: string) => (es && value) || fallback;
  const c = {
    eyebrow: pick(panel.headerBadge, t.header.eyebrow),
    title: pick(panel.headerTitulo, t.header.title),
    description: pick(panel.headerDescripcion, t.header.description),
    guidesTitle: pick(guidesPanel.headerTitulo, t.guidesSection.title),
    guidesIntro: pick(guidesPanel.headerDescripcion, t.guidesSection.intro),
  };

  const sections = [
    { href: "#articulos", label: t.header.articles, count: articles.length },
    { href: "#guias", label: t.header.guides, count: guides.length },
  ];

  // La página como colección: todos los artículos y guías, con su fecha e imagen.
  const path = localizedPath(ROUTES.journal, locale);
  const items = [
    ...articles.map((a) => ({
      url: `${SITE.url}${ROUTES.articles}/${a.slug}`,
      name: a.title,
      image: absolute(a.image),
      date: a.date,
    })),
    ...guides.map((g) => ({ url: `${SITE.url}${ROUTES.guides}/${g.slug}`, name: g.title, image: absolute(g.imagen), date: "" })),
  ];
  const jsonLd = pageJsonLd({
    type: "CollectionPage",
    path,
    name: t.meta.title,
    description: t.meta.description,
    extra: {
      inLanguage: es ? "es-ES" : "en",
      mainEntity: {
        "@type": "ItemList",
        name: t.meta.listName,
        numberOfItems: items.length,
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: item.url,
          name: item.name,
          ...(item.image && { image: item.image }),
        })),
      },
    },
  });

  return (
    <main className="bg-paper text-ink">
      <HtmlLang locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EditorialHeader
        locale={locale}
        breadcrumbs={[{ label: t.breadcrumb }]}
        eyebrow={c.eyebrow}
        title={<span className="whitespace-pre-line">{c.title}</span>}
        description={
          <>
            {c.description}
            {t.languageNote && <span className="mt-4 block text-sm text-mid">{t.languageNote}</span>}
          </>
        }
        aside={
          <nav aria-label={t.header.nav} className="flex flex-col">
            {sections.map((s) => (
              <a
                key={s.href}
                href={s.href}
                className="group flex items-baseline justify-between gap-6 border-t border-ink/15 py-4 transition-colors hover:text-bronze"
              >
                <span className="text-[11px] uppercase tracking-[0.22em]">{s.label}</span>
                <span className="flex items-baseline gap-3">
                  <span className="display-title text-3xl">{String(s.count).padStart(2, "0")}</span>
                  <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">↓</span>
                </span>
              </a>
            ))}
            {featured?.date && (
              <p className="border-t border-ink/15 pt-4 text-[10px] uppercase tracking-[0.22em] text-mid">
                {t.header.latest} · {formatDate(featured.date, locale)}
              </p>
            )}
          </nav>
        }
      />

      {/* Destacado: foto a lo ancho y texto a dos columnas debajo. */}
      {featured && (
        <section className="bg-paper">
          <div className="site-wrap pb-20 sm:pb-28">
            <Link href={`${ROUTES.articles}/${featured.slug}`} hrefLang={es ? undefined : "es"} className="group block">
              <div className="relative mt-8 aspect-[4/3] overflow-hidden bg-piedra sm:aspect-[21/9]">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.03]"
                />
                <span className="absolute left-4 top-4 bg-paper px-2.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-ink sm:left-6 sm:top-6">
                  {t.featured}
                </span>
              </div>
              <div className="mt-8 grid grid-cols-12 gap-x-6 gap-y-6">
                <div className="col-span-12 lg:col-span-7">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-mid">
                    <span className="text-bronze">{featured.category}</span>
                    {featured.date && <> · {formatDate(featured.date, locale)}</>}
                  </p>
                  <h2
                    lang={featured.translated ? undefined : "es"}
                    className="display-title mt-4 text-[2.2rem] leading-[1.04] transition-colors group-hover:text-bronze sm:text-5xl lg:text-6xl"
                  >
                    {featured.title}
                  </h2>
                </div>
                <div className="col-span-12 flex flex-col justify-end lg:col-span-4 lg:col-start-9">
                  {featured.excerpt && (
                    <p lang={featured.translated ? undefined : "es"} className="text-lg leading-relaxed text-mid">
                      {featured.excerpt}
                    </p>
                  )}
                  <span className="arrow-link mt-6 self-start">
                    {t.readArticle} <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <EditorialSection id="articulos" tone="white" number="01" label={t.archive.label} title={t.archive.title} intro={t.archive.intro} wide>
        <ArticlesIndex articles={articles} locale={locale} />
      </EditorialSection>

      {guides.length > 0 && (
        <EditorialSection id="guias" number="02" label={t.guidesSection.label} title={c.guidesTitle} intro={c.guidesIntro} wide>
          <GuidesIndex guides={guides} locale={locale} />
        </EditorialSection>
      )}

      <FinalContact settings={settings} id="contacto" source={t.source} locale={locale} />
    </main>
  );
}
