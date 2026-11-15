import PageHero from "@/components/ui/PageHero";
import ProjectsGallery from "@/components/ui/ProjectsGallery";
import ContactCta from "@/components/sections/ContactCta";
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
  const types = new Set(projects.map((p) => p.tipologia).filter(Boolean));
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
  const heroImage = pageContent.headerBgImage || projects[0]?.imagen || "/start-research-1.jpg";

  return (
    <main className="bg-paper text-ink">
      <PageHero
        breadcrumbs={[{ label: "Proyectos" }]}
        eyebrow={pageContent.headerBadge || "PROYECTOS"}
        title={<span className="whitespace-pre-line">{pageContent.headerTitulo || "Proyectos"}</span>}
        description={
          pageContent.headerDescripcion ? (
            <span className="whitespace-pre-line">{pageContent.headerDescripcion}</span>
          ) : undefined
        }
        image={heroImage}
      >
        <dl className="mt-12 grid max-w-2xl grid-cols-3 border-t border-paper/20">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`pt-5 pr-4 ${i > 0 ? "border-l border-paper/20 pl-4" : ""}`}>
              <dt className="text-[10px] uppercase tracking-[0.22em] text-paper/60">{stat.label}</dt>
              <dd className="display-title mt-2 text-2xl sm:text-3xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="bg-piedra/45">
        <div className="site-wrap pb-12 pt-24 lg:pt-32">
          <ProjectsGallery projects={summaries} />
        </div>
      </section>

      <ContactCta settings={settings} source="Proyectos" />
    </main>
  );
}
