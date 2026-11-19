import ContactPage, { contactMetadata } from "@/components/contact/ContactPage";

export const revalidate = 60;

export const metadata = contactMetadata("en");

/** Contacto en inglés. */
export default function ContactEn() {
  return <ContactPage locale="en" />;
}
