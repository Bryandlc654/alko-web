import Image from "next/image";
import Link from "next/link";
import Parallax from "@/components/ui/Parallax";
import { ROUTES } from "@/lib/site";
import type { Sector } from "@/lib/types";
import { localizedPath, type Locale } from "@/lib/i18n";
import { HOME_COPY } from "@/lib/i18n/home";

/** Equipo: texto y servicios a la izquierda, foto a sangre a la derecha (propuesta 6 · V5). */
export default function TeamSplit({ sectors, locale = "es" }: { sectors: Sector[]; locale?: Locale }) {
  const t = HOME_COPY[locale].team;
  return (
    <section id="equipo" className="bg-paper text-ink">
      <div className="grid md:grid-cols-[1fr_minmax(0,52%)]">
        <div
          className="py-24 pr-[var(--gutter)] md:py-28 md:pr-10"
          style={{ paddingLeft: "max(var(--gutter), calc((100vw - var(--site-max)) / 2 + var(--gutter)))" }}
        >
          <p className="eyebrow reveal-item">{t.eyebrow}</p>
          <h2 className="reveal-item display-title mt-5 max-w-[440px] text-[40px] md:text-[48px]">
            {t.title}
          </h2>
          <p className="reveal-item mt-6 max-w-[400px] text-[17px] leading-relaxed text-mid">
            {t.text}
          </p>
          <Link href={localizedPath(ROUTES.team, locale)} className="reveal-item btn btn-ink mt-8">
            {t.cta} <span aria-hidden="true">→</span>
          </Link>
          {sectors.length > 0 && (
            <ul className="reveal-item mt-12 flex max-w-[460px] flex-wrap gap-2.5 text-[10px] uppercase tracking-[0.18em]">
              {sectors.slice(0, 6).map((sector) => (
                <li key={sector.slug}>
                  <Link
                    href={`${ROUTES.sectors}/${sector.slug}`}
                    className="inline-flex items-center gap-3 bg-white px-3 py-2.5 transition-colors hover:bg-ink hover:text-paper"
                  >
                    {t.sectors[sector.title] ?? sector.title} <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative min-h-[420px] md:min-h-0">
          <Parallax strength={14}>
            <Image
              src="/equipo-pasillo.jpg"
              alt={t.alt}
              fill
              sizes="(max-width: 768px) 100vw, 52vw"
              className="object-cover"
            />
          </Parallax>
        </div>
      </div>
    </section>
  );
}
