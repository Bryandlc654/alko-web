import ProjectsPage, { projectsMetadata } from "@/components/projects/ProjectsPage";

export const revalidate = 60;

export const metadata = projectsMetadata("es");

/** Listado de proyectos en castellano (la versión inglesa está en /en/projects). */
export default function ProyectosPage() {
  return <ProjectsPage locale="es" />;
}
