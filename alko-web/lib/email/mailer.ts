import nodemailer from "nodemailer";
import { getDbSettingsFull } from "@/lib/db/mysql";
import type { Lead, SmtpConfig } from "@/lib/types";

/**
 * Crea un transporte de Nodemailer basado en la configuración provista o guardada en la base de datos.
 */
function createTransport(config: SmtpConfig) {
  const isSecure = config.secure ?? (Number(config.port) === 465);

  return nodemailer.createTransport({
    host: config.host || "smtp.hostinger.com",
    port: Number(config.port) || 465,
    secure: isSecure,
    auth: {
      user: config.user || "",
      pass: config.password || "",
    },
    tls: {
      rejectUnauthorized: false, // Permite compatibilidad con certificados autofirmados o de hosting
    },
  });
}

/**
 * Verifica la conexión con el servidor SMTP con los datos provistos.
 */
export async function verifySmtpConnection(config: SmtpConfig): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!config.host || !config.user || !config.password) {
      return { ok: false, error: "Faltan credenciales SMTP (servidor, usuario o contraseña)" };
    }

    const transport = createTransport(config);
    await transport.verify();
    return { ok: true };
  } catch (err: any) {
    console.error("Error verificando conexión SMTP:", err);
    return { ok: false, error: err.message || "No se pudo conectar al servidor SMTP" };
  }
}

/**
 * Envía una notificación por correo electrónico cuando entra un nuevo lead o presupuesto.
 */
export async function sendLeadNotificationEmail(lead: Lead): Promise<boolean> {
  try {
    const settings = await getDbSettingsFull();
    const smtp = settings.smtp;

    if (!smtp || !smtp.enabled || !smtp.host || !smtp.user) {
      console.log("[SMTP] Envío de notificación desactivado o no configurado.");
      return false;
    }

    const transport = createTransport(smtp);
    const toAddress = smtp.to || settings.email || "info@alkoreformas.com";
    const fromAddress = smtp.from || `"ALKO Web" <${smtp.user}>`;

    const subject = `🚨 Nuevo Lead Web [${lead.tipoFormulario.toUpperCase()}]: ${lead.nombre} - ${lead.tipo || "Reforma"}`;

    const fechaFormateada = new Date(lead.creadoEn).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 32px 16px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <!-- Cabecera -->
          <div style="background-color: #1e293b; padding: 24px 32px; text-align: left;">
            <span style="color: #38bdf8; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">ALKO CRM &middot; Notificación en Directo</span>
            <h1 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 6px 0 0 0;">Nueva Solicitud de Contacto / Presupuesto</h1>
          </div>

          <!-- Cuerpo -->
          <div style="padding: 32px;">
            <p style="color: #475569; font-size: 14px; margin-top: 0; line-height: 1.6;">
              Se ha recibido un nuevo lead a través de la web <strong>ALKO</strong>. A continuación tienes los detalles completos:
            </p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: 600; width: 140px;">Nombre:</td>
                <td style="padding: 10px 0; color: #0f172a; font-weight: 700;">${lead.nombre}</td>
              </tr>
              ${lead.telefono ? `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Teléfono:</td>
                <td style="padding: 10px 0;"><a href="tel:${lead.telefono.replace(/[^+\d]/g, "")}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${lead.telefono}</a></td>
              </tr>` : ""}
              ${lead.email ? `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Email:</td>
                <td style="padding: 10px 0;"><a href="mailto:${lead.email}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${lead.email}</a></td>
              </tr>` : ""}
              ${lead.contacto && !lead.email && !lead.telefono ? `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Contacto:</td>
                <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${lead.contacto}</td>
              </tr>` : ""}
              ${lead.tipo ? `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Tipo de Proyecto:</td>
                <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${lead.tipo}</td>
              </tr>` : ""}
              ${lead.superficie ? `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Superficie:</td>
                <td style="padding: 10px 0; color: #0f172a;">${lead.superficie}</td>
              </tr>` : ""}
              ${lead.ubicacion ? `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Ubicación:</td>
                <td style="padding: 10px 0; color: #0f172a;">${lead.ubicacion}</td>
              </tr>` : ""}
              ${lead.presupuesto ? `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Presupuesto Est.:</td>
                <td style="padding: 10px 0; color: #0f172a; font-weight: 600; color: #059669;">${lead.presupuesto}</td>
              </tr>` : ""}
              ${lead.situacion ? `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Situación:</td>
                <td style="padding: 10px 0; color: #0f172a;">${lead.situacion}</td>
              </tr>` : ""}
              ${lead.fecha ? `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Plazo previsto:</td>
                <td style="padding: 10px 0; color: #0f172a;">${lead.fecha}</td>
              </tr>` : ""}
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Origen:</td>
                <td style="padding: 10px 0; color: #64748b;">${lead.origen || "Formulario Web"}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Fecha de Envío:</td>
                <td style="padding: 10px 0; color: #64748b;">${fechaFormateada}</td>
              </tr>
            </table>

            ${lead.mensaje ? `
            <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin: 20px 0;">
              <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 4px;">Mensaje o Comentarios:</span>
              <p style="margin: 0; color: #334155; font-size: 13px; line-height: 1.5; white-space: pre-line;">${lead.mensaje}</p>
            </div>` : ""}

            <div style="margin-top: 32px; text-align: center;">
              <a href="https://alko.es/admin/leads" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 28px; border-radius: 10px; box-shadow: 0 2px 6px rgba(37,99,235,0.3);">
                Ver y Gestionar en el CRM &rarr;
              </a>
            </div>
          </div>

          <!-- Pie -->
          <div style="background-color: #f1f5f9; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 11px; color: #94a3b8;">
              Este mensaje ha sido enviado automáticamente por el sistema ALKO CRM.
            </p>
          </div>
        </div>
      </div>
    `;

    await transport.sendMail({
      from: fromAddress,
      to: toAddress,
      subject,
      html: htmlBody,
    });

    console.log(`[SMTP] Notificación enviada con éxito a ${toAddress}`);
    return true;
  } catch (err) {
    console.warn("[SMTP] Fallo al enviar notificación por correo:", err);
    return false;
  }
}
