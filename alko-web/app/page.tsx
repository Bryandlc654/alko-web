import DivisionsGrid from "@/components/home/DivisionsGrid";
import FeaturedWorks from "@/components/home/FeaturedWorks";
import HomeArticles from "@/components/home/HomeArticles";
import HomeContact from "@/components/home/HomeContact";
import HomeFaq from "@/components/home/HomeFaq";
import HomeHero from "@/components/home/HomeHero";
import ManifestoBand from "@/components/home/ManifestoBand";
import MaterialStrip from "@/components/home/MaterialStrip";
import MethodSteps from "@/components/home/MethodSteps";
import Positioning from "@/components/home/Positioning";
import TeamSplit from "@/components/home/TeamSplit";
import Materials from "@/components/sections/Materials";
import { getHomeData } from "@/lib/wordpress";

export const revalidate = 60;

/**
 * Portada · Propuesta 6: la parte superior de la V4 (hero → posicionamiento →
 * divisiones → proyectos → materialidad → método) y el cierre de la V5
 * (manifiesto → equipo → fabricantes → preguntas → artículos → «Hablemos»).
 */
export default async function Home() {
  const data = await getHomeData();
  const slides = data.homeContent.heroSlides?.length ? data.homeContent.heroSlides : data.heroSlides;

  return (
    <main className="bg-paper text-ink">
      <HomeHero slides={slides} />
      <Positioning />
      <DivisionsGrid sectors={data.sectors} />
      <FeaturedWorks projects={data.projects} heroImage={slides[0]?.image} />
      <MaterialStrip />
      <MethodSteps />
      <ManifestoBand />
      <TeamSplit sectors={data.sectors} />
      <Materials fabricantes={data.fabricantes} />
      <HomeFaq />
      <HomeArticles articles={data.articles} />
      <HomeContact settings={data.settings} />
    </main>
  );
}
