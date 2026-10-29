"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Search,
  Upload,
  ArrowUp,
  ArrowDown,
  Mail,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Camera,
} from "lucide-react";
import type { MiembroEquipo } from "@/lib/types";

interface TeamManagerProps {
  initialMembers: MiembroEquipo[];
}

export default function TeamManager({ initialMembers }: TeamManagerProps) {
  const [members, setMembers] = useState<MiembroEquipo[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<MiembroEquipo> | null>(null);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const filteredMembers = members.filter((m) => {
    const q = searchTerm.toLowerCase();
    return m.nombre.toLowerCase().includes(q) || m.rol.toLowerCase().includes(q);
  });

  const handleOpenNew = () => {
    setEditingMember({
      nombre: "",
      rol: "",
      foto: "/oficinas.jpg",
      email: "",
      linkedin: "",
      bio: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: MiembroEquipo) => {
    setEditingMember({ ...m });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al subir la imagen");

      setEditingMember((prev) => (prev ? { ...prev, foto: data.url } : null));
      showToast("Imagen subida con éxito");
    } catch (err: any) {
      alert(err.message || "Error al subir imagen");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.nombre || !editingMember.rol) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/equipo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMember),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar el miembro");

      setMembers(data.miembros || []);
      setIsModalOpen(false);
      setEditingMember(null);
      showToast("Miembro del equipo guardado");
    } catch (err: any) {
      alert(err.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar a ${nombre} del equipo?`)) return;

    try {
      const res = await fetch(`/api/admin/equipo?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar");

      setMembers(data.miembros || []);
      showToast(`${nombre} eliminado del equipo`);
    } catch (err: any) {
      alert(err.message || "Error al eliminar");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= members.length) return;

    const newOrder = [...members];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    setMembers(newOrder);

    try {
      const ids = newOrder.map((m) => m.id || m.nombre);
      await fetch("/api/admin/equipo/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      showToast("Orden del equipo actualizado");
    } catch {
      // Revert if error
      setMembers(members);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y Acción Crear */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            Equipo Técnico y Profesionales
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra los arquitectos, directores de obra e ingenieros mostrados en la página pública.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/equipo"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 transition"
          >
            <span>Ver /equipo en vivo</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            onClick={handleOpenNew}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Miembro</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Buscador y Resumen */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nombre o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium px-2">
          <span>{members.length} profesionales en plantilla</span>
        </div>
      </div>

      {/* Cuadrícula de Miembros */}
      {filteredMembers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No se encontraron profesionales</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Prueba con otro término de búsqueda o añade un nuevo miembro con el botón superior.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMembers.map((m, index) => (
            <div
              key={m.id || m.nombre + index}
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Imagen del miembro */}
                <div className="relative aspect-[4/5] w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={m.foto || "/oficinas.jpg"}
                    alt={m.nombre}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/40 backdrop-blur-md p-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                      className="p-1.5 rounded-lg text-white hover:bg-white/20 disabled:opacity-30"
                      title="Mover hacia la izquierda/arriba"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === members.length - 1}
                      onClick={() => handleMove(index, "down")}
                      className="p-1.5 rounded-lg text-white hover:bg-white/20 disabled:opacity-30"
                      title="Mover hacia la derecha/abajo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {m.nombre}
                      </h3>
                      <span className="inline-block mt-0.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        {m.rol}
                      </span>
                    </div>
                  </div>

                  {m.bio && (
                    <p className="text-xs text-slate-500 line-clamp-2 pt-1 leading-relaxed">
                      {m.bio}
                    </p>
                  )}

                  {m.email && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{m.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Acciones inferiores */}
              <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">Posición #{index + 1}</span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(m)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 transition"
                    title="Editar miembro"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteMember(m.id || m.nombre, m.nombre)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white border border-transparent hover:border-slate-200 transition"
                    title="Eliminar miembro"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE CREACIÓN / EDICIÓN DE MIEMBRO                                   */}
      {/* ========================================================================= */}
      {isModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h3 className="text-base font-bold text-slate-900">
                {editingMember.id ? "Editar Miembro del Equipo" : "Nuevo Miembro del Equipo"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-6 space-y-4 overflow-y-auto">
              {/* Fotografía con selector y subida */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Fotografía de Perfil
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-24 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                    <Image
                      src={editingMember.foto || "/oficinas.jpg"}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <input
                      type="text"
                      placeholder="Ruta o URL: ej: /oficinas.jpg"
                      value={editingMember.foto || ""}
                      onChange={(e) =>
                        setEditingMember((prev) => ({ ...prev, foto: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Camera className="w-3.5 h-3.5 text-slate-500" />
                      <span>{uploadingImage ? "Subiendo..." : "Subir foto de ordenador"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Nombre y Rol */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nombre y Apellidos *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Alejandro Kort"
                    value={editingMember.nombre || ""}
                    onChange={(e) =>
                      setEditingMember((prev) => ({ ...prev, nombre: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Cargo o Especialidad *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Dirección técnica, Arquitectura"
                    value={editingMember.rol || ""}
                    onChange={(e) =>
                      setEditingMember((prev) => ({ ...prev, rol: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Email y LinkedIn */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Correo Electrónico (Opcional)
                  </label>
                  <input
                    type="email"
                    placeholder="alejandro@alkoreformas.com"
                    value={editingMember.email || ""}
                    onChange={(e) =>
                      setEditingMember((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Perfil de LinkedIn (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/..."
                    value={editingMember.linkedin || ""}
                    onChange={(e) =>
                      setEditingMember((prev) => ({ ...prev, linkedin: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Bio o resumen */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Trayectoria / Breve Reseña (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Experiencia previa, especialidad técnica o titulación..."
                  value={editingMember.bio || ""}
                  onChange={(e) =>
                    setEditingMember((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Guardando..." : "Guardar Miembro"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
