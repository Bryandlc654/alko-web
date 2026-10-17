import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { ROUTES } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="bg-white text-stone-900">
      <PageHero
        eyebrow="404"
        title="Página no encontrada"
        description="La página que buscas no existe o ha cambiado de dirección."
        image="/cta-bg.jpg"
        imagePosition="object-top"
      >
        <Link
          href={ROUTES.home}
          className="mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest border-b border-white pb-1 text-white hover:text-amber-500 hover:border-amber-500 transition-colors"
        >
          Volver al inicio →
        </Link>
      </PageHero>
    </main>
  );
}
