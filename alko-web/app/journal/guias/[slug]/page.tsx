import GuideDetailPage, { guideMetadata } from "@/components/journal/GuideDetailPage";
import { getGuides } from "@/lib/wordpress";

export const revalidate = 60;

export async function generateStaticParams() {
  const guides = await getGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return guideMetadata(slug, "es");
}

/** Guía del Journal en castellano (la plantilla es común con /en/journal/guides/[slug]). */
export default async function GuideDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GuideDetailPage slug={slug} locale="es" />;
}
