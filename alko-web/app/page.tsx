import DivisionsGrid from "@/components/home/DivisionsGrid";
import FeaturedWorks from "@/components/home/FeaturedWorks";
import HomeContact from "@/components/home/HomeContact";
import HomeHero from "@/components/home/HomeHero";
import MethodSteps from "@/components/home/MethodSteps";
import Positioning from "@/components/home/Positioning";
import StudioManifesto from "@/components/home/StudioManifesto";
import { getHomeData } from "@/lib/wordpress";

export const revalidate = 60;

/**
 * Portada · Dirección V3 (orden cerrado por el brief):
 * hero → posicionamiento → 4 divisiones → 3 obras → método → estudio → formulario.
 */
export default async function Home() {
  const data = await getHomeData();
  const heroImage = data.homeContent.heroSlides?.[0] ?? data.heroSlides[0];

  return (
    <main className="bg-paper text-ink">
      <HomeHero image={heroImage} />
      <Positioning />
      <DivisionsGrid sectors={data.sectors} />
      <FeaturedWorks projects={data.projects} />
      <MethodSteps />
      <StudioManifesto />
      <HomeContact
        settings={data.settings}
        projectTypes={[...data.sectors.map((sector) => sector.title), "Otro"]}
      />
    </main>
  );
}
