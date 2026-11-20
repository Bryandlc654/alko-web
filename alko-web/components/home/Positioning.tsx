import Image from "next/image";
import Link from "next/link";
import Parallax from "@/components/ui/Parallax";
import { ROUTES } from "@/lib/site";
import { localizedPath, type Locale } from "@/lib/i18n";
import { HOME_COPY } from "@/lib/i18n/home";

const FACT_NUMS = ["01", "04", "05"];

/** Tesis de posicionamiento con imagen y cifras (propuesta 6 · V4). */
export default function Positioning({ locale = "es" }: { locale?: Locale }) {
  const t = HOME_COPY[locale].positioning;
  return (
    <section id="tesis" aria-label={t.label} className="plan-lines bg-surface text-ink">
      <div className="site-wrap grid grid-cols-12 items-center gap-x-6 gap-y-14 py-24 lg:py-36">
        <div className="col-span-12 lg:col-span-6 lg:pr-12">
          <p className="eyebrow reveal-item">{t.eyebrow}</p>
          <h2 className="reveal-item display-title mt-8 text-[2.4rem] leading-[1.05] sm:text-5xl xl:text-[4rem]">
            {t.title}
          </h2>
          <p className="reveal-item mt-10 max-w-md leading-relaxed text-mid">
            {t.text}
          </p>
          <dl className="reveal-item mt-12 grid max-w-lg grid-cols-3 border-t border-ink/15">
            {FACT_NUMS.map((num, i) => (
              <div key={num} className={`pt-5 pr-4 ${i > 0 ? "border-l border-ink/15 pl-4" : ""}`}>
                <dt className="display-title text-2xl">{num}</dt>
                <dd className="mt-1 text-xs text-mid">{t.facts[i]}</dd>
              </div>
            ))}
          </dl>
          <Link href={localizedPath(ROUTES.company, locale)} className="reveal-item btn btn-outline mt-12">
            {t.cta} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <figure className="col-span-12 lg:col-span-5 lg:col-start-8">
          <div className="reveal-scale relative aspect-[4/5] overflow-hidden bg-piedra">
            <Parallax>
              <Image
                src="/tesis-cocina-tableta.jpg"
                alt={t.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </Parallax>
          </div>
          <figcaption className="mt-4 flex items-center gap-4 text-mid">
            <span className="text-[10px] uppercase tracking-[0.22em]">{t.captionA}</span>
            <span className="cota flex-1 text-ink" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.22em]">{t.captionB}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
