"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import type { Guide } from "@/lib/types";
import { slugify } from "@/lib/utils";

interface GuideEditFormProps {
  initialGuide?: Guide | null;
  isNew?: boolean;
}

export default function GuideEditForm({ initialGuide, isNew = false }: GuideEditFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!isNew);

  const [guide, setGuide] = useState<Partial<Guide>>(() => {
    if (initialGuide) return initialGuide;
    return {
      id: "gui-" + Date.now(),
      numero: "01",
      title: "",
      slug: "",
      tema: "PLANIFICACIÓN",
      descripcion: "",
      lectura: "8 min",
      imagen: "/p2.jpg",
      content: "<p>Entradilla de la guía técnica orientada a propietarios y promotores...</p>\n\n<h2>1. Fase inicial y definición de objetivos</h2>\n<p>Qué aspectos técnicos y financieros deben evaluarse previamente...</p>\n\n<h2>2. Selección de calidades y contratos</h2>\n<p>Criterios de contratación para garantizar presupuestos y plazos cerrados...</p>",
    };
  });

  const handleTitleChange = (newTitle: string) => {
    const updated = { ...guide, title: newTitle };
    if (!isSlugManuallyEdited) {
      updated.slug = slugify(newTitle);
    }
    setGuide(updated);
  };

  const handleSlugChange = (newSlug: string) => {
    setIsSlugManuallyEdited(true);
    setGuide({ ...guide, slug: newSlug });
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error subiendo archivo");

      setGuide((prev) => ({ ...prev, imagen: data.url }));
    } catch (err: any) {
      setErrorMessage(err.message || "Error al subir la fotografía");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guide.title?.trim()) {
      setErrorMessage("El título de la guía es obligatorio.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const finalSlug = (guide.slug?.trim() || slugify(guide.title)) || "guia-" + Date.now();

    const toSave: Guide = {
      id: guide.id || "gui-" + Date.now(),
      numero: guide.numero || "01",
      title: guide.title.trim(),
      slug: finalSlug,
      tema: (guide.tema || "PLANIFICACIÓN").toUpperCase(),
      descripcion: guide.descripcion || "",
      lectura: guide.lectura || "8 min",
      imagen: guide.imagen || "/p2.jpg",
      content: guide.content || "",
    };

    try {
      const res = await fetch("/api/admin/guias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSave),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar la guía");

      setSuccessToast("Guía técnica guardada con éxito");
      setTimeout(() => {
        router.push("/admin/guias");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "Error al guardar la guía");
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast de notificación */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-xl animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Barra de cabecera con botón volver y acción de guardar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/guias"
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition"
            title="Volver a guías"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-0.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isNew ? "Crear Nueva Guía" : "Editar Guía Técnica"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {guide.title || "Nueva Guía"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {guide.slug && (
            <Link
              href={`/conocimiento/guias/${guide.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-xl shadow-2xs transition"
            >
              <span>Ver guía en vivo</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Guardar Guía</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Formulario completo en página */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 sm:p-8 space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Fila 1: Número, Título y Tema */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nº Guía
            </label>
            <input
              type="text"
              required
              value={guide.numero || ""}
              onChange={(e) => setGuide({ ...guide, numero: e.target.value })}
              placeholder="01"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-xs font-mono font-bold transition bg-white"
            />
          </div>

          <div className="md:col-span-7">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Título de la Guía Técnica *
            </label>
            <input
              type="text"
              required
              value={guide.title || ""}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ej. Guía completa para afrontar una reforma integral"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-sm font-medium transition bg-white"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tema / Etiqueta
            </label>
            <input
              type="text"
              value={guide.tema || ""}
              onChange={(e) => setGuide({ ...guide, tema: e.target.value.toUpperCase() })}
              placeholder="PLANIFICACIÓN"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-xs font-mono uppercase transition bg-white"
            />
          </div>
        </div>

        {/* Fila 2: Slug y Tiempo de lectura */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-8">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Slug Personalizado (Generado automáticamente)
              </label>
              {isSlugManuallyEdited && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSlugManuallyEdited(false);
                    setGuide({ ...guide, slug: slugify(guide.title || "") });
                  }}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  Regenerar desde título
                </button>
              )}
            </div>
            <div className="flex items-center">
              <span className="px-3.5 py-2.5 bg-slate-100 border border-r-0 border-slate-200 text-xs text-slate-500 rounded-l-xl font-mono">
                /conocimiento/guias/
              </span>
              <input
                type="text"
                value={guide.slug || ""}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="guia-completa-reforma"
                className="w-full px-3.5 py-2.5 rounded-r-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-600 transition"
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tiempo estimado de lectura
            </label>
            <input
              type="text"
              value={guide.lectura || ""}
              onChange={(e) => setGuide({ ...guide, lectura: e.target.value })}
              placeholder="10 min"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600 transition"
            />
          </div>
        </div>

        {/* Fila 3: Imagen de Portada */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Fotografía de la Guía
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
            <div className="w-32 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative shrink-0">
              {guide.imagen ? (
                <Image
                  src={guide.imagen}
                  alt="Preview"
                  fill
                  className="object-cover object-center"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                  Sin imagen
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2 w-full">
              <input
                type="text"
                value={guide.imagen || ""}
                onChange={(e) => setGuide({ ...guide, imagen: e.target.value })}
                placeholder="/p2.jpg o URL pública"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono focus:outline-none focus:border-blue-600 bg-white"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium transition shadow-2xs"
                >
                  {isUploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                  )}
                  <span>Subir fotografía desde tu equipo</span>
                </button>
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  onChange={handleUploadImage}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fila 4: Descripción */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Descripción Resumen (Aparece en el índice de guías)
          </label>
          <textarea
            rows={2}
            value={guide.descripcion || ""}
            onChange={(e) => setGuide({ ...guide, descripcion: e.target.value })}
            placeholder="Paso a paso desde la definición de necesidades hasta la entrega de llaves..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-xs text-slate-800 leading-relaxed bg-white"
          />
        </div>

        {/* Fila 5: Contenido Completo */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Contenido de la Guía (HTML / Párrafos y Encabezados)
            </label>
            <span className="text-[11px] text-slate-400">
              Estructura con &lt;p&gt;, &lt;h2&gt; y &lt;ul&gt;
            </span>
          </div>
          <textarea
            rows={14}
            value={guide.content || ""}
            onChange={(e) => setGuide({ ...guide, content: e.target.value })}
            placeholder="<p>Texto inicial...</p>&#10;<h2>1. Apartado</h2>&#10;<p>Detalles...</p>"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-xs font-mono text-slate-800 leading-relaxed bg-white"
          />
        </div>

        {/* Botones inferiores */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          <Link
            href="/admin/guias"
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition"
          >
            ← Cancelar y volver
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Guardar Guía</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
