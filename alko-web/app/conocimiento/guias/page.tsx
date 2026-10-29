import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import ContactCta from "@/components/sections/ContactCta";
import { ROUTES } from "@/lib/site";
import { getGuides, getSettings } from "@/lib/wordpress";
import { getDbGuiasPageContent } from "@/lib/db/mysql";

export const revalidate = 60;

export const metadata = {
  title: "Guías — ALKO",
  description:
    "Guías prácticas para planificar, presupuestar y ejecutar una reforma integral con criterio técnico.",
};

export default async function GuiasPage() {
  const [pageContent, guides, settings] = await Promise.all([
    getDbGuiasPageContent(),
    getGuides(),
    getSettings(),
  ]);

  return (
    <main className="bg-white text-stone-900">
      <PageHero
        eyebrow={pageContent.headerBadge || "CONOCIMIENTO · GUÍAS"}
        title={pageContent.headerTitulo || "Guías"}
        description={pageContent.headerDescripcion || "Recorridos paso a paso por las decisiones clave de una obra: planificación, presupuesto, materiales y entrega."}
        image={pageContent.headerBgImage || guides[0]?.imagen || "/proceso-control.jpg"}
      />

      {/* Listado de Guías */}
      <section id="guias">
        <Container className="py-16 sm:py-24">
          <div className="reveal-item flex items-end justify-between pb-6 border-b border-stone-300/60">
            <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
              Índice de guías
            </span>
            <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
              {String(guides.length).padStart(2, "0")} {guides.length === 1 ? "guía" : "guías"}
            </span>
          </div>

          <div>
            {guides.map((guide) => (
              <article key={guide.id} className="reveal-item group border-b border-[#e1e1df]">
                <Link
                  href={`${ROUTES.guides}/${guide.slug}`}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 py-10 sm:py-12 lg:items-center"
                >
                  <span className="lg:col-span-2 font-mono text-xs sm:text-sm text-stone-400 group-hover:text-stone-900 tracking-wider transition-colors">
                    {guide.numero} — GUÍA
                  </span>

                  <div className="lg:col-span-6">
                    <span className="block font-mono text-[10px] sm:text-[11px] text-stone-500 uppercase tracking-widest mb-3">
                      {guide.tema}
                      {guide.lectura && ` · ${guide.lectura} de lectura`}
                    </span>
                    <h2 className="font-serif font-light text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-tight tracking-tight group-hover:text-amber-800 transition-colors duration-300">
                      {guide.title}
                    </h2>
                    {guide.descripcion && (
                      <p className="mt-4 max-w-xl text-base sm:text-lg text-stone-600 font-light leading-relaxed">
                        {guide.descripcion}
                      </p>
                    )}
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest uppercase text-stone-900 group-hover:text-amber-800 transition-colors border-b border-stone-900 group-hover:border-amber-800 pb-0.5">
                      Leer guía
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="relative overflow-hidden aspect-[4/3] bg-stone-200">
                      <Image
                        src={guide.imagen}
                        alt={guide.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <ContactCta settings={settings} />
    </main>
  );
}
