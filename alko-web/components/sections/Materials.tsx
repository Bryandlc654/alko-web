import Image from "next/image";
import type { Fabricante } from "@/lib/types";

export default function Materials({ fabricantes }: { fabricantes: Fabricante[] }) {
  const doubled = [...fabricantes, ...fabricantes];

  return (
    <section
      id="materiales"
      className="relative bg-white text-stone-900 py-24 sm:py-32 border-t border-stone-300/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 mb-16 sm:mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-300/70">
          <div className="max-w-2xl reveal-item">
            <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase mb-3">
              ESPECIFICACIÓN TÉCNICA & CALIDAD
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light text-stone-900 tracking-tight leading-none">
              Materiales y fabricantes
            </h2>
          </div>
          <div className="max-w-md reveal-item">
            <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              Soluciones y materiales seleccionados según las necesidades técnicas de cada proyecto.
            </p>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden py-6 sm:py-8">
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="animate-marquee flex items-center">
          <div className="flex items-center gap-20 sm:gap-28 lg:gap-36 shrink-0 pr-20 sm:pr-28 lg:pr-36">
            {doubled.map((fab, i) => (
              <div key={`${fab.id}-${i}`} className="flex items-center h-12 sm:h-16 lg:h-20">
                <Image
                  src={fab.logo}
                  alt={fab.name}
                  width={120}
                  height={48}
                  className="h-9 sm:h-11 lg:h-14 w-auto max-w-[240px] sm:max-w-[300px] lg:max-w-[340px] object-contain opacity-70 hover:opacity-100 transition duration-300 filter grayscale hover:grayscale-0"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
