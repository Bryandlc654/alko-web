"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/site";
import { HOME_PATHS, localeFromPath, localizedPath, type Locale } from "@/lib/i18n";

/** Textos de la 404 en cada idioma (el idioma sale de la URL pedida: /en/… es inglés). */
const COPY: Record<
  Locale,
  {
    error: string;
    notFound: string;
    title: string;
    text: string;
    home: string;
    contact: string;
    sections: string;
    maybe: string;
    links: { href: string; label: string; text: string }[];
  }
> = {
  es: {
    error: "Error 404",
    notFound: "Página no encontrada",
    title: "Esta página no está en obra.",
    text: "La página que buscas no existe o ha cambiado de dirección.",
    home: "Volver al inicio",
    contact: "Contactar",
    sections: "Secciones",
    maybe: "Quizá buscabas",
    links: [
      { href: ROUTES.projects, label: "Proyectos", text: "Obras entregadas" },
      { href: ROUTES.sectors, label: "Divisiones", text: "Nuestras especialidades" },
      { href: ROUTES.journal, label: "Journal", text: "Artículos y guías" },
      { href: ROUTES.contact, label: "Contacto", text: "Hablemos de tu proyecto" },
    ],
  },
  en: {
    error: "Error 404",
    notFound: "Page not found",
    title: "This page isn’t under construction.",
    text: "The page you are looking for does not exist or has moved.",
    home: "Back to the home page",
    contact: "Contact us",
    sections: "Sections",
    maybe: "You may be looking for",
    links: [
      { href: ROUTES.projects, label: "Projects", text: "Completed work" },
      { href: ROUTES.sectors, label: "Divisions", text: "Our specialities" },
      { href: ROUTES.journal, label: "Journal", text: "Articles and guides" },
      { href: ROUTES.contact, label: "Contact", text: "Let’s talk about your project" },
    ],
  },
};

/**
 * 404: página tipográfica sobre carbón, con accesos a las secciones principales. Sin `locale`, el
 * idioma sale de la URL (en el navegador); app/en/not-found.tsx lo fija en inglés desde el servidor.
 */
export default function NotFoundView({ locale: fixed }: { locale?: Locale }) {
  const pathname = usePathname();
  const locale = fixed ?? localeFromPath(pathname);
  const t = COPY[locale];
  // El título por defecto de la web está en castellano: en inglés se corrige al cargar.
  useEffect(() => {
    if (locale === "en") document.title = "Page not found | ALKO";
  }, [locale]);
  return (
    <main className="border-b border-paper/10 bg-ink text-paper">
      <div className="site-wrap flex min-h-[100svh] flex-col pb-12 pt-32 sm:pt-40">
        <div className="hh-rise flex items-center justify-between gap-6 border-b border-paper/15 pb-5 text-[10px] uppercase tracking-[0.22em] text-paper/60">
          <span>{t.error}</span>
          <span>{t.notFound}</span>
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
              {t.title}
            </h1>
            <p className="hh-rise mt-6 max-w-md text-lg leading-relaxed text-paper/70" style={{ animationDelay: ".1s" }}>
              {t.text}
            </p>
            <div className="hh-rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: ".15s" }}>
              <Link href={HOME_PATHS[locale]} className="btn btn-paper">
                {t.home} <span aria-hidden="true">→</span>
              </Link>
              <Link href={localizedPath(ROUTES.contact, locale)} className="btn btn-ghost-light">
                {t.contact}
              </Link>
            </div>
          </div>

          <nav aria-label={t.sections} className="hh-rise col-span-12 lg:col-span-4 lg:col-start-9" style={{ animationDelay: ".2s" }}>
            <p className="mb-4 text-[10px] uppercase tracking-[0.22em] text-paper/50">{t.maybe}</p>
            <ul className="border-t border-paper/15">
              {t.links.map((link, i) => (
                <li key={link.href}>
                  <Link
                    href={localizedPath(link.href, locale)}
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
