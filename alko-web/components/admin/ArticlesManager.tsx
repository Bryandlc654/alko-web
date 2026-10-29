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
  Calendar,
  Tag,
} from "lucide-react";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface ArticlesManagerProps {
  articles: Article[];
}

export default function ArticlesManager({ articles }: ArticlesManagerProps) {
  const [articlesList, setArticlesList] = useState<Article[]>(articles);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("TODAS");
  const [successToast, setSuccessToast] = useState("");

  const categories = Array.from(
    new Set(articlesList.map((a) => a.category).filter(Boolean))
  );

  const filteredArticles = articlesList.filter((a) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      a.title?.toLowerCase().includes(q) ||
      a.slug?.toLowerCase().includes(q) ||
      a.excerpt?.toLowerCase().includes(q);
    const matchesCat =
      selectedCategory === "TODAS" || a.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente el artículo "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/articulos?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar artículo");

      setArticlesList((prev) => prev.filter((a) => a.id !== id && a.slug !== id));
      setSuccessToast(`Artículo "${title}" eliminado`);
      setTimeout(() => setSuccessToast(""), 3500);
    } catch (err: any) {
      alert("Error eliminando artículo: " + err.message);
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
            <span>Módulo de Artículos Técnicos</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Gestión de Conocimiento y Artículos
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Publica, edita y organiza los artículos técnicos de ALKO Studio. Cada artículo genera automáticamente su índice de contenidos (TOC) y calcula el tiempo de lectura.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/articulos/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Artículo</span>
          </Link>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por título o contenido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory("TODAS")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                selectedCategory === "TODAS"
                  ? "bg-slate-900 text-white font-semibold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Todas
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white font-semibold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Mostrando <span className="font-semibold text-slate-800">{filteredArticles.length}</span> de{" "}
          <span className="font-semibold text-slate-800">{articlesList.length}</span> artículos
        </div>
      </div>

      {/* Grid de Artículos */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">No se encontraron artículos</h3>
          <p className="text-xs text-slate-400 mt-1">
            Intenta con otro término de búsqueda o crea uno nuevo con el botón superior.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Portada */}
                <div className="h-44 w-full relative bg-slate-100 overflow-hidden">
                  {art.image ? (
                    <Image
                      src={art.image}
                      alt={art.title}
                      fill
                      className="object-cover object-center transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                      Sin imagen
                    </div>
                  )}

                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] font-semibold tracking-wider uppercase">
                    {art.category || "General"}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <Link
                      href={`/conocimiento/${art.slug}`}
                      target="_blank"
                      title="Ver artículo público"
                      className="p-1.5 bg-white/90 hover:bg-white text-slate-700 rounded-lg shadow-xs backdrop-blur-sm transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-slate-400 text-[11px] mb-2 font-medium">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {art.date ? formatDate(art.date) : "Sin fecha"}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-500 font-light mt-2 line-clamp-2 leading-relaxed">
                    {art.excerpt || "Sin extracto introductorio..."}
                  </p>
                </div>
              </div>

              {/* Botones inferiores */}
              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/conocimiento/${art.slug}`}
                  target="_blank"
                  className="text-[11px] font-medium text-slate-600 hover:text-blue-600 flex items-center gap-1 transition"
                >
                  <span>Ver artículo</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/articulos/${art.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl transition shadow-2xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Editar Artículo</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(art.id, art.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Eliminar artículo"
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
