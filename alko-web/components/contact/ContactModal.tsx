"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import ContactForm from "@/components/ui/ContactForm";
import QuickContactForm from "@/components/ui/QuickContactForm";
import type { ContactMode } from "./ContactModalProvider";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]",
]
  .map((selector) => `${selector}:not([tabindex="-1"])`)
  .join(", ");

/**
 * Diálogo de contacto: foco atrapado dentro, se cierra con Escape o pulsando fuera, bloquea el
 * scroll de la página y devuelve el foco al botón que lo abrió.
 */
export default function ContactModal({
  mode,
  source,
  tipo,
  projectTypes,
  email,
  whatsappHref,
  onClose,
  onSwitch,
}: {
  mode: ContactMode;
  source?: string;
  tipo?: string;
  projectTypes: string[];
  email: string;
  whatsappHref: string;
  onClose: () => void;
  onSwitch: (mode: ContactMode) => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [sent, setSent] = useState(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Animación de entrada, bloqueo del scroll y devolución del foco al cerrar.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => setEntered(true));

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, []);

  // Foco inicial: el primer campo del formulario (o, si no, el botón de cerrar).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const target =
      dialog.querySelector<HTMLElement>("[data-autofocus]") ??
      dialog.querySelector<HTMLElement>("form input:not([name=website]):not([type=hidden])") ??
      dialog.querySelector<HTMLElement>(FOCUSABLE);
    target?.focus({ preventScroll: true });
  }, [mode]);

  // Escape cierra; Tab no sale del diálogo.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const rapido = mode === "rapido";
  const switchClass =
    "group inline-flex items-center gap-2 border-b border-white/60 pb-1 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:border-amber-500 hover:text-amber-500";

  return (
    <div className="fixed inset-0 z-[90]">
      {/* Fondo: al pulsarlo se cierra */}
      <div
        aria-hidden="true"
        onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        className={`absolute inset-0 bg-stone-950/75 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className="pointer-events-none relative flex h-full items-end justify-center sm:items-center sm:p-6"
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={`pointer-events-auto flex max-h-[96dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-stone-950 text-white shadow-2xl transition-all duration-300 motion-reduce:transition-none sm:max-h-[90dvh] sm:rounded-sm ${
            rapido ? "sm:max-w-lg" : "sm:max-w-3xl"
          } ${entered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          <div className="flex items-start justify-between gap-6 border-b border-white/10 px-6 pb-5 pt-6 sm:px-10 sm:pt-8">
            <div>
              <span className="block font-mono text-[11px] tracking-[0.25em] text-white/50 uppercase">
                {rapido ? "Contacto" : "Solicitud de presupuesto"}
              </span>
              <h2
                id={titleId}
                className="mt-3 font-serif font-light text-3xl leading-tight tracking-tight sm:text-4xl"
              >
                {rapido ? "Déjanos tus datos" : "Cuéntanos tu proyecto"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/90 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          <div className="overflow-y-auto overscroll-contain px-6 py-8 sm:px-10 sm:py-10">
            {rapido ? (
              <>
                <QuickContactForm
                  key="rapido"
                  source={source}
                  email={email}
                  whatsappHref={whatsappHref}
                  onClose={onClose}
                  onSent={() => setSent(true)}
                />
                {!sent && (
                  <div className="mt-10 border-t border-white/10 pt-6">
                    <p className="mb-3 text-sm font-light text-white/50">
                      ¿Prefieres contarnos el proyecto con más detalle y adjuntar planos?
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSent(false);
                        onSwitch("avanzado");
                      }}
                      className={switchClass}
                    >
                      Abrir el formulario completo
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <ContactForm
                  key="avanzado"
                  projectTypes={projectTypes}
                  email={email}
                  whatsappHref={whatsappHref}
                  defaultTipo={tipo}
                  source={source}
                  onClose={onClose}
                  onSent={() => setSent(true)}
                />
                {!sent && (
                  <div className="mt-10 border-t border-white/10 pt-6">
                    <p className="mb-3 text-sm font-light text-white/50">
                      ¿Prefieres que te contactemos sin más detalles?
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSent(false);
                        onSwitch("rapido");
                      }}
                      className={switchClass}
                    >
                      Déjanos solo tus datos
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
