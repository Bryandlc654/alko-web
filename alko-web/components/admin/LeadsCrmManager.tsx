"use client";

import { useState } from "react";
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
  AlertCircle,
  Trash2,
  Download,
  ChevronDown,
  ChevronUp,
  FileText,
  UserCheck,
  TrendingUp,
  XCircle,
  HelpCircle,
  Tag,
  Save,
} from "lucide-react";
import type { Lead, LeadEstado } from "@/lib/types";

interface LeadsCrmManagerProps {
  initialLeads: Lead[];
}

const ESTADOS_CONFIG: Record<
  LeadEstado,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  nuevo: {
    label: "Nuevo",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: Clock,
  },
  contactado: {
    label: "Contactado",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: Phone,
  },
  en_estudio: {
    label: "En Estudio / Visita",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    icon: Building,
  },
  presupuestado: {
    label: "Presupuestado",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    icon: DollarSign,
  },
  ganado: {
    label: "Obra Ganada",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  descartado: {
    label: "Descartado",
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    icon: XCircle,
  },
};

export default function LeadsCrmManager({ initialLeads }: LeadsCrmManagerProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [filterTipoForm, setFilterTipoForm] = useState<string>("todos");

  // Detalle desplegable de cada ficha
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);

  // Notas en edición
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

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

    const matchesEstado = filterEstado === "todos" || l.estado === filterEstado;
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
      showToast("Estado comercial actualizado");
    } catch (e: any) {
      alert(e.message || "Error al actualizar");
    } finally {
      setUpdatingStatusId(null);
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
      showToast("Nota de seguimiento guardada");
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
      showToast("Lead eliminado del CRM");
    } catch (e: any) {
      alert(e.message || "Error al eliminar");
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

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `alko_leads_crm_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y Acción Exportar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            CRM de Leads y Presupuestos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Bandeja comercial centralizada. Registra cada solicitud de contacto y presupuesto en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 shadow-xs transition"
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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
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
            <option value="descartada">Descartados</option>
          </select>

          <select
            value={filterTipoForm}
            onChange={(e) => setFilterTipoForm(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="todos">Todos los formularios</option>
            <option value="presupuesto">Presupuesto detallado</option>
            <option value="rapido">Contacto rápido</option>
          </select>
        </div>
      </div>

      {/* Lista de Fichas de Leads */}
      {filteredLeads.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No se encontraron leads</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Cada vez que un cliente complete un formulario de presupuesto o contacto en la web, se
            registrará aquí de forma automática.
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
              `Hola ${lead.nombre}, nos ponemos en contacto de ALKO Reformas y Construcción en relación a tu solicitud sobre ${lead.tipo || "tu proyecto"}. ¿En qué horario te vendría bien conversar?`
            );
            const whatsappUrl = telefonoLimpio ? `https://wa.me/${telefonoLimpio.replace(/[^\d]/g, "")}?text=${whatsappMsg}` : "";

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
                        <span>{conf.label}</span>
                      </span>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        {lead.tipoFormulario === "presupuesto" ? "Presupuesto Completo" : "Contacto Rápido"}
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
                    {/* Botones directos de llamada / whatsapp */}
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
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadEstado)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                    >
                      <option value="nuevo">Estado: Nuevo</option>
                      <option value="contactado">Estado: Contactado</option>
                      <option value="en_estudio">Estado: En Estudio / Visita</option>
                      <option value="presupuestado">Estado: Presupuestado</option>
                      <option value="ganado">Estado: Obra Ganada</option>
                      <option value="descartada">Estado: Descartado</option>
                    </select>

                    {/* Botón desplegar ficha */}
                    <button
                      onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                      className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
                      title={isExpanded ? "Ocultar detalles" : "Ver detalles completos"}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
                          <span className="text-slate-800 font-medium break-all">{lead.email}</span>
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
                          <span className="text-emerald-700 font-bold">{lead.presupuesto}</span>
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
                          <span className="text-slate-600 font-mono text-[11px]">{lead.origen}</span>
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
                          <span>{savingNoteId === lead.id ? "Guardando..." : "Guardar Nota"}</span>
                        </button>
                      </div>

                      <textarea
                        rows={2}
                        placeholder="Apunta llamadas, visita técnica agendada, presupuesto enviado o detalles de contacto..."
                        value={
                          editingNotes[lead.id] !== undefined ? editingNotes[lead.id] : lead.notas || ""
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
    </div>
  );
}
