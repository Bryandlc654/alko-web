"use client";

import Image from "@/components/ui/Image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface LightboxItem {
  src: string;
  alt: string;
}

/**
 * Visor a pantalla completa para las fotos de un bloque. Cualquier elemento hijo con
 * `data-lightbox-src` (y opcionalmente `data-lightbox-alt`) se abre en grande al pulsarlo;
 * el orden de navegación es el del DOM. Teclado: flechas para pasar y Escape para cerrar.
 */
export default function Lightbox({ children, className }: { children: ReactNode; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);
  const [items, setItems] = useState<LightboxItem[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  const collect = useCallback((): HTMLElement[] => {
    return Array.from(rootRef.current?.querySelectorAll<HTMLElement>("[data-lightbox-src]") ?? []);
  }, []);

  const handleClick = (event: React.MouseEvent) => {
    const trigger = (event.target as HTMLElement).closest<HTMLElement>("[data-lightbox-src]");
    if (!trigger || !rootRef.current?.contains(trigger)) return;
    event.preventDefault();
    const nodes = collect();
    setItems(nodes.map((node) => ({ src: node.dataset.lightboxSrc ?? "", alt: node.dataset.lightboxAlt ?? "" })));
    setIndex(nodes.indexOf(trigger));
    openerRef.current = trigger;
  };

  const close = useCallback(() => {
    setIndex(null);
    openerRef.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => setIndex((current) => (current === null ? null : (current + delta + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [index, close, step]);

  const current = index !== null ? items[index] : null;

  return (
    <div ref={rootRef} onClick={handleClick} className={className}>
      {children}

      {/* En un portal: los bloques con animación de entrada usan transform y romperían el position: fixed. */}
      {current &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Visor de imágenes"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/95"
            onClick={(event) => {
              if (event.target === event.currentTarget) close();
            }}
            onTouchStart={(event) => {
              touchX.current = event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
              if (touchX.current === null) return;
              const delta = event.changedTouches[0].clientX - touchX.current;
              if (Math.abs(delta) > 50) step(delta < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <div className="relative h-[80vh] w-[92vw] max-w-6xl" onClick={close}>
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                fill
                sizes="92vw"
                className="object-contain"
                priority
              />
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-2xl leading-none text-white transition hover:bg-white/10"
            >
              ×
            </button>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Imagen anterior"
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-xl text-white transition hover:bg-white/10 sm:left-6"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Imagen siguiente"
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-xl text-white transition hover:bg-white/10 sm:right-6"
                >
                  →
                </button>
              </>
            )}

            <p className="absolute bottom-5 left-0 right-0 px-6 text-center font-mono text-[11px] tracking-[0.25em] text-white/70">
              {current.alt}
              {items.length > 1 && <span className="ml-3 text-white/50">{(index ?? 0) + 1} / {items.length}</span>}
            </p>
          </div>,
          document.body,
        )}
    </div>
  );
}
