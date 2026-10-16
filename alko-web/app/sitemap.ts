import { MetadataRoute } from "next";
import { ROUTES, SITE } from "@/lib/site";
import { getArticles, getGuides, getProjects, getSectors } from "@/lib/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, sectors, articles, guides] = await Promise.all([
    getProjects(),
    getSectors(),
    getArticles(50),
    getGuides(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = Object.values(ROUTES)
    .filter((route) => route !== ROUTES.articles)
    .map((route) => ({
      url: `${SITE.url}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: route === ROUTES.home ? 1 : 0.8,
    }));

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
