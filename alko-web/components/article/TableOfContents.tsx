"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/articles";

/** Índice del artículo; resalta el apartado que se está leyendo. */
export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          setActive(top.target.id);
        }
      },
      { rootMargin: "-120px 0px -65% 0px" },
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Índice del artículo">
      <ol className="space-y-1 border-l border-stone-200">
        {items.map((item, index) => {
          const current = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? "true" : undefined}
                className={`-ml-px flex gap-3 border-l-2 py-1.5 pl-4 pr-2 text-sm leading-snug transition-colors ${
                  current
                    ? "border-amber-700 text-stone-900"
                    : "border-transparent text-stone-500 hover:text-stone-900"
                }`}
              >
                <span className="font-mono text-[11px] tabular-nums text-amber-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
