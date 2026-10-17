import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Prose from "@/components/ui/Prose";
import { ROUTES } from "@/lib/site";
import { getSectorBySlug, getSectors } from "@/lib/wordpress";

export const revalidate = 60;

export async function generateStaticParams() {
  const sectors = await getSectors();
  return sectors.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sector = await getSectorBySlug(slug);
  if (!sector) return {};
  return {
    title: `${sector.title} — ALKO`,
    description: sector.descripcion,
  };
}

export default async function SectorDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sector = await getSectorBySlug(slug);
  if (!sector) return notFound();

  return (
    <main className="bg-white text-stone-900">
      <PageHero
        eyebrow="SERVICIO"
        title={sector.title}
        description={sector.descripcion}
        image={sector.imagen}
        imageAlt={sector.title}
      />

      <Container className="py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <Prose html={sector.content} />
          </div>
          <aside className="lg:col-span-4">
            <div className="border border-stone-200 p-6">
              <h2 className="font-serif text-xl">Ámbito de actuación</h2>
              <p className="mt-2 text-sm text-stone-600">{sector.descripcion}</p>
            </div>
            <Link
              href={ROUTES.sectors}
              className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest border-b border-stone-900 pb-1 hover:text-amber-800 hover:border-amber-800"
            >
              ← Volver a servicios
            </Link>
          </aside>
        </div>
      </Container>
    </main>
  );
}
