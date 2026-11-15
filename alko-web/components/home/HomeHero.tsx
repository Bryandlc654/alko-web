"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import ContactTrigger from "@/components/contact/ContactTrigger";
import { ROUTES } from "@/lib/site";
import type { Slide } from "@/lib/types";

const DURATION = 6500;
/** Rótulo de cada imagen del carrusel (se repiten si hay más imágenes que rótulos). */
const CAPTIONS = ["Construcción integral", "Residential", "Arquitectura interior", "Corporate"];

/**
 * Hero de la propuesta 6 (parte superior de la V4): imágenes a sangre con fundido
 * y zoom lento, titular abajo a la izquierda y controles con barras de progreso.
 * Avanza solo; se pausa con el cursor, el foco o «reducir movimiento».
 */
export default function HomeHero({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchX = useRef<number | null>(null);
  const total = slides.length;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    const onChange = () => setReduced(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const go = useCallback((next: number) => setIndex(((next % total) + total) % total), [total]);

  const running = total > 1 && !paused && !reduced;
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => go(index + 1), DURATION);
    return () => window.clearTimeout(timer);
  }, [running, index, go]);

  const caption = (i: number) => CAPTIONS[i % CAPTIONS.length];

  return (
    <header
      className="relative isolate h-[100svh] max-h-[1100px] min-h-[620px] w-full overflow-hidden bg-ink text-paper"
      aria-roledescription="carrusel"
      aria-label="Ámbitos de ALKO"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div className="absolute inset-0 -z-20">
        {slides.map((slide, i) => (
          <figure key={slide.id} className={`hh-slide ${i === index ? "is-active" : ""}`} aria-hidden={i !== index}>
            <Image src={slide.image} alt={slide.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
          </figure>
        ))}
      </div>
      {/* Velo solo abajo: imagen limpia y titular legible */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/35" />

      <div className="site-wrap flex h-full flex-col justify-end pb-10 lg:pb-14">
        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-10">
          <div className="col-span-12 lg:col-span-8">
            <h1 className="hh-rise display-title text-[2.9rem] leading-[.98] tracking-[-0.035em] sm:text-6xl xl:text-[5.4rem]">
              <span className="sm:whitespace-nowrap">Construimos espacios</span>
              <br />
              que permanecen.
            </h1>
            <div className="hh-rise mt-9 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ animationDelay: ".25s" }}>
              <Link href={ROUTES.projects} className="btn btn-paper">
                Explorar proyectos <span aria-hidden="true">↗</span>
              </Link>
              <ContactTrigger
                mode="avanzado"
                source="Portada"
                className="border-b border-paper/50 pb-1 text-[11px] uppercase tracking-[0.22em] transition-colors hover:border-paper"
              >
                Presentar proyecto
              </ContactTrigger>
            </div>
          </div>

          {total > 1 && (
            <div className="hh-rise col-span-12 w-full lg:col-span-4 lg:max-w-sm lg:justify-self-end" style={{ animationDelay: ".45s" }}>
              <div className="flex items-end justify-between gap-6">
                <p className="text-[10px] uppercase tracking-[0.22em] text-paper/80" aria-live="polite">
                  <span className="text-paper">{String(index + 1).padStart(2, "0")}</span>
                  <span className="mx-2 text-paper/40">/</span>
                  {String(total).padStart(2, "0")}
                  <span className="mx-3 text-paper/40">·</span>
                  {caption(index)}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => go(index - 1)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-paper/40 transition-colors hover:bg-paper hover:text-ink"
                    aria-label="Imagen anterior"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => go(index + 1)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-paper/40 transition-colors hover:bg-paper hover:text-ink"
                    aria-label="Imagen siguiente"
                  >
                    →
                  </button>
                </div>
              </div>
              <div className="mt-5 grid gap-2" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
                {slides.map((slide, i) => (
                  <button
                    key={`${slide.id}-${i === index ? index : "x"}`}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Ver ${caption(i)}`}
                    aria-current={i === index}
                    className={`hh-bar ${i < index || (i === index && !running) ? "done" : ""} ${i === index && running ? "run" : ""}`}
                    style={{ "--dur": `${DURATION}ms` } as CSSProperties}
                  >
                    <i>
                      <span />
                    </i>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
