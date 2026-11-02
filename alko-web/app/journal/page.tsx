import Image from "@/components/ui/Image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import ArticlesIndex from "@/components/ui/ArticlesIndex";
import GuidesIndex from "@/components/ui/GuidesIndex";
import ContactCta from "@/components/sections/ContactCta";
import { ROUTES } from "@/lib/site";
import { getArticles, getGuides, getSettings } from "@/lib/wordpress";
import { getDbArticulosPageContent, getDbGuiasPageContent } from "@/lib/db/mysql";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export const metadata = {
  title: "Journal — ALKO",
  description:
    "Artículos técnicos y guías paso a paso de ALKO: climatización, materiales, gestión de obra y cómo afrontar una reforma integral.",
};

/** Journal: artículos y guías en una sola página (antes, Conocimiento con dos listados). */
export default async function JournalPage() {
  const [allArticles, guides, settings, pageContent, guiasContent] = await Promise.all([
    getArticles(50),
    getGuides(),
    getSettings(),
    getDbArticulosPageContent(),
    getDbGuiasPageContent(),
  ]);
  const articles = [...allArticles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const [featured] = articles;

  const stats = [
    { label: "Artículos", value: String(articles.length).padStart(2, "0") },
    { label: "Guías", value: String(guides.length).padStart(2, "0") },
    { label: "Última publicación", value: featured?.date ? formatDate(featured.date) : "—" },
  ];
  const sections = [
    { href: "#articulos", label: "Artículos", count: articles.length },
    { href: "#guias", label: "Guías", count: guides.length },
  ];

  return (
    <main className="bg-white text-stone-900">
      <PageHero
        breadcrumbs={[{ label: "Journal" }]}
        eyebrow={pageContent.headerBadge || "JOURNAL"}
        title={<span className="whitespace-pre-line">{pageContent.headerTitulo || "Criterio técnico,\npor escrito."}</span>}
        description={pageContent.headerDescripcion || "Detalles constructivos, instalaciones y gestión de obra explicados por el equipo que los ejecuta cada día."}
        image={pageContent.headerBgImage || featured?.image || "/proceso-instalaciones.jpg"}
      >
        <dl className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 border-t border-white/15">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-baseline justify-between gap-4 sm:block border-b sm:border-b-0 sm:border-r last:border-r-0 border-white/15 py-4 sm:py-6 sm:pr-6 sm:[&:not(:first-child)]:pl-6"
            >
              <dt className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/50">
                {stat.label}
              </dt>
              <dd className="sm:mt-2 font-serif font-light text-xl sm:text-3xl text-white">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* Accesos a las dos partes del Journal. */}
      <nav aria-label="Secciones del Journal" className="border-b border-stone-200 bg-white">
        <Container>
          <ul className="flex gap-8 overflow-x-auto no-scrollbar">
            {sections.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  className="inline-flex items-center gap-2 py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-stone-600 transition-colors hover:text-stone-900"
                >
                  {s.label}
                  <span className="text-stone-400">{String(s.count).padStart(2, "0")}</span>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {featured && (
        <section className="bg-stone-100 border-b border-stone-300/70">
          <Container className="py-16 sm:py-24">
            <span className="reveal-item block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase mb-8">
              Destacado
            </span>
            <article className="reveal-item group">
              <Link
                href={`${ROUTES.articles}/${featured.slug}`}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end"
              >
                <div
                  data-parallax="8"
                  className="relative overflow-hidden aspect-[16/10] lg:col-span-7 bg-stone-200"
                >
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="lg:col-span-5 lg:pb-2">
                  <div className="flex items-center gap-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest">
                    <span className="text-amber-800">{featured.category}</span>
                    {featured.date && (
                      <>
                        <span className="h-px w-6 bg-stone-400" />
                        <time className="text-stone-500">{formatDate(featured.date)}</time>
                      </>
                    )}
                  </div>
                  <h2 className="mt-5 font-serif font-light text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-[1.08] tracking-tight group-hover:text-amber-800 transition-colors duration-300">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-5 text-base sm:text-lg text-stone-600 font-light leading-relaxed">
                      {featured.excerpt}
                    </p>
                  )}
                  <span className="mt-8 inline-flex items-center gap-3 rounded-full border border-stone-900 px-6 py-3 text-[11px] font-light uppercase tracking-[0.16em] text-stone-900 transition-colors group-hover:bg-stone-900 group-hover:text-white">
                    Leer artículo
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </article>
          </Container>
        </section>
      )}

      <section id="articulos" className="scroll-mt-28">
        <Container className="py-20 sm:py-28">
          <ArticlesIndex articles={articles} />
        </Container>
      </section>

      {guides.length > 0 && (
        <section id="guias" className="scroll-mt-28 border-t border-stone-200 bg-stone-50">
          <Container className="py-20 sm:py-28">
            <div className="reveal-item grid grid-cols-1 gap-6 pb-10 border-b border-stone-300/60 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase mb-4">
                  {String(guides.length).padStart(2, "0")} {guides.length === 1 ? "guía" : "guías"}
                </span>
                <h2 className="font-serif font-light text-4xl sm:text-5xl text-stone-900 leading-tight tracking-tight">
                  {guiasContent.headerTitulo || "Guías"}
                </h2>
              </div>
              <p className="lg:col-span-5 text-base sm:text-lg text-stone-600 font-light leading-relaxed">
                {guiasContent.headerDescripcion ||
                  "Recorridos paso a paso por las decisiones clave de una obra: planificación, presupuesto, materiales y entrega."}
              </p>
            </div>
            <GuidesIndex guides={guides} />
          </Container>
        </section>
      )}

      <ContactCta settings={settings} />
    </main>
  );
}
