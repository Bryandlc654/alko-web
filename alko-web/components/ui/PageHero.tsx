import Image from "next/image";
import type { ReactNode } from "react";
import Container from "./Container";

/**
 * Cabecera de las páginas interiores (listados y detalles).
 *
 * Al ser la cabecera de navegación fija y sólida en estas rutas, añade el
 * espacio superior necesario (pt-36) para no solaparse con ella.
 */
export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative isolate overflow-hidden bg-stone-950 text-white pt-36 sm:pt-44 pb-16 sm:pb-20">
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/50" />
        </>
      ) : (
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-stone-950 via-stone-950/95 to-stone-900" />
      )}

      <Container className="relative">
        {eyebrow && (
          <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-white/60 uppercase mb-4">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-none">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-stone-200/85 font-light leading-relaxed font-sans">
            {description}
          </p>
        )}
        {children}
      </Container>
    </header>
  );
}
