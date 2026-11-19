import type { ReactNode } from "react";

/**
 * Capa de parallax para una imagen de fondo (`<Image fill />`). Ocupa todo el contenedor
 * padre (que debe ser `relative`) y deja la imagen un `strength`% más alta, repartido
 * arriba y abajo, para que SiteScripts la desplace con el scroll sin que asomen bordes.
 *
 * No añade JavaScript propio: es solo marcado. El movimiento lo hace GSAP (cargado en
 * diferido) moviendo únicamente `transform` en esta capa, y solo en pantallas de tableta
 * hacia arriba y sin «reducir movimiento». Sin JS o en móvil, la imagen queda quieta y
 * centrada.
 */
export default function Parallax({ strength = 12, children }: { strength?: number; children: ReactNode }) {
  const overflow = `-${strength / 2}%`;
  return (
    <div data-parallax={strength} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div data-parallax-layer className="absolute inset-x-0" style={{ top: overflow, bottom: overflow }}>
        {children}
      </div>
    </div>
  );
}
