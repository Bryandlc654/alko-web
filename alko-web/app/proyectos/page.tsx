import Image from "next/image";
import Container from "@/components/ui/Container";
import ProjectsGallery from "@/components/ui/ProjectsGallery";
import ContactCta from "@/components/sections/ContactCta";
import { getProjects, getSettings } from "@/lib/wordpress";
import { splitLead } from "@/lib/utils";

export const revalidate = 60;

export const metadata = {
  title: "Proyectos — ALKO",
  description:
    "Proyectos residenciales y corporativos ejecutados con dirección técnica unificada y rigor constructivo.",
};

export default async function ProyectosPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);
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
  const heroImage = projects[0]?.imagen || "/start-research-1.jpg";

  return (
    <main className="bg-white text-stone-900">
      <header className="relative isolate flex min-h-[640px] sm:min-h-[720px] lg:min-h-[86vh] items-end overflow-hidden bg-stone-950 text-white pt-36 sm:pt-44 pb-12 sm:pb-16">
        <Image src={heroImage} alt="" fill priority sizes="100vw" className="-z-10 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-stone-950/85 via-stone-950/45 to-stone-950/5" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-stone-950/70 to-transparent" />

        <Container className="relative">
          <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-white/70 uppercase mb-4">
            PROYECTOS
          </span>
          <h1 className="font-display font-light text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[-0.03em] leading-[1.02] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
            Obra hecha,
            <br />
            obra entregada.
          </h1>
          <p className="mt-6 max-w-xl text-base sm:text-lg text-white/85 font-light leading-relaxed">
            Una selección de obras donde la planificación, la coordinación y la ejecución garantizan
            los objetivos de plazo y calidad.
          </p>

          <dl className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 border-t border-white/20">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-baseline justify-between gap-4 sm:block border-b sm:border-b-0 sm:border-r last:border-r-0 border-white/20 py-4 sm:py-6 sm:pr-6 sm:[&:not(:first-child)]:pl-6"
              >
                <dt className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/60">
                  {stat.label}
                </dt>
                <dd className="sm:mt-2 font-serif font-light text-xl sm:text-3xl text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </header>

      <Container className="pt-20 sm:pt-28 pb-8 sm:pb-12">
        <ProjectsGallery projects={summaries} />
      </Container>

      <ContactCta settings={settings} />
    </main>
  );
}
