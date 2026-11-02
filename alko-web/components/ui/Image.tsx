"use client";

import { useState } from "react";
import NextImage, { type ImageProps } from "next/image";

/** Las fotos subidas desde el panel viven en la rama «media» de GitHub. */
const UPLOADS_HOST = "https://raw.githubusercontent.com/";

/**
 * next/image con dos añadidos:
 * - Las fotos subidas desde el panel se sirven tal cual desde GitHub. Ya se suben redimensionadas
 *   a 1920 px en WebP, y pasarlas otra vez por el optimizador de Render era lento: con varias a la
 *   vez (carrusel, galería de un proyecto) algunas no llegaban a cargar.
 * - Hasta que la foto termina de cargar se ve un bloque gris que late (skeleton). `skeleton={false}`
 *   lo quita, para logos o imágenes con transparencia.
 */
export default function Image({
  src,
  unoptimized,
  className = "",
  onLoad,
  skeleton = true,
  ...props
}: ImageProps & { skeleton?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const isUpload = typeof src === "string" && src.startsWith(UPLOADS_HOST);
  const pending = skeleton && !loaded;
  return (
    <NextImage
      src={src}
      unoptimized={unoptimized ?? isUpload}
      className={pending ? `${className} animate-pulse bg-stone-500/20` : className}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      {...props}
    />
  );
}
