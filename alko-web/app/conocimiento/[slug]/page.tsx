import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Prose from "@/components/ui/Prose";
import { ROUTES } from "@/lib/site";
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

  return (
    <main className="bg-white text-stone-900">
      <PageHero
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
            href={ROUTES.articlesList}
            className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-widest border-b border-stone-900 pb-1 hover:text-amber-800 hover:border-amber-800"
          >
            ← Volver a artículos
          </Link>
        </div>
      </Container>
    </main>
  );
}
