import Image from "next/image";
import type { HomeContent, Slide } from "@/lib/types";

export default function Workshop({ slides, content }: { slides: Slide[]; content?: HomeContent }) {
  const first = slides[0];
  const second = slides[1];

  return (
    <section
      id="workshop"
      className="relative w-full h-[600px] sm:h-[700px] lg:h-[780px] overflow-hidden bg-stone-950 group"
    >
      <div id="showcase-slider" className="absolute inset-0">
        {first && (
          <div
            className="showcase-slide absolute inset-0 opacity-100 transition-opacity duration-1000 ease-in-out z-10"
            data-index="0"
          >
            <Image
              src={first.image}
              alt={first.alt}
              fill
              sizes="100vw"
              className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02] transition-transform duration-[8000ms] ease-out scale-105"
            />
          </div>
        )}
        {second && (
          <div
            className="showcase-slide absolute inset-0 opacity-0 transition-opacity duration-1000 ease-in-out pointer-events-none z-0"
            data-index="1"
          >
            <Image
              src={second.image}
              alt={second.alt}
              fill
              sizes="100vw"
              className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02] transition-transform duration-[8000ms] ease-out scale-100"
            />
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none z-15" />

      <div
        id="showcase-card"
        className="absolute bottom-0 left-6 sm:left-12 lg:left-24 xl:left-32 z-30 max-w-sm sm:max-w-md lg:max-w-xl w-full"
      >
        <div className="relative bg-white/95 backdrop-blur-sm px-6 sm:px-8 py-7 sm:py-9 shadow-2xl border border-white/60">
          <span className="block font-mono text-[10px] sm:text-[11px] tracking-[0.28em] text-stone-600 uppercase mb-3">
            {content?.workshopBadge ?? "START RESEARCH"}
          </span>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light text-stone-900 tracking-tight leading-snug">
            {content?.workshopTitulo ?? "Soluciones arquitectónicas y técnicas con criterio constructivo."}
          </h3>
          <p className="mt-4 text-sm sm:text-base text-stone-700 font-light leading-relaxed max-w-lg">
            {content?.workshopDescripcion ?? "Investigar, coordinar y ejecutar: cada detalle responde a una exigencia funcional, constructiva y estética."}
          </p>
          <div className="mt-6 sm:mt-8">
            <a
              href="#experiencia"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-normal text-stone-900 hover:text-amber-800 transition group/link"
            >
              <span className="text-base font-light transition-transform group-hover/link:translate-y-0.5">
                ↓
              </span>
              <span className="underline underline-offset-4 decoration-stone-900/40 hover:decoration-stone-900">
                Ver Solución
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
        <button
          className="showcase-dot w-2.5 h-2.5 bg-white transition-all duration-300 focus:outline-none"
          data-slide="0"
          aria-label="Ir al slide 1"
        />
        <button
          className="showcase-dot w-2.5 h-2.5 border border-white/60 bg-transparent hover:border-white transition-all duration-300 focus:outline-none"
          data-slide="1"
          aria-label="Ir al slide 2"
        />
      </div>
    </section>
  );
}
