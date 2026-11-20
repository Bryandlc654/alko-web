import ServicesIndexPage, { servicesMetadata } from "@/components/services/ServicesIndexPage";

export const revalidate = 60;

export const metadata = servicesMetadata("en");

/** Listado de servicios en inglés (la plantilla es común con /servicios). */
export default function ServicesEn() {
  return <ServicesIndexPage locale="en" />;
}
