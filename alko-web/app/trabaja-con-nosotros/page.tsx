import CareersPage, { careersMetadata } from "@/components/careers/CareersPage";

export const revalidate = 60;

export function generateMetadata() {
  return careersMetadata("es");
}

/** «Trabaja con nosotros» en castellano (la versión inglesa está en /en/careers). */
export default function TrabajaConNosotrosPage() {
  return <CareersPage locale="es" />;
}
