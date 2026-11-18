import HablemosSection from "@/components/sections/HablemosSection";
import type { SiteSettings } from "@/lib/types";

/** Cierre de la portada: el bloque «Hablemos» común con su ancla propia. */
export default function HomeContact({ settings }: { settings: SiteSettings }) {
  return (
    <HablemosSection
      settings={settings}
      id="presentar-proyecto"
      source="Formulario portada · /"
      image="/hablemos-home.jpg"
    />
  );
}
