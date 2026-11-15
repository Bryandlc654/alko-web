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
          "btn btn-paper"
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
