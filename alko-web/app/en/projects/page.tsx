import ProjectsPage, { projectsMetadata } from "@/components/projects/ProjectsPage";

export const revalidate = 60;

export const metadata = projectsMetadata("en");

/** Listado de proyectos en inglés. */
export default function ProjectsEn() {
  return <ProjectsPage locale="en" />;
}
