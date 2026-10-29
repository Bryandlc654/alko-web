import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LeadsCrmManager from "@/components/admin/LeadsCrmManager";
import { getDbLeads } from "@/lib/db/mysql";

export const metadata = {
  title: "CRM y Gestión de Leads | ALKO Admin",
};

export default async function AdminLeadsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const initialLeads = await getDbLeads();

  return (
    <div className="min-h-screen bg-slate-50 flex font-poppins">
      <AdminSidebar
        userEmail={session.email}
        userName={session.name || session.email}
      />
      <main className="flex-1 min-w-0 p-6 lg:p-10 overflow-y-auto">
        <LeadsCrmManager initialLeads={initialLeads} />
      </main>
    </div>
  );
}
