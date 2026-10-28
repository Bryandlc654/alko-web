"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Upload, Trash2, Loader2, Sparkles } from "lucide-react";

interface InlineImageProps {
  src: string;
  alt: string;
  onImageChange: (newSrc: string) => void;
  className?: string;
  imageClassName?: string;
  aspectRatio?: string;
  fill?: boolean;
  priority?: boolean;
  label?: string;
  canDelete?: boolean;
  onDelete?: () => void;
}

export default function InlineImage({
  src,
  alt,
  onImageChange,
  className = "",
  imageClassName = "",
  fill = true,
  priority = false,
  label = "Cambiar imagen",
  canDelete = false,
  onDelete,
}: InlineImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al subir imagen");

      onImageChange(data.url);
    } catch (err: any) {
      alert("Error subiendo imagen: " + (err.message || "Error desconocido"));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div
      className={`relative group/image-edit overflow-hidden cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => fileInputRef.current?.click()}
    >
      {/* Imagen real */}
      {src ? (
        <Image
          src={src}
          alt={alt || "Imagen de portada ALKO"}
          fill={fill}
          priority={priority}
          sizes="100vw"
          className={`transition duration-300 ${imageClassName} ${
            isHovered ? "filter brightness-90 scale-[1.01]" : ""
          }`}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/60 text-slate-300 border-2 border-dashed border-slate-600/60 p-6 text-center">
          <Camera className="w-10 h-10 mb-2 opacity-50" />
          <span className="text-xs font-poppins font-medium">Sin imagen (Clic para subir)</span>
        </div>
      )}

      {/* Input de archivo invisible */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Overlay de hover con botones de acción flotantes */}
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-200 pointer-events-none ${
          isHovered || isUploading ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-full bg-white/95 text-slate-800 shadow-xl border border-slate-200 font-poppins">
          {isUploading ? (
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Subiendo archivo...</span>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>

              {canDelete && onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("¿Deseas quitar esta imagen?")) {
                      onDelete();
                    }
                  }}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition"
                  title="Eliminar imagen"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>

        <span className="text-[11px] font-poppins text-white/90 drop-shadow mt-2 font-medium tracking-wide">
          Haz clic en cualquier parte de la imagen para reemplazarla
        </span>
      </div>
    </div>
  );
}
