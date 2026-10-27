"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Mail, MessageCircle, Phone, X } from "lucide-react";
import ContactTrigger from "@/components/contact/ContactTrigger";
import {
  buildMainNav,
  ROUTES,
  TRANSPARENT_HEADER_ROUTES,
  type NavItem,
  type ServiceLink,
} from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

/**
 * Cabecera fija compartida por todas las rutas.
 *
 * - Transparente al inicio en páginas con hero oscuro (rutas en
 *   TRANSPARENT_HEADER_ROUTES); sólida en el resto.
 * - En móvil y tableta el menú es un panel lateral (MobileDrawer). Va fuera de
 *   #site-nav porque el backdrop-filter de la cabecera la convierte en el bloque
 *   contenedor de sus hijos `fixed` y el panel quedaría recortado a su altura.
 * - El estado del panel lo gestiona React, de modo que se cierra al navegar.
 */
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
            {items.map((link) =>
              link.children ? (
                <div key={link.href} className="group relative">
                  <Link
                    href={link.href}
                    className={`inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase font-light transition-colors ${
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
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="min-w-[11rem] rounded-xl border border-white/10 bg-stone-950/95 p-2 shadow-2xl backdrop-blur-md">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block whitespace-nowrap rounded-lg px-4 py-2.5 text-xs tracking-[0.16em] uppercase font-light transition-colors ${
                            pathname === child.href
                              ? "text-white"
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs tracking-[0.2em] uppercase font-light transition-colors ${
                    isActive(link.href) ? "text-white" : "text-white/75 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* En móvil el botón va dentro del panel lateral, para no saturar la barra. */}
            <ContactTrigger mode="rapido" source="Cabecera" className="hidden sm:inline-flex items-center justify-center px-6 sm:px-7 py-2.5 rounded-full bg-amber-700 hover:bg-amber-800 text-white text-[11px] sm:text-xs font-light tracking-[0.16em] uppercase active:scale-95 transition-all shadow-md">
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
  // Submenú desplegado: al abrir, el de la sección en la que estamos.
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setExpanded(items.find((link) => link.children && isActive(link.href))?.href ?? null);

    // Bloquea el scroll de la página, cierra con Escape y lleva el foco al panel.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      document.getElementById("mobile-menu-btn")?.focus({ preventScroll: true });
    };
    // Solo al abrir o cerrar: isActive y onClose se recrean en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const telHref = settings?.telefono ? `tel:${settings.telefono.replace(/[^+\d]/g, "")}` : null;
  const waHref = settings?.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}` : null;

  return (
    <div className={`lg:hidden ${open ? "" : "pointer-events-none"}`}>
      {/* Velo */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-stone-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-[70] flex w-[86%] max-w-sm flex-col bg-stone-950 text-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <Link href={ROUTES.home} onClick={onClose} className="flex items-center">
            <Image src="/logo.webp" alt="ALKO" width={500} height={130} sizes="140px" className="h-8 w-auto" />
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/90 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-4" aria-label="Principal">
          <ul className="divide-y divide-white/10">
            {items.map((link, i) => {
              const numero = String(i + 1).padStart(2, "0");
              const active = isActive(link.href);
              const isOpen = expanded === link.href;

              return (
                <li key={link.href} className="py-1">
                  {link.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : link.href)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center gap-4 py-4 text-left"
                      >
                        <span className="font-mono text-[10px] tracking-[0.2em] text-amber-600">{numero}</span>
                        <span
                          className={`flex-1 font-serif font-light text-2xl tracking-tight ${
                            active ? "text-white" : "text-white/80"
                          }`}
                        >
                          {link.label}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-white/60 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </button>
                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <ul className="overflow-hidden" inert={!isOpen}>
                          {link.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={onClose}
                                aria-current={pathname === child.href ? "page" : undefined}
                                className={`flex items-center gap-3 py-2.5 pl-10 text-sm tracking-[0.12em] uppercase transition-colors ${
                                  pathname === child.href ? "text-amber-500" : "text-white/60 hover:text-white"
                                }`}
                              >
                                <span
                                  aria-hidden="true"
                                  className={`h-px w-4 ${pathname === child.href ? "bg-amber-500" : "bg-white/30"}`}
                                />
                                {child.label}
                              </Link>
                            </li>
                          ))}
                          <li className="h-3" aria-hidden="true" />
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className="flex items-center gap-4 py-4"
                    >
                      <span className="font-mono text-[10px] tracking-[0.2em] text-amber-600">{numero}</span>
                      <span
                        className={`flex-1 font-serif font-light text-2xl tracking-tight ${
                          active ? "text-white" : "text-white/80"
                        }`}
                      >
                        {link.label}
                      </span>
                      {active && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 px-6 pb-8 pt-6">
          <ContactTrigger mode="avanzado" source="Menú móvil" onClick={onClose} className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-700 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-amber-800">
            Solicitar presupuesto
            <span aria-hidden="true">→</span>
          </ContactTrigger>
          <ContactTrigger
            mode="rapido"
            source="Menú móvil"
            onClick={onClose}
            className="mt-3 flex w-full items-center justify-center rounded-full border border-white/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
          >
            Contactar
          </ContactTrigger>
          {settings && (
            <ul className="mt-6 space-y-3 text-sm font-light text-white/70">
              {telHref && (
                <li>
                  <a href={telHref} className="flex items-center gap-3 transition-colors hover:text-white">
                    <Phone className="h-4 w-4 text-amber-600" strokeWidth={1.5} aria-hidden="true" />
                    {settings.telefono}
                  </a>
                </li>
              )}
              {settings.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-3 transition-colors hover:text-white"
                  >
                    <Mail className="h-4 w-4 text-amber-600" strokeWidth={1.5} aria-hidden="true" />
                    {settings.email}
                  </a>
                </li>
              )}
              {waHref && (
                <li>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 transition-colors hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4 text-amber-600" strokeWidth={1.5} aria-hidden="true" />
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
