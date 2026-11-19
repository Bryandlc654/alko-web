import HomePage, { homeMetadata } from "@/components/home/HomePage";

export const revalidate = 60;

export const metadata = homeMetadata("en");

/**
 * Portada en inglés. El layout raíz es común y sirve lang="es"; este script lo corrige en
 * cuanto se analiza el HTML, antes de hidratar (Google no usa el atributo lang para el idioma,
 * pero sí lectores de pantalla, traductores y Bing). Al navegar, SiteShell lo mantiene al día.
 */
export default function HomeEn() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.lang="en"' }} />
      <HomePage locale="en" />
    </>
  );
}
