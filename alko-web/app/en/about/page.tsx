import AboutPage, { aboutMetadata } from "@/components/about/AboutPage";

export const revalidate = 60;

export const metadata = aboutMetadata("en");

/** Página del estudio en inglés. */
export default function AboutEn() {
  return <AboutPage locale="en" />;
}
