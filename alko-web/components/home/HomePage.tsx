import type { Metadata } from "next";
import DivisionsGrid from "@/components/home/DivisionsGrid";
import FeaturedWorks from "@/components/home/FeaturedWorks";
import HomeArticles from "@/components/home/HomeArticles";
import HomeFaq from "@/components/home/HomeFaq";
import HomeHero from "@/components/home/HomeHero";
import ManifestoBand from "@/components/home/ManifestoBand";
import MaterialStrip from "@/components/home/MaterialStrip";
import MethodSteps from "@/components/home/MethodSteps";
import Positioning from "@/components/home/Positioning";
import TeamSplit from "@/components/home/TeamSplit";
import FinalContact from "@/components/sections/FinalContact";
import Materials from "@/components/sections/Materials";
import { HOME_FAQ_BY_LOCALE } from "@/lib/faq";
import { HOME_PATHS, LOCALE_META, type Locale } from "@/lib/i18n";
import { HOME_COPY } from "@/lib/i18n/home";
import { OG_IMAGE, ROUTES, SITE } from "@/lib/site";
import type { Sector, SiteSettings } from "@/lib/types";
import { getHomeData } from "@/lib/wordpress";

/** URL absoluta de la portada de cada idioma (sin barra final en la raíz, como el canonical). */
const homeUrl = (locale: Locale) => (locale === "es" ? SITE.url : `${SITE.url}${HOME_PATHS[locale]}`);

/**
 * Metadatos de la portada en cada idioma: título, descripción, canonical propio y las
 * alternativas hreflang (es, en y x-default al castellano) para que Google sirva a cada
 * persona la versión de su idioma.
 */
export function homeMetadata(locale: Locale): Metadata {
  const t = HOME_COPY[locale].meta;
  return {
    title: { absolute: t.title },
    description: t.description,
    alternates: {
      canonical: HOME_PATHS[locale],
      languages: { es: HOME_PATHS.es, en: HOME_PATHS.en, "x-default": HOME_PATHS.es },
    },
    openGraph: {
      title: t.title,
      description: t.description,
      url: HOME_PATHS[locale],
      type: "website",
      locale: LOCALE_META[locale].ogLocale,
      alternateLocale: locale === "es" ? [LOCALE_META.en.ogLocale] : [LOCALE_META.es.ogLocale],
      siteName: SITE.name,
      images: [OG_IMAGE],
    },
  };
}

/**
 * Datos estructurados de la portada: la empresa (negocio local) con su catálogo de servicios,
 * el sitio web, la página y sus preguntas frecuentes. La empresa y el sitio son los mismos en
 * los dos idiomas (mismo @id); la página y las preguntas, propias de cada uno.
 */
function homeJsonLd(settings: SiteSettings, sectors: Sector[], locale: Locale) {
  const t = HOME_COPY[locale];
  const url = homeUrl(locale);
  const services = sectors.map((s) => s.title);
  const postalCode = settings.direccion?.match(/\b\d{5}\b/)?.[0];
  const sameAs = [settings.instagram, settings.facebook].filter((u) => /^https?:\/\//.test(u ?? ""));
  const business = {
    "@type": "GeneralContractor",
    "@id": `${SITE.url}/#empresa`,
    name: SITE.name,
    legalName: SITE.legalName,
    description: t.meta.description,
    url: SITE.url,
    logo: `${SITE.url}/logo.webp`,
    image: `${SITE.url}${OG_IMAGE.url}`,
    ...(settings.telefono && { telephone: settings.telefono }),
    ...(settings.email && { email: settings.email }),
    ...(settings.direccion && {
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.direccion.split(",")[0].trim(),
        ...(postalCode && { postalCode }),
        addressLocality: "Madrid",
        addressRegion: "Comunidad de Madrid",
        addressCountry: "ES",
      },
    }),
    areaServed: [
      { "@type": "City", name: "Madrid" },
      { "@type": "AdministrativeArea", name: "Comunidad de Madrid" },
    ],
    ...(services.length > 0 && { knowsAbout: services }),
    // Cada servicio enlazado a su página: ayuda a Google a relacionar la empresa con ellas.
    ...(sectors.length > 0 && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Servicios de reforma y construcción",
        itemListElement: sectors.map((sector) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: sector.title,
            url: `${SITE.url}${ROUTES.sectors}/${sector.slug}`,
            areaServed: { "@type": "City", name: "Madrid" },
          },
        })),
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
  };
  const website = {
    "@type": "WebSite",
    "@id": `${SITE.url}/#web`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: ["es-ES", "en"],
    publisher: { "@id": business["@id"] },
  };
  const page = {
    "@type": "WebPage",
    "@id": `${url}#portada`,
    url,
    name: t.meta.title,
    description: t.meta.description,
    inLanguage: locale === "es" ? "es-ES" : "en",
    isPartOf: { "@id": website["@id"] },
    about: { "@id": business["@id"] },
    primaryImageOfPage: `${SITE.url}${OG_IMAGE.url}`,
    relatedLink: [`${SITE.url}${ROUTES.projects}`, `${SITE.url}${ROUTES.sectors}`],
  };
  // Las mismas preguntas que se ven en la portada (HomeFaq): el marcado debe reflejar contenido visible.
  const faq = {
    "@type": "FAQPage",
    "@id": `${url}#preguntas`,
    inLanguage: page.inLanguage,
    isPartOf: { "@id": page["@id"] },
    mainEntity: HOME_FAQ_BY_LOCALE[locale].map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return { "@context": "https://schema.org", "@graph": [business, website, page, faq] };
}

/**
 * Portada · Propuesta 6: la parte superior de la V4 (hero → posicionamiento →
 * divisiones → proyectos → materialidad → método) y el cierre de la V5
 * (manifiesto → equipo → fabricantes → preguntas → artículos → «Hablemos»).
 *
 * La misma página sirve para / (castellano) y /en (inglés). En inglés no se muestran los
 * artículos del Journal, que solo están escritos en castellano.
 */
export default async function HomePage({ locale }: { locale: Locale }) {
  const data = await getHomeData();
  const jsonLd = homeJsonLd(data.settings, data.sectors, locale);
  const slides = data.homeContent.heroSlides?.length ? data.homeContent.heroSlides : data.heroSlides;

  return (
    <main className="bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeHero slides={slides} locale={locale} />
      <Positioning locale={locale} />
      <DivisionsGrid sectors={data.sectors} locale={locale} />
      <FeaturedWorks projects={data.projects} heroImage={slides[0]?.image} locale={locale} />
      <MaterialStrip locale={locale} />
      <MethodSteps locale={locale} />
      <ManifestoBand locale={locale} />
      <TeamSplit sectors={data.sectors} locale={locale} />
      <Materials fabricantes={data.fabricantes} content={data.homeContent} locale={locale} />
      <HomeFaq locale={locale} />
      {locale === "es" && <HomeArticles articles={data.articles} />}
      <FinalContact settings={data.settings} locale={locale} />
    </main>
  );
}
