import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server-session";
import { hasPermission } from "@/lib/auth/rbac";
import { getDbUsers } from "@/lib/db/mysql";
import AdminSidebar from "@/components/admin/AdminSidebar";
import UsersRbacManager from "@/components/admin/UsersRbacManager";

export const metadata = {
  title: "Usuarios y Roles (RBAC) | ALKO Admin",
};

export default async function AdminUsuariosPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  // Comprobar permiso explícito de gestión de usuarios
  if (!hasPermission(session, "usuarios")) {
    redirect("/admin?error=unauthorized&modulo=usuarios");
  }

  const users = await getDbUsers();
  // Sanitizar contraseñas antes de enviar al cliente
  const safeUsers = users.map((u) => {
    const { password_hash, ...rest } = u;
    return rest;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-poppins flex">
      <AdminSidebar
        userEmail={session.email}
        userName={session.name || session.email}
        userRole={session.role}
        userPermissions={session.permissions}
      />
      <main className="flex-1 min-w-0 p-6 lg:p-10 overflow-y-auto">
        <UsersRbacManager
          initialUsers={safeUsers}
          currentUserEmail={session.email}
        />
      </main>
    </div>
  );
}
