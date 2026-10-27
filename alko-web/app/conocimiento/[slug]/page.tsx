import { notFound } from "next/navigation";
import Link from "next/link";
import ContactTrigger from "@/components/contact/ContactTrigger";
import ReadingProgress from "@/components/article/ReadingProgress";
import ShareButtons from "@/components/article/ShareButtons";
import TableOfContents from "@/components/article/TableOfContents";
import ArticleCard from "@/components/ui/ArticleCard";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Prose from "@/components/ui/Prose";
import { prepareArticle } from "@/lib/articles";
import { ROUTES, SITE } from "@/lib/site";
import { getArticleBySlug, getArticles, getNews } from "@/lib/wordpress";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const [articles, news] = await Promise.all([getArticles(50), getNews(50)]);
  return [...articles, ...news].map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  const description = article.excerpt || article.content.replace(/<[^>]+>/g, "").slice(0, 160);
  return {
    title: `${article.title} — ALKO`,
    description,
    openGraph: {
      title: article.title,
      description,
      type: "article",
      publishedTime: article.date || undefined,
      images: article.image ? [article.image] : undefined,
    },
  };
}

export default async function ArticleDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return notFound();

  // Las novedades (categoría Actualidad) viven dentro de Guías.
  const isNews = article.category.toLowerCase() === "actualidad";
  const { lead, body, toc, minutes } = prepareArticle(article.content);
  const showToc = toc.length >= 3;
  const url = `${SITE.url}${ROUTES.articles}/${article.slug}`;

  // Más lecturas: primero las de la misma categoría y, si faltan, las demás.
  const pool = (await (isNews ? getNews(50) : getArticles(50))).filter((item) => item.slug !== article.slug);
  const related = [
    ...pool.filter((item) => item.category === article.category),
    ...pool.filter((item) => item.category !== article.category),
  ].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt || lead,
    image: article.image || undefined,
    datePublished: article.date || undefined,
    mainEntityOfPage: url,
    publisher: { "@type": "Organization", name: "ALKO" },
  };

  return (
    <main className="bg-white text-stone-900">
      <ReadingProgress targetId="articulo" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        breadcrumbs={[
          isNews
            ? { label: "Guías", href: ROUTES.guides }
            : { label: "Artículos", href: ROUTES.articlesList },
          { label: article.title },
        ]}
        eyebrow={article.category}
        title={article.title}
        image={article.image}
        imageAlt={article.title}
      >
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase text-white/70">
          {article.date && <time dateTime={article.date}>{formatDate(article.date)}</time>}
          {article.date && <span aria-hidden="true">·</span>}
          <span>{minutes} min de lectura</span>
        </p>
      </PageHero>

      <Container className="py-12 sm:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {showToc && (
            <aside className="lg:col-span-3">
              {/* Móvil: índice plegable. */}
              <details className="group border border-stone-200 lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-stone-700">
                  En este artículo
                  <span aria-hidden="true" className="text-lg leading-none transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="border-t border-stone-200 px-5 py-4">
                  <TableOfContents items={toc} />
                </div>
              </details>

              {/* Escritorio: índice fijo a la izquierda. */}
              <div className="hidden lg:sticky lg:top-32 lg:block">
                <span className="mb-5 block font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500">
                  En este artículo
                </span>
                <TableOfContents items={toc} />
              </div>
            </aside>
          )}

          <article
            id="articulo"
            className={showToc ? "lg:col-span-8" : "mx-auto w-full max-w-3xl lg:col-span-12"}
          >
            <div className="max-w-3xl">
              {lead && (
                <p className="mb-12 border-l-2 border-amber-700 pl-5 font-serif text-xl font-light leading-snug tracking-tight text-stone-900 sm:pl-6 sm:text-2xl lg:text-[1.75rem]">
                  {lead}
                </p>
              )}
              <Prose html={body} variant="article" />

              <div className="mt-16 flex flex-col gap-6 border-t border-stone-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="mb-3 block font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500">
                    Compartir
                  </span>
                  <ShareButtons url={url} title={article.title} />
                </div>
                <Link
                  href={isNews ? `${ROUTES.guides}#actualidad` : ROUTES.articlesList}
                  className="inline-flex items-center gap-2 self-start border-b border-stone-900 pb-1 text-xs font-semibold uppercase tracking-[0.22em] transition hover:border-amber-700 hover:text-amber-700 sm:self-auto"
                >
                  <span aria-hidden="true">←</span>
                  {isNews ? "Volver a actualidad" : "Volver a artículos"}
                </Link>
              </div>

              {/* Llamada a la acción */}
              <div className="mt-14 bg-stone-950 px-6 py-10 text-white sm:px-10 sm:py-12">
                <span className="block font-mono text-[11px] uppercase tracking-[0.25em] text-white/60">
                  Tu proyecto
                </span>
                <h2 className="mt-4 font-serif text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                  ¿Tienes una obra parecida entre manos?
                </h2>
                <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-white/75">
                  Cuéntanos qué necesitas y el equipo técnico de ALKO te responderá con una valoración
                  del alcance, el plazo y el presupuesto.
                </p>
                <div className="mt-8">
                  <ContactTrigger
                    mode="avanzado"
                    source={`Artículo ${article.title}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-700 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-stone-900"
                  >
                    Solicitar valoración
                  </ContactTrigger>
                </div>
              </div>
            </div>
          </article>
        </div>
      </Container>

      {related.length > 0 && (
        <section className="bg-stone-100 py-16 sm:py-24">
          <Container>
            <div className="mb-10 flex flex-col gap-4 border-b border-stone-900/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-serif text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                Sigue leyendo
              </h2>
              <Link
                href={isNews ? ROUTES.guides : ROUTES.articlesList}
                className="group inline-flex items-center gap-2 border-b border-stone-900 pb-1.5 text-xs font-semibold uppercase tracking-[0.22em] transition hover:border-amber-700 hover:text-amber-700"
              >
                {isNews ? "Ver todas las guías" : "Ver todos los artículos"}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}
