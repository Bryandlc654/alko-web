"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Building,
  MapPin,
  Maximize2,
  DollarSign,
  Clock,
  CheckCircle2,
  Trash2,
  Download,
  ChevronDown,
  ChevronUp,
  FileText,
  TrendingUp,
  XCircle,
  Save,
  Kanban as KanbanIcon,
  List as ListIcon,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import type { Lead, LeadEstado } from "@/lib/types";

interface LeadsCrmManagerProps {
  initialLeads: Lead[];
}

const KANBAN_STAGES: LeadEstado[] = [
  "nuevo",
  "contactado",
  "en_estudio",
  "presupuestado",
  "ganado",
  "descartado",
];

const ESTADOS_CONFIG: Record<
  LeadEstado,
  {
    label: string;
    shortLabel: string;
    bg: string;
    text: string;
    border: string;
    borderTop: string;
    columnBg: string;
    icon: any;
  }
> = {
  nuevo: {
    label: "Nuevo (Sin contactar)",
    shortLabel: "Nuevo",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    borderTop: "border-t-blue-500",
    columnBg: "bg-blue-50/30",
    icon: Clock,
  },
  contactado: {
    label: "Contactado",
    shortLabel: "Contactado",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    borderTop: "border-t-amber-500",
    columnBg: "bg-amber-50/30",
    icon: Phone,
  },
  en_estudio: {
    label: "En Estudio / Visita",
    shortLabel: "En Estudio",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    borderTop: "border-t-purple-500",
    columnBg: "bg-purple-50/30",
    icon: Building,
  },
  presupuestado: {
    label: "Presupuestado",
    shortLabel: "Presupuestado",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    borderTop: "border-t-indigo-500",
    columnBg: "bg-indigo-50/30",
    icon: DollarSign,
  },
  ganado: {
    label: "Obra Ganada",
    shortLabel: "Ganada",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    borderTop: "border-t-emerald-500",
    columnBg: "bg-emerald-50/30",
    icon: CheckCircle2,
  },
  descartado: {
    label: "Descartado",
    shortLabel: "Descartado",
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    borderTop: "border-t-slate-400",
    columnBg: "bg-slate-50/60",
    icon: XCircle,
  },
};

export default function LeadsCrmManager({ initialLeads }: LeadsCrmManagerProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [filterTipoForm, setFilterTipoForm] = useState<string>("todos");

  // Detalle desplegable de cada ficha (vista lista)
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);

  // Modal para detalle completo e inspección rápida (vista kanban / lista)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Notas en edición
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Drag and Drop State para Kanban
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<LeadEstado | null>(null);

  // Cargar preferencia de vista guardada
  useEffect(() => {
    try {
      const saved = localStorage.getItem("alko_leads_view_mode");
      if (saved === "list" || saved === "kanban") {
        setViewMode(saved);
      }
    } catch {
      // Ignorar si localStorage no está disponible
    }
  }, []);

  const handleToggleViewMode = (mode: "kanban" | "list") => {
    setViewMode(mode);
    try {
      localStorage.setItem("alko_leads_view_mode", mode);
    } catch {
      // Ignorar error
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Filtrado de leads
  const filteredLeads = leads.filter((l) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      l.nombre.toLowerCase().includes(q) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.telefono && l.telefono.toLowerCase().includes(q)) ||
      (l.tipo && l.tipo.toLowerCase().includes(q)) ||
      (l.ubicacion && l.ubicacion.toLowerCase().includes(q));

    const matchesEstado =
      viewMode === "kanban" || filterEstado === "todos" || l.estado === filterEstado;
    const matchesForm = filterTipoForm === "todos" || l.tipoFormulario === filterTipoForm;

    return matchesSearch && matchesEstado && matchesForm;
  });

  // Métricas
  const totalLeads = leads.length;
  const nuevosCount = leads.filter((l) => l.estado === "nuevo").length;
  const enEstudioCount = leads.filter(
    (l) => l.estado === "contactado" || l.estado === "en_estudio"
  ).length;
  const presupuestadosCount = leads.filter((l) => l.estado === "presupuestado").length;
  const ganadosCount = leads.filter((l) => l.estado === "ganado").length;

  // Actualizar estado de lead
  const handleStatusChange = async (id: string, nuevoEstado: LeadEstado) => {
    setUpdatingStatusId(id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      });

      if (!res.ok) throw new Error("Error al actualizar estado");

      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, estado: nuevoEstado } : l)));
      showToast(`Estado actualizado a: ${ESTADOS_CONFIG[nuevoEstado]?.shortLabel || nuevoEstado}`);
    } catch (e: any) {
      alert(e.message || "Error al actualizar");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Mover etapa a la anterior o siguiente
  const handleMoveStep = (id: string, currentEstado: LeadEstado, direction: "prev" | "next") => {
    const currentIndex = KANBAN_STAGES.indexOf(currentEstado);
    if (currentIndex === -1) return;

    if (direction === "prev" && currentIndex > 0) {
      handleStatusChange(id, KANBAN_STAGES[currentIndex - 1]);
    } else if (direction === "next" && currentIndex < KANBAN_STAGES.length - 1) {
      handleStatusChange(id, KANBAN_STAGES[currentIndex + 1]);
    }
  };

  // Guardar notas internas
  const handleSaveNotes = async (id: string) => {
    const nota = editingNotes[id] ?? leads.find((l) => l.id === id)?.notas ?? "";
    setSavingNoteId(id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notas: nota }),
      });

      if (!res.ok) throw new Error("Error al guardar notas");

      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notas: nota } : l)));
      showToast("Nota de seguimiento comercial guardada");
    } catch (e: any) {
      alert(e.message || "Error al guardar notas");
    } finally {
      setSavingNoteId(null);
    }
  };

  // Eliminar lead
  const handleDeleteLead = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar definitivamente el lead de ${nombre}?`)) return;

    try {
      const res = await fetch(`/api/admin/leads?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar lead");

      setLeads((prev) => prev.filter((l) => l.id !== id));
      if (selectedLeadId === id) setSelectedLeadId(null);
      showToast("Lead eliminado del CRM");
    } catch (e: any) {
      alert(e.message || "Error al eliminar");
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggedLeadId(id);
  };

  const handleDragEnd = () => {
    setDraggedLeadId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: LeadEstado) => {
    e.preventDefault();
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, columnId: LeadEstado) => {
    if (dragOverColumn === columnId) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, columnId: LeadEstado) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggedLeadId;
    setDraggedLeadId(null);
    setDragOverColumn(null);

    if (!id) return;
    const targetLead = leads.find((l) => l.id === id);
    if (targetLead && targetLead.estado !== columnId) {
      await handleStatusChange(id, columnId);
    }
  };

  // Exportar a CSV
  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert("No hay leads para exportar");
      return;
    }

    const headers = [
      "ID",
      "Fecha",
      "Tipo Formulario",
      "Nombre",
      "Email",
      "Teléfono",
      "Tipo Obra",
      "Ubicación",
      "Superficie",
      "Presupuesto",
      "Situación",
      "Plazo",
      "Origen",
      "Estado",
      "Mensaje",
      "Notas",
    ];

    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${new Date(l.creadoEn).toLocaleString("es-ES")}"`,
      `"${l.tipoFormulario}"`,
      `"${(l.nombre || "").replace(/"/g, '""')}"`,
      `"${(l.email || l.contacto || "").replace(/"/g, '""')}"`,
      `"${(l.telefono || "").replace(/"/g, '""')}"`,
      `"${(l.tipo || "").replace(/"/g, '""')}"`,
      `"${(l.ubicacion || "").replace(/"/g, '""')}"`,
      `"${(l.superficie || "").replace(/"/g, '""')}"`,
      `"${(l.presupuesto || "").replace(/"/g, '""')}"`,
      `"${(l.situacion || "").replace(/"/g, '""')}"`,
      `"${(l.fecha || "").replace(/"/g, '""')}"`,
      `"${(l.origen || "").replace(/"/g, '""')}"`,
      `"${l.estado}"`,
      `"${(l.mensaje || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      `"${(l.notas || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `alko_leads_crm_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || null;

  return (
    <div className="space-y-6">
      {/* Encabezado Principal y Controles de Vista */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            CRM de Leads y Oportunidades
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona el embudo comercial con vista interactiva de Lista y tablero Kanban con arrastrar y soltar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Conmutador de Vista: Lista / Kanban */}
          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl border border-slate-300/70">
            <button
              type="button"
              onClick={() => handleToggleViewMode("kanban")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "kanban"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Vista de tablero Kanban por etapas"
            >
              <KanbanIcon className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleViewMode("list")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "list"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Vista de listado detallado"
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>Lista</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Embudo de Métricas Comerciales */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Total Oportunidades</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{totalLeads}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-medium text-blue-600 block">Nuevos Sin Contactar</span>
          <span className="text-2xl font-bold text-blue-700 mt-1 block">{nuevosCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-medium text-amber-600 block">En Estudio / Visita</span>
          <span className="text-2xl font-bold text-amber-700 mt-1 block">{enEstudioCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-medium text-indigo-600 block">Presupuestados</span>
          <span className="text-2xl font-bold text-indigo-700 mt-1 block">{presupuestadosCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-medium text-emerald-600 block">Obras Ganadas</span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">{ganadosCount}</span>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por cliente, email, teléfono, zona o tipo de obra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {viewMode === "list" && (
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="todos">Todos los estados</option>
              <option value="nuevo">Nuevos</option>
              <option value="contactado">Contactados</option>
              <option value="en_estudio">En Estudio / Visita</option>
              <option value="presupuestado">Presupuestados</option>
              <option value="ganado">Obras Ganadas</option>
              <option value="descartado">Descartados</option>
            </select>
          )}

          <select
            value={filterTipoForm}
            onChange={(e) => setFilterTipoForm(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="todos">Todos los formularios</option>
            <option value="presupuesto">Presupuesto detallado</option>
            <option value="rapido">Contacto rápido</option>
          </select>

          <span className="text-xs text-slate-400 font-medium px-1">
            {filteredLeads.length} {filteredLeads.length === 1 ? "lead" : "leads"}
          </span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* VISTA 1: TABLERO KANBAN */}
      {/* ==================================================================== */}
      {viewMode === "kanban" && (
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-6 pt-1 items-start min-h-[580px] -mx-2 px-2 scrollbar-thin">
            {KANBAN_STAGES.map((stageKey) => {
              const conf = ESTADOS_CONFIG[stageKey];
              const Icon = conf.icon;
              const stageLeads = filteredLeads.filter((l) => l.estado === stageKey);
              const isOver = dragOverColumn === stageKey;

              return (
                <div
                  key={stageKey}
                  onDragOver={(e) => handleDragOver(e, stageKey)}
                  onDragLeave={(e) => handleDragLeave(e, stageKey)}
                  onDrop={(e) => handleDrop(e, stageKey)}
                  className={`w-[310px] shrink-0 rounded-2xl border transition-all duration-200 flex flex-col max-h-[calc(100vh-280px)] ${
                    isOver
                      ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-400/30 shadow-md"
                      : "border-slate-200/90 bg-slate-100/60"
                  }`}
                >
                  {/* Cabecera de Columna */}
                  <div
                    className={`p-3.5 bg-white rounded-t-2xl border-b border-slate-200 border-t-4 ${conf.borderTop} flex items-center justify-between shadow-2xs`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${conf.bg} ${conf.text}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-800">{conf.label}</h3>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${conf.bg} ${conf.text} border ${conf.border}`}
                    >
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Cuerpo Droppable de Tarjetas */}
                  <div className="p-2.5 flex-1 overflow-y-auto space-y-3 min-h-[300px]">
                    {stageLeads.length === 0 ? (
                      <div
                        className={`h-28 rounded-xl border border-dashed flex flex-col items-center justify-center text-center p-3 transition ${
                          isOver
                            ? "border-blue-400 bg-blue-100/30 text-blue-600"
                            : "border-slate-200 text-slate-400 bg-white/40"
                        }`}
                      >
                        <span className="text-[11px] font-medium">
                          {isOver ? "Soltar aquí para mover" : "Sin oportunidades"}
                        </span>
                      </div>
                    ) : (
                      stageLeads.map((lead) => {
                        const isDragging = draggedLeadId === lead.id;
                        const telefonoLimpio = (lead.telefono || lead.contacto || "").replace(
                          /[^+\d]/g,
                          ""
                        );
                        const whatsappMsg = encodeURIComponent(
                          `Hola ${lead.nombre}, nos ponemos en contacto de ALKO Reformas y Construcción sobre tu consulta de ${
                            lead.tipo || "obra"
                          }. ¿En qué momento te viene bien conversar?`
                        );
                        const whatsappUrl = telefonoLimpio
                          ? `https://wa.me/${telefonoLimpio.replace(/[^\d]/g, "")}?text=${whatsappMsg}`
                          : "";

                        const dateFormatted = new Date(lead.creadoEn).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                        });

                        return (
                          <div
                            key={lead.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, lead.id)}
                            onDragEnd={handleDragEnd}
                            className={`group relative bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-grab active:cursor-grabbing space-y-2.5 ${
                              isDragging ? "opacity-40 scale-95 border-blue-400" : ""
                            }`}
                          >
                            {/* Grip & Header de tarjeta */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 shrink-0" />
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium shrink-0">
                                  {lead.tipoFormulario === "presupuesto" ? "Presupuesto" : "Contacto"}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                                <Calendar className="w-2.5 h-2.5" />
                                {dateFormatted}
                              </span>
                            </div>

                            {/* Nombre del cliente */}
                            <div>
                              <button
                                type="button"
                                onClick={() => setSelectedLeadId(lead.id)}
                                className="text-left font-bold text-xs text-slate-900 hover:text-blue-600 transition line-clamp-1 block w-full"
                              >
                                {lead.nombre}
                              </button>
                            </div>

                            {/* Tags de tipo y presupuesto */}
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                              {lead.tipo && (
                                <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                                  {lead.tipo}
                                </span>
                              )}
                              {lead.presupuesto && (
                                <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">
                                  {lead.presupuesto}
                                </span>
                              )}
                            </div>

                            {/* Ubicación y superficie */}
                            {(lead.ubicacion || lead.superficie) && (
                              <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                                {lead.ubicacion && (
                                  <span className="flex items-center gap-1 truncate max-w-[140px]">
                                    <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                    {lead.ubicacion}
                                  </span>
                                )}
                                {lead.superficie && (
                                  <span className="text-slate-600 font-medium">
                                    • {lead.superficie}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Vista previa de notas si existen */}
                            {lead.notas && (
                              <div className="p-1.5 rounded-lg bg-amber-50/70 border border-amber-200/50 text-[10px] text-amber-900 line-clamp-2">
                                <span className="font-semibold">Nota: </span>
                                {lead.notas}
                              </div>
                            )}

                            {/* Barra de Acciones de la Tarjeta */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                              {/* Botones de Contacto Rápido */}
                              <div className="flex items-center gap-1">
                                {whatsappUrl && (
                                  <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
                                    title="WhatsApp directo"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {telefonoLimpio && (
                                  <a
                                    href={`tel:${telefonoLimpio}`}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                                    title="Llamar"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {lead.email && (
                                  <a
                                    href={`mailto:${lead.email}`}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                                    title="Enviar email"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>

                              {/* Mover Etapa Izq/Der y Abrir Detalle */}
                              <div className="flex items-center gap-0.5">
                                <button
                                  type="button"
                                  disabled={stageKey === "nuevo"}
                                  onClick={() => handleMoveStep(lead.id, lead.estado, "prev")}
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 transition"
                                  title="Mover a etapa anterior"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={stageKey === "descartado"}
                                  onClick={() => handleMoveStep(lead.id, lead.estado, "next")}
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 transition"
                                  title="Mover a siguiente etapa"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedLeadId(lead.id)}
                                  className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                                  title="Ver ficha completa"
                                >
                                  <Maximize2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* VISTA 2: LISTADO DETALLADO */}
      {/* ==================================================================== */}
      {viewMode === "list" && (
        <>
          {filteredLeads.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No se encontraron leads</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Cada vez que un cliente complete un formulario de presupuesto o contacto en la web,
                se registrará aquí de forma automática.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeads.map((lead) => {
                const conf = ESTADOS_CONFIG[lead.estado] || ESTADOS_CONFIG.nuevo;
                const StatusIcon = conf.icon;
                const isExpanded = expandedLeadId === lead.id;

                const dateFormatted = new Date(lead.creadoEn).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const telefonoLimpio = (lead.telefono || lead.contacto || "").replace(/[^+\d]/g, "");
                const whatsappMsg = encodeURIComponent(
                  `Hola ${lead.nombre}, nos ponemos en contacto de ALKO Reformas y Construcción en relación a tu solicitud sobre ${
                    lead.tipo || "tu proyecto"
                  }. ¿En qué horario te vendría bien conversar?`
                );
                const whatsappUrl = telefonoLimpio
                  ? `https://wa.me/${telefonoLimpio.replace(/[^\d]/g, "")}?text=${whatsappMsg}`
                  : "";

                return (
                  <div
                    key={lead.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all overflow-hidden"
                  >
                    {/* Cabecera Principal de la Ficha */}
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-base font-bold text-slate-900">{lead.nombre}</h3>

                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${conf.bg} ${conf.text} ${conf.border}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            <span>{conf.shortLabel}</span>
                          </span>

                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                            {lead.tipoFormulario === "presupuesto"
                              ? "Presupuesto Completo"
                              : "Contacto Rápido"}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          {lead.tipo && (
                            <span className="font-semibold text-blue-700 bg-blue-50/70 px-2 py-0.5 rounded-md">
                              {lead.tipo}
                            </span>
                          )}
                          {lead.superficie && (
                            <span className="font-medium text-slate-700">{lead.superficie}</span>
                          )}
                          {lead.ubicacion && (
                            <span className="flex items-center gap-1 text-slate-500">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {lead.ubicacion}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {dateFormatted}
                          </span>
                        </div>
                      </div>

                      {/* Acciones Rápidas de Contacto y Estado */}
                      <div className="flex flex-wrap items-center gap-2">
                        {telefonoLimpio && (
                          <a
                            href={`tel:${telefonoLimpio}`}
                            className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition"
                            title="Llamar al cliente"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}

                        {whatsappUrl && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition"
                            title="Escribir por WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        )}

                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition"
                            title="Enviar correo"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}

                        {/* Selector de Estado Comercial */}
                        <select
                          value={lead.estado}
                          disabled={updatingStatusId === lead.id}
                          onChange={(e) =>
                            handleStatusChange(lead.id, e.target.value as LeadEstado)
                          }
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                        >
                          <option value="nuevo">Estado: Nuevo</option>
                          <option value="contactado">Estado: Contactado</option>
                          <option value="en_estudio">Estado: En Estudio / Visita</option>
                          <option value="presupuestado">Estado: Presupuestado</option>
                          <option value="ganado">Estado: Obra Ganada</option>
                          <option value="descartado">Estado: Descartado</option>
                        </select>

                        {/* Botón desplegar ficha */}
                        <button
                          onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                          className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
                          title={isExpanded ? "Ocultar detalles" : "Ver detalles completos"}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>

                        {/* Botón eliminar */}
                        <button
                          onClick={() => handleDeleteLead(lead.id, lead.nombre)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition"
                          title="Eliminar lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Panel Desplegable con Todos los Detalles Técnicos y Notas */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/50 space-y-4 animate-in fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                          {lead.email && (
                            <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                                Correo Electrónico
                              </span>
                              <span className="text-slate-800 font-medium break-all">
                                {lead.email}
                              </span>
                            </div>
                          )}

                          {lead.telefono && (
                            <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                                Teléfono
                              </span>
                              <span className="text-slate-800 font-medium">{lead.telefono}</span>
                            </div>
                          )}

                          {lead.presupuesto && (
                            <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                                Presupuesto Estimado
                              </span>
                              <span className="text-emerald-700 font-bold">
                                {lead.presupuesto}
                              </span>
                            </div>
                          )}

                          {lead.situacion && (
                            <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                                Situación Inmueble
                              </span>
                              <span className="text-slate-800 font-medium">{lead.situacion}</span>
                            </div>
                          )}

                          {lead.fecha && (
                            <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                                Plazo Previsto
                              </span>
                              <span className="text-slate-800 font-medium">{lead.fecha}</span>
                            </div>
                          )}

                          {lead.origen && (
                            <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                                Origen de la Conversión
                              </span>
                              <span className="text-slate-600 font-mono text-[11px]">
                                {lead.origen}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Mensaje original del cliente */}
                        {lead.mensaje && (
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
                            <span className="font-bold text-slate-900 block mb-1">
                              Mensaje del Cliente:
                            </span>
                            <p className="whitespace-pre-line text-slate-600">{lead.mensaje}</p>
                          </div>
                        )}

                        {/* Bloc de Notas de Seguimiento Comercial */}
                        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-amber-700" />
                              Notas Internas de Seguimiento Comercial
                            </span>

                            <button
                              type="button"
                              disabled={savingNoteId === lead.id}
                              onClick={() => handleSaveNotes(lead.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>
                                {savingNoteId === lead.id ? "Guardando..." : "Guardar Nota"}
                              </span>
                            </button>
                          </div>

                          <textarea
                            rows={2}
                            placeholder="Apunta llamadas, visita técnica agendada, presupuesto enviado o detalles de contacto..."
                            value={
                              editingNotes[lead.id] !== undefined
                                ? editingNotes[lead.id]
                                : lead.notas || ""
                            }
                            onChange={(e) =>
                              setEditingNotes((prev) => ({ ...prev, [lead.id]: e.target.value }))
                            }
                            className="w-full p-2.5 rounded-xl border border-amber-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ==================================================================== */}
      {/* MODAL DETALLE COMPLETO (ACCESIBLE DESDE KANBAN O LISTA) */}
      {/* ==================================================================== */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedLeadId(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/50">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{selectedLead.nombre}</h2>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      ESTADOS_CONFIG[selectedLead.estado].bg
                    } ${ESTADOS_CONFIG[selectedLead.estado].text} ${
                      ESTADOS_CONFIG[selectedLead.estado].border
                    }`}
                  >
                    {ESTADOS_CONFIG[selectedLead.estado].shortLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Registrado el {new Date(selectedLead.creadoEn).toLocaleString("es-ES")}
                  <span className="font-mono bg-slate-200/80 px-1.5 py-0.5 rounded text-[10px] text-slate-700">
                    {selectedLead.tipoFormulario === "presupuesto" ? "Presupuesto" : "Contacto rápido"}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLeadId(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Acciones de Contacto Rápido */}
              <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                <span className="text-xs font-bold text-blue-900 mr-1">Contacto directo:</span>
                {selectedLead.telefono && (
                  <>
                    <a
                      href={`tel:${selectedLead.telefono.replace(/[^+\d]/g, "")}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-700 hover:text-blue-700 border border-slate-200 font-semibold shadow-2xs hover:shadow-xs transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>{selectedLead.telefono}</span>
                    </a>
                    <a
                      href={`https://wa.me/${selectedLead.telefono.replace(
                        /[^\d]/g,
                        ""
                      )}?text=${encodeURIComponent(
                        `Hola ${selectedLead.nombre}, te contactamos de ALKO Reformas.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </>
                )}
                {selectedLead.email && (
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-700 hover:text-blue-700 border border-slate-200 font-semibold shadow-2xs hover:shadow-xs transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedLead.email}</span>
                  </a>
                )}
              </div>

              {/* Selector de Estado Comercial */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Etapa en el Embudo Comercial:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {KANBAN_STAGES.map((st) => {
                    const active = selectedLead.estado === st;
                    const c = ESTADOS_CONFIG[st];
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(selectedLead.id, st)}
                        className={`p-2 rounded-xl border text-xs font-semibold text-left transition flex items-center justify-between ${
                          active
                            ? `${c.bg} ${c.text} ${c.border} ring-2 ring-blue-500/20 shadow-2xs`
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span>{c.shortLabel}</span>
                        {active && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ficha Técnica de la Solicitud */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedLead.tipo && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                      Tipo de Obra / Servicio
                    </span>
                    <span className="text-slate-800 font-semibold">{selectedLead.tipo}</span>
                  </div>
                )}
                {selectedLead.presupuesto && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                      Presupuesto Estimado
                    </span>
                    <span className="text-emerald-700 font-bold">{selectedLead.presupuesto}</span>
                  </div>
                )}
                {selectedLead.ubicacion && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                      Ubicación / Población
                    </span>
                    <span className="text-slate-800 font-medium">{selectedLead.ubicacion}</span>
                  </div>
                )}
                {selectedLead.superficie && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                      Superficie Aproximada
                    </span>
                    <span className="text-slate-800 font-medium">{selectedLead.superficie}</span>
                  </div>
                )}
                {selectedLead.situacion && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                      Situación del Inmueble
                    </span>
                    <span className="text-slate-800 font-medium">{selectedLead.situacion}</span>
                  </div>
                )}
                {selectedLead.fecha && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                      Plazo Previsto de Inicio
                    </span>
                    <span className="text-slate-800 font-medium">{selectedLead.fecha}</span>
                  </div>
                )}
              </div>

              {/* Mensaje */}
              {selectedLead.mensaje && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Mensaje / Detalles facilitados por el cliente
                  </span>
                  <p className="whitespace-pre-line text-slate-700 leading-relaxed font-medium">
                    {selectedLead.mensaje}
                  </p>
                </div>
              )}

              {/* Notas de Seguimiento */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    Notas Internas de Seguimiento Comercial
                  </span>
                  <button
                    type="button"
                    disabled={savingNoteId === selectedLead.id}
                    onClick={() => handleSaveNotes(selectedLead.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>
                      {savingNoteId === selectedLead.id ? "Guardando..." : "Guardar Nota"}
                    </span>
                  </button>
                </div>

                <textarea
                  rows={3}
                  placeholder="Apunta llamadas, visitas agendadas, detalles técnicos, presupuestos enviados..."
                  value={
                    editingNotes[selectedLead.id] !== undefined
                      ? editingNotes[selectedLead.id]
                      : selectedLead.notas || ""
                  }
                  onChange={(e) =>
                    setEditingNotes((prev) => ({
                      ...prev,
                      [selectedLead.id]: e.target.value,
                    }))
                  }
                  className="w-full p-2.5 rounded-xl border border-amber-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteLead(selectedLead.id, selectedLead.nombre)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar Lead</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedLeadId(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 text-xs font-semibold transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
