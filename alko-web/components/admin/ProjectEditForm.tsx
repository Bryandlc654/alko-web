"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import type { Project } from "@/lib/types";

interface ProjectEditFormProps {
  initialProject?: Project | null;
  isNew?: boolean;
}

export default function ProjectEditForm({ initialProject, isNew = false }: ProjectEditFormProps) {
  const router = useRouter();
  const [project, setProject] = useState<Partial<Project>>(() => {
    if (initialProject) return initialProject;
    return {
      id: "",
      title: "",
      slug: "",
      indice: "01",
      anio: new Date().getFullYear().toString(),
      ubicacion: "Madrid",
      tipologia: "Vivienda Unifamiliar",
      cliente: "Cliente particular",
      servicio: "viviendas",
      superficie: "450 m²",
      plazo: "12 meses",
      imagen: "/start-research-1.jpg",
      fotoAntes: "/start-research-1.jpg",
      fotoDespues: "/start-research-2.jpg",
      galeria: [],
      content: "",
      reto: "",
      solucion: "",
      resultado: "",
    };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error subiendo archivo");

      if (field === "galeria") {
        setProject((prev) => ({
          ...prev,
          galeria: [...(prev?.galeria || []), data.url],
        }));
      } else {
        setProject((prev) => ({
          ...prev,
          [field]: data.url,
        }));
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Error al subir la fotografía");
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setProject((prev) => ({
      ...prev,
      galeria: (prev?.galeria || []).filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project.title?.trim()) {
      setErrorMessage("El título del proyecto es obligatorio.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar el proyecto");

      setSuccessToast("Proyecto guardado con éxito");
      setTimeout(() => {
        router.push("/admin/proyectos");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "Error al guardar el proyecto");
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
            href="/admin/proyectos"
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition"
            title="Volver a proyectos"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-0.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{isNew ? "Crear Nuevo Proyecto" : "Editar Proyecto"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {project.title || "Nuevo Proyecto de Obra"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {project.slug && (
            <Link
              href={`/proyectos/${project.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-xl shadow-2xs transition"
            >
              <span>Ver en la web</span>
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
                <span>Guardar Proyecto</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Formulario completo en página */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 sm:p-8 space-y-8">
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Bloque 1: Identificación y Ficha General */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>1. Identificación y Ficha Técnica General</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Título de la Obra *
              </label>
              <input
                type="text"
                required
                value={project.title || ""}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                placeholder="Ej. RESIDENCIA EL VISO"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100/60 text-sm font-medium transition bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Número / Índice
              </label>
              <input
                type="text"
                value={project.indice || ""}
                onChange={(e) => setProject({ ...project, indice: e.target.value })}
                placeholder="01"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100/60 text-sm font-medium transition bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tipología
              </label>
              <input
                type="text"
                value={project.tipologia || ""}
                onChange={(e) => setProject({ ...project, tipologia: e.target.value })}
                placeholder="Ej. Vivienda Unifamiliar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100/60 text-sm transition bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ubicación
              </label>
              <input
                type="text"
                value={project.ubicacion || ""}
                onChange={(e) => setProject({ ...project, ubicacion: e.target.value })}
                placeholder="Ej. Pozuelo de Alarcón, Madrid"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100/60 text-sm transition bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Año de Ejecución
              </label>
              <input
                type="text"
                value={project.anio || ""}
                onChange={(e) => setProject({ ...project, anio: e.target.value })}
                placeholder="2024"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100/60 text-sm font-medium transition bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cliente
              </label>
              <input
                type="text"
                value={project.cliente || ""}
                onChange={(e) => setProject({ ...project, cliente: e.target.value })}
                placeholder="Ej. Cliente particular / Corporativo"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100/60 text-sm transition bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Superficie
              </label>
              <input
                type="text"
                value={project.superficie || ""}
                onChange={(e) => setProject({ ...project, superficie: e.target.value })}
                placeholder="Ej. 520 m²"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100/60 text-sm font-medium transition bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Plazo de Obra
              </label>
              <input
                type="text"
                value={project.plazo || ""}
                onChange={(e) => setProject({ ...project, plazo: e.target.value })}
                placeholder="Ej. 14 meses"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100/60 text-sm transition bg-white"
              />
            </div>
          </div>
        </div>

        {/* Bloque 2: Imágenes Hero, Antes y Después */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>2. Fotografías de la Obra (Hero, Antes y Después)</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SafePreviewBox
              url={project.imagen}
              alt="Portada del Proyecto"
              label="Foto de Portada / Principal"
              sublabel="Aparece en la cabecera y listados públicos."
              badgeText="Sin Portada"
              uploading={uploadingField === "imagen"}
              onChangeFile={(e) => handleFileUpload(e, "imagen")}
            />

            <SafePreviewBox
              url={project.fotoAntes}
              alt="Foto Estado Inicial"
              label="Foto ANTES (Estado Inicial)"
              sublabel="Muestra el estado previo a la intervención."
              badgeText="Sin Foto Antes"
              isGrayscale={true}
              uploading={uploadingField === "fotoAntes"}
              onChangeFile={(e) => handleFileUpload(e, "fotoAntes")}
            />

            <SafePreviewBox
              url={project.fotoDespues || project.imagen}
              alt="Foto Obra Entregada"
              label="Foto DESPUÉS (Obra Entregada)"
              sublabel="Resultado final acabado y entregado."
              badgeText="Sin Foto Después"
              uploading={uploadingField === "fotoDespues"}
              onChangeFile={(e) => handleFileUpload(e, "fotoDespues")}
            />
          </div>
        </div>

        {/* Bloque 3: Galería de Fotos Adicionales */}
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>3. Galería de Imágenes del Proyecto ({(project.galeria || []).length})</span>
            </h4>

            <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/80 text-xs font-semibold cursor-pointer transition shadow-xs">
              {uploadingField === "galeria" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>Añadir Foto a Galería</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "galeria")}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(project.galeria || []).map((imgUrl, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/90 group shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={`Galería ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(i)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-600/90 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center shadow-md"
                  title="Eliminar de galería"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {(!project.galeria || project.galeria.length === 0) && (
              <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs bg-slate-50/50">
                No hay fotos adicionales en la galería aún. Haz clic en &quot;Añadir Foto a Galería&quot; para subir detalles de acabados.
              </div>
            )}
          </div>
        </div>

        {/* Bloque 4: Reto, Solución y Resultado */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>4. Memoria Técnica (Reto, Solución y Resultado)</span>
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                El Reto / Condicionantes de partida
              </label>
              <textarea
                rows={3}
                value={project.reto || ""}
                onChange={(e) => setProject({ ...project, reto: e.target.value })}
                placeholder="Exigencias iniciales, estado estructural o condicionantes normativos..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-xs text-slate-800 leading-relaxed bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                La Solución Constructiva
              </label>
              <textarea
                rows={3}
                value={project.solucion || ""}
                onChange={(e) => setProject({ ...project, solucion: e.target.value })}
                placeholder="Cómo se resolvió técnicamente: refuerzos, instalaciones y materiales..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-xs text-slate-800 leading-relaxed bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Resultado Entregado
              </label>
              <textarea
                rows={2}
                value={project.resultado || ""}
                onChange={(e) => setProject({ ...project, resultado: e.target.value })}
                placeholder="Impacto final y cumplimiento de expectativas del cliente..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-xs text-slate-800 leading-relaxed bg-white"
              />
            </div>
          </div>
        </div>

        {/* Botones inferiores */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          <Link
            href="/admin/proyectos"
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition"
          >
            ← Cancelar y volver
          </Link>

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
                <span>Guardar Proyecto</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SafePreviewBox({
  url,
  alt,
  label,
  sublabel,
  badgeText,
  uploading,
  onChangeFile,
  isGrayscale = false,
}: {
  url?: string;
  alt: string;
  label: string;
  sublabel: string;
  badgeText?: string;
  uploading: boolean;
  onChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isGrayscale?: boolean;
}) {
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoadError(false);
  }, [url]);

  const hasValidImage = Boolean(url && url.trim() !== "" && !loadError);

  return (
    <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="block text-xs font-bold text-slate-900 tracking-tight">
            {label}
          </span>
          {hasValidImage ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Foto lista</span>
            </span>
          ) : (
            <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-full">
              {badgeText || "Pendiente"}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
          {sublabel}
        </p>
      </div>

      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-white border border-slate-200/80 mb-3 flex items-center justify-center shadow-xs">
        {hasValidImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={alt}
            onError={() => setLoadError(true)}
            className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
              isGrayscale ? "grayscale contrast-105" : ""
            }`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-1.5">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Sin vista previa</span>
            <span className="text-[10px] text-slate-400">Sube una fotografía de calidad</span>
          </div>
        )}
      </div>

      <label className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 text-xs font-semibold text-slate-700 cursor-pointer shadow-xs active:scale-[0.99] transition">
        {uploading ? (
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        ) : (
          <Upload className="w-4 h-4 text-slate-500" />
        )}
        <span>{hasValidImage ? "Cambiar Imagen" : "Subir Fotografía"}</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChangeFile}
        />
      </label>
    </div>
  );
}
