import Image from "next/image";
import type { Fase } from "@/lib/types";

/** Extrae el número de fase (p. ej. "(01)") a partir del tag o del índice. */
function phaseNumber(fase: Fase, index: number) {
  const match = fase.tag.match(/\d{1,2}/);
  return (match ? match[0] : String(index + 1)).padStart(2, "0");
}

export default function Process({ fases }: { fases: Fase[] }) {
  const first = fases[0];

  return (
    <section
      id="metodo"
      className="relative bg-white text-stone-900 py-24 sm:py-32 px-6 sm:px-10 lg:px-12 overflow-hidden border-t border-stone-200"
    >
      <div className="max-w-7xl mx-auto">
        {/* Cabecera */}
        <div className="reveal-item flex items-baseline justify-between pb-12 sm:pb-16 border-b border-stone-300/60">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light text-stone-900 tracking-tight leading-none">
              Nuestro proceso
            </h2>
            <span className="block mt-2 font-mono text-[11px] tracking-[0.25em] text-stone-500 uppercase">
              SECUENCIA DE COORDINACIÓN INTEGRAL · 6 FASES · 1 EQUIPO
            </span>
          </div>
        </div>

        {/* Layout */}
        <div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* Columna 1: Tabs */}
          <div className="lg:col-span-4 flex flex-col space-y-4 sm:space-y-6">
            {fases.map((fase, i) => (
              <button
                key={fase.id}
                type="button"
                data-phase={i}
                data-text={fase.texto}
                data-img={fase.imagen}
                className={`process-tab text-left group flex items-baseline gap-3 transition-all duration-300 focus:outline-none ${
                  i === 0 ? "is-active" : ""
                }`}
              >
                <span
                  className={`phase-badge font-mono text-xs transition ${
                    i === 0 ? "text-stone-900" : "text-stone-400 group-hover:text-stone-700"
                  }`}
                >
                  ({phaseNumber(fase, i)})
                </span>
                <span
                  className={`phase-title text-3xl sm:text-4xl lg:text-5xl font-serif border-b-2 pb-1 transition-all ${
                    i === 0
                      ? "text-stone-900 border-stone-900"
                      : "text-stone-400 border-transparent group-hover:text-stone-700"
                  }`}
                >
                  {fase.title}
                </span>
              </button>
            ))}
          </div>

          {/* Columna 2: Imagen */}
          <div className="lg:col-span-4 reveal-scale">
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-stone-200 shadow-md">
              <Image
                id="process-image"
                src={first.imagen}
                alt={`ALKO - Fase ${first.tag} - ${first.title}`}
                fill
                sizes="(max-width: 1024px) 100vw, 576px"
                className="object-cover object-center transition-all duration-700 ease-out"
              />
            </div>
          </div>

          {/* Columna 3: Texto */}
          <div className="lg:col-span-4 flex flex-col justify-between self-stretch space-y-8 lg:pl-6 reveal-item">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-light text-stone-900 tracking-tight leading-snug">
                Una única dirección para todo el proyecto
              </h3>
              <p className="mt-4 text-base sm:text-lg text-stone-600 font-light leading-relaxed font-sans">
                Un único equipo coordina construcción, instalaciones, compras y gestión técnica
                para mantener el proyecto bajo control.
              </p>
            </div>

            <div className="pt-6 border-t border-stone-300/60">
              <p
                id="phase-detail-text"
                className="text-base sm:text-lg text-stone-600 font-light leading-relaxed transition-opacity duration-300 font-sans"
              >
                {first.texto}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
