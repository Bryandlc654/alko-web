import Image from "@/components/ui/Image";
import type { ReactNode } from "react";
import Breadcrumbs, { type Crumb } from "@/components/ui/Breadcrumbs";

/**
 * Cabecera editorial clara (contacto, estudio, equipo, empleo y Journal): fondo papel, sin foto
 * detrás del texto. Fila de migas e índice, titular muy grande, y abajo la descripción a la
 * izquierda y un hueco libre (`aside`) a la derecha. La foto, si la hay, va debajo enmarcada.
 * La navegación es sólida en estas rutas (SOLID_HEADER_ROUTES en lib/site.ts).
 */
export default function EditorialHeader({
  index,
  eyebrow,
  title,
  description,
  breadcrumbs,
  aside,
  image,
  imageAlt = "",
  imagePosition = "object-center",
  caption,
  children,
}: {
  /** Marca de sección a la derecha de las migas (p. ej. «05»). */
  index?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
  /** Columna derecha bajo el titular: datos, canales, accesos… */
  aside?: ReactNode;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  /** Pie de la foto (izquierda); a la derecha siempre «Madrid». */
  caption?: string;
  /** Contenido a todo el ancho bajo la descripción. */
  children?: ReactNode;
}) {
  return (
    <header className="bg-paper text-ink">
      <div className="site-wrap pt-28 sm:pt-36 lg:pt-40">
        <div className="hh-rise flex items-center justify-between gap-6 border-b border-ink/15 pb-5">
          {breadcrumbs ? <Breadcrumbs items={breadcrumbs} tone="dark" /> : <span />}
          {(index || eyebrow) && (
            <span className="hidden shrink-0 text-[10px] uppercase tracking-[0.22em] text-mid sm:inline">
              {eyebrow}
              {index && eyebrow && <span className="mx-2 text-ink/30">/</span>}
              {index && <span className="text-bronze">{index}</span>}
            </span>
          )}
        </div>

        <h1 className="hh-rise display-title mt-12 max-w-[15ch] text-[3rem] leading-[0.95] tracking-[-0.045em] sm:mt-16 sm:text-7xl lg:text-[6.5rem] xl:text-[7.75rem]">
          {title}
        </h1>

        {(description || aside) && (
          <div
            className="hh-rise mt-12 grid grid-cols-12 gap-x-6 gap-y-10 border-t border-ink/15 pt-8 sm:mt-16"
            style={{ animationDelay: ".15s" }}
          >
            {description && (
              <div className="col-span-12 max-w-xl text-lg leading-relaxed text-mid lg:col-span-6">{description}</div>
            )}
            {aside && <div className="col-span-12 lg:col-span-5 lg:col-start-8">{aside}</div>}
          </div>
        )}

        {children && (
          <div className="hh-rise" style={{ animationDelay: ".25s" }}>
            {children}
          </div>
        )}
      </div>

      {image ? (
        <figure className="site-wrap mt-14 pb-6 sm:mt-20">
          <div className="hh-rise relative aspect-[4/3] overflow-hidden bg-piedra sm:aspect-[21/9]" style={{ animationDelay: ".3s" }}>
            <Image src={image} alt={imageAlt} fill priority sizes="100vw" className={`hh-zoom object-cover ${imagePosition}`} />
          </div>
          <figcaption className="mt-4 flex items-center gap-4 text-mid">
            <span className="text-[10px] uppercase tracking-[0.22em]">{caption || "ALKO"}</span>
            <span className="cota flex-1 text-ink" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.22em]">Madrid</span>
          </figcaption>
        </figure>
      ) : (
        <div className="pb-6" />
      )}
    </header>
  );
}
