"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MAIN_NAV, ROUTES, TRANSPARENT_HEADER_ROUTES } from "@/lib/site";

/**
 * Cabecera fija compartida por todas las rutas.
 *
 * - Transparente al inicio en páginas con hero oscuro (rutas en
 *   TRANSPARENT_HEADER_ROUTES); sólida en el resto.
 * - El estado del menú móvil y del fondo los gestiona React, de modo que se
 *   cierran correctamente al navegar entre páginas.
 */
export default function Nav() {
  const pathname = usePathname();
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
          {MAIN_NAV.map((link) =>
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
                        className={`block rounded-lg px-4 py-2.5 text-xs tracking-[0.16em] uppercase font-light transition-colors ${
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
          <Link
            href={ROUTES.contact}
            className="inline-flex items-center justify-center px-6 sm:px-7 py-2.5 rounded-full bg-amber-700 hover:bg-amber-800 text-white text-[11px] sm:text-xs font-light tracking-[0.16em] uppercase active:scale-95 transition-all shadow-md"
          >
            Contactar
          </Link>
          <button
            id="mobile-menu-btn"
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="lg:hidden p-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition"
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

      <div
        id="mobile-menu"
        className={`${open ? "" : "hidden"} lg:hidden px-6 pb-6 border-t border-white/10 bg-stone-950/95 backdrop-blur-lg`}
      >
        <div className="flex flex-col gap-4 pt-4 text-xs tracking-widest uppercase font-light">
          {MAIN_NAV.map((link) => (
            <div key={link.href} className="flex flex-col gap-3">
              <Link
                href={link.href}
                className={isActive(link.href) ? "text-white" : "text-white/70 hover:text-white"}
              >
                {link.label}
              </Link>
              {link.children ? (
                <div className="flex flex-col gap-3 border-l border-white/10 pl-4">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={
                        pathname === child.href ? "text-white" : "text-white/60 hover:text-white"
                      }
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
