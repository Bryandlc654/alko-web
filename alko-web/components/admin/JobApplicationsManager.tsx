"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Search,
  Filter,
  FileText,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Plus,
  Edit2,
  CheckCircle2,
  Clock,
  UserCheck,
  XCircle,
  ExternalLink,
  ChevronDown,
  AlertCircle,
  Save,
  X,
} from "lucide-react";
import type { Candidatura, CandidaturaEstado, PosicionEmpleo } from "@/lib/types";

interface JobApplicationsManagerProps {
  initialCandidaturas: Candidatura[];
  initialVacantes: PosicionEmpleo[];
}

const ESTADOS_CONFIG: Record<
  CandidaturaEstado,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  nueva: {
    label: "Nueva",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: Clock,
  },
  en_revision: {
    label: "En revisión",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: Users,
  },
  entrevista: {
    label: "Entrevista",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: UserCheck,
  },
  descartada: {
    label: "Descartada",
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    icon: XCircle,
  },
};

export default function JobApplicationsManager({
  initialCandidaturas,
  initialVacantes,
}: JobApplicationsManagerProps) {
  const [activeTab, setActiveTab] = useState<"candidatos" | "vacantes">("candidatos");

  // Estado de candidaturas
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>(initialCandidaturas);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [filterPuesto, setFilterPuesto] = useState<string>("todos");

  // Estado de vacantes
  const [vacantes, setVacantes] = useState<PosicionEmpleo[]>(initialVacantes);
  const [isEditingVacancy, setIsEditingVacancy] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Partial<PosicionEmpleo> | null>(null);

  // Notificaciones y estados
  const [toastMessage, setToastMessage] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(false ? "" : ""), 4000);
  };

  // Filtrado de candidaturas
  const filteredCandidaturas = candidaturas.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      c.nombre.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.telefono.toLowerCase().includes(q) ||
      c.puesto.toLowerCase().includes(q);

    const matchesEstado = filterEstado === "todos" || c.estado === filterEstado;
    const matchesPuesto = filterPuesto === "todos" || c.puesto === filterPuesto;

    return matchesSearch && matchesEstado && matchesPuesto;
  });

  // Puestos únicos presentes para filtro
  const uniquePuestos = Array.from(new Set(candidaturas.map((c) => c.puesto)));

  // Acciones sobre candidaturas
  const handleUpdateStatus = async (id: string, nuevoEstado: CandidaturaEstado) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/empleo/postulaciones", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      });

      if (!res.ok) throw new Error("Error al actualizar el estado");

      setCandidaturas((prev) =>
        prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c))
      );
      showToast("Estado actualizado correctamente");
    } catch (e: any) {
      alert(e.message || "No se pudo actualizar");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteCandidatura = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar la postulación de ${nombre}?`)) return;

    try {
      const res = await fetch(`/api/admin/empleo/postulaciones?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar");

      setCandidaturas((prev) => prev.filter((c) => c.id !== id));
      showToast("Postulación eliminada");
    } catch (e: any) {
      alert(e.message || "Error al eliminar");
    }
  };

  // Acciones sobre vacantes
  const handleOpenNewVacancy = () => {
    setEditingVacancy({
      titulo: "",
      departamento: "Ejecución",
      ubicacion: "Madrid",
      tipo: "Jornada completa",
      resumen: "",
      activa: true,
    });
    setIsEditingVacancy(true);
  };

  const handleEditVacancy = (v: PosicionEmpleo) => {
    setEditingVacancy({ ...v });
    setIsEditingVacancy(true);
  };

  const handleSaveVacancy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVacancy || !editingVacancy.titulo) return;

    try {
      const res = await fetch("/api/admin/empleo/vacantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingVacancy),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");

      setVacantes(data.vacantes || []);
      setIsEditingVacancy(false);
      setEditingVacancy(null);
      showToast("Vacante guardada correctamente");
    } catch (e: any) {
      alert(e.message || "Error al guardar la vacante");
    }
  };

  const handleToggleActiveVacancy = async (v: PosicionEmpleo) => {
    const updated = { ...v, activa: v.activa === false ? true : false };
    try {
      const res = await fetch("/api/admin/empleo/vacantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar");
      setVacantes(data.vacantes || []);
      showToast(updated.activa ? `Vacante "${v.titulo}" activada y publicada` : `Vacante "${v.titulo}" pausada`);
    } catch (e: any) {
      alert(e.message || "Error al actualizar vacante");
    }
  };

  const handleDeleteVacancy = async (idOrTitulo: string, titulo: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la vacante "${titulo}"?`)) return;

    try {
      const res = await fetch(
        `/api/admin/empleo/vacantes?id=${encodeURIComponent(idOrTitulo)}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar");

      setVacantes(data.vacantes || []);
      showToast(`Vacante "${titulo}" eliminada`);
    } catch (e: any) {
      alert(e.message || "Error al eliminar vacante");
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y Selector de Pestañas */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-blue-600" />
            Gestión de Empleo y Postulaciones
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra las ofertas de empleo activas y revisa las candidaturas recibidas con sus CVs.
          </p>
        </div>

        {/* Pestañas */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab("candidatos")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === "candidatos"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Candidatos ({candidaturas.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("vacantes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === "vacantes"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Vacantes ({vacantes.length})</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 1: CANDIDATOS / POSTULACIONES RECIBIDAS                          */}
      {/* ========================================================================= */}
      {activeTab === "candidatos" && (
        <div className="space-y-5">
          {/* Métricas rápidas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 block">Total Postulaciones</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">{candidaturas.length}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-medium text-blue-600 block">Nuevas sin revisar</span>
              <span className="text-xl font-bold text-blue-700 mt-1 block">
                {candidaturas.filter((c) => c.estado === "nueva").length}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-medium text-amber-600 block">En Proceso / Revisión</span>
              <span className="text-xl font-bold text-amber-700 mt-1 block">
                {candidaturas.filter((c) => c.estado === "en_revision" || c.estado === "entrevista").length}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-medium text-emerald-600 block">Para Entrevista</span>
              <span className="text-xl font-bold text-emerald-700 mt-1 block">
                {candidaturas.filter((c) => c.estado === "entrevista").length}
              </span>
            </div>
          </div>

          {/* Filtros y Buscador */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o puesto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="todos">Todos los estados</option>
                <option value="nueva">Nuevas</option>
                <option value="en_revision">En revisión</option>
                <option value="entrevista">Entrevista</option>
                <option value="descartada">Descartadas</option>
              </select>

              {uniquePuestos.length > 0 && (
                <select
                  value={filterPuesto}
                  onChange={(e) => setFilterPuesto(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 max-w-[180px] truncate"
                >
                  <option value="todos">Todos los puestos</option>
                  {uniquePuestos.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Listado de Candidaturas */}
          {filteredCandidaturas.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No hay postulaciones registradas</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Cuando los candidatos apliquen desde la página web aparecerán listados aquí con su CV
                adjunto y datos de contacto.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredCandidaturas.map((c) => {
                const conf = ESTADOS_CONFIG[c.estado] || ESTADOS_CONFIG.nueva;
                const StatusIcon = conf.icon;
                const dateFormatted = new Date(c.fecha).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-base font-bold text-slate-900">{c.nombre}</h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${conf.bg} ${conf.text} ${conf.border}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            <span>{conf.label}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                          <span className="font-semibold text-blue-600 bg-blue-50/70 px-2 py-0.5 rounded-md">
                            {c.puesto}
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {dateFormatted}
                          </span>
                        </div>
                      </div>

                      {/* Selector de estado y botón eliminar */}
                      <div className="flex items-center gap-2">
                        <select
                          value={c.estado}
                          disabled={updatingId === c.id}
                          onChange={(e) =>
                            handleUpdateStatus(c.id, e.target.value as CandidaturaEstado)
                          }
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                        >
                          <option value="nueva">Estado: Nueva</option>
                          <option value="en_revision">Estado: En revisión</option>
                          <option value="entrevista">Estado: Entrevista</option>
                          <option value="descartada">Estado: Descartada</option>
                        </select>

                        <button
                          onClick={() => handleDeleteCandidatura(c.id, c.nombre)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition"
                          title="Eliminar postulación"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Canales de contacto y CV */}
                    <div className="flex flex-wrap items-center gap-4 text-xs pt-3 border-t border-slate-100">
                      <a
                        href={`mailto:${c.email}`}
                        className="inline-flex items-center gap-1.5 text-slate-700 hover:text-blue-600 font-medium"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.email}</span>
                      </a>

                      <a
                        href={`tel:${c.telefono}`}
                        className="inline-flex items-center gap-1.5 text-slate-700 hover:text-emerald-600 font-medium"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.telefono}</span>
                      </a>

                      {c.cvUrl ? (
                        <a
                          href={c.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-semibold transition"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-700" />
                          <span>Descargar CV ({c.cvNombre || "Curriculum"})</span>
                          <ExternalLink className="w-3 h-3 text-amber-600" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          (Sin archivo de CV adjunto)
                        </span>
                      )}
                    </div>

                    {/* Mensaje o carta de presentación */}
                    {c.mensaje && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                        <span className="font-semibold text-slate-700 block mb-1">
                          Carta de presentación:
                        </span>
                        {c.mensaje}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 2: GESTIÓN DE VACANTES Y OFERTAS DE EMPLEO                        */}
      {/* ========================================================================= */}
      {activeTab === "vacantes" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Estas vacantes se publican de forma inmediata en la página web pública{" "}
              <Link
                href="/trabaja-con-nosotros"
                target="_blank"
                className="text-blue-600 hover:underline font-medium inline-flex items-center gap-0.5"
              >
                /trabaja-con-nosotros <ExternalLink className="w-3 h-3" />
              </Link>
            </p>

            <button
              onClick={handleOpenNewVacancy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Vacante</span>
            </button>
          </div>

          {/* Listado de Vacantes */}
          <div className="grid grid-cols-1 gap-4">
            {vacantes.map((v, idx) => (
              <div
                key={v.id || v.titulo + idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-slate-900">{v.titulo}</h3>
                    <button
                      type="button"
                      onClick={() => handleToggleActiveVacancy(v)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border transition cursor-pointer ${v.activa !== false ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"}`}
                      title={v.activa !== false ? "Hacer clic para pausar vacante" : "Hacer clic para activar vacante"}
                    >
                      {v.activa !== false ? "Activa (Publicada)" : "Pausada"}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{v.resumen}</p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500 font-mono">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 font-medium">
                      {v.departamento}
                    </span>
                    <span>•</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 font-medium">
                      {v.ubicacion}
                    </span>
                    <span>•</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 font-medium">
                      {v.tipo}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEditVacancy(v)}
                    className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition"
                    title="Editar vacante"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteVacancy(v.id || v.titulo, v.titulo)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition"
                    title="Eliminar vacante"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PARA CREAR O EDITAR VACANTE                                         */}
      {/* ========================================================================= */}
      {isEditingVacancy && editingVacancy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h3 className="text-base font-bold text-slate-900">
                {editingVacancy.id ? "Editar Vacante" : "Nueva Vacante de Empleo"}
              </h3>
              <button
                onClick={() => setIsEditingVacancy(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVacancy} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Título del Puesto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Jefatura de Obra"
                  value={editingVacancy.titulo || ""}
                  onChange={(e) =>
                    setEditingVacancy((prev) => ({ ...prev, titulo: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Departamento
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Ejecución, Proyecto, Instalaciones"
                    value={editingVacancy.departamento || ""}
                    onChange={(e) =>
                      setEditingVacancy((prev) => ({ ...prev, departamento: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Madrid"
                    value={editingVacancy.ubicacion || ""}
                    onChange={(e) =>
                      setEditingVacancy((prev) => ({ ...prev, ubicacion: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tipo de Jornada
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Jornada completa, Indefinido"
                  value={editingVacancy.tipo || ""}
                  onChange={(e) =>
                    setEditingVacancy((prev) => ({ ...prev, tipo: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Resumen / Responsabilidades *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe las responsabilidades principales del puesto..."
                  value={editingVacancy.resumen || ""}
                  onChange={(e) =>
                    setEditingVacancy((prev) => ({ ...prev, resumen: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={editingVacancy.activa !== false}
                    onChange={(e) => setEditingVacancy((prev) => ({ ...prev, activa: e.target.checked }))}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    Vacante activa (visible públicamente en la página web)
                  </span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingVacancy(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Vacante</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
