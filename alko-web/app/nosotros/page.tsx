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
import { getDbNosotrosPageContent } from "@/lib/db/mysql";

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

const VALOR_ICONS = [Handshake, CalendarClock, Wallet, BadgeCheck];

export default async function NosotrosPage() {
  const [settings, projects, sectors, fases, fabricantes, pageContent] = await Promise.all([
    getSettings(),
    getProjects(),
    getSectors(),
    getFases(),
    getFabricantes(),
    getDbNosotrosPageContent(),
  ]);

  const destacado = projects[0];
  const cifras = pageContent.cifras && pageContent.cifras.length > 0 ? pageContent.cifras : [
    { valor: "1996", etiqueta: "Construyendo y reformando en Madrid" },
    { valor: "1", etiqueta: "Interlocutor para todo el proyecto" },
    sectors.length > 0 && { valor: String(sectors.length), etiqueta: "Servicios y sectores especializados" },
    fases.length > 0 && { valor: String(fases.length), etiqueta: "Fases de control por obra" },
  ].filter(Boolean) as { valor: string; etiqueta: string }[];

  const enlaces = [
    {
      href: ROUTES.team,
      etiqueta: pageContent.enlaceEquipoEtiqueta || "Equipo",
      titulo: pageContent.enlaceEquipoTitulo || "Las personas detrás de cada obra",
      imagen: pageContent.enlaceEquipoImagen || "/proceso-entrega.jpg",
    },
    {
      href: ROUTES.careers,
      etiqueta: pageContent.enlaceEmpleoEtiqueta || "Trabaja con nosotros",
      titulo: pageContent.enlaceEmpleoTitulo || "Buscamos profesionales con criterio",
      imagen: pageContent.enlaceEmpleoImagen || "/proceso-instalaciones.jpg",
    },
  ];

  return (
    <main className="bg-white text-stone-900">
      <PageHero
        eyebrow={pageContent.headerBadge || "NOSOTROS"}
        title={
          <span className="whitespace-pre-line">
            {pageContent.headerTitulo}
          </span>
        }
        description={
          <span className="whitespace-pre-line">
            {pageContent.headerDescripcion}
          </span>
        }
        image={pageContent.headerBgImage || "/oficinas.jpg"}
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
                  {pageContent.introTag}
                </span>
              </div>
              <h2 className="mt-8 font-serif font-light text-4xl sm:text-5xl lg:text-6xl text-stone-900 leading-[1.05] tracking-tight whitespace-pre-line">
                {pageContent.introTitulo}
              </h2>
            </div>

            <div className="reveal-item lg:col-span-7 lg:pt-14" style={{ transitionDelay: "120ms" }}>
              <p className="font-serif font-light text-2xl sm:text-3xl text-stone-900 leading-snug tracking-tight whitespace-pre-line">
                {pageContent.introLead}
              </p>
              <div className="mt-10 grid grid-cols-1 gap-6 border-t border-stone-900/15 pt-10 sm:grid-cols-2">
                <p className="text-base sm:text-lg font-light text-stone-600 leading-relaxed whitespace-pre-line">
                  {pageContent.introCol1}
                </p>
                <p className="text-base sm:text-lg font-light text-stone-600 leading-relaxed whitespace-pre-line">
                  {pageContent.introCol2}
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
                key={cifra.etiqueta + i}
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

      {/* Cómo trabajamos (Pilares) */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-col gap-6 border-b border-stone-900/15 pb-10 md:flex-row md:items-end md:justify-between">
            <div className="reveal-item max-w-2xl">
              <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                {pageContent.pilaresTag}
              </span>
              <h2 className="mt-6 font-serif font-light text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-tight tracking-tight whitespace-pre-line">
                {pageContent.pilaresTitulo}
              </h2>
            </div>
            <p className="reveal-item max-w-md text-base font-light text-stone-600 leading-relaxed whitespace-pre-line">
              {pageContent.pilaresDescripcion}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {(pageContent.pilares || []).map((pilar, i) => (
              <article
                key={pilar.numero + i}
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
                <h3 className="mt-3 font-serif font-light text-2xl sm:text-3xl text-stone-900 whitespace-pre-line">
                  {pilar.titulo}
                </h3>
                <p className="mt-3 text-base font-light text-stone-600 leading-relaxed whitespace-pre-line">{pilar.texto}</p>
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
                    {pageContent.metodoTag}
                  </span>
                </div>
                <h2 className="mt-8 font-serif font-light text-4xl sm:text-5xl text-stone-900 leading-[1.05] tracking-tight whitespace-pre-line">
                  {pageContent.metodoTitulo}
                </h2>
              </div>

              <div className="reveal-item lg:col-span-7 lg:pt-4" style={{ transitionDelay: "120ms" }}>
                <p className="font-serif font-light text-2xl sm:text-3xl text-stone-900 leading-snug tracking-tight whitespace-pre-line">
                  {pageContent.metodoLead}
                </p>
                <div className="mt-10 grid grid-cols-1 gap-6 border-t border-stone-900/15 pt-10 sm:grid-cols-2">
                  <p className="text-base sm:text-lg font-light text-stone-600 leading-relaxed whitespace-pre-line">
                    {pageContent.metodoCol1}
                  </p>
                  <p className="text-base sm:text-lg font-light text-stone-600 leading-relaxed whitespace-pre-line">
                    {pageContent.metodoCol2}
                  </p>
                </div>
              </div>
            </div>

            <div className="reveal-scale relative mt-14 aspect-[16/9] w-full overflow-hidden bg-stone-200 sm:mt-20 sm:aspect-[16/7]">
              <Image
                src={pageContent.metodoImagen || "/proceso-compras.jpg"}
                alt="Compras y planificación de la obra por el equipo de ALKO"
                fill
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover object-center"
              />
            </div>
          </Container>
        </section>

        {/* Las fases del proceso */}
        <Process fases={fases} id="fases" />
      </div>

      {/* Valores */}
      <section className="bg-stone-100 py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="reveal-item lg:col-span-4">
              <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                {pageContent.valoresTag}
              </span>
              <h2 className="mt-6 font-serif font-light text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-tight tracking-tight whitespace-pre-line">
                {pageContent.valoresTitulo}
              </h2>
              <p className="mt-6 max-w-sm text-base font-light text-stone-600 leading-relaxed whitespace-pre-line">
                {pageContent.valoresDescripcion}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-px bg-stone-900/15 border border-stone-900/15 sm:grid-cols-2 lg:col-span-8">
              {(pageContent.valores || []).map((valor, i) => {
                const IconComponent = VALOR_ICONS[i % VALOR_ICONS.length];
                return (
                  <div
                    key={valor.numero + i}
                    className="reveal-item flex flex-col bg-stone-100 p-8 sm:p-10"
                    style={{ transitionDelay: `${i * 90}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <IconComponent className="h-7 w-7 text-amber-700" strokeWidth={1.25} aria-hidden="true" />
                      <span className="font-mono text-[11px] tracking-[0.2em] text-stone-500">{valor.numero}</span>
                    </div>
                    <h3 className="mt-8 font-serif font-light text-2xl sm:text-3xl text-stone-900 whitespace-pre-line">
                      {valor.titulo}
                    </h3>
                    <p className="mt-3 text-base font-light text-stone-600 leading-relaxed whitespace-pre-line">{valor.texto}</p>
                  </div>
                );
              })}
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
