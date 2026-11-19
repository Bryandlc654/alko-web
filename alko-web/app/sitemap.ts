import { MetadataRoute } from "next";
import { HOME_PATHS } from "@/lib/i18n";
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

  // Portada en los dos idiomas, cada una con sus alternativas hreflang.
  const homeLanguages = { es: SITE.url, en: `${SITE.url}${HOME_PATHS.en}`, "x-default": SITE.url };
  const home = staticRoutes.find((entry) => entry.url === `${SITE.url}${ROUTES.home}`);
  if (home) home.alternates = { languages: homeLanguages };
  staticRoutes.push({
    url: `${SITE.url}${HOME_PATHS.en}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
    alternates: { languages: homeLanguages },
  });

  const dynamic: MetadataRoute.Sitemap = [
    ...projects.map((project) => ({
      url: `${SITE.url}${ROUTES.projects}/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...sectors.map((sector) => ({
      url: `${SITE.url}${ROUTES.sectors}/${sector.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
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
