"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Building,
  Globe,
  Share2,
} from "lucide-react";
import type { SiteSettings } from "@/lib/types";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.95 0-1.72.77-1.72 1.72s.77 1.72 1.72 1.72 1.72-.77 1.72-1.72-.77-1.72-1.72-1.72m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

interface CompanySettingsFormProps {
  initialSettings: SiteSettings;
}

export default function CompanySettingsForm({ initialSettings }: CompanySettingsFormProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
    setErrorMessage("");
  };

  const handleChangeSmtp = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      smtp: {
        ...(prev.smtp || {}),
        [field]: value,
      },
    }));
    setSavedSuccess(false);
    setSmtpTestResult(null);
  };

  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    setSmtpTestResult(null);
    try {
      const res = await fetch("/api/admin/ajustes/test-smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings.smtp || {}),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setSmtpTestResult({
          success: false,
          message: data.error || "Fallo en la prueba de conexión con el servidor SMTP",
        });
      } else {
        setSmtpTestResult({
          success: true,
          message: "¡Conexión SMTP exitosa! El servidor de correo responde correctamente.",
        });
      }
    } catch (err: any) {
      setSmtpTestResult({
        success: false,
        message: err.message || "Error al conectar con el servidor SMTP",
      });
    } finally {
      setTestingSmtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/ajustes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al guardar la configuración");
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "No se pudo guardar la información.");
    } finally {
      setSaving(false);
    }
  };

  const whatsappClean = settings.whatsapp.replace(/[^\d]/g, "");
  const telClean = settings.telefono.replace(/[^+\d]/g, "");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.direccion)}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Encabezado con acción guardar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building className="w-6 h-6 text-blue-600" />
            Ajustes de Empresa y Contacto
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configuración global de datos de contacto, sede física, horarios y redes que nutren el sitio web.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Guardado en MySQL</span>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Guardando..." : "Guardar Cambios"}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid de Bloques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda / Central: Formularios */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bloque 1: Canales de Atención Directa */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Canales de Contacto Directo</h3>
                <p className="text-[11px] text-slate-400">Atención a clientes particulares y empresas</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Teléfono Principal
                </label>
                <input
                  type="text"
                  value={settings.telefono}
                  onChange={(e) => handleChange("telefono", e.target.value)}
                  placeholder="+34 910 000 000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Enlace directo: <code className="bg-slate-50 px-1 py-0.5 rounded text-slate-600">tel:{telClean}</code>
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                  WhatsApp Directo
                </label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  placeholder="+34 600 000 000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Botón flotante web vinculado a: <code className="bg-slate-50 px-1 py-0.5 rounded text-slate-600">wa.me/{whatsappClean}</code>
                </span>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Correo Electrónico de Consultas
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="info@alkoreformas.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Se utiliza en el pie de página, página de contacto y formularios.
                </span>
              </div>
            </div>
          </div>

          {/* Bloque 2: Sede Central y Horario */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Ubicación y Horario de Atención</h3>
                <p className="text-[11px] text-slate-400">Oficina técnica y horario laboral</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Dirección Física Completa
                  </label>
                  {settings.direccion && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 font-medium"
                    >
                      <span>Probar en Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={settings.direccion}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                  placeholder="Calle Velázquez 12, 28001 Madrid"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Horario de Atención
                </label>
                <input
                  type="text"
                  value={settings.horario}
                  onChange={(e) => handleChange("horario", e.target.value)}
                  placeholder="8:30am - 5:00pm (Lunes a Viernes)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Bloque 3: Redes Sociales */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Redes Sociales y Canales Digitales</h3>
                <p className="text-[11px] text-slate-400">Presencia de marca y enlaces corporativos</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <LinkedinIcon className="w-3.5 h-3.5 text-blue-700" />
                  Perfil de LinkedIn
                </label>
                <input
                  type="text"
                  value={settings.linkedin}
                  onChange={(e) => handleChange("linkedin", e.target.value)}
                  placeholder="https://www.linkedin.com/company/alko-reformas"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
                  Perfil de Instagram
                </label>
                <input
                  type="text"
                  value={settings.instagram}
                  onChange={(e) => handleChange("instagram", e.target.value)}
                  placeholder="https://www.instagram.com/alko_reformas"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <FacebookIcon className="w-3.5 h-3.5 text-blue-600" />
                  Página de Facebook
                </label>
                <input
                  type="text"
                  value={settings.facebook}
                  onChange={(e) => handleChange("facebook", e.target.value)}
                  placeholder="https://www.facebook.com/alkoreformas"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Bloque 4: Configuración del Servidor SMTP (Notificaciones de Leads) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Notificaciones por Correo (Servidor SMTP)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Envía avisos inmediatos al equipo cada vez que un cliente solicita presupuesto
                  </p>
                </div>
              </div>

              {/* Interruptor de activación */}
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.smtp?.enabled || false}
                  onChange={(e) => handleChangeSmtp("enabled", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600 relative" />
                <span className="text-xs font-semibold text-slate-700">
                  {settings.smtp?.enabled ? "SMTP Activo" : "Desactivado"}
                </span>
              </label>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Servidor Host SMTP *
                  </label>
                  <input
                    type="text"
                    placeholder="smtp.hostinger.com o smtp.gmail.com"
                    value={settings.smtp?.host || ""}
                    onChange={(e) => handleChangeSmtp("host", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Puerto SMTP *
                  </label>
                  <input
                    type="text"
                    placeholder="465 (SSL) o 587 (TLS)"
                    value={settings.smtp?.port || ""}
                    onChange={(e) => handleChangeSmtp("port", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Usuario / Correo Emisor *
                  </label>
                  <input
                    type="text"
                    placeholder="notificaciones@alkoreformas.com"
                    value={settings.smtp?.user || ""}
                    onChange={(e) => handleChangeSmtp("user", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Contraseña del Correo *
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={settings.smtp?.password || ""}
                    onChange={(e) => handleChangeSmtp("password", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nombre del Remitente (From)
                  </label>
                  <input
                    type="text"
                    placeholder='"ALKO Reformas" <notificaciones@alko.es>'
                    value={settings.smtp?.from || ""}
                    onChange={(e) => handleChangeSmtp("from", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Enviar Notificación A (Destinatario) *
                  </label>
                  <input
                    type="email"
                    placeholder="info@alkoreformas.com"
                    value={settings.smtp?.to || ""}
                    onChange={(e) => handleChangeSmtp("to", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Botón de prueba SMTP */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">
                  Prueba la autenticación y conectividad con tu proveedor antes de guardar.
                </span>

                <button
                  type="button"
                  disabled={testingSmtp || !settings.smtp?.host || !settings.smtp?.user}
                  onClick={handleTestSmtp}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition disabled:opacity-40"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{testingSmtp ? "Verificando conexión..." : "Probar Conexión SMTP"}</span>
                </button>
              </div>

              {smtpTestResult && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border animate-in fade-in ${
                    smtpTestResult.success
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  {smtpTestResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                  <span>{smtpTestResult.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Vista previa en vivo del Footer & WhatsApp */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs sticky top-24 space-y-6">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Previsualización en Directo
              </h3>
            </div>

            {/* Tarjeta Simulación Footer */}
            <div className="bg-stone-900 text-white rounded-xl p-5 space-y-4 text-xs font-light">
              <div className="border-b border-stone-800 pb-3">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                  Pie de Página
                </span>
                <span className="text-xs font-medium text-stone-200 block mt-1">
                  ALKO Construcción Madrid
                </span>
              </div>

              <div className="space-y-2.5 text-stone-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">{settings.direccion || "Dirección no especificada"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="text-[11px]">{settings.telefono || "Teléfono no especificado"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="text-[11px] break-all">{settings.email || "Email no especificado"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="text-[11px]">{settings.horario || "Horario no especificado"}</span>
                </div>
              </div>
            </div>

            {/* Simulación Botón WhatsApp Flotante */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">Botón WhatsApp Web</span>
                  <span className="text-[11px] text-emerald-700 block">+{whatsappClean || "34..."}</span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                Activo
              </span>
            </div>

            {/* Botón de Guardado Secundario */}
            <button
              type="submit"
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider shadow-md transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Guardando..." : "Guardar Ajustes"}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
