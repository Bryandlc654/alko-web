import type { ReactNode } from "react";

/**
 * Cierre tipográfico en carbón para las páginas editoriales: titular enorme a todo el ancho y,
 * bajo una línea, la entradilla a la izquierda y las acciones a la derecha.
 */
export default function EditorialCta({
  label,
  title,
  description,
  meta,
  children,
}: {
  label?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Datos de contacto u otra línea pequeña bajo la entradilla. */
  meta?: ReactNode;
  /** Botones. */
  children?: ReactNode;
}) {
  return (
    <section className="bg-ink text-paper">
      <div className="site-wrap py-24 sm:py-32 lg:py-40">
        {label && <p className="eyebrow eyebrow-light reveal-item">{label}</p>}
        <h2 className="reveal-item display-title mt-8 max-w-[16ch] whitespace-pre-line text-[2.8rem] leading-[0.98] tracking-[-0.04em] sm:text-7xl lg:text-[6rem]">
          {title}
        </h2>
        <div className="reveal-item mt-14 grid grid-cols-12 gap-x-6 gap-y-10 border-t border-paper/15 pt-8 sm:mt-20">
          <div className="col-span-12 lg:col-span-6">
            {description && <p className="max-w-xl text-lg leading-relaxed text-paper/70">{description}</p>}
            {meta && <div className="mt-8 text-sm text-paper/70">{meta}</div>}
          </div>
          {children && (
            <div className="col-span-12 flex flex-wrap items-start gap-4 lg:col-span-5 lg:col-start-8 lg:justify-end">{children}</div>
          )}
        </div>
      </div>
    </section>
  );
}
