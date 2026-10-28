"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ExternalLink,
  Info,
  ArrowLeft,
  Calendar,
  MapPin,
} from "lucide-react";
import type { Project } from "@/lib/types";

interface ProjectsManagerProps {
  projects: Project[];
  initialFeaturedIds: string[];
}

export default function ProjectsManager({
  projects,
  initialFeaturedIds,
}: ProjectsManagerProps) {
  const [featuredIds, setFeaturedIds] = useState<string[]>(initialFeaturedIds);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleFeatured = (projectId: string) => {
    setErrorMsg("");
    setSaveSuccess(false);

    if (featuredIds.includes(projectId)) {
      // Desmarcar
      setFeaturedIds((prev) => prev.filter((id) => id !== projectId));
    } else {
      // Validar máximo 3
      if (featuredIds.length >= 3) {
        setErrorMsg("Solo puedes marcar un máximo de 3 proyectos para la página de inicio. Desmarca uno primero.");
        return;
      }
      setFeaturedIds((prev) => [...prev, projectId]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/projects/featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featuredIds }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error guardando proyectos destacados");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Ocurrió un error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      {/* Barra de Notificación y Contador Superior */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Proyectos Destacados en Portada
            </h2>
            <p className="text-xs text-slate-500">
              Selecciona los proyectos que se mostrarán en la sección de inicio (Máximo 3 proyectos).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
            <span>Seleccionados:</span>
            <span
              className={`font-mono text-sm px-2 py-0.5 rounded-full ${
                featuredIds.length === 3
                  ? "bg-emerald-500 text-white font-bold"
                  : "bg-blue-600 text-white font-bold"
              }`}
            >
              {featuredIds.length} / 3
            </span>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white transition shadow-sm ${
              saveSuccess
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-500/20"
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Guardado con éxito!</span>
              </>
            ) : (
              <span>Guardar Selección</span>
            )}
          </button>
        </div>
      </div>

      {/* Alerta de Error si se excede el límite */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg("")}
            className="text-amber-700 font-bold hover:underline"
          >
            Entendido
          </button>
        </div>
      )}

      {/* Grid de Proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const isFeatured =
            featuredIds.includes(String(project.id)) || featuredIds.includes(project.slug);

          return (
            <div
              key={project.id}
              onClick={() => toggleFeatured(String(project.id))}
              className={`relative rounded-2xl overflow-hidden bg-white border transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-xs ${
                isFeatured
                  ? "border-blue-600 ring-2 ring-blue-500/30 shadow-md"
                  : "border-slate-200/90 hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              {/* Imagen del Proyecto */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <Image
                  src={project.imagen}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover object-center group-hover:scale-105 transition duration-500"
                />

                {/* Badge de Selección en Esquina */}
                <div className="absolute top-3 right-3 z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow-md ${
                      isFeatured
                        ? "bg-blue-600 text-white"
                        : "bg-white/90 text-slate-400 hover:bg-white"
                    }`}
                  >
                    <Check className={`w-4 h-4 ${isFeatured ? "stroke-[3]" : "opacity-30"}`} />
                  </div>
                </div>

                {/* Indicador Destacado en Portada */}
                {isFeatured && (
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold tracking-wide uppercase shadow-sm flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>En Portada</span>
                  </div>
                )}
              </div>

              {/* Información del Proyecto */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] mb-2 font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {project.ubicacion || "Madrid"}
                    </span>
                    <span>&middot;</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {project.anio || "2024"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {project.reto || project.content?.replace(/<[^>]+>/g, "").slice(0, 100) || "Proyecto de alta exigencia arquitectónica en Madrid."}
                  </p>
                </div>

                {/* Botón selector inferior */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Servicio: <span className="text-slate-700 font-semibold uppercase">{project.servicio || "General"}</span>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFeatured(String(project.id));
                    }}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                      isFeatured
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {isFeatured ? "Quitar de Home" : "Mostrar en Home"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
