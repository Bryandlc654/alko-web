import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
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
      <header className="relative isolate overflow-hidden bg-stone-950 pt-36 sm:pt-44 pb-16">
        <Image
          src={sector.imagen}
          alt={sector.title}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/40" />
        <Container className="relative">
          <span className="font-mono text-xs tracking-widest text-white/60 uppercase">
            SERVICIO
          </span>
          <h1 className="mt-3 font-serif font-light text-4xl sm:text-5xl lg:text-6xl">
            {sector.title}
          </h1>
          <p className="mt-4 max-w-2xl text-stone-200/80">{sector.descripcion}</p>
        </Container>
      </header>

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
