"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import ContactTrigger from "@/components/contact/ContactTrigger";
import { localizedPath, type Locale } from "@/lib/i18n";
import { HOME_COPY } from "@/lib/i18n/home";
import { ROUTES } from "@/lib/site";
import type { Slide } from "@/lib/types";

const DURATION = 6500;

/**
 * Hero de la propuesta 6 (parte superior de la V4): imágenes a sangre con fundido
 * y zoom lento, titular abajo a la izquierda y controles con barras de progreso.
 * Avanza solo; se pausa con el cursor, el foco o «reducir movimiento».
 */
export default function HomeHero({ slides, locale = "es" }: { slides: Slide[]; locale?: Locale }) {
  const copy = HOME_COPY[locale];
  const t = copy.hero;
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

  // Diapositivas cuya imagen ya se puede descargar. Al principio solo la primera, para que no
  // compita con nada; la siguiente se pide cuando la actual termina de cargar, así está lista
  // antes del fundido.
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0]));
  const mount = useCallback((i: number) => {
    setMounted((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
  }, []);

  const [loaded, setLoaded] = useState<Set<number>>(() => new Set());
  const markLoaded = useCallback((i: number) => {
    setLoaded((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
  }, []);
  useEffect(() => {
    if (total > 1 && loaded.has(index)) mount((index + 1) % total);
  }, [index, loaded, total, mount]);

  const go = useCallback(
    (next: number) => {
      const target = ((next % total) + total) % total;
      mount(target);
      setIndex(target);
    },
    [total, mount],
  );

  const running = total > 1 && !paused && !reduced;
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => go(index + 1), DURATION);
    return () => window.clearTimeout(timer);
  }, [running, index, go]);

  // Rótulo de cada imagen del carrusel (se repiten si hay más imágenes que rótulos).
  const caption = (i: number) => t.captions[i % t.captions.length];

  return (
    <header
      className="relative isolate h-[100svh] max-h-[1100px] min-h-[620px] w-full overflow-hidden bg-ink text-paper"
      data-hero-parallax
      aria-roledescription={t.roledescription}
      aria-label={t.label}
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
      <div data-hero-bg className="absolute inset-0 -z-20">
        {slides.map((slide, i) => (
          <figure key={slide.id} className={`hh-slide ${i === index ? "is-active" : ""}`} aria-hidden={i !== index}>
            {mounted.has(i) && (
              <Image
                src={slide.image}
                alt={t.alts[slide.image] ?? slide.alt}
                fill
                priority={i === 0}
                quality={82}
                sizes="100vw"
                className="object-cover"
                onLoad={() => markLoaded(i)}
              />
            )}
          </figure>
        ))}
      </div>
      {/* Velo solo abajo: imagen limpia y titular legible */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/35" />

      <div data-hero-fg className="site-wrap flex h-full flex-col justify-end pb-10 lg:pb-14">
        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-10">
          <div className="col-span-12 lg:col-span-8">
            <h1 className="hh-rise display-title text-[2.9rem] leading-[.98] tracking-[-0.035em] sm:text-6xl xl:text-[5.4rem]">
              {/* Palabra clave principal dentro del H1, visible como antetítulo. */}
              <span className="eyebrow mb-6 block leading-[1.4] tracking-[0.22em] text-paper sm:text-[11px] [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">
                {t.keyword}
              </span>
              <span className="sm:whitespace-nowrap">{t.titleA}</span>
              <br />
              {t.titleB}
            </h1>
            <div className="hh-rise mt-9 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ animationDelay: ".25s" }}>
              <Link href={localizedPath(ROUTES.projects, locale)} className="btn btn-paper">
                {t.explore} <span aria-hidden="true">↗</span>
              </Link>
              <ContactTrigger
                mode="avanzado"
                source={`Portada${copy.sourceSuffix}`}
                className="border-b border-paper/50 pb-1 text-[11px] uppercase tracking-[0.22em] transition-colors hover:border-paper"
              >
                {t.present}
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
                    aria-label={t.prev}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => go(index + 1)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-paper/40 transition-colors hover:bg-paper hover:text-ink"
                    aria-label={t.next}
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
                    aria-label={`${t.view} ${caption(i)}`}
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
