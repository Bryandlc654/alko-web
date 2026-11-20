"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { localeFromPath } from "@/lib/i18n";

/** Carrusel horizontal con scroll-snap y flechas que se desactivan en los extremos. */
export default function Rail({ children, label }: { children: ReactNode; label: string }) {
  const en = localeFromPath(usePathname()) === "en";
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft >= el.scrollWidth - el.clientWidth - 2 });
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const move = (dir: 1 | -1) => {
    const el = ref.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: (first.offsetWidth + 8) * dir, behavior: reduce ? "auto" : "smooth" });
  };

  const arrow =
    "grid h-11 w-11 place-items-center rounded-full border border-ink/25 transition-colors hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30";

  return (
    <div>
      <div
        ref={ref}
        onScroll={sync}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:flex-none [&>*]:snap-start"
      >
        {children}
      </div>
      <div className="mt-8 flex justify-center gap-2">
        <button type="button" className={arrow} onClick={() => move(-1)} disabled={edges.start} aria-label={en ? "Previous" : "Anterior"}>
          ←
        </button>
        <button type="button" className={arrow} onClick={() => move(1)} disabled={edges.end} aria-label={en ? "Next" : "Siguiente"}>
          →
        </button>
      </div>
    </div>
  );
}
