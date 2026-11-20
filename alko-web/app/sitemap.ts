import { MetadataRoute } from "next";
import { languageAlternates, localizedPath } from "@/lib/i18n";
import { ROUTES, SITE } from "@/lib/site";
import { getArticles, getGuides, getNews, getProjects, getSectors } from "@/lib/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, sectors, articleList, news, guides] = await Promise.all([
    getProjects(),
    getSectors(),
    getArticles(50),
    getNews(50),
    getGuides(),
  ]);
  const articles = [...articleList, ...news];

  // Sin repetir (artículos y Journal comparten base) y sin la base de guías, que no es una página.
  const staticRoutes: MetadataRoute.Sitemap = [...new Set<string>(Object.values(ROUTES))]
    .filter((route) => route !== ROUTES.guides)
    .map((route) => ({
      url: `${SITE.url}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: route === ROUTES.home ? 1 : 0.8,
    }));

  // Páginas traducidas: la versión inglesa y, en las dos, sus alternativas hreflang.
  const absolute = (path: string) => (path === "/" ? SITE.url : `${SITE.url}${path}`);
  for (const esPath of [ROUTES.home, ROUTES.projects, ROUTES.company, ROUTES.team, ROUTES.careers, ROUTES.contact, ROUTES.journal, ROUTES.sectors]) {
    const alt = languageAlternates(esPath);
    const languages = { es: absolute(alt.es), en: absolute(alt.en), "x-default": absolute(alt["x-default"]) };
    const original = staticRoutes.find((entry) => entry.url === `${SITE.url}${esPath}`);
    if (original) original.alternates = { languages };
    staticRoutes.push({
      url: absolute(localizedPath(esPath, "en")),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: esPath === ROUTES.home ? 0.9 : 0.7,
      alternates: { languages },
    });
  }

  const dynamic: MetadataRoute.Sitemap = [
    ...projects.map((project) => ({
      url: `${SITE.url}${ROUTES.projects}/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    // Cada servicio en los dos idiomas, con sus alternativas hreflang.
    ...sectors.flatMap((sector) => {
      const esPath = `${ROUTES.sectors}/${sector.slug}`;
      const alt = languageAlternates(esPath);
      const languages = { es: absolute(alt.es), en: absolute(alt.en), "x-default": absolute(alt["x-default"]) };
      return [esPath, localizedPath(esPath, "en")].map((path, i) => ({
        url: absolute(path),
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: i === 0 ? 0.9 : 0.8,
        alternates: { languages },
      }));
    }),
    ...articles.map((article) => ({
      url: `${SITE.url}${ROUTES.articles}/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...guides.map((guide) => ({
      url: `${SITE.url}${ROUTES.guides}/${guide.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  return [...staticRoutes, ...dynamic];
}
