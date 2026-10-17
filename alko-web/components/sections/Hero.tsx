import Image from "next/image";
import type { Slide } from "@/lib/types";

export default function Hero({ slides }: { slides: Slide[] }) {
  return (
    <header className="hero relative min-h-screen w-full flex flex-col justify-between overflow-hidden">
      {/* Slider de fondo con overlay cinematográfico arquitectónico */}
      <div id="hero-slider" className="absolute inset-0 -z-20 overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero-slide absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={i === 0}
              // Los demás slides no se ven al cargar: que no compitan con el primero.
              fetchPriority={i === 0 ? undefined : "low"}
              sizes="100vw"
              className={`object-cover object-center filter brightness-100 contrast-[1.01] transition-transform duration-[7000ms] ease-out ${
                i === 0 ? "scale-105" : "scale-100"
              }`}
            />
          </div>
        ))}

        {/* Gradiente altamente transparente */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-stone-950/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/35 via-transparent to-transparent" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 my-auto py-10 lg:py-16 mt-24 lg:mt-28">
        <div className="max-w-3xl">
          <div className="space-y-1 sm:space-y-2 drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight text-white leading-none font-display">
              Construcción
            </h1>
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight font-display font-sans">
              y reformas integrales en Madrid.
            </p>
          </div>

          <p className="mt-8 sm:mt-10 max-w-xl text-base sm:text-lg font-normal text-white leading-relaxed tracking-normal font-sans drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Ejecutamos proyectos residenciales y corporativos de alta exigencia,
            coordinando construcción, instalaciones, acabados y gestión técnica hasta
            la entrega final.
          </p>
        </div>
      </div>

      {/* Barra inferior del hero */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 pb-8 sm:pb-10 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-16 sm:mt-20 lg:mt-24">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
          <a
            href="#contacto"
            className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-white/60 bg-stone-900/30 hover:bg-white/15 backdrop-blur-md text-white text-xs font-semibold tracking-[0.18em] uppercase transition duration-300 shadow-sm active:scale-95"
          >
            SOLICITAR PRESUPUESTO
          </a>

          <a
            href="#proyectos"
            className="group flex items-center gap-2 text-xs font-normal tracking-wide text-white/80 hover:text-white transition"
          >
            <span>Explorar</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-[10px] h-[10px] text-white/60 group-hover:translate-y-0.5 transition duration-300"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
            </svg>
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="prev-slide-btn"
            aria-label="Slide anterior"
            className="w-11 h-11 rounded-2xl rounded-tr-sm border border-white/40 bg-stone-900/40 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition duration-200 group active:scale-95 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17L7 7M7 7v9M7 7h9" />
            </svg>
          </button>

          <button
            id="next-slide-btn"
            aria-label="Slide siguiente"
            className="w-11 h-11 rounded-2xl rounded-bl-sm border border-white/40 bg-stone-900/40 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition duration-200 group active:scale-95 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7l10 10m0 0V8m0 9H8" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
