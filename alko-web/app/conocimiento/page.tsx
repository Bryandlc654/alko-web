import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import ArticleCard from "@/components/ui/ArticleCard";
import { getArticles } from "@/lib/wordpress";

export const revalidate = 60;

export const metadata = {
  title: "Conocimiento — ALKO",
  description: "Biblioteca técnica con criterios constructivos y soluciones aplicadas a obra.",
};

export default async function ConocimientoPage() {
  const articles = await getArticles(50);

  return (
    <main className="bg-white text-stone-900">
      <PageHero
        eyebrow="CONOCIMIENTO"
        title="Biblioteca técnica"
        description="Artículos orientados a la toma de decisiones técnicas: criterios, detalles y soluciones probadas en obra."
      />
      <Container className="py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {articles.map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i} />
          ))}
        </div>
      </Container>
    </main>
  );
}
