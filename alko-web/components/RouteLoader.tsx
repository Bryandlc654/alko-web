"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Phase = "idle" | "loading" | "done";

/** Tiempo mínimo visible del velo, para que la transición no parpadee. */
const MIN_VISIBLE = 220;
/** Duración del desvanecimiento de salida. */
const FADE_OUT = 300;
/** Red de seguridad por si una navegación no llega a completarse. */
const SAFETY = 8000;

/**
 * Animación corta de carga al cambiar de página.
 *
 * No hay un evento global de navegación en el App Router, así que se detecta el
 * clic en enlaces internos y se cierra cuando cambia `usePathname`. La barra y
 * el velo están definidos en `globals.css` (clases `.route-loader*`).
 */
export default function RouteLoader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const timers = useRef<number[]>([]);
  const startedAt = useRef(0);
  const firstRoute = useRef(true);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const finish = useCallback(() => {
    if (phaseRef.current !== "loading") return;
    clearTimers();

    const wait = Math.max(0, MIN_VISIBLE - (Date.now() - startedAt.current));
    timers.current.push(
      window.setTimeout(() => {
        phaseRef.current = "done";
        setPhase("done");
        timers.current.push(
          window.setTimeout(() => {
            phaseRef.current = "idle";
            setPhase("idle");
          }, FADE_OUT),
        );
      }, wait),
    );
  }, [clearTimers]);

  const finishRef = useRef(finish);
  useEffect(() => {
    finishRef.current = finish;
  }, [finish]);

  const start = useCallback(() => {
    clearTimers();
    phaseRef.current = "loading";
    startedAt.current = Date.now();
    setPhase("loading");
    timers.current.push(window.setTimeout(() => finishRef.current(), SAFETY));
  }, [clearTimers]);

  // Cierra la animación cuando la nueva ruta ya está montada.
  useEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    finishRef.current();
  }, [pathname]);

  // Detecta clics en enlaces internos para iniciar la animación.
  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href") ?? "";
      if (!href.startsWith("/") || href.startsWith("//")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Misma ruta (p. ej. solo cambia el hash): no hay transición de página.
      if (url.pathname === window.location.pathname) return;

      start();
    }

    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, [start]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  if (phase === "idle") return null;

  return (
    <div
      className={`route-loader${phase === "done" ? " is-done" : ""}`}
      aria-hidden="true"
    >
      <div className="route-loader__bar" />
      <div className="route-loader__veil">
        <div className="route-loader__mark">
          <span className="route-loader__logo">ALKO</span>
          <span className="route-loader__line" />
        </div>
      </div>
    </div>
  );
}
