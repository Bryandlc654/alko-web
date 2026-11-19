import ContactPage, { contactMetadata } from "@/components/contact/ContactPage";

export const revalidate = 60;

export const metadata = contactMetadata("es");

/** Contacto en castellano (la versión inglesa está en /en/contact). */
export default function ContactoPage() {
  return <ContactPage locale="es" />;
}
