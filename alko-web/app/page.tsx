import type { Metadata } from "next";
import DivisionsGrid from "@/components/home/DivisionsGrid";
import FeaturedWorks from "@/components/home/FeaturedWorks";
import HomeArticles from "@/components/home/HomeArticles";
import HomeContact from "@/components/home/HomeContact";
import HomeFaq from "@/components/home/HomeFaq";
import HomeHero from "@/components/home/HomeHero";
import ManifestoBand from "@/components/home/ManifestoBand";
import MaterialStrip from "@/components/home/MaterialStrip";
import MethodSteps from "@/components/home/MethodSteps";
import Positioning from "@/components/home/Positioning";
import TeamSplit from "@/components/home/TeamSplit";
import Materials from "@/components/sections/Materials";
import { getHomeData } from "@/lib/wordpress";
import { OG_IMAGE, ROUTES, SITE } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: SITE.title },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: "/",
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    images: [OG_IMAGE],
  },
};

/** Datos estructurados de la portada: la empresa (negocio local) y el sitio web. */
function homeJsonLd(settings: SiteSettings, services: string[]) {
  const postalCode = settings.direccion?.match(/\b\d{5}\b/)?.[0];
  const sameAs = [settings.instagram, settings.facebook].filter((u) => /^https?:\/\//.test(u ?? ""));
  const business = {
    "@type": "GeneralContractor",
    "@id": `${SITE.url}/#empresa`,
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.description,
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
    areaServed: { "@type": "City", name: "Madrid" },
    ...(services.length > 0 && { knowsAbout: services }),
    ...(sameAs.length > 0 && { sameAs }),
  };
  const website = {
    "@type": "WebSite",
    "@id": `${SITE.url}/#web`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: "es-ES",
    publisher: { "@id": business["@id"] },
  };
  const projects = {
    "@type": "WebPage",
    "@id": `${SITE.url}/#portada`,
    url: SITE.url,
    name: SITE.title,
    description: SITE.description,
    isPartOf: { "@id": website["@id"] },
    about: { "@id": business["@id"] },
    primaryImageOfPage: `${SITE.url}${OG_IMAGE.url}`,
    relatedLink: [`${SITE.url}${ROUTES.projects}`, `${SITE.url}${ROUTES.sectors}`],
  };
  return { "@context": "https://schema.org", "@graph": [business, website, projects] };
}

/**
 * Portada · Propuesta 6: la parte superior de la V4 (hero → posicionamiento →
 * divisiones → proyectos → materialidad → método) y el cierre de la V5
 * (manifiesto → equipo → fabricantes → preguntas → artículos → «Hablemos»).
 */
export default async function Home() {
  const data = await getHomeData();
  const jsonLd = homeJsonLd(data.settings, data.sectors.map((s) => s.title));
  const slides = data.homeContent.heroSlides?.length ? data.homeContent.heroSlides : data.heroSlides;

  return (
    <main className="bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeHero slides={slides} />
      <Positioning />
      <DivisionsGrid sectors={data.sectors} />
      <FeaturedWorks projects={data.projects} heroImage={slides[0]?.image} />
      <MaterialStrip />
      <MethodSteps />
      <ManifestoBand />
      <TeamSplit sectors={data.sectors} />
      <Materials fabricantes={data.fabricantes} content={data.homeContent} />
      <HomeFaq />
      <HomeArticles articles={data.articles} />
      <HomeContact settings={data.settings} />
    </main>
  );
}
