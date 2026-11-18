import Image from "next/image";

const IMAGES = [
  { src: "/materia-salon.jpg", alt: "Salón con chimenea, madera y grandes ventanales en una reforma de ALKO" },
  { src: "/materia-recibidor.jpg", alt: "Detalle de mármol, latón y vegetación en un interior reformado por ALKO" },
  { src: "/materia-terraza.jpg", alt: "Terraza frente al mar con mobiliario de madera y tejidos naturales" },
];

/** Franja de materialidad: tres imágenes y un texto, a todo el ancho (propuesta 6 · V4). */
export default function MaterialStrip() {
  const tile = (img: (typeof IMAGES)[number]) => (
    <div key={img.src} className="group relative aspect-square overflow-hidden">
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes="(max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.04]"
      />
    </div>
  );

  return (
    <section aria-label="Materialidad" className="grid grid-cols-2 lg:grid-cols-4">
      {tile(IMAGES[0])}
      <div className="flex aspect-square flex-col justify-between bg-surface p-8 text-ink lg:p-12">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="var(--bronze)" strokeWidth="1" aria-hidden="true">
          <path d="M17 2 31 10v14l-14 8-14-8V10z" />
          <path d="M3 10l14 8 14-8M17 18v14" />
        </svg>
        <div>
          <h3 className="display-title text-2xl lg:text-3xl">Materia y oficio</h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-mid">
            Piedra, madera y luz. Seleccionamos cada material según el proyecto aprobado y lo ejecutamos con
            oficios coordinados.
          </p>
        </div>
      </div>
      {tile(IMAGES[1])}
      {tile(IMAGES[2])}
    </section>
  );
}
