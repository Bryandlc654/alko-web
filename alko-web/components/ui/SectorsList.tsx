import Image from "@/components/ui/Image";
import Link from "next/link";
import { ROUTES } from "@/lib/site";
import type { Sector } from "@/lib/types";

/**
 * Servicios en tarjetas de imagen a sangre con etiqueta y titular · Propuesta 6
 * (tarjetas de servicios de la V5). Dos columnas en escritorio.
 */
export default function SectorsList({ sectors }: { sectors: Sector[] }) {
  return (
    <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {sectors.map((sector, i) => (
        <li key={sector.id} className="reveal-item" style={{ transitionDelay: `${(i % 2) * 100}ms` }}>
          <Link
            href={`${ROUTES.sectors}/${sector.slug}`}
            className="group relative block aspect-[4/4.3] overflow-hidden bg-ink text-white md:aspect-[57/50]"
          >
            <Image
              src={sector.imagen}
              alt={`ALKO ${sector.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-alko group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <span className="absolute left-4 top-4 border border-white/50 px-2 py-1 text-[10px] uppercase tracking-[0.18em]">
              {sector.numero} · Servicio
            </span>
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-6 md:inset-x-7 md:bottom-7">
              <div>
                <h3 className="display-title text-3xl md:text-4xl">{sector.title}</h3>
                {sector.descripcion && (
                  <p className="mt-3 line-clamp-2 max-w-md text-sm text-white/80">{sector.descripcion}</p>
                )}
              </div>
              <span
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/70 text-lg transition-colors group-hover:bg-paper group-hover:text-ink"
                aria-hidden="true"
              >
                ↗
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
