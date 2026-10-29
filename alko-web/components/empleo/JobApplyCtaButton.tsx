"use client";

import { useState } from "react";
import type { PosicionEmpleo } from "@/lib/types";
import JobApplicationModal from "./JobApplicationModal";

interface JobApplyCtaButtonProps {
  vacantes: PosicionEmpleo[];
  label?: string;
  className?: string;
}

export default function JobApplyCtaButton({
  vacantes,
  label = "ENVIAR CANDIDATURA",
  className,
}: JobApplyCtaButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={
          className ||
          "inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-amber-700 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-amber-800 active:scale-95 sm:py-4 sm:text-xs cursor-pointer"
        }
      >
        <span>{label}</span>
        <span>→</span>
      </button>

      <JobApplicationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPuesto="Candidatura espontánea"
        vacantes={vacantes}
      />
    </>
  );
}
