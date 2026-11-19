import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { HOME_COPY } from "@/lib/i18n/home";

const IMAGES = ["/materia-salon.jpg", "/materia-recibidor.jpg", "/materia-terraza.jpg"];

/** Franja de materialidad: tres imágenes y un texto, a todo el ancho (propuesta 6 · V4). */
export default function MaterialStrip({ locale = "es" }: { locale?: Locale }) {
  const t = HOME_COPY[locale].materialStrip;
  const tile = (i: number) => (
    <div key={IMAGES[i]} className="reveal-item group relative aspect-square overflow-hidden">
      <Image
        src={IMAGES[i]}
        alt={t.alts[i]}
        fill
        sizes="(max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.04]"
      />
    </div>
  );

  return (
    <section aria-label={t.label} className="grid grid-cols-2 lg:grid-cols-4">
      {tile(0)}
      <div className="reveal-item flex aspect-square flex-col justify-between bg-surface p-8 text-ink lg:p-12">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="var(--bronze)" strokeWidth="1" aria-hidden="true">
          <path d="M17 2 31 10v14l-14 8-14-8V10z" />
          <path d="M3 10l14 8 14-8M17 18v14" />
        </svg>
        <div>
          <h3 className="display-title text-2xl lg:text-3xl">{t.title}</h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-mid">
            {t.text}
          </p>
        </div>
      </div>
      {tile(1)}
      {tile(2)}
    </section>
  );
}
