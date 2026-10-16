import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import { ROUTES } from "@/lib/site";
import { getGuideBySlug, getGuides } from "@/lib/wordpress";

export const revalidate = 60;

export async function generateStaticParams() {
  const guides = await getGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: `${guide.title} — ALKO`,
    description: guide.descripcion,
  };
}

export default async function GuideDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [guide, guides] = await Promise.all([getGuideBySlug(slug), getGuides()]);
  if (!guide) return notFound();

  const others = guides.filter((g) => g.slug !== guide.slug);

  return (
    <main className="bg-white text-stone-900">
      <header className="relative isolate overflow-hidden bg-stone-950 pt-36 sm:pt-44 pb-16">
        <Image
          src={guide.imagen}
          alt={guide.title}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/40" />
        <Container className="relative">
          <span className="font-mono text-xs tracking-widest text-white/60 uppercase">
            {guide.numero} — GUÍA · {guide.tema}
          </span>
          <h1 className="mt-3 max-w-4xl font-serif font-light text-4xl sm:text-5xl lg:text-6xl">
            {guide.title}
          </h1>
          {guide.descripcion && (
            <p className="mt-4 max-w-2xl text-stone-200/80">{guide.descripcion}</p>
          )}
        </Container>
      </header>

      <Container className="py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <Prose html={guide.content} />
          </div>

          <aside className="lg:col-span-4">
            <div className="border border-stone-200 p-6">
              <h2 className="font-serif text-xl">Sobre esta guía</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-stone-200 pb-3">
                  <dt className="font-mono text-[11px] uppercase tracking-widest text-stone-500">Tema</dt>
                  <dd className="text-stone-700">{guide.tema}</dd>
                </div>
                {guide.lectura && (
                  <div className="flex justify-between gap-4">
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-stone-500">Lectura</dt>
                    <dd className="text-stone-700">{guide.lectura}</dd>
                  </div>
                )}
              </dl>
            </div>

            {others.length > 0 && (
              <div className="mt-6 border border-stone-200 p-6">
                <h2 className="font-serif text-xl">Otras guías</h2>
                <ul className="mt-4 divide-y divide-stone-200">
                  {others.map((other) => (
                    <li key={other.id}>
                      <Link
                        href={`${ROUTES.guides}/${other.slug}`}
                        className="group flex items-start justify-between gap-4 py-3"
                      >
                        <span>
                          <span className="block font-mono text-[10px] uppercase tracking-widest text-stone-400">
                            {other.numero} — {other.tema}
                          </span>
                          <span className="mt-1 block font-serif text-lg font-light text-stone-900 leading-snug group-hover:text-amber-800 transition-colors">
                            {other.title}
                          </span>
                        </span>
                        <span className="text-stone-400 group-hover:text-stone-900 transition-transform group-hover:translate-x-1 pt-4">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              href={ROUTES.guides}
              className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest border-b border-stone-900 pb-1 hover:text-amber-800 hover:border-amber-800"
            >
              ← Volver a guías
            </Link>
          </aside>
        </div>
      </Container>
    </main>
  );
}
