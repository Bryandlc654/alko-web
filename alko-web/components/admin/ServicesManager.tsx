"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  Search,
  CheckCircle2,
} from "lucide-react";
import type { Sector } from "@/lib/types";

interface ServicesManagerProps {
  sectors: Sector[];
}

function SafePreviewBox({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
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
          sizes="200px"
          className="object-cover object-center"
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
          <Layers className="w-5 h-5 mb-1 stroke-1" />
          <span className="text-[10px]">Sin imagen</span>
        </div>
      )}
    </div>
  );
}

export default function ServicesManager({ sectors }: ServicesManagerProps) {
  const [sectorsList, setSectorsList] = useState<Sector[]>(sectors);
  const [searchTerm, setSearchTerm] = useState("");
  const [successToast, setSuccessToast] = useState("");

  const filteredSectors = sectorsList.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.title?.toLowerCase().includes(q) ||
      s.slug?.toLowerCase().includes(q) ||
      s.descripcion?.toLowerCase().includes(q)
    );
  });

  const handleDeleteSector = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente el servicio "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/servicios?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar el servicio");

      setSectorsList((prev) => prev.filter((s) => s.id !== id));
      setSuccessToast(`Servicio "${title}" eliminado`);
      setTimeout(() => setSuccessToast(""), 3500);
    } catch (err: any) {
      alert("Error eliminando servicio: " + err.message);
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
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Crea, edita y organiza las especialidades de ALKO Studio. Cada servicio dispone de su ficha para listados y de una landing page completa con su propio contenido, respetando la misma línea y estilo gráfico.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/servicios/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Servicio</span>
          </Link>
        </div>
      </div>

      {/* Barra de Búsqueda y Estadísticas */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título o slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Mostrando <span className="font-semibold text-slate-800">{filteredSectors.length}</span> de{" "}
          <span className="font-semibold text-slate-800">{sectorsList.length}</span> servicios
        </div>
      </div>

      {/* Grilla de Servicios */}
      {filteredSectors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">No se encontraron servicios</h3>
          <p className="text-xs text-slate-400 mt-1">
            Intenta con otro término de búsqueda o crea un nuevo servicio con el botón superior.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSectors.map((sector) => (
            <div
              key={sector.id}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Portada del servicio */}
                <div className="h-44 w-full relative bg-slate-100 overflow-hidden">
                  <SafePreviewBox
                    src={sector.imagen}
                    alt={sector.title}
                    className="w-full h-full transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono text-[11px] font-bold">
                    {sector.numero}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <Link
                      href={`/servicios/${sector.slug}`}
                      target="_blank"
                      title="Ver landing del servicio"
                      className="p-1.5 bg-white/90 hover:bg-white text-slate-700 rounded-lg shadow-xs backdrop-blur-sm transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-5">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-mono text-[11px] text-blue-600 font-semibold tracking-wider uppercase">
                      /{sector.slug}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-blue-600 transition">
                    {sector.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-light mt-2 line-clamp-2 leading-relaxed">
                    {sector.descripcion || "Sin descripción corta asignada..."}
                  </p>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/servicios/${sector.slug}`}
                  target="_blank"
                  className="text-[11px] font-medium text-slate-600 hover:text-blue-600 flex items-center gap-1 transition"
                >
                  <span>Ver página</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/servicios/${sector.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl transition shadow-2xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Editar Landing</span>
                  </Link>
                  <button
                    onClick={() => handleDeleteSector(sector.id, sector.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Eliminar servicio"
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
