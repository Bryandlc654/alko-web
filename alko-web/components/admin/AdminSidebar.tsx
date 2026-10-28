"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Building2,
  Layers,
  BookOpen,
  Settings,
  ExternalLink,
  LucideIcon,
} from "lucide-react";

interface AdminSidebarProps {
  userEmail?: string;
  userName?: string;
}

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string | null;
  badgeColor?: string;
  target?: string;
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
        badge: "3",
        badgeColor: "bg-slate-100 text-slate-600",
      },
      {
        name: "Especialidades",
        href: "/admin#servicios",
        icon: Layers,
        badge: "4",
        badgeColor: "bg-slate-100 text-slate-600",
      },
      {
        name: "Artículos y Blog",
        href: "/admin#articulos",
        icon: BookOpen,
        badge: "3",
        badgeColor: "bg-slate-100 text-slate-600",
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
        href: "/admin#ajustes",
        icon: Settings,
        badge: null,
      },
    ],
  },
];

export default function AdminSidebar({ userEmail, userName }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 select-none font-poppins min-h-screen">
      <div>
        {/* Logo / Encabezado de la barra lateral */}
        <div className="h-16 px-6 border-b border-slate-200/90 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 tracking-tight block">ALKO Studio</span>
              <span className="text-[10px] text-blue-600 font-mono block leading-none font-semibold">
                Control Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Grupos de navegación */}
        <nav className="p-4 space-y-6">
          {MENU_ITEMS.map((group) => (
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
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="overflow-hidden">
            <span className="text-[11px] font-bold text-slate-800 block truncate">
              {userName || "Administrador"}
            </span>
            <span className="text-[10px] text-slate-500 block truncate">
              {userEmail || "admin@alkoreformas.com"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 text-[10px] text-slate-400">
          <span>MySQL Hostinger</span>
          <span className="text-emerald-600 font-semibold">193.203.175.226</span>
        </div>
      </div>
    </aside>
  );
}
