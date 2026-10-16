import Link from "next/link";
import Container from "@/components/ui/Container";
import { ROUTES } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="bg-white text-stone-900 min-h-[70vh] flex items-center">
      <Container className="py-32 text-center">
        <span className="font-mono text-xs tracking-widest text-stone-500 uppercase">
          404
        </span>
        <h1 className="mt-4 font-serif font-light text-4xl sm:text-5xl">
          Página no encontrada
        </h1>
        <p className="mt-4 text-base text-stone-600">
          La página que buscas no existe o ha cambiado de dirección.
        </p>
        <Link
          href={ROUTES.home}
          className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest border-b border-stone-900 pb-1 hover:text-amber-800 hover:border-amber-800"
        >
          Volver al inicio →
        </Link>
      </Container>
    </main>
  );
}
