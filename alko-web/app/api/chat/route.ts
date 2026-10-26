import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { AI_CONFIG } from "@/lib/ai/config";
import { AI_LIMITS, AI_MESSAGES } from "@/lib/ai/limits";
import { checkRateLimit } from "@/lib/ai/rate-limit";

export const runtime = "nodejs";

type ChatRole = "user" | "assistant";
interface ChatMessage {
  role: ChatRole;
  content: string;
}

/**
 * Respuesta siempre con `content`: el widget la muestra como un mensaje más. Los textos
 * son los de AI_MESSAGES; los detalles de un fallo se registran en el servidor, nunca
 * se devuelven al visitante.
 */
function reply(content: string, status = 200, headers?: Record<string, string>) {
  return NextResponse.json({ content }, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

/** IP del visitante. Tras Cloudflare/Render, `cf-connecting-ip` no se puede falsificar. */
function clientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "desconocida"
  );
}

/** Rechaza peticiones desde otros sitios web (los navegadores envían `Origin`). */
function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // sin Origin (curl, servidores): lo frena el límite por IP
  try {
    const host = new URL(origin).host;
    const own = [req.headers.get("host"), req.headers.get("x-forwarded-host")];
    return own.some((value) => value && value.split(",")[0].trim() === host);
  } catch {
    return false;
  }
}

/** Valida y normaliza el historial; devuelve null si algo no es válido. */
function parseMessages(body: unknown): ChatMessage[] | "too_long" | null {
  const raw = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > AI_LIMITS.maxMessagesAccepted) return null;

  const messages: ChatMessage[] = [];
  for (const item of raw) {
    const { role, content } = (item ?? {}) as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim();
    if (!text) return null;

    if (role === "user") {
      if (text.length > AI_LIMITS.maxMessageChars) return "too_long";
      messages.push({ role, content: text });
    } else {
      // Las respuestas del asistente vuelven en el historial: se recortan en lugar de rechazarse.
      messages.push({ role, content: text.slice(0, AI_LIMITS.maxAssistantChars) });
    }
  }

  // Debe terminar con una pregunta del usuario.
  if (messages[messages.length - 1].role !== "user") return null;
  return messages.slice(-AI_LIMITS.maxMessages);
}

let warnedMissingKey = false;

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return reply(AI_MESSAGES.invalid, 403);

  // 1. Límite de peticiones por IP (y tope diario global).
  const rate = checkRateLimit(clientIp(req), {
    limit: AI_LIMITS.perIpRequests,
    windowMs: AI_LIMITS.perIpWindowMs,
    dailyLimit: AI_LIMITS.dailyRequests,
  });
  if (!rate.ok) return reply(AI_MESSAGES.tooMany, 429, { "Retry-After": String(rate.retryAfter) });

  // 2. Tamaño del cuerpo.
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > AI_LIMITS.maxBodyBytes) return reply(AI_MESSAGES.tooLong, 413);
  let text: string;
  try {
    text = await req.text();
  } catch {
    return reply(AI_MESSAGES.invalid, 400);
  }
  if (Buffer.byteLength(text) > AI_LIMITS.maxBodyBytes) return reply(AI_MESSAGES.tooLong, 413);

  // 3. Formato, número y longitud de los mensajes.
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return reply(AI_MESSAGES.invalid, 400);
  }
  const messages = parseMessages(body);
  if (messages === "too_long") return reply(AI_MESSAGES.tooLong, 413);
  if (!messages) return reply(AI_MESSAGES.invalid, 400);

  // 4. Sin clave de OpenAI: aviso amable al visitante y el detalle solo en el log.
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    if (!warnedMissingKey) {
      warnedMissingKey = true;
      console.warn("[chat] Falta OPENAI_API_KEY: el asistente responde con el aviso de no disponible.");
    }
    return reply(AI_MESSAGES.unavailable, 503);
  }

  try {
    const openai = new OpenAI({ apiKey, timeout: AI_LIMITS.openaiTimeoutMs, maxRetries: 1 });
    const response = await openai.chat.completions.create({
      model: AI_CONFIG.defaultModel,
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
      messages: [{ role: "system", content: AI_CONFIG.systemPrompt }, ...messages],
    });

    const content = response.choices[0]?.message?.content?.trim();
    return reply(content || AI_MESSAGES.failed, content ? 200 : 502);
  } catch (error: unknown) {
    const { status, code } = (error ?? {}) as { status?: number; code?: string };
    // Solo estado y código: el mensaje de OpenAI puede incluir un fragmento de la clave.
    console.error("[chat] Error al llamar a OpenAI:", { status, code, tipo: (error as Error)?.name });
    // Clave rechazada o sin permisos: para el visitante, el asistente no está disponible.
    if (status === 401 || status === 403) return reply(AI_MESSAGES.unavailable, 503);
    return reply(AI_MESSAGES.failed, 502);
  }
}
