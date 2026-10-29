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
import {
  getDbProjectsPageContent,
  getDbNosotrosPageContent,
  getDbContactoPageContent,
  getDbServiciosPageContent,
  getDbEquipoPageContent,
  getDbEmpleoPageContent,
} from "@/lib/db/mysql";
import LiveEditor from "@/components/admin/LiveEditor";

export const dynamic = "force-dynamic";

export default async function AdminEditorPage() {
  const [
    homeContent,
    projectsPageContent,
    nosotrosPageContent,
    contactoPageContent,
    serviciosPageContent,
    equipoPageContent,
    empleoPageContent,
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
    getDbContactoPageContent(),
    getDbServiciosPageContent(),
    getDbEquipoPageContent(),
    getDbEmpleoPageContent(),
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
      initialContactoPageContent={contactoPageContent}
      initialServiciosPageContent={serviciosPageContent}
      initialEquipoPageContent={equipoPageContent}
      initialEmpleoPageContent={empleoPageContent}
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
