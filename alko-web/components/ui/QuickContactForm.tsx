"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { CONTACT_LIMITS, CONTACT_MESSAGES, contactKind } from "@/lib/contact/config";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"nombre" | "email" | "telefono" | "contacto", string>>;

/**
 * Formulario rápido: nombre, correo y teléfono (pensado para ir sobre fondo oscuro).
 *
 * Es el que se abre desde las llamadas a la acción de conversación («Contactar», «Solicitar
 * consultoría»). Solo es obligatorio el nombre y un medio de contacto: con el correo o el teléfono
 * nos basta. Se envía a /api/contacto con `modo=rapido`.
 */
export default function QuickContactForm({
  source,
  email,
  whatsappHref,
  onClose,
  onSent,
}: {
  /** Qué botón y qué página lo abrieron; llega en el campo «Origen» del correo. */
  source?: string;
  email: string;
  whatsappHref: string;
  /** Si va dentro de un modal, el botón «Cerrar» de la confirmación. */
  onClose?: () => void;
  /** Se llama cuando el envío termina bien (el modal oculta entonces el enlace al otro formulario). */
  onSent?: () => void;
}) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const confirmRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [sent, setSent] = useState<{ nombre: string; via: string } | null>(null);

  useEffect(() => {
    if (status === "sent") confirmRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? "").trim();

    // Validación en el navegador (el servidor vuelve a comprobarlo todo).
    const found: Errors = {};
    if (!value("nombre")) found.nombre = "Dinos tu nombre.";
    if (!value("email") && !value("telefono")) found.contacto = "Déjanos un correo o un teléfono para poder contestarte.";
    if (value("email") && contactKind(value("email")) !== "email") found.email = "Este correo no parece válido.";
    if (value("telefono") && contactKind(value("telefono")) !== "phone") found.telefono = "Este teléfono no parece válido.";
    setErrors(found);
    const first = (["nombre", "email", "telefono"] as const).find((key) => found[key] || (found.contacto && key === "email"));
    if (Object.keys(found).length > 0) {
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const body = new FormData();
    for (const [key, val] of data.entries()) if (typeof val === "string") body.append(key, val);
    body.append("modo", "rapido");
    body.append("origen", source ?? "");

    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contacto", { method: "POST", body });
      const json: unknown = await res.json().catch(() => null);
      if (res.ok && (json as { ok?: unknown } | null)?.ok === true) {
        setSent({ nombre: value("nombre"), via: value("email") || value("telefono") });
        setStatus("sent");
        onSent?.();
        form.reset();
        return;
      }
      const message = (json as { error?: unknown } | null)?.error;
      setServerError(typeof message === "string" && message ? message : CONTACT_MESSAGES.failed);
    } catch {
      setServerError(CONTACT_MESSAGES.failed); // sin conexión
    }
    setStatus("error");
  }

  const label = "block font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-white/50 mb-1";
  const input =
    "w-full border-0 border-b border-white/25 bg-transparent px-0 py-3 text-lg text-white font-light placeholder:text-white/30 focus:border-amber-700 focus:outline-none focus:ring-0 transition-colors aria-[invalid=true]:border-amber-500";
  const error = "mt-2 text-sm text-amber-500";

  // --- Confirmación ---------------------------------------------------------------------------
  if (status === "sent" && sent) {
    return (
      <div ref={confirmRef} tabIndex={-1} role="status" aria-live="polite" className="py-2 outline-none">
        <CheckCircle2 className="h-12 w-12 text-amber-500" strokeWidth={1.25} aria-hidden="true" />
        <h3 className="mt-6 font-serif font-light text-3xl leading-tight tracking-tight">Hemos recibido tus datos</h3>
        <p className="mt-4 text-lg font-light leading-relaxed text-white/70">
          Gracias, {sent.nombre}. Una persona del equipo se pondrá en contacto contigo en{" "}
          <span className="text-white">{sent.via}</span>.
        </p>
        <button
          type="button"
          onClick={onClose ?? (() => setStatus("idle"))}
          className="mt-10 inline-flex items-center gap-2 border-b border-white pb-1 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:border-amber-500 hover:text-amber-500"
        >
          {onClose ? "Cerrar" : "Enviar otra solicitud"}
        </button>
      </div>
    );
  }

  // --- Formulario -----------------------------------------------------------------------------
  const sending = status === "sending";
  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={sending}>
      <p className="mb-8 text-sm font-light leading-relaxed text-white/60">
        Solo necesitamos tu nombre y un correo o un teléfono. Te contestará una persona del equipo técnico.
      </p>

      {/* Campo trampa para bots: las personas no lo ven */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          No rellenar
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-y-7">
        <div>
          <label htmlFor={id("nombre")} className={label}>
            Nombre *
          </label>
          <input
            id={id("nombre")}
            name="nombre"
            data-autofocus=""
            required
            maxLength={CONTACT_LIMITS.maxNombre}
            autoComplete="name"
            aria-invalid={errors.nombre ? true : undefined}
            aria-describedby={errors.nombre ? id("nombre-error") : undefined}
            onChange={() => errors.nombre && setErrors((prev) => ({ ...prev, nombre: undefined }))}
            className={input}
            placeholder="Tu nombre o el de tu empresa"
          />
          {errors.nombre && (
            <p id={id("nombre-error")} role="alert" className={error}>
              {errors.nombre}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={id("email")} className={label}>
            Correo electrónico
          </label>
          <input
            id={id("email")}
            name="email"
            type="email"
            inputMode="email"
            maxLength={CONTACT_LIMITS.maxEmail}
            autoComplete="email"
            aria-invalid={errors.email || errors.contacto ? true : undefined}
            aria-describedby={errors.email ? id("email-error") : errors.contacto ? id("contacto-error") : undefined}
            onChange={() => setErrors((prev) => ({ ...prev, email: undefined, contacto: undefined }))}
            className={input}
            placeholder="tu@email.com"
          />
          {errors.email && (
            <p id={id("email-error")} role="alert" className={error}>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={id("telefono")} className={label}>
            Teléfono
          </label>
          <input
            id={id("telefono")}
            name="telefono"
            type="tel"
            inputMode="tel"
            maxLength={CONTACT_LIMITS.maxTelefono}
            autoComplete="tel"
            aria-invalid={errors.telefono || errors.contacto ? true : undefined}
            aria-describedby={errors.telefono ? id("telefono-error") : errors.contacto ? id("contacto-error") : undefined}
            onChange={() => setErrors((prev) => ({ ...prev, telefono: undefined, contacto: undefined }))}
            className={input}
            placeholder="600 000 000"
          />
          {errors.telefono && (
            <p id={id("telefono-error")} role="alert" className={error}>
              {errors.telefono}
            </p>
          )}
          {errors.contacto ? (
            <p id={id("contacto-error")} role="alert" className={error}>
              {errors.contacto}
            </p>
          ) : (
            <p className="mt-2 text-sm font-light text-white/50">Con uno de los dos nos basta.</p>
          )}
        </div>
      </div>

      {status === "error" && (
        <div role="alert" className="mt-8 border-l-2 border-amber-500 pl-4 text-sm font-light leading-relaxed text-white/80">
          <p>{serverError}</p>
          <p className="mt-2">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4">
              WhatsApp
            </a>
            {" · "}
            <a href={`mailto:${email}`} className="text-white underline underline-offset-4">
              {email}
            </a>
          </p>
        </div>
      )}

      <div className="mt-10 flex flex-col justify-between gap-6 border-t border-white/15 pt-8 sm:flex-row sm:items-center">
        <p className="max-w-xs text-sm font-light leading-relaxed text-white/50">
          Usaremos tus datos solo para responder a tu consulta.
        </p>
        <button
          type="submit"
          disabled={sending}
          className="group/btn inline-flex w-full shrink-0 items-center justify-center gap-3 rounded-full bg-amber-700 px-9 py-4 text-xs font-semibold uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:bg-white hover:text-stone-900 active:scale-95 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Enviando…
            </>
          ) : (
            <>
              Enviar
              <span aria-hidden="true" className="transition-transform group-hover/btn:translate-x-1">
                →
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
