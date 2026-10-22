import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { AI_CONFIG } from "@/lib/ai/config";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "El array de mensajes es requerido." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Si aún no se ha configurado la API Key, devolvemos una respuesta guiada sin romper la experiencia
    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json({
        content:
          "Hola. Para conectar este asistente en tiempo real con OpenAI, por favor añade tu variable `OPENAI_API_KEY` en el archivo `.env.local` de `alko-web`. Mientras tanto, puedes explorar nuestros proyectos en la web o contactarnos directamente por WhatsApp.",
      });
    }

    const openai = new OpenAI({ apiKey });

    // Preparamos los mensajes inyectando el system prompt de ALKO
    const conversationMessages = [
      { role: "system" as const, content: AI_CONFIG.systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: m.content,
      })),
    ];

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.defaultModel,
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
      messages: conversationMessages,
    });

    const reply =
      response.choices[0]?.message?.content ||
      "Disculpa, no pude procesar la respuesta en este momento. Por favor contáctanos por WhatsApp o formulario.";

    return NextResponse.json({ content: reply });
  } catch (error: unknown) {
    console.error("Error en /api/chat:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido al procesar la solicitud.";

    return NextResponse.json(
      {
        error: "Error interno al conectar con OpenAI.",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
