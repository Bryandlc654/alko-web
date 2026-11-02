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
  getShowcaseProject,
} from "@/lib/wordpress";
import {
  getDbProjectsPageContent,
  getDbNosotrosPageContent,
  getDbContactoPageContent,
  getDbServiciosPageContent,
  getDbEquipoPageContent,
  getDbEmpleoPageContent,
  getDbOficinasPageContent,
  getDbArticulosPageContent,
  getDbGuiasPageContent,
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
    oficinasPageContent,
    articulosPageContent,
    guiasPageContent,
    heroSlides,
    showcaseSlides,
    projects,
    sectors,
    fases,
    fabricantes,
    articles,
    settings,
    showcaseProject,
  ] = await Promise.all([
    getHomeContent(),
    getDbProjectsPageContent(),
    getDbNosotrosPageContent(),
    getDbContactoPageContent(),
    getDbServiciosPageContent(),
    getDbEquipoPageContent(),
    getDbEmpleoPageContent(),
    getDbOficinasPageContent(),
    getDbArticulosPageContent(),
    getDbGuiasPageContent(),
    getHeroSlides(),
    getShowcaseSlides(),
    getProjects(),
    getSectors(),
    getFases(),
    getFabricantes(),
    getArticles(),
    getSettings(),
    getShowcaseProject(),
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
      initialOficinasPageContent={oficinasPageContent}
      initialArticulosPageContent={articulosPageContent}
      initialGuiasPageContent={guiasPageContent}
      heroSlides={heroSlides}
      showcaseSlides={showcaseSlides}
      projects={projects}
      sectors={sectors}
      fases={fases}
      fabricantes={fabricantes}
      articles={articles}
      settings={settings}
      showcaseProject={showcaseProject}
    />
  );
}
