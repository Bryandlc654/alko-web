import CareersPage, { careersMetadata } from "@/components/careers/CareersPage";

export const revalidate = 60;

export function generateMetadata() {
  return careersMetadata("en");
}

/** «Trabaja con nosotros» en inglés. */
export default function CareersEn() {
  return <CareersPage locale="en" />;
}
