import ServiceDetailPage, { serviceMetadata } from "@/components/services/ServiceDetailPage";
import { getSectors } from "@/lib/wordpress";

export const revalidate = 60;

export async function generateStaticParams() {
  const sectors = await getSectors();
  return sectors.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return serviceMetadata(slug, "es");
}

/** Página de un servicio en castellano (la plantilla es común con /en/services/[slug]). */
export default async function SectorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ServiceDetailPage slug={slug} locale="es" />;
}
