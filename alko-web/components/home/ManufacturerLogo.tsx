"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Logo de fabricante con respaldo tipográfico: si la imagen no carga (p. ej. el CMS
 * devuelve HTML en lugar del archivo), se muestra el nombre.
 */
export default function ManufacturerLogo({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(!src);
  const ref = useRef<HTMLImageElement>(null);

  // Si la imagen falló antes de hidratar, onError ya no se dispara: se comprueba al montar.
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return <span className="display-title px-4 text-center text-xl uppercase tracking-[0.12em] text-mid">{name}</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- se necesita onError para el respaldo
    <img
      ref={ref}
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-10 w-auto max-w-[160px] object-contain opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
    />
  );
}
