"use client";

import { useState, useRef } from "react";
import type { Locale } from "@/lib/i18n";
import { CAREERS_COPY, SPONTANEOUS_VALUE, type LocalizedPosition } from "@/lib/i18n/careers";
import { localizedPath } from "@/lib/i18n";
import { ROUTES } from "@/lib/site";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Puesto marcado de entrada: el valor del panel, en castellano. */
  selectedPuesto?: string;
  /** Vacantes con sus textos en el idioma de la página (`valor` es el del panel). */
  vacantes: LocalizedPosition[];
  locale?: Locale;
}

export default function JobApplicationModal({
  isOpen,
  onClose,
  selectedPuesto = SPONTANEOUS_VALUE,
  vacantes,
  locale = "es",
}: JobApplicationModalProps) {
  const t = CAREERS_COPY[locale].modal;
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [puesto, setPuesto] = useState(selectedPuesto);
  const [mensaje, setMensaje] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar puesto seleccionado al abrir
  if (isOpen && puesto !== selectedPuesto && !nombre) {
    setPuesto(selectedPuesto);
  }

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        setError(t.tooBig);
        return;
      }
      setFile(selected);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("email", email);
      formData.append("telefono", telefono);
      // Siempre el nombre del panel (en castellano); en inglés se marca el idioma para el equipo.
      formData.append("puesto", locale === "es" ? puesto : `${puesto} · EN`);
      formData.append("mensaje", mensaje);
      if (file) {
        formData.append("cv", file);
      }

      const res = await fetch("/api/empleo/postulacion", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t.error);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setNombre("");
        setEmail("");
        setTelefono("");
        setMensaje("");
        setFile(null);
        onClose();
      }, 3500);
    } catch (err: any) {
      setError(err.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  const field =
    "w-full border-0 border-b border-ink/20 bg-transparent px-0 py-2.5 text-base text-ink placeholder:text-ink/35 transition-colors focus:border-ink focus:outline-none focus:ring-0";
  const label = "block text-[10px] uppercase tracking-[0.22em] text-mid";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-modal-title"
        className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden bg-paper text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-6 border-b border-ink/15 px-6 py-5 sm:px-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-bronze">{t.eyebrow}</p>
            <h2 id="job-modal-title" className="display-title mt-2 text-2xl leading-tight sm:text-3xl">
              {t.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink/15 text-lg transition-colors hover:border-ink"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {/* Cuerpo / Formulario */}
        <div className="no-scrollbar overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
          {success ? (
            <div className="py-10">
              <span aria-hidden="true" className="display-title block text-5xl text-bronze">✓</span>
              <h3 className="display-title mt-6 text-2xl">{t.successTitle}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-mid">
                {t.successText}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <p role="alert" className="border-l-2 border-red-700 bg-red-700/5 px-4 py-3 text-sm text-red-800">
                  {error}
                </p>
              )}

              <div>
                <label htmlFor="job-puesto" className={label}>
                  {t.position}
                </label>
                <select id="job-puesto" value={puesto} onChange={(e) => setPuesto(e.target.value)} className={`${field} cursor-pointer`}>
                  <option value={SPONTANEOUS_VALUE}>{t.spontaneous}</option>
                  {vacantes.map((v) => (
                    <option key={v.id || v.valor} value={v.valor}>
                      {v.titulo} ({v.departamento} · {v.ubicacion})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="job-nombre" className={label}>
                  {t.name}
                </label>
                <input
                  id="job-nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className={field}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="job-email" className={label}>
                    {t.email}
                  </label>
                  <input
                    id="job-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className={field}
                  />
                </div>
                <div>
                  <label htmlFor="job-telefono" className={label}>
                    {t.phone}
                  </label>
                  <input
                    id="job-telefono"
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+34 600 000 000"
                    className={field}
                  />
                </div>
              </div>

              <div>
                <span className={label}>{t.cv}</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group mt-3 flex w-full items-center justify-between gap-4 border border-dashed border-ink/25 px-4 py-4 text-left transition-colors hover:border-ink"
                >
                  {file ? (
                    <span className="min-w-0">
                      <span className="block truncate text-sm">{file.name}</span>
                      <span className="block text-xs text-mid">{(file.size / (1024 * 1024)).toFixed(2)} MB · {t.cvChange}</span>
                    </span>
                  ) : (
                    <span>
                      <span className="block text-sm">{t.cvSelect}</span>
                      <span className="block text-xs text-mid">{t.cvTypes}</span>
                    </span>
                  )}
                  <span aria-hidden="true" className="text-[10px] uppercase tracking-[0.22em] text-bronze transition-transform group-hover:-translate-y-0.5">
                    {file ? "✓" : t.upload}
                  </span>
                </button>
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
              </div>

              <div>
                <label htmlFor="job-mensaje" className={label}>
                  {t.message}
                </label>
                <textarea
                  id="job-mensaje"
                  rows={3}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder={t.messagePlaceholder}
                  className={`${field} resize-none`}
                />
              </div>

              <div className="flex flex-col gap-4 border-t border-ink/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-mid">
                  {t.privacy}{" "}
                  <a href={localizedPath(ROUTES.privacy, locale)} className="underline underline-offset-2 hover:text-ink">
                    {t.privacyLink}
                  </a>
                </p>
                <button type="submit" disabled={loading} className="btn btn-ink shrink-0 disabled:opacity-50">
                  {loading ? t.sending : t.submit} <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
