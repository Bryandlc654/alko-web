import type { Metadata } from "next";
import ContactCta from "@/components/sections/ContactCta";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import Materials from "@/components/sections/Materials";
import Process from "@/components/sections/Process";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import Workshop from "@/components/sections/Workshop";
import ArticlesSection from "@/components/sections/ArticlesSection";
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
  const sameAs = [settings.linkedin, settings.instagram, settings.facebook].filter((u) => /^https?:\/\//.test(u ?? ""));
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

export default async function Home() {
  const data = await getHomeData();
  const jsonLd = homeJsonLd(data.settings, data.sectors.map((s) => s.title));

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero slides={data.heroSlides} content={data.homeContent} />
      <ProjectsSection projects={data.projects} content={data.homeContent} />
      <Process fases={data.homeContent.fases && data.homeContent.fases.length > 0 ? data.homeContent.fases : data.fases} content={data.homeContent} />
      <ServicesSection sectors={data.sectors} content={data.homeContent} />
      <Workshop slides={data.showcaseSlides} content={data.homeContent} project={data.showcaseProject} />
      <Experience content={data.homeContent} project={data.showcaseProject} />
      <Materials fabricantes={data.fabricantes} content={data.homeContent} />
      <ArticlesSection articles={data.articles} content={data.homeContent} />
      <ContactCta settings={data.settings} content={data.homeContent} />
    </main>
  );
}
