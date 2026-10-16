import type { Sector } from "@/lib/types";
import SectorsList from "@/components/ui/SectorsList";

export default function ServicesSection({ sectors }: { sectors: Sector[] }) {
  return (
    <section
      id="servicios"
      className="relative bg-white text-stone-900 py-20 sm:py-28 lg:py-32 overflow-hidden border-t border-[#e1e1df]"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="reveal-item pb-12 sm:pb-16 border-b border-[#e1e1df]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase mb-3">
                SECTORES DE ACTUACIÓN
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light text-stone-900 tracking-tight leading-none">
                ESPECIALIDADES
              </h2>
            </div>
            <p className="max-w-xl text-base sm:text-lg text-stone-600 font-light leading-relaxed font-sans">
              Actuamos de forma transversal en rehabilitación, reforma integral, obra nueva y gestión
              de instalaciones técnicas con un único responsable de proyecto.
            </p>
          </div>
        </div>

        <SectorsList sectors={sectors} />
      </div>
    </section>
  );
}
