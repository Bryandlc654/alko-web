import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CalendarClock, Handshake, Wallet } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import ContactCta from "@/components/sections/ContactCta";
import Materials from "@/components/sections/Materials";
import Process from "@/components/sections/Process";
import { METHOD_HREF, ROUTES } from "@/lib/site";
import { getFabricantes, getFases, getProjects, getSectors, getSettings } from "@/lib/wordpress";

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

const pilares = [
  {
    numero: "01",
    titulo: "Arquitectura",
    texto:
      "Partimos del proyecto y de su viabilidad técnica: mediciones, soluciones constructivas y materiales definidos antes de empezar la obra.",
    imagen: "/proceso-control.jpg",
  },
  {
    numero: "02",
    titulo: "Construcción",
    texto:
      "Ejecutamos la obra civil, las instalaciones y los acabados con una secuencia por fases y control de tolerancias en cada partida.",
    imagen: "/proceso-construccion.jpg",
  },
  {
    numero: "03",
    titulo: "Dirección integrada",
    texto:
      "Un mismo equipo coordina compras, gremios y plazos, de modo que proyecto y obra responden a una sola dirección técnica.",
    imagen: "/proceso-coordinacion.jpg",
  },
];

const valores = [
  {
    numero: "01",
    titulo: "Un interlocutor",
    texto:
      "Una sola dirección técnica responde de proyecto, compras, gremios y obra. Sin intermediarios ni versiones contradictorias.",
    Icon: Handshake,
  },
  {
    numero: "02",
    titulo: "Plazos controlados",
    texto: "Planificación por fases con hitos claros y seguimiento continuo del avance de la obra.",
    Icon: CalendarClock,
  },
  {
    numero: "03",
    titulo: "Costes previsibles",
    texto: "Partidas definidas desde el presupuesto y compras anticipadas para reducir imprevistos.",
    Icon: Wallet,
  },
  {
    numero: "04",
    titulo: "Calidad verificada",
    texto: "Control técnico en cada fase, pruebas y revisión de acabados hasta la entrega.",
    Icon: BadgeCheck,
  },
];

export default async function NosotrosPage() {
  const [settings, projects, sectors, fases, fabricantes] = await Promise.all([
    getSettings(),
    getProjects(),
    getSectors(),
    getFases(),
    getFabricantes(),
  ]);

  const destacado = projects[0];
  const cifras = [
    { valor: "1996", etiqueta: "Construyendo y reformando en Madrid" },
    { valor: "1", etiqueta: "Interlocutor para todo el proyecto" },
    sectors.length > 0 && { valor: String(sectors.length), etiqueta: "Servicios y sectores especializados" },
    fases.length > 0 && { valor: String(fases.length), etiqueta: "Fases de control por obra" },
  ].filter(Boolean) as { valor: string; etiqueta: string }[];

  const enlaces = [
    {
      href: ROUTES.team,
      etiqueta: "Equipo",
      titulo: "Las personas detrás de cada obra",
      imagen: "/proceso-entrega.jpg",
    },
    {
      href: ROUTES.careers,
      etiqueta: "Trabaja con nosotros",
      titulo: "Buscamos profesionales con criterio",
      imagen: "/proceso-instalaciones.jpg",
    },
  ];

  return (
    <main className="bg-white text-stone-900">
      <PageHero
        eyebrow="NOSOTROS"
        title={
          <>
            Arquitectura.
            <br className="hidden sm:block" /> Construcción.
            <br className="hidden sm:block" /> Dirección integrada.
          </>
        }
        description="Estudio de construcción y reformas integrales en Madrid. Menos interfaces, más control."
        image="/oficinas.jpg"
      />

      {/* Introducción */}
      <section className="relative isolate overflow-clip">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 mx-auto hidden max-w-7xl grid-cols-6 px-6 sm:px-10 lg:grid lg:px-12"
        >
          <div className="h-full border-x border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
        </div>

        <Container className="py-20 sm:py-28 lg:py-32">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="reveal-item lg:col-span-5">
              <div className="flex items-center gap-4">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                </span>
                <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                  Sobre ALKO · Desde 1996
                </span>
              </div>
              <h2 className="mt-8 font-serif font-light text-4xl sm:text-5xl lg:text-6xl text-stone-900 leading-[1.05] tracking-tight">
                Un criterio único para cada obra.
              </h2>
            </div>

            <div className="reveal-item lg:col-span-7 lg:pt-14" style={{ transitionDelay: "120ms" }}>
              <p className="font-serif font-light text-2xl sm:text-3xl text-stone-900 leading-snug tracking-tight">
                Construimos y reformamos espacios en los que querrías vivir y trabajar, con un único
                responsable desde la primera visita hasta la entrega.
              </p>
              <div className="mt-10 grid grid-cols-1 gap-6 border-t border-stone-900/15 pt-10 sm:grid-cols-2">
                <p className="text-base sm:text-lg font-light text-stone-600 leading-relaxed">
                  Coordinamos proyecto, compras, instalaciones y acabados bajo una misma dirección
                  técnica. Así cada decisión se toma con toda la obra a la vista.
                </p>
                <p className="text-base sm:text-lg font-light text-stone-600 leading-relaxed">
                  Reformas integrales, obra nueva y adecuaciones de viviendas, oficinas y espacios
                  comerciales, sin intermediarios ni imprevistos.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href={ROUTES.projects}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-700 px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-amber-800"
                >
                  Ver proyectos
                </Link>
                <Link
                  href={METHOD_HREF}
                  className="group inline-flex items-center gap-2 border-b border-stone-900 pb-1.5 text-xs font-semibold uppercase tracking-[0.22em] transition hover:border-amber-700 hover:text-amber-700"
                >
                  Conoce el método
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Imagen de un proyecto real */}
      {destacado && (
        <section className="relative">
          <Link
            href={`${ROUTES.projects}/${destacado.slug}`}
            className="group relative block aspect-[4/3] w-full overflow-hidden bg-stone-950 sm:aspect-[16/9] lg:aspect-[21/9]"
            data-parallax="8"
          >
            <Image
              src={destacado.imagen}
              alt={destacado.title}
              fill
              sizes="100vw"
              className="object-cover object-center transition duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-stone-950/80 to-transparent" />
            <Container className="absolute inset-x-0 bottom-0 pb-8 sm:pb-12 text-white">
              <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-white/70">
                Proyecto · {[destacado.tipologia, destacado.anio].filter(Boolean).join(" · ")}
              </span>
              <span className="mt-3 flex items-center gap-3 font-serif font-light text-2xl sm:text-4xl tracking-tight">
                {destacado.title}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Container>
          </Link>
        </section>
      )}

      {/* Cifras */}
      <section aria-label="ALKO en cifras" className="bg-stone-950 text-white">
        <Container className="py-16 sm:py-20">
          <dl
            className={`grid grid-cols-2 gap-x-6 gap-y-10 ${cifras.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}
          >
            {cifras.map((cifra, i) => (
              <div
                key={cifra.etiqueta}
                className="reveal-item flex flex-col-reverse justify-end border-t border-white/20 pt-6"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <dt className="mt-4 max-w-[14rem] text-sm sm:text-base font-light text-white/70 leading-snug">
                  {cifra.etiqueta}
                </dt>
                <dd className="font-serif font-light text-5xl sm:text-6xl lg:text-7xl tracking-tight text-amber-500 leading-none">
                  {cifra.valor}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Cómo trabajamos */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-col gap-6 border-b border-stone-900/15 pb-10 md:flex-row md:items-end md:justify-between">
            <div className="reveal-item max-w-2xl">
              <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                Cómo trabajamos
              </span>
              <h2 className="mt-6 font-serif font-light text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-tight tracking-tight">
                Tres disciplinas, una sola dirección.
              </h2>
            </div>
            <p className="reveal-item max-w-md text-base font-light text-stone-600 leading-relaxed">
              Lo que en otras obras son tres empresas distintas, en ALKO es un mismo equipo que responde
              de principio a fin.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {pilares.map((pilar, i) => (
              <article
                key={pilar.numero}
                className="reveal-item"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-200">
                  <Image
                    src={pilar.imagen}
                    alt={pilar.titulo}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center"
                  />
                </div>
                <span className="mt-6 block font-mono text-[11px] tracking-[0.2em] text-amber-700">
                  {pilar.numero}
                </span>
                <h3 className="mt-3 font-serif font-light text-2xl sm:text-3xl text-stone-900">
                  {pilar.titulo}
                </h3>
                <p className="mt-3 text-base font-light text-stone-600 leading-relaxed">{pilar.texto}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Método ALKO */}
      <div id="metodo">
        <section className="relative isolate overflow-clip border-t border-stone-300">
          <Container className="py-20 sm:py-28">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="reveal-item lg:col-span-5">
                <div className="flex items-center gap-4">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                  </span>
                  <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                    El método ALKO
                  </span>
                </div>
                <h2 className="mt-8 font-serif font-light text-4xl sm:text-5xl text-stone-900 leading-[1.05] tracking-tight">
                  Una dirección, muchas manos.
                </h2>
              </div>

              <div className="reveal-item lg:col-span-7 lg:pt-4" style={{ transitionDelay: "120ms" }}>
                <p className="font-serif font-light text-2xl sm:text-3xl text-stone-900 leading-snug tracking-tight">
                  Coordinar antes que ejecutar: un único equipo mantiene construcción, instalaciones,
                  compras y gestión técnica bajo control de principio a fin.
                </p>
                <div className="mt-10 grid grid-cols-1 gap-6 border-t border-stone-900/15 pt-10 sm:grid-cols-2">
                  <p className="text-base sm:text-lg font-light text-stone-600 leading-relaxed">
                    Trabajamos como un solo equipo, no como departamentos aislados. Antes de empezar la
                    obra definimos la secuencia, el calendario y las compras críticas para que cada
                    oficio entre en el momento exacto.
                  </p>
                  <p className="text-base sm:text-lg font-light text-stone-600 leading-relaxed">
                    Esa coordinación reduce interfaces, acelera decisiones y mantiene la coherencia
                    técnica del proyecto. El resultado es una ejecución previsible, sin sorpresas de plazo
                    ni de coste.
                  </p>
                </div>
              </div>
            </div>

            <div className="reveal-scale relative mt-14 aspect-[16/9] w-full overflow-hidden bg-stone-200 sm:mt-20 sm:aspect-[16/7]">
              <Image
                src="/proceso-compras.jpg"
                alt="Compras y planificación de la obra por el equipo de ALKO"
                fill
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover object-center"
              />
            </div>
          </Container>
        </section>

        {/* Las fases del proceso (id propio: "metodo" es el de este contenedor) */}
        <Process fases={fases} id="fases" />
      </div>

      {/* Valores */}
      <section className="bg-stone-100 py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="reveal-item lg:col-span-4">
              <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                Valores
              </span>
              <h2 className="mt-6 font-serif font-light text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-tight tracking-tight">
                Lo que marca la diferencia.
              </h2>
              <p className="mt-6 max-w-sm text-base font-light text-stone-600 leading-relaxed">
                Cuatro compromisos que aplicamos igual en una vivienda que en una sede corporativa.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-px bg-stone-900/15 border border-stone-900/15 sm:grid-cols-2 lg:col-span-8">
              {valores.map((valor, i) => (
                <div
                  key={valor.numero}
                  className="reveal-item flex flex-col bg-stone-100 p-8 sm:p-10"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <valor.Icon className="h-7 w-7 text-amber-700" strokeWidth={1.25} aria-hidden="true" />
                    <span className="font-mono text-[11px] tracking-[0.2em] text-stone-500">{valor.numero}</span>
                  </div>
                  <h3 className="mt-8 font-serif font-light text-2xl sm:text-3xl text-stone-900">
                    {valor.titulo}
                  </h3>
                  <p className="mt-3 text-base font-light text-stone-600 leading-relaxed">{valor.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Fabricantes */}
      {fabricantes.length > 0 && <Materials fabricantes={fabricantes} />}

      {/* Equipo y empleo */}
      <section className="border-t border-stone-300">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {enlaces.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className="group relative isolate flex min-h-[320px] items-end overflow-hidden bg-stone-950 p-6 text-white sm:min-h-[380px] sm:p-10 lg:p-12"
            >
              <Image
                src={enlace.imagen}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="-z-10 object-cover object-center opacity-60 transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-75"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />
              <div>
                <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-white/70">
                  {enlace.etiqueta}
                </span>
                <span className="mt-3 flex items-center gap-3 font-serif font-light text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight">
                  {enlace.titulo}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ContactCta settings={settings} />
    </main>
  );
}
