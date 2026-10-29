"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  BookOpen,
  Search,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { Guide } from "@/lib/types";

interface GuidesManagerProps {
  guides: Guide[];
}

export default function GuidesManager({ guides }: GuidesManagerProps) {
  const [guidesList, setGuidesList] = useState<Guide[]>(guides);
  const [searchTerm, setSearchTerm] = useState("");
  const [successToast, setSuccessToast] = useState("");

  const filteredGuides = guidesList.filter((g) => {
    const q = searchTerm.toLowerCase();
    return (
      g.title?.toLowerCase().includes(q) ||
      g.slug?.toLowerCase().includes(q) ||
      g.tema?.toLowerCase().includes(q) ||
      g.descripcion?.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente la guía "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/guias?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar la guía");

      setGuidesList((prev) => prev.filter((g) => g.id !== id && g.slug !== id));
      setSuccessToast(`Guía "${title}" eliminada`);
      setTimeout(() => setSuccessToast(""), 3500);
    } catch (err: any) {
      alert("Error eliminando guía: " + err.message);
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
            <BookOpen className="w-4 h-4" />
            <span>Módulo de Guías Técnicas</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Gestión de Guías Técnicas
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Crea y administra las guías paso a paso de ALKO Studio. Cada guía contiene sus apartados técnicos, tiempos de lectura y fotografías explicativas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/guias/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Guía</span>
          </Link>
        </div>
      </div>

      {/* Barra de Búsqueda y Estadísticas */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título, tema o slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Mostrando <span className="font-semibold text-slate-800">{filteredGuides.length}</span> de{" "}
          <span className="font-semibold text-slate-800">{guidesList.length}</span> guías
        </div>
      </div>

      {/* Grid de Guías */}
      {filteredGuides.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">No se encontraron guías</h3>
          <p className="text-xs text-slate-400 mt-1">
            Intenta con otro término de búsqueda o crea una nueva con el botón superior.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Portada */}
                <div className="h-44 w-full relative bg-slate-100 overflow-hidden">
                  {guide.imagen ? (
                    <Image
                      src={guide.imagen}
                      alt={guide.title}
                      fill
                      className="object-cover object-center transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                      Sin imagen
                    </div>
                  )}

                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono text-[11px] font-bold">
                    {guide.numero} — GUÍA
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <Link
                      href={`/conocimiento/guias/${guide.slug}`}
                      target="_blank"
                      title="Ver guía en vivo"
                      className="p-1.5 bg-white/90 hover:bg-white text-slate-700 rounded-lg shadow-xs backdrop-blur-sm transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] mb-2 font-medium">
                    <span className="font-mono uppercase tracking-wider text-amber-700 font-semibold">
                      {guide.tema || "PLANIFICACIÓN"}
                    </span>
                    {guide.lectura && (
                      <>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {guide.lectura}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition">
                    {guide.title}
                  </h3>

                  <p className="text-xs text-slate-500 font-light mt-2 line-clamp-2 leading-relaxed">
                    {guide.descripcion || "Sin descripción asignada..."}
                  </p>
                </div>
              </div>

              {/* Botones inferiores */}
              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/conocimiento/guias/${guide.slug}`}
                  target="_blank"
                  className="text-[11px] font-medium text-slate-600 hover:text-blue-600 flex items-center gap-1 transition"
                >
                  <span>Ver guía</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/guias/${guide.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl transition shadow-2xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Editar Guía</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(guide.id, guide.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Eliminar guía"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
