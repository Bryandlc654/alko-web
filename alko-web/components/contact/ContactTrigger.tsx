"use client";

import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { ROUTES } from "@/lib/site";
import { useContactModal, type ContactMode } from "./ContactModalProvider";

/**
 * Botón de contacto que abre el formulario en un modal.
 *
 * Sigue siendo un enlace a /contacto#formulario: sin JavaScript, o al abrirlo en otra pestaña
 * (Ctrl o clic central), lleva a la página de contacto.
 */
export default function ContactTrigger({
  mode,
  source,
  tipo,
  className,
  onClick,
  children,
}: {
  mode: ContactMode;
  /** Nombre del botón o de su zona (p. ej. «Cabecera»); se le añade la página actual. */
  source: string;
  /** Tipo de proyecto que se marca de entrada (solo formulario completo). */
  tipo?: string;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  children: ReactNode;
}) {
  const modal = useContactModal();
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || !modal) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    // En la página de contacto el formulario completo ya está a la vista: se baja hasta él.
    if (mode === "avanzado" && pathname === ROUTES.contact) return;

    event.preventDefault();
    modal.open(mode, { source: `${source} · ${pathname}`, tipo });
  }

  return (
    <a
      href={`${ROUTES.contact}#formulario`}
      // El cargador de rutas no debe animar: este clic abre un modal, no cambia de página.
      data-modal-trigger=""
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
