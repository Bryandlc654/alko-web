import HablemosSection from "@/components/sections/HablemosSection";
import type { HomeContent, SiteSettings } from "@/lib/types";

/**
 * Cierre de las páginas: el bloque «Hablemos» con el formulario (propuesta 6).
 * Mantiene los textos e imagen editables desde el panel y la llamada final propia
 * de cada proyecto (título, texto, foto y capa oscura).
 */
export default function ContactCta({
  settings,
  content,
  titulo,
  descripcion,
  imagen,
  source = "Cierre de página",
  overlay = false,
  sectorSlug,
}: {
  settings: SiteSettings;
  content?: HomeContent;
  /** Sustituyen a los de la portada (p. ej. la llamada final de cada proyecto). */
  titulo?: string;
  descripcion?: string;
  imagen?: string;
  /** Sin efecto: el bloque ya incluye el formulario completo (se mantiene por compatibilidad). */
  boton?: string;
  /** Origen que se guarda con la solicitud de contacto. */
  source?: string;
  /** Capa oscura sobre toda la foto, con antetítulo (llamada final de los proyectos). */
  overlay?: boolean;
  /** Sin efecto: el bloque ya incluye el formulario completo (se mantiene por compatibilidad). */
  formulario?: "rapido" | "avanzado";
  /** Servicio desde el que se muestra, para preseleccionar su división. */
  sectorSlug?: string;
}) {
  return (
    <HablemosSection
      settings={settings}
      source={source}
      title={titulo}
      eyebrow={overlay ? "Siguiente paso" : undefined}
      overlay={overlay}
      description={descripcion || content?.contactoDescripcion}
      image={imagen || content?.contactoBgImagen || "/cta-bg.jpg"}
      sectorSlug={sectorSlug}
    />
  );
}
