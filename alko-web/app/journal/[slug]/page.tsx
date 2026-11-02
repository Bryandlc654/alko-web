import { notFound } from "next/navigation";
import Link from "next/link";
import ContactTrigger from "@/components/contact/ContactTrigger";
import ReadingProgress from "@/components/article/ReadingProgress";
import ShareButtons from "@/components/article/ShareButtons";
import TableOfContents from "@/components/article/TableOfContents";
import ArticleCard from "@/components/ui/ArticleCard";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Image from "@/components/ui/Image";
import Prose from "@/components/ui/Prose";
import { prepareArticle } from "@/lib/articles";
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
    <main className="bg-white text-stone-900">
      <ReadingProgress targetId="articulo" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Cabecera: solo texto sobre fondo oscuro; la portada se solapa con su borde inferior. */}
      <header className="bg-stone-950 pb-32 pt-36 text-white sm:pb-48 sm:pt-44 lg:pb-56">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Journal", href: isNews ? GUIDES_HREF : ROUTES.journal },
              { label: article.title },
            ]}
            className="mb-10 sm:mb-14"
          />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.25em] sm:text-xs">
            {article.category && <span className="text-amber-500">{article.category}</span>}
            {article.date && (
              <>
                <span aria-hidden="true" className="h-px w-6 bg-white/30" />
                <time dateTime={article.date} className="text-white/60">
                  {formatDate(article.date)}
                </time>
              </>
            )}
            <span aria-hidden="true" className="h-px w-6 bg-white/30" />
            <span className="text-white/60">{minutes} min de lectura</span>
          </div>
          <h1 className="mt-6 max-w-5xl font-serif text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-8 max-w-2xl text-lg font-light leading-relaxed text-white/70 sm:text-xl">
              {article.excerpt}
            </p>
          )}
        </Container>
      </header>

      {article.image && (
        <Container className="-mt-24 sm:-mt-36 lg:-mt-44">
          <div className="relative aspect-[4/3] overflow-hidden bg-stone-200 shadow-2xl sm:aspect-[16/9] lg:aspect-[2/1]">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover"
            />
          </div>
        </Container>
      )}

      <Container className="py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Columna lateral: ficha del artículo, índice y compartir. */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-32">
              <dl className="grid grid-cols-3 gap-4 border-y border-stone-200 py-5 lg:grid-cols-1 lg:gap-0 lg:divide-y lg:divide-stone-200 lg:py-0">
                {[
                  { label: "Categoría", value: article.category },
                  { label: "Publicado", value: article.date ? formatDate(article.date) : "" },
                  { label: "Lectura", value: `${minutes} min` },
                ]
                  .filter((item) => item.value)
                  .map((item) => (
                    <div key={item.label} className="lg:py-4">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500">{item.label}</dt>
                      <dd className="mt-1 text-sm text-stone-900">{item.value}</dd>
                    </div>
                  ))}
              </dl>

              {showToc && (
                <>
                  {/* Móvil: índice plegable. */}
                  <details className="group mt-6 border border-stone-200 lg:hidden">
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

                  <div className="mt-10 hidden lg:block">
                    <span className="mb-5 block font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500">
                      En este artículo
                    </span>
                    <TableOfContents items={toc} />
                  </div>
                </>
              )}

              <div className="mt-10 hidden lg:block">
                <span className="mb-3 block font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500">
                  Compartir
                </span>
                <ShareButtons url={url} title={article.title} />
              </div>
            </div>
          </aside>

          <article id="articulo" className="lg:col-span-8 lg:col-start-5">
            <div className="max-w-3xl">
              {lead && (
                <p className="mb-14 font-serif text-2xl font-light leading-snug tracking-tight text-stone-900 sm:text-3xl">
                  <span aria-hidden="true" className="mb-6 block h-0.5 w-12 bg-amber-700" />
                  {lead}
                </p>
              )}
              <Prose html={body} variant="article" />

              <div className="mt-16 flex flex-col gap-6 border-t border-stone-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="lg:hidden">
                  <span className="mb-3 block font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500">
                    Compartir
                  </span>
                  <ShareButtons url={url} title={article.title} />
                </div>
                <Link
                  href={isNews ? GUIDES_HREF : ROUTES.journal}
                  className="inline-flex items-center gap-2 self-start border-b border-stone-900 pb-1 text-xs font-semibold uppercase tracking-[0.22em] transition hover:border-amber-700 hover:text-amber-700 sm:self-auto"
                >
                  <span aria-hidden="true">←</span>
                  Volver al Journal
                </Link>
              </div>

              {/* Llamada a la acción */}
              <div className="mt-14 grid gap-8 border border-stone-200 border-l-4 border-l-amber-700 bg-stone-50 px-6 py-8 sm:grid-cols-[1fr_auto] sm:items-center sm:px-10 sm:py-10">
                <div>
                  <span className="block font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500">
                    Tu proyecto
                  </span>
                  <h2 className="mt-3 font-serif text-2xl font-light leading-tight tracking-tight sm:text-3xl">
                    ¿Tienes una obra parecida entre manos?
                  </h2>
                  <p className="mt-3 max-w-lg text-base font-light leading-relaxed text-stone-600">
                    Cuéntanos qué necesitas y el equipo técnico de ALKO te responderá con una valoración del
                    alcance, el plazo y el presupuesto.
                  </p>
                </div>
                <ContactTrigger
                  mode="avanzado"
                  source={`Artículo ${article.title}`}
                  className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-stone-950 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-amber-700 sm:self-center"
                >
                  Solicitar valoración
                </ContactTrigger>
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
                href={ROUTES.journal}
                className="group inline-flex items-center gap-2 border-b border-stone-900 pb-1.5 text-xs font-semibold uppercase tracking-[0.22em] transition hover:border-amber-700 hover:text-amber-700"
              >
                Ver el Journal
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
