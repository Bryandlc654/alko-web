/**
 * Formulario «Cuéntanos tu proyecto»: opciones, límites y validaciones.
 * Sin secretos: lo importan tanto la ruta /api/contacto (servidor) como el formulario (navegador).
 */

/** Campos que se piden. Solo tipo de proyecto, nombre y contacto son obligatorios. */
export const SITUACIONES = [
  "Espacio vacío",
  "Espacio en uso",
  "Espacio en uso, sin poder parar la actividad",
  "Ya tengo proyecto o planos",
  "Solo es una idea",
] as const;

export const FECHAS = [
  "Lo antes posible",
  "En 1 a 3 meses",
  "En 3 a 6 meses",
  "Dentro de más de 6 meses",
  "Aún sin fecha",
] as const;

export const PRESUPUESTOS = [
  "Menos de 30.000 €",
  "De 30.000 a 80.000 €",
  "De 80.000 a 150.000 €",
  "Más de 150.000 €",
  "Prefiero que me orienten",
] as const;

export const CONTACT_LIMITS = {
  /** Planos y documentación adjunta. */
  maxFiles: 5,
  maxFileBytes: 8 * 1024 * 1024,
  maxTotalBytes: 15 * 1024 * 1024,
  allowedExtensions: ["pdf", "jpg", "jpeg", "png", "webp", "dwg", "dxf"],
  /** Longitud máxima de cada campo de texto. */
  maxTipo: 80,
  maxUbicacion: 120,
  maxSuperficie: 20,
  maxNombre: 100,
  maxContacto: 120,
  maxEmail: 120,
  maxTelefono: 30,
  /** Qué botón y qué página abrieron el formulario. */
  maxOrigen: 120,
  /** Peticiones por IP en cada ventana, y tope diario global (por instancia). */
  perIpRequests: 5,
  perIpWindowMs: 30 * 60 * 1000,
  dailyRequests: 100,
} as const;

/** Textos que ve el visitante. Nunca incluyen detalles internos ni nombres de variables. */
export const CONTACT_MESSAGES = {
  unavailable:
    "El envío no está disponible ahora mismo. Escríbenos por WhatsApp o por correo y te atendemos igualmente.",
  failed:
    "No hemos podido enviar tu proyecto. Inténtalo de nuevo en unos minutos o escríbenos por WhatsApp o por correo.",
  tooMany: "Has enviado varias solicitudes seguidas. Espera unos minutos antes de volver a intentarlo.",
  invalid: "Revisa los datos: falta algún campo obligatorio o alguno no es válido.",
  tooBig: "Los archivos adjuntos superan el tamaño permitido.",
  tooManyFiles: `Puedes adjuntar hasta ${CONTACT_LIMITS.maxFiles} archivos.`,
} as const;

/** Deja solo la cifra de la superficie: «120 m2», «120 m²» o «120,5 metros» pasan a «120» o «120,5». */
export function cleanSurface(value: string): string {
  return value
    .replace(/m\s*[²2](?!\d)/gi, "") // «m2» / «m²» (el «2» de «m2» no es una cifra)
    .replace(/[^\d.,\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

export function fileExtension(name: string): string {
  const match = /\.([A-Za-z0-9]{1,8})$/.exec(name.trim());
  return match ? match[1].toLowerCase() : "";
}

/** Un único campo para teléfono o email: vale cualquiera de los dos. */
export function contactKind(value: string): "email" | "phone" | null {
  const text = value.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text)) return "email";
  const digits = text.replace(/\D/g, "");
  if (/^[+\d][\d\s().-]*$/.test(text) && digits.length >= 9 && digits.length <= 15) return "phone";
  return null;
}

/** Comprueba un archivo adjunto; devuelve el motivo del rechazo o null si vale. */
export function fileProblem(name: string, size: number): string | null {
  const extension = fileExtension(name);
  if (!(CONTACT_LIMITS.allowedExtensions as readonly string[]).includes(extension)) {
    return `«${name}» no es un formato admitido (PDF, JPG, PNG, WEBP, DWG o DXF).`;
  }
  if (size <= 0) return `«${name}» está vacío.`;
  if (size > CONTACT_LIMITS.maxFileBytes) {
    return `«${name}» pesa más de ${formatBytes(CONTACT_LIMITS.maxFileBytes)}.`;
  }
  return null;
}
