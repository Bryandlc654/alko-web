import TeamPage, { teamMetadata } from "@/components/team/TeamPage";

export const revalidate = 60;

export const metadata = teamMetadata("es");

/** Equipo en castellano (la versión inglesa está en /en/team). */
export default function EquipoPage() {
  return <TeamPage locale="es" />;
}
