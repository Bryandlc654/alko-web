import { NextRequest, NextResponse } from "next/server";
import {
  CONTACT_LIMITS,
  CONTACT_MESSAGES,
  FECHAS,
  PRESUPUESTOS,
  SITUACIONES,
  cleanSurface,
  contactKind,
} from "@/lib/contact/config";
import { clientIp, isSameOrigin } from "@/lib/http";
import { createRateLimiter } from "@/lib/rate-limit";
import { WP_API_URL } from "@/lib/wordpress/client";

export const runtime = "nodejs";

const checkRateLimit = createRateLimiter();

/** Formularios de Fluent Forms en WordPress (Fluent Forms › Todos los formularios). */
const FORM_RAPIDO = Number(process.env.FLUENTFORM_QUICK_ID) || 3;
const FORM_PROYECTO = Number(process.env.FLUENTFORM_PROJECT_ID) || 4;

/**
 * Respuesta con `error` (texto amable) o `ok`. Los detalles de un fallo se registran en el
 * servidor, nunca se devuelven al visitante.
 */
function fail(error: string, status: number, headers?: Record<string, string>) {
  return NextResponse.json({ ok: false, error }, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

const text = (data: FormData, name: string, max: number) =>
  String(data.get(name) ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

/** Opción de una lista cerrada; vacío si no coincide (no se fía del cliente). */
const option = (value: string, allowed: readonly string[]) => (allowed.includes(value) ? value : "");

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return fail(CONTACT_MESSAGES.invalid, 403);

  // 1. Límite de peticiones por IP (y tope diario global).
  const rate = checkRateLimit(clientIp(req), {
    limit: CONTACT_LIMITS.perIpRequests,
    windowMs: CONTACT_LIMITS.perIpWindowMs,
    dailyLimit: CONTACT_LIMITS.dailyRequests,
  });
  if (!rate.ok) return fail(CONTACT_MESSAGES.tooMany, 429, { "Retry-After": String(rate.retryAfter) });

  // 2. Tamaño del cuerpo y lectura del formulario.
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > 64 * 1024) return fail(CONTACT_MESSAGES.tooBig, 413);
  let data: FormData;
  try {
    data = await req.formData();
  } catch {
    return fail(CONTACT_MESSAGES.invalid, 400);
  }

  // 3. Campo trampa: los bots lo rellenan, las personas no lo ven. Se simula éxito sin enviar.
  if (String(data.get("website") ?? "").trim()) return NextResponse.json({ ok: true });

  // 4. Qué formulario es: el rápido (nombre, correo y teléfono) o el completo del proyecto.
  const rapido = String(data.get("modo") ?? "") === "rapido";
  // Qué botón y qué página lo abrieron (para saber qué llamadas a la acción convierten).
  const origen = text(data, "origen", CONTACT_LIMITS.maxOrigen);
  const nombre = text(data, "nombre", CONTACT_LIMITS.maxNombre);

  let formId: number;
  let fields: Record<string, string>;

  if (rapido) {
    const email = text(data, "email", CONTACT_LIMITS.maxEmail);
    const telefono = text(data, "telefono", CONTACT_LIMITS.maxTelefono);
    // Nombre y, al menos, un medio de contacto válido.
    const emailOk = !email || contactKind(email) === "email";
    const telefonoOk = !telefono || contactKind(telefono) === "phone";
    if (!nombre || (!email && !telefono) || !emailOk || !telefonoOk) return fail(CONTACT_MESSAGES.invalid, 400);

    formId = FORM_RAPIDO;
    fields = { nombre, email, telefono, origen };
  } else {
    const tipo = text(data, "tipo", CONTACT_LIMITS.maxTipo);
    const ubicacion = text(data, "ubicacion", CONTACT_LIMITS.maxUbicacion);
    const superficie = cleanSurface(text(data, "superficie", CONTACT_LIMITS.maxSuperficie));
    const contacto = text(data, "contacto", CONTACT_LIMITS.maxContacto);
    const situacion = option(text(data, "situacion", 80), SITUACIONES);
    const fecha = option(text(data, "fecha", 80), FECHAS);
    const presupuesto = option(text(data, "presupuesto", 80), PRESUPUESTOS);

    if (!tipo || !nombre || !contactKind(contacto)) return fail(CONTACT_MESSAGES.invalid, 400);

    formId = FORM_PROYECTO;
    fields = {
      tipo,
      ubicacion,
      superficie: superficie ? `${superficie} m²` : "",
      situacion,
      fecha,
      presupuesto,
      nombre,
      contacto,
      planos: "",
      origen,
    };
  }

  // 5. Sin WordPress configurado: aviso amable y el detalle solo en el log.
  if (!WP_API_URL) {
    console.warn("[contacto] Falta WP_API_URL: no se puede enviar a Fluent Forms.");
    return fail(CONTACT_MESSAGES.unavailable, 503);
  }

  // 6. Envío a Fluent Forms (la entrada queda en WordPress y Fluent Forms avisa por correo).
  const body = new URLSearchParams({
    action: "fluentform_submit",
    form_id: String(formId),
    data: new URLSearchParams(fields).toString(),
  });
  try {
    const res = await fetch(`${WP_API_URL}/wp-admin/admin-ajax.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const json = (await res.json().catch(() => null)) as { success?: boolean } | null;
    if (!res.ok || json?.success !== true) {
      console.error("[contacto] Fluent Forms no aceptó el envío:", { status: res.status, formId });
      return fail(CONTACT_MESSAGES.failed, 502);
    }
  } catch (error: unknown) {
    console.error("[contacto] No se pudo contactar con WordPress:", { tipo: (error as Error)?.name, formId });
    return fail(CONTACT_MESSAGES.failed, 502);
  }

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
