import GuideDetailPage, { guideMetadata } from "@/components/journal/GuideDetailPage";
import { GUIDES_EN } from "@/lib/i18n/journal-content";
import { getGuides } from "@/lib/wordpress";

export const revalidate = 60;

/** Solo las guías traducidas tienen página en inglés. */
export async function generateStaticParams() {
  const guides = await getGuides();
  return guides.filter((g) => GUIDES_EN[g.slug]).map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return guideMetadata(slug, "en");
}

/** Guía del Journal en inglés (la plantilla es común con /journal/guias/[slug]). */
export default async function GuideDetailEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GuideDetailPage slug={slug} locale="en" />;
}
