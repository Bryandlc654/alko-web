import Container from "@/components/ui/Container";

/** Bloque gris que late mientras llega el contenido real. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse bg-stone-200 ${className}`} />;
}

/**
 * Esqueleto de una página pública mientras el servidor trae sus datos: cabecera oscura
 * (el menú es blanco y transparente) y una rejilla de tarjetas con imagen y texto.
 */
export function PageSkeleton() {
  return (
    <main aria-busy="true" aria-label="Cargando" className="bg-white">
      <div className="bg-stone-950 pb-20 pt-40 sm:pb-28 sm:pt-48">
        <Container>
          <div className="animate-pulse">
            <div className="h-3 w-40 bg-white/10" />
            <div className="mt-10 h-3 w-28 bg-amber-700/40" />
            <div className="mt-6 h-10 w-full max-w-2xl bg-white/15 sm:h-14" />
            <div className="mt-3 h-10 w-2/3 max-w-xl bg-white/15 sm:h-14" />
            <div className="mt-8 h-4 w-full max-w-xl bg-white/10" />
            <div className="mt-3 h-4 w-4/5 max-w-lg bg-white/10" />
          </div>
        </Container>
      </div>

      <Container className="py-16 sm:py-24">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-5 h-8 w-full max-w-md" />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <Skeleton className="aspect-[4/3] w-full" />
              <Skeleton className="mt-5 h-5 w-3/4" />
              <Skeleton className="mt-3 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-5/6" />
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
