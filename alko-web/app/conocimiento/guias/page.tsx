import Image from "next/image";
import Link from "next/link";
import { Download, FileText } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import ContactCta from "@/components/sections/ContactCta";
import { ROUTES } from "@/lib/site";
import { getDescargas, getGuides, getNews, getSettings } from "@/lib/wordpress";
import { getDbGuiasPageContent } from "@/lib/db/mysql";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export const metadata = {
  title: "Guías — ALKO",
  description:
    "Guías prácticas para planificar, presupuestar y ejecutar una reforma integral con criterio técnico, con documentos descargables y novedades de ALKO.",
};

export default async function GuiasPage() {
  const [pageContent, guides, descargas, news, settings] = await Promise.all([
    getDbGuiasPageContent(),
    getGuides(),
    getDescargas(),
    getNews(4),
    getSettings(),
  ]);

  const guideTitle = new Map(guides.map((guide) => [guide.slug, guide.title]));
  const [featured, ...others] = news;

  // Barra de anclas: solo las secciones que tienen contenido.
  const anchors = [
    { id: "guias", label: "Guías" },
    descargas.length > 0 && { id: "descargas", label: "Descargas" },
    news.length > 0 && { id: "actualidad", label: "Actualidad" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <main className="bg-white text-stone-900">
      <PageHero
        eyebrow={pageContent.headerBadge || "CONOCIMIENTO · GUÍAS"}
        title={pageContent.headerTitulo || "Guías"}
        description={pageContent.headerDescripcion || "Recorridos paso a paso por las decisiones clave de una obra: planificación, presupuesto, materiales y entrega."}
        image={pageContent.headerBgImage || guides[0]?.imagen || "/proceso-control.jpg"}
      >
        {anchors.length > 1 && (
          <nav aria-label="En esta página" className="mt-10 flex flex-wrap gap-3">
            {anchors.map((anchor) => (
              <a
                key={anchor.id}
                href={`#${anchor.id}`}
                className="inline-flex items-center rounded-full border border-white/40 bg-stone-950/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md transition hover:bg-white/15"
              >
                {anchor.label}
              </a>
            ))}
          </nav>
        )}
      </PageHero>

      {/* Guías */}
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

      {/* Descargas */}
      {descargas.length > 0 && (
        <section id="descargas" className="bg-stone-100 py-20 sm:py-28">
          <Container>
            <div className="reveal-item flex flex-col gap-6 border-b border-stone-900/15 pb-10 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                  Descargas
                </span>
                <h2 className="mt-6 font-serif font-light text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-tight tracking-tight">
                  Documentos para tu obra.
                </h2>
              </div>
              <p className="max-w-md text-base font-light text-stone-600 leading-relaxed">
                Recursos en PDF que acompañan a cada guía. Descárgalos, imprímelos y márcalos a medida que avances.
              </p>
            </div>

            <ul className="mt-12 grid grid-cols-1 gap-px border border-stone-900/15 bg-stone-900/15 md:grid-cols-3">
              {descargas.map((descarga, i) => {
                const guia = guideTitle.get(descarga.guia);
                const externo = /^https?:\/\//i.test(descarga.archivo);
                return (
                  <li
                    key={descarga.id}
                    className="reveal-item flex flex-col bg-stone-100 p-8 sm:p-10"
                    style={{ transitionDelay: `${i * 90}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <FileText className="h-8 w-8 text-amber-700" strokeWidth={1.25} aria-hidden="true" />
                      <span className="font-mono text-[11px] tracking-[0.2em] text-stone-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-8 font-serif font-light text-2xl sm:text-3xl text-stone-900 leading-snug">
                      {descarga.title}
                    </h3>
                    {descarga.descripcion && (
                      <p className="mt-3 text-base font-light text-stone-600 leading-relaxed">
                        {descarga.descripcion}
                      </p>
                    )}
                    {(descarga.formato || descarga.peso) && (
                      <p className="mt-5 font-mono text-[11px] tracking-[0.2em] uppercase text-stone-500">
                        {[descarga.formato, descarga.peso].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <div className="mt-auto flex flex-col items-start gap-4 pt-8">
                      <a
                        href={descarga.archivo}
                        download
                        {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-700 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-amber-800"
                      >
                        Descargar
                        <Download className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                      </a>
                      {guia && (
                        <Link
                          href={`${ROUTES.guides}/${descarga.guia}`}
                          className="group inline-flex items-center gap-2 border-b border-stone-900 pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-900 transition hover:border-amber-700 hover:text-amber-700"
                        >
                          Ver la guía
                          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>
      )}

      {/* Actualidad */}
      {featured && (
        <section id="actualidad" className="py-20 sm:py-28">
          <Container>
            <div className="reveal-item max-w-2xl">
              <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                Actualidad
              </span>
              <h2 className="mt-6 font-serif font-light text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-tight tracking-tight">
                Novedades de ALKO.
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
              <Link
                href={`${ROUTES.articles}/${featured.slug}`}
                className={`group reveal-item block ${others.length > 0 ? "lg:col-span-7" : "lg:col-span-12"}`}
              >
                {featured.image && (
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover object-center transition duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                )}
                <span className="mt-6 block font-mono text-[11px] tracking-[0.2em] uppercase text-stone-500">
                  {[featured.date && formatDate(featured.date), featured.category].filter(Boolean).join(" · ")}
                </span>
                <h3 className="mt-3 font-serif font-light text-3xl sm:text-4xl text-stone-900 leading-tight tracking-tight transition-colors group-hover:text-amber-700">
                  {featured.title}
                </h3>
                {featured.excerpt && (
                  <p className="mt-4 max-w-xl text-base sm:text-lg font-light text-stone-600 leading-relaxed">
                    {featured.excerpt}
                  </p>
                )}
              </Link>

              {others.length > 0 && (
                <ul className="border-t border-stone-900/15 lg:col-span-5 lg:self-start">
                  {others.map((item, i) => (
                    <li key={item.id} className="border-b border-stone-900/15">
                      <Link
                        href={`${ROUTES.articles}/${item.slug}`}
                        className="group reveal-item block py-6"
                        style={{ transitionDelay: `${i * 90}ms` }}
                      >
                        <span className="block font-mono text-[11px] tracking-[0.2em] uppercase text-stone-500">
                          {[item.date && formatDate(item.date), item.category].filter(Boolean).join(" · ")}
                        </span>
                        <span className="mt-2 flex items-start justify-between gap-4 font-serif font-light text-xl sm:text-2xl text-stone-900 leading-snug transition-colors group-hover:text-amber-700">
                          {item.title}
                          <span
                            aria-hidden="true"
                            className="mt-1 text-stone-400 transition-all group-hover:translate-x-1 group-hover:text-amber-700"
                          >
                            →
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Container>
        </section>
      )}

      <ContactCta settings={settings} />
    </main>
  );
}
