"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Save,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Eye,
  Plus,
  CheckCircle2,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react";
import type {
  NosotrosPageContent,
  ProjectsPageContent,
  HomeContent,
  Slide,
  Project,
  Sector,
  Fase,
  Fabricante,
  Article,
  SiteSettings,
} from "@/lib/types";
import InlineText from "@/components/admin/InlineText";
import InlineImage from "@/components/admin/InlineImage";
import ProjectsList from "@/components/ui/ProjectsList";
import SectorsList from "@/components/ui/SectorsList";
import ArticleCard from "@/components/ui/ArticleCard";
import Footer from "@/components/layout/Footer";
import { ROUTES } from "@/lib/site";
import { DEFAULT_PROJECTS_PAGE_CONTENT, DEFAULT_NOSOTROS_PAGE_CONTENT } from "@/lib/content";
import { Handshake, CalendarClock, Wallet, BadgeCheck } from "lucide-react";
import Materials from "@/components/sections/Materials";
import Process from "@/components/sections/Process";
import { METHOD_HREF } from "@/lib/site";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProjectsGallery from "@/components/ui/ProjectsGallery";
import { splitLead } from "@/lib/utils";
import { Layers } from "lucide-react";

interface LiveEditorProps {
  initialContent: HomeContent;
  initialProjectsPageContent?: ProjectsPageContent;
  initialNosotrosPageContent?: NosotrosPageContent;
  heroSlides: Slide[];
  showcaseSlides: Slide[];
  projects: Project[];
  sectors: Sector[];
  fases: Fase[];
  fabricantes: Fabricante[];
  articles: Article[];
  settings: SiteSettings;
}

function phaseNumber(fase: Fase, index: number) {
  const match = fase.tag.match(/\d{1,2}/);
  return (match ? match[0] : String(index + 1)).padStart(2, "0");
}

export default function LiveEditor({
  initialContent,
  initialProjectsPageContent,
  initialNosotrosPageContent,
  heroSlides: initialHeroSlides,
  showcaseSlides: initialShowcaseSlides,
  projects,
  sectors,
  fases,
  fabricantes,
  articles,
  settings,
}: LiveEditorProps) {
  // Selector de página a editar: 'home' o 'projects'
  const [activePage, setActivePage] = useState<"home" | "projects" | "nosotros">("home");

  // Estado de contenido editable de la página nosotros
  const [nosotrosContent, setNosotrosContent] = useState<NosotrosPageContent>(
    initialNosotrosPageContent || DEFAULT_NOSOTROS_PAGE_CONTENT
  );

  // Estado de contenido editable de la página de proyectos
  const [projectsContent, setProjectsContent] = useState<ProjectsPageContent>(
    initialProjectsPageContent || DEFAULT_PROJECTS_PAGE_CONTENT
  );

  // Estado de contenido editable sincronizado (Home)
  const [content, setContent] = useState<HomeContent>({
    ...initialContent,
    heroSlides: initialContent.heroSlides?.length ? initialContent.heroSlides : initialHeroSlides,
    workshopSlides: initialContent.workshopSlides?.length ? initialContent.workshopSlides : initialShowcaseSlides,
  });

  const [activeHeroSlideIndex, setActiveHeroSlideIndex] = useState(0);
  const [activeShowcaseSlideIndex, setActiveShowcaseSlideIndex] = useState(0);
  const [activeFaseIndex, setActiveFaseIndex] = useState(0);
  const [activeNosotrosFaseIndex, setActiveNosotrosFaseIndex] = useState(0);

  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Selector oculto para añadir slide al Hero
  const newHeroSlideInputRef = useRef<HTMLInputElement>(null);

  const updateField = useCallback((field: keyof HomeContent, value: any) => {
    setContent((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    setSaveSuccess(false);
  }, []);

  const updateProjectsField = useCallback((field: keyof ProjectsPageContent, value: any) => {
    setProjectsContent((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    setSaveSuccess(false);
  }, []);

  const updateNosotrosField = useCallback((field: keyof NosotrosPageContent, value: any) => {
    setNosotrosContent((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    setSaveSuccess(false);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage("");
    try {
      if (activePage === "home") {
        const res = await fetch("/api/admin/content/home", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(content),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Error al guardar en el servidor");
        }
      } else if (activePage === "projects") {
        const res = await fetch("/api/admin/content/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectsContent),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Error al guardar en el servidor");
        }
      } else if (activePage === "nosotros") {
        const res = await fetch("/api/admin/content/nosotros", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nosotrosContent),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Error al guardar en el servidor");
        }
      }

      setSaveSuccess(true);
      setHasUnsavedChanges(false);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || "Error al guardar cambios");
    } finally {
      setIsSaving(false);
    }
  };

  // Reemplazar slide de Hero
  const handleHeroSlideImageChange = (newUrl: string, index: number) => {
    const slides = [...(content.heroSlides || [])];
    if (slides[index]) {
      slides[index] = { ...slides[index], image: newUrl };
      updateField("heroSlides", slides);
    }
  };

  // Añadir slide al Hero
  const handleAddNewHeroSlide = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const slides = [...(content.heroSlides || [])];
      slides.push({
        id: `hero-slide-${Date.now()}`,
        image: data.url,
        alt: "Slide de portada ALKO",
      });
      updateField("heroSlides", slides);
      setActiveHeroSlideIndex(slides.length - 1);
    } catch (err: any) {
      alert("Error subiendo imagen de slide: " + err.message);
    } finally {
      if (newHeroSlideInputRef.current) newHeroSlideInputRef.current.value = "";
    }
  };

  // Eliminar slide del Hero
  const handleDeleteHeroSlide = (index: number) => {
    const slides = [...(content.heroSlides || [])];
    if (slides.length <= 1) {
      alert("Debe quedar al menos una imagen en la portada.");
      return;
    }
    slides.splice(index, 1);
    updateField("heroSlides", slides);
    setActiveHeroSlideIndex(0);
  };

  // Reemplazar slide del Showcase
  const handleWorkshopSlideImageChange = (newUrl: string, index: number) => {
    const slides = [...(content.workshopSlides || [])];
    if (slides[index]) {
      slides[index] = { ...slides[index], image: newUrl };
      updateField("workshopSlides", slides);
    }
  };

  const doubledFabricantes = [...fabricantes, ...fabricantes];
  const articlesList = articles.slice(0, 3);

  // Datos para la vista de proyectos
  const projectSummaries = projects.map((project) => ({
    ...project,
    extracto: splitLead(project.content).lead,
  }));
  const years = projects.map((p) => Number(p.anio)).filter(Boolean);
  const types = new Set(projects.map((p) => p.tipologia).filter(Boolean));
  const projectStats = [
    { label: "Obras", value: String(projects.length).padStart(2, "0") },
    { label: "Tipologías", value: String(types.size).padStart(2, "0") },
    {
      label: "Periodo",
      value: years.length
        ? Math.min(...years) === Math.max(...years)
          ? String(years[0])
          : `${Math.min(...years)} — ${Math.max(...years)}`
        : "—",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-poppins flex flex-col live-editor">
      {/* ========================================================
          BARRA DE HERRAMIENTAS SUPERIOR FLOTANTE / HEADER (LIGHT)
          ======================================================== */}
      <header className="sticky top-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm px-4 sm:px-8 flex items-center justify-between">
        {/* Izquierda: Volver al Dashboard e Indicadores */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="h-4 w-[1px] bg-slate-200" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-900 tracking-tight hidden sm:inline">Editor Visual En Vivo</span>
            
            {/* Selector de Página a Editar */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-300 ml-1">
              <button
                type="button"
                onClick={() => setActivePage("home")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activePage === "home"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Inicio (Home)</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePage("projects")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activePage === "projects"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Página Proyectos</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePage("nosotros")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activePage === "nosotros"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Página Nosotros</span>
              </button>
            </div>
          </div>
        </div>

        {/* Centro: Selector de Dispositivo Responsive */}
        <div className="hidden lg:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
              device === "desktop"
                ? "bg-white text-blue-600 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Escritorio</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
              device === "tablet"
                ? "bg-white text-blue-600 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
              device === "mobile"
                ? "bg-white text-blue-600 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Móvil</span>
          </button>
        </div>

        {/* Derecha: Estado, Enlace a Web y Publicar */}
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-amber-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Cambios pendientes
            </span>
          )}

          <Link
            href={activePage === "home" ? "/" : activePage === "projects" ? "/proyectos" : "/nosotros"}
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Ver web pública</span>
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white transition shadow-sm ${
              saveSuccess
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 active:scale-95"
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publicando...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Publicado con éxito!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Publicar cambios</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Alerta de Error si ocurre */}
      {errorMessage && (
        <div className="bg-red-50 border-b border-red-200 text-red-700 px-6 py-2.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage("")} className="text-red-500 hover:text-red-800 font-bold">
            &times;
          </button>
        </div>
      )}

      {/* ========================================================
          LIENZO DE EDICIÓN EN VIVO A PANTALLA COMPLETA
          ======================================================== */}
      <div className="flex-1 overflow-y-auto flex justify-center p-0 lg:p-6 bg-slate-200/80">
        <div
          className={`w-full transition-all duration-300 bg-black text-white shadow-2xl relative ${
            device === "desktop"
              ? "max-w-full lg:rounded-2xl overflow-hidden border border-slate-300/80"
              : device === "tablet"
              ? "max-w-[768px] my-4 rounded-2xl overflow-hidden border-8 border-slate-800"
              : "max-w-[420px] my-4 rounded-3xl overflow-hidden border-8 border-slate-800"
          }`}
        >
          {/* ========================================================
              NAV HEADER (RÉPLICA VISUAL COMPLETA CON LOGO)
              ======================================================== */}
          <nav className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 sm:px-10 py-6 bg-transparent pointer-events-none">
            <div className="pointer-events-auto">
              <Image
                src="/logo.webp"
                alt="ALKO Arquitectura y Reformas"
                width={170}
                height={48}
                priority
                className="h-9 sm:h-11 w-auto object-contain filter brightness-100 drop-shadow"
              />
            </div>

            <div className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest text-white/90 font-medium drop-shadow pointer-events-auto">
              <a href="#proyectos" className="hover:text-amber-500 transition">Proyectos</a>
              <a href="#servicios" className="hover:text-amber-500 transition">Especialidades</a>
              <a href="#metodo" className="hover:text-amber-500 transition">Método</a>
              <a href="#workshop" className="hover:text-amber-500 transition">Taller</a>
              <a href="#contacto" className="hover:text-amber-500 transition">Contacto</a>
            </div>
          </nav>

          {activePage === "home" ? (
            <>
          {/* ========================================================
              1. HERO SECTION (EDITABLE EN VIVO)
              ======================================================== */}
          <header className="hero relative min-h-screen w-full flex flex-col justify-between overflow-hidden">
            {/* Controles para cambiar de slide de Hero en vivo */}
            <div className="absolute top-20 right-6 z-40 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2 text-white font-poppins">
              <span className="text-[10px] tracking-wider uppercase text-white/70">Slide Hero:</span>
              {(content.heroSlides || []).map((slide, i) => (
                <button
                  key={slide.id || i}
                  type="button"
                  onClick={() => setActiveHeroSlideIndex(i)}
                  className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center transition ${
                    activeHeroSlideIndex === i
                      ? "bg-blue-600 text-white shadow"
                      : "bg-white/20 text-white/80 hover:bg-white/40"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                type="button"
                onClick={() => newHeroSlideInputRef.current?.click()}
                className="w-6 h-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition shadow"
                title="Añadir nueva imagen al Hero"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <input
                ref={newHeroSlideInputRef}
                type="file"
                accept="image/*"
                onChange={handleAddNewHeroSlide}
                className="hidden"
              />
            </div>

            {/* Slider de Fondo con Reemplazo de Imagen en Línea */}
            <div id="hero-slider" className="absolute inset-0 z-0 overflow-hidden">
              {(content.heroSlides || []).map((slide, i) => (
                <div
                  key={slide.id || i}
                  className={`hero-slide absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    i === activeHeroSlideIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <InlineImage
                    src={slide.image}
                    alt={slide.alt || "Portada ALKO"}
                    label={`Cambiar imagen de Slide #${i + 1}`}
                    onImageChange={(newUrl) => handleHeroSlideImageChange(newUrl, i)}
                    canDelete={(content.heroSlides || []).length > 1}
                    onDelete={() => handleDeleteHeroSlide(i)}
                    className="w-full h-full"
                    imageClassName="object-cover object-center"
                    priority={i === 0}
                  />
                </div>
              ))}

              {/* Overlays oscuros cinematográficos */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-stone-950/25 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-950/35 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Textos del Hero Editables en Línea */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 my-auto py-10 lg:py-16 mt-28 lg:mt-32">
              <div className="max-w-3xl">
                <div className="space-y-1 sm:space-y-2 drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight text-white leading-none font-display">
                    <InlineText
                      value={content.heroTitulo}
                      onChange={(val) => updateField("heroTitulo", val)}
                      placeholder="Título principal..."
                    />
                  </h1>
                  <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight font-display font-sans">
                    <InlineText
                      value={content.heroSubtitulo}
                      onChange={(val) => updateField("heroSubtitulo", val)}
                      placeholder="Subtítulo..."
                    />
                  </p>
                </div>

                <div className="mt-8 sm:mt-10 max-w-xl text-base sm:text-lg font-normal text-white leading-relaxed tracking-normal font-sans drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  <InlineText
                    value={content.heroDescripcion}
                    onChange={(val) => updateField("heroDescripcion", val)}
                    placeholder="Descripción del hero..."
                    multiline
                  />
                </div>
              </div>
            </div>

            {/* Barra inferior del Hero */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 pb-8 sm:pb-10 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-16 sm:mt-20 lg:mt-24">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                <div className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-white/60 bg-stone-900/40 backdrop-blur-md text-white text-xs font-semibold tracking-[0.18em] uppercase shadow-sm">
                  <InlineText
                    value={content.heroCtaTexto}
                    onChange={(val) => updateField("heroCtaTexto", val)}
                    placeholder="Texto botón CTA..."
                  />
                </div>

                <span className="text-xs font-mono text-white/80 uppercase tracking-widest">
                  <InlineText
                    value={content.heroSecundarioTexto}
                    onChange={(val) => updateField("heroSecundarioTexto", val)}
                    placeholder="Texto secundario..."
                  />
                </span>
              </div>

              {/* Botones de navegación del slide */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setActiveHeroSlideIndex((prev) =>
                      prev === 0 ? (content.heroSlides?.length || 1) - 1 : prev - 1
                    )
                  }
                  className="w-11 h-11 rounded-2xl rounded-tr-sm border border-white/40 bg-stone-900/40 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition shadow-lg active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17L7 7M7 7v9M7 7h9" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveHeroSlideIndex((prev) =>
                      prev === (content.heroSlides?.length || 1) - 1 ? 0 : prev + 1
                    )
                  }
                  className="w-11 h-11 rounded-2xl rounded-bl-sm border border-white/40 bg-stone-900/40 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition shadow-lg active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7l10 10m0 0V8m0 9H8" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* ========================================================
              2. SECCIÓN PROYECTOS (EDITABLE EN VIVO)
              ======================================================== */}
          <section id="proyectos" className="relative bg-white text-stone-900 py-24 sm:py-32 px-6 sm:px-10 lg:px-12 overflow-hidden border-t border-stone-200/80">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-14 border-b border-stone-300/60">
                <div className="max-w-3xl">
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light text-stone-900 tracking-tight leading-none">
                      <InlineText
                        value={content.proyectosTitulo}
                        onChange={(val) => updateField("proyectosTitulo", val)}
                        placeholder="Título de proyectos..."
                      />
                    </h2>
                  </div>
                  <div className="mt-6 text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-xl font-sans">
                    <InlineText
                      value={content.proyectosSubtitulo}
                      onChange={(val) => updateField("proyectosSubtitulo", val)}
                      placeholder="Subtítulo de proyectos..."
                      multiline
                    />
                  </div>
                  <div className="mt-8">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase text-stone-900 border-b border-stone-900 pb-1.5">
                      <span className="text-base">↗</span>
                      <InlineText
                        value={content.proyectosCtaTexto}
                        onChange={(val) => updateField("proyectosCtaTexto", val)}
                        placeholder="Botón descubrir..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Render de proyectos con su lista interactiva */}
              <ProjectsList projects={projects} />
            </div>
          </section>

          {/* ========================================================
              3. SECCIÓN PROCESO / MÉTODO (EDITABLE EN VIVO)
              ======================================================== */}
          <section id="metodo" className="relative bg-white text-stone-900 py-24 sm:py-32 px-6 sm:px-10 lg:px-12 overflow-hidden border-t border-stone-200">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-baseline justify-between pb-12 sm:pb-16 border-b border-stone-300/60">
                <div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light text-stone-900 tracking-tight leading-none">
                    <InlineText
                      value={content.procesoTitulo}
                      onChange={(val) => updateField("procesoTitulo", val)}
                      placeholder="Título de proceso..."
                    />
                  </h2>
                  <div className="mt-2 font-mono text-[11px] tracking-[0.25em] text-stone-500 uppercase">
                    <InlineText
                      value={content.procesoSubtitulo}
                      onChange={(val) => updateField("procesoSubtitulo", val)}
                      placeholder="Subtítulo del proceso..."
                    />
                  </div>
                </div>
              </div>

              <div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
                {/* Tabs de fases */}
                <div className="lg:col-span-4 flex flex-col space-y-4 sm:space-y-6">
                  {fases.map((fase, i) => (
                    <button
                      key={fase.id}
                      type="button"
                      onClick={() => setActiveFaseIndex(i)}
                      className={`text-left group flex items-baseline gap-3 transition-all duration-300 focus:outline-none ${
                        activeFaseIndex === i ? "is-active" : ""
                      }`}
                    >
                      <span
                        className={`phase-badge font-mono text-xs transition ${
                          activeFaseIndex === i ? "text-stone-900 font-bold" : "text-stone-400 group-hover:text-stone-700"
                        }`}
                      >
                        ({phaseNumber(fase, i)})
                      </span>
                      <span
                        className={`phase-title text-3xl sm:text-4xl lg:text-5xl font-serif border-b-2 pb-1 transition-all ${
                          activeFaseIndex === i
                            ? "text-stone-900 border-stone-900"
                            : "text-stone-400 border-transparent group-hover:text-stone-700"
                        }`}
                      >
                        {fase.title}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Vista previa de fase activa */}
                <div className="lg:col-span-8 flex flex-col md:flex-row gap-8 items-start">
                  {fases[activeFaseIndex] && (
                    <>
                      <div className="md:w-1/2 relative aspect-[4/3] w-full rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={fases[activeFaseIndex].imagen}
                          alt={fases[activeFaseIndex].title}
                          fill
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="md:w-1/2">
                        <h4 className="text-2xl font-serif font-light text-stone-900 mb-4">
                          {fases[activeFaseIndex].title}
                        </h4>
                        <p className="text-stone-600 font-sans text-sm leading-relaxed">
                          {fases[activeFaseIndex].texto}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================
              4. SECCIÓN SERVICIOS (EDITABLE EN VIVO)
              ======================================================== */}
          <section id="servicios" className="relative bg-white text-stone-900 py-20 sm:py-28 lg:py-32 overflow-hidden border-t border-[#e1e1df]">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
              <div className="pb-12 sm:pb-16 border-b border-[#e1e1df]">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                  <div>
                    <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase mb-3">
                      <InlineText
                        value={content.serviciosTag}
                        onChange={(val) => updateField("serviciosTag", val)}
                        placeholder="Tag de servicios..."
                      />
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light text-stone-900 tracking-tight leading-none">
                      <InlineText
                        value={content.serviciosTitulo}
                        onChange={(val) => updateField("serviciosTitulo", val)}
                        placeholder="Título de servicios..."
                      />
                    </h2>
                  </div>
                  <div className="max-w-xl text-base sm:text-lg text-stone-600 font-light leading-relaxed font-sans">
                    <InlineText
                      value={content.serviciosDescripcion}
                      onChange={(val) => updateField("serviciosDescripcion", val)}
                      placeholder="Descripción de servicios..."
                      multiline
                    />
                  </div>
                </div>
              </div>

              <SectorsList sectors={sectors} />
            </div>
          </section>

          {/* ========================================================
              5. SECCIÓN WORKSHOP / SHOWCASE (EDITABLE EN VIVO)
              ======================================================== */}
          <section id="workshop" className="relative w-full h-[600px] sm:h-[700px] lg:h-[780px] overflow-hidden bg-stone-950 group">
            {/* Controles para cambiar slides del showcase */}
            <div className="absolute top-6 right-6 z-40 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2 text-white font-poppins">
              <span className="text-[10px] tracking-wider uppercase text-white/70">Showcase Slide:</span>
              {(content.workshopSlides || []).map((slide, i) => (
                <button
                  key={slide.id || i}
                  type="button"
                  onClick={() => setActiveShowcaseSlideIndex(i)}
                  className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center transition ${
                    activeShowcaseSlideIndex === i
                      ? "bg-blue-600 text-white shadow"
                      : "bg-white/20 text-white/80 hover:bg-white/40"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Slider de imágenes de showcase con edición directa */}
            <div id="showcase-slider" className="absolute inset-0">
              {(content.workshopSlides || []).map((slide, i) => (
                <div
                  key={slide.id || i}
                  className={`showcase-slide absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    i === activeShowcaseSlideIndex ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                  }`}
                >
                  <InlineImage
                    src={slide.image}
                    alt={slide.alt || "Showcase ALKO"}
                    label={`Cambiar imagen de Taller #${i + 1}`}
                    onImageChange={(newUrl) => handleWorkshopSlideImageChange(newUrl, i)}
                    className="w-full h-full"
                    imageClassName="object-cover object-center brightness-[0.98] contrast-[1.02]"
                  />
                </div>
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none z-15" />

            {/* Tarjeta flotante con textos editables */}
            <div id="showcase-card" className="absolute bottom-0 left-6 sm:left-12 lg:left-24 xl:left-32 z-30 max-w-sm sm:max-w-md lg:max-w-xl w-full">
              <div className="relative bg-white/95 backdrop-blur-sm px-6 sm:px-8 py-7 sm:py-9 shadow-2xl border border-white/60">
                <span className="block font-mono text-[10px] sm:text-[11px] tracking-[0.28em] text-stone-600 uppercase mb-3">
                  <InlineText
                    value={content.workshopBadge}
                    onChange={(val) => updateField("workshopBadge", val)}
                    placeholder="Badge..."
                  />
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light text-stone-900 tracking-tight leading-snug">
                  <InlineText
                    value={content.workshopTitulo}
                    onChange={(val) => updateField("workshopTitulo", val)}
                    placeholder="Título del taller..."
                  />
                </h3>
                <div className="mt-4 text-sm sm:text-base text-stone-700 font-light leading-relaxed max-w-lg">
                  <InlineText
                    value={content.workshopDescripcion}
                    onChange={(val) => updateField("workshopDescripcion", val)}
                    placeholder="Descripción del taller..."
                    multiline
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================
              6. SECCIÓN EXPERIENCIA (90 DÍAS) - RÉPLICA EXACTA CON EDITABILIDAD
              ======================================================== */}
          <section id="experiencia" className="relative bg-white text-stone-900 border-t border-stone-200/80 py-24 px-6 sm:px-12 lg:px-16 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
              {/* Contenedor de Imagen de 90 días con recuadro arquitectónico */}
              <div className="w-full lg:w-1/2 relative">
                <div className="relative w-full aspect-[4/5] max-w-[420px] mx-auto rounded-none overflow-hidden shadow-2xl border border-stone-200">
                  <InlineImage
                    src={content.experienciaImagen || "/90dias.jpg"}
                    alt="Experiencia ALKO 90 días"
                    label="Cambiar foto de experiencia"
                    onImageChange={(newUrl) => updateField("experienciaImagen", newUrl)}
                    className="w-full h-full"
                    imageClassName="object-cover object-center brightness-[0.98] contrast-[1.02]"
                  />
                </div>
              </div>

              {/* Contenido Editorial con Contexto, Reto, Alcance y Métricas */}
              <div className="w-full lg:w-1/2 flex flex-col space-y-8">
                {/* 01 Contexto y 02 Condicionantes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <span className="font-mono text-[11px] tracking-[0.2em] text-stone-500 uppercase block mb-1">
                      01 / CONTEXTO
                    </span>
                    <h4 className="font-serif font-light text-xl text-stone-900 mb-2 tracking-tight">
                      El Proyecto
                    </h4>
                    <p className="font-sans text-sm text-stone-600 font-light leading-relaxed">
                      Transformación arquitectónica e infraestructural completa de sede corporativa de dos plantas en Madrid para Start Research.
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-[11px] tracking-[0.2em] text-stone-500 uppercase block mb-1">
                      02 / CONDICIONANTES REALES
                    </span>
                    <h4 className="font-serif font-light text-xl text-stone-900 mb-2 tracking-tight">
                      El Reto
                    </h4>
                    <p className="font-sans text-sm text-stone-600 font-light leading-relaxed mb-3">
                      Plazo de entrega inamovible de 90 días naturales, convivencia con normativas acústicas estrictas.
                    </p>

                    {/* Badges editables */}
                    <div className="flex flex-wrap gap-1.5">
                      {(content.experienciaBadges || []).map((badge, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-[10px] uppercase font-sans border border-stone-300 rounded-full text-stone-700 bg-stone-100/60"
                        >
                          <InlineText
                            value={badge}
                            onChange={(newVal) => {
                              const updated = [...(content.experienciaBadges || [])];
                              updated[i] = newVal;
                              updateField("experienciaBadges", updated);
                            }}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-b border-stone-200" />

                {/* Métricas destacadas: 90 Días y 2 Plantas */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <span className="font-serif text-xs text-stone-600">03 / QUÉ EJECUTÓ ALKO · EL ALCANCE</span>
                      <div className="flex items-baseline">
                        <span className="font-sans text-5xl font-light text-stone-900 tracking-tight">90</span>
                        <span className="text-2xl font-light text-stone-900 ml-1.5">Días</span>
                      </div>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full border border-stone-300 text-stone-700 text-[10px] uppercase">
                      El Reto
                    </span>
                  </div>
                  <p className="font-sans text-sm text-stone-600 font-light leading-relaxed">
                    Demolición selectiva, tabiquería técnica, climatización VRF simultánea, renovación forzada de aire, distribución de fibra óptica y acabados de especificación H2.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================
              7. SECCIÓN MATERIALES (EDITABLE EN VIVO)
              ======================================================== */}
          <section id="materiales" className="relative bg-white text-stone-900 py-24 sm:py-32 border-t border-stone-300/80 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 mb-16 sm:mb-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-300/70">
                <div className="max-w-2xl">
                  <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase mb-3">
                    <InlineText
                      value={content.materialesTag}
                      onChange={(val) => updateField("materialesTag", val)}
                      placeholder="Tag de materiales..."
                    />
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light text-stone-900 tracking-tight leading-none">
                    <InlineText
                      value={content.materialesTitulo}
                      onChange={(val) => updateField("materialesTitulo", val)}
                      placeholder="Título de materiales..."
                    />
                  </h2>
                </div>
                <div className="max-w-md">
                  <div className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                    <InlineText
                      value={content.materialesDescripcion}
                      onChange={(val) => updateField("materialesDescripcion", val)}
                      placeholder="Descripción de materiales..."
                      multiline
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Carrusel de fabricantes */}
            <div className="relative w-full overflow-hidden py-6 sm:py-8">
              <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
              <div className="flex items-center overflow-x-auto gap-16 px-8 no-scrollbar">
                {doubledFabricantes.map((fab, i) => (
                  <div key={`${fab.id}-${i}`} className="flex items-center h-12 sm:h-16 shrink-0 opacity-70 hover:opacity-100 transition">
                    <Image
                      src={fab.logo}
                      alt={fab.name}
                      width={120}
                      height={48}
                      className="h-9 sm:h-11 w-auto object-contain filter grayscale"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========================================================
              8. SECCIÓN ARTÍCULOS (EDITABLE EN VIVO)
              ======================================================== */}
          <section id="articulos" className="relative bg-white text-stone-900 py-24 sm:py-32 border-t border-stone-300/70 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
              <div className="flex items-end justify-between pb-8 border-b border-stone-300/60 mb-12 sm:mb-16">
                <div>
                  <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase mb-2">
                    <InlineText
                      value={content.articulosTag}
                      onChange={(val) => updateField("articulosTag", val)}
                      placeholder="Tag de artículos..."
                    />
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light text-stone-900 tracking-tight leading-none">
                    <InlineText
                      value={content.articulosTitulo}
                      onChange={(val) => updateField("articulosTitulo", val)}
                      placeholder="Título de artículos..."
                    />
                  </h2>
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-800">
                    <span className="underline underline-offset-4 decoration-stone-900/30">
                      <InlineText
                        value={content.articulosCtaTexto}
                        onChange={(val) => updateField("articulosCtaTexto", val)}
                        placeholder="Texto enlace..."
                      />
                    </span>
                    <span>→</span>
                  </div>
                </div>
              </div>

              {/* Tarjetas de artículos reales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                {articlesList.map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} />
                ))}
              </div>
            </div>
          </section>

          {/* ========================================================
              9. SECCIÓN CONTACTO FINAL (EDITABLE EN VIVO)
              ======================================================== */}
          <section id="contacto" className="relative w-full overflow-hidden bg-stone-950 group">
            <div className="relative w-full h-[520px] sm:h-[580px] md:h-[640px] lg:h-[700px] overflow-hidden">
              {/* Imagen de fondo interactiva */}
              <InlineImage
                src={content.contactoBgImagen || "/cta-bg.jpg"}
                alt="Fondo de contacto ALKO"
                label="Cambiar fondo de contacto"
                onImageChange={(newUrl) => updateField("contactoBgImagen", newUrl)}
                className="w-full h-full"
                imageClassName="object-cover object-top"
              />

              <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent" />
              <div className="absolute inset-0 z-10 flex flex-col justify-between max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="pt-8 sm:pt-14 md:pt-18 lg:pt-20">
                  <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] font-light font-display text-white tracking-[-0.03em] leading-[1.08]">
                    <InlineText
                      value={content.contactoTitulo}
                      onChange={(val) => updateField("contactoTitulo", val)}
                      placeholder="Título de contacto..."
                      multiline
                    />
                  </h2>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-6">
                  <div className="space-y-5 max-w-xl">
                    <div className="text-base sm:text-lg font-sans text-stone-200/90 font-light leading-relaxed max-w-lg drop-shadow-sm">
                      <InlineText
                        value={content.contactoDescripcion}
                        onChange={(val) => updateField("contactoDescripcion", val)}
                        placeholder="Descripción de contacto..."
                        multiline
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-7 gap-y-2.5 pt-1 text-xs font-light text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                      <div className="inline-flex items-center gap-2">
                        <span className="text-white/70 font-mono text-[10px] uppercase tracking-wider">TEL</span>
                        <span className="tracking-wide">{settings.telefono}</span>
                      </div>
                      <span className="text-white/40 hidden sm:inline">•</span>
                      <div className="inline-flex items-center gap-2">
                        <span className="text-white/70 font-mono text-[10px] uppercase tracking-wider">ESCRÍBENOS</span>
                        <span className="underline underline-offset-4 decoration-white/50">{settings.email}</span>
                      </div>
                      <span className="text-white/40 hidden sm:inline">•</span>
                      <div className="inline-flex items-center gap-2">
                        <span className="text-white/70 font-mono text-[10px] uppercase tracking-wider">VISÍTANOS</span>
                        <span>{settings.direccion}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 self-start lg:self-auto">
                    <div className="inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-full bg-amber-700 text-white text-[11px] sm:text-xs font-semibold tracking-wider uppercase shadow-xl border border-white/10">
                      <span>SOLICITAR CONSULTORÍA</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

            </>
          ) : activePage === "projects" ? (
            /* ========================================================
               VISTA EDITABLE: PÁGINA DE PROYECTOS (/proyectos)
               ======================================================== */
            <div className="bg-white text-stone-900 w-full">
              {/* Header Hero de Proyectos con edición en vivo */}
              <header className="relative isolate flex min-h-[640px] sm:min-h-[720px] lg:min-h-[86vh] items-end overflow-hidden bg-stone-950 text-white pt-36 sm:pt-44 pb-12 sm:pb-16 group">
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <InlineImage
                    src={projectsContent.headerBgImage || projects[0]?.imagen || "/start-research-1.jpg"}
                    alt="Fondo de cabecera de proyectos"
                    label="Cambiar imagen de fondo de proyectos"
                    onImageChange={(newUrl) => updateProjectsField("headerBgImage", newUrl)}
                    className="w-full h-full"
                    imageClassName="object-cover object-center"
                    priority
                  />

                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-stone-950/85 via-stone-950/45 to-stone-950/5" />
                  <div className="absolute inset-x-0 bottom-0 pointer-events-none h-2/3 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
                  <div className="absolute inset-x-0 top-0 pointer-events-none h-40 bg-gradient-to-b from-stone-950/70 to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full">
                  <div className="mb-8">
                    <span className="text-white/60 text-xs font-mono tracking-wider">Inicio / Proyectos</span>
                  </div>

                  <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-white/70 uppercase mb-4">
                    <InlineText
                      value={projectsContent.headerBadge}
                      onChange={(val) => updateProjectsField("headerBadge", val)}
                      placeholder="Badge superior..."
                    />
                  </span>

                  <h1 className="font-display font-light text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[-0.03em] leading-[1.02] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
                    <InlineText
                      value={projectsContent.headerTitulo}
                      onChange={(val) => updateProjectsField("headerTitulo", val)}
                      placeholder="Título de la página..."
                      multiline
                    />
                  </h1>

                  <div className="mt-6 max-w-xl text-base sm:text-lg text-white/85 font-light leading-relaxed">
                    <InlineText
                      value={projectsContent.headerDescripcion}
                      onChange={(val) => updateProjectsField("headerDescripcion", val)}
                      placeholder="Descripción de la página..."
                      multiline
                    />
                  </div>

                  {/* Estadísticas de Obras */}
                  <dl className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 border-t border-white/20">
                    {projectStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="flex items-baseline justify-between gap-4 sm:block border-b sm:border-b-0 sm:border-r last:border-r-0 border-white/20 py-4 sm:py-6 sm:pr-6 sm:[&:not(:first-child)]:pl-6"
                      >
                        <dt className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/60">
                          {stat.label}
                        </dt>
                        <dd className="sm:mt-2 font-serif font-light text-xl sm:text-3xl text-white">{stat.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </header>

              {/* Galería completa de proyectos */}
              <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-20 sm:pt-28 pb-8 sm:pb-12">
                <ProjectsGallery projects={projectSummaries} />
              </div>
            </div>
          ) : (
            /* ========================================================
               VISTA EDITABLE: PÁGINA NOSOTROS (/nosotros)
               ======================================================== */
            <div className="bg-white text-stone-900 w-full">
              {/* 1. Header Hero de Nosotros */}
              <header className="relative isolate flex min-h-[560px] sm:min-h-[620px] lg:min-h-[72vh] items-end overflow-hidden bg-stone-950 text-white pt-36 sm:pt-44 pb-14 sm:pb-20 group">
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <InlineImage
                    src={nosotrosContent.headerBgImage || "/oficinas.jpg"}
                    alt="Fondo de cabecera Nosotros"
                    label="Cambiar imagen de cabecera"
                    onImageChange={(newUrl) => updateNosotrosField("headerBgImage", newUrl)}
                    className="w-full h-full"
                    imageClassName="object-cover object-center"
                    priority
                  />

                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-stone-950/90 via-stone-950/55 to-stone-950/10" />
                  <div className="absolute inset-x-0 bottom-0 pointer-events-none h-2/3 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
                  <div className="absolute inset-x-0 top-0 pointer-events-none h-40 bg-gradient-to-b from-stone-950/70 to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full">
                  <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-white/70 uppercase mb-4">
                    <InlineText
                      value={nosotrosContent.headerBadge}
                      onChange={(val) => updateNosotrosField("headerBadge", val)}
                      placeholder="Badge superior..."
                    />
                  </span>

                  <h1 className="font-display font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[-0.03em] leading-[1.05] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
                    <InlineText
                      value={nosotrosContent.headerTitulo}
                      onChange={(val) => updateNosotrosField("headerTitulo", val)}
                      placeholder="Título de la página..."
                      multiline
                    />
                  </h1>

                  <div className="mt-6 max-w-xl text-base sm:text-lg text-white/85 font-light leading-relaxed">
                    <InlineText
                      value={nosotrosContent.headerDescripcion}
                      onChange={(val) => updateNosotrosField("headerDescripcion", val)}
                      placeholder="Descripción de la página..."
                      multiline
                    />
                  </div>
                </div>
              </header>

              {/* 2. Introducción */}
              <section className="relative isolate overflow-clip py-20 sm:py-28 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                  <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-5">
                      <div className="flex items-center gap-4">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                        </span>
                        <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                          <InlineText
                            value={nosotrosContent.introTag}
                            onChange={(val) => updateNosotrosField("introTag", val)}
                            placeholder="Tag intro..."
                          />
                        </span>
                      </div>
                      <h2 className="mt-8 font-serif font-light text-4xl sm:text-5xl lg:text-6xl text-stone-900 leading-[1.05] tracking-tight">
                        <InlineText
                          value={nosotrosContent.introTitulo}
                          onChange={(val) => updateNosotrosField("introTitulo", val)}
                          placeholder="Título intro..."
                          multiline
                        />
                      </h2>
                    </div>

                    <div className="lg:col-span-7 lg:pt-14">
                      <div className="font-serif font-light text-2xl sm:text-3xl text-stone-900 leading-snug tracking-tight">
                        <InlineText
                          value={nosotrosContent.introLead}
                          onChange={(val) => updateNosotrosField("introLead", val)}
                          placeholder="Texto destacado intro..."
                          multiline
                        />
                      </div>
                      <div className="mt-10 grid grid-cols-1 gap-6 border-t border-stone-900/15 pt-10 sm:grid-cols-2">
                        <div className="text-base sm:text-lg font-light text-stone-600 leading-relaxed">
                          <InlineText
                            value={nosotrosContent.introCol1}
                            onChange={(val) => updateNosotrosField("introCol1", val)}
                            placeholder="Columna 1..."
                            multiline
                          />
                        </div>
                        <div className="text-base sm:text-lg font-light text-stone-600 leading-relaxed">
                          <InlineText
                            value={nosotrosContent.introCol2}
                            onChange={(val) => updateNosotrosField("introCol2", val)}
                            placeholder="Columna 2..."
                            multiline
                          />
                        </div>
                      </div>
                      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                        <span className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-700 px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                          Ver proyectos
                        </span>
                        <span className="inline-flex items-center gap-2 border-b border-stone-900 pb-1.5 text-xs font-semibold uppercase tracking-[0.22em]">
                          Conoce el método →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Cifras */}
              <section aria-label="ALKO en cifras" className="bg-stone-950 text-white py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
                    {(nosotrosContent.cifras || []).map((cifra, idx) => (
                      <div key={idx} className="flex flex-col-reverse justify-end border-t border-white/20 pt-6">
                        <dt className="mt-4 max-w-[14rem] text-sm sm:text-base font-light text-white/70 leading-snug">
                          <InlineText
                            value={cifra.etiqueta}
                            onChange={(val) => {
                              const updated = [...(nosotrosContent.cifras || [])];
                              updated[idx] = { ...updated[idx], etiqueta: val };
                              updateNosotrosField("cifras", updated);
                            }}
                            placeholder="Etiqueta..."
                          />
                        </dt>
                        <dd className="font-serif font-light text-5xl sm:text-6xl lg:text-7xl tracking-tight text-amber-500 leading-none">
                          <InlineText
                            value={cifra.valor}
                            onChange={(val) => {
                              const updated = [...(nosotrosContent.cifras || [])];
                              updated[idx] = { ...updated[idx], valor: val };
                              updateNosotrosField("cifras", updated);
                            }}
                            placeholder="Valor..."
                          />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </section>

              {/* 4. Cómo trabajamos (Pilares) */}
              <section className="py-20 sm:py-28">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                  <div className="flex flex-col gap-6 border-b border-stone-900/15 pb-10 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                      <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                        <InlineText
                          value={nosotrosContent.pilaresTag}
                          onChange={(val) => updateNosotrosField("pilaresTag", val)}
                          placeholder="Tag pilares..."
                        />
                      </span>
                      <h2 className="mt-6 font-serif font-light text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-tight tracking-tight">
                        <InlineText
                          value={nosotrosContent.pilaresTitulo}
                          onChange={(val) => updateNosotrosField("pilaresTitulo", val)}
                          placeholder="Título pilares..."
                          multiline
                        />
                      </h2>
                    </div>
                    <div className="max-w-md text-base font-light text-stone-600 leading-relaxed">
                      <InlineText
                        value={nosotrosContent.pilaresDescripcion}
                        onChange={(val) => updateNosotrosField("pilaresDescripcion", val)}
                        placeholder="Descripción pilares..."
                        multiline
                      />
                    </div>
                  </div>

                  <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
                    {(nosotrosContent.pilares || []).map((pilar, idx) => (
                      <article key={idx} className="group">
                        <div className="relative aspect-[4/5] overflow-hidden bg-stone-200">
                          <InlineImage
                            src={pilar.imagen}
                            alt={pilar.titulo}
                            label="Cambiar foto pilar"
                            onImageChange={(newUrl) => {
                              const updated = [...(nosotrosContent.pilares || [])];
                              updated[idx] = { ...updated[idx], imagen: newUrl };
                              updateNosotrosField("pilares", updated);
                            }}
                            className="w-full h-full"
                            imageClassName="object-cover object-center"
                          />
                        </div>
                        <span className="mt-6 block font-mono text-[11px] tracking-[0.2em] text-amber-700">
                          <InlineText
                            value={pilar.numero}
                            onChange={(val) => {
                              const updated = [...(nosotrosContent.pilares || [])];
                              updated[idx] = { ...updated[idx], numero: val };
                              updateNosotrosField("pilares", updated);
                            }}
                            placeholder="01"
                          />
                        </span>
                        <h3 className="mt-3 font-serif font-light text-2xl sm:text-3xl text-stone-900">
                          <InlineText
                            value={pilar.titulo}
                            onChange={(val) => {
                              const updated = [...(nosotrosContent.pilares || [])];
                              updated[idx] = { ...updated[idx], titulo: val };
                              updateNosotrosField("pilares", updated);
                            }}
                            placeholder="Título pilar..."
                          />
                        </h3>
                        <div className="mt-3 text-base font-light text-stone-600 leading-relaxed">
                          <InlineText
                            value={pilar.texto}
                            onChange={(val) => {
                              const updated = [...(nosotrosContent.pilares || [])];
                              updated[idx] = { ...updated[idx], texto: val };
                              updateNosotrosField("pilares", updated);
                            }}
                            placeholder="Descripción pilar..."
                            multiline
                          />
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              {/* 5. El Método ALKO */}
              <section className="relative isolate overflow-clip border-t border-stone-300 py-20 sm:py-28">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                  <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-5">
                      <div className="flex items-center gap-4">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                        </span>
                        <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                          <InlineText
                            value={nosotrosContent.metodoTag}
                            onChange={(val) => updateNosotrosField("metodoTag", val)}
                            placeholder="Tag método..."
                          />
                        </span>
                      </div>
                      <h2 className="mt-8 font-serif font-light text-4xl sm:text-5xl text-stone-900 leading-[1.05] tracking-tight">
                        <InlineText
                          value={nosotrosContent.metodoTitulo}
                          onChange={(val) => updateNosotrosField("metodoTitulo", val)}
                          placeholder="Título método..."
                          multiline
                        />
                      </h2>
                    </div>

                    <div className="lg:col-span-7 lg:pt-4">
                      <div className="font-serif font-light text-2xl sm:text-3xl text-stone-900 leading-snug tracking-tight">
                        <InlineText
                          value={nosotrosContent.metodoLead}
                          onChange={(val) => updateNosotrosField("metodoLead", val)}
                          placeholder="Texto destacado método..."
                          multiline
                        />
                      </div>
                      <div className="mt-10 grid grid-cols-1 gap-6 border-t border-stone-900/15 pt-10 sm:grid-cols-2">
                        <div className="text-base sm:text-lg font-light text-stone-600 leading-relaxed">
                          <InlineText
                            value={nosotrosContent.metodoCol1}
                            onChange={(val) => updateNosotrosField("metodoCol1", val)}
                            placeholder="Columna 1 método..."
                            multiline
                          />
                        </div>
                        <div className="text-base sm:text-lg font-light text-stone-600 leading-relaxed">
                          <InlineText
                            value={nosotrosContent.metodoCol2}
                            onChange={(val) => updateNosotrosField("metodoCol2", val)}
                            placeholder="Columna 2 método..."
                            multiline
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative mt-14 aspect-[16/9] w-full overflow-hidden bg-stone-200 sm:mt-20 sm:aspect-[16/7] group">
                    <InlineImage
                      src={nosotrosContent.metodoImagen || "/proceso-compras.jpg"}
                      alt="Planificación y compras ALKO"
                      label="Cambiar foto del método"
                      onImageChange={(newUrl) => updateNosotrosField("metodoImagen", newUrl)}
                      className="w-full h-full"
                      imageClassName="object-cover object-center"
                    />
                  </div>
                </div>
              </section>

              {/* ========================================================
                  5. FASES DEL PROCESO EN NOSOTROS (EDITABLE EN VIVO)
                  ======================================================== */}
              <section id="proceso-nosotros" className="relative bg-white text-stone-900 py-24 sm:py-32 px-6 sm:px-10 lg:px-12 overflow-hidden border-t border-stone-200">
                <div className="max-w-7xl mx-auto">
                  {/* Cabecera editable */}
                  <div className="flex items-baseline justify-between pb-12 sm:pb-16 border-b border-stone-300/60">
                    <div>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light text-stone-900 tracking-tight leading-none">
                        <InlineText
                          value={nosotrosContent.procesoTitulo || "Nuestro proceso"}
                          onChange={(val) => updateNosotrosField("procesoTitulo", val)}
                          placeholder="Título del proceso..."
                        />
                      </h2>
                      <div className="mt-2 font-mono text-[11px] tracking-[0.25em] text-stone-500 uppercase">
                        <InlineText
                          value={nosotrosContent.procesoSubtitulo || "SECUENCIA DE COORDINACIÓN INTEGRAL · 6 FASES · 1 EQUIPO"}
                          onChange={(val) => updateNosotrosField("procesoSubtitulo", val)}
                          placeholder="Subtítulo del proceso..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Layout de fases interactivo y editable */}
                  <div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
                    {/* Columna 1: Tabs de fases con edición de título */}
                    <div className="lg:col-span-4 flex flex-col space-y-4 sm:space-y-6">
                      {(nosotrosContent.fases && nosotrosContent.fases.length > 0 ? nosotrosContent.fases : fases).map((fase, i, allFases) => (
                        <div
                          key={fase.id || i}
                          onClick={() => setActiveNosotrosFaseIndex(i)}
                          className={`text-left group flex items-baseline gap-3 cursor-pointer transition-all duration-300 ${
                            activeNosotrosFaseIndex === i ? "is-active" : ""
                          }`}
                        >
                          <span
                            className={`phase-badge font-mono text-xs shrink-0 transition ${
                              activeNosotrosFaseIndex === i ? "text-stone-900 font-bold" : "text-stone-400 group-hover:text-stone-700"
                            }`}
                          >
                            ({phaseNumber(fase, i)})
                          </span>
                          <span
                            className={`phase-title text-2xl sm:text-3xl lg:text-4xl font-serif border-b-2 pb-1 transition-all flex-1 ${
                              activeNosotrosFaseIndex === i
                                ? "text-stone-900 border-stone-900"
                                : "text-stone-400 border-transparent group-hover:text-stone-700"
                            }`}
                          >
                            <InlineText
                              value={fase.title}
                              onChange={(val) => {
                                const updated = [...allFases];
                                updated[i] = { ...updated[i], title: val };
                                updateNosotrosField("fases", updated);
                              }}
                              placeholder={`Título de fase ${i + 1}...`}
                            />
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Columna 2: Imagen de la fase activa con edición en línea */}
                    {(() => {
                      const activeFases = nosotrosContent.fases && nosotrosContent.fases.length > 0 ? nosotrosContent.fases : fases;
                      const activeFase = activeFases[activeNosotrosFaseIndex] || activeFases[0];
                      if (!activeFase) return null;

                      return (
                        <>
                          <div className="lg:col-span-4">
                            <div className="relative w-full aspect-[3/4] overflow-hidden bg-stone-200 shadow-md group/fase-img">
                              <InlineImage
                                src={activeFase.imagen || "/proceso-control.jpg"}
                                alt={activeFase.title}
                                label={`Cambiar foto fase (${phaseNumber(activeFase, activeNosotrosFaseIndex)})`}
                                onImageChange={(newUrl) => {
                                  const updated = [...activeFases];
                                  updated[activeNosotrosFaseIndex] = { ...updated[activeNosotrosFaseIndex], imagen: newUrl };
                                  updateNosotrosField("fases", updated);
                                }}
                                className="w-full h-full"
                                imageClassName="object-cover object-center"
                              />
                            </div>
                          </div>

                          {/* Columna 3: Textos editables (encabezado lateral y detalle de fase) */}
                          <div className="lg:col-span-4 flex flex-col justify-between self-stretch space-y-8 lg:pl-6">
                            <div>
                              <h3 className="text-xl sm:text-2xl font-serif font-light text-stone-900 tracking-tight leading-snug">
                                <InlineText
                                  value={nosotrosContent.procesoColHeading || "Una única dirección para todo el proyecto"}
                                  onChange={(val) => updateNosotrosField("procesoColHeading", val)}
                                  placeholder="Encabezado lateral..."
                                />
                              </h3>
                              <div className="mt-4 text-base sm:text-lg text-stone-600 font-light leading-relaxed font-sans">
                                <InlineText
                                  value={nosotrosContent.procesoColText || "Un único equipo coordina construcción, instalaciones, compras y gestión técnica para mantener el proyecto bajo control."}
                                  onChange={(val) => updateNosotrosField("procesoColText", val)}
                                  placeholder="Descripción lateral..."
                                  multiline
                                />
                              </div>
                            </div>

                            <div className="pt-6 border-t border-stone-300/60">
                              <div className="text-base sm:text-lg text-stone-600 font-light leading-relaxed font-sans">
                                <InlineText
                                  value={activeFase.texto}
                                  onChange={(val) => {
                                    const updated = [...activeFases];
                                    updated[activeNosotrosFaseIndex] = { ...updated[activeNosotrosFaseIndex], texto: val };
                                    updateNosotrosField("fases", updated);
                                  }}
                                  placeholder={`Detalle explicativo de la fase ${activeNosotrosFaseIndex + 1}...`}
                                  multiline
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </section>

              {/* 6. Valores */}
              <section className="bg-stone-100 py-20 sm:py-28">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                  <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-4">
                      <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase">
                        <InlineText
                          value={nosotrosContent.valoresTag}
                          onChange={(val) => updateNosotrosField("valoresTag", val)}
                          placeholder="Tag valores..."
                        />
                      </span>
                      <h2 className="mt-6 font-serif font-light text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-tight tracking-tight">
                        <InlineText
                          value={nosotrosContent.valoresTitulo}
                          onChange={(val) => updateNosotrosField("valoresTitulo", val)}
                          placeholder="Título valores..."
                          multiline
                        />
                      </h2>
                      <div className="mt-6 max-w-sm text-base font-light text-stone-600 leading-relaxed">
                        <InlineText
                          value={nosotrosContent.valoresDescripcion}
                          onChange={(val) => updateNosotrosField("valoresDescripcion", val)}
                          placeholder="Descripción valores..."
                          multiline
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-px bg-stone-900/15 border border-stone-900/15 sm:grid-cols-2 lg:col-span-8">
                      {(nosotrosContent.valores || []).map((valor, idx) => {
                        const IconComponent = [Handshake, CalendarClock, Wallet, BadgeCheck][idx % 4];
                        return (
                          <div key={idx} className="flex flex-col bg-stone-100 p-8 sm:p-10">
                            <div className="flex items-center justify-between">
                              <IconComponent className="h-7 w-7 text-amber-700" strokeWidth={1.25} aria-hidden="true" />
                              <span className="font-mono text-[11px] tracking-[0.2em] text-stone-500">
                                <InlineText
                                  value={valor.numero}
                                  onChange={(val) => {
                                    const updated = [...(nosotrosContent.valores || [])];
                                    updated[idx] = { ...updated[idx], numero: val };
                                    updateNosotrosField("valores", updated);
                                  }}
                                  placeholder="01"
                                />
                              </span>
                            </div>
                            <h3 className="mt-8 font-serif font-light text-2xl sm:text-3xl text-stone-900">
                              <InlineText
                                value={valor.titulo}
                                onChange={(val) => {
                                  const updated = [...(nosotrosContent.valores || [])];
                                  updated[idx] = { ...updated[idx], titulo: val };
                                  updateNosotrosField("valores", updated);
                                }}
                                placeholder="Título valor..."
                              />
                            </h3>
                            <div className="mt-3 text-base font-light text-stone-600 leading-relaxed">
                              <InlineText
                                value={valor.texto}
                                onChange={(val) => {
                                  const updated = [...(nosotrosContent.valores || [])];
                                  updated[idx] = { ...updated[idx], texto: val };
                                  updateNosotrosField("valores", updated);
                                }}
                                placeholder="Texto valor..."
                                multiline
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>

              {/* Materiales y Fabricantes */}
              {fabricantes.length > 0 && <Materials fabricantes={fabricantes} />}

              {/* Equipo y Empleo (Tarjetas finales editables) */}
              <section className="border-t border-stone-300">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Tarjeta 1: Equipo */}
                  <div className="relative isolate flex min-h-[320px] items-end overflow-hidden bg-stone-950 p-6 text-white sm:min-h-[380px] sm:p-10 lg:p-12 group">
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <InlineImage
                        src={nosotrosContent.enlaceEquipoImagen || "/proceso-entrega.jpg"}
                        alt="Equipo ALKO"
                        label="Cambiar foto de equipo"
                        onImageChange={(newUrl) => updateNosotrosField("enlaceEquipoImagen", newUrl)}
                        className="w-full h-full"
                        imageClassName="object-cover object-center opacity-60 group-hover:scale-105 group-hover:opacity-75 transition duration-700 ease-out"
                      />
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />
                    </div>
                    <div className="relative z-10 w-full">
                      <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-white/70">
                        <InlineText
                          value={nosotrosContent.enlaceEquipoEtiqueta || "Equipo"}
                          onChange={(val) => updateNosotrosField("enlaceEquipoEtiqueta", val)}
                          placeholder="Etiqueta..."
                        />
                      </span>
                      <div className="mt-3 flex items-center gap-3 font-serif font-light text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight">
                        <InlineText
                          value={nosotrosContent.enlaceEquipoTitulo || "Las personas detrás de cada obra"}
                          onChange={(val) => updateNosotrosField("enlaceEquipoTitulo", val)}
                          placeholder="Título..."
                          multiline
                        />
                        <span>→</span>
                      </div>
                    </div>
                  </div>

                  {/* Tarjeta 2: Empleo */}
                  <div className="relative isolate flex min-h-[320px] items-end overflow-hidden bg-stone-950 p-6 text-white sm:min-h-[380px] sm:p-10 lg:p-12 group">
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <InlineImage
                        src={nosotrosContent.enlaceEmpleoImagen || "/proceso-instalaciones.jpg"}
                        alt="Empleo ALKO"
                        label="Cambiar foto de empleo"
                        onImageChange={(newUrl) => updateNosotrosField("enlaceEmpleoImagen", newUrl)}
                        className="w-full h-full"
                        imageClassName="object-cover object-center opacity-60 group-hover:scale-105 group-hover:opacity-75 transition duration-700 ease-out"
                      />
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />
                    </div>
                    <div className="relative z-10 w-full">
                      <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-white/70">
                        <InlineText
                          value={nosotrosContent.enlaceEmpleoEtiqueta || "Trabaja con nosotros"}
                          onChange={(val) => updateNosotrosField("enlaceEmpleoEtiqueta", val)}
                          placeholder="Etiqueta..."
                        />
                      </span>
                      <div className="mt-3 flex items-center gap-3 font-serif font-light text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight">
                        <InlineText
                          value={nosotrosContent.enlaceEmpleoTitulo || "Buscamos profesionales con criterio"}
                          onChange={(val) => updateNosotrosField("enlaceEmpleoTitulo", val)}
                          placeholder="Título..."
                          multiline
                        />
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ========================================================
              FOOTER COMPLETO DE LA PÁGINA
              ======================================================== */}
          <Footer settings={settings} />
        </div>
      </div>
    </div>
  );
}
