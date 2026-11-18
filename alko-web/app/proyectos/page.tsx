import ProjectsGallery from "@/components/ui/ProjectsGallery";
import { projectCategory } from "@/lib/project-category";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import FinalContact from "@/components/sections/FinalContact";
import { getProjects, getSettings } from "@/lib/wordpress";
import { getDbProjectsPageContent } from "@/lib/db/mysql";
import { splitLead } from "@/lib/utils";

export const revalidate = 60;

export const metadata = {
  title: "Proyectos — ALKO",
  description:
    "Proyectos residenciales y corporativos ejecutados con dirección técnica unificada y rigor constructivo.",
};

export default async function ProyectosPage() {
  const [projects, settings, pageContent] = await Promise.all([
    getProjects(),
    getSettings(),
    getDbProjectsPageContent(),
  ]);
  const summaries = projects.map((project) => ({
    ...project,
    extracto: splitLead(project.content).lead,
  }));

  const years = projects.map((p) => Number(p.anio)).filter(Boolean);
  // Las mismas categorías que el filtro del listado.
  const types = new Set(projects.map((p) => projectCategory(p.tipologia || "")));
  const stats = [
    { label: "Obras", value: String(projects.length).padStart(2, "0") },
    { label: "Tipologías", value: String(types.size).padStart(2, "0") },
    {
      label: "Periodo",
      value: years.length
        ? Math.min(...years) === Math.max(...years)
          ? String(years[0])
          : `${Math.min(...years)} — ${Math.max(...years)}`
        : "—",
    },
  ];

  return (
    <main className="bg-paper text-ink">
      <EditorialHeader
        breadcrumbs={[{ label: "Proyectos" }]}
        eyebrow={pageContent.headerBadge || "Proyectos"}
        title={<span className="whitespace-pre-line">{pageContent.headerTitulo || "Proyectos"}</span>}
        description={
          <span className="whitespace-pre-line">
            {pageContent.headerDescripcion ||
              "Obras residenciales y corporativas ejecutadas con dirección técnica unificada y rigor constructivo."}
          </span>
        }
        aside={
          <dl>
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline justify-between gap-6 border-t border-ink/15 py-4 last:border-b">
                <dt className="text-[11px] uppercase tracking-[0.22em]">{stat.label}</dt>
                <dd className="display-title text-3xl sm:text-4xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <div className="site-wrap pb-16 pt-12 sm:pb-24 sm:pt-16">
        <ProjectsGallery projects={summaries} />
      </div>

      <FinalContact settings={settings} id="contacto" source="Formulario proyectos · /proyectos" />
    </main>
  );
}
