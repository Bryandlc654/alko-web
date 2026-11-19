"use client";

import { useState } from "react";
import type { PosicionEmpleo } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { CAREERS_COPY, SPONTANEOUS_VALUE, localizePosition } from "@/lib/i18n/careers";
import JobApplicationModal from "./JobApplicationModal";

interface JobPositionsListProps {
  posiciones: PosicionEmpleo[];
  locale?: Locale;
}

export default function JobPositionsList({ posiciones, locale = "es" }: JobPositionsListProps) {
  const t = CAREERS_COPY[locale].list;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState(SPONTANEOUS_VALUE);

  // Solo las vacantes activas, con sus textos en el idioma de la página.
  const vacantesActivas = posiciones.filter((p) => p.activa !== false).map((p) => localizePosition(p, locale));

  // `puesto` es el valor del panel (en castellano): es el que se envía con la candidatura.
  const openApplication = (puesto: string) => {
    setSelectedPuesto(puesto);
    setModalOpen(true);
  };

  return (
    <>
      {vacantesActivas.length === 0 ? (
        <div className="py-14 text-center border-b border-ink/15 space-y-4">
          <p className="text-mid text-sm max-w-md mx-auto leading-relaxed">{t.empty}</p>
          <button type="button" onClick={() => openApplication(SPONTANEOUS_VALUE)} className="btn btn-ink">
            {t.emptyButton} <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-ink/15 border-b border-ink/15">
          {vacantesActivas.map((p, i) => (
            <li key={p.id || p.valor + i} className="reveal-item" style={{ transitionDelay: `${i * 80}ms` }}>
              <button
                type="button"
                onClick={() => openApplication(p.valor)}
                className="w-full text-left group flex flex-col gap-4 py-7 transition-colors hover:bg-white/70 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-4 cursor-pointer"
              >
                <div className="min-w-0">
                  <h3 className="display-title text-2xl leading-snug sm:text-3xl text-ink group-hover:text-bronze transition-colors">
                    {p.titulo}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm text-mid leading-relaxed">{p.resumen}</p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-mid">
                  <span>{p.departamento}</span>
                  <span className="text-ink/30">·</span>
                  <span>{p.ubicacion}</span>
                  <span className="hidden text-ink/30 sm:inline">·</span>
                  <span className="hidden sm:inline">{p.tipo}</span>
                  <span className="arrow-link ml-2 text-ink">
                    {t.apply} <span aria-hidden="true">→</span>
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal de postulación interactivo */}
      <JobApplicationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPuesto={selectedPuesto}
        vacantes={vacantesActivas}
        locale={locale}
      />
    </>
  );
}
