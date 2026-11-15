import type { ReactNode } from "react";

const TONES = {
  paper: "bg-paper text-ink",
  surface: "bg-surface text-ink",
  white: "bg-white text-ink",
  ink: "bg-ink text-paper",
} as const;

/**
 * Sección editorial con índice lateral: a la izquierda el número y la etiqueta (fijos al hacer
 * scroll en escritorio) y a la derecha el titular, la entradilla y el contenido.
 */
export default function EditorialSection({
  number,
  label,
  title,
  intro,
  tone = "paper",
  id,
  wide = false,
  className = "",
  children,
}: {
  number?: string;
  label: ReactNode;
  title?: ReactNode;
  intro?: ReactNode;
  tone?: keyof typeof TONES;
  id?: string;
  /** El contenido ocupa todo el ancho bajo el titular (rejillas, listados). */
  wide?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const dark = tone === "ink";
  const rule = dark ? "border-paper/15" : "border-ink/15";

  const head = (title || intro) && (
    <div className="reveal-item">
      {title && (
        <h2 className="display-title max-w-4xl whitespace-pre-line text-[2.4rem] leading-[1.02] sm:text-5xl lg:text-6xl">
          {title}
        </h2>
      )}
      {intro && (
        <div className={`mt-6 max-w-2xl whitespace-pre-line text-lg leading-relaxed ${dark ? "text-paper/65" : "text-mid"}`}>
          {intro}
        </div>
      )}
    </div>
  );

  return (
    <section id={id} className={`${TONES[tone]} scroll-mt-24 ${className}`}>
      <div className="site-wrap py-20 sm:py-28 lg:py-32">
        <div className={`grid grid-cols-12 gap-x-6 gap-y-10 border-t pt-8 ${rule}`}>
          <aside className="reveal-item col-span-12 lg:col-span-3">
            <div className="flex items-baseline gap-4 lg:sticky lg:top-32 lg:block">
              {number && (
                <span className={`display-title text-4xl lg:text-6xl ${dark ? "text-bronze-light" : "text-bronze"}`}>{number}</span>
              )}
              <p className={`text-[10px] uppercase tracking-[0.22em] lg:mt-4 ${dark ? "text-paper/60" : "text-mid"}`}>{label}</p>
            </div>
          </aside>
          <div className="col-span-12 lg:col-span-9">
            {head}
            {!wide && children && <div className={head ? "mt-12 sm:mt-16" : ""}>{children}</div>}
          </div>
        </div>
        {wide && children && <div className="mt-12 sm:mt-16">{children}</div>}
      </div>
    </section>
  );
}
