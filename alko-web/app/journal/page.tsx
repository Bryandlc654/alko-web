import Image from "@/components/ui/Image";
import Link from "next/link";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import EditorialSection from "@/components/editorial/EditorialSection";
import ArticlesIndex from "@/components/ui/ArticlesIndex";
import GuidesIndex from "@/components/ui/GuidesIndex";
import FinalContact from "@/components/sections/FinalContact";
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

  const sections = [
    { href: "#articulos", label: "Artículos", count: articles.length },
    { href: "#guias", label: "Guías", count: guides.length },
  ];

  return (
    <main className="bg-paper text-ink">
      <EditorialHeader
        breadcrumbs={[{ label: "Journal" }]}
        eyebrow={pageContent.headerBadge || "Journal"}
        title={<span className="whitespace-pre-line">{pageContent.headerTitulo || "Criterio técnico,\npor escrito."}</span>}
        description={
          pageContent.headerDescripcion ||
          "Detalles constructivos, instalaciones y gestión de obra explicados por el equipo que los ejecuta cada día."
        }
        aside={
          <nav aria-label="Secciones del Journal" className="flex flex-col">
            {sections.map((s) => (
              <a
                key={s.href}
                href={s.href}
                className="group flex items-baseline justify-between gap-6 border-t border-ink/15 py-4 transition-colors hover:text-bronze"
              >
                <span className="text-[11px] uppercase tracking-[0.22em]">{s.label}</span>
                <span className="flex items-baseline gap-3">
                  <span className="display-title text-3xl">{String(s.count).padStart(2, "0")}</span>
                  <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">↓</span>
                </span>
              </a>
            ))}
            {featured?.date && (
              <p className="border-t border-ink/15 pt-4 text-[10px] uppercase tracking-[0.22em] text-mid">
                Última publicación · {formatDate(featured.date)}
              </p>
            )}
          </nav>
        }
      />

      {/* Destacado: foto a lo ancho y texto a dos columnas debajo. */}
      {featured && (
        <section className="bg-paper">
          <div className="site-wrap pb-20 sm:pb-28">
            <Link href={`${ROUTES.articles}/${featured.slug}`} className="group block">
              <div className="relative mt-8 aspect-[4/3] overflow-hidden bg-piedra sm:aspect-[21/9]">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.03]"
                />
                <span className="absolute left-4 top-4 bg-paper px-2.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-ink sm:left-6 sm:top-6">
                  Destacado
                </span>
              </div>
              <div className="mt-8 grid grid-cols-12 gap-x-6 gap-y-6">
                <div className="col-span-12 lg:col-span-7">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-mid">
                    <span className="text-bronze">{featured.category}</span>
                    {featured.date && <> · {formatDate(featured.date)}</>}
                  </p>
                  <h2 className="display-title mt-4 text-[2.2rem] leading-[1.04] transition-colors group-hover:text-bronze sm:text-5xl lg:text-6xl">
                    {featured.title}
                  </h2>
                </div>
                <div className="col-span-12 flex flex-col justify-end lg:col-span-4 lg:col-start-9">
                  {featured.excerpt && <p className="text-lg leading-relaxed text-mid">{featured.excerpt}</p>}
                  <span className="arrow-link mt-6 self-start">
                    Leer artículo <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <EditorialSection
        id="articulos"
        tone="white"
        number="01"
        label="Archivo"
        title="Todos los artículos"
        intro="Filtra por tema. Cada artículo, escrito por quien lo ejecuta en obra."
        wide
      >
        <ArticlesIndex articles={articles} />
      </EditorialSection>

      {guides.length > 0 && (
        <EditorialSection
          id="guias"
          number="02"
          label="Guías paso a paso"
          title={guiasContent.headerTitulo || "Guías"}
          intro={
            guiasContent.headerDescripcion ||
            "Recorridos paso a paso por las decisiones clave de una obra: planificación, presupuesto, materiales y entrega."
          }
          wide
        >
          <GuidesIndex guides={guides} />
        </EditorialSection>
      )}

      <FinalContact settings={settings} id="contacto" source="Formulario journal · /journal" />
    </main>
  );
}
