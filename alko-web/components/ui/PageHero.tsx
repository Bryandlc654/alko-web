import Image from "next/image";
import type { ReactNode } from "react";
import Container from "./Container";

/**
 * Cabecera de las páginas interiores (listados y detalles).
 *
 * Siempre lleva imagen de fondo a plena opacidad, con degradados para que el
 * texto se lea, igual que las cabeceras de Proyectos y Contacto. La navegación
 * es transparente sobre ella (ver TRANSPARENT_HEADER_ROUTES en lib/site.ts), por
 * eso deja el espacio superior (pt-36) para no solaparse con la barra.
 */
export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
  imagePosition = "object-center",
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  image: string;
  imageAlt?: string;
  /** Encuadre de la imagen (clase object-*), p. ej. «object-top». */
  imagePosition?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative isolate flex min-h-[560px] sm:min-h-[620px] lg:min-h-[72vh] items-end overflow-hidden bg-stone-950 text-white pt-36 sm:pt-44 pb-14 sm:pb-20">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className={`-z-10 object-cover ${imagePosition}`}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-stone-950/90 via-stone-950/55 to-stone-950/10" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-stone-950/70 to-transparent" />

      <Container className="relative w-full">
        {eyebrow && (
          <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-white/70 uppercase mb-4">
            {eyebrow}
          </span>
        )}
        <h1 className="max-w-5xl font-display font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.02] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
          {title}
        </h1>
        {description && (
          <div className="mt-6 max-w-2xl text-base sm:text-lg text-white/85 font-light leading-relaxed font-sans">
            {description}
          </div>
        )}
        {children}
      </Container>
    </header>
  );
}
