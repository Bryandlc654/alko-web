"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Undo,
  Redo,
  RemoveFormatting,
  Code,
  Eye,
  PenTool,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Escribe el contenido del artículo aquí...",
  minHeight = "360px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"visual" | "html">("visual");
  const isInternalUpdate = useRef(false);

  // Inicialización y sincronización del contenido cuando cambia externamente
  useEffect(() => {
    if (editorRef.current && !isInternalUpdate.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
    isInternalUpdate.current = false;
  }, [value, viewMode]);

  const handleInput = () => {
    if (editorRef.current) {
      isInternalUpdate.current = true;
      const html = editorRef.current.innerHTML;
      onChange(html === "<p><br></p>" || html === "<br>" ? "" : html);
    }
  };

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (viewMode !== "visual") return;
    document.execCommand(command, false, arg);
    handleInput();
    editorRef.current?.focus();
  };

  const handleFormatBlock = (tag: string) => {
    executeCommand("formatBlock", `<${tag}>`);
  };

  const handleAddLink = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString();
    const url = prompt("Introduce el enlace URL:", "https://");
    if (url && url !== "https://") {
      if (selectedText) {
        executeCommand("createLink", url);
      } else {
        const text = prompt("Texto para el enlace:") || url;
        executeCommand("insertHTML", `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`);
      }
    }
  };

  return (
    <div className="border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-2xs focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
      {/* Barra de herramientas estilo procesador de texto moderno */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1 text-slate-700 select-none">
        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => executeCommand("undo")}
          title="Deshacer (Ctrl+Z)"
          className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-600 transition"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("redo")}
          title="Rehacer (Ctrl+Y)"
          className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-600 transition"
        >
          <Redo className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-300 mx-1" />

        {/* Encabezados y Jerarquía */}
        <button
          type="button"
          onClick={() => handleFormatBlock("p")}
          title="Párrafo normal"
          className="px-2 py-1 text-xs font-medium rounded-lg hover:bg-slate-200/80 text-slate-700 transition"
        >
          Normal
        </button>
        <button
          type="button"
          onClick={() => handleFormatBlock("h2")}
          title="Encabezado Principal (H2) - Crea sección e índice"
          className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg hover:bg-slate-200/80 text-slate-800 transition"
        >
          <Heading2 className="w-4 h-4 text-blue-600" />
          <span>H2 (Sección)</span>
        </button>
        <button
          type="button"
          onClick={() => handleFormatBlock("h3")}
          title="Subtítulo (H3)"
          className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg hover:bg-slate-200/80 text-slate-800 transition"
        >
          <Heading3 className="w-4 h-4 text-blue-600" />
          <span>H3</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-300 mx-1" />

        {/* Negrita / Cursiva */}
        <button
          type="button"
          onClick={() => executeCommand("bold")}
          title="Negrita (Ctrl+B)"
          className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 transition"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("italic")}
          title="Cursiva (Ctrl+I)"
          className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 transition"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-300 mx-1" />

        {/* Listas */}
        <button
          type="button"
          onClick={() => executeCommand("insertUnorderedList")}
          title="Lista con viñetas"
          className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 transition"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("insertOrderedList")}
          title="Lista numerada"
          className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 transition"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-300 mx-1" />

        {/* Cita y Enlaces */}
        <button
          type="button"
          onClick={() => handleFormatBlock("blockquote")}
          title="Cita destacada"
          className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 transition"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleAddLink}
          title="Insertar enlace"
          className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 transition"
        >
          <LinkIcon className="w-4 h-4 text-blue-600" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("removeFormat")}
          title="Limpiar formato"
          className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-500 transition"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>

        {/* Conmutador Modo Visual / Código HTML */}
        <div className="ml-auto flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("visual")}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition flex items-center gap-1.5 ${
              viewMode === "visual"
                ? "bg-blue-50 text-blue-700 font-semibold shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <PenTool className="w-3 h-3" />
            <span>Editor Visual</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("html")}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition flex items-center gap-1.5 ${
              viewMode === "html"
                ? "bg-blue-50 text-blue-700 font-semibold shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Code className="w-3 h-3" />
            <span>Ver HTML</span>
          </button>
        </div>
      </div>

      {/* Área de Edición */}
      <div className="relative">
        {viewMode === "visual" ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            style={{ minHeight }}
            className="p-6 focus:outline-none prose prose-stone max-w-none prose-headings:font-serif prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-xl prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700 prose-blockquote:border-l-4 prose-blockquote:border-[#c98300] prose-blockquote:bg-stone-50 prose-blockquote:py-2 prose-blockquote:px-4 text-sm font-sans"
          />
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight }}
            className="w-full p-6 text-xs font-mono text-slate-800 leading-relaxed bg-slate-900 text-slate-100 focus:outline-none"
            placeholder="Código HTML directo..."
          />
        )}

        {/* Placeholder visual cuando esté vacío */}
        {viewMode === "visual" && !value && (
          <div className="absolute top-6 left-6 text-slate-400 text-sm pointer-events-none select-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Pie con ayuda y atajos */}
      <div className="px-4 py-2 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Consejo: Selecciona texto y usa <strong>H2 (Sección)</strong> para estructurar los apartados del artículo.</span>
        <span>Atajos: Ctrl+B (Negrita), Ctrl+I (Cursiva), Ctrl+Z (Deshacer)</span>
      </div>
    </div>
  );
}
