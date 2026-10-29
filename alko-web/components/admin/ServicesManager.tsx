"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  Search,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  FileText,
  ListPlus,
  HelpCircle,
  Check,
} from "lucide-react";
import type { Sector } from "@/lib/types";

interface ServicesManagerProps {
  sectors: Sector[];
}

function SafePreviewBox({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [error, setError] = useState(false);
  const isValidSrc = src && src.trim().length > 0 && !error;

  return (
    <div className={`relative overflow-hidden bg-slate-100 flex items-center justify-center ${className}`}>
      {isValidSrc ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover object-center"
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-3 text-slate-400">
          <Layers className="w-8 h-8 stroke-1 text-slate-300 mb-1" />
          <span className="text-[10px] text-slate-400 font-mono">Sin imagen</span>
        </div>
      )}
    </div>
  );
}

export default function ServicesManager({ sectors: initialSectors }: ServicesManagerProps) {
  const [sectorsList, setSectorsList] = useState<Sector[]>(initialSectors);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [currentSector, setCurrentSector] = useState<Partial<Sector> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");

  const mainImageInputRef = useRef<HTMLInputElement>(null);

  const filteredSectors = sectorsList.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = () => {
    setCurrentSector({
      id: "sec-" + Date.now(),
      numero: String(sectorsList.length + 1).padStart(2, "0"),
      title: "",
      slug: "",
      descripcion: "",
      imagen: "/sector-oficinas.jpg",
      enlace: "",
      content:
        "<p>Descripción técnica del servicio y propuesta de valor integral para el cliente.</p>\n<h2>Qué incluye este servicio</h2>\n<ul>\n<li>Dirección técnica y planificación de obra</li>\n<li>Gestión integral de compras y suministros</li>\n<li>Control de calidad y cumplimiento normativo</li>\n</ul>",
    });
    setErrorMessage("");
    setIsEditingModalOpen(true);
  };

  const handleEdit = (sector: Sector) => {
    setCurrentSector({ ...sector });
    setErrorMessage("");
    setIsEditingModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de eliminar el servicio "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/servicios?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar servicio");

      setSectorsList((prev) => prev.filter((s) => s.id !== id));
      setSuccessToast(`Servicio "${title}" eliminado`);
      setTimeout(() => setSuccessToast(""), 3500);
    } catch (err: any) {
      alert("Error eliminando servicio: " + err.message);
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCurrentSector((prev) => (prev ? { ...prev, imagen: data.url } : null));
    } catch (err: any) {
      alert("Error subiendo imagen: " + err.message);
    }
  };

  const handleSaveSector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSector?.title?.trim()) {
      setErrorMessage("El título del servicio es obligatorio.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const slug =
      currentSector.slug?.trim() ||
      currentSector.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const toSave: Sector = {
      id: currentSector.id || "sec-" + Date.now(),
      numero: currentSector.numero || String(sectorsList.length + 1).padStart(2, "0"),
      title: currentSector.title.trim(),
      slug: slug,
      descripcion: currentSector.descripcion || "",
      imagen: currentSector.imagen || "/sector-oficinas.jpg",
      enlace: `/servicios/${slug}`,
      content: currentSector.content || "",
    };

    try {
      const res = await fetch("/api/admin/servicios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSave),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar el servicio");

      const saved = data.sector as Sector;
      setSectorsList((prev) => {
        const idx = prev.findIndex((s) => s.id === saved.id || s.slug === saved.slug);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [...prev, saved];
      });

      setIsEditingModalOpen(false);
      setSuccessToast(`Servicio "${saved.title}" guardado con éxito`);
      setTimeout(() => setSuccessToast(""), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || "Error al guardar el servicio");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-poppins">
      {/* Toast de notificación */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-xl animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Cabecera del módulo */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <Layers className="w-4 h-4" />
            <span>Módulo de Especialidades</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Gestión de Servicios y Sectores
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            Administra las especialidades que se muestran en el listado de <span className="font-semibold text-slate-700">/servicios</span>, en la sección de la <span className="font-semibold text-slate-700">Home</span> y sus respectivas páginas de aterrizaje individuales.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Servicio</span>
        </button>
      </div>

      {/* Barra de búsqueda y conteo */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, descripción o slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-xs"
          />
        </div>

        <span className="text-xs font-medium text-slate-500">
          Total: <strong className="text-slate-800">{filteredSectors.length}</strong> servicios
        </span>
      </div>

      {/* Grid de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSectors.map((sector) => (
          <div
            key={sector.id}
            className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition group flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                <SafePreviewBox
                  src={sector.imagen}
                  alt={sector.title}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-stone-900/80 backdrop-blur-xs text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                  Nº {sector.numero}
                </span>
              </div>

              <div className="p-5">
                <span className="text-[10px] font-mono text-blue-600 block mb-1">
                  /servicios/{sector.slug}
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {sector.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {sector.descripcion || "Sin descripción corta registrada."}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/servicios/${sector.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-900 transition"
              >
                <span>Ver página</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleEdit(sector)}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition"
                  title="Editar campos"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(sector.id, sector.title)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Creación / Edición Completa */}
      {isEditingModalOpen && currentSector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Cabecera del modal */}
            <div className="px-6 py-4 border-b border-slate-200/90 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-200">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {currentSector.id ? "Editar Servicio" : "Nuevo Servicio"}
                  </h2>
                  <span className="text-[10px] text-slate-500">
                    Completa los datos del servicio y su página de detalle
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSaveSector} className="flex-1 overflow-y-auto p-6 space-y-6">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Fila 1: Título y Número */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nº Índice
                  </label>
                  <input
                    type="text"
                    required
                    value={currentSector.numero || ""}
                    onChange={(e) => setCurrentSector({ ...currentSector, numero: e.target.value })}
                    placeholder="01"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
                <div className="sm:col-span-9">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Título del Servicio *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentSector.title || ""}
                    onChange={(e) => setCurrentSector({ ...currentSector, title: e.target.value })}
                    placeholder="Ej. Reformas Integrales de Alta Gama"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Fila 2: Slug personalizado */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  URL / Slug (opcional)
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs font-mono text-slate-500">
                    /servicios/
                  </span>
                  <input
                    type="text"
                    value={currentSector.slug || ""}
                    onChange={(e) => setCurrentSector({ ...currentSector, slug: e.target.value })}
                    placeholder="reformas-integrales"
                    className="w-full px-3.5 py-2 rounded-r-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Fila 3: Imagen principal */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Fotografía Principal del Servicio
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative shrink-0">
                    <SafePreviewBox
                      src={currentSector.imagen || "/sector-oficinas.jpg"}
                      alt="Preview"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={currentSector.imagen || ""}
                      onChange={(e) => setCurrentSector({ ...currentSector, imagen: e.target.value })}
                      placeholder="/sector-oficinas.jpg o URL pública"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 font-mono focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => mainImageInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Subir desde tu equipo</span>
                      </button>
                      <input
                        type="file"
                        ref={mainImageInputRef}
                        accept="image/*"
                        onChange={handleUploadImage}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fila 4: Descripción corta */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Descripción Corta (Tarjetas y Listados)
                </label>
                <textarea
                  rows={2}
                  value={currentSector.descripcion || ""}
                  onChange={(e) => setCurrentSector({ ...currentSector, descripcion: e.target.value })}
                  placeholder="Resumen directo que aparecerá en el listado general y en la Home..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              {/* Fila 5: Contenido HTML de la Landing / Detalle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Contenido Detallado de la Landing (HTML)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Usa &lt;p&gt; para entradilla y &lt;h2&gt; con &lt;ul&gt; para &quot;¿Qué incluye?&quot;
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={currentSector.content || ""}
                  onChange={(e) => setCurrentSector({ ...currentSector, content: e.target.value })}
                  placeholder="<p>Entradilla técnica...</p>&#10;<h2>Qué incluye</h2>&#10;<ul>&#10;<li>Partida 1</li>&#10;</ul>"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              {/* Botones de acción */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Servicio</span>
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
