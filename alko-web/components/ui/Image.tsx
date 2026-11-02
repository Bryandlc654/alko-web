import NextImage, { type ImageProps } from "next/image";

/** Las fotos subidas desde el panel viven en la rama «media» de GitHub. */
const UPLOADS_HOST = "https://raw.githubusercontent.com/";

/**
 * next/image con una excepción: las fotos subidas desde el panel se sirven tal cual desde GitHub.
 * Ya se suben redimensionadas a 1920 px en WebP, y pasarlas otra vez por el optimizador de Render
 * era lento: con varias a la vez (carrusel, galería de un proyecto) algunas no llegaban a cargar.
 */
export default function Image({ src, unoptimized, ...props }: ImageProps) {
  const isUpload = typeof src === "string" && src.startsWith(UPLOADS_HOST);
  return <NextImage src={src} unoptimized={unoptimized ?? isUpload} {...props} />;
}
