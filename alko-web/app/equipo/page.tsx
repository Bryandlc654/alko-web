import Image from "next/image";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import { getSettings } from "@/lib/wordpress";
import { SITE } from "@/lib/site";

export const revalidate = 60;

export const metadata = {
  title: "Equipo | ALKO — Personas detrás de cada obra en Madrid",
  description:
    "Conoce al equipo de ALKO: dirección técnica, arquitectura, jefatura de obra, instalaciones y atención al cliente. Un equipo multidisciplinar detrás de cada proyecto.",
  openGraph: {
    title: "Equipo | ALKO",
    description:
      "Dirección técnica, arquitectura, jefatura de obra, instalaciones y atención al cliente bajo un mismo criterio.",
    type: "website",
  },
  alternates: {
    canonical: "https://www.alko.es/equipo",
  },
};

const equipo = [
  {
    nombre: "Alejandro Kort",
    rol: "Dirección técnica",
    foto: "/oficinas.jpg",
  },
  {
    nombre: "Marta Ruiz",
    rol: "Arquitectura",
    foto: "/start-research-1.jpg",
  },
  {
    nombre: "Javier Ortega",
    rol: "Jefatura de obra",
    foto: "/proceso-construccion.jpg",
  },
  {
    nombre: "Laura Méndez",
    rol: "Instalaciones",
    foto: "/proceso-instalaciones.jpg",
  },
  {
    nombre: "Diego Salas",
    rol: "Compras y materiales",
    foto: "/proceso-compras.jpg",
  },
  {
    nombre: "Elena Castro",
    rol: "Atención al cliente",
    foto: "/proceso-entrega.jpg",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.legalName,
  url: SITE.url,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Madrid",
    addressCountry: "ES",
  },
  employee: equipo.map((m) => ({
    "@type": "Person",
    name: m.nombre,
    jobTitle: m.rol,
    worksFor: { "@type": "Organization", name: SITE.name },
  })),
};

export default async function EquipoPage() {
  const settings = await getSettings();

  return (
    <main className="bg-white text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="EQUIPO"
        title={
          <>
            Personas
            <br className="hidden sm:block" /> detrás de cada obra
          </>
        }
        description="Un equipo multidisciplinar que comparte un mismo criterio constructivo. Dirección técnica, arquitectura, obra, instalaciones y atención al cliente."
        image="/oficinas.jpg"
      />

      {/* QUIÉNES SOMOS */}
      <section className="w-full overflow-hidden bg-stone-100">
        <div className="relative h-[380px] w-full sm:h-[460px] md:h-[540px] lg:h-[620px]">
          <Image
            src="/90dias.jpg"
            alt="Interior de un proyecto de ALKO"
            fill
            sizes="100vw"
            className="select-none object-cover object-top"
          />
        </div>
      </section>

      <section className="flex w-full flex-col items-center bg-[#faf9f5] px-6 pb-28 pt-16 text-center md:pb-36 md:pt-24">
        <h2 className="mx-auto max-w-4xl text-5xl font-normal leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          Menos compartimentos. Más equipo.
        </h2>
        <div aria-hidden="true" className="my-10 flex w-full justify-center md:my-12">
          <div className="h-14 w-[1px] bg-[#d2d1cb] md:h-16" />
        </div>
        <p className="mx-auto max-w-xl px-4 text-[13px] leading-relaxed text-[#4a4a48] sm:text-[14px] md:max-w-2xl md:text-[15px]">
          Trabajamos como un solo equipo, no como departamentos aislados. Eso reduce interfaces,
          acelera decisiones y mantiene la coherencia del proyecto de principio a fin.
        </p>
      </section>

      {/* Grid del equipo */}
      <section className="relative isolate py-14 sm:py-20 lg:py-24 bg-[#F6F5F2] text-[#141414] border-y border-[#E5E3DC] overflow-hidden">
        <div
          aria-hidden="true"
          className="hidden md:grid absolute inset-0 pointer-events-none grid-cols-[14%_36%_38%_12%]"
        >
          <div className="h-full border-r border-[rgba(215,212,204,0.45)]" />
          <div className="h-full border-r border-[rgba(215,212,204,0.45)]" />
          <div className="h-full border-r border-[rgba(215,212,204,0.45)]" />
          <div />
        </div>

        <Container>
          <div className="flex items-center gap-2 pb-6 text-sm text-[#403E3B] sm:pb-8 reveal-item">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#403E3B]" />
            <span>Nuestro equipo</span>
          </div>

          <div className="max-w-4xl pt-1 md:pt-4 reveal-item">
            <h2 className="text-5xl font-normal leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              Nuestros profesionales
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-[#302F2C] sm:mt-6 sm:text-base">
              Perfiles que comparten un mismo criterio constructivo y una sola dirección de obra.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 xl:gap-8">
            {equipo.map((m, i) => (
              <article
                key={m.nombre}
                className="flex flex-col reveal-item"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-200">
                  <Image
                    src={m.foto}
                    alt={`${m.nombre}, ${m.rol}`}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                    className="object-cover object-center grayscale transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>
                <div className="pt-4">
                  <h3 className="text-xl font-normal tracking-tight">{m.nombre}</h3>
                  <p className="mt-0.5 text-sm text-[#686663]">{m.rol}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA final */}
      <section className="bg-stone-950 text-white">
        <div className="group relative w-full overflow-hidden">
          <div className="relative h-[440px] w-full overflow-hidden sm:h-[500px] md:h-[560px]">
            <Image
              src="/cta-bg.jpg"
              alt="Hablemos de tu próximo proyecto"
              fill
              sizes="100vw"
              className="pointer-events-none select-none object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-[1.01]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent" />
            <div className="absolute inset-0 z-10 mx-auto flex max-w-7xl flex-col justify-between px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-24">
              <div className="pt-8 sm:pt-14">
                <h2 className="text-3xl font-light leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[68px]">
                  ¿Sumamos tu proyecto al equipo?
                </h2>
              </div>
              <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                <div className="max-w-xl">
                  <p className="text-sm leading-relaxed text-stone-200/85 sm:text-base">
                    Cuéntanos qué necesitas y te ponemos en contacto con la persona adecuada.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                    <a
                      href={`tel:${settings.telefono.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-2 transition-colors hover:text-white"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-wider text-white/70">
                        TEL
                      </span>
                      <span className="tracking-wide">{settings.telefono}</span>
                    </a>
                    <span className="hidden text-white/40 sm:inline">•</span>
                    <a
                      href={`mailto:${settings.email}`}
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
                    href={`mailto:${settings.email}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-amber-700 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-amber-800 active:scale-95 sm:py-4 sm:text-xs"
                  >
                    <span>SOLICITAR CONSULTORÍA</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
