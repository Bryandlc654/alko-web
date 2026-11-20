import Image from "@/components/ui/Image";
import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";
import { JOURNAL_COPY, type LocalizedGuide } from "@/lib/i18n/journal";
import { ROUTES } from "@/lib/site";

/**
 * Índice de guías del Journal: una fila por guía con tema, lectura e imagen. Las guías llegan ya
 * con sus textos en el idioma de la página (localizeGuide); la guía completa está en castellano.
 */
export default function GuidesIndex({ guides, locale = "es" }: { guides: LocalizedGuide[]; locale?: Locale }) {
  const t = JOURNAL_COPY[locale].guidesSection;
  return (
    <div className="border-t border-ink/15">
      {guides.map((guide) => (
        <article key={guide.id} className="reveal-item group border-b border-ink/15">
          <Link
            href={guide.hasPage ? localizedPath(`${ROUTES.guides}/${guide.slug}`, locale) : `${ROUTES.guides}/${guide.slug}`}
            hrefLang={guide.hasPage ? undefined : "es"}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 py-10 sm:py-12 lg:items-center"
          >
            <span className="flex items-baseline gap-3 lg:col-span-2 lg:block">
              <span className="display-title block text-4xl text-bronze lg:text-6xl">{guide.numero}</span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-mid lg:mt-3 lg:block">{t.guide}</span>
            </span>

            <div className="lg:col-span-6">
              <span className="mb-4 block text-[10px] uppercase tracking-[0.22em] text-mid">
                {guide.tema}
                {guide.lectura && ` · ${t.reading(guide.lectura)}`}
              </span>
              <h3
                lang={guide.translated ? undefined : "es"}
                className="display-title text-3xl sm:text-4xl lg:text-5xl text-ink leading-tight group-hover:text-bronze transition-colors duration-300"
              >
                {guide.title}
              </h3>
              {guide.descripcion && (
                <p
                  lang={guide.translated ? undefined : "es"}
                  className="mt-4 max-w-xl text-base sm:text-lg text-mid font-light leading-relaxed"
                >
                  {guide.descripcion}
                </p>
              )}
              <span className="mt-6 block">
                <span className="arrow-link">
                  {t.read} <span aria-hidden="true">↗</span>
                </span>
              </span>
            </div>

            <div className="lg:col-span-4">
              <div className="relative overflow-hidden aspect-[4/3] bg-piedra">
                <Image
                  src={guide.imagen}
                  alt={guide.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-center transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.04]"
                />
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
