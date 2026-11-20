import ArticleDetailPage, { articleMetadata } from "@/components/journal/ArticleDetailPage";
import { getArticles } from "@/lib/wordpress";

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getArticles(50);
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return articleMetadata(slug, "es");
}

/** Artículo del Journal en castellano (la plantilla es común con /en/journal/[slug]). */
export default async function ArticleDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleDetailPage slug={slug} locale="es" />;
}
