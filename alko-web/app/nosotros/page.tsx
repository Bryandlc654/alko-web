import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CalendarClock, Handshake, Wallet } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import { ROUTES } from "@/lib/site";
import { getSettings } from "@/lib/wordpress";

export const revalidate = 60;

export const metadata = {
  title: "Nosotros | ALKO — Construcción y reformas integrales en Madrid",
  description:
    "ALKO: construcción, rehabilitación y reformas integrales en Madrid. Un único interlocutor, ejecución controlada y criterio constructivo.",
  openGraph: {
    title: "Nosotros | ALKO",
    description: "Un único interlocutor, ejecución controlada y criterio constructivo.",
    type: "website",
  },
  alternates: {
    canonical: "https://www.alko.es/nosotros",
  },
};

const valores = [
  {
    numero: "01",
    titulo: "UN INTERLOCUTOR",
    texto: "Todo bajo una sola dirección técnica.",
    Icon: Handshake,
  },
  {
    numero: "02",
    titulo: "PLAZOS CONTROLADOS",
    texto: "Seguimiento con hitos claros.",
    Icon: CalendarClock,
  },
  {
    numero: "03",
    titulo: "COSTES PREVISIBLES",
    texto: "Partidas definidas, menos imprevistos.",
    Icon: Wallet,
  },
  {
    numero: "04",
    titulo: "CALIDAD VERIFICADA",
    texto: "Control por fase hasta la entrega.",
    Icon: BadgeCheck,
  },
];

export default async function NosotrosPage() {
  const settings = await getSettings();
  const telHref = `tel:${settings.telefono.replace(/[^+\d]/g, "")}`;
  const mailto = `mailto:${settings.email}?subject=Nueva%20Consulta%20Tecnica%20ALKO`;
  const waHref = `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    "Hola ALKO, quiero información sobre un proyecto.",
  )}`;

  return (
    <main className="bg-white text-stone-900">
      <PageHero
        eyebrow="NOSOTROS"
        title={
          <>
            Arquitectura.
            <br className="hidden sm:block" />
            Construcción.
            <br className="hidden sm:block" />
            Dirección integrada.
          </>
        }
        description="Estudio de construcción y reformas integrales en Madrid. Menos interfaces, más control."
        image="/oficinas.jpg"
      />

      {/* Manifiesto */}
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
          {/* Fila superior */}
          <div className="mb-12 grid grid-cols-1 items-start gap-8 lg:mb-16 lg:grid-cols-12 lg:gap-14">
            <div className="relative pt-1 lg:col-span-5 reveal-item">
              <span className="font-mono text-xs tracking-widest text-stone-500 uppercase">
                Sobre ALKO
              </span>
              <div className="absolute -right-7 top-16 hidden translate-x-1/2 items-center justify-center lg:flex">
                <div className="flex h-5 w-5 items-center justify-center rounded-full border border-amber-700 bg-white/80">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                </div>
              </div>
            </div>

            <div
              className="flex flex-col items-start lg:col-span-7 lg:pl-10 xl:pl-16 reveal-item"
              style={{ transitionDelay: "120ms" }}
            >
              <p className="mb-3 w-full text-right font-mono text-xs uppercase tracking-widest text-stone-500">
                Desde 1996
              </p>
              <h2 className="font-serif font-light text-3xl leading-tight sm:text-4xl lg:text-5xl">
                Un criterio único para cada obra
              </h2>
              <p className="mt-5 max-w-lg text-stone-600">
                Coordinamos proyecto, compras, instalaciones y acabados. Un solo responsable desde la
                primera toma de contacto hasta la entrega.
              </p>
              <div className="mt-8">
                <Link
                  href={ROUTES.projects}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] border-b border-stone-900 pb-1.5 hover:text-amber-800 hover:border-amber-800 transition"
                >
                  VER PROYECTOS →
                </Link>
              </div>
            </div>
          </div>

          {/* Rejilla principal */}
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="flex flex-col space-y-12 lg:col-span-6 lg:space-y-16">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100 reveal-scale">
                <Image
                  src="/el-viso.jpg"
                  alt="Obra de reforma integral ejecutada por ALKO"
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>

              <div className="w-full max-w-md reveal-item" style={{ transitionDelay: "150ms" }}>
                <h3 className="font-serif font-light text-2xl leading-tight sm:text-3xl">
                  Construimos y reformamos espacios en los que querrías vivir.
                </h3>
                <p className="mt-5 max-w-sm text-stone-600">
                  Reformas integrales, obra nueva y adecuaciones con un único responsable: del
                  proyecto a la entrega, sin intermediarios ni imprevistos.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <Link
                    href={ROUTES.contact}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold tracking-[0.18em] uppercase transition"
                  >
                    HABLAR CON ALKO
                  </Link>
                  <Link
                    href={ROUTES.team}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] border-b border-stone-900 pb-1.5 hover:text-amber-800 hover:border-amber-800 transition"
                  >
                    CONOCE AL EQUIPO →
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-10 lg:col-span-6 lg:space-y-12">
              <div
                className="relative aspect-[16/11] w-full overflow-hidden bg-stone-100 reveal-scale"
                style={{ transitionDelay: "150ms" }}
              >
                <Image
                  src="/proceso-coordinacion.jpg"
                  alt="Coordinación de obra por el equipo de ALKO"
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-[28%] right-[34%] translate-x-1/2"
                >
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border border-amber-700 bg-white/80">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                  </div>
                </div>
              </div>

              <div
                className="relative ml-auto aspect-[4/5] w-full overflow-hidden bg-stone-100 lg:w-[94%] reveal-scale"
                style={{ transitionDelay: "300ms" }}
              >
                <Image
                  src="/proceso-construccion.jpg"
                  alt="Ejecución de obra por el equipo de ALKO"
                  fill
                  sizes="(max-width:1024px) 100vw, 48vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores minimal */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-stone-300/70">
            <div className="reveal-item">
              <span className="font-mono text-xs tracking-widest text-stone-500 uppercase">
                VALORES
              </span>
              <h2 className="mt-3 font-serif font-light text-3xl sm:text-4xl lg:text-5xl leading-tight">
                Lo que marca la diferencia
              </h2>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {valores.map((v, i) => (
              <div
                key={v.numero}
                className="reveal-item border-b border-stone-200 pb-6"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <v.Icon className="h-6 w-6 text-amber-700" strokeWidth={1.25} aria-hidden="true" />
                <span className="mt-4 block font-mono text-xs text-stone-500">{v.numero} —</span>
                <h3 className="mt-2 font-serif text-xl sm:text-2xl">{v.titulo}</h3>
                <p className="mt-1 text-sm text-stone-600">{v.texto}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA final — estilo homepage */}
      <section className="relative w-full overflow-hidden bg-stone-950 group">
        <div className="relative h-[520px] w-full overflow-hidden sm:h-[580px] md:h-[640px] lg:h-[700px]">
          <Image
            src="/cta-bg.jpg"
            alt="Cuéntanos tu proyecto"
            fill
            sizes="100vw"
            className="pointer-events-none select-none object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-[1.01]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent" />
          <div className="absolute inset-0 z-10 mx-auto flex max-w-7xl flex-col justify-between px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-24">
            <div className="pt-8 sm:pt-14">
              <h2 className="text-3xl font-light leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-[68px]">
                Hablemos de tu
                <br />
                <span className="font-serif italic font-normal">próximo</span> proyecto
                <span className="font-sans">.</span>
              </h2>
            </div>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-xl space-y-5">
                <p className="max-w-lg text-base font-light leading-relaxed text-stone-200/90 sm:text-lg">
                  Una única conversación para ordenar alcance, plazos y presupuesto. Sin compromiso.
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 pt-1 text-xs font-light text-white">
                  <a
                    href={telHref}
                    className="inline-flex items-center gap-2 transition-colors hover:text-white"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/70">
                      TEL
                    </span>
                    <span className="tracking-wide">{settings.telefono}</span>
                  </a>
                  <span className="hidden text-white/40 sm:inline">•</span>
                  <a
                    href={mailto}
                    className="inline-flex items-center gap-2 transition-colors hover:text-white"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/70">
                      ESCRÍBENOS
                    </span>
                    <span className="underline decoration-white/50 underline-offset-4 hover:decoration-white">
                      {settings.email}
                    </span>
                  </a>
                  <span className="hidden text-white/40 sm:inline">•</span>
                  <div className="inline-flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/70">
                      VISÍTANOS
                    </span>
                    <span>{settings.direccion}</span>
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                <a
                  href={mailto}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-amber-700 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-amber-800 active:scale-95 sm:py-4 sm:text-xs"
                >
                  <span>SOLICITAR CONSULTORÍA</span>
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
