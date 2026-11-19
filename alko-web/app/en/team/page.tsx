import TeamPage, { teamMetadata } from "@/components/team/TeamPage";

export const revalidate = 60;

export const metadata = teamMetadata("en");

/** Equipo en inglés. */
export default function TeamEn() {
  return <TeamPage locale="en" />;
}
