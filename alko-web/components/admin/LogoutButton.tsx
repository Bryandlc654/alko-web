"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  variant?: "icon" | "full";
  className?: string;
}

export default function LogoutButton({ variant = "icon", className }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        headers: { "Cache-Control": "no-cache" },
      });
    } catch (e) {
      console.error("Error cerrando sesión:", e);
    } finally {
      // Redirección completa para limpiar estado de cliente, cookies y caché del router
      window.location.href = "/admin/login";
    }
  };

  if (variant === "full") {
    return (
      <button
        onClick={handleLogout}
        disabled={loading}
        title="Cerrar sesión"
        className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition ${className || ""}`}
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>{loading ? "Cerrando..." : "Cerrar sesión"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      title="Cerrar sesión"
      className={`p-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 border border-slate-200 transition ${className || ""}`}
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
}
