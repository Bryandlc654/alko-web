import Image from "next/image";
import Link from "next/link";
import SectionHead from "@/components/home/SectionHead";
import { DIVISIONS } from "@/lib/divisions";
import { ROUTES } from "@/lib/site";
import type { Sector } from "@/lib/types";

/** Cuatro divisiones en tarjetas editoriales 2×2. */
export default function DivisionsGrid({ sectors }: { sectors: Sector[] }) {
  const slugs = new Set(sectors.map((sector) => sector.slug));
  const hrefFor = (candidates: string[]) => {
    const match = candidates.find((slug) => slugs.has(slug));
    return match ? `${ROUTES.sectors}/${match}` : ROUTES.sectors;
  };

  return (
    <section id="divisiones" className="section-y bg-paper text-ink">
      <div className="site-wrap">
        <SectionHead
          eyebrow="01 / Qué hacemos"
          title={
            <>
              Cuatro ámbitos.
              <br />
              Un mismo criterio.
            </>
          }
          text="Organizamos nuestra experiencia según las necesidades de cada cliente, manteniendo un enfoque integral de ejecución."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[26px]">
          {DIVISIONS.map((division, i) => (
            <Link
              key={division.id}
              href={hrefFor(division.sectorSlugs)}
              aria-label={`Explorar ${division.name}`}
              className="reveal-item group relative block aspect-[4/3] min-h-[300px] overflow-hidden bg-piedra text-white"
              style={{ transitionDelay: `${(i % 2) * 100}ms` }}
            >
              <Image
                src={division.image}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover saturate-[.82] transition-transform duration-[900ms] ease-alko group-hover:scale-[1.045]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-10 p-[clamp(22px,3vw,44px)] pr-24">
                <span className="text-[10px] uppercase tracking-[0.17em] text-white/80">
                  {division.num} / División ALKO
                </span>
                <h3 className="display-title mt-3 text-[clamp(30px,3.3vw,48px)] font-normal tracking-[-0.055em]">
                  {division.name}
                </h3>
                <p className="mt-2 max-w-[360px] text-[13px] leading-relaxed text-white/90">{division.desc}</p>
              </div>
              <span
                aria-hidden="true"
                className="absolute bottom-[clamp(22px,3vw,44px)] right-[clamp(22px,2.5vw,36px)] z-10 grid h-12 w-12 place-items-center rounded-full border border-white/80 text-xl transition-colors duration-200 group-hover:bg-paper group-hover:text-ink"
              >
                ↗
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-7 flex justify-end">
          <Link href={ROUTES.sectors} className="arrow-link">
            Explorar divisiones <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
