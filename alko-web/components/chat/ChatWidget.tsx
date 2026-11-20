"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, RotateCcw, Sparkles, Bot, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { AI_LIMITS, aiMessages } from "@/lib/ai/limits";
import { localeFromPath, type Locale } from "@/lib/i18n";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/** Textos del asistente en cada idioma (el idioma sale de la URL: /en es inglés). */
const COPY: Record<Locale, {
  suggestions: string[];
  welcome: string;
  dialog: string;
  title: string;
  subtitle: string;
  reset: string;
  close: string;
  closeLabel: string;
  thinking: string;
  faq: string;
  placeholder: string;
  send: string;
  footer: string;
  open: string;
  tooltip: string;
}> = {
  es: {
    suggestions: [
      "¿Qué tipo de reformas realizáis?",
      "¿Cómo es vuestro proceso y plazos?",
      "¿Qué materiales y marcas utilizáis?",
      "Quiero pedir presupuesto para mi vivienda",
    ],
    welcome:
      "Bienvenido a ALKO. Soy tu asesor técnico de arquitectura y reformas integrales. ¿Tienes un proyecto en mente o deseas información sobre nuestros servicios en Madrid?",
    dialog: "Asistente Virtual ALKO",
    title: "ALKO Asistente",
    subtitle: "Arquitectura & Reformas",
    reset: "Reiniciar conversación",
    close: "Cerrar chat",
    closeLabel: "Cerrar ventana de chat",
    thinking: "Consultando asistente",
    faq: "Preguntas frecuentes:",
    placeholder: "Escribe tu consulta sobre tu obra o proyecto...",
    send: "Enviar mensaje",
    footer: "ALKO IA · Atención preliminar y orientación técnica",
    open: "Abrir asistente de arquitectura",
    tooltip: "Asistente ALKO",
  },
  en: {
    suggestions: [
      "What kind of renovations do you do?",
      "What is your process and how long does it take?",
      "Which materials and brands do you use?",
      "I would like a quote for my home",
    ],
    welcome:
      "Welcome to ALKO. I am your technical adviser for architecture and full renovations. Do you have a project in mind, or would you like to know more about our services in Madrid?",
    dialog: "ALKO virtual assistant",
    title: "ALKO Assistant",
    subtitle: "Architecture & Renovations",
    reset: "Restart conversation",
    close: "Close chat",
    closeLabel: "Close chat window",
    thinking: "Thinking",
    faq: "Frequently asked questions:",
    placeholder: "Ask about your building work or project...",
    send: "Send message",
    footer: "ALKO AI · Initial guidance and technical advice",
    open: "Open the architecture assistant",
    tooltip: "ALKO Assistant",
  },
};

function welcomeMessage(locale: Locale): Message {
  return { id: "welcome", role: "assistant", content: COPY[locale].welcome, timestamp: new Date() };
}

export default function ChatWidget() {
  const locale = localeFromPath(usePathname());
  const t = COPY[locale];
  const AI_MESSAGES = aiMessages(locale);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [welcomeMessage(locale)]);

  // Al cambiar de idioma con la conversación sin empezar, la bienvenida pasa al nuevo idioma.
  useEffect(() => {
    setMessages((prev) => (prev.length === 1 && prev[0].id === "welcome" ? [welcomeMessage(locale)] : prev));
  }, [locale]);
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
      // Solo se envían los mensajes más recientes: el servidor no admite historiales largos.
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-chat-locale": locale },
        body: JSON.stringify({
          messages: newHistory.slice(-AI_LIMITS.maxMessages).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      // El servidor responde siempre con `content` (también en los errores, con un texto
      // amable). Si la respuesta no es la esperada, se muestra un aviso genérico: nunca
      // el mensaje interno de un error.
      const data: unknown = await res.json().catch(() => null);
      const content = (data as { content?: unknown } | null)?.content;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: typeof content === "string" && content ? content : AI_MESSAGES.failed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      // Sin conexión o petición cancelada.
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: AI_MESSAGES.failed,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([welcomeMessage(locale)]);
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
          aria-label={t.dialog}
          className="mb-4 w-[calc(100vw-2.5rem)] sm:w-[420px] h-[560px] max-h-[82vh] flex flex-col bg-white/95 backdrop-blur-2xl border border-ink/15 shadow-ink/15 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Cabecera del chat */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink/15 bg-surface/80">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-paper border border-[#8B7560]/40 text-bronze">
                <Sparkles className="w-4 h-4 text-bronze" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-ink flex items-center gap-1.5 font-sans">
                  {t.title}
                </h3>
                <p className="text-[11px] text-mid">{t.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title={t.reset}
                className="p-1.5 text-mid hover:text-ink hover:bg-piedra/60 transition-colors"
                aria-label={t.reset}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title={t.close}
                className="p-1.5 text-mid hover:text-ink hover:bg-piedra/60 transition-colors"
                aria-label={t.closeLabel}
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
                    <div className="w-7 h-7 rounded-full bg-paper border border-ink/15 flex items-center justify-center text-bronze flex-shrink-0 mt-0.5 shadow-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] px-4 py-2.5 whitespace-pre-line leading-relaxed ${
                      isAssistant
                        ? "bg-paper border border-ink/15 text-ink "
                        : "bg-[#8B7560] text-white border border-[#75624F] "
                    }`}
                  >
                    {m.content}
                    <div
                      className={`text-[10px] mt-1.5 select-none ${
                        isAssistant ? "text-mid" : "text-paper/80 text-right"
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
              <div className="flex gap-2.5 justify-start items-center text-mid">
                <div className="w-7 h-7 rounded-full bg-paper border border-ink/15 flex items-center justify-center text-bronze flex-shrink-0 shadow-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-bronze" />
                </div>
                <div className="px-4 py-2.5 bg-paper border border-ink/15 text-xs text-mid flex items-center gap-1.5">
                  <span>{t.thinking}</span>
                  <span className="inline-flex gap-1">
                    <span className="w-1 h-1 bg-bronze rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1 h-1 bg-bronze rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1 h-1 bg-bronze rounded-full animate-bounce" />
                  </span>
                </div>
              </div>
            )}

            {/* Sugerencias de preguntas rápidas (cuando solo está el mensaje de bienvenida) */}
            {messages.length === 1 && !isLoading && (
              <div className="pt-2">
                <p className="text-[11px] uppercase tracking-wider text-mid font-medium mb-2 px-1">
                  {t.faq}
                </p>
                <div className="flex flex-col gap-1.5">
                  {t.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(suggestion)}
                      className="text-left text-xs px-3.5 py-2.5 bg-paper hover:bg-surface border border-ink/15 hover:border-[#8B7560]/50 text-ink hover:text-ink transition-all duration-200 shadow-xs"
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
          <div className="p-3 border-t border-ink/15 bg-surface/80">
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
                maxLength={AI_LIMITS.maxMessageChars}
                onKeyDown={handleKeyDown}
                placeholder={t.placeholder}
                disabled={isLoading}
                className="flex-1 bg-paper border border-ink/15 focus:border-[#8B7560] focus:ring-1 focus:ring-[#8B7560]/30 px-3.5 py-2.5 text-sm text-ink placeholder-mid focus:outline-none transition-colors shadow-xs"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label={t.send}
                className="flex items-center justify-center w-10 h-10 bg-bronze hover:bg-[#75624F] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Send className="w-4 h-4 text-white" />
                )}
              </button>
            </form>
            <div className="text-[10px] text-center text-mid mt-2">
              {t.footer}
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante / Burbuja de chat (Estilo Light) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? t.close : t.open}
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-paper border border-ink/15 hover:border-[#8B7560]/60 text-bronze shadow-ink/10 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {/* Anillo de pulso sutil */}
        {!isOpen && (
          <span className="absolute inset-0 bg-[#8B7560]/15 animate-ping opacity-60 pointer-events-none" />
        )}

        {isOpen ? (
          <X className="w-6 h-6 text-ink transition-transform duration-200" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6 text-bronze group-hover:text-[#75624F] transition-colors" />
            <Sparkles className="w-3 h-3 text-bronze absolute -top-1 -right-1.5" />
          </div>
        )}

        {/* Tooltip visible en desktop */}
        {!isOpen && (
          <span className="hidden sm:inline-block absolute right-full mr-3 whitespace-nowrap bg-paper border border-ink/15 px-3.5 py-1.5 text-xs text-ink font-medium opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
            {t.tooltip}
          </span>
        )}
      </button>
    </div>
  );
}
