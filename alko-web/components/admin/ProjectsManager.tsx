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
  Plus,
  Edit3,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Maximize2,
  Layers,
  ArrowRight,
} from "lucide-react";
import type { Project } from "@/lib/types";

interface ProjectsManagerProps {
  projects: Project[];
  initialFeaturedIds: string[];
}

export default function ProjectsManager({
  projects: initialProjects,
  initialFeaturedIds,
}: ProjectsManagerProps) {
  const [projectsList, setProjectsList] = useState<Project[]>(initialProjects);
  const [featuredIds, setFeaturedIds] = useState<string[]>(initialFeaturedIds);

  // Estados de guardado destacados
  const [isSavingFeatured, setIsSavingFeatured] = useState(false);
  const [saveFeaturedSuccess, setSaveFeaturedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Modal de Crear / Editar Proyecto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [modalError, setModalError] = useState("");
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Marcar / Desmarcar como destacado en Home
  const toggleFeatured = (projectId: string) => {
    setErrorMsg("");
    setSaveFeaturedSuccess(false);

    if (featuredIds.includes(projectId)) {
      setFeaturedIds((prev) => prev.filter((id) => id !== projectId));
    } else {
      if (featuredIds.length >= 3) {
        setErrorMsg("Solo puedes marcar un máximo de 3 proyectos para la página de inicio. Desmarca uno primero.");
        return;
      }
      setFeaturedIds((prev) => [...prev, projectId]);
    }
  };

  // Guardar destacados en Home
  const handleSaveFeatured = async () => {
    setIsSavingFeatured(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/projects/featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featuredIds }),
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

  // Abrir Modal para Nuevo Proyecto
  const handleNewProject = () => {
    setModalError("");
    setEditingProject({
      id: "",
      title: "",
      slug: "",
      indice: String(projectsList.length + 1).padStart(2, "0"),
      anio: new Date().getFullYear().toString(),
      ubicacion: "Madrid",
      tipologia: "Residencial de Alta Gama",
      cliente: "Cliente Particular",
      servicio: "reformas-integrales",
      superficie: "250 m²",
      plazo: "6 meses",
      imagen: "/p1.jpg",
      fotoAntes: "/start-research-1.jpg",
      fotoDespues: "/p1.jpg",
      galeria: [],
    });
    setIsModalOpen(true);
  };

  // Abrir Modal para Editar Proyecto Existente
  const handleEditProject = (project: Project) => {
    setModalError("");
    setEditingProject({ ...project });
    setIsModalOpen(true);
  };

  // Subir imagen para cualquier campo (imagen, fotoAntes, fotoDespues, galeria)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "imagen" | "fotoAntes" | "fotoDespues" | "galeria") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    setModalError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al subir la imagen");

      if (field === "galeria") {
        setEditingProject((prev) => ({
          ...prev,
          galeria: [...(prev?.galeria || []), data.url],
        }));
      } else {
        setEditingProject((prev) => ({
          ...prev,
          [field]: data.url,
        }));
      }
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }
  };

  // Eliminar foto de galería
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setEditingProject((prev) => ({
      ...prev,
      galeria: (prev?.galeria || []).filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Guardar Proyecto (Nuevo o Editado)
  const handleSaveProjectForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) {
      setModalError("El título del proyecto es obligatorio.");
      return;
    }

    setIsSavingProject(true);
    setModalError("");

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar el proyecto");

      const savedProject: Project = data.project;

      setProjectsList((prev) => {
        const idx = prev.findIndex((p) => String(p.id) === String(savedProject.id) || p.slug === savedProject.slug);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = savedProject;
          return updated;
        }
        return [savedProject, ...prev];
      });

      setIsModalOpen(false);
      setEditingProject(null);
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setIsSavingProject(false);
    }
  };

  // Eliminar Proyecto
  const handleDeleteProject = async (project: Project) => {
    if (!confirm(`¿Estás seguro de eliminar el proyecto "${project.title}"?`)) return;

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
    } catch (err: any) {
      alert("Error: " + err.message);
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
              Crea nuevos proyectos, rellena todos sus campos técnicos y marca hasta 3 para la portada.
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
            onClick={handleSaveFeatured}
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

          {/* Botón para Añadir Proyecto */}
          <button
            type="button"
            onClick={handleNewProject}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-black transition shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Proyecto</span>
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
        {projectsList.map((project) => {
          const isFeatured =
            featuredIds.includes(String(project.id)) || featuredIds.includes(project.slug);

          return (
            <div
              key={project.id}
              className={`relative rounded-2xl overflow-hidden bg-white border transition-all duration-300 flex flex-col justify-between group shadow-xs ${
                isFeatured
                  ? "border-blue-600 ring-2 ring-blue-500/30 shadow-md"
                  : "border-slate-200/90 hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              {/* Imagen del Proyecto */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <Image
                  src={project.imagen || "/p1.jpg"}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover object-center group-hover:scale-105 transition duration-500"
                />

                {/* Acciones flotantes superiores */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleEditProject(project)}
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-blue-600 hover:bg-white flex items-center justify-center shadow-md transition"
                    title="Editar campos del proyecto"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteProject(project)}
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-red-600 hover:bg-white flex items-center justify-center shadow-md transition"
                    title="Eliminar proyecto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div
                    onClick={() => toggleFeatured(String(project.id))}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow-md cursor-pointer ${
                      isFeatured
                        ? "bg-blue-600 text-white"
                        : "bg-white/90 text-slate-400 hover:bg-white"
                    }`}
                    title={isFeatured ? "Desmarcar de Home" : "Marcar para Home"}
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
                    <span>&middot;</span>
                    <span className="font-semibold text-slate-600">{project.superficie || "—"}</span>
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

                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      Cliente: {project.cliente || "Particular"}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      Plazo: {project.plazo || "—"}
                    </span>
                  </div>
                </div>

                {/* Botones de acción inferiores */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleEditProject(project)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Rellenar Datos</span>
                  </button>

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
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          MODAL DE FORMULARIO COMPLETO PARA RELLENAR PROYECTO
          ======================================================== */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in duration-200">
            {/* Cabecera del Modal */}
            <div className="px-8 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingProject.id ? `Editar Proyecto: ${editingProject.title}` : "Crear Nuevo Proyecto"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Rellena la ficha técnica, fotos de antes/después y galería del proyecto.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSaveProjectForm} className="flex-1 overflow-y-auto p-8 space-y-8">
              {modalError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Bloque 1: Identificación Principal */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>1. Identificación y Ficha General</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Título de la Obra *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProject.title || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      placeholder="Ej. RESIDENCIA EL VISO"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Número / Índice
                    </label>
                    <input
                      type="text"
                      value={editingProject.indice || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, indice: e.target.value })}
                      placeholder="01"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Tipología
                    </label>
                    <input
                      type="text"
                      value={editingProject.tipologia || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, tipologia: e.target.value })}
                      placeholder="Ej. Vivienda Unifamiliar"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={editingProject.ubicacion || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, ubicacion: e.target.value })}
                      placeholder="Ej. Pozuelo de Alarcón, Madrid"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Año de Ejecución
                    </label>
                    <input
                      type="text"
                      value={editingProject.anio || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, anio: e.target.value })}
                      placeholder="2024"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Cliente
                    </label>
                    <input
                      type="text"
                      value={editingProject.cliente || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, cliente: e.target.value })}
                      placeholder="Ej. Cliente particular / Corporativo"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Superficie
                    </label>
                    <input
                      type="text"
                      value={editingProject.superficie || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, superficie: e.target.value })}
                      placeholder="Ej. 520 m²"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Plazo de Obra
                    </label>
                    <input
                      type="text"
                      value={editingProject.plazo || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, plazo: e.target.value })}
                      placeholder="Ej. 14 meses"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Bloque 2: Imágenes de Portada, Antes y Después */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>2. Fotografías de la Obra (Hero, Antes y Después)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Foto de Portada / Hero */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <span className="block text-xs font-bold text-slate-800 mb-1">
                        Foto de Portada / Principal
                      </span>
                      <p className="text-[11px] text-slate-500 mb-3">
                        Aparece en la cabecera y listado.
                      </p>
                    </div>

                    <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-200 mb-3">
                      <Image
                        src={editingProject.imagen || "/p1.jpg"}
                        alt="Portada"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <label className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs transition">
                      {uploadingField === "imagen" ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>Cambiar Portada</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "imagen")}
                      />
                    </label>
                  </div>

                  {/* Foto Estado Inicial (Antes) */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <span className="block text-xs font-bold text-slate-800 mb-1">
                        Foto ANTES (Estado Inicial)
                      </span>
                      <p className="text-[11px] text-slate-500 mb-3">
                        Bloque de memoria del proyecto.
                      </p>
                    </div>

                    <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-200 mb-3">
                      <Image
                        src={editingProject.fotoAntes || "/start-research-1.jpg"}
                        alt="Foto Antes"
                        fill
                        className="object-cover grayscale"
                      />
                    </div>

                    <label className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs transition">
                      {uploadingField === "fotoAntes" ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>Subir Foto Antes</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "fotoAntes")}
                      />
                    </label>
                  </div>

                  {/* Foto Obra Entregada (Después) */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <span className="block text-xs font-bold text-slate-800 mb-1">
                        Foto DESPUÉS (Obra Entregada)
                      </span>
                      <p className="text-[11px] text-slate-500 mb-3">
                        Resultado final acabado.
                      </p>
                    </div>

                    <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-200 mb-3">
                      <Image
                        src={editingProject.fotoDespues || editingProject.imagen || "/p1.jpg"}
                        alt="Foto Después"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <label className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs transition">
                      {uploadingField === "fotoDespues" ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>Subir Foto Después</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "fotoDespues")}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Bloque 3: Galería de Fotos Adicionales */}
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>3. Galería de Imágenes del Proyecto ({(editingProject.galeria || []).length})</span>
                  </h4>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold cursor-pointer transition">
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
                  {(editingProject.galeria || []).map((imgUrl, i) => (
                    <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                      <Image src={imgUrl} alt={`Galería ${i + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(i)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition shadow"
                        title="Eliminar de galería"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {(!editingProject.galeria || editingProject.galeria.length === 0) && (
                    <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                      No hay fotos adicionales en la galería aún. Haz clic en &quot;Añadir Foto a Galería&quot; para subir fotos de detalle.
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de Acción del Modal */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSavingProject}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-95 transition"
                >
                  {isSavingProject ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando Proyecto...</span>
                    </>
                  ) : (
                    <span>Guardar Proyecto</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
