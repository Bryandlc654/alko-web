"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Building2,
  Layers,
  BookOpen,
  FileText,
  Briefcase,
  Users,
  Inbox,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  LucideIcon,
} from "lucide-react";
import LogoutButton from "./LogoutButton";
import { hasPermission, type Permission } from "@/lib/auth/rbac";

interface AdminSidebarProps {
  userEmail?: string;
  userName?: string;
  userRole?: string;
  userPermissions?: Permission[];
}

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string | null;
  badgeColor?: string;
  target?: string;
  permission?: Permission;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const MENU_ITEMS: MenuGroup[] = [
  {
    title: "PRINCIPAL",
    items: [
      {
        name: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        badge: null,
      },
      {
        name: "Editor en Vivo",
        href: "/admin/editor",
        icon: Sparkles,
        badge: "WYSIWYG",
        badgeColor: "bg-blue-100 text-blue-700",
        permission: "editor",
      },
    ],
  },
  {
    title: "CONTENIDO",
    items: [
      {
        name: "Proyectos y Obras",
        href: "/admin/proyectos",
        icon: Building2,
        badge: null,
        permission: "proyectos",
      },
      {
        name: "Especialidades",
        href: "/admin/servicios",
        icon: Layers,
        badge: null,
        permission: "servicios",
      },
      {
        name: "Artículos y Blog",
        href: "/admin/articulos",
        icon: BookOpen,
        badge: null,
        permission: "articulos",
      },
      {
        name: "Guías Técnicas",
        href: "/admin/guias",
        icon: FileText,
        badge: null,
        permission: "guias",
      },
      {
        name: "Empleo y Candidatos",
        href: "/admin/empleo",
        icon: Briefcase,
        badge: null,
        permission: "empleo",
      },
      {
        name: "Equipo Técnico",
        href: "/admin/equipo",
        icon: Users,
        badge: null,
        permission: "equipo",
      },
      {
        name: "CRM y Leads",
        href: "/admin/leads",
        icon: Inbox,
        badge: "Nuevo",
        badgeColor: "bg-emerald-100 text-emerald-700",
        permission: "leads",
      },
    ],
  },
  {
    title: "CONFIGURACIÓN",
    items: [
      {
        name: "Ver Sitio Público",
        href: "/",
        icon: ExternalLink,
        badge: "↗",
        badgeColor: "bg-slate-100 text-slate-600",
        target: "_blank",
      },
      {
        name: "Ajustes de Empresa",
        href: "/admin/ajustes",
        icon: Settings,
        badge: null,
        permission: "ajustes",
      },
      {
        name: "Usuarios y Roles",
        href: "/admin/usuarios",
        icon: ShieldCheck,
        badge: "RBAC",
        badgeColor: "bg-purple-100 text-purple-700",
        permission: "usuarios",
      },
    ],
  },
];

export default function AdminSidebar({ userEmail, userName, userRole, userPermissions }: AdminSidebarProps) {
  const pathname = usePathname();

  // Filtrar grupos y elementos según los permisos del usuario (RBAC)
  const filteredGroups = MENU_ITEMS.map((group) => {
    const visibleItems = group.items.filter((item) => {
      if (!item.permission) return true;
      return hasPermission({ role: userRole, permissions: userPermissions }, item.permission);
    });
    return { ...group, items: visibleItems };
  }).filter((group) => group.items.length > 0);

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 select-none font-poppins min-h-screen">
      <div>
        {/* Logo / Encabezado de la barra lateral */}
        <div className="h-16 px-6 border-b border-slate-200/90 flex items-center justify-between">
          <Link href="/admin" className="flex items-center group py-1">
            <Image
              src="/logo-alko-footer.webp"
              alt="ALKO"
              width={140}
              height={36}
              priority
              className="h-7 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
            />
          </Link>
        </div>

        {/* Grupos de navegación */}
        <nav className="p-4 space-y-6">
          {filteredGroups.map((group) => (
            <div key={group.title}>
              <span className="block px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">
                {group.title}
              </span>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href) && item.href !== "/admin#";
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      target={item.target}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-semibold shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                        <span>{item.name}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            item.badgeColor || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer del Sidebar con Usuario e Info de Base de Datos */}
      <div className="p-4 border-t border-slate-200/90 space-y-3 bg-slate-50/50">
        <div className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-800 block truncate">
                  {userName || "Administrador"}
                </span>
                {userRole && (
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {userRole}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                {userEmail || "admin@alkoreformas.com"}
              </span>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
