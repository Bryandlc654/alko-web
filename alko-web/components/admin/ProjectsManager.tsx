"use client";

import { useState } from "react";
import Image from "@/components/ui/Image";
import Link from "next/link";
import {
  Building2,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ExternalLink,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  MapPin,
  Maximize2,
} from "lucide-react";
import type { Project } from "@/lib/types";
import { toast, confirmDialog } from "@/components/admin/feedback";

interface ProjectsManagerProps {
  projects: Project[];
  initialFeaturedIds: string[];
  initialShowcaseId: string | null;
}

export default function ProjectsManager({
  projects: initialProjects,
  initialFeaturedIds,
  initialShowcaseId,
}: ProjectsManagerProps) {
  const [projectsList, setProjectsList] = useState<Project[]>(initialProjects);
  // Lo guardado puede tener ids o slugs, o proyectos que ya no existen (p. ej. antiguos de WordPress), que
  // ocupaban plazas sin verse marcados y no dejaban cambiar la selección. Se normaliza a ids existentes y,
  // si no queda ninguno, se marcan los que la portada muestra por defecto (los tres primeros).
  const [featuredIds, setFeaturedIds] = useState<string[]>(() => {
    const valid = initialProjects
      .filter((p) => initialFeaturedIds.includes(String(p.id)) || initialFeaturedIds.includes(p.slug))
      .map((p) => String(p.id))
      .slice(0, 3);
    return valid.length > 0 ? valid : initialProjects.slice(0, 3).map((p) => String(p.id));
  });

  // Proyecto del bloque a pantalla completa de la portada (solo uno).
  const [showcaseId, setShowcaseId] = useState<string | null>(() => {
    const found = initialProjects.find((p) => String(p.id) === initialShowcaseId || p.slug === initialShowcaseId);
    return found ? String(found.id) : null;
  });

  const toggleShowcase = async (projectId: string) => {
    const previous = showcaseId;
    const next = showcaseId === projectId ? null : projectId;
    setShowcaseId(next);
    try {
      const res = await fetch("/api/admin/projects/showcase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error guardando el bloque de portada");
      toast.success(next ? "Proyecto colocado en el bloque de portada" : "Proyecto quitado del bloque de portada");
    } catch (err: any) {
      setShowcaseId(previous);
      toast.error(err.message || "No se pudo guardar el bloque de portada");
    }
  };

  // Estados de guardado destacados
  const [isSavingFeatured, setIsSavingFeatured] = useState(false);
  const [saveFeaturedSuccess, setSaveFeaturedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Marcar / Desmarcar como destacado en Home: se guarda al momento (antes había que pulsar
  // «Guardar Destacados» aparte y era fácil pensar que ya estaba guardado).
  const toggleFeatured = (projectId: string) => {
    setErrorMsg("");
    setSaveFeaturedSuccess(false);

    let next: string[];
    if (featuredIds.includes(projectId)) {
      next = featuredIds.filter((id) => id !== projectId);
    } else {
      if (featuredIds.length >= 3) {
        setErrorMsg("Solo puedes marcar un máximo de 3 proyectos para la página de inicio. Desmarca uno primero.");
        return;
      }
      next = [...featuredIds, projectId];
    }
    setFeaturedIds(next);
    handleSaveFeatured(next);
  };

  // Guardar destacados en Home
  const handleSaveFeatured = async (ids: string[] = featuredIds) => {
    setIsSavingFeatured(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/projects/featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featuredIds: ids }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error guardando proyectos destacados");

      setSaveFeaturedSuccess(true);
      setTimeout(() => setSaveFeaturedSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Ocurrió un error al guardar selección");
    } finally {
      setIsSavingFeatured(false);
    }
  };

  // Eliminar Proyecto
  const handleDeleteProject = async (project: Project) => {
    if (!(await confirmDialog({ title: `¿Estás seguro de eliminar el proyecto "${project.title}"?`, danger: true }))) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${encodeURIComponent(project.id)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al eliminar proyecto");
      }

      setProjectsList((prev) => prev.filter((p) => p.id !== project.id));
      setFeaturedIds((prev) => prev.filter((id) => id !== String(project.id) && id !== project.slug));
      if (showcaseId === String(project.id)) setShowcaseId(null);
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      {/* Barra Superior de Control y Contadores */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Gestor de Proyectos de Obra
            </h2>
            <p className="text-xs text-slate-500">
              Gestiona cada proyecto en su propia página con todos sus campos técnicos, marca hasta 3 para la portada y elige 1 para el bloque grande.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Contador de destacados */}
          <div className="px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
            <span>En Portada:</span>
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
            onClick={() => handleSaveFeatured()}
            disabled={isSavingFeatured}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition shadow-sm ${
              saveFeaturedSuccess
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-500/20"
            }`}
          >
            {isSavingFeatured ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : saveFeaturedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Guardado!</span>
              </>
            ) : (
              <span>Guardar Destacados</span>
            )}
          </button>

          {/* Botón para Añadir Proyecto - Navega a página propia */}
          <Link
            href="/admin/proyectos/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-black transition shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Proyecto</span>
          </Link>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid de Proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsList.map((project) => {
          const isFeatured =
            featuredIds.includes(String(project.id)) || featuredIds.includes(project.slug);
          const isShowcase = showcaseId === String(project.id);

          return (
            <div
              key={project.id}
              className={`rounded-2xl border bg-white overflow-hidden transition-all duration-300 flex flex-col group ${
                isFeatured
                  ? "border-blue-500 shadow-md ring-2 ring-blue-500/10"
                  : "border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md"
              }`}
            >
              {/* Imagen de Cabecera con Botones Rápidos */}
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                {project.imagen ? (
                  <Image
                    src={project.imagen}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                    Sin foto
                  </div>
                )}

                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono text-xs font-bold">
                  {project.indice || "—"}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(project)}
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-red-600 text-white backdrop-blur-md transition"
                    title="Eliminar proyecto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-1.5">
                  {isFeatured && (
                    <div className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>En Portada</span>
                    </div>
                  )}
                  {project.oculto && (
                    <div className="bg-slate-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                      Oculto
                    </div>
                  )}
                  {project.exclusivo && (
                    <div className="bg-stone-950 text-[#c6a66b] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                      ALKO Exclusiva
                    </div>
                  )}
                  {isShowcase && (
                    <div className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Maximize2 className="w-3 h-3" />
                      <span>Bloque grande</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información del Proyecto */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] mb-2 font-medium">
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {project.ubicacion || "Madrid"}
                    </span>
                    <span>&middot;</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {project.anio || "2024"}
                    </span>
                    <span>&middot;</span>
                    <span className="font-semibold text-slate-700">{project.superficie || "—"}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center justify-between">
                    <span>{project.title}</span>
                    <Link
                      href={`/proyectos/${project.slug}`}
                      target="_blank"
                      className="text-slate-400 hover:text-blue-600 transition"
                      title="Ver página de detalle pública"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200/80 font-medium">
                      Cliente: {project.cliente || "Particular"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/80 font-medium">
                      Plazo: {project.plazo || "—"}
                    </span>
                  </div>
                </div>

                {/* Botones de acción inferiores */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/admin/proyectos/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar en Página</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => toggleFeatured(String(project.id))}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                      isFeatured
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {isFeatured ? "Quitar de Home" : "Mostrar en Home"}
                  </button>
                </div>
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => toggleShowcase(String(project.id))}
                    title="Bloque a pantalla completa de la portada, tras los servicios. Solo puede haber un proyecto."
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                      isShowcase
                        ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    {isShowcase ? "Quitar del bloque grande" : "Poner en bloque grande"}
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
