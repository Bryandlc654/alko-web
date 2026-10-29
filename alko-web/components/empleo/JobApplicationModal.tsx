"use client";

import { useState, useRef } from "react";
import { X, Upload, CheckCircle2, AlertCircle, FileText, Briefcase, User, Mail, Phone } from "lucide-react";
import type { PosicionEmpleo } from "@/lib/types";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPuesto?: string;
  vacantes: PosicionEmpleo[];
}

export default function JobApplicationModal({
  isOpen,
  onClose,
  selectedPuesto = "Candidatura espontánea",
  vacantes,
}: JobApplicationModalProps) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [puesto, setPuesto] = useState(selectedPuesto);
  const [mensaje, setMensaje] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar puesto seleccionado al abrir
  if (isOpen && puesto !== selectedPuesto && !nombre) {
    setPuesto(selectedPuesto);
  }

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        setError("El archivo supera el tamaño máximo permitido de 10MB.");
        return;
      }
      setFile(selected);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("email", email);
      formData.append("telefono", telefono);
      formData.append("puesto", puesto);
      formData.append("mensaje", mensaje);
      if (file) {
        formData.append("cv", file);
      }

      const res = await fetch("/api/empleo/postulacion", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al enviar la postulación");
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setNombre("");
        setEmail("");
        setTelefono("");
        setMensaje("");
        setFile(null);
        onClose();
      }, 3500);
    } catch (err: any) {
      setError(err.message || "No se pudo enviar la postulación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-900 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-medium text-stone-900">
                Postular a ALKO
              </h2>
              <p className="text-xs text-stone-500 font-sans">
                Forma parte de nuestro equipo de construcción y reformas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo / Formulario */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {success ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-medium text-stone-900">
                ¡Candidatura recibida con éxito!
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Gracias por tu interés en unirte a ALKO. Nuestro equipo de dirección técnica revisará
                tu perfil detalladamente y nos pondremos en contacto contigo.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Puesto */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wider">
                  Puesto o Vacante
                </label>
                <select
                  value={puesto}
                  onChange={(e) => setPuesto(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                >
                  <option value="Candidatura espontánea">Candidatura espontánea (General)</option>
                  {vacantes.map((v) => (
                    <option key={v.id || v.titulo} value={v.titulo}>
                      {v.titulo} ({v.departamento} - {v.ubicacion})
                    </option>
                  ))}
                </select>
              </div>

              {/* Nombre completo */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  Nombre y Apellidos *
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Marcos Gómez"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                />
              </div>

              {/* Email y Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marcos@ejemplo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                  />
                </div>
              </div>

              {/* Archivo CV */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wider">
                  Curriculum Vitae (PDF o DOCX, máx 10MB)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-amber-700 rounded-2xl p-4 text-center cursor-pointer transition bg-stone-50/50 hover:bg-stone-50 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-2 text-stone-800">
                      <FileText className="w-5 h-5 text-amber-700" />
                      <span className="text-xs font-medium">{file.name}</span>
                      <span className="text-[11px] text-stone-400">
                        ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-stone-400 mx-auto group-hover:text-amber-700 transition" />
                      <span className="text-xs font-medium text-stone-700 block">
                        Haz clic aquí para seleccionar tu CV
                      </span>
                      <span className="text-[10px] text-stone-400 block">
                        Archivos admitidos: PDF, DOC, DOCX
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Mensaje breve */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wider">
                  Carta de presentación o comentarios (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Cuéntanos brevemente sobre tu experiencia en obra o proyectos..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-full bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs uppercase tracking-wider shadow-lg transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>{loading ? "Enviando postulación..." : "Enviar Candidatura"}</span>
                  <span>→</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
