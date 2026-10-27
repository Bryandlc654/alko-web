import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import ArticlesIndex from "@/components/ui/ArticlesIndex";
import ContactCta from "@/components/sections/ContactCta";
import { ROUTES } from "@/lib/site";
import { getArticles, getSettings } from "@/lib/wordpress";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export const metadata = {
  title: "Artículos — ALKO",
  description:
    "Todos los artículos técnicos de ALKO ordenados por categoría: climatización, materiales, gestión técnica y más.",
};

export default async function ArticulosPage() {
  const [allArticles, settings] = await Promise.all([getArticles(50), getSettings()]);
  const articles = [...allArticles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const [featured] = articles;
  const categories = new Set(articles.map((a) => a.category).filter(Boolean));

  const stats = [
    { label: "Artículos", value: String(articles.length).padStart(2, "0") },
    { label: "Categorías", value: String(categories.size).padStart(2, "0") },
    { label: "Última publicación", value: featured?.date ? formatDate(featured.date) : "—" },
  ];

  return (
    <main className="bg-white text-stone-900">
      <PageHero
        breadcrumbs={[{ label: "Artículos" }]}
        eyebrow="CONOCIMIENTO · ARTÍCULOS"
        title={
          <>
            Criterio técnico,
            <br />
            por escrito.
          </>
        }
        description="Detalles constructivos, instalaciones y gestión de obra explicados por el equipo que los ejecuta cada día."
        image={featured?.image || "/proceso-instalaciones.jpg"}
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

      <Container className="py-20 sm:py-28">
        <ArticlesIndex articles={articles} />
      </Container>

      <Container className="pb-20 sm:pb-28">
        <Link
          href={ROUTES.guides}
          className="reveal-item group flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-stone-300/80 p-8 sm:p-10 transition-colors hover:border-stone-900"
        >
          <div>
            <span className="block font-mono text-[11px] tracking-[0.25em] text-stone-500 uppercase mb-2">
              ¿Buscas un recorrido completo?
            </span>
            <span className="font-serif font-light text-2xl sm:text-3xl text-stone-900 group-hover:text-amber-800 transition-colors">
              Consulta nuestras guías paso a paso
            </span>
          </div>
          <span className="text-3xl text-stone-400 group-hover:text-stone-900 transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </Container>

      <ContactCta settings={settings} />
    </main>
  );
}
