import Link from "next/link";
import { ROUTES, SITE } from "@/lib/site";

export interface Crumb {
  label: string;
  /** Sin enlace en la página actual (último elemento). */
  href?: string;
}

/**
 * Migas de pan para las cabeceras sobre imagen (texto claro). Siempre empiezan en «Inicio»;
 * el último elemento es la página actual. Incluye los datos estructurados BreadcrumbList.
 */
export default function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  const trail: Crumb[] = [{ label: "Inicio", href: ROUTES.home }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE.url}${item.href === "/" ? "" : item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Migas de pan" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] sm:text-xs tracking-[0.2em] uppercase text-white/70">
        {trail.map((item, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="min-w-0 truncate text-white">
                  {item.label}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className="text-white/40">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
