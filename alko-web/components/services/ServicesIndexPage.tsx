import type { Metadata } from "next";
import Image from "@/components/ui/Image";
import Link from "next/link";
import FinalContact from "@/components/sections/FinalContact";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import EditorialSection from "@/components/editorial/EditorialSection";
import HtmlLang from "@/components/i18n/HtmlLang";
import { ROUTES, SITE, ogImage, siteKeywords } from "@/lib/site";
import { LOCALE_META, languageAlternates, localizedPath, type Locale } from "@/lib/i18n";
import { SERVICE_PAGE_COPY } from "@/lib/i18n/service-page";
import { localizeSector } from "@/lib/i18n/services-content";
import { getSectors, getSettings } from "@/lib/wordpress";
import { getDbServiciosPageContent } from "@/lib/db/mysql";

/** Metadatos del listado de servicios en cada idioma, con canonical propio y alternativas hreflang. */
export function servicesMetadata(locale: Locale): Metadata {
  const t = SERVICE_PAGE_COPY[locale].index.meta;
  const path = localizedPath(ROUTES.sectors, locale);
  return {
    title: { absolute: t.title },
    description: t.description,
    alternates: { canonical: path, languages: languageAlternates(ROUTES.sectors) },
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

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Listado de servicios, compartido por /servicios y /en/services. En castellano mandan los textos de
 * cabecera del panel; en inglés, los del diccionario, y cada servicio con su nombre y descripción en inglés.
 */
export default async function ServicesIndexPage({ locale }: { locale: Locale }) {
  const t = SERVICE_PAGE_COPY[locale].index;
  const es = locale === "es";
  const [rawSectors, pageContent, settings] = await Promise.all([getSectors(), getDbServiciosPageContent(), getSettings()]);
  const sectors = rawSectors.map((sector) => localizeSector(sector, locale));
  const href = (slug: string) => localizedPath(`${ROUTES.sectors}/${slug}`, locale);

  return (
    <main className="bg-paper text-ink">
      <HtmlLang locale={locale} />
      <EditorialHeader
        breadcrumbs={[{ label: t.breadcrumb }]}
        locale={locale}
        eyebrow={(es && pageContent.headerBadge) || t.eyebrow}
        title={(es && pageContent.headerTitulo) || t.title}
        description={(es && pageContent.headerDescripcion) || t.description}
        image={pageContent.headerBgImage || sectors[0]?.imagen || "/sector-oficinas.jpg"}
        caption={t.caption}
        aside={
          <div>
            <div className="flex items-baseline justify-between gap-6 border-t border-ink/15 py-4">
              <span className="text-[11px] uppercase tracking-[0.22em]">{t.divisions}</span>
              <span className="display-title text-4xl">{pad(sectors.length)}</span>
            </div>
            <div className="flex items-baseline justify-between gap-6 border-t border-ink/15 py-4">
              <span className="text-[11px] uppercase tracking-[0.22em]">{t.contact}</span>
              <span className="display-title text-4xl">01</span>
            </div>
            <a
              href="#divisiones"
              className="group flex items-baseline justify-between gap-6 border-y border-ink/15 py-4 transition-colors hover:text-bronze"
            >
              <span className="text-[11px] uppercase tracking-[0.22em]">{t.seeAll}</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">↓</span>
            </a>
          </div>
        }
      />

      {/* Índice rápido: todas las divisiones en filas. */}
      <EditorialSection id="divisiones" number="01" label={t.indexLabel} title={t.indexTitle} intro={t.indexIntro}>
        <ul className="border-t border-ink/15">
          {sectors.map((sector, i) => (
            <li key={sector.id}>
              <Link
                href={href(sector.slug)}
                className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-4 border-b border-ink/15 py-5 sm:grid-cols-[3rem_minmax(0,2fr)_minmax(0,3fr)_auto] sm:gap-6"
              >
                <span className="text-[10px] tracking-[0.18em] text-bronze">{sector.numero || pad(i + 1)}</span>
                <span className="display-title text-xl leading-tight transition-colors group-hover:text-bronze sm:text-2xl">
                  {sector.title}
                </span>
                <span className="hidden truncate text-sm text-mid sm:block">{sector.descripcion}</span>
                <span aria-hidden="true" className="text-mid transition-transform group-hover:translate-x-1 group-hover:text-ink">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </EditorialSection>

      {/* Fichas de cada división con foto. */}
      <EditorialSection number="02" label={t.cardsLabel} title={t.cardsTitle} tone="white" wide>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector, i) => (
            <li key={sector.id} className="reveal-item">
              <Link href={href(sector.slug)} className="group flex h-full flex-col">
                <span className="relative block aspect-[4/3] overflow-hidden bg-piedra">
                  {sector.imagen && (
                    <Image
                      src={sector.imagen}
                      alt={t.cardAlt(sector.title)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.04]"
                    />
                  )}
                  <span className="absolute left-4 top-4 bg-paper px-2 py-1 text-[10px] tracking-[0.18em] text-ink">
                    {sector.numero || pad(i + 1)}
                  </span>
                </span>
                <span className="display-title mt-5 block text-2xl leading-tight transition-colors group-hover:text-bronze sm:text-[1.7rem]">
                  {sector.title}
                </span>
                {sector.descripcion && (
                  <span className="mt-3 line-clamp-3 block leading-relaxed text-mid">{sector.descripcion}</span>
                )}
                <span className="mt-auto block pt-6">
                  <span className="arrow-link">
                    {t.seeService} <span aria-hidden="true">↗</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </EditorialSection>

      <FinalContact settings={settings} id="contacto" source={t.source} locale={locale} />
    </main>
  );
}
