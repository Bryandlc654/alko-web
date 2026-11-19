import HomePage, { homeMetadata } from "@/components/home/HomePage";

export const revalidate = 60;

export const metadata = homeMetadata("es");

/** Portada en castellano (la versión inglesa está en /en). */
export default function Home() {
  return <HomePage locale="es" />;
}
