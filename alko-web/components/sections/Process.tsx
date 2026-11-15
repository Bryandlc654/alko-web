"use client";

import Image from "next/image";
import { useState } from "react";
import type { Fase } from "@/lib/types";

/** Extrae el número de fase (p. ej. "(01)") a partir del tag o del índice. */
function phaseNumber(fase: Fase, index: number) {
  const match = fase.tag.match(/\d{1,2}/);
  return (match ? match[0] : String(index + 1)).padStart(2, "0");
}

/**
 * Fases del proceso · Propuesta 6 (método de la V4): fondo carbón, introducción fija
 * con una imagen que cambia según la fase señalada y la lista de fases a la derecha.
 */
export default function Process({
  fases,
  id = "metodo",
  content,
}: {
  fases: Fase[];
  id?: string;
  content?: {
    procesoTitulo?: string;
    procesoSubtitulo?: string;
    procesoColHeading?: string;
    procesoColText?: string;
  };
}) {
  const [active, setActive] = useState(0);
  if (fases.length === 0) return null;

  return (
    <section id={id} className="bg-ink text-paper">
      <div className="site-wrap grid grid-cols-12 gap-x-6 gap-y-14 py-24 lg:py-36">
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-36">
            <p className="eyebrow eyebrow-light reveal-item">
              {content?.procesoSubtitulo || `Nuestro proceso · ${fases.length} fases · 1 equipo`}
            </p>
            <h2 className="reveal-item display-title mt-6 text-5xl leading-[1.02] sm:text-6xl">
              {content?.procesoTitulo || "Nuestro proceso"}
            </h2>
            <p className="reveal-item mt-8 max-w-sm leading-relaxed text-paper/60">
              {content?.procesoColText ||
                "Un único equipo coordina construcción, instalaciones, compras y gestión técnica para mantener el proyecto bajo control."}
            </p>
            <div className="reveal-item relative mt-12 hidden aspect-[4/3] overflow-hidden lg:block">
              {fases.map((fase, i) => (
                <Image
                  key={fase.id}
                  src={fase.imagen}
                  alt={i === active ? `ALKO · Fase ${phaseNumber(fase, i)} · ${fase.title}` : ""}
                  fill
                  sizes="30vw"
                  className={`object-cover transition-opacity duration-500 ${i === active ? "opacity-90" : "opacity-0"}`}
                />
              ))}
            </div>
          </div>
        </div>

        <ol className="col-span-12 border-t border-paper/15 lg:col-span-7 lg:col-start-6">
          {fases.map((fase, i) => (
            <li
              key={fase.id}
              onMouseEnter={() => setActive(i)}
              className="reveal-item group grid grid-cols-[64px_1fr] gap-4 border-b border-paper/15 py-10 sm:grid-cols-[110px_1fr]"
            >
              <span
                className={`display-title text-4xl transition-colors sm:text-5xl ${
                  i === active ? "text-bronze-light" : "text-paper/30 group-hover:text-bronze-light"
                }`}
              >
                {phaseNumber(fase, i)}
              </span>
              <div>
                <h3 className="display-title text-2xl sm:text-3xl">{fase.title}</h3>
                <p className="mt-3 max-w-lg leading-relaxed text-paper/60">{fase.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
