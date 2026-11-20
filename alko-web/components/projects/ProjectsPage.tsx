import type { Metadata } from "next";
import { localizeProject } from "@/lib/i18n/project-text";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import HtmlLang from "@/components/i18n/HtmlLang";
import FinalContact from "@/components/sections/FinalContact";
import ProjectsGallery from "@/components/ui/ProjectsGallery";
import { getDbProjectsPageContent } from "@/lib/db/mysql";
import { LOCALE_META, languageAlternates, localizedPath, type Locale } from "@/lib/i18n";
import { PROJECTS_COPY } from "@/lib/i18n/projects";
import { projectCategory } from "@/lib/project-category";
import { organizationNode } from "@/lib/seo";
import { OG_IMAGE, ogImage, siteKeywords, ROUTES, SITE } from "@/lib/site";
import type { Project } from "@/lib/types";
import { splitLead } from "@/lib/utils";
import { getProjects, getSettings } from "@/lib/wordpress";

/** Metadatos del listado en cada idioma, con canonical propio y alternativas hreflang. */
export function projectsMetadata(locale: Locale): Metadata {
  const t = PROJECTS_COPY[locale].meta;
  const path = localizedPath(ROUTES.projects, locale);
  return {
    title: { absolute: t.title },
    description: t.description,
    alternates: { canonical: path, languages: languageAlternates(ROUTES.projects) },
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

/** URL absoluta (las imágenes del panel pueden venir relativas o absolutas). */
const absoluteUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`);

/**
 * Datos estructurados del listado: la página como colección de obras, con la lista de todas
 * ellas (enlace, nombre e imagen) y la empresa con el mismo @id que en la portada.
 */
function projectsJsonLd(locale: Locale, projects: Project[]) {
  const t = PROJECTS_COPY[locale].meta;
  const url = absoluteUrl(localizedPath(ROUTES.projects, locale));
  const org = organizationNode();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#pagina`,
        url,
        name: t.title,
        description: t.description,
        inLanguage: locale === "es" ? "es-ES" : "en",
        isPartOf: { "@type": "WebSite", "@id": `${SITE.url}/#web`, name: SITE.name, url: SITE.url },
        about: { "@id": org["@id"] },
        primaryImageOfPage: absoluteUrl(projects[0]?.imagen || OG_IMAGE.url),
        mainEntity: { "@id": `${url}#obras` },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#obras`,
        name: t.listName,
        numberOfItems: projects.length,
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE.url}${localizedPath(`${ROUTES.projects}/${project.slug}`, locale)}`,
          name: project.title,
          ...(project.imagen && { image: absoluteUrl(project.imagen) }),
        })),
      },
      org,
    ],
  };
}

/**
 * Listado de proyectos, compartido por /proyectos y /en/projects. En castellano la cabecera
 * usa los textos del panel; en inglés, los del diccionario. Las fichas de cada obra siguen en
 * castellano.
 */
export default async function ProjectsPage({ locale }: { locale: Locale }) {
  const t = PROJECTS_COPY[locale];
  const [projects, settings, pageContent] = await Promise.all([
    getProjects(),
    getSettings(),
    getDbProjectsPageContent(),
  ]);
  const summaries = projects.map((project) => ({
    ...localizeProject(project, locale, { keepTypology: true }),
    extracto: splitLead(project.content).lead,
  }));

  const years = projects.map((p) => Number(p.anio)).filter(Boolean);
  // Las mismas categorías que el filtro del listado.
  const types = new Set(projects.map((p) => projectCategory(p.tipologia || "")));
  const stats = [
    { label: t.stats.works, value: String(projects.length).padStart(2, "0") },
    { label: t.stats.types, value: String(types.size).padStart(2, "0") },
    {
      label: t.stats.period,
      value: years.length
        ? Math.min(...years) === Math.max(...years)
          ? String(years[0])
          : `${Math.min(...years)} — ${Math.max(...years)}`
        : "—",
    },
  ];

  // En castellano mandan los textos del panel (con los del diccionario como respaldo).
  const header =
    locale === "es"
      ? {
          eyebrow: pageContent.headerBadge || t.header.eyebrow,
          title: pageContent.headerTitulo || t.header.title,
          description: pageContent.headerDescripcion || t.header.description,
        }
      : t.header;

  return (
    <main className="bg-paper text-ink">
      <HtmlLang locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd(locale, summaries)) }}
      />
      <EditorialHeader
        locale={locale}
        breadcrumbs={[{ label: t.breadcrumb }]}
        eyebrow={header.eyebrow}
        title={<span className="whitespace-pre-line">{header.title}</span>}
        description={<span className="whitespace-pre-line">{header.description}</span>}
        aside={
          <dl>
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline justify-between gap-6 border-t border-ink/15 py-4 last:border-b">
                <dt className="text-[11px] uppercase tracking-[0.22em]">{stat.label}</dt>
                <dd className="display-title text-3xl sm:text-4xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <div className="site-wrap pb-16 pt-12 sm:pb-24 sm:pt-16">
        <ProjectsGallery projects={summaries} locale={locale} />
      </div>

      <FinalContact settings={settings} id="contacto" source={`Formulario proyectos · ${localizedPath(ROUTES.projects, locale)}`} locale={locale} />
    </main>
  );
}
