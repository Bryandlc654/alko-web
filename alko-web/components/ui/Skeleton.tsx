/** Bloque que late mientras llega el contenido real. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse bg-ink/[0.07] ${className}`} />;
}

/**
 * Esqueleto de una página pública mientras el servidor trae sus datos. Imita la cabecera
 * editorial clara (migas, titular grande, descripción y columna derecha), la foto enmarcada
 * y una rejilla de tarjetas.
 */
export function PageSkeleton() {
  return (
    <main aria-busy="true" aria-label="Cargando" className="bg-paper">
      <div className="site-wrap pt-28 sm:pt-36 lg:pt-40">
        <div className="flex items-center justify-between gap-6 border-b border-ink/15 pb-5">
          <Skeleton className="h-2.5 w-40" />
          <Skeleton className="hidden h-2.5 w-20 sm:block" />
        </div>
        <Skeleton className="mt-12 h-12 w-full max-w-3xl sm:mt-16 sm:h-20" />
        <Skeleton className="mt-4 h-12 w-2/3 max-w-xl sm:h-20" />
        <div className="mt-12 grid grid-cols-12 gap-6 border-t border-ink/15 pt-8 sm:mt-16">
          <div className="col-span-12 lg:col-span-6">
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="mt-3 h-4 w-5/6 max-w-lg" />
            <Skeleton className="mt-3 h-4 w-2/3 max-w-md" />
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between border-t border-ink/15 py-4">
                <Skeleton className="h-2.5 w-28" />
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        </div>
        <Skeleton className="mt-14 aspect-[4/3] w-full sm:mt-20 sm:aspect-[21/9]" />
      </div>

      <div className="site-wrap py-16 sm:py-24">
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="mt-5 border-t border-ink/15 pt-4">
                <Skeleton className="h-2.5 w-24" />
              </div>
              <Skeleton className="mt-4 h-6 w-3/4" />
              <Skeleton className="mt-3 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
