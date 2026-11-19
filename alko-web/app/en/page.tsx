import HtmlLang from "@/components/i18n/HtmlLang";
import HomePage, { homeMetadata } from "@/components/home/HomePage";

export const revalidate = 60;

export const metadata = homeMetadata("en");

/** Portada en inglés. */
export default function HomeEn() {
  return (
    <>
      <HtmlLang locale="en" />
      <HomePage locale="en" />
    </>
  );
}
