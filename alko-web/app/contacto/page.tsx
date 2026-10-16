import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import ContactCta from "@/components/sections/ContactCta";
import { getSettings } from "@/lib/wordpress";

export const revalidate = 60;

export const metadata = {
  title: "Contacto — ALKO",
  description:
    "Solicita presupuesto o consulta técnica. Una única interlocución para tu proyecto.",
};

export default async function ContactoPage() {
  const settings = await getSettings();

  return (
    <main className="bg-white text-stone-900">
      <PageHero
        eyebrow="CONTACTO"
        title="Hablemos de tu proyecto"
        description="Cuéntanos tus necesidades y te proponemos un planteamiento técnico claro, con plazos definidos y sin sorpresas."
      />
      <ContactCta settings={settings} />
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-stone-600">
          <div>
            <h2 className="font-serif text-xl text-stone-900">ALKO Madrid</h2>
            <p className="mt-2">{settings.direccion}</p>
            <a className="mt-2 block" href={`tel:${settings.telefono.replace(/[^+\d]/g, "")}`}>
              {settings.telefono}
            </a>
            <a className="mt-2 block" href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
          </div>
          <div>
            <h2 className="font-serif text-xl text-stone-900">Horario</h2>
            <p className="mt-2">{settings.horario}</p>
          </div>
        </div>
      </Container>
    </main>
  );
}
