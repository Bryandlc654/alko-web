import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import { getSettings } from "@/lib/wordpress";

export const revalidate = 60;

export const metadata = {
  title: "Trabaja con nosotros | ALKO — Empleo en construcción en Madrid",
  description:
    "Únete al equipo de ALKO. Buscamos jefatura de obra, arquitectura técnica, instalaciones y compras para proyectos de construcción y reforma integral en Madrid.",
  openGraph: {
    title: "Trabaja con nosotros | ALKO",
    description:
      "Un equipo sin compartimentos, con criterio técnico y dirección única. Descubre las posiciones abiertas.",
    type: "website",
  },
  alternates: {
    canonical: "https://www.alko.es/trabaja-con-nosotros",
  },
};

const posiciones = [
  {
    titulo: "Jefatura de obra",
    departamento: "Ejecución",
    ubicacion: "Madrid",
    tipo: "Jornada completa",
    resumen:
      "Planificación y coordinación de oficios en obra, control de plazo y calidad por fase.",
  },
  {
    titulo: "Arquitectura técnica",
    departamento: "Proyecto",
    ubicacion: "Madrid",
    tipo: "Jornada completa",
    resumen:
      "Desarrollo de documentación, mediciones, detalles constructivos y seguimiento técnico.",
  },
  {
    titulo: "Ingeniería de instalaciones",
    departamento: "Instalaciones",
    ubicacion: "Madrid",
    tipo: "Jornada completa",
    resumen:
      "Diseño y coordinación de climatización, ventilación, saneamiento y redes de datos.",
  },
  {
    titulo: "Compras y aprovisionamiento",
    departamento: "Compras",
    ubicacion: "Madrid",
    tipo: "Jornada completa",
    resumen:
      "Gestión de proveedores, compras críticas anticipadas y control de suministros en obra.",
  },
];

export default async function TrabajaConNosotrosPage() {
  const settings = await getSettings();

  const candidaturaHref = (puesto?: string) => {
    const subject = puesto ? `Candidatura — ${puesto}` : "Candidatura espontánea ALKO";
    return `mailto:${settings.email}?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <main className="bg-white text-stone-900">
      <PageHero
        eyebrow="TRABAJA CON NOSOTROS"
        title={
          <>
            Construimos
            <br className="hidden sm:block" /> con las personas
          </>
        }
        description="Buscamos profesionales que compartan nuestro criterio técnico y quieran crecer dentro de un equipo que trabaja como una dirección única."
        image="/proceso-control.jpg"
      />

      {/* Cultura */}
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
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-14">
            <div className="relative pt-1 lg:col-span-5 reveal-item">
              <span className="font-mono text-xs tracking-widest text-stone-500 uppercase">
                El equipo ALKO
              </span>
            </div>

            <div
              className="lg:col-span-7 lg:pl-10 xl:pl-16 reveal-item"
              style={{ transitionDelay: "120ms" }}
            >
              <h2 className="font-serif font-light text-3xl leading-tight sm:text-4xl lg:text-5xl">
                Un equipo pequeño, con criterio y sin intermediarios
              </h2>
              <p className="mt-5 max-w-lg text-stone-600">
                En ALKO cada persona tiene responsabilidad real sobre el proyecto. Trabajamos cerca de
                la obra, con decisiones rápidas y una única dirección técnica.
              </p>
              <p className="mt-4 max-w-lg text-stone-600">
                Buscamos perfiles con oficio y ambición de crecer: gente que disfrute resolviendo
                problemas constructivos y cuidando el detalle hasta la entrega.
              </p>
            </div>
          </div>

          <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden bg-stone-100 sm:aspect-[16/7] reveal-scale">
            <Image
              src="/proceso-construccion.jpg"
              alt="Equipo de obra de ALKO trabajando en un proyecto"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Posiciones abiertas */}
      <section className="border-t border-stone-200 bg-stone-50 py-16 sm:py-24">
        <Container>
          <div className="flex flex-col justify-between gap-8 border-b border-stone-300/70 pb-10 lg:flex-row lg:items-end">
            <div className="reveal-item">
              <span className="font-mono text-xs tracking-widest text-stone-500 uppercase">
                POSICIONES ABIERTAS
              </span>
              <h2 className="mt-3 font-serif font-light text-3xl leading-tight sm:text-4xl lg:text-5xl">
                Únete al equipo
              </h2>
            </div>
            <p className="max-w-sm text-sm text-stone-600">
              Envíanos tu candidatura por correo. Valoramos perfiles técnicos con experiencia en obra.
            </p>
          </div>

          <ul className="mt-4 divide-y divide-stone-200 border-b border-stone-200">
            {posiciones.map((p, i) => (
              <li key={p.titulo} className="reveal-item" style={{ transitionDelay: `${i * 80}ms` }}>
                <a
                  href={candidaturaHref(p.titulo)}
                  className="group flex flex-col gap-4 py-7 transition-colors hover:bg-white/60 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-4"
                >
                  <div className="min-w-0">
                    <h3 className="font-serif font-light text-2xl leading-snug sm:text-3xl">
                      {p.titulo}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm text-stone-600">{p.resumen}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    <span className="font-mono">{p.departamento}</span>
                    <span className="text-stone-300">•</span>
                    <span className="font-mono">{p.ubicacion}</span>
                    <span className="hidden text-stone-300 sm:inline">•</span>
                    <span className="hidden font-mono sm:inline">{p.tipo}</span>
                    <span className="ml-1 inline-flex items-center gap-1.5 font-semibold text-stone-900 transition-colors group-hover:text-amber-800">
                      <span>APLICAR</span>
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                        strokeWidth={1.75}
                      />
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* CTA final */}
      <section className="relative w-full overflow-hidden bg-stone-950 group">
        <div className="relative h-[440px] w-full overflow-hidden sm:h-[500px] md:h-[560px]">
          <Image
            src="/cta-bg.jpg"
            alt="Trabaja con ALKO"
            fill
            sizes="100vw"
            className="pointer-events-none select-none object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-[1.01]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent" />
          <div className="absolute inset-0 z-10 mx-auto flex max-w-7xl flex-col justify-between px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-24">
            <div className="pt-8 sm:pt-14">
              <h2 className="text-3xl font-light leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-[68px]">
                ¿No encuentras tu
                <br />
                <span className="font-serif italic font-normal">puesto</span> ideal
                <span className="font-sans">?</span>
              </h2>
            </div>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-xl">
                <p className="text-sm leading-relaxed text-stone-200/85 sm:text-base">
                  Envíanos una candidatura espontánea. Nos interesa conocer perfiles con criterio
                  técnico, aunque no haya una posición abierta.
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href={candidaturaHref()}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-amber-700 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-amber-800 active:scale-95 sm:py-4 sm:text-xs"
                >
                  <span>ENVIAR CANDIDATURA</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
