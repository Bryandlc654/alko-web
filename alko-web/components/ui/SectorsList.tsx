import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/site";
import type { Sector } from "@/lib/types";

/** Listado interactivo de sectores con estado dual (reposo / activo). */
export default function SectorsList({ sectors }: { sectors: Sector[] }) {
  return (
    <div>
      {sectors.map((sector, i) => (
        <div
          key={sector.id}
          className={`service-row ${i === 0 ? "is-active" : ""} border-b border-[#e1e1df] cursor-pointer group`}
          data-service={i}
        >
          {/* Vista inactiva */}
          <div className="service-inactive py-8 sm:py-10 md:py-12 lg:py-14 flex items-center">
            <span className="w-24 sm:w-32 md:w-40 lg:w-48 shrink-0 font-mono text-xs sm:text-sm text-stone-400 tracking-wider select-none">
              {sector.numero} — SECTOR
            </span>
            <h3 className="flex-1 text-5xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[135px] font-serif font-light text-stone-900 leading-none tracking-tight">
              {sector.title}
            </h3>
          </div>

          {/* Vista activa */}
          <div className="service-active py-8 sm:py-10 md:py-12 lg:py-14 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-6 w-full lg:w-[48%] shrink-0">
              <span className="w-24 sm:w-32 md:w-40 lg:w-48 shrink-0 font-mono text-xs sm:text-sm text-stone-900 tracking-wider select-none font-medium pt-1">
                {sector.numero} — SECTOR
              </span>
              <div className="flex-1 pr-2 sm:pr-4">
                <h3 className="text-xl sm:text-2xl font-serif font-light text-stone-900 tracking-tight leading-snug">
                  {sector.title}
                </h3>
                <p className="mt-2 text-base sm:text-lg text-stone-600 font-light leading-relaxed font-sans max-w-md">
                  {sector.descripcion}
                </p>
                <div className="mt-3 sm:mt-4">
                  <Link
                    href={`${ROUTES.sectors}/${sector.slug}`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest uppercase text-stone-900 hover:text-amber-800 transition-colors border-b border-stone-900 pb-0.5 group/link"
                  >
                    <span>VER SECTOR</span>
                    <span className="transition-transform group-hover/link:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[52%]">
              <div className="relative w-full h-[160px] sm:h-[190px] md:h-[220px] lg:h-[240px] overflow-hidden bg-stone-300 rounded-none shadow-sm">
                <Image
                  src={sector.imagen}
                  alt={`ALKO ${sector.title}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  className="object-cover object-center rounded-none filter brightness-100 contrast-[1.02]"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
