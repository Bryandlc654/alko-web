import ContactCta from "@/components/sections/ContactCta";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import Materials from "@/components/sections/Materials";
import Process from "@/components/sections/Process";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import Workshop from "@/components/sections/Workshop";
import ArticlesSection from "@/components/sections/ArticlesSection";
import { getHomeData } from "@/lib/wordpress";

export const revalidate = 60;

export default async function Home() {
  const data = await getHomeData();

  return (
    <main>
      <Hero slides={data.heroSlides} content={data.homeContent} />
      <ProjectsSection projects={data.projects} content={data.homeContent} />
      <Process fases={data.fases} content={data.homeContent} />
      <ServicesSection sectors={data.sectors} content={data.homeContent} />
      <Workshop slides={data.showcaseSlides} content={data.homeContent} />
      <Experience content={data.homeContent} />
      <Materials fabricantes={data.fabricantes} content={data.homeContent} />
      <ArticlesSection articles={data.articles} content={data.homeContent} />
      <ContactCta settings={data.settings} content={data.homeContent} />
    </main>
  );
}
