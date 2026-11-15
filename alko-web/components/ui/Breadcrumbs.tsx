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
export default function Breadcrumbs({
  items,
  className = "",
  tone = "light",
}: {
  items: Crumb[];
  className?: string;
  /** «light»: texto blanco sobre foto; «dark»: texto tinta sobre fondo claro. */
  tone?: "light" | "dark";
}) {
  const c =
    tone === "dark"
      ? { base: "text-mid", hover: "hover:text-ink", current: "text-ink", sep: "text-ink/30" }
      : { base: "text-white/70", hover: "hover:text-white", current: "text-white", sep: "text-white/40" };
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
      <ol className={`text-[10px] tracking-[0.22em] flex flex-wrap items-center gap-x-2 gap-y-1 uppercase ${c.base}`}>
        {trail.map((item, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className={`transition-colors ${c.hover}`}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className={`min-w-0 truncate ${c.current}`}>
                  {item.label}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className={c.sep}>
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
