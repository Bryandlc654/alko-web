import {
  getHeroSlides,
  getShowcaseSlides,
  getProjects,
  getSectors,
  getFases,
  getFabricantes,
  getArticles,
  getSettings,
  getHomeContent,
} from "@/lib/wordpress";
import { getDbProjectsPageContent, getDbNosotrosPageContent } from "@/lib/db/mysql";
import LiveEditor from "@/components/admin/LiveEditor";

export const dynamic = "force-dynamic";

export default async function AdminEditorPage() {
  const [
    homeContent,
    projectsPageContent,
    nosotrosPageContent,
    heroSlides,
    showcaseSlides,
    projects,
    sectors,
    fases,
    fabricantes,
    articles,
    settings,
  ] = await Promise.all([
    getHomeContent(),
    getDbProjectsPageContent(),
    getDbNosotrosPageContent(),
    getHeroSlides(),
    getShowcaseSlides(),
    getProjects(),
    getSectors(),
    getFases(),
    getFabricantes(),
    getArticles(),
    getSettings(),
  ]);

  return (
    <LiveEditor
      initialContent={homeContent}
      initialProjectsPageContent={projectsPageContent}
      initialNosotrosPageContent={nosotrosPageContent}
      heroSlides={heroSlides}
      showcaseSlides={showcaseSlides}
      projects={projects}
      sectors={sectors}
      fases={fases}
      fabricantes={fabricantes}
      articles={articles}
      settings={settings}
    />
  );
}
