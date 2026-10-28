"use client";

import { useEffect, useRef, useState } from "react";
import { Edit3 } from "lucide-react";

interface InlineTextProps {
  value: string;
  onChange: (nextValue: string) => void;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  placeholder?: string;
  multiline?: boolean;
}

export default function InlineText({
  value,
  onChange,
  className = "",
  as: Component = "span",
  placeholder = "Escribe aquí...",
  multiline = false,
}: InlineTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Sincronizar el contenido del DOM solo cuando no está enfocado para no interrumpir la escritura
  useEffect(() => {
    if (ref.current && !isFocused) {
      if (ref.current.innerText !== value) {
        ref.current.innerText = value || "";
      }
    }
  }, [value, isFocused]);

  const handleBlur = () => {
    setIsFocused(false);
    if (ref.current) {
      const nextText = ref.current.innerText.trim();
      if (nextText !== value) {
        onChange(nextText);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Si no es multilínea, presionar Enter completa la edición
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      ref.current?.blur();
    }
  };

  return (
    <span
      className="relative group/inline inline-block max-w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Component
        ref={ref as any}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`outline-none transition-all duration-200 cursor-text rounded-md ${className} ${
          isFocused
            ? "ring-2 ring-blue-500 bg-blue-500/10 shadow-sm px-1 -mx-1"
            : isHovered
            ? "ring-1 ring-blue-400/80 bg-blue-400/5 px-1 -mx-1"
            : ""
        }`}
        data-placeholder={placeholder}
      >
        {value}
      </Component>

      {/* Indicador visual flotante de edición al hacer hover */}
      {isHovered && !isFocused && (
        <span className="pointer-events-none absolute -top-3 -right-3 z-30 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white shadow-md transition-transform scale-100 font-poppins">
          <Edit3 className="w-2.5 h-2.5" />
        </span>
      )}
    </span>
  );
}
