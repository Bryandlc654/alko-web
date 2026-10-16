import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import ProjectsList from "@/components/ui/ProjectsList";
import { getProjects } from "@/lib/wordpress";

export const revalidate = 60;

export const metadata = {
  title: "Proyectos — ALKO",
  description:
    "Proyectos residenciales y corporativos ejecutados con dirección técnica unificada y rigor constructivo.",
};

export default async function ProyectosPage() {
  const projects = await getProjects();

  return (
    <main className="bg-white text-stone-900">
      <PageHero
        eyebrow="PROYECTOS"
        title="Proyectos ejecutados"
        description="Una selección de obras donde la planificación, la coordinación y la ejecución garantizan los objetivos de plazo y calidad."
      />
      <Container className="py-16 sm:py-24">
        <ProjectsList projects={projects} />
      </Container>
    </main>
  );
}
