import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import SectorsList from "@/components/ui/SectorsList";
import { getSectors } from "@/lib/wordpress";

export const revalidate = 60;

export const metadata = {
  title: "Servicios — ALKO",
  description:
    "Especialidades: rehabilitación, reforma integral, obra nueva y gestión de instalaciones técnicas con un único responsable.",
};

export default async function ServiciosPage() {
  const sectors = await getSectors();

  return (
    <main className="bg-white text-stone-900">
      <PageHero
        eyebrow="SERVICIOS"
        title="Especialidades"
        description="Actuamos de forma transversal para reducir interfaces y garantizar la coherencia entre proyecto y obra."
      />
      <Container className="py-12 sm:py-20">
        <SectorsList sectors={sectors} />
      </Container>
    </main>
  );
}


