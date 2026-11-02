import Image from "@/components/ui/Image";
import type { HomeContent, Project, Slide } from "@/lib/types";
import { plainExcerpt } from "@/lib/utils";

const MAX_PROJECT_SLIDES = 6;

export default function Workshop({
  slides: defaultSlides,
  content,
  project,
}: {
  slides: Slide[];
  content?: HomeContent;
  /** Proyecto elegido en el panel (Proyectos › Poner en bloque grande): sus fotos y datos sustituyen a las diapositivas. */
  project?: Project | null;
}) {
  const slides: Slide[] = project
    ? [project.imagen, ...(project.galeria || [])]
        .filter((src, i, all) => src && all.indexOf(src) === i)
        .slice(0, MAX_PROJECT_SLIDES)
        .map((src, i) => ({ id: `${project.id}-${i}`, image: src, alt: project.title }))
    : defaultSlides.slice(0, 2);

  const badge = project ? [project.tipologia, project.ubicacion].filter(Boolean).join(" · ") : content?.workshopBadge ?? "START RESEARCH";
  const title = project ? project.title : content?.workshopTitulo ?? "Soluciones arquitectónicas y técnicas con criterio constructivo.";
  const description = project
    ? plainExcerpt(project.content || project.solucion || project.reto)
    : content?.workshopDescripcion ?? "Investigar, coordinar y ejecutar: cada detalle responde a una exigencia funcional, constructiva y estética.";
  const href = project ? `/proyectos/${project.slug}` : "#experiencia";
  const linkText = project ? "Ver proyecto" : content?.workshopBotonTexto ?? "Ver Solución";

  return (
    <section
      id="workshop"
      className="relative w-full h-[600px] sm:h-[700px] lg:h-[780px] overflow-hidden bg-stone-950 group"
    >
      <div id="showcase-slider" className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={slide.image}
            className={`showcase-slide absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === 0 ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
            }`}
            data-index={i}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              sizes="100vw"
              className={`w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02] transition-transform duration-[8000ms] ease-out ${
                i === 0 ? "scale-105" : "scale-100"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none z-15" />

      <div
        id="showcase-card"
        className="absolute bottom-0 left-6 sm:left-12 lg:left-24 xl:left-32 z-30 max-w-sm sm:max-w-md lg:max-w-xl w-full"
      >
        <div className="relative bg-white/95 backdrop-blur-sm px-6 sm:px-8 py-7 sm:py-9 shadow-2xl border border-white/60">
          <span className="block font-mono text-[10px] sm:text-[11px] tracking-[0.28em] text-stone-600 uppercase mb-3">
            {badge}
          </span>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light text-stone-900 tracking-tight leading-snug">
            {title}
          </h3>
          <p className="mt-4 text-sm sm:text-base text-stone-700 font-light leading-relaxed max-w-lg">
            {description}
          </p>
          <div className="mt-6 sm:mt-8">
            <a
              href={href}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-normal text-stone-900 hover:text-amber-800 transition group/link"
            >
              <span className="text-base font-light transition-transform group-hover/link:translate-y-0.5">
                {project ? "→" : "↓"}
              </span>
              <span className="underline underline-offset-4 decoration-stone-900/40 hover:decoration-stone-900">
                {linkText}
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-12 z-30 flex items-center gap-6">
        <button
          id="showcase-prev-btn"
          aria-label="Slide anterior"
          className="text-white/80 hover:text-white transition cursor-pointer text-xl font-light hover:-translate-x-1 duration-200 focus:outline-none"
        >
          ←
        </button>
        <button
          id="showcase-next-btn"
          aria-label="Slide siguiente"
          className="text-white/80 hover:text-white transition cursor-pointer text-xl font-light hover:translate-x-1 duration-200 focus:outline-none"
        >
          →
        </button>
      </div>

      <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-12 z-30 flex items-center gap-2.5">
        {slides.map((slide, i) => (
          <button
            key={slide.image}
            className={`showcase-dot w-2.5 h-2.5 transition-all duration-300 focus:outline-none ${
              i === 0 ? "bg-white" : "border border-white/60 bg-transparent hover:border-white"
            }`}
            data-slide={i}
            aria-label={`Ir al slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
