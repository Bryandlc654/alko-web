import HablemosSection from "@/components/sections/HablemosSection";
import type { SiteSettings } from "@/lib/types";

/**
 * CTA final compartido por la portada y /proyectos: mismo bloque «Hablemos»,
 * misma imagen y mismos textos. Solo cambian el ancla y el origen del formulario.
 */
export default function FinalContact({
  settings,
  source = "Formulario portada · /",
  id = "presentar-proyecto",
}: {
  settings: SiteSettings;
  source?: string;
  id?: string;
}) {
  return <HablemosSection settings={settings} id={id} source={source} image="/hablemos-home.jpg" />;
}
