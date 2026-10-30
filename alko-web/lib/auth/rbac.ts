export type Permission =
  | "editor"       // Editor visual en vivo
  | "proyectos"    // Catálogo de proyectos y obras
  | "servicios"    // Especialidades técnicas
  | "articulos"    // Blog técnico
  | "guias"        // Guías de edificación
  | "empleo"       // Vacantes y candidaturas
  | "equipo"       // Plantilla y equipo técnico
  | "leads"        // CRM y leads de contacto
  | "ajustes"      // Datos de empresa y SMTP
  | "usuarios";    // Gestión de usuarios y roles RBAC

export type RoleType = "superadmin" | "editor" | "comercial" | "tecnico" | "custom";

export interface RoleDefinition {
  id: RoleType;
  label: string;
  description: string;
  permissions: Permission[];
}

export const ROLE_DEFINITIONS: Record<RoleType, RoleDefinition> = {
  superadmin: {
    id: "superadmin",
    label: "Super Administrador",
    description: "Acceso total e irrestricto a todos los módulos y configuración de seguridad",
    permissions: [
      "editor",
      "proyectos",
      "servicios",
      "articulos",
      "guias",
      "empleo",
      "equipo",
      "leads",
      "ajustes",
      "usuarios",
    ],
  },
  editor: {
    id: "editor",
    label: "Editor de Contenido",
    description: "Gestión de artículos, guías técnicas, editor visual y proyectos",
    permissions: ["editor", "proyectos", "servicios", "articulos", "guias"],
  },
  comercial: {
    id: "comercial",
    label: "Comercial / CRM",
    description: "Gestión integral de leads, presupuestos y candidaturas de empleo",
    permissions: ["leads", "empleo"],
  },
  tecnico: {
    id: "tecnico",
    label: "Técnico de Obra",
    description: "Gestión y actualización de proyectos, servicios y equipo de obra",
    permissions: ["proyectos", "servicios", "equipo"],
  },
  custom: {
    id: "custom",
    label: "Rol Personalizado",
    description: "Permisos configurados a medida para este usuario",
    permissions: [],
  },
};

export interface UserAccount {
  id: string | number;
  username: string;
  name: string;
  email: string;
  role: RoleType;
  permissions: Permission[];
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

export const MODULE_DESCRIPTIONS: { id: Permission; name: string; path: string; desc: string }[] = [
  { id: "editor", name: "Editor en Vivo", path: "/admin/editor", desc: "Edición visual WYSIWYG de textos e imágenes sobre la portada" },
  { id: "proyectos", name: "Proyectos y Obras", path: "/admin/proyectos", desc: "Fichas técnicas, fotografías, presupuestos y cronogramas" },
  { id: "servicios", name: "Especialidades", path: "/admin/servicios", desc: "Catálogo de servicios constructivos y capacidades técnicas" },
  { id: "articulos", name: "Artículos y Blog", path: "/admin/articulos", desc: "Publicación y redacción de artículos con editor visual" },
  { id: "guias", name: "Guías Técnicas", path: "/admin/guias", desc: "Guías paso a paso de normativas y trámites de reformas" },
  { id: "empleo", name: "Empleo y Candidaturas", path: "/admin/empleo", desc: "Vacantes de trabajo y revisión de CVs de candidatos" },
  { id: "equipo", name: "Equipo Técnico", path: "/admin/equipo", desc: "Organización y perfiles del equipo técnico y dirección" },
  { id: "leads", name: "CRM y Leads", path: "/admin/leads", desc: "Control de solicitudes de contacto, presupuestos y notas de venta" },
  { id: "ajustes", name: "Ajustes de Empresa", path: "/admin/ajustes", desc: "Datos de contacto, redes sociales y servidor SMTP" },
  { id: "usuarios", name: "Usuarios y Roles (RBAC)", path: "/admin/usuarios", desc: "Creación de cuentas, asignación de roles y control de accesos" },
];

/**
 * Determina si un usuario tiene permiso para acceder a un módulo específico.
 */
export function hasPermission(user: { role?: string; permissions?: Permission[] } | null | undefined, permission: Permission): boolean {
  if (!user) return false;
  if (user.role === "superadmin" || user.role === "admin") return true;
  if (!user.permissions || !Array.isArray(user.permissions)) {
    // Si no tiene permisos explícitos pero tiene un rol predefinido
    const roleDef = ROLE_DEFINITIONS[user.role as RoleType];
    return roleDef ? roleDef.permissions.includes(permission) : false;
  }
  return user.permissions.includes(permission);
}
