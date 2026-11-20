"use client";

import Image from "@/components/ui/Image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ContactTrigger from "@/components/contact/ContactTrigger";
import {
  buildMainNav,
  ROUTES,
  TRANSPARENT_HEADER_ROUTES,
  isSolidHeaderRoute,
  type NavItem,
  type ServiceLink,
} from "@/lib/site";
import type { SiteSettings } from "@/lib/types";
import { SERVICES_EN } from "@/lib/i18n/services";
import { HOME_PATHS, LOCALES, LOCALE_META, localeFromPath, localizedPath, pathInLocale, type Locale } from "@/lib/i18n";
import { LAYOUT_COPY, type LayoutCopy } from "@/lib/i18n/layout";

type NavCopy = LayoutCopy["nav"];

/**
 * Navegación en el idioma de la página: nombres traducidos, «Inicio» a la portada de ese
 * idioma y el submenú de Estudio con sus descripciones. Los servicios vienen del panel y se
 * muestran tal cual.
 */
function localizeNav(items: NavItem[], locale: Locale, t: NavCopy): NavItem[] {
  return items.map((item) => ({
    ...item,
    href: localizedPath(item.href, locale),
    label: t.items[item.href] ?? item.label,
    children: item.children?.map((child) => {
      // Servicios: vienen del panel en castellano; en inglés, sus textos de lib/i18n/services.
      const service = locale === "en" && item.href === ROUTES.sectors ? SERVICES_EN[child.href.split("/").pop() ?? ""] : undefined;
      return {
        ...child,
        ...(item.href === ROUTES.company ? t.company[child.href] : {}),
        ...(service && { label: service.title, description: service.description }),
        href: localizedPath(child.href, locale),
      };
    }),
  }));
}

/** Selector de idioma: enlaza a la misma página en el otro idioma (o a su portada si no está traducida). */
function LanguageSwitch({
  pathname,
  locale,
  label,
  className = "",
  itemClass,
}: {
  pathname: string;
  locale: Locale;
  label: string;
  className?: string;
  itemClass: (active: boolean) => string;
}) {
  return (
    <nav aria-label={label} className={`flex items-center gap-1 text-[11px] tracking-[0.12em] ${className}`}>
      {LOCALES.map((code, i) => (
        <span key={code} className="flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden="true" className="opacity-40">
              /
            </span>
          )}
          <Link
            href={pathInLocale(pathname, code)}
            hrefLang={LOCALE_META[code].htmlLang}
            lang={LOCALE_META[code].htmlLang}
            aria-label={LOCALE_META[code].name}
            aria-current={code === locale ? "true" : undefined}
            className={`px-1 py-2 transition-colors ${itemClass(code === locale)}`}
          >
            {LOCALE_META[code].short}
          </Link>
        </span>
      ))}
    </nav>
  );
}

export default function Nav({
  settings,
  services,
}: {
  settings?: SiteSettings;
  services?: ServiceLink[];
}) {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const t = LAYOUT_COPY[locale].nav;
  const items = localizeNav(buildMainNav(services), locale, t);
  const transparent =
    !isSolidHeaderRoute(pathname) &&
    TRANSPARENT_HEADER_ROUTES.some((route) =>
      route.endsWith("/*") ? pathname.startsWith(route.slice(0, -1)) : pathname === route,
    );
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!transparent) {
      setScrolled(true);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const solid = !transparent || scrolled;
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  // Sobre el hero (transparente) el texto es blanco; con fondo marfil, carbón.
  const linkBase = "text-[12px] tracking-[0.06em] uppercase transition-colors duration-200 py-2";
  const linkColor = (active: boolean) =>
    solid
      ? active
        ? "text-bronze"
        : "text-ink hover:text-bronze"
      : active
        ? "text-white"
        : "text-white/80 hover:text-white";

  return (
    <>
      <div
        id="site-nav"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${solid ? "is-scrolled" : ""}`}
      >
        <nav
          aria-label={t.label}
          className={`site-wrap relative flex items-center justify-between gap-8 transition-[height] duration-300 ${
            solid ? "h-[72px] lg:h-[84px]" : "h-[80px] lg:h-[96px]"
          }`}
        >
          <Link href={HOME_PATHS[locale]} className="flex shrink-0 items-center" aria-label={t.home}>
            <Image
              src={solid ? "/logo-alko-footer.webp" : "/logo.webp"}
              skeleton={false}
              alt="ALKO"
              width={500}
              height={130}
              sizes="160px"
              priority
              className="h-8 w-auto object-contain sm:h-9"
            />
          </Link>

          <div className="ml-auto hidden items-center gap-[clamp(18px,2.4vw,38px)] lg:flex">
            {items.map((link) =>
              link.children ? (
                <div key={link.href} className="group static">
                  <Link
                    href={link.href}
                    className={`${linkBase} ${linkColor(isActive(link.href))} inline-flex items-center gap-1.5`}
                  >
                    {link.label}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180"
                      aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  <MegaMenu item={link} pathname={pathname} intro={t.mega[link.href]} />
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${linkBase} ${linkColor(isActive(link.href))}`}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitch
              pathname={pathname}
              locale={locale}
              label={t.language}
              className="hidden sm:flex"
              itemClass={(active) =>
                solid
                  ? active
                    ? "text-ink font-semibold"
                    : "text-ink/50 hover:text-ink"
                  : active
                    ? "text-white font-semibold"
                    : "text-white/60 hover:text-white"
              }
            />
            <ContactTrigger
              mode="avanzado"
              source={t.ctaSource}
              className={`btn hidden gap-6 px-5 py-[14px] text-[11px] sm:inline-flex ${
                solid ? "btn-ink" : "btn-paper"
              }`}
            >
              {t.cta} <span aria-hidden="true">↗</span>
            </ContactTrigger>
            <button
              id="mobile-menu-btn"
              type="button"
              aria-label={t.openMenu}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
              className={`inline-flex h-11 w-11 items-center justify-center border transition lg:hidden ${
                solid
                  ? "border-ink/20 text-ink hover:bg-ink hover:text-white"
                  : "border-white/40 text-white hover:bg-white/10"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </nav>
      </div>

      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        pathname={pathname}
        isActive={isActive}
        settings={settings}
        items={items}
        locale={locale}
        t={t}
      />
    </>
  );
}

/**
 * Mega menú de escritorio en horizontal: banda a todo el ancho con la introducción a la
 * izquierda y los enlaces en fila, una columna por división.
 */
function MegaMenu({
  item,
  pathname,
  intro,
}: {
  item: NavItem;
  pathname: string;
  intro?: { tag: string; title: string; text: string; cta: string };
}) {
  return (
    <div className="invisible absolute inset-x-0 top-full z-50 -translate-y-2 opacity-0 transition-all duration-300 ease-alko group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
      <div className="site-wrap pt-3">
        <div className="flex border border-line bg-surface text-ink">
          {intro && (
            <div className="flex w-[280px] shrink-0 flex-col justify-between border-r border-line p-7 xl:w-[300px]">
              <div>
                <span className="eyebrow">{intro.tag}</span>
                <p className="display-title mt-4 text-[24px] text-ink">{intro.title}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-mid">{intro.text}</p>
              </div>
              <Link href={item.href} className="arrow-link mt-8 self-start text-ink">
                {intro.cta} <span aria-hidden="true">↗</span>
              </Link>
            </div>
          )}
          <div className="grid flex-1 grid-cols-3 content-start overflow-hidden xl:grid-cols-4">
            {item.children?.map((child, i) => (
              <Link
                key={child.href}
                href={child.href}
                className={`group/item -mb-px -mr-px flex gap-3 border-b border-r border-line px-5 py-4 transition-colors hover:bg-paper ${
                  pathname === child.href ? "bg-paper" : ""
                }`}
              >
                <span className="pt-[3px] text-[10px] tracking-[0.18em] text-bronze">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-3 text-[14px] font-medium leading-snug">
                    {child.label}
                    <span aria-hidden="true" className="text-bronze opacity-0 transition-opacity group-hover/item:opacity-100">
                      ↗
                    </span>
                  </span>
                  {child.description && (
                    <span className="mt-1 line-clamp-1 text-[12px] leading-relaxed text-mid">{child.description}</span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Menú lateral para móvil y tableta (por debajo de lg). */
function MobileDrawer({
  open,
  onClose,
  pathname,
  isActive,
  settings,
  items,
  locale,
  t,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  isActive: (href: string) => boolean;
  settings?: SiteSettings;
  items: NavItem[];
  locale: Locale;
  t: NavCopy;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const current = items.find((item) => item.children && isActive(item.href));
    setExpanded(current?.href ?? null);
  }, [open, items, isActive]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      closeRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const telHref = settings ? `tel:${settings.telefono.replace(/[^+\d]/g, "")}` : undefined;

  return (
    <div
      id="mobile-menu"
      aria-hidden={!open}
      className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div
        className={`absolute inset-y-0 right-0 flex w-full max-w-sm transform flex-col justify-between overflow-y-auto bg-surface p-[22px] text-ink transition-transform duration-300 ease-out sm:p-8 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between border-b border-line pb-5">
            <Image src="/logo-alko-footer.webp" skeleton={false} alt="ALKO" width={140} height={36} className="h-8 w-auto object-contain" />
            <button
              ref={closeRef}
              type="button"
              aria-label={t.closeMenu}
              onClick={onClose}
              className="p-2 text-ink/70 transition hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav aria-label={t.mobileLabel} className="mt-4">
            {items.map((item) =>
              item.children ? (
                <div key={item.href} className="border-b border-line">
                  <button
                    type="button"
                    aria-expanded={expanded === item.href}
                    onClick={() => setExpanded(expanded === item.href ? null : item.href)}
                    className="flex w-full items-center justify-between py-4 text-base"
                  >
                    <span>{item.label}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className={`h-4 w-4 transition-transform duration-200 ${expanded === item.href ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {expanded === item.href && (
                    <div className="space-y-1 pb-4">
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="block py-2 text-[11px] uppercase tracking-[0.12em] text-bronze"
                      >
                        {t.viewAll} ↗
                      </Link>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={`block py-2 text-[15px] ${
                            pathname === child.href ? "text-bronze" : "text-ink/80 hover:text-ink"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`block border-b border-line py-4 text-base ${
                    isActive(item.href) ? "text-bronze" : "text-ink hover:text-bronze"
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
            <Link
              href={localizedPath(ROUTES.contact, locale)}
              onClick={onClose}
              className="block border-b border-line py-4 text-base text-ink hover:text-bronze"
            >
              {t.contact}
            </Link>
          </nav>
          <LanguageSwitch
            pathname={pathname}
            locale={locale}
            label={t.language}
            className="mt-6"
            itemClass={(active) => (active ? "text-ink font-semibold" : "text-ink/50 hover:text-ink")}
          />
        </div>

        <div className="space-y-4 pt-8">
          {settings && (
            <div className="space-y-1 text-[13px] text-mid">
              <a href={telHref} className="block hover:text-ink">
                {settings.telefono}
              </a>
              <a href={`mailto:${settings.email}`} className="block break-all hover:text-ink">
                {settings.email}
              </a>
            </div>
          )}
          <ContactTrigger mode="avanzado" source={t.ctaSourceMobile} className="btn btn-ink w-full">
            {t.cta} <span aria-hidden="true">↗</span>
          </ContactTrigger>
        </div>
      </div>
    </div>
  );
}
