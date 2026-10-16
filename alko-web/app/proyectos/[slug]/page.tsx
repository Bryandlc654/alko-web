import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import { ROUTES } from "@/lib/site";
import { getProjectBySlug, getProjects } from "@/lib/wordpress";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — ALKO`,
    description: project.content.replace(/<[^>]+>/g, "").slice(0, 160),
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return notFound();

  return (
    <main className="bg-white text-stone-900">
      <header className="relative isolate overflow-hidden bg-stone-950 pt-36 sm:pt-44 pb-16">
        <Image
          src={project.imagen}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/40" />
        <Container className="relative">
          <span className="font-mono text-xs tracking-widest text-white/60 uppercase">
            PROYECTO
          </span>
          <h1 className="mt-3 font-serif font-light text-4xl sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-stone-200/80">
            <span>{project.ubicacion}</span>
            <span>{project.anio}</span>
            <span>{project.tipologia}</span>
          </div>
        </Container>
      </header>

      <Container className="py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <Prose html={project.content} />
          </div>
          <aside className="lg:col-span-4">
            <div className="border border-stone-200 p-6 space-y-4">
              <h2 className="font-serif text-xl">Ficha del proyecto</h2>
              <dl className="space-y-2 text-sm text-stone-600">
                <div>
                  <dt className="font-medium text-stone-900">Ubicación</dt>
                  <dd>{project.ubicacion}</dd>
                </div>
                <div>
                  <dt className="font-medium text-stone-900">Año</dt>
                  <dd>{project.anio}</dd>
                </div>
                <div>
                  <dt className="font-medium text-stone-900">Tipología</dt>
                  <dd>{project.tipologia}</dd>
                </div>
              </dl>
            </div>
            <Link
              href={ROUTES.projects}
              className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest border-b border-stone-900 pb-1 hover:text-amber-800 hover:border-amber-800"
            >
              ← Volver a proyectos
            </Link>
          </aside>
        </div>
      </Container>
    </main>
  );
}
