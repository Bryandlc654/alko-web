"use client";

import { useState } from "react";
import type { PosicionEmpleo } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { CAREERS_COPY, SPONTANEOUS_VALUE, localizePosition } from "@/lib/i18n/careers";
import JobApplicationModal from "./JobApplicationModal";

interface JobApplyCtaButtonProps {
  vacantes: PosicionEmpleo[];
  label?: string;
  className?: string;
  locale?: Locale;
}

export default function JobApplyCtaButton({ vacantes, label, className, locale = "es" }: JobApplyCtaButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setModalOpen(true)} className={className || "btn btn-paper"}>
        <span>{label || CAREERS_COPY[locale].cta.button}</span>
        <span aria-hidden="true">→</span>
      </button>

      <JobApplicationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPuesto={SPONTANEOUS_VALUE}
        vacantes={vacantes.filter((v) => v.activa !== false).map((v) => localizePosition(v, locale))}
        locale={locale}
      />
    </>
  );
}
