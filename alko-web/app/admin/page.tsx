import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import {
  Sparkles,
  ExternalLink,
  Layers,
  Building2,
  Database,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  BookOpen,
  FileText,
  Briefcase,
  Users,
  Inbox,
  Settings,
  ChevronRight,
} from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getProjects, getSectors, getArticles, getGuides, getHomeContent } from "@/lib/wordpress";
import { getDbJobApplications, getDbVacancies, getDbTeamMembers, getDbLeads } from "@/lib/db/mysql";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();
  const [projects, sectors, articles, guides, candidaturas, vacantes, teamMembers, leads, homeContent] = await Promise.all([
    getProjects(),
    getSectors(),
    getArticles(),
    getGuides(),
    getDbJobApplications(),
    getDbVacancies(),
    getDbTeamMembers(),
    getDbLeads(),
    getHomeContent(),
  ]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-poppins flex">
      {/* ========================================================
          SIDEBAR LATERAL IZQUIERDO DE ADMINISTRACIÓN
          ======================================================== */}
      <AdminSidebar
        userName={session?.name || "Administrador"}
        userEmail={session?.email || "admin@alkoreformas.com"}
        userRole={session?.role}
        userPermissions={session?.permissions}
      />

      {/* ========================================================
          CONTENIDO PRINCIPAL DEL DASHBOARD
          ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Barra superior de estado y perfil */}
        <header className="h-16 border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Panel de Control
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-900">Vista General</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-xs transition font-medium"
            >
              <span>Ver web pública</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <div className="h-4 w-[1px] bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="block text-xs font-bold text-slate-900">
                  {session?.name || "Administrador"}
                </span>
                <span className="block text-[10px] text-slate-400">
                  {session?.email || "admin@alkoreformas.com"}
                </span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </header>

        {/* Cuerpo del Dashboard */}
        <main className="p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Banner de Bienvenida y Acceso Directo al Editor */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white p-8 sm:p-10 shadow-lg shadow-blue-600/15">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold mb-4 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Editor Visual On-Page Activo</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                Bienvenido al Panel de Gestión ALKO
              </h1>

              <p className="mt-3 text-sm sm:text-base text-blue-100/90 font-normal leading-relaxed">
                Edita textos e imágenes directamente sobre la propia página con previsualización en vivo y guardado seguro en MySQL.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link
                  href="/admin/editor"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-xs uppercase tracking-wider shadow-md hover:bg-blue-50 transition active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Abrir Editor Visual en Vivo</span>
                </Link>

                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 backdrop-blur-md transition"
                >
                  <span>Visitar Portada</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/70" />
                </Link>
              </div>
            </div>

            {/* Elemento gráfico decorativo */}
            <div className="absolute right-[-60px] top-[-60px] w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          </div>

          {/* Tarjetas de Estadísticas Principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link
              href="/admin/proyectos"
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-500 hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-medium text-slate-500 block">Proyectos y Obras</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">{projects.length}</span>
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" /> Fichas completas →
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
            </Link>

            <Link
              href="/admin/servicios"
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-500 hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-medium text-slate-500 block">Especialidades</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">{sectors.length}</span>
                <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1 mt-1">
                  <Layers className="w-3 h-3" /> Gestionar servicios →
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
            </Link>

            <Link
              href="/admin/articulos"
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-500 hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-medium text-slate-500 block">Artículos Técnicos</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">{articles.length}</span>
                <span className="text-[11px] text-indigo-600 font-medium flex items-center gap-1 mt-1">
                  <BookOpen className="w-3 h-3" /> Gestionar blog →
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200/80 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
            </Link>

            <Link
              href="/admin/guias"
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-500 hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-medium text-slate-500 block">Guías Técnicas</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">{guides.length}</span>
                <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1 mt-1">
                  <FileText className="w-3 h-3" /> Ver guías técnicas →
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/80 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
            </Link>
          </div>

          {/* Módulos de Edición y Accesos Rápidos */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
              Módulos Disponibles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Portada en Vivo */}
              <Link
                href="/admin/editor"
                className="group p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-xs">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Página de Inicio (Editor en Vivo)
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Edición visual de Hero, fotografías de portada, proyectos, proceso de 6 fases y especialidades.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Abrir lienzo editable</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              {/* Card 2: Catálogo de Obras */}
              <Link
                href="/admin/proyectos"
                className="group p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-5 shadow-xs">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Proyectos y Obras
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {projects.map((p) => p.title).join(", ")}. Fichas con fotografías, presupuestos y cronogramas.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs font-semibold text-emerald-600 pt-4 border-t border-slate-100">
                  <span>Gestionar obras</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              {/* Card 3: Artículos de Blog */}
              <Link
                href="/admin/articulos"
                className="group p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mb-5 shadow-xs">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Artículos y Blog
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Contenido técnico especializado para clientes: aerotermia, planificación de reformas y acabados.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs font-semibold text-indigo-600 pt-4 border-t border-slate-100">
                  <span>Gestionar {articles.length} artículos</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              {/* Card 4: Guías Técnicas */}
              <Link
                href="/admin/guias"
                className="group p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-5 shadow-xs">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Guías Técnicas
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Guías paso a paso para trámites, licencias, eficiencia energética y normativas de edificación.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs font-semibold text-amber-600 pt-4 border-t border-slate-100">
                  <span>Gestionar {guides.length} guías</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </div>

          {/* Fila de Módulos Operativos: CRM, Empleo, Equipo y Ajustes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card CRM y Leads */}
            <Link
              href="/admin/leads"
              className="group rounded-2xl bg-white border border-slate-200/90 p-6 flex flex-col justify-between gap-4 shadow-xs hover:border-emerald-500 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Inbox className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      CRM y Leads
                    </h3>
                    {leads.filter((l) => l.estado === "nuevo").length > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {leads.filter((l) => l.estado === "nuevo").length} nuevos
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {leads.length} solicitudes &middot; Contactos y presupuestos recibidos.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 pt-2 border-t border-slate-100">
                <span>Gestionar CRM</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Card Empleo y Candidaturas */}
            <Link
              href="/admin/empleo"
              className="group rounded-2xl bg-white border border-slate-200/90 p-6 flex flex-col justify-between gap-4 shadow-xs hover:border-amber-500 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                      Empleo y Candidaturas
                    </h3>
                    {candidaturas.filter((c) => c.estado === "nueva").length > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                        {candidaturas.filter((c) => c.estado === "nueva").length}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {vacantes.length} vacantes &middot; {candidaturas.length} postulaciones con CV.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-amber-700 pt-2 border-t border-slate-100">
                <span>Gestionar empleo</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Card Equipo Técnico */}
            <Link
              href="/admin/equipo"
              className="group rounded-2xl bg-white border border-slate-200/90 p-6 flex flex-col justify-between gap-4 shadow-xs hover:border-blue-500 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Equipo Técnico
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {teamMembers.length} profesionales en plantilla: Dirección, Arquitectura y Obra.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-blue-600 pt-2 border-t border-slate-100">
                <span>Gestionar equipo</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Card Ajustes de Empresa */}
            <Link
              href="/admin/ajustes"
              className="group rounded-2xl bg-white border border-slate-200/90 p-6 flex flex-col justify-between gap-4 shadow-xs hover:border-blue-500 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Ajustes de Empresa
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Teléfono, WhatsApp directo, correo de atención, dirección y redes.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-blue-600 pt-2 border-t border-slate-100">
                <span>Configurar empresa</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>

          {/* Información del Sistema y Base de Datos */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Base de Datos MySQL (Hostinger)
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Servidor: 193.203.175.226 &middot; Tablas: `alko_site_content`, `alko_users`
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-700 font-semibold">Conexión Activa</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
