"use client";

import { useId, useState } from "react";
import ContactTrigger from "@/components/contact/ContactTrigger";
import { HOME_FAQ } from "@/lib/faq";

/** Preguntas frecuentes en acordeón, con una tarjeta de contacto lateral (propuesta 6 · V5). */
export default function HomeFaq() {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();

  return (
    <section id="preguntas" className="bg-paper pb-24 pt-24 text-ink md:pt-32">
      <div className="site-wrap text-center">
        <p className="eyebrow reveal-item">Preguntas frecuentes</p>
        <h2 className="reveal-item display-title mt-5 text-[40px] md:text-[56px]">
          Preguntas que
          <br />
          merece la pena hacer
        </h2>
      </div>

      <div className="site-wrap mt-16 grid items-start gap-10 md:grid-cols-[1fr_auto] lg:grid-cols-[1fr_564px_1fr]">
        <div className="mx-auto w-full max-w-[564px] lg:col-start-2">
          {HOME_FAQ.map((item, i) => {
            const isOpen = open === i;
            const panelId = `${uid}-faq-${i}`;
            return (
              <div key={item.q} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="grid w-full grid-cols-[56px_1fr_24px] items-start py-6 text-left"
                  >
                    <span className="text-[13px] text-bronze">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[17px]">{item.q}</span>
                    <span
                      className={`text-2xl leading-none transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  className={`grid transition-[grid-template-rows] duration-[450ms] ease-alko ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="pb-7 pl-14">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-mid">Respuesta</p>
                      <p className="mt-3 leading-relaxed text-mid">{item.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <ContactTrigger
          mode="avanzado"
          source="Portada · Preguntas"
          className="reveal-item hidden items-center gap-3 justify-self-end bg-white px-3 py-2.5 text-[10px] uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-paper md:inline-flex"
        >
          Haz tu pregunta <span aria-hidden="true">→</span>
        </ContactTrigger>
      </div>
    </section>
  );
}
