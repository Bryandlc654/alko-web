"use client";

import { useState, useEffect } from "react";
import Image from "@/components/ui/Image";
import { Camera, Upload, Trash2, Sparkles } from "lucide-react";
import { confirmDialog } from "@/components/admin/feedback";
import { openMediaPicker } from "@/components/admin/media";

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
  const [isHovered, setIsHovered] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoadError(false);
  }, [src]);

  // Abre la biblioteca de medios: elegir una imagen ya subida o subir una nueva.
  const chooseImage = async () => {
    const url = await openMediaPicker({ current: src, title: label });
    if (url) {
      setLoadError(false);
      onImageChange(url);
    }
  };

  const isPositioned = className.includes("absolute") || className.includes("fixed");

  return (
    <div
      className={`${isPositioned ? "" : "relative"} group/image-edit overflow-hidden cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={chooseImage}
    >
      {/* Imagen real */}
      {src && !loadError ? (
        <Image
          src={src}
          alt={alt || "Imagen de portada ALKO"}
          fill={fill}
          priority={priority}
          sizes="100vw"
          onError={() => setLoadError(true)}
          className={`transition duration-300 ${imageClassName} ${
            isHovered ? "filter brightness-90 scale-[1.01]" : ""
          }`}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900/80 text-stone-300 border-2 border-dashed border-stone-600/60 p-6 text-center">
          <Camera className="w-10 h-10 mb-2 opacity-50" />
          <span className="text-xs font-poppins font-medium">
            {loadError ? "Error al cargar imagen (Clic para reemplazar)" : "Sin imagen (Clic para elegir)"}
          </span>
        </div>
      )}

      {/* Overlay de hover con botones de acción flotantes */}
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-200 pointer-events-none ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-full bg-white/95 text-slate-800 shadow-xl border border-slate-200 font-poppins">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              chooseImage();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>

          {canDelete && onDelete && (
            <button
              type="button"
              onClick={async (e) => {
                e.stopPropagation();
                if ((await confirmDialog({ title: "¿Deseas quitar esta imagen?", danger: true }))) {
                  onDelete();
                }
              }}
              className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition"
              title="Eliminar imagen"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <span className="text-[11px] font-poppins text-white/90 drop-shadow mt-2 font-medium tracking-wide">
          Haz clic en cualquier parte de la imagen para reemplazarla
        </span>
      </div>
    </div>
  );
}
