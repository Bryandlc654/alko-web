import JournalPage, { journalMetadata } from "@/components/journal/JournalPage";

export const revalidate = 60;

export const metadata = journalMetadata("es");

/** Journal en castellano (la versión inglesa del listado está en /en/journal). */
export default function Journal() {
  return <JournalPage locale="es" />;
}
