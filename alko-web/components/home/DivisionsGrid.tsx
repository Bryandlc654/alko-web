import Image from "next/image";
import Link from "next/link";
import { DIVISIONS } from "@/lib/divisions";
import { ROUTES } from "@/lib/site";
import type { Sector } from "@/lib/types";

/**
 * Cuatro divisiones en paneles que se expanden al pasar el cursor (escritorio);
 * en móvil y tableta, tarjetas en rejilla. Propuesta 6 · V4.
 */
export default function DivisionsGrid({ sectors }: { sectors: Sector[] }) {
  const slugs = new Set(sectors.map((sector) => sector.slug));
  const hrefFor = (candidates: string[]) => {
    const match = candidates.find((slug) => slugs.has(slug));
    return match ? `${ROUTES.sectors}/${match}` : ROUTES.sectors;
  };

  return (
    <section id="divisiones" className="bg-paper text-ink">
      <div className="site-wrap grid grid-cols-12 items-end gap-6 pb-14 pt-24 lg:pt-36">
        <div className="col-span-12 lg:col-span-7">
          <p className="eyebrow reveal-item">01 / Qué hacemos</p>
          <h2 className="reveal-item display-title mt-6 text-5xl leading-none sm:text-6xl xl:text-[5.5rem]">
            Cuatro ámbitos.
            <br />
            Un mismo criterio.
          </h2>
        </div>
        <p className="reveal-item col-span-12 leading-relaxed text-mid lg:col-span-4 lg:col-start-9">
          Un mismo sistema de trabajo, adaptado a lo que necesita cada cliente: tranquilidad en casa,
          continuidad en la empresa, experiencia en el local y rendimiento en la nave.
        </p>
      </div>

      <div className="div-panels mx-auto grid max-w-site gap-3 px-[var(--gutter)] pb-6 sm:grid-cols-2 lg:flex lg:gap-0 lg:px-0">
        {DIVISIONS.map((division, i) => (
          <Link
            key={division.id}
            href={hrefFor(division.sectorSlugs)}
            aria-label={`Explorar ${division.name}`}
            className={`div-panel group relative aspect-[4/5] overflow-hidden bg-ink text-paper sm:aspect-[3/4] lg:aspect-auto ${
              i < DIVISIONS.length - 1 ? "lg:border-r lg:border-paper/20" : ""
            }`}
          >
            <Image
              src={division.image}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 60vw"
              className="object-cover transition-transform duration-[1.6s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-ink/10" />
            <span className="absolute left-6 top-6 text-[10px] uppercase tracking-[0.22em] text-paper/70">
              {division.num}
            </span>
            <span className="div-panel-name display-title absolute bottom-8 left-6 hidden text-3xl lg:block" aria-hidden="true">
              {division.name}
            </span>
            <div className="div-panel-body absolute inset-x-6 bottom-6 lg:bottom-8">
              <h3 className="display-title text-3xl lg:text-4xl">{division.name}</h3>
              <p className="mt-3 max-w-xs text-sm text-paper/80">{division.desc}</p>
              <span className="mt-6 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.22em]">
                Explorar división <span aria-hidden="true">↗</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Las imágenes de división son provisionales: no se presentan como obras ALKO (brief §3). */}
      <div className="site-wrap flex flex-col-reverse gap-4 pb-24 text-[10px] uppercase tracking-[0.12em] text-mid sm:flex-row sm:justify-between lg:pb-36">
        <span>Imágenes de referencia · No representan obras de ALKO</span>
        <Link href={ROUTES.sectors} className="transition-colors hover:text-ink">
          Explorar divisiones ↗
        </Link>
      </div>
    </section>
  );
}
