import type { Metadata } from "next";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import HtmlLang from "@/components/i18n/HtmlLang";
import FinalContact from "@/components/sections/FinalContact";
import ProjectsGallery from "@/components/ui/ProjectsGallery";
import { getDbProjectsPageContent } from "@/lib/db/mysql";
import { LOCALE_META, languageAlternates, localizedPath, type Locale } from "@/lib/i18n";
import { PROJECTS_COPY } from "@/lib/i18n/projects";
import { projectCategory } from "@/lib/project-category";
import { OG_IMAGE, ROUTES, SITE } from "@/lib/site";
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
    openGraph: {
      title: t.title,
      description: t.description,
      url: path,
      type: "website",
      locale: LOCALE_META[locale].ogLocale,
      siteName: SITE.name,
      images: [OG_IMAGE],
    },
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
    ...project,
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

      <FinalContact settings={settings} id="contacto" source="Formulario proyectos · /proyectos" locale={locale} />
    </main>
  );
}
