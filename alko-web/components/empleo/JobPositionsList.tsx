"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { PosicionEmpleo } from "@/lib/types";
import JobApplicationModal from "./JobApplicationModal";

interface JobPositionsListProps {
  posiciones: PosicionEmpleo[];
}

export default function JobPositionsList({ posiciones }: JobPositionsListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState("Candidatura espontánea");

  const openApplication = (puesto: string) => {
    setSelectedPuesto(puesto);
    setModalOpen(true);
  };

  return (
    <>
      <ul className="mt-4 divide-y divide-stone-200 border-b border-stone-200">
        {posiciones.map((p, i) => (
          <li key={p.titulo + i} className="reveal-item" style={{ transitionDelay: `${i * 80}ms` }}>
            <button
              type="button"
              onClick={() => openApplication(p.titulo)}
              className="w-full text-left group flex flex-col gap-4 py-7 transition-colors hover:bg-white/60 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-4 cursor-pointer"
            >
              <div className="min-w-0">
                <h3 className="font-serif font-light text-2xl leading-snug sm:text-3xl text-stone-900 group-hover:text-amber-900 transition-colors">
                  {p.titulo}
                </h3>
                <p className="mt-2 max-w-xl text-sm text-stone-600 leading-relaxed">{p.resumen}</p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-stone-500">
                <span className="font-mono">{p.departamento}</span>
                <span className="text-stone-300">•</span>
                <span className="font-mono">{p.ubicacion}</span>
                <span className="hidden text-stone-300 sm:inline">•</span>
                <span className="hidden font-mono sm:inline">{p.tipo}</span>
                <span className="ml-1 inline-flex items-center gap-1.5 font-semibold text-stone-900 transition-colors group-hover:text-amber-800">
                  <span>POSTULAR</span>
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={1.75}
                  />
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* Modal de postulación interactivo */}
      <JobApplicationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPuesto={selectedPuesto}
        vacantes={posiciones}
      />
    </>
  );
}
