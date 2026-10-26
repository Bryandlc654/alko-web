import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  CONTACT_LIMITS,
  CONTACT_MESSAGES,
  FECHAS,
  PRESUPUESTOS,
  SITUACIONES,
  cleanSurface,
  contactKind,
  fileExtension,
  fileProblem,
  formatBytes,
} from "@/lib/contact/config";
import { clientIp, isSameOrigin } from "@/lib/http";
import { createRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";

const checkRateLimit = createRateLimiter();
let warnedMissingConfig = false;

/**
 * Respuesta con `error` (texto amable) o `ok`. Los detalles de un fallo se registran en el
 * servidor, nunca se devuelven al visitante.
 */
function fail(error: string, status: number, headers?: Record<string, string>) {
  return NextResponse.json({ ok: false, error }, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

/** Configuración del correo saliente (variables de entorno); null si falta algo. */
function mailConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (!host || !user || !pass || !to) return null;
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || user;
  return { host, port, secure, user, pass, to, from };
}

const text = (data: FormData, name: string, max: number) =>
  String(data.get(name) ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

/** Opción de una lista cerrada; vacío si no coincide (no se fía del cliente). */
const option = (value: string, allowed: readonly string[]) => (allowed.includes(value) ? value : "");

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

/** Nombre de archivo seguro para el adjunto. */
function safeName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "adjunto";
  return base.replace(/[^\w.\- ()áéíóúüñÁÉÍÓÚÜÑ]/g, "_").slice(0, 100) || "adjunto";
}

/** Comprueba que el contenido corresponde a la extensión (evita archivos disfrazados). */
function matchesType(buffer: Buffer, extension: string): boolean {
  const startsWith = (bytes: number[], offset = 0) => bytes.every((b, i) => buffer[offset + i] === b);
  switch (extension) {
    case "pdf":
      return startsWith([0x25, 0x50, 0x44, 0x46]); // %PDF
    case "png":
      return startsWith([0x89, 0x50, 0x4e, 0x47]);
    case "jpg":
    case "jpeg":
      return startsWith([0xff, 0xd8, 0xff]);
    case "webp":
      return startsWith([0x52, 0x49, 0x46, 0x46]) && startsWith([0x57, 0x45, 0x42, 0x50], 8); // RIFF....WEBP
    case "dwg":
      return startsWith([0x41, 0x43]); // «AC» + versión
    default:
      return true; // dxf es texto
  }
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return fail(CONTACT_MESSAGES.invalid, 403);

  // 1. Límite de peticiones por IP (y tope diario global).
  const rate = checkRateLimit(clientIp(req), {
    limit: CONTACT_LIMITS.perIpRequests,
    windowMs: CONTACT_LIMITS.perIpWindowMs,
    dailyLimit: CONTACT_LIMITS.dailyRequests,
  });
  if (!rate.ok) return fail(CONTACT_MESSAGES.tooMany, 429, { "Retry-After": String(rate.retryAfter) });

  // 2. Tamaño del cuerpo (los adjuntos van dentro) y lectura del formulario.
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > CONTACT_LIMITS.maxTotalBytes + 512 * 1024) return fail(CONTACT_MESSAGES.tooBig, 413);
  let data: FormData;
  try {
    data = await req.formData();
  } catch {
    return fail(CONTACT_MESSAGES.invalid, 400);
  }

  // 3. Campo trampa: los bots lo rellenan, las personas no lo ven. Se simula éxito sin enviar.
  if (String(data.get("website") ?? "").trim()) return NextResponse.json({ ok: true });

  // 4. Campos de texto.
  const tipo = text(data, "tipo", CONTACT_LIMITS.maxTipo);
  const ubicacion = text(data, "ubicacion", CONTACT_LIMITS.maxUbicacion);
  const superficie = cleanSurface(text(data, "superficie", CONTACT_LIMITS.maxSuperficie));
  const nombre = text(data, "nombre", CONTACT_LIMITS.maxNombre);
  const contacto = text(data, "contacto", CONTACT_LIMITS.maxContacto);
  const situacion = option(text(data, "situacion", 80), SITUACIONES);
  const fecha = option(text(data, "fecha", 80), FECHAS);
  const presupuesto = option(text(data, "presupuesto", 80), PRESUPUESTOS);

  const kind = contactKind(contacto);
  if (!tipo || !nombre || !kind) return fail(CONTACT_MESSAGES.invalid, 400);

  // 5. Archivos adjuntos (planos y documentación).
  const files = data.getAll("planos").filter((item): item is File => typeof item !== "string" && item.size > 0);
  if (files.length > CONTACT_LIMITS.maxFiles) return fail(CONTACT_MESSAGES.tooManyFiles, 400);
  let total = 0;
  const attachments: { filename: string; content: Buffer; contentType?: string }[] = [];
  for (const file of files) {
    const problem = fileProblem(file.name, file.size);
    if (problem) return fail(problem, problem.includes("pesa más") ? 413 : 400);
    total += file.size;
    if (total > CONTACT_LIMITS.maxTotalBytes) return fail(CONTACT_MESSAGES.tooBig, 413);
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!matchesType(buffer, fileExtension(file.name))) {
      return fail(`«${file.name}» no parece un archivo ${fileExtension(file.name).toUpperCase()} válido.`, 400);
    }
    attachments.push({ filename: safeName(file.name), content: buffer, contentType: file.type || undefined });
  }

  // 6. Sin correo configurado: aviso amable al visitante y el detalle solo en el log.
  const config = mailConfig();
  if (!config) {
    if (!warnedMissingConfig) {
      warnedMissingConfig = true;
      console.warn("[contacto] Falta la configuración de correo (SMTP_HOST, SMTP_USER, SMTP_PASS y CONTACT_TO_EMAIL).");
    }
    return fail(CONTACT_MESSAGES.unavailable, 503);
  }

  // 7. Envío.
  const rows: [string, string][] = [
    ["Tipo de proyecto", tipo],
    ["Ubicación", ubicacion],
    ["Superficie", superficie ? `${superficie} m²` : ""],
    ["Situación actual", situacion],
    ["Fecha prevista", fecha],
    ["Presupuesto aproximado", presupuesto],
    ["Nombre / empresa", nombre],
    [kind === "email" ? "Email" : "Teléfono", contacto],
    [
      "Planos adjuntos",
      attachments.length
        ? attachments.map((a) => `${a.filename} (${formatBytes(a.content.length)})`).join(", ")
        : "",
    ],
  ];
  const filled = rows.map(([label, value]) => [label, value || "—"] as const);

  const html =
    `<h2 style="font-family:Arial,sans-serif;font-weight:normal">Nuevo proyecto desde la web</h2>` +
    `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">` +
    filled
      .map(
        ([label, value]) =>
          `<tr><td style="padding:6px 16px 6px 0;color:#545454;vertical-align:top">${escapeHtml(label)}</td>` +
          `<td style="padding:6px 0">${escapeHtml(value)}</td></tr>`,
      )
      .join("") +
    `</table>`;
  const plain = ["Nuevo proyecto desde la web", "", ...filled.map(([label, value]) => `${label}: ${value}`)].join("\n");

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
      connectionTimeout: 10_000,
      socketTimeout: 30_000,
    });
    await transporter.sendMail({
      from: `"Web ALKO" <${config.from}>`,
      to: config.to,
      replyTo: kind === "email" ? contacto : undefined,
      subject: `Nuevo proyecto: ${tipo} — ${nombre}`.replace(/[\r\n]+/g, " ").slice(0, 200),
      text: plain,
      html,
      attachments,
    });
  } catch (error: unknown) {
    // Solo código y tipo: el mensaje de un servidor de correo puede incluir datos de la cuenta.
    const { code, responseCode } = (error ?? {}) as { code?: string; responseCode?: number };
    console.error("[contacto] Error al enviar el correo:", { code, responseCode, tipo: (error as Error)?.name });
    return fail(CONTACT_MESSAGES.failed, 502);
  }

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
