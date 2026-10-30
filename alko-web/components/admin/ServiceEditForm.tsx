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
  Layers,
  Sparkles,
  Shield,
  ListChecks,
  FileText,
  HelpCircle,
  ExternalLink,
  Plus,
  Compass,
} from "lucide-react";
import type {
  Sector,
  SectorCommitment,
  SectorProblem,
  SectorFaq,
  SectorLandingData,
  SectorCapacidadTecnica,
} from "@/lib/types";

interface ServiceEditFormProps {
  initialSector?: Sector | null;
  isNew?: boolean;
}

const DEFAULT_COMMITMENTS: SectorCommitment[] = [
  { title: "Presupuesto cerrado", text: "Por partidas y acordado antes de empezar" },
  { title: "Plazo por escrito", text: "Con hitos de control durante la obra" },
  { title: "Un único equipo", text: "De proyecto a entrega, sin intermediarios" },
];

const DEFAULT_CAPACIDADES: SectorCapacidadTecnica[] = [
  {
    codigo: "01",
    titulo: "Arquitectura & Proyecto Ejecutivo",
    metrica: "Modelado BIM · Planimetría",
    resumen: "Desarrollo técnico minucioso, optimización de espacios y selección de materiales nobles previa al inicio de obra.",
    puntos: ["Detalles constructivos a escala 1:1", "Asesoramiento continuo en interiorismo"],
  },
  {
    codigo: "02",
    titulo: "Gestión Integral de Licencias",
    metrica: "Ayuntamiento · ECLU Madrid",
    resumen: "Tramitación técnica completa de licencias de obra mayor, menor y proyectos de actividad sin retrasos burocráticos.",
    puntos: ["Seguridad jurídica garantizada", "Gestión directa con técnicos municipales"],
  },
  {
    codigo: "03",
    titulo: "Instalaciones & Eficiencia",
    metrica: "Aerotermia · Suelo Radiante · Clima",
    resumen: "Cálculo e instalación de envolventes térmicas, ventilación mecánica con recuperación y domótica de vanguardia.",
    puntos: ["Ahorros energéticos de hasta el 70%", "Confort acústico y térmico homogéneo"],
  },
  {
    codigo: "04",
    titulo: "Acabados & Carpintería a Medida",
    metrica: "Tolerancia milimétrica",
    resumen: "Fabricación propia de panelados, armarios integrados, cerrajerías enrasadas y cocinas de diseño exclusivo.",
    puntos: ["Materiales nobles: maderas, piedras y metales", "Alineaciones enrasadas sin molduras visibles"],
  },
  {
    codigo: "05",
    titulo: "Control y Dirección de Obra Diaria",
    metrica: "Supervisión a pie de obra",
    resumen: "Presencia continua de un arquitecto técnico para garantizar la calidad de colocación y el cumplimiento de hitos.",
    puntos: ["Inspecciones en cada fase antes de cerrar", "Coordinación estricta de gremios especializados"],
  },
  {
    codigo: "06",
    titulo: "Entrega Llave en Mano & Garantía",
    metrica: "Dossier As-Built · Certificaciones",
    resumen: "Recepción de obra tras pruebas exhaustivas de estanqueidad, planos finales y garantía legal posventa directa.",
    puntos: ["Manual de mantenimiento del inmueble", "Respuesta posventa prioritaria"],
  },
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

export default function ServiceEditForm({ initialSector, isNew = false }: ServiceEditFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "general" | "hero" | "capacidades" | "problems" | "includes" | "content" | "faqs"
  >("general");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const includesImageInputRef = useRef<HTMLInputElement>(null);
  const supportImageInputRef = useRef<HTMLInputElement>(null);

  // Inicialización de sector y landing
  const [sector, setSector] = useState<Partial<Sector>>(() => {
    if (initialSector) {
      const existingLanding = initialSector.landing || {};
      return {
        ...initialSector,
        landing: {
          heroHeadline: existingLanding.heroHeadline || initialSector.title,
          lead: existingLanding.lead || initialSector.descripcion,
          statsTitle: existingLanding.statsTitle || "Proyectos entregados",
          commitments: existingLanding.commitments?.length ? existingLanding.commitments : [...DEFAULT_COMMITMENTS],
          problemsHeadline: existingLanding.problemsHeadline || "Una obra sin sorpresas.",
          problems: existingLanding.problems?.length ? existingLanding.problems : [...DEFAULT_PROBLEMS],
          includesHeadline: existingLanding.includesHeadline || "Todo en un mismo equipo.",
          includesSubtitle: existingLanding.includesSubtitle || "Qué incluye",
          includes: existingLanding.includes?.length ? existingLanding.includes : [
            "Redistribución de tabiquería y espacios",
            "Renovación completa de fontanería y saneamiento",
            "Instalación eléctrica y cuadro general según REBT",
            "Climatización por conductos o suelo radiante",
            "Carpinterías exteriores con rotura de puente térmico",
            "Carpintería a medida: puertas, armarios y panelados",
          ],
          includesImage: existingLanding.includesImage || "",
          capacidadesHeadline: existingLanding.capacidadesHeadline || "Capacidades Técnicas",
          capacidadesSubtitle: existingLanding.capacidadesSubtitle || "DISCIPLINAS TÉCNICAS & METODOLOGÍA",
          capacidades: existingLanding.capacidades?.length ? existingLanding.capacidades : [...DEFAULT_CAPACIDADES],
          processHeadline: existingLanding.processHeadline || "6 fases, un solo equipo.",
          supportTitle: existingLanding.supportTitle || "Rigurosidad técnica en cada fase",
          supportContent: existingLanding.supportContent || "Supervisamos minuciosamente cada partida con un arquitecto técnico asignado a tu obra, asegurando el cumplimiento de normativas y las más altas calidades constructivas.",
          supportImage: existingLanding.supportImage || "",
          faqHeadline: existingLanding.faqHeadline || "Lo que suelen preguntarnos antes de empezar.",
          faqs: existingLanding.faqs?.length ? existingLanding.faqs : [...DEFAULT_FAQS],
          ctaHeadline: existingLanding.ctaHeadline || `Hablemos de tu proyecto de ${initialSector.title.toLowerCase()}.`,
          ctaText: existingLanding.ctaText || "Cuéntanos qué necesitas y el equipo técnico te responderá con una valoración del alcance, el plazo y el presupuesto.",
        },
      };
    }

    return {
      id: "sec-" + Date.now(),
      numero: "01",
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
        capacidadesHeadline: "Capacidades Técnicas",
        capacidadesSubtitle: "DISCIPLINAS TÉCNICAS & METODOLOGÍA",
        capacidades: [...DEFAULT_CAPACIDADES],
        processHeadline: "6 fases, un solo equipo.",
        supportTitle: "Rigurosidad técnica en cada fase",
        supportContent: "Supervisamos minuciosamente cada partida con un arquitecto técnico asignado a tu obra, asegurando el cumplimiento de normativas y las más altas calidades constructivas.",
        supportImage: "",
        faqHeadline: "Lo que suelen preguntarnos antes de empezar.",
        faqs: [...DEFAULT_FAQS],
        ctaHeadline: "",
        ctaText: "Cuéntanos qué necesitas y el equipo técnico te responderá con una valoración del alcance, el plazo y el presupuesto.",
      },
    };
  });

  const updateLanding = (patch: Partial<SectorLandingData>) => {
    setSector((prev) => ({
      ...prev,
      landing: {
        ...(prev.landing || {}),
        ...patch,
      },
    }));
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sector.title?.trim()) {
      setErrorMessage("El título del servicio es obligatorio.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const slug =
      sector.slug?.trim() ||
      sector.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const toSave: Sector = {
      id: sector.id || "sec-" + Date.now(),
      numero: sector.numero || "01",
      title: sector.title.trim(),
      slug: slug,
      descripcion: sector.descripcion || "",
      imagen: sector.imagen || "/sector-oficinas.jpg",
      enlace: `/servicios/${slug}`,
      content: sector.content || "",
      landing: sector.landing,
    };

    try {
      const res = await fetch("/api/admin/servicios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSave),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar el servicio");

      setSuccessToast(`Servicio guardado con éxito`);
      setTimeout(() => {
        router.push("/admin/servicios");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "Error al guardar el servicio");
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
            href="/admin/servicios"
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition"
            title="Volver al listado"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-0.5">
              <Layers className="w-3.5 h-3.5" />
              <span>{isNew ? "Crear Nuevo Servicio" : "Editar Servicio"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {sector.title || "Nuevo Servicio"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {sector.slug && (
            <Link
              href={`/servicios/${sector.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-xl shadow-2xs transition"
            >
              <span>Ver landing en vivo</span>
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
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pestañas de Navegación fijas */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 border-b border-slate-200 flex items-center gap-1 overflow-x-auto bg-slate-50/50 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`py-3.5 px-4 border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === "general"
                ? "border-blue-600 text-blue-600 font-semibold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>General & Portada</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("hero")}
            className={`py-3.5 px-4 border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === "hero"
                ? "border-blue-600 text-blue-600 font-semibold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Hero & Compromisos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("capacidades")}
            className={`py-3.5 px-4 border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === "capacidades"
                ? "border-blue-600 text-blue-600 font-semibold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Capacidades Técnicas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("problems")}
            className={`py-3.5 px-4 border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === "problems"
                ? "border-blue-600 text-blue-600 font-semibold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Por qué ALKO (Evita)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("includes")}
            className={`py-3.5 px-4 border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === "includes"
                ? "border-blue-600 text-blue-600 font-semibold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ListChecks className="w-4 h-4" />
            <span>Qué Incluye</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`py-3.5 px-4 border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === "content"
                ? "border-blue-600 text-blue-600 font-semibold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Texto Técnico & Cierre</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("faqs")}
            className={`py-3.5 px-4 border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === "faqs"
                ? "border-blue-600 text-blue-600 font-semibold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Preguntas Frecuentes</span>
          </button>
        </div>

        {/* Contenido del formulario */}
        <div className="p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: DATOS GENERALES */}
          {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in duration-150 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nº Índice
                  </label>
                  <input
                    type="text"
                    required
                    value={sector.numero || ""}
                    onChange={(e) => setSector({ ...sector, numero: e.target.value })}
                    placeholder="01"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>

                <div className="md:col-span-9">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Título del Servicio / Especialidad
                  </label>
                  <input
                    type="text"
                    required
                    value={sector.title || ""}
                    onChange={(e) => setSector({ ...sector, title: e.target.value })}
                    placeholder="ej: Reformas Integrales de Alta Gama"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Slug Personalizado (Ruta pública en la web)
                </label>
                <div className="flex items-center">
                  <span className="px-4 py-2.5 bg-slate-100 border border-r-0 border-slate-200 text-xs text-slate-500 rounded-l-xl font-mono">
                    /servicios/
                  </span>
                  <input
                    type="text"
                    value={sector.slug || ""}
                    onChange={(e) => setSector({ ...sector, slug: e.target.value })}
                    placeholder="reformas-integrales"
                    className="w-full px-3.5 py-2.5 rounded-r-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Fotografía Principal (Fondo de cabecera y tarjeta en listados)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="w-36 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative shrink-0">
                    {sector.imagen ? (
                      <Image
                        src={sector.imagen}
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
                      value={sector.imagen || ""}
                      onChange={(e) => setSector({ ...sector, imagen: e.target.value })}
                      placeholder="/sector-oficinas.jpg o URL pública"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono focus:outline-none focus:border-blue-500 bg-white"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => mainImageInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium transition shadow-2xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-blue-600" />
                        <span>Subir fotografía desde tu equipo</span>
                      </button>
                      <input
                        type="file"
                        ref={mainImageInputRef}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadGeneric(file, (url) => setSector({ ...sector, imagen: url }));
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Descripción Corta para Tarjetas y Portada
                </label>
                <textarea
                  rows={3}
                  value={sector.descripcion || ""}
                  onChange={(e) => setSector({ ...sector, descripcion: e.target.value })}
                  placeholder="Resumen directo que aparecerá en el listado general /servicios y en la portada Home..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
            </div>
          )}

          {/* TAB 2: HERO & COMPROMISOS */}
          {activeTab === "hero" && (
            <div className="space-y-6 animate-in fade-in duration-150 max-w-4xl">
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
                  value={sector.landing?.heroHeadline || ""}
                  onChange={(e) => updateLanding({ heroHeadline: e.target.value })}
                  placeholder={sector.title || "ej: Reformas Integrales de Alta Gama"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Entradilla Técnica (Lead descriptivo en la cabecera)
                </label>
                <textarea
                  rows={3}
                  value={sector.landing?.lead || ""}
                  onChange={(e) => updateLanding({ lead: e.target.value })}
                  placeholder="Párrafo destacado que explica el enfoque específico de este servicio..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              {/* 3 Compromisos Clave */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-800">
                    3 Compromisos Clave (Cabecera y Barra de Confianza)
                  </label>
                  <span className="text-[11px] text-slate-400">Aparecen con check ✓</span>
                </div>

                <div className="space-y-3">
                  {(sector.landing?.commitments || DEFAULT_COMMITMENTS).map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-5">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">Título compromiso {idx + 1}</span>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const copy = [...(sector.landing?.commitments || DEFAULT_COMMITMENTS)];
                            copy[idx] = { ...copy[idx], title: e.target.value };
                            updateLanding({ commitments: copy });
                          }}
                          className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div className="md:col-span-7">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">Detalle descriptivo</span>
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => {
                            const copy = [...(sector.landing?.commitments || DEFAULT_COMMITMENTS)];
                            copy[idx] = { ...copy[idx], text: e.target.value };
                            updateLanding({ commitments: copy });
                          }}
                          className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-blue-500 bg-white"
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
                  value={sector.landing?.statsTitle || "Proyectos entregados"}
                  onChange={(e) => updateLanding({ statsTitle: e.target.value })}
                  placeholder="Proyectos entregados"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
            </div>
          )}

          {/* TAB: CAPACIDADES TÉCNICAS */}
          {activeTab === "capacidades" && (
            <div className="space-y-6 animate-in fade-in duration-150 max-w-4xl">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-600" />
                  <span>Capacidades Técnicas & Disciplinas Especializadas</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Las 6 tarjetas modulares que detallan la solvencia técnica, ingeniería y rigor constructivo de ALKO para este servicio.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Subtítulo Superior
                  </label>
                  <input
                    type="text"
                    value={sector.landing?.capacidadesSubtitle || "DISCIPLINAS TÉCNICAS & METODOLOGÍA"}
                    onChange={(e) => updateLanding({ capacidadesSubtitle: e.target.value })}
                    placeholder="DISCIPLINAS TÉCNICAS & METODOLOGÍA"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Titular H2 de Capacidades
                  </label>
                  <input
                    type="text"
                    value={sector.landing?.capacidadesHeadline || "Capacidades Técnicas"}
                    onChange={(e) => updateLanding({ capacidadesHeadline: e.target.value })}
                    placeholder="Capacidades Técnicas"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {(sector.landing?.capacidades || DEFAULT_CAPACIDADES).map((cap, idx) => (
                  <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="font-mono text-xs font-bold text-[#b87600]">Disciplina 0{idx + 1} ({cap.codigo})</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      <div className="md:col-span-8">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Título de la Capacidad
                        </label>
                        <input
                          type="text"
                          value={cap.titulo}
                          onChange={(e) => {
                            const copy = [...(sector.landing?.capacidades || DEFAULT_CAPACIDADES)];
                            copy[idx] = { ...copy[idx], titulo: e.target.value };
                            updateLanding({ capacidades: copy });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-4">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Métrica / Badge
                        </label>
                        <input
                          type="text"
                          value={cap.metrica}
                          onChange={(e) => {
                            const copy = [...(sector.landing?.capacidades || DEFAULT_CAPACIDADES)];
                            copy[idx] = { ...copy[idx], metrica: e.target.value };
                            updateLanding({ capacidades: copy });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Resumen Explicativo
                      </label>
                      <textarea
                        rows={2}
                        value={cap.resumen}
                        onChange={(e) => {
                          const copy = [...(sector.landing?.capacidades || DEFAULT_CAPACIDADES)];
                          copy[idx] = { ...copy[idx], resumen: e.target.value };
                          updateLanding({ capacidades: copy });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Puntos Clave con Check ✓ (separados por coma o salto de línea)
                      </label>
                      <input
                        type="text"
                        value={cap.puntos.join(", ")}
                        onChange={(e) => {
                          const copy = [...(sector.landing?.capacidades || DEFAULT_CAPACIDADES)];
                          copy[idx] = {
                            ...copy[idx],
                            puntos: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          };
                          updateLanding({ capacidades: copy });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: POR QUÉ ALKO (PROBLEMAS Y PROMESAS) */}
          {activeTab === "problems" && (
            <div className="space-y-6 animate-in fade-in duration-150 max-w-4xl">
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
                  value={sector.landing?.problemsHeadline || "Una obra sin sorpresas."}
                  onChange={(e) => updateLanding({ problemsHeadline: e.target.value })}
                  placeholder="Una obra sin sorpresas."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <div className="space-y-4">
                {(sector.landing?.problems || DEFAULT_PROBLEMS).map((item, idx) => (
                  <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-700">Tarjeta 0{idx + 1}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-rose-600 mb-1">
                          Lo que se evita (Dolor común)
                        </label>
                        <input
                          type="text"
                          value={item.avoid}
                          onChange={(e) => {
                            const copy = [...(sector.landing?.problems || DEFAULT_PROBLEMS)];
                            copy[idx] = { ...copy[idx], avoid: e.target.value };
                            updateLanding({ problems: copy });
                          }}
                          placeholder="Gremios descoordinados"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
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
                            const copy = [...(sector.landing?.problems || DEFAULT_PROBLEMS)];
                            copy[idx] = { ...copy[idx], promise: e.target.value };
                            updateLanding({ problems: copy });
                          }}
                          placeholder="Un único equipo coordina toda la obra"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: QUÉ INCLUYE */}
          {activeTab === "includes" && (
            <div className="space-y-6 animate-in fade-in duration-150 max-w-4xl">
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
                    value={sector.landing?.includesSubtitle || "Qué incluye"}
                    onChange={(e) => updateLanding({ includesSubtitle: e.target.value })}
                    placeholder="Qué incluye"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Titular de la Sección
                  </label>
                  <input
                    type="text"
                    value={sector.landing?.includesHeadline || "Todo en un mismo equipo."}
                    onChange={(e) => updateLanding({ includesHeadline: e.target.value })}
                    placeholder="Todo en un mismo equipo."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Imagen de la sección qué incluye */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Fotografía de esta Sección (Columna izquierda)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="w-32 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative shrink-0">
                    {sector.landing?.includesImage || sector.imagen ? (
                      <Image
                        src={sector.landing?.includesImage || sector.imagen || "/service-interior-2.jpg"}
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
                      value={sector.landing?.includesImage || ""}
                      onChange={(e) => updateLanding({ includesImage: e.target.value })}
                      placeholder="URL o ruta de imagen (dejar vacío para usar la segunda foto del servicio)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono focus:outline-none focus:border-blue-500 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => includesImageInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium transition shadow-2xs"
                    >
                      <Upload className="w-3 h-3 text-blue-600" />
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
                  rows={8}
                  value={(sector.landing?.includes || []).join("\n")}
                  onChange={(e) => {
                    const items = e.target.value.split("\n").filter((l) => l.trim().length > 0);
                    updateLanding({ includes: items });
                  }}
                  placeholder={"Redistribución de tabiquería y espacios\nRenovación completa de fontanería\nInstalación eléctrica y climatización\nCarpintería a medida"}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 5: TEXTO TÉCNICO & CIERRE */}
          {activeTab === "content" && (
            <div className="space-y-6 animate-in fade-in duration-150 max-w-4xl">
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
                  value={sector.landing?.supportTitle || ""}
                  onChange={(e) => updateLanding({ supportTitle: e.target.value })}
                  placeholder="ej: Rigurosidad técnica en cada fase"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Texto Explicativo del Bloque de Apoyo
                </label>
                <textarea
                  rows={4}
                  value={sector.landing?.supportContent || ""}
                  onChange={(e) => updateLanding({ supportContent: e.target.value })}
                  placeholder="Supervisamos minuciosamente cada partida con un arquitecto técnico asignado a tu obra..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Fotografía del Bloque Técnico (Columna derecha)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="w-32 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative shrink-0">
                    {sector.landing?.supportImage || sector.imagen ? (
                      <Image
                        src={sector.landing?.supportImage || sector.imagen || "/service-interior-2.jpg"}
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
                      value={sector.landing?.supportImage || ""}
                      onChange={(e) => updateLanding({ supportImage: e.target.value })}
                      placeholder="URL o ruta de imagen"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono focus:outline-none focus:border-blue-500 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => supportImageInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium transition shadow-2xs"
                    >
                      <Upload className="w-3 h-3 text-blue-600" />
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

              <div className="pt-4 border-t border-slate-200">
                <h5 className="text-xs font-bold text-slate-800 mb-3">Sección de Cierre / Solicitud de Valoración</h5>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Titular de Cierre (H2)
                    </label>
                    <input
                      type="text"
                      value={sector.landing?.ctaHeadline || ""}
                      onChange={(e) => updateLanding({ ctaHeadline: e.target.value })}
                      placeholder={`Hablemos de tu proyecto de ${sector.title?.toLowerCase() || "reforma"}.`}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Texto Descriptivo de Cierre
                    </label>
                    <textarea
                      rows={2}
                      value={sector.landing?.ctaText || ""}
                      onChange={(e) => updateLanding({ ctaText: e.target.value })}
                      placeholder="Cuéntanos qué necesitas y el equipo técnico te responderá con una valoración del alcance, el plazo y el presupuesto."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PREGUNTAS FRECUENTES (FAQS) */}
          {activeTab === "faqs" && (
            <div className="space-y-6 animate-in fade-in duration-150 max-w-4xl">
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
                  value={sector.landing?.faqHeadline || "Lo que suelen preguntarnos antes de empezar."}
                  onChange={(e) => updateLanding({ faqHeadline: e.target.value })}
                  placeholder="Lo que suelen preguntarnos antes de empezar."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-4">
                {(sector.landing?.faqs || DEFAULT_FAQS).map((faq, idx) => (
                  <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-700">Pregunta 0{idx + 1}</span>
                      {(sector.landing?.faqs || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...(sector.landing?.faqs || DEFAULT_FAQS)];
                            copy.splice(idx, 1);
                            updateLanding({ faqs: copy });
                          }}
                          className="text-rose-500 hover:text-rose-700 text-xs font-medium"
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
                          const copy = [...(sector.landing?.faqs || DEFAULT_FAQS)];
                          copy[idx] = { ...copy[idx], q: e.target.value };
                          updateLanding({ faqs: copy });
                        }}
                        placeholder="¿Cómo empieza el proceso?"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <textarea
                        rows={2}
                        value={faq.a}
                        onChange={(e) => {
                          const copy = [...(sector.landing?.faqs || DEFAULT_FAQS)];
                          copy[idx] = { ...copy[idx], a: e.target.value };
                          updateLanding({ faqs: copy });
                        }}
                        placeholder="Respuesta detallada..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const copy = [...(sector.landing?.faqs || DEFAULT_FAQS)];
                    copy.push({ q: "¿Nueva pregunta?", a: "Respuesta orientativa..." });
                    updateLanding({ faqs: copy });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir otra pregunta frecuente</span>
                </button>
              </div>
            </div>
          )}

          {/* Botones inferiores */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
            <Link
              href="/admin/servicios"
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition"
            >
              ← Cancelar y volver
            </Link>

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
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
