import { notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getProjectBySlug } from "@/lib/wordpress";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/admin/LogoutButton";
import ProjectEditForm from "@/components/admin/ProjectEditForm";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const { id } = await params;
  const isNew = id === "nuevo";

  const project = isNew ? null : await getProjectBySlug(id);

  if (!isNew && !project) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-poppins flex">
      {/* Sidebar lateral */}
      <AdminSidebar
        userName={session?.name || "Administrador"}
        userEmail={session?.email || "admin@alkoreformas.com"}
        userRole={session?.role}
        userPermissions={session?.permissions}
      />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Barra superior */}
        <header className="h-16 border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <Link href="/admin/proyectos" className="text-xs font-semibold text-slate-500 hover:text-slate-800 uppercase tracking-wider transition">
              Proyectos
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-900">
              {isNew ? "Nuevo Proyecto" : project?.title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/proyectos"
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

        {/* Zona de Trabajo */}
        <main className="p-8 max-w-6xl w-full mx-auto">
          <ProjectEditForm initialProject={project} isNew={isNew} />
        </main>
      </div>
    </div>
  );
}
