"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { METHOD_STEPS } from "@/lib/divisions";
import { METHOD_HREF } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import { HOME_COPY } from "@/lib/i18n/home";

/**
 * Método ALKO sobre fondo carbón: introducción fija con una imagen que cambia
 * según la etapa que se señala (propuesta 6 · V4).
 */
export default function MethodSteps({ locale = "es" }: { locale?: Locale }) {
  const t = HOME_COPY[locale].method;
  // Imagen y número de METHOD_STEPS; título y texto del idioma.
  const steps = METHOD_STEPS.map((step, i) => ({ ...step, ...t.steps[i] }));
  const [active, setActive] = useState(0);

  return (
    <section id="metodo" className="bg-ink text-paper">
      <div className="site-wrap grid grid-cols-12 gap-x-6 gap-y-14 py-24 lg:py-36">
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-36">
            <p className="eyebrow eyebrow-light reveal-item">{t.eyebrow}</p>
            <h2 className="reveal-item display-title mt-6 text-5xl leading-[1.02] sm:text-6xl">
              {t.titleA}
              <br />
              {t.titleB}
            </h2>
            <p className="reveal-item mt-8 max-w-sm leading-relaxed text-paper/60">
              {t.text}
            </p>
            <Link href={METHOD_HREF} className="reveal-item arrow-link mt-8 text-paper">
              {t.cta} <span aria-hidden="true">↗</span>
            </Link>
            <div className="reveal-item relative mt-12 hidden aspect-[4/3] overflow-hidden lg:block">
              {steps.map((step, i) => (
                <Image
                  key={step.num}
                  src={step.image}
                  alt={i === active ? step.title : ""}
                  fill
                  sizes="30vw"
                  className={`object-cover transition-opacity duration-500 ${i === active ? "opacity-90" : "opacity-0"}`}
                />
              ))}
            </div>
          </div>
        </div>

        <ol className="col-span-12 border-t border-paper/15 lg:col-span-7 lg:col-start-6">
          {steps.map((step, i) => (
            <li
              key={step.num}
              onMouseEnter={() => setActive(i)}
              className="reveal-item group grid grid-cols-[64px_1fr] gap-4 border-b border-paper/15 py-10 sm:grid-cols-[110px_1fr]"
            >
              <span
                className={`display-title text-4xl transition-colors sm:text-5xl ${
                  i === active ? "text-bronze-light" : "text-paper/30 group-hover:text-bronze-light"
                }`}
              >
                {step.num}
              </span>
              <div>
                <h3 className="display-title text-2xl sm:text-3xl">{step.title}</h3>
                <p className="mt-3 max-w-lg leading-relaxed text-paper/60">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
