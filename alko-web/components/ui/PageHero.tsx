import Image from "next/image";
import type { ReactNode } from "react";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";

/**
 * Cabecera de las páginas interiores · Propuesta 6 (hero de la V4 en versión baja):
 * foto a sangre con un único velo abajo, titular grande abajo a la izquierda y la
 * descripción en la columna derecha. La navegación es transparente sobre ella (ver
 * TRANSPARENT_HEADER_ROUTES en lib/site.ts), por eso deja espacio arriba.
 */
export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
  imagePosition = "object-center",
  breadcrumbs,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  image: string;
  imageAlt?: string;
  /** Encuadre de la imagen (clase object-*), p. ej. «object-top». */
  imagePosition?: string;
  /** Migas de pan (sin «Inicio», que se añade solo); el último elemento es la página actual. */
  breadcrumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <header className="relative isolate flex min-h-[560px] items-end overflow-hidden bg-ink pb-10 pt-36 text-paper sm:min-h-[620px] sm:pt-44 lg:min-h-[78vh] lg:pb-14">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className={`hh-zoom -z-20 object-cover ${imagePosition}`}
      />
      {/* Velo único, más denso abajo: imagen limpia y titular legible */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/40" />

      <div className="site-wrap relative w-full">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="hh-rise mb-8" />}
        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-8">
          <div className="col-span-12 lg:col-span-8">
            {eyebrow && <p className="hh-rise eyebrow eyebrow-light mb-6">{eyebrow}</p>}
            <h1 className="hh-rise display-title max-w-5xl text-[2.6rem] leading-[1] sm:text-6xl xl:text-[5.2rem]">{title}</h1>
          </div>
          {description && (
            <div
              className="hh-rise col-span-12 max-w-md leading-relaxed text-paper/80 lg:col-span-4 lg:justify-self-end"
              style={{ animationDelay: ".2s" }}
            >
              {description}
            </div>
          )}
        </div>
        {children && (
          <div className="hh-rise" style={{ animationDelay: ".3s" }}>
            {children}
          </div>
        )}
        <span className="cota mt-10 block text-paper lg:mt-14" aria-hidden="true" />
      </div>
    </header>
  );
}
