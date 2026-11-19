import { notFound } from "next/navigation";
import Link from "next/link";
import ContactTrigger from "@/components/contact/ContactTrigger";
import ReadingProgress from "@/components/article/ReadingProgress";
import ShareButtons from "@/components/article/ShareButtons";
import TableOfContents from "@/components/article/TableOfContents";
import ArticleCard from "@/components/ui/ArticleCard";
import EditorialCta from "@/components/editorial/EditorialCta";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Image from "@/components/ui/Image";
import Prose from "@/components/ui/Prose";
import { prepareArticle } from "@/lib/articles";
import { pageMetadata } from "@/lib/seo";
import { GUIDES_HREF, ROUTES, SITE } from "@/lib/site";
import { getArticleBySlug, getArticles } from "@/lib/wordpress";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getArticles(50);
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return pageMetadata({
    title: `${article.title} | ALKO`,
    description: article.excerpt || article.content,
    path: `${ROUTES.articles}/${article.slug}`,
    image: article.image || undefined,
    imageAlt: article.title,
    article: { publishedTime: article.date || undefined },
  });
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
  const isNews = false;
  const { lead, body, toc, minutes } = prepareArticle(article.content);
  const showToc = toc.length >= 3;
  const url = `${SITE.url}${ROUTES.articles}/${article.slug}`;

  // Más lecturas: primero las de la misma categoría y, si faltan, las demás.
  const pool = (await getArticles(50)).filter((item) => item.slug !== article.slug);
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
    <main className="bg-paper text-ink">
      <ReadingProgress targetId="articulo" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Cabecera editorial clara: migas, ficha en una línea, titular grande y entradilla. */}
      <header className="bg-paper">
        <div className="site-wrap pt-28 sm:pt-36 lg:pt-40">
          <div className="hh-rise flex items-center justify-between gap-6 border-b border-ink/15 pb-5">
            <Breadcrumbs
              items={[{ label: "Journal", href: isNews ? GUIDES_HREF : ROUTES.journal }, { label: article.title }]}
              tone="dark"
              className="min-w-0"
            />
            <span className="hidden shrink-0 text-[10px] uppercase tracking-[0.22em] text-mid sm:block">
              {minutes} min de lectura
            </span>
          </div>

          <p className="hh-rise mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.22em] sm:mt-16">
            {article.category && <span className="bg-ink px-2 py-1 text-paper">{article.category}</span>}
            {article.date && (
              <time dateTime={article.date} className="text-mid">
                {formatDate(article.date)}
              </time>
            )}
            <span className="text-mid sm:hidden">· {minutes} min</span>
          </p>
          <h1 className="hh-rise display-title mt-6 max-w-[20ch] text-[2.6rem] leading-[1] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
            {article.title}
          </h1>

          {article.excerpt && (
            <div
              className="hh-rise mt-12 grid grid-cols-12 gap-6 border-t border-ink/15 pt-8 sm:mt-16"
              style={{ animationDelay: ".15s" }}
            >
              <p className="col-span-12 max-w-2xl text-lg leading-relaxed text-mid sm:text-xl lg:col-span-7">{article.excerpt}</p>
              <div className="col-span-12 hidden lg:col-span-3 lg:col-start-10 lg:block">
                <span className="mb-3 block text-[10px] uppercase tracking-[0.22em] text-mid">Compartir</span>
                <ShareButtons url={url} title={article.title} />
              </div>
            </div>
          )}
        </div>

        {article.image && (
          <figure className="site-wrap mt-14 sm:mt-20">
            <div className="hh-rise relative aspect-[4/3] overflow-hidden bg-piedra sm:aspect-[21/9]" style={{ animationDelay: ".25s" }}>
              <Image
                src={article.image}
                alt={article.title}
                fill
                priority
                sizes="100vw"
                className="hh-zoom object-cover"
              />
            </div>
            <figcaption className="mt-4 flex items-center gap-4 text-mid">
              <span className="text-[10px] uppercase tracking-[0.22em]">{article.category || "Journal"}</span>
              <span className="cota flex-1 text-ink" aria-hidden="true" />
              <span className="text-[10px] uppercase tracking-[0.22em]">ALKO</span>
            </figcaption>
          </figure>
        )}
      </header>

      <div className="site-wrap py-16 sm:py-24">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <article id="articulo" className="col-span-12 lg:col-span-7 lg:col-start-2">
            {lead && (
              <p className="display-title mb-14 text-2xl leading-snug text-ink sm:text-[2rem]">
                <span aria-hidden="true" className="mr-3 text-bronze">↘</span>
                {lead}
              </p>
            )}
            <Prose html={body} variant="article" />

            <div className="mt-16 flex flex-col gap-6 border-t border-ink/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="lg:hidden">
                <span className="mb-3 block text-[10px] uppercase tracking-[0.22em] text-mid">Compartir</span>
                <ShareButtons url={url} title={article.title} />
              </div>
              <Link href={isNews ? GUIDES_HREF : ROUTES.journal} className="arrow-link self-start sm:self-auto">
                <span aria-hidden="true">←</span> Volver al Journal
              </Link>
            </div>
          </article>

          {/* Columna derecha: ficha e índice, fijos al hacer scroll. */}
          <aside className="order-first col-span-12 lg:order-none lg:col-span-3 lg:col-start-10">
            <div className="lg:sticky lg:top-32">
              <dl className="grid grid-cols-3 border-t border-ink/15 lg:grid-cols-1">
                {[
                  { label: "Categoría", value: article.category },
                  { label: "Publicado", value: article.date ? formatDate(article.date) : "" },
                  { label: "Lectura", value: `${minutes} min` },
                ]
                  .filter((item) => item.value)
                  .map((item) => (
                    <div key={item.label} className="border-b border-ink/15 py-4 pr-3">
                      <dt className="text-[10px] uppercase tracking-[0.22em] text-mid">{item.label}</dt>
                      <dd className="mt-1 text-sm">{item.value}</dd>
                    </div>
                  ))}
              </dl>

              {showToc && (
                <>
                  {/* Móvil: índice plegable. */}
                  <details className="group mt-6 border border-ink/15 lg:hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[10px] uppercase tracking-[0.22em]">
                      En este artículo
                      <span aria-hidden="true" className="text-lg leading-none transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="border-t border-ink/15 px-5 py-4">
                      <TableOfContents items={toc} />
                    </div>
                  </details>

                  <div className="mt-10 hidden lg:block">
                    <span className="mb-5 block text-[10px] uppercase tracking-[0.22em] text-mid">En este artículo</span>
                    <TableOfContents items={toc} />
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>

      <EditorialCta
        label="Tu proyecto"
        title="¿Tienes una obra parecida entre manos?"
        description="Cuéntanos qué necesitas y el equipo técnico de ALKO te responderá con una valoración del alcance, el plazo y el presupuesto."
      >
        <ContactTrigger mode="avanzado" source={`Artículo ${article.title}`} className="btn btn-paper">
          Solicitar valoración <span aria-hidden="true">→</span>
        </ContactTrigger>
      </EditorialCta>

      {related.length > 0 && (
        <section className="bg-paper">
          <div className="site-wrap py-20 sm:py-28">
            <div className="flex flex-col gap-4 border-t border-ink/15 pt-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-mid">Más del Journal</p>
                <h2 className="display-title mt-4 text-4xl leading-none sm:text-5xl">Sigue leyendo</h2>
              </div>
              <Link href={ROUTES.journal} className="arrow-link self-start sm:self-auto">
                Ver el Journal <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
