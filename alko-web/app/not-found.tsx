import Link from "next/link";
import { ROUTES } from "@/lib/site";

const LINKS = [
  { href: ROUTES.projects, label: "Proyectos", text: "Obras entregadas" },
  { href: ROUTES.sectors, label: "Divisiones", text: "Nuestras especialidades" },
  { href: ROUTES.journal, label: "Journal", text: "Artículos y guías" },
  { href: ROUTES.contact, label: "Contacto", text: "Hablemos de tu proyecto" },
];

/** 404: página tipográfica sobre carbón, con accesos a las secciones principales. */
export default function NotFound() {
  return (
    <main className="border-b border-paper/10 bg-ink text-paper">
      <div className="site-wrap flex min-h-[100svh] flex-col pb-12 pt-32 sm:pt-40">
        <div className="hh-rise flex items-center justify-between gap-6 border-b border-paper/15 pb-5 text-[10px] uppercase tracking-[0.22em] text-paper/60">
          <span>Error 404</span>
          <span>Página no encontrada</span>
        </div>

        <div className="grid flex-1 grid-cols-12 items-end gap-x-6 gap-y-12 py-14">
          <div className="col-span-12 lg:col-span-7">
            <p
              aria-hidden="true"
              className="hh-rise display-title text-[9rem] leading-[0.8] tracking-[-0.06em] text-bronze-light sm:text-[14rem] lg:text-[18rem]"
            >
              404
            </p>
            <h1 className="hh-rise display-title mt-8 max-w-[14ch] text-[2.6rem] leading-[1] tracking-[-0.04em] sm:text-6xl">
              Esta página no está en obra.
            </h1>
            <p className="hh-rise mt-6 max-w-md text-lg leading-relaxed text-paper/70" style={{ animationDelay: ".1s" }}>
              La página que buscas no existe o ha cambiado de dirección.
            </p>
            <div className="hh-rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: ".15s" }}>
              <Link href={ROUTES.home} className="btn btn-paper">
                Volver al inicio <span aria-hidden="true">→</span>
              </Link>
              <Link href={ROUTES.contact} className="btn btn-ghost-light">
                Contactar
              </Link>
            </div>
          </div>

          <nav aria-label="Secciones" className="hh-rise col-span-12 lg:col-span-4 lg:col-start-9" style={{ animationDelay: ".2s" }}>
            <p className="mb-4 text-[10px] uppercase tracking-[0.22em] text-paper/50">Quizá buscabas</p>
            <ul className="border-t border-paper/15">
              {LINKS.map((link, i) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group grid grid-cols-[2rem_minmax(0,1fr)_auto] items-baseline gap-3 border-b border-paper/15 py-4"
                  >
                    <span className="text-[10px] tracking-[0.18em] text-bronze-light">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="display-title block text-xl transition-colors group-hover:text-bronze-light">{link.label}</span>
                      <span className="block text-xs text-paper/50">{link.text}</span>
                    </span>
                    <span aria-hidden="true" className="text-paper/50 transition-transform group-hover:translate-x-1 group-hover:text-paper">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}
