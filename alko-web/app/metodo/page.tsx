import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import ContactCta from "@/components/sections/ContactCta";
import Process from "@/components/sections/Process";
import { getFases, getSettings } from "@/lib/wordpress";

export const revalidate = 60;

export const metadata = {
  title: "Método | ALKO — Cómo coordinamos cada obra en Madrid",
  description:
    "El método ALKO: una única dirección para todo el proyecto, compras anticipadas, secuencia por fases y verificación técnica. Coordinación integral de principio a fin.",
  openGraph: {
    title: "Método | ALKO",
    description:
      "Una única dirección para todo el proyecto: compras anticipadas, secuencia por fases y verificación técnica.",
    type: "website",
  },
  alternates: {
    canonical: "https://www.alko.es/metodo",
  },
};

export default async function MetodoPage() {
  const [fases, settings] = await Promise.all([getFases(), getSettings()]);

  return (
    <main className="bg-white text-stone-900">
      <PageHero
        eyebrow="MÉTODO"
        title={
          <>
            Una dirección,
            <br className="hidden sm:block" /> muchas manos
          </>
        }
        description="Un único equipo coordina construcción, instalaciones, compras y gestión técnica para mantener el proyecto bajo control de principio a fin."
        image="/proceso-coordinacion.jpg"
      />

      {/* Enfoque */}
      <section className="relative isolate w-full overflow-hidden bg-white text-stone-900">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] mx-auto hidden max-w-[1780px] grid-cols-6 px-6 sm:px-12 lg:grid lg:px-20"
        >
          <div className="h-full border-x border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1720px] px-6 py-16 sm:px-12 sm:py-24 lg:px-20">
          <div className="mb-12 grid grid-cols-1 items-start gap-8 lg:mb-16 lg:grid-cols-12 lg:gap-14">
            <div className="relative pt-1 lg:col-span-5 reveal-item">
              <span className="font-mono text-xs tracking-widest text-stone-500 uppercase">
                El método ALKO
              </span>
            </div>

            <div className="lg:col-span-7 lg:pl-10 xl:pl-16 reveal-item" style={{ transitionDelay: "120ms" }}>
              <h2 className="font-serif font-light text-3xl leading-tight sm:text-4xl lg:text-5xl">
                Coordinar antes que ejecutar
              </h2>
              <p className="mt-5 max-w-lg text-stone-600">
                Trabajamos como un solo equipo, no como departamentos aislados. Antes de empezar la
                obra definimos la secuencia, el calendario y las compras críticas para que cada
                oficio entre en el momento exacto.
              </p>
              <p className="mt-4 max-w-lg text-stone-600">
                Esa coordinación reduce interfaces, acelera decisiones y mantiene la coherencia
                técnica del proyecto. El resultado es una ejecución previsible, sin sorpresas de
                plazo ni de coste.
              </p>
            </div>
          </div>

          <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100 sm:aspect-[16/7] reveal-scale">
            <Image
              src="/proceso-coordinacion.jpg"
              alt="Coordinación de obra por el equipo de ALKO"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Las 6 fases del proceso */}
      <Process fases={fases} />

      {/* CTA final — estilo homepage */}
      <ContactCta settings={settings} />
    </main>
  );
}
