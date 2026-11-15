import ContactCta from "@/components/sections/ContactCta";
import PageHero from "@/components/ui/PageHero";
import SectorsList from "@/components/ui/SectorsList";
import { getSectors, getSettings } from "@/lib/wordpress";
import { getDbServiciosPageContent } from "@/lib/db/mysql";

export const revalidate = 60;

export const metadata = {
  title: "Servicios — ALKO",
  description:
    "Especialidades: rehabilitación, reforma integral, obra nueva y gestión de instalaciones técnicas con un único responsable.",
};

export default async function ServiciosPage() {
  const [sectors, pageContent, settings] = await Promise.all([
    getSectors(),
    getDbServiciosPageContent(),
    getSettings(),
  ]);

  return (
    <main className="bg-paper text-ink">
      <PageHero
        breadcrumbs={[{ label: "Servicios" }]}
        eyebrow={pageContent.headerBadge || "SERVICIOS"}
        title={pageContent.headerTitulo || "Especialidades"}
        description={
          pageContent.headerDescripcion ||
          "Actuamos de forma transversal para reducir interfaces y garantizar la coherencia entre proyecto y obra."
        }
        image={pageContent.headerBgImage || sectors[0]?.imagen || "/sector-oficinas.jpg"}
      />

      <section className="site-wrap py-24 lg:py-32">
        <div className="mb-14 grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 lg:col-span-7">
            <p className="eyebrow reveal-item">Nuestras divisiones</p>
            <h2 className="reveal-item display-title mt-6 text-5xl leading-none sm:text-6xl">
              Pensado con propósito,
              <br />
              construido para durar
            </h2>
          </div>
          <p className="reveal-item col-span-12 leading-relaxed text-mid lg:col-span-4 lg:col-start-9">
            Cada especialidad tiene su propio equipo técnico, con un mismo método de trabajo y un único
            interlocutor de principio a fin.
          </p>
        </div>
        <SectorsList sectors={sectors} />
      </section>

      <ContactCta settings={settings} source="Servicios" />
    </main>
  );
}
