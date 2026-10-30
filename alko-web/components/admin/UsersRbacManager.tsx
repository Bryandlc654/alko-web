"use client";

import { useState } from "react";
import {
  Users,
  ShieldCheck,
  Plus,
  KeyRound,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Check,
  Lock,
  Mail,
  User,
  Shield,
  Loader2,
} from "lucide-react";
import {
  ROLE_DEFINITIONS,
  MODULE_DESCRIPTIONS,
  type RoleType,
  type Permission,
} from "@/lib/auth/rbac";
import type { DbUserRecord } from "@/lib/db/mysql";

interface UsersRbacManagerProps {
  initialUsers: DbUserRecord[];
  currentUserEmail: string;
}

export default function UsersRbacManager({
  initialUsers,
  currentUserEmail,
}: UsersRbacManagerProps) {
  const [users, setUsers] = useState<DbUserRecord[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("todos");

  // Estados de modal y formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<DbUserRecord | null>(null);
  const [formData, setFormData] = useState<{
    username: string;
    name: string;
    email: string;
    password: string;
    role: RoleType;
    permissions: Permission[];
    active: boolean;
  }>({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "editor",
    permissions: [...ROLE_DEFINITIONS.editor.permissions],
    active: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      u.name?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q);

    const matchesRole = roleFilter === "todos" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      username: "",
      name: "",
      email: "",
      password: "",
      role: "editor",
      permissions: [...ROLE_DEFINITIONS.editor.permissions],
      active: true,
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: DbUserRecord) => {
    setEditingUser(user);
    const roleKey = (user.role as RoleType) || "editor";
    const defaultPerms = ROLE_DEFINITIONS[roleKey]
      ? ROLE_DEFINITIONS[roleKey].permissions
      : [];
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email,
      password: "", // Dejar en blanco para no modificar
      role: roleKey,
      permissions: (user.permissions as Permission[]) || defaultPerms,
      active: user.active !== false,
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleRoleChange = (newRole: RoleType) => {
    const perms =
      newRole === "custom"
        ? formData.permissions
        : [...ROLE_DEFINITIONS[newRole].permissions];

    setFormData((prev) => ({
      ...prev,
      role: newRole,
      permissions: perms,
    }));
  };

  const handleTogglePermission = (permission: Permission) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permission);
      const updated = exists
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission];

      return {
        ...prev,
        permissions: updated,
        role: "custom", // Si modifica manualmente se marca como custom
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.email.trim()) {
      setErrorMessage("El usuario y el correo electrónico son obligatorios.");
      return;
    }

    if (!editingUser && (!formData.password || formData.password.length < 6)) {
      setErrorMessage("La contraseña inicial debe tener al menos 6 caracteres.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const payload: any = {
        id: editingUser ? editingUser.id : undefined,
        username: formData.username.trim(),
        name: formData.name.trim() || formData.username,
        email: formData.email.trim(),
        role: formData.role,
        permissions: formData.permissions,
        active: formData.active,
      };

      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      const res = await fetch("/api/admin/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al procesar usuario");

      if (editingUser) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? data.user : u))
        );
        setSuccessToast(`Usuario "${formData.username}" actualizado.`);
      } else {
        setUsers((prev) => [data.user, ...prev]);
        setSuccessToast(`Usuario "${formData.username}" creado con éxito.`);
      }

      setIsModalOpen(false);
      setTimeout(() => setSuccessToast(""), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || "Error al guardar usuario");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (user: DbUserRecord) => {
    if (user.username === "admin") {
      alert("No está permitido eliminar al Super Administrador principal.");
      return;
    }

    if (user.email === currentUserEmail) {
      alert("No puedes eliminar tu propia cuenta en sesión activa.");
      return;
    }

    if (
      !confirm(
        `¿Confirmas la eliminación permanente del usuario "${user.name} (${user.username})"?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/usuarios?id=${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar usuario");

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setSuccessToast(`Usuario "${user.username}" eliminado.`);
      setTimeout(() => setSuccessToast(""), 3500);
    } catch (err: any) {
      alert(err.message || "Error al eliminar usuario");
    }
  };

  return (
    <div className="space-y-8 font-poppins">
      {/* Toast flotante */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Cabecera del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Seguridad y Control de Accesos (RBAC)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Gestión de Usuarios y Roles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Crea cuentas de acceso y restringe qué módulos puede ver y editar cada miembro del equipo.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-sm transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nuevo Usuario</span>
        </button>
      </div>

      {/* Tarjetas Informativas de Roles Preestablecidos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(["superadmin", "editor", "comercial", "tecnico"] as RoleType[]).map(
          (roleKey) => {
            const role = ROLE_DEFINITIONS[roleKey];
            const count = users.filter((u) => u.role === roleKey).length;
            return (
              <div
                key={roleKey}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 hover:border-purple-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {role.label}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    {count} {count === 1 ? "usuario" : "usuarios"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {role.description}
                </p>
                <div className="pt-2 text-[10px] font-mono text-slate-400">
                  {role.permissions.length} módulos habilitados
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, usuario o email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 shrink-0">Filtrar por rol:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-purple-500"
          >
            <option value="todos">Todos los roles</option>
            <option value="superadmin">Super Administrador</option>
            <option value="editor">Editor de Contenido</option>
            <option value="comercial">Comercial / CRM</option>
            <option value="tecnico">Técnico de Obra</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>
      </div>

      {/* Tabla de Usuarios Registrados */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Rol & Permisos</th>
                <th className="px-6 py-4">Módulos Permitidos</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const roleDef =
                  ROLE_DEFINITIONS[(u.role as RoleType) || "editor"] ||
                  ROLE_DEFINITIONS.custom;
                const perms = (u.permissions as Permission[]) || roleDef.permissions;
                const isSuper = u.role === "superadmin" || u.role === "admin";

                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {u.name?.slice(0, 2) || u.username.slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {u.name}
                          </span>
                          <span className="text-slate-400 font-mono text-[11px] block">
                            @{u.username} &middot; {u.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isSuper
                              ? "bg-purple-100 text-purple-800"
                              : u.role === "editor"
                              ? "bg-blue-100 text-blue-800"
                              : u.role === "comercial"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {roleDef.label}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {isSuper ? "Acceso Total" : `${perms.length} permisos`}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-sm">
                        {isSuper ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700">
                            Todos los módulos (Superadmin)
                          </span>
                        ) : perms.length > 0 ? (
                          perms.map((p) => (
                            <span
                              key={p}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200"
                            >
                              {p}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">
                            Sin módulos asignados
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {u.active !== false ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Activo</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span>Desactivado</span>
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition"
                          title="Editar usuario y permisos"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {u.username !== "admin" && (
                          <button
                            type="button"
                            onClick={() => handleDelete(u)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Crear / Editar Usuario con RBAC */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            {/* Cabecera del modal */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingUser ? `Editar Usuario @${editingUser.username}` : "Crear Nuevo Usuario"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configuración de credenciales y permisos de acceso RBAC
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Fila 1: Nombre y Usuario */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="ej: Laura Martínez"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nombre de Usuario (Login) *
                  </label>
                  <div className="relative">
                    <span className="text-xs font-mono text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">@</span>
                    <input
                      type="text"
                      required
                      disabled={editingUser?.username === "admin"}
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="laura.m"
                      className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-purple-600 disabled:bg-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Fila 2: Email y Contraseña */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="laura@alkoreformas.com"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {editingUser ? "Nueva Contraseña (dejar en blanco para conservar)" : "Contraseña de Acceso *"}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={editingUser ? "••••••••" : "Mínimo 6 caracteres"}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>
              </div>

              {/* Fila 3: Selección de Rol */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Rol Preestablecido
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(["superadmin", "editor", "comercial", "tecnico"] as RoleType[]).map((r) => {
                    const role = ROLE_DEFINITIONS[r];
                    const isSelected = formData.role === r;

                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRoleChange(r)}
                        className={`p-3 rounded-xl border text-left transition flex items-start justify-between ${
                          isSelected
                            ? "border-purple-600 bg-purple-50/60 ring-2 ring-purple-500/20"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div>
                          <span className={`text-xs font-bold block ${isSelected ? "text-purple-900" : "text-slate-800"}`}>
                            {role.label}
                          </span>
                          <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                            {role.description}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fila 4: Matriz Granular de Permisos por Módulo */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Permisos de Acceso por Módulo (RBAC)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {formData.role === "superadmin"
                      ? "Acceso a todos los módulos"
                      : `${formData.permissions.length} activados`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  {MODULE_DESCRIPTIONS.map((mod) => {
                    const isChecked =
                      formData.role === "superadmin" ||
                      formData.permissions.includes(mod.id);

                    return (
                      <label
                        key={mod.id}
                        className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition select-none ${
                          isChecked
                            ? "bg-white border-purple-200 text-slate-900 shadow-2xs"
                            : "border-transparent text-slate-500 hover:bg-white/60"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={formData.role === "superadmin"}
                          onChange={() => handleTogglePermission(mod.id)}
                          className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                        />
                        <div>
                          <span className="text-xs font-semibold block leading-tight">
                            {mod.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                            {mod.desc}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Fila 5: Estado Activo / Inactivo */}
              <div className="pt-2 flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">
                    Estado de la Cuenta
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Si desactivas la cuenta, el usuario no podrá iniciar sesión en ningún panel.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {/* Botones de acción */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-sm transition active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingUser ? "Actualizar Usuario" : "Crear Usuario"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
