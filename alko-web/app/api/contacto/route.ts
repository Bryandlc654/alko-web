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
import { saveDbLead } from "@/lib/db/mysql";
import { sendLeadNotificationEmail } from "@/lib/email/mailer";

export const runtime = "nodejs";

const checkRateLimit = createRateLimiter();

/** Formularios de Fluent Forms en WordPress (Fluent Forms › Todos los formularios). */
const FORM_RAPIDO = Number(process.env.FLUENTFORM_QUICK_ID) || 3;
const FORM_PROYECTO = Number(process.env.FLUENTFORM_PROJECT_ID) || 4;

function fail(error: string, status: number, headers?: Record<string, string>) {
  return NextResponse.json(
    { ok: false, error },
    { status, headers: { "Cache-Control": "no-store", ...headers } }
  );
}

const text = (data: FormData, name: string, max: number) =>
  String(data.get(name) ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

const option = (value: string, allowed: readonly string[]) =>
  allowed.includes(value) ? value : "";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return fail(CONTACT_MESSAGES.invalid, 403);

  // 1. Límite de peticiones por IP
  const rate = checkRateLimit(clientIp(req), {
    limit: CONTACT_LIMITS.perIpRequests,
    windowMs: CONTACT_LIMITS.perIpWindowMs,
    dailyLimit: CONTACT_LIMITS.dailyRequests,
  });
  if (!rate.ok)
    return fail(CONTACT_MESSAGES.tooMany, 429, { "Retry-After": String(rate.retryAfter) });

  // 2. Tamaño del cuerpo y lectura del formulario
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > 64 * 1024) return fail(CONTACT_MESSAGES.tooBig, 413);

  let data: FormData;
  try {
    data = await req.formData();
  } catch {
    return fail(CONTACT_MESSAGES.invalid, 400);
  }

  // 3. Campo trampa anti-spam
  if (String(data.get("website") ?? "").trim()) return NextResponse.json({ ok: true });

  // 4. Procesar formulario rápido o completo
  const rapido = String(data.get("modo") ?? "") === "rapido";
  const origen = text(data, "origen", CONTACT_LIMITS.maxOrigen) || "Web ALKO";
  const nombre = text(data, "nombre", CONTACT_LIMITS.maxNombre);

  let formId: number;
  let fields: Record<string, string>;
  let savedLead: any = null;

  if (rapido) {
    const email = text(data, "email", CONTACT_LIMITS.maxEmail);
    const telefono = text(data, "telefono", CONTACT_LIMITS.maxTelefono);
    const emailOk = !email || contactKind(email) === "email";
    const telefonoOk = !telefono || contactKind(telefono) === "phone";

    if (!nombre || (!email && !telefono) || !emailOk || !telefonoOk) {
      return fail(CONTACT_MESSAGES.invalid, 400);
    }

    formId = FORM_RAPIDO;
    fields = { nombre, email, telefono, origen };

    // GUARDAR EN BASE DE DATOS CRM
    try {
      savedLead = await saveDbLead({
        tipoFormulario: "rapido",
        nombre,
        email: email || undefined,
        telefono: telefono || undefined,
        origen,
        estado: "nuevo",
      });
    } catch (dbErr) {
      console.warn("Aviso al guardar lead en base de datos:", dbErr);
    }
  } else {
    const tipo = text(data, "tipo", CONTACT_LIMITS.maxTipo);
    const ubicacion = text(data, "ubicacion", CONTACT_LIMITS.maxUbicacion);
    const superficie = cleanSurface(text(data, "superficie", CONTACT_LIMITS.maxSuperficie));
    const contacto = text(data, "contacto", CONTACT_LIMITS.maxContacto);
    const situacion = option(text(data, "situacion", 80), SITUACIONES);
    const fecha = option(text(data, "fecha", 80), FECHAS);
    const presupuesto = option(text(data, "presupuesto", 80), PRESUPUESTOS);
    const mensaje = text(data, "mensaje", 2000) || text(data, "detalles", 2000);

    if (!tipo || !nombre || !contactKind(contacto)) {
      return fail(CONTACT_MESSAGES.invalid, 400);
    }

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

    // GUARDAR EN BASE DE DATOS CRM
    try {
      const isEmail = contactKind(contacto) === "email";
      const isPhone = contactKind(contacto) === "phone";

      savedLead = await saveDbLead({
        tipoFormulario: "presupuesto",
        nombre,
        contacto,
        email: isEmail ? contacto : undefined,
        telefono: isPhone ? contacto : undefined,
        tipo,
        ubicacion: ubicacion || undefined,
        superficie: superficie ? `${superficie} m²` : undefined,
        situacion: situacion || undefined,
        fecha: fecha || undefined,
        presupuesto: presupuesto || undefined,
        mensaje: mensaje || undefined,
        origen,
        estado: "nuevo",
      });
    } catch (dbErr) {
      console.warn("Aviso al guardar lead en base de datos:", dbErr);
    }
  }

  // 5. Enviar notificación por correo SMTP (si está configurado)
  if (savedLead) {
    sendLeadNotificationEmail(savedLead).catch((smtpErr) => {
      console.warn("[SMTP] Error al enviar correo de notificación:", smtpErr);
    });
  }

  // 6. Envío opcional a Fluent Forms de WordPress si está disponible
  if (WP_API_URL) {
    const body = new URLSearchParams({
      action: "fluentform_submit",
      form_id: String(formId),
      data: new URLSearchParams(fields).toString(),
    });

    fetch(`${WP_API_URL}/wp-admin/admin-ajax.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    }).catch((wpErr) => {
      console.warn("[WP FluentForms] Aviso al enviar a WordPress:", wpErr);
    });
  }

  return NextResponse.json(
    { ok: true, leadId: savedLead?.id },
    { headers: { "Cache-Control": "no-store" } }
  );
}
