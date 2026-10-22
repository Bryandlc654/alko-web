"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, RotateCcw, Sparkles, Bot, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const INITIAL_SUGGESTIONS = [
  "¿Qué tipo de reformas realizáis?",
  "¿Cómo es vuestro proceso y plazos?",
  "¿Qué materiales y marcas utilizáis?",
  "Quiero pedir presupuesto para mi vivienda",
];

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Bienvenido a ALKO. Soy tu asesor técnico de arquitectura y reformas integrales. ¿Tienes un proyecto en mente o deseas información sobre nuestros servicios en Madrid?",
  timestamp: new Date(),
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);

    try {
      // Enviamos el historial a la API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok && data?.error) {
        throw new Error(data.details || data.error);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || "Gracias por tu consulta. ¿En qué más puedo ayudarte?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Ha ocurrido un error al conectar con el servidor.";

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Lo sentimos, ocurrió un inconveniente: ${errorMsg}\n\nPuedes contactarnos directamente en nuestra sección de contacto o por WhatsApp.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        ...INITIAL_MESSAGE,
        timestamp: new Date(),
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
      {/* Ventana de chat desplegable (Estilo Light) */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Asistente Virtual ALKO"
          className="mb-4 w-[calc(100vw-2.5rem)] sm:w-[420px] h-[560px] max-h-[82vh] flex flex-col bg-white/95 backdrop-blur-2xl border border-stone-200/90 rounded-2xl shadow-2xl shadow-stone-900/15 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Cabecera del chat */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200/80 bg-stone-50/80">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#c98300]/40 text-[#c98300] shadow-sm">
                <Sparkles className="w-4 h-4 text-[#c98300]" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-stone-900 flex items-center gap-1.5 font-sans">
                  ALKO Asistente
                </h3>
                <p className="text-[11px] text-stone-500">Arquitectura & Reformas</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Reiniciar conversación"
                className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200/60 transition-colors"
                aria-label="Reiniciar conversación"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Cerrar chat"
                className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200/60 transition-colors"
                aria-label="Cerrar ventana de chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-sm bg-[#fafaf8] scroll-smooth">
            {messages.map((m) => {
              const isAssistant = m.role === "assistant";
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isAssistant ? "justify-start" : "justify-end"}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-full bg-white border border-stone-200/80 flex items-center justify-center text-[#c98300] flex-shrink-0 mt-0.5 shadow-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] px-4 py-2.5 rounded-2xl whitespace-pre-line leading-relaxed ${
                      isAssistant
                        ? "bg-white border border-stone-200/90 text-stone-800 rounded-tl-none shadow-sm"
                        : "bg-[#c98300] text-white border border-[#b87600] rounded-tr-none shadow-sm"
                    }`}
                  >
                    {m.content}
                    <div
                      className={`text-[10px] mt-1.5 select-none ${
                        isAssistant ? "text-stone-400" : "text-amber-100/80 text-right"
                      }`}
                    >
                      {m.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Indicador de carga */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start items-center text-stone-500">
                <div className="w-7 h-7 rounded-full bg-white border border-stone-200/80 flex items-center justify-center text-[#c98300] flex-shrink-0 shadow-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c98300]" />
                </div>
                <div className="px-4 py-2.5 rounded-2xl rounded-tl-none bg-white border border-stone-200/90 text-xs text-stone-600 flex items-center gap-1.5 shadow-sm">
                  <span>Consultando asistente</span>
                  <span className="inline-flex gap-1">
                    <span className="w-1 h-1 bg-[#c98300] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1 h-1 bg-[#c98300] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1 h-1 bg-[#c98300] rounded-full animate-bounce" />
                  </span>
                </div>
              </div>
            )}

            {/* Sugerencias de preguntas rápidas (cuando solo está el mensaje de bienvenida) */}
            {messages.length === 1 && !isLoading && (
              <div className="pt-2">
                <p className="text-[11px] uppercase tracking-wider text-stone-400 font-medium mb-2 px-1">
                  Preguntas frecuentes:
                </p>
                <div className="flex flex-col gap-1.5">
                  {INITIAL_SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(suggestion)}
                      className="text-left text-xs px-3.5 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200/90 hover:border-[#c98300]/50 text-stone-700 hover:text-stone-950 transition-all duration-200 shadow-xs"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Formulario de entrada */}
          <div className="p-3 border-t border-stone-200/80 bg-stone-50/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu consulta sobre tu obra o proyecto..."
                disabled={isLoading}
                className="flex-1 bg-white border border-stone-200/90 focus:border-[#c98300] focus:ring-1 focus:ring-[#c98300]/30 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none transition-colors shadow-xs"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Enviar mensaje"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#c98300] hover:bg-[#b87600] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Send className="w-4 h-4 text-white" />
                )}
              </button>
            </form>
            <div className="text-[10px] text-center text-stone-400 mt-2">
              ALKO IA · Atención preliminar y orientación técnica
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante / Burbuja de chat (Estilo Light) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente de arquitectura"}
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border border-stone-200/90 hover:border-[#c98300]/60 text-[#c98300] shadow-xl shadow-stone-900/10 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {/* Anillo de pulso sutil */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#c98300]/15 animate-ping opacity-60 pointer-events-none" />
        )}

        {isOpen ? (
          <X className="w-6 h-6 text-stone-800 transition-transform duration-200" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6 text-[#c98300] group-hover:text-[#b87600] transition-colors" />
            <Sparkles className="w-3 h-3 text-[#c98300] absolute -top-1 -right-1.5" />
          </div>
        )}

        {/* Tooltip visible en desktop */}
        {!isOpen && (
          <span className="hidden sm:inline-block absolute right-full mr-3 whitespace-nowrap rounded-full bg-white border border-stone-200/90 px-3.5 py-1.5 text-xs text-stone-800 font-medium shadow-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
            Asistente ALKO
          </span>
        )}
      </button>
    </div>
  );
}
