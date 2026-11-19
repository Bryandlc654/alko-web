import JournalPage, { journalMetadata } from "@/components/journal/JournalPage";

export const revalidate = 60;

export const metadata = journalMetadata("en");

/** Listado del Journal en inglés (los artículos siguen en castellano). */
export default function JournalEn() {
  return <JournalPage locale="en" />;
}
