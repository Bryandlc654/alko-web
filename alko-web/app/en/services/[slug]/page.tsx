import ServiceDetailPage, { serviceMetadata } from "@/components/services/ServiceDetailPage";
import { getSectors } from "@/lib/wordpress";

export const revalidate = 60;

export async function generateStaticParams() {
  const sectors = await getSectors();
  return sectors.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return serviceMetadata(slug, "en");
}

/** Página de un servicio en inglés (la plantilla es común con /servicios/[slug]). */
export default async function ServiceDetailEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ServiceDetailPage slug={slug} locale="en" />;
}
