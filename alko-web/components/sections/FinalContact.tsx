import HablemosSection from "@/components/sections/HablemosSection";
import type { SiteSettings } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { HOME_COPY } from "@/lib/i18n/home";

/**
 * CTA final compartido por la portada y /proyectos: mismo bloque «Hablemos»,
 * misma imagen y mismos textos. Solo cambian el ancla y el origen del formulario.
 */
export default function FinalContact({
  settings,
  source = "Formulario portada · /",
  id = "presentar-proyecto",
  locale = "es",
}: {
  settings: SiteSettings;
  source?: string;
  id?: string;
  locale?: Locale;
}) {
  return (
    <HablemosSection
      settings={settings}
      id={id}
      source={`${source}${HOME_COPY[locale].sourceSuffix}`}
      image="/hablemos-home.jpg"
      locale={locale}
    />
  );
}
