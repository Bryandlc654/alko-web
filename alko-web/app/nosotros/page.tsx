import AboutPage, { aboutMetadata } from "@/components/about/AboutPage";

export const revalidate = 60;

export const metadata = aboutMetadata("es");

/** Página del estudio en castellano (la versión inglesa está en /en/about). */
export default function NosotrosPage() {
  return <AboutPage locale="es" />;
}
