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
  HelpCircle,
  Check,
  Shield,
  Sparkles,
  ListChecks,
  Camera,
  MessageSquare,
  Send,
} from "lucide-react";
import type { Sector, SectorCommitment, SectorProblem, SectorFaq, SectorLandingData } from "@/lib/types";

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

const DEFAULT_COMMITMENTS: SectorCommitment[] = [
  { title: "Presupuesto cerrado", text: "Por partidas y acordado antes de empezar" },
  { title: "Plazo por escrito", text: "Con hitos de control durante la obra" },
  { title: "Un único equipo", text: "De proyecto a entrega, sin intermediarios" },
];

const DEFAULT_PROBLEMS: SectorProblem[] = [
  { avoid: "Gremios descoordinados", promise: "Un único equipo coordina toda la obra" },
  { avoid: "Sobrecostes y retrasos", promise: "Presupuesto y plazo cerrados por escrito" },
  { avoid: "Nadie responde del conjunto", promise: "Un responsable técnico a pie de obra" },
];

const DEFAULT_FAQS: SectorFaq[] = [
  {
    q: "¿Cómo empieza el proceso?",
    a: "Nos cuentas qué necesitas, por formulario, por teléfono o por WhatsApp. Un técnico estudia el encargo y te responde con una valoración del alcance, el plazo y el presupuesto.",
  },
  {
    q: "¿Qué necesito para pedir una valoración?",
    a: "Basta con tu nombre y un teléfono o un correo. Si tienes planos, fotografías o un listado de lo que quieres hacer, puedes enviarlos después para afinar la valoración.",
  },
  {
    q: "¿Cómo se fija el precio?",
    a: "El presupuesto se desglosa por partidas y se acuerda antes de empezar. Si durante la obra surge algún cambio, se valora y se aprueba antes de ejecutarlo.",
  },
];

export default function ServicesManager({ sectors }: ServicesManagerProps) {
  const [sectorsList, setSectorsList] = useState<Sector[]>(sectors);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "hero" | "problems" | "includes" | "content" | "faqs">("general");
  const [currentSector, setCurrentSector] = useState<Partial<Sector> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const includesImageInputRef = useRef<HTMLInputElement>(null);
  const supportImageInputRef = useRef<HTMLInputElement>(null);

  const filteredSectors = sectorsList.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.title?.toLowerCase().includes(q) ||
      s.slug?.toLowerCase().includes(q) ||
      s.descripcion?.toLowerCase().includes(q)
    );
  });

  const handleOpenCreateModal = () => {
    const nextIdx = String(sectorsList.length + 1).padStart(2, "0");
    setCurrentSector({
      id: "sec-" + Date.now(),
      numero: nextIdx,
      title: "",
      slug: "",
      descripcion: "",
      imagen: "/sector-oficinas.jpg",
      enlace: "",
      content: "",
      landing: {
        heroHeadline: "",
        lead: "",
        statsTitle: "Proyectos entregados",
        commitments: [...DEFAULT_COMMITMENTS],
        problemsHeadline: "Una obra sin sorpresas.",
        problems: [...DEFAULT_PROBLEMS],
        includesHeadline: "Todo en un mismo equipo.",
        includesSubtitle: "Qué incluye",
        includes: [
          "Redistribución de tabiquería y espacios",
          "Renovación completa de fontanería y saneamiento",
          "Instalación eléctrica y cuadro general según REBT",
          "Climatización por conductos o suelo radiante",
          "Carpinterías exteriores con rotura de puente térmico",
          "Carpintería a medida: puertas, armarios y panelados",
        ],
        includesImage: "",
        processHeadline: "6 fases, un solo equipo.",
        supportTitle: "Rigurosidad técnica en cada fase",
        supportContent: "Supervisamos minuciosamente cada partida con un arquitecto técnico asignado a tu obra, asegurando el cumplimiento de normativas y las más altas calidades constructivas.",
        supportImage: "",
        faqHeadline: "Lo que suelen preguntarnos antes de empezar.",
        faqs: [...DEFAULT_FAQS],
        ctaHeadline: "",
        ctaText: "Cuéntanos qué necesitas y el equipo técnico te responderá con una valoración del alcance, el plazo y el presupuesto.",
      },
    });
    setActiveTab("general");
    setErrorMessage("");
    setIsEditingModalOpen(true);
  };

  const handleOpenEditModal = (sector: Sector) => {
    // Inicializar landing si no existía previamente con valores por defecto o extraídos de su content
    const existingLanding = sector.landing || {};
    const commitments = existingLanding.commitments && existingLanding.commitments.length > 0 
      ? existingLanding.commitments 
      : [...DEFAULT_COMMITMENTS];
    const problems = existingLanding.problems && existingLanding.problems.length > 0 
      ? existingLanding.problems 
      : [...DEFAULT_PROBLEMS];
    const faqs = existingLanding.faqs && existingLanding.faqs.length > 0 
      ? existingLanding.faqs 
      : [...DEFAULT_FAQS];

    setCurrentSector({
      ...sector,
      landing: {
        heroHeadline: existingLanding.heroHeadline || sector.title,
        lead: existingLanding.lead || sector.descripcion,
        statsTitle: existingLanding.statsTitle || "Proyectos entregados",
        commitments: commitments,
        problemsHeadline: existingLanding.problemsHeadline || "Una obra sin sorpresas.",
        problems: problems,
        includesHeadline: existingLanding.includesHeadline || "Todo en un mismo equipo.",
        includesSubtitle: existingLanding.includesSubtitle || "Qué incluye",
        includes: existingLanding.includes || [
          "Redistribución de tabiquería y espacios",
          "Renovación completa de fontanería y saneamiento",
          "Instalación eléctrica y cuadro general según REBT",
          "Climatización por conductos o suelo radiante",
          "Carpinterías exteriores con rotura de puente térmico",
          "Carpintería a medida: puertas, armarios y panelados",
        ],
        includesImage: existingLanding.includesImage || "",
        processHeadline: existingLanding.processHeadline || "6 fases, un solo equipo.",
        supportTitle: existingLanding.supportTitle || "Rigurosidad técnica en cada fase",
        supportContent: existingLanding.supportContent || "Supervisamos minuciosamente cada partida con un arquitecto técnico asignado a tu obra, asegurando el cumplimiento de normativas y las más altas calidades constructivas.",
        supportImage: existingLanding.supportImage || "",
        faqHeadline: existingLanding.faqHeadline || "Lo que suelen preguntarnos antes de empezar.",
        faqs: faqs,
        ctaHeadline: existingLanding.ctaHeadline || `Hablemos de tu proyecto de ${sector.title.toLowerCase()}.`,
        ctaText: existingLanding.ctaText || "Cuéntanos qué necesitas y el equipo técnico te responderá con una valoración del alcance, el plazo y el presupuesto.",
      },
    });
    setActiveTab("general");
    setErrorMessage("");
    setIsEditingModalOpen(true);
  };

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

  const handleUploadGeneric = async (file: File, onDone: (url: string) => void) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onDone(data.url);
    } catch (err: any) {
      alert("Error subiendo imagen: " + err.message);
    }
  };

  const updateLanding = (patch: Partial<SectorLandingData>) => {
    if (!currentSector) return;
    setCurrentSector({
      ...currentSector,
      landing: {
        ...(currentSector.landing || {}),
        ...patch,
      },
    });
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
      landing: currentSector.landing,
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
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Crea, edita y organiza las especialidades de ALKO Studio. Cada servicio dispone de su ficha para listados y de una landing page completa con su propio contenido, respetando la misma línea y estilo gráfico.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Servicio</span>
          </button>
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
                  <button
                    onClick={() => handleOpenEditModal(sector)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl transition shadow-2xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Editar Landing</span>
                  </button>
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

      {/* Modal de Creación / Edición Completa */}
      {isEditingModalOpen && currentSector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Cabecera del modal */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {currentSector.title ? `Editar: ${currentSector.title}` : "Crear Nuevo Servicio"}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Personaliza cada sección de la landing page con la misma estética de ALKO.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pestañas de Navegación del Editor */}
            <div className="px-6 border-b border-slate-200 flex items-center gap-1 overflow-x-auto bg-slate-50/30 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition shrink-0 ${
                  activeTab === "general"
                    ? "border-blue-600 text-blue-600 font-semibold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>General & Portada</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("hero")}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition shrink-0 ${
                  activeTab === "hero"
                    ? "border-blue-600 text-blue-600 font-semibold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hero & Compromisos</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("problems")}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition shrink-0 ${
                  activeTab === "problems"
                    ? "border-blue-600 text-blue-600 font-semibold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Por qué ALKO (Evita)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("includes")}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition shrink-0 ${
                  activeTab === "includes"
                    ? "border-blue-600 text-blue-600 font-semibold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <ListChecks className="w-3.5 h-3.5" />
                <span>Qué Incluye</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("content")}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition shrink-0 ${
                  activeTab === "content"
                    ? "border-blue-600 text-blue-600 font-semibold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Texto Técnico & Cierre</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("faqs")}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition shrink-0 ${
                  activeTab === "faqs"
                    ? "border-blue-600 text-blue-600 font-semibold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Preguntas Frecuentes</span>
              </button>
            </div>

            {/* Formulario con Scroll */}
            <form onSubmit={handleSaveSector} className="flex-1 overflow-y-auto p-6 space-y-6">
              {errorMessage && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* TAB 1: DATOS GENERALES */}
              {activeTab === "general" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Nº Índice
                      </label>
                      <input
                        type="text"
                        required
                        value={currentSector.numero || ""}
                        onChange={(e) => setCurrentSector({ ...currentSector, numero: e.target.value })}
                        placeholder="01"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                    </div>

                    <div className="md:col-span-9">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Título del Servicio / Especialidad
                      </label>
                      <input
                        type="text"
                        required
                        value={currentSector.title || ""}
                        onChange={(e) => setCurrentSector({ ...currentSector, title: e.target.value })}
                        placeholder="ej: Reformas Integrales de Alta Gama"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Slug Personalizado (URL pública)
                    </label>
                    <div className="flex items-center">
                      <span className="px-3.5 py-2 bg-slate-100 border border-r-0 border-slate-200 text-xs text-slate-500 rounded-l-xl font-mono">
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

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Fotografía Principal (Fondo de cabecera y tarjeta)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-28 h-18 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative shrink-0">
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
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadGeneric(file, (url) => setCurrentSector({ ...currentSector, imagen: url }));
                          }}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Descripción Corta para Tarjetas y Listados
                    </label>
                    <textarea
                      rows={2}
                      value={currentSector.descripcion || ""}
                      onChange={(e) => setCurrentSector({ ...currentSector, descripcion: e.target.value })}
                      placeholder="Resumen directo que aparecerá en el listado general /servicios y en la portada Home..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: HERO & COMPROMISOS */}
              {activeTab === "hero" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl">
                    <h4 className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Cabecera Principal de la Landing</span>
                    </h4>
                    <p className="text-[11px] text-amber-800/80">
                      Configura el titular de alto impacto y la entradilla explicativa que ve el usuario al entrar.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Titular Principal H1 (Por defecto usa el nombre del servicio)
                    </label>
                    <input
                      type="text"
                      value={currentSector.landing?.heroHeadline || ""}
                      onChange={(e) => updateLanding({ heroHeadline: e.target.value })}
                      placeholder={currentSector.title || "ej: Reformas Integrales de Alta Gama"}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Entradilla Técnica (Lead descriptivo en la cabecera)
                    </label>
                    <textarea
                      rows={3}
                      value={currentSector.landing?.lead || ""}
                      onChange={(e) => updateLanding({ lead: e.target.value })}
                      placeholder="Párrafo destacado que explica el enfoque específico de este servicio..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                  </div>

                  {/* 3 Compromisos de Cabecera y Franja de Cifras */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-800">
                        3 Compromisos Clave (Cabecera y Barra de Confianza)
                      </label>
                      <span className="text-[11px] text-slate-400">Aparecen con check ✓</span>
                    </div>

                    <div className="space-y-3">
                      {(currentSector.landing?.commitments || DEFAULT_COMMITMENTS).map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                          <div className="md:col-span-5">
                            <span className="text-[10px] font-semibold text-slate-500 uppercase">Título compromiso {idx + 1}</span>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const copy = [...(currentSector.landing?.commitments || DEFAULT_COMMITMENTS)];
                                copy[idx] = { ...copy[idx], title: e.target.value };
                                updateLanding({ commitments: copy });
                              }}
                              className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div className="md:col-span-7">
                            <span className="text-[10px] font-semibold text-slate-500 uppercase">Detalle descriptivo</span>
                            <input
                              type="text"
                              value={item.text}
                              onChange={(e) => {
                                const copy = [...(currentSector.landing?.commitments || DEFAULT_COMMITMENTS)];
                                copy[idx] = { ...copy[idx], text: e.target.value };
                                updateLanding({ commitments: copy });
                              }}
                              className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Etiqueta para la cifra de proyectos entregados
                    </label>
                    <input
                      type="text"
                      value={currentSector.landing?.statsTitle || "Proyectos entregados"}
                      onChange={(e) => updateLanding({ statsTitle: e.target.value })}
                      placeholder="Proyectos entregados"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: POR QUÉ ALKO (PROBLEMAS Y PROMESAS) */}
              {activeTab === "problems" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-amber-600" />
                      <span>Sección «Por qué ALKO — Lo que evitamos»</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Tres tarjetas visuales con imagen de fondo que contrastan los dolores habituales en las obras frente a la garantía que ofrece ALKO.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Titular de la Sección
                    </label>
                    <input
                      type="text"
                      value={currentSector.landing?.problemsHeadline || "Una obra sin sorpresas."}
                      onChange={(e) => updateLanding({ problemsHeadline: e.target.value })}
                      placeholder="Una obra sin sorpresas."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                  </div>

                  <div className="space-y-4">
                    {(currentSector.landing?.problems || DEFAULT_PROBLEMS).map((item, idx) => (
                      <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-amber-700">Tarjeta 0{idx + 1}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-rose-600 mb-1">
                              Lo que se evita (Dolor común)
                            </label>
                            <input
                              type="text"
                              value={item.avoid}
                              onChange={(e) => {
                                const copy = [...(currentSector.landing?.problems || DEFAULT_PROBLEMS)];
                                copy[idx] = { ...copy[idx], avoid: e.target.value };
                                updateLanding({ problems: copy });
                              }}
                              placeholder="Gremios descoordinados"
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-emerald-600 mb-1">
                              Compromiso ALKO (Solución)
                            </label>
                            <input
                              type="text"
                              value={item.promise}
                              onChange={(e) => {
                                const copy = [...(currentSector.landing?.problems || DEFAULT_PROBLEMS)];
                                copy[idx] = { ...copy[idx], promise: e.target.value };
                                updateLanding({ problems: copy });
                              }}
                              placeholder="Un único equipo coordina toda la obra"
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: QUÉ INCLUYE (LISTA DE PARTIDAS E IMAGEN) */}
              {activeTab === "includes" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <ListChecks className="w-4 h-4 text-amber-600" />
                      <span>Sección «Qué incluye este Servicio»</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Muestra la lista de partidas cubiertas con checks dorados y una fotografía de gran formato al lado.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Subtítulo superior
                      </label>
                      <input
                        type="text"
                        value={currentSector.landing?.includesSubtitle || "Qué incluye"}
                        onChange={(e) => updateLanding({ includesSubtitle: e.target.value })}
                        placeholder="Qué incluye"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Titular de la Sección
                      </label>
                      <input
                        type="text"
                        value={currentSector.landing?.includesHeadline || "Todo en un mismo equipo."}
                        onChange={(e) => updateLanding({ includesHeadline: e.target.value })}
                        placeholder="Todo en un mismo equipo."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Imagen de la sección qué incluye */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Fotografía de esta Sección (Columna izquierda)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative shrink-0">
                        <SafePreviewBox
                          src={currentSector.landing?.includesImage || currentSector.imagen || "/service-interior-2.jpg"}
                          alt="Preview"
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="text"
                          value={currentSector.landing?.includesImage || ""}
                          onChange={(e) => updateLanding({ includesImage: e.target.value })}
                          placeholder="URL o ruta de imagen (dejar vacío para usar la segunda foto del servicio)"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 font-mono focus:outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => includesImageInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Subir foto de sección</span>
                        </button>
                        <input
                          type="file"
                          ref={includesImageInputRef}
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadGeneric(file, (url) => updateLanding({ includesImage: url }));
                          }}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lista de partidas / qué incluye */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Partidas incluidas (una por línea)
                      </label>
                      <span className="text-[10px] text-slate-400">Cada renglón será un punto con check ✓</span>
                    </div>
                    <textarea
                      rows={6}
                      value={(currentSector.landing?.includes || []).join("\n")}
                      onChange={(e) => {
                        const items = e.target.value.split("\n").filter((l) => l.trim().length > 0);
                        updateLanding({ includes: items });
                      }}
                      placeholder={"Redistribución de tabiquería y espacios\nRenovación completa de fontanería\nInstalación eléctrica y climatización\nCarpintería a medida"}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-mono"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: TEXTO TÉCNICO & CIERRE */}
              {activeTab === "content" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span>Apartado Técnico de Apoyo y Llamada a la Acción (CTA)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Configura el bloque explicativo a doble columna y el mensaje final de contacto antes del pie de página.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Titular del Bloque Técnico de Apoyo
                    </label>
                    <input
                      type="text"
                      value={currentSector.landing?.supportTitle || ""}
                      onChange={(e) => updateLanding({ supportTitle: e.target.value })}
                      placeholder="ej: Rigurosidad técnica en cada fase"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Texto Explicativo del Bloque de Apoyo
                    </label>
                    <textarea
                      rows={4}
                      value={currentSector.landing?.supportContent || ""}
                      onChange={(e) => updateLanding({ supportContent: e.target.value })}
                      placeholder="Supervisamos minuciosamente cada partida con un arquitecto técnico asignado a tu obra..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Fotografía del Bloque Técnico (Columna derecha)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative shrink-0">
                        <SafePreviewBox
                          src={currentSector.landing?.supportImage || currentSector.imagen || "/service-interior-2.jpg"}
                          alt="Preview"
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="text"
                          value={currentSector.landing?.supportImage || ""}
                          onChange={(e) => updateLanding({ supportImage: e.target.value })}
                          placeholder="URL o ruta de imagen"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 font-mono focus:outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => supportImageInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Subir imagen técnica</span>
                        </button>
                        <input
                          type="file"
                          ref={supportImageInputRef}
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadGeneric(file, (url) => updateLanding({ supportImage: url }));
                          }}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <h5 className="text-xs font-bold text-slate-800 mb-2">Sección de Cierre / Solicitud de Valoración</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Titular de Cierre (H2)
                        </label>
                        <input
                          type="text"
                          value={currentSector.landing?.ctaHeadline || ""}
                          onChange={(e) => updateLanding({ ctaHeadline: e.target.value })}
                          placeholder={`Hablemos de tu proyecto de ${currentSector.title?.toLowerCase() || "reforma"}.`}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Texto Descriptivo de Cierre
                        </label>
                        <textarea
                          rows={2}
                          value={currentSector.landing?.ctaText || ""}
                          onChange={(e) => updateLanding({ ctaText: e.target.value })}
                          placeholder="Cuéntanos qué necesitas y el equipo técnico te responderá con una valoración del alcance, el plazo y el presupuesto."
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: PREGUNTAS FRECUENTES (FAQS) */}
              {activeTab === "faqs" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <span>Preguntas Frecuentes del Servicio</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Resuelve las dudas típicas que tiene el cliente antes de solicitar una valoración para este servicio.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Titular del Bloque de Preguntas
                    </label>
                    <input
                      type="text"
                      value={currentSector.landing?.faqHeadline || "Lo que suelen preguntarnos antes de empezar."}
                      onChange={(e) => updateLanding({ faqHeadline: e.target.value })}
                      placeholder="Lo que suelen preguntarnos antes de empezar."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    {(currentSector.landing?.faqs || DEFAULT_FAQS).map((faq, idx) => (
                      <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-700">Pregunta 0{idx + 1}</span>
                          {(currentSector.landing?.faqs || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const copy = [...(currentSector.landing?.faqs || DEFAULT_FAQS)];
                                copy.splice(idx, 1);
                                updateLanding({ faqs: copy });
                              }}
                              className="text-rose-500 hover:text-rose-700 text-[11px] font-medium"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            value={faq.q}
                            onChange={(e) => {
                              const copy = [...(currentSector.landing?.faqs || DEFAULT_FAQS)];
                              copy[idx] = { ...copy[idx], q: e.target.value };
                              updateLanding({ faqs: copy });
                            }}
                            placeholder="¿Cómo empieza el proceso?"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <textarea
                            rows={2}
                            value={faq.a}
                            onChange={(e) => {
                              const copy = [...(currentSector.landing?.faqs || DEFAULT_FAQS)];
                              copy[idx] = { ...copy[idx], a: e.target.value };
                              updateLanding({ faqs: copy });
                            }}
                            placeholder="Respuesta detallada..."
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...(currentSector.landing?.faqs || DEFAULT_FAQS)];
                        copy.push({ q: "¿Nueva pregunta?", a: "Respuesta orientativa..." });
                        updateLanding({ faqs: copy });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir otra pregunta frecuente</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Botones de pie de modal */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  Estás editando la especialidad: <strong className="text-slate-700">{currentSector.title || "Nuevo"}</strong>
                </div>

                <div className="flex items-center gap-3">
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
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition active:scale-95"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Guardar Servicio</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
