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
  Plus,
  ExternalLink,
} from "lucide-react";
import type { Article } from "@/lib/types";
import { slugify } from "@/lib/utils";
import RichTextEditor from "./RichTextEditor";

interface ArticleEditFormProps {
  initialArticle?: Article | null;
  initialCategories?: string[];
  isNew?: boolean;
}

export default function ArticleEditForm({
  initialArticle,
  initialCategories = ["Metodología", "Instalaciones", "Materiales", "Normativa", "Estructuras", "General"],
  isNew = false,
}: ArticleEditFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [newCatName, setNewCatName] = useState("");
  const [isAddingCat, setIsAddingCat] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Controlar si el slug fue modificado manualmente por el usuario
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!isNew);

  const [article, setArticle] = useState<Partial<Article>>(() => {
    if (initialArticle) return initialArticle;
    return {
      id: "art-" + Date.now(),
      title: "",
      slug: "",
      category: categories[0] || "Metodología",
      excerpt: "",
      content: "<p>Entradilla técnica del artículo explicando los condicionantes y objetivos...</p>\n\n<h2>1. Criterios de partida</h2>\n<p>Detalle técnico de los factores clave a considerar durante la ejecución de obra...</p>\n\n<h2>2. Recomendaciones de los técnicos</h2>\n<p>Puntos de control recomendados para garantizar la calidad y durabilidad...</p>",
      image: "/art1.jpg",
      date: new Date().toISOString().split("T")[0],
    };
  });

  // Generación automática del slug cuando cambia el título (a menos que se haya modificado a mano)
  const handleTitleChange = (newTitle: string) => {
    const updated = { ...article, title: newTitle };
    if (!isSlugManuallyEdited) {
      updated.slug = slugify(newTitle);
    }
    setArticle(updated);
  };

  const handleSlugChange = (newSlug: string) => {
    setIsSlugManuallyEdited(true);
    setArticle({ ...article, slug: newSlug });
  };

  // Crear nueva categoría
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;

    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setArticle((prev) => ({ ...prev, category: trimmed }));
      setNewCatName("");
      setIsAddingCat(false);
      return;
    }

    const updated = [...categories, trimmed];
    setCategories(updated);
    setArticle((prev) => ({ ...prev, category: trimmed }));
    setNewCatName("");
    setIsAddingCat(false);

    try {
      await fetch("/api/admin/articulos/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: updated }),
      });
    } catch (err) {
      console.warn("Error guardando categoría:", err);
    }
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

      setArticle((prev) => ({ ...prev, image: data.url }));
    } catch (err: any) {
      setErrorMessage(err.message || "Error al subir la fotografía");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article.title?.trim()) {
      setErrorMessage("El título del artículo es obligatorio.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const finalSlug = (article.slug?.trim() || slugify(article.title)) || "articulo-" + Date.now();

    const toSave: Article = {
      id: article.id || "art-" + Date.now(),
      title: article.title.trim(),
      slug: finalSlug,
      category: article.category || "Metodología",
      excerpt: article.excerpt || "",
      content: article.content || "",
      image: article.image || "/art1.jpg",
      date: article.date || new Date().toISOString().split("T")[0],
    };

    try {
      const res = await fetch("/api/admin/articulos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSave),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar el artículo");

      setSuccessToast("Artículo guardado con éxito");
      setTimeout(() => {
        router.push("/admin/articulos");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "Error al guardar el artículo");
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
            href="/admin/articulos"
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition"
            title="Volver a artículos"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-0.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isNew ? "Crear Nuevo Artículo" : "Editar Artículo Técnico"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {article.title || "Nuevo Artículo"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {article.slug && (
            <Link
              href={`/conocimiento/${article.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-xl shadow-2xs transition"
            >
              <span>Ver artículo en vivo</span>
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
                <span>Guardar Artículo</span>
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

        {/* Fila 1: Título y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-8">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Título del Artículo Técnico *
            </label>
            <input
              type="text"
              required
              value={article.title || ""}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ej. Cómo planificar una reforma integral en Madrid sin desviaciones"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-sm font-medium transition bg-white"
            />
          </div>

          <div className="md:col-span-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Categoría Temática
              </label>
              <button
                type="button"
                onClick={() => setIsAddingCat(!isAddingCat)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
              >
                <Plus className="w-3 h-3" />
                <span>Nueva categoría</span>
              </button>
            </div>

            {isAddingCat ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Nombre categoría..."
                  className="flex-1 px-3 py-2 rounded-xl border border-blue-400 text-xs focus:outline-none bg-blue-50/20"
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
                >
                  Añadir
                </button>
              </div>
            ) : (
              <select
                value={article.category || categories[0] || "Metodología"}
                onChange={(e) => setArticle({ ...article, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-xs font-medium transition bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Fila 2: Slug automático y Fecha */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-8">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Slug Personalizado (Generado automáticamente desde el título)
              </label>
              {isSlugManuallyEdited && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSlugManuallyEdited(false);
                    setArticle({ ...article, slug: slugify(article.title || "") });
                  }}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  Regenerar desde título
                </button>
              )}
            </div>
            <div className="flex items-center">
              <span className="px-3.5 py-2.5 bg-slate-100 border border-r-0 border-slate-200 text-xs text-slate-500 rounded-l-xl font-mono">
                /conocimiento/
              </span>
              <input
                type="text"
                value={article.slug || ""}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="como-planificar-una-reforma-integral"
                className="w-full px-3.5 py-2.5 rounded-r-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-600 transition"
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Fecha de Publicación
            </label>
            <input
              type="date"
              value={article.date ? article.date.split("T")[0] : ""}
              onChange={(e) => setArticle({ ...article, date: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600 transition"
            />
          </div>
        </div>

        {/* Fila 3: Imagen de Portada */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Fotografía de Portada del Artículo
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
            <div className="w-32 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative shrink-0">
              {article.image ? (
                <Image
                  src={article.image}
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
                value={article.image || ""}
                onChange={(e) => setArticle({ ...article, image: e.target.value })}
                placeholder="/art1.jpg o URL pública"
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

        {/* Fila 4: Extracto / Resumen */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Extracto Breve (Resumen para listados y tarjetas)
          </label>
          <textarea
            rows={2}
            value={article.excerpt || ""}
            onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
            placeholder="Las claves que marcan la diferencia entre una obra fluida y un cúmulo de sorpresas..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-xs text-slate-800 leading-relaxed bg-white"
          />
        </div>

        {/* Fila 5: Contenido Completo del Artículo con Editor Visual */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-800">
              Contenido del Artículo
            </label>
            <span className="text-[11px] text-slate-500">
              Usa los botones de formato para dar estilo, listas y crear secciones H2
            </span>
          </div>

          <RichTextEditor
            value={article.content || ""}
            onChange={(html) => setArticle({ ...article, content: html })}
            placeholder="Comienza a redactar el artículo técnico... Puedes añadir párrafos, títulos H2/H3, viñetas, enlaces y citas."
            minHeight="380px"
          />
        </div>

        {/* Botones inferiores */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          <Link
            href="/admin/articulos"
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
                <span>Guardar Artículo</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
