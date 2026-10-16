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
      <Hero slides={data.heroSlides} />
      <ProjectsSection projects={data.projects} />
      <Process fases={data.fases} />
      <ServicesSection sectors={data.sectors} />
      <Workshop slides={data.showcaseSlides} />
      <Experience />
      <Materials fabricantes={data.fabricantes} />
      <ArticlesSection articles={data.articles} />
      <ContactCta settings={data.settings} />
    </main>
  );
}
