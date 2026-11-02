/** Esqueleto del panel mientras se cargan los datos de la sección. */
export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando" className="mx-auto max-w-6xl animate-pulse px-6 py-10">
      <div className="h-7 w-56 rounded-lg bg-slate-200" />
      <div className="mt-3 h-4 w-80 max-w-full rounded bg-slate-200" />
      <div className="mt-10 space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="h-12 w-16 shrink-0 rounded-lg bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded bg-slate-200" />
              <div className="h-3 w-1/2 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
