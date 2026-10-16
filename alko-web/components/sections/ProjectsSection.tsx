import type { Project } from "@/lib/types";
import ProjectsList from "@/components/ui/ProjectsList";

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section
      id="proyectos"
      className="relative bg-white text-stone-900 py-24 sm:py-32 px-6 sm:px-10 lg:px-12 overflow-hidden border-t border-stone-200/80"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-14 border-b border-stone-300/60">
          <div className="max-w-3xl">
            <div className="reveal-item flex items-center flex-wrap gap-x-4 gap-y-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light text-stone-900 tracking-tight leading-none">
                PROYECTOS
              </h2>
            </div>
            <p
              className="reveal-item mt-6 text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-xl font-sans"
              style={{ transitionDelay: "150ms" }}
            >
              Cada proyecto rige planificación, ejecución, coordinación técnica y control hasta la entrega.
            </p>
            <div className="reveal-item mt-8" style={{ transitionDelay: "250ms" }}>
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase text-stone-900 border-b border-stone-900 pb-1.5 hover:text-amber-700 hover:border-amber-700 transition duration-300 group"
              >
                <span className="text-base transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
                <span>DESCUBRIR PROYECTOS</span>
              </a>
            </div>
          </div>
        </div>

        <ProjectsList projects={projects} />
      </div>
    </section>
  );
}
