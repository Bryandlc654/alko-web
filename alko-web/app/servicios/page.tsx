import ServicesIndexPage, { servicesMetadata } from "@/components/services/ServicesIndexPage";

export const revalidate = 60;

export const metadata = servicesMetadata("es");

/** Listado de servicios en castellano (la plantilla es común con /en/services). */
export default function ServiciosPage() {
  return <ServicesIndexPage locale="es" />;
}
