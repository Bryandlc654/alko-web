import HablemosSection from "@/components/sections/HablemosSection";
import type { HomeContent, SiteSettings } from "@/lib/types";

/**
 * Cierre de las páginas interiores: el bloque «Hablemos» con el formulario
 * (propuesta 6). Mantiene la descripción e imagen editables desde el panel.
 */
export default function ContactCta({
  settings,
  content,
  source = "Cierre de página",
  sectorSlug,
}: {
  settings: SiteSettings;
  content?: HomeContent;
  source?: string;
  sectorSlug?: string;
}) {
  return (
    <HablemosSection
      settings={settings}
      source={source}
      description={content?.contactoDescripcion}
      image={content?.contactoBgImagen || "/cta-bg.jpg"}
      sectorSlug={sectorSlug}
    />
  );
}
