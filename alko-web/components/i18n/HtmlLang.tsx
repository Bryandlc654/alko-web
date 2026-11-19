import { LOCALE_META, type Locale } from "@/lib/i18n";

/**
 * El layout raíz es común a los dos idiomas y sirve lang="es". Las páginas en otro idioma
 * incluyen este script, que corrige el atributo en cuanto se analiza el HTML, antes de
 * hidratar. Google no usa lang para detectar el idioma, pero sí lectores de pantalla,
 * traductores y Bing. Al navegar, SiteShell lo mantiene al día.
 */
export default function HtmlLang({ locale }: { locale: Locale }) {
  if (locale === "es") return null;
  return (
    <script
      dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(LOCALE_META[locale].htmlLang)}` }}
    />
  );
}
