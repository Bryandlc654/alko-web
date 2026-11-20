/**
 * Límites y textos del chat. Sin secretos ni el prompt de sistema: lo importan tanto la
 * ruta /api/chat (servidor) como el widget (navegador).
 */

/**
 * Límites del endpoint público /api/chat. Protegen el crédito de OpenAI de un uso
 * abusivo: quien conozca la URL podría llamarla sin pasar por el widget.
 */
export const AI_LIMITS = {
  /** Mensajes que se envían al modelo (los más recientes); el resto se descarta. */
  maxMessages: 12,
  /** Mensajes máximos aceptados en una petición; por encima se rechaza. */
  maxMessagesAccepted: 40,
  /** Longitud máxima de cada mensaje del usuario, en caracteres. */
  maxMessageChars: 1000,
  /** Los mensajes del asistente se recortan a esta longitud (la respuesta puede ser larga). */
  maxAssistantChars: 2500,
  /** Tamaño máximo del cuerpo de la petición, en bytes. */
  maxBodyBytes: 32 * 1024,
  /** Peticiones permitidas por IP en cada ventana. */
  perIpRequests: 15,
  perIpWindowMs: 10 * 60 * 1000,
  /** Tope global diario (por instancia) como red de seguridad ante IP rotatorias. */
  dailyRequests: 1500,
  /** Tiempo máximo de espera a OpenAI, en milisegundos. */
  openaiTimeoutMs: 20_000,
} as const;

/** Textos que ve el visitante. Nunca incluyen detalles internos ni nombres de variables. */
export const AI_MESSAGES = {
  unavailable:
    "El asistente virtual no está disponible en este momento. Escríbenos desde la página de contacto o por WhatsApp y te respondemos lo antes posible.",
  failed:
    "No hemos podido responder ahora mismo. Inténtalo de nuevo en unos minutos o escríbenos desde la página de contacto o por WhatsApp.",
  tooMany:
    "Has enviado muchas consultas seguidas. Espera unos minutos para continuar o escríbenos desde la página de contacto o por WhatsApp.",
  invalid: "No hemos podido leer tu mensaje. Revisa que no esté vacío ni supere los 1000 caracteres.",
  tooLong: "Tu mensaje es demasiado largo. Intenta resumirlo en menos de 1000 caracteres.",
} as const;

/** Los mismos avisos en inglés, para las páginas de /en. */
export const AI_MESSAGES_EN: Record<keyof typeof AI_MESSAGES, string> = {
  unavailable:
    "The virtual assistant is not available right now. Write to us from the contact page or on WhatsApp and we will reply as soon as possible.",
  failed:
    "We could not reply just now. Please try again in a few minutes, or write to us from the contact page or on WhatsApp.",
  tooMany:
    "You have sent a lot of questions in a row. Please wait a few minutes to continue, or write to us from the contact page or on WhatsApp.",
  invalid: "We could not read your message. Check that it is not empty and is under 1,000 characters.",
  tooLong: "Your message is too long. Try to keep it under 1,000 characters.",
};

/** Avisos del asistente en el idioma de la página. */
export function aiMessages(locale: "es" | "en"): Record<keyof typeof AI_MESSAGES, string> {
  return locale === "en" ? AI_MESSAGES_EN : AI_MESSAGES;
}
