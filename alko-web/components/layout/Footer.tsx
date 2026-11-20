import Image from "@/components/ui/Image";
import Link from "next/link";
import ContactTrigger from "@/components/contact/ContactTrigger";
import { FOOTER_NAV, FOOTER_NAV_SECONDARY, GUIDES_HREF, METHOD_HREF, ROUTES, SITE, SOCIAL_LINKS } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";
import { HOME_PATHS, localizedPath, type Locale } from "@/lib/i18n";
import { LAYOUT_COPY } from "@/lib/i18n/layout";

const heading = "text-[10px] uppercase tracking-[0.22em] text-white/50";
const linkCls = "transition-colors hover:text-piedra";

/** Pie de la propuesta 6 (cierre de la V5): frase de marca, cuatro columnas y barra legal. */
export default function Footer({ settings, locale = "es" }: { settings: SiteSettings; locale?: Locale }) {
  const t = LAYOUT_COPY[locale].footer;
  // «Inicio» lleva a la portada del idioma; el resto, a las páginas (en castellano).
  const localize = (link: { href: string; label: string }) => ({
    href: localizedPath(link.href, locale),
    label: t.links[link.href] ?? link.label,
  });
  const telHref = `tel:${settings.telefono.replace(/[^+\d]/g, "")}`;
  // Solo Instagram y Facebook: la URL del panel manda; si está vacía, la de lib/site.
  const socials = SOCIAL_LINKS.map((social) => ({ label: social.label, href: settings[social.key] || social.fallback }));
  const resources = [
    { href: localizedPath(ROUTES.journal, locale), label: "Journal" },
    { href: localizedPath(GUIDES_HREF, locale), label: t.guides },
    { href: `${HOME_PATHS[locale]}#preguntas`, label: t.faq },
    { href: localizedPath(METHOD_HREF, locale), label: t.method },
  ];

  return (
    <footer className="w-full bg-ink text-white">
      <div className="site-wrap grid gap-y-12 pb-14 pt-20 md:grid-cols-3">
        <div className="flex flex-col md:pr-10">
          <p className="display-title text-[30px] leading-[1.08] md:text-[38px]">{t.tagline}</p>
          <Image
            src="/logo.webp"
            alt={SITE.legalName}
            width={500}
            height={130}
            sizes="200px"
            skeleton={false}
            className="mt-12 h-10 w-auto self-start object-contain md:mt-auto"
          />
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:col-span-2 md:pl-4">
          <nav aria-label={t.explore}>
            <p className={heading}>{t.explore}</p>
            <ul className="mt-5 space-y-2.5 text-[15px] text-white/70">
              {FOOTER_NAV.map(localize).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkCls}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="ALKO">
            <p className={heading}>ALKO</p>
            <ul className="mt-5 space-y-2.5 text-[15px] text-white/70">
              {FOOTER_NAV_SECONDARY.map(localize).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkCls}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={t.resources}>
            <p className={heading}>{t.resources}</p>
            <ul className="mt-5 space-y-2.5 text-[15px] text-white/70">
              {resources.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkCls}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="col-span-2 sm:col-span-1">
            <p className={heading}>{t.project}</p>
            <address className="mt-5 space-y-2.5 text-[15px] not-italic text-white/70">
              {settings.direccion && <span className="block">{settings.direccion}</span>}
              <a href={telHref} className={`block ${linkCls}`}>
                {settings.telefono}
              </a>
              <a href={`mailto:${settings.email}`} className={`block break-all ${linkCls}`}>
                {settings.email}
              </a>
            </address>
            <ContactTrigger mode="avanzado" source={locale === "es" ? "Pie" : "Pie · EN"} className="btn btn-paper mt-6">
              {t.present} <span aria-hidden="true">→</span>
            </ContactTrigger>
            {socials.length > 0 && (
              <>
                <p className={`${heading} mt-10`}>{t.social}</p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[14px] text-white/70">
                  {socials.map((social) => (
                    <li key={social.label}>
                      <a href={social.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="site-wrap flex flex-col justify-between gap-3 py-6 text-[10px] uppercase tracking-[0.22em] text-white/50 md:flex-row">
          <span>
            © {new Date().getFullYear()} {SITE.legalName}
          </span>
          {settings.horario && <span>{settings.horario}</span>}
          <span className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href={localizedPath(ROUTES.privacy, locale)} className="transition-colors hover:text-white">
              {t.privacy}
            </Link>
            <span>{t.place}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
