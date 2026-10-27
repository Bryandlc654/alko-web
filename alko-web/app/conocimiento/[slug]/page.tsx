import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Prose from "@/components/ui/Prose";
import { ROUTES } from "@/lib/site";
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
  return {
    title: `${article.title} — ALKO`,
    description: article.excerpt || article.content.replace(/<[^>]+>/g, "").slice(0, 160),
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

  return (
    <main className="bg-white text-stone-900">
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
        {article.date && (
          <time className="mt-6 block font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase text-white/70">
            {formatDate(article.date)}
          </time>
        )}
      </PageHero>

      <Container className="py-12 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <Prose html={article.content} />
          <Link
            href={isNews ? `${ROUTES.guides}#actualidad` : ROUTES.articlesList}
            className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-widest border-b border-stone-900 pb-1 hover:text-amber-800 hover:border-amber-800"
          >
            {isNews ? "← Volver a actualidad" : "← Volver a artículos"}
          </Link>
        </div>
      </Container>
    </main>
  );
}
