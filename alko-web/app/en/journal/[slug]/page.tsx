import ArticleDetailPage, { articleMetadata } from "@/components/journal/ArticleDetailPage";
import { ARTICLES_EN } from "@/lib/i18n/journal-content";
import { getArticles } from "@/lib/wordpress";

export const revalidate = 60;

/** Solo los artículos traducidos tienen página en inglés. */
export async function generateStaticParams() {
  const articles = await getArticles(50);
  return articles.filter((a) => ARTICLES_EN[a.slug]).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return articleMetadata(slug, "en");
}

/** Artículo del Journal en inglés (la plantilla es común con /journal/[slug]). */
export default async function ArticleDetailEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleDetailPage slug={slug} locale="en" />;
}
