import ProjectDetailPage, { projectMetadata } from "@/components/projects/ProjectDetailPage";
import { getProjects } from "@/lib/wordpress";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return projectMetadata(slug, "en");
}

/** Ficha de un proyecto en inglés (la plantilla es común con /proyectos/[slug]). */
export default async function ProjectDetailEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProjectDetailPage slug={slug} locale="en" />;
}
