"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ContactTrigger from "@/components/contact/ContactTrigger";
import {
  buildMainNav,
  ROUTES,
  TRANSPARENT_HEADER_ROUTES,
  type NavItem,
  type ServiceLink,
} from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

// Metadatos visuales y descriptivos para transformar los dropdowns en Mega Menús
interface MegaMenuConfig {
  tag: string;
  title: string;
  description: string;
  featuredImage: string;
  featuredLabel: string;
  featuredTitle: string;
  featuredHref: string;
}

const MEGA_MENUS: Record<string, MegaMenuConfig> = {
  [ROUTES.sectors]: {
    tag: "Especialidades",
    title: "Servicios y Sectores",
    description: "Dirección técnica unificada para proyectos corporativos y residenciales de alta exigencia.",
    featuredImage: "/oficinas.jpg",
    featuredLabel: "Destacado",
    featuredTitle: "Reformas de Oficinas",
    featuredHref: "/servicios/oficinas",
  },
  [ROUTES.company]: {
    tag: "Sobre Nosotros",
    title: "Estudio & Equipo",
    description: "Desde 1996 construyendo y reformando en Madrid con rigor constructivo y un solo interlocutor.",
    featuredImage: "/proceso-coordinacion.jpg",
    featuredLabel: "Cultura ALKO",
    featuredTitle: "Un solo equipo de principio a fin",
    featuredHref: ROUTES.company,
  },
  [ROUTES.articles]: {
    tag: "Recursos Técnicos",
    title: "Biblioteca y Conocimiento",
    description: "Guías, normativas, especificaciones y criterios constructivos para proyectar y construir mejor.",
    featuredImage: "/start-research-1.jpg",
    featuredLabel: "Guía recomendada",
    featuredTitle: "Planificar una reforma integral",
    featuredHref: `${ROUTES.guides}/planificar-reforma-integral`,
  },
};

export default function Nav({
  settings,
  services,
}: {
  settings?: SiteSettings;
  services?: ServiceLink[];
}) {
  const pathname = usePathname();
  const items = buildMainNav(services);
  const transparent = TRANSPARENT_HEADER_ROUTES.some((route) =>
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

  return (
    <>
      <div
        id="site-nav"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          solid ? "is-scrolled" : ""
        }`}
      >
        <nav className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 lg:py-8 flex items-center justify-between">
          <Link href={ROUTES.home} className="flex items-center group">
            <Image
              src="/logo.webp"
              alt="ALKO"
              width={500}
              height={130}
              sizes="170px"
              priority
              className="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            {items.map((link) => {
              const megaConfig = MEGA_MENUS[link.href];

              return link.children ? (
                <div key={link.href} className="group static">
                  <Link
                    href={link.href}
                    className={`inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase font-light transition-colors py-2 ${
                      isActive(link.href) ? "text-white" : "text-white/75 group-hover:text-white"
                    }`}
                  >
                    {link.label}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
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

                  {/* Mega Menú Flotante */}
                  <div className="invisible absolute left-6 right-6 top-full z-50 pt-3 opacity-0 transition-all duration-300 transform -translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0">
                    <div className="max-w-7xl mx-auto overflow-hidden rounded-2xl border border-white/15 bg-stone-950/95 shadow-2xl backdrop-blur-xl p-6 sm:p-8">
                      <div className="grid grid-cols-12 gap-8 items-stretch">
                        {/* Columna 1: Presentación / Encabezado del Mega Menú */}
                        <div className="col-span-3 border-r border-white/10 pr-6 flex flex-col justify-between">
                          <div>
                            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-amber-500 uppercase">
                              {megaConfig?.tag || "Navegación"}
                            </span>
                            <h3 className="mt-2 text-xl font-serif font-light text-white leading-snug">
                              {megaConfig?.title || link.label}
                            </h3>
                            <p className="mt-3 text-xs text-white/60 font-light leading-relaxed">
                              {megaConfig?.description || "Explora las secciones y contenidos disponibles."}
                            </p>
                          </div>

                          <Link
                            href={link.href}
                            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-amber-500 hover:text-amber-400 transition-colors pt-4"
                          >
                            <span>Ver todo</span>
                            <span>→</span>
                          </Link>
                        </div>

                        {/* Columna 2: Enlaces Organizadores */}
                        <div className="col-span-5 flex flex-col justify-center">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {link.children.map((child, idx) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={`group/item flex items-center justify-between rounded-xl px-4 py-3 text-xs tracking-wider uppercase font-light transition-all ${
                                  pathname === child.href
                                    ? "bg-amber-700/20 text-amber-400 border border-amber-700/30"
                                    : "text-white/80 hover:text-white hover:bg-white/10"
                                }`}
                              >
                                <span className="truncate pr-2">{child.label}</span>
                                <span className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-amber-500 text-xs">
                                  →
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Columna 3: Tarjeta con Imagen Destacada */}
                        <div className="col-span-4 pl-4 border-l border-white/10">
                          {megaConfig ? (
                            <Link
                              href={megaConfig.featuredHref}
                              className="group/card relative block h-full min-h-[180px] rounded-xl overflow-hidden border border-white/15 bg-stone-900"
                            >
                              <Image
                                src={megaConfig.featuredImage}
                                alt={megaConfig.featuredTitle}
                                fill
                                sizes="(max-width: 1280px) 300px, 400px"
                                className="object-cover object-center transition-transform duration-700 ease-out group-hover/card:scale-105 opacity-60 group-hover/card:opacity-80"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
                              <div className="absolute inset-x-0 bottom-0 p-5">
                                <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-amber-400 block mb-1">
                                  {megaConfig.featuredLabel}
                                </span>
                                <h4 className="font-serif text-base text-white font-light leading-snug group-hover/card:text-amber-200 transition-colors">
                                  {megaConfig.featuredTitle}
                                </h4>
                              </div>
                            </Link>
                          ) : (
                            <div className="h-full flex items-center justify-center p-6 rounded-xl border border-white/10 bg-white/5">
                              <span className="text-xs text-white/50 font-mono uppercase tracking-widest">
                                ALKO Arquitectura
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs tracking-[0.2em] uppercase font-light transition-colors py-2 ${
                    isActive(link.href) ? "text-white" : "text-white/75 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <ContactTrigger
              mode="rapido"
              source="Cabecera"
              className="hidden sm:inline-flex items-center justify-center px-6 sm:px-7 py-2.5 rounded-full bg-amber-700 hover:bg-amber-800 text-white text-[11px] sm:text-xs font-light tracking-[0.16em] uppercase active:scale-95 transition-all shadow-md"
            >
              Contactar
            </ContactTrigger>
            <button
              id="mobile-menu-btn"
              type="button"
              aria-label="Abrir menú"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
              className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-stone-950/30 text-white backdrop-blur-md transition hover:bg-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-[18px] h-[18px]"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
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
      />
    </>
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
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  isActive: (href: string) => boolean;
  settings?: SiteSettings;
  items: NavItem[];
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

  return (
    <div
      id="mobile-menu"
      aria-hidden={!open}
      className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`absolute inset-y-0 right-0 w-full max-w-sm bg-stone-950 text-white p-6 sm:p-8 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-out border-l border-white/10 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <Image
              src="/logo.webp"
              alt="ALKO"
              width={140}
              height={36}
              className="h-8 w-auto object-contain"
            />
            <button
              ref={closeRef}
              type="button"
              aria-label="Cerrar menú"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                className="w-5 h-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            </button>
          </div>

          <nav className="mt-8 space-y-4">
            {items.map((item) =>
              item.children ? (
                <div key={item.href} className="border-b border-white/10 pb-4">
                  <button
                    type="button"
                    onClick={() => setExpanded(expanded === item.href ? null : item.href)}
                    className="flex w-full items-center justify-between py-2 text-sm uppercase tracking-[0.2em] font-light text-white/90 hover:text-white"
                  >
                    <span>{item.label}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className={`h-4 w-4 transition-transform duration-200 ${
                        expanded === item.href ? "rotate-180" : ""
                      }`}
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {expanded === item.href && (
                    <div className="mt-2 space-y-2 pl-4 border-l border-amber-700/50">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={`block py-1.5 text-xs uppercase tracking-wider font-light ${
                            pathname === child.href ? "text-amber-500" : "text-white/70 hover:text-white"
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
                  className={`block py-2 text-sm uppercase tracking-[0.2em] font-light border-b border-white/10 ${
                    isActive(item.href) ? "text-amber-500" : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>

        <div className="pt-8">
          <ContactTrigger
            mode="rapido"
            source="Cabecera Móvil"
            className="w-full flex items-center justify-center py-3.5 rounded-full bg-amber-700 hover:bg-amber-800 text-white text-xs uppercase tracking-widest font-light shadow-lg"
          >
            Contactar
          </ContactTrigger>
        </div>
      </div>
    </div>
  );
}
