import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
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
      <header className="relative isolate overflow-hidden bg-stone-950 pt-36 sm:pt-44 pb-16">
        <Image
          src={article.image}
          alt={article.title}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/40" />
        <Container className="relative max-w-3xl">
          <span className="font-mono text-xs tracking-widest text-white/60 uppercase">
            {article.category}
          </span>
          <h1 className="mt-3 font-serif font-light text-4xl sm:text-5xl lg:text-6xl">
            {article.title}
          </h1>
          {article.date && (
            <time className="mt-4 block text-sm text-stone-200/70">
              {formatDate(article.date)}
            </time>
          )}
        </Container>
      </header>

      <Container className="py-12 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <Prose html={article.content} />
          <Link
            href={ROUTES.articles}
            className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-widest border-b border-stone-900 pb-1 hover:text-amber-800 hover:border-amber-800"
          >
            ← Volver a conocimiento
          </Link>
        </div>
      </Container>
    </main>
  );
}
