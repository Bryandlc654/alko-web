"use client";

import { useEffect, useRef } from "react";

/** Barra fina en la parte superior que indica cuánto se ha leído del artículo. */
export default function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    let frame = 0;

    function update() {
      frame = 0;
      if (!target || !bar.current) return;
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.5;
      const done = Math.min(1, Math.max(0, (window.innerHeight * 0.25 - rect.top) / Math.max(total, 1)));
      bar.current.style.transform = `scaleX(${done})`;
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [targetId]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-amber-700" />
    </div>
  );
}
