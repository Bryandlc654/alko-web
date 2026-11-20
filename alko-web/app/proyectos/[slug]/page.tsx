import ProjectDetailPage, { projectMetadata } from "@/components/projects/ProjectDetailPage";
import { getProjects } from "@/lib/wordpress";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return projectMetadata(slug, "es");
}

/** Ficha de un proyecto en castellano (la plantilla es común con /en/projects/[slug]). */
export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProjectDetailPage slug={slug} locale="es" />;
}
