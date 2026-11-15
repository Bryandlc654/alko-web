import { getSession } from "@/lib/auth/server-session";
import { redirect } from "next/navigation";
import { canUseMedia } from "@/lib/auth/rbac";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/admin/LogoutButton";
import { MediaLibrary } from "@/components/admin/media";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const session = await getSession();
  if (!canUseMedia(session)) redirect("/admin?error=unauthorized&modulo=media");

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
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Panel de Control
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-900">Biblioteca de Medios</span>
          </div>

          <div className="flex items-center gap-4">
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
        <main className="p-8 max-w-7xl w-full mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Medios</h1>
            <p className="mt-1 text-sm text-slate-500">
              Todas las imágenes de la web. Sube fotos nuevas, copia su enlace o elimina las que ya no uses. Al cambiar
              una imagen en cualquier bloque se abre esta misma biblioteca.
            </p>
          </div>
          <div className="flex min-h-[70vh] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <MediaLibrary />
          </div>
        </main>
      </div>
    </div>
  );
}
