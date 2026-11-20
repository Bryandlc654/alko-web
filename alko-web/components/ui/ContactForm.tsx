"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/site";
import {
  CONTACT_LIMITS,
  FECHAS,
  PRESUPUESTOS,
  SITUACIONES,
  cleanSurface,
  contactKind,
} from "@/lib/contact/config";
import { localizedPath, type Locale } from "@/lib/i18n";
import { CONTACT_COPY } from "@/lib/i18n/contact";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"tipo" | "nombre" | "contacto", string>>;

interface Sent {
  nombre: string;
  contacto: string;
  tipo: string;
  ubicacion: string;
}

/**
 * Formulario «Cuéntanos tu proyecto» (pensado para ir sobre fondo oscuro).
 *
 * Se envía a /api/contacto (que lo guarda en Fluent Forms). Solo son obligatorios el tipo de
 * proyecto, el nombre y un teléfono o email; el resto es opcional.
 */
export default function ContactForm({
  projectTypes,
  email,
  whatsappHref,
  defaultTipo,
  source,
  onClose,
  onSent,
  locale = "es",
}: {
  projectTypes: string[];
  email: string;
  whatsappHref: string;
  /** Tipo de proyecto que se marca de entrada (p. ej. el servicio desde el que se abre). */
  defaultTipo?: string;
  /** Qué botón y qué página lo abrieron; llega en el campo «Origen» del correo. */
  source?: string;
  /** Si va dentro de un modal, el botón «Cerrar» de la confirmación. */
  onClose?: () => void;
  /** Se llama cuando el envío termina bien (el modal oculta entonces el enlace al otro formulario). */
  onSent?: () => void;
  /** Idioma de los textos. Los valores enviados siguen en castellano. */
  locale?: Locale;
}) {
  const copy = CONTACT_COPY[locale];
  const t = copy.full;
  const c = copy.common;
  const optionLabel = (value: string) => copy.options[value] ?? value;
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const formRef = useRef<HTMLFormElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [sent, setSent] = useState<Sent | null>(null);

  // Al enviar, la confirmación recibe el foco y se lleva a la vista.
  useEffect(() => {
    if (status === "sent") {
      confirmRef.current?.focus();
      confirmRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? "").trim();

    // Validación en el navegador (el servidor vuelve a comprobarlo todo).
    const found: Errors = {};
    if (!value("tipo")) found.tipo = t.errTipo;
    if (!value("nombre")) found.nombre = t.errNombre;
    if (!value("contacto")) found.contacto = t.errContacto;
    else if (!contactKind(value("contacto"))) found.contacto = t.errContactoInvalid;
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = (["tipo", "nombre", "contacto"] as const).find((key) => found[key]);
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const body = new FormData();
    for (const [key, val] of data.entries()) if (typeof val === "string") body.append(key, val);
    body.append("origen", source ?? "");

    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contacto", { method: "POST", body });
      const json: unknown = await res.json().catch(() => null);
      const ok = (json as { ok?: unknown } | null)?.ok === true;
      if (res.ok && ok) {
        setSent({
          nombre: value("nombre"),
          contacto: value("contacto"),
          tipo: value("tipo"),
          ubicacion: value("ubicacion"),
        });
        setStatus("sent");
        onSent?.();
        form.reset();
        return;
      }
      const message = (json as { error?: unknown } | null)?.error;
      setServerError(c.useServerMessage && typeof message === "string" && message ? message : c.failed);
    } catch {
      setServerError(c.failed); // sin conexión
    }
    setStatus("error");
  }

  const group = "flex items-center gap-4 mb-8 text-[10px] tracking-[0.22em] uppercase text-white/50";
  const label = "block text-[10px] tracking-[0.22em] uppercase text-white/50 mb-1";
  const input =
    "w-full border-0 border-b border-white/25 bg-transparent px-0 py-3 text-lg text-white font-light placeholder:text-white/30 focus:border-bronze-light focus:outline-none focus:ring-0 transition-colors aria-[invalid=true]:border-bronze-light";
  const hint = "mt-2 text-sm font-light text-white/50";
  const error = "mt-2 text-sm text-bronze-light";

  // --- Confirmación ---------------------------------------------------------------------------
  if (status === "sent" && sent) {
    const resumen: [string, string][] = [
      [t.sentDivision, optionLabel(sent.tipo)],
      [t.sentLocation, sent.ubicacion],
    ];
    return (
      <div
        ref={confirmRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="py-4 outline-none sm:py-8"
      >
        <CheckCircle2 className="h-12 w-12 text-bronze-light" strokeWidth={1.25} aria-hidden="true" />
        <h3 className="display-title mt-6 text-3xl sm:text-4xl leading-tight">
          {t.sentTitle}
        </h3>
        <p className="mt-4 max-w-xl text-lg font-light text-white/70 leading-relaxed">
          {t.sentThanks} {sent.nombre}. {t.sentBody} <span className="text-white">{sent.contacto}</span>.
        </p>

        <dl className="mt-8 max-w-xl border-t border-white/15">
          {resumen
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 border-b border-white/15 py-3">
                <dt className="text-[10px] tracking-[0.22em] uppercase text-white/50">{k}</dt>
                <dd className="text-right font-light text-white">{v}</dd>
              </div>
            ))}
        </dl>

        <button
          type="button"
          onClick={
            onClose ??
            (() => {
              setStatus("idle");
              setSent(null);
            })
          }
          className="mt-10 inline-flex items-center gap-2 border-b border-white pb-1 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:border-bronze-light hover:text-bronze-light"
        >
          {onClose ? c.close : t.sendAnother}
        </button>
      </div>
    );
  }

  // --- Formulario -----------------------------------------------------------------------------
  const sending = status === "sending";
  const select = (name: string, labelText: string, options: readonly string[]) => (
    <div>
      <label htmlFor={id(name)} className={label}>
        {labelText}
      </label>
      <div className="relative">
        <select
          id={id(name)}
          name={name}
          defaultValue=""
          className={`${input} appearance-none pr-8 [&:invalid]:text-white/30`}
        >
          <option value="" className="bg-ink text-white/60">
            {t.notSpecified}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-ink text-white">
              {optionLabel(option)}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
    </div>
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={sending}>
      <p className="mb-10 max-w-xl text-sm font-light leading-relaxed text-white/60">
        {t.intro}
      </p>

      {/* Campo trampa para bots: las personas no lo ven */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          {c.honeypot}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <p className={group}>
        <span className="text-bronze-light">01</span>
        <span>{t.groupProject}</span>
        <span className="h-px flex-1 bg-white/15" />
      </p>
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
        <fieldset
          className="group sm:col-span-2"
          data-invalid={errors.tipo ? "true" : undefined}
          aria-describedby={errors.tipo ? id("tipo-error") : undefined}
        >
          <legend className={`${label} mb-3`}>{t.division}</legend>
          <div className="flex flex-wrap gap-2">
            {projectTypes.map((type) => (
              <label key={type} className="cursor-pointer">
                <input
                  type="radio"
                  name="tipo"
                  value={type}
                  defaultChecked={type === defaultTipo}
                  required
                  onChange={() => setErrors((prev) => ({ ...prev, tipo: undefined }))}
                  className="peer sr-only"
                />
                <span className="inline-flex border border-white/25 px-4 py-2 text-[11px] font-light uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-white hover:text-white peer-checked:border-paper peer-checked:bg-paper peer-checked:text-ink peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink group-data-[invalid=true]:border-bronze-light">
                  {optionLabel(type)}
                </span>
              </label>
            ))}
          </div>
          {errors.tipo && (
            <p id={id("tipo-error")} role="alert" className={error}>
              {errors.tipo}
            </p>
          )}
        </fieldset>

        <div>
          <label htmlFor={id("ubicacion")} className={label}>
            {t.location}
          </label>
          <input
            id={id("ubicacion")}
            name="ubicacion"
            maxLength={CONTACT_LIMITS.maxUbicacion}
            autoComplete="address-level2"
            className={input}
            placeholder={t.locationPlaceholder}
          />
        </div>

        <div>
          <label htmlFor={id("superficie")} className={label}>
            {t.surface}
          </label>
          <div className="relative">
            <input
              id={id("superficie")}
              name="superficie"
              inputMode="decimal"
              maxLength={CONTACT_LIMITS.maxSuperficie}
              onChange={(e) => {
                e.target.value = cleanSurface(e.target.value);
              }}
              className={`${input} pr-10`}
              placeholder={t.surfacePlaceholder}
            />
            <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-white/50">m²</span>
          </div>
        </div>

        {select("situacion", t.situation, SITUACIONES)}
        {select("fecha", t.date, FECHAS)}
        <div className="sm:col-span-2">{select("presupuesto", t.budget, PRESUPUESTOS)}</div>
      </div>

      <p className={`${group} mt-14`}>
        <span className="text-bronze-light">02</span>
        <span>{t.groupDetails}</span>
        <span className="h-px flex-1 bg-white/15" />
      </p>
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
        <div>
          <label htmlFor={id("nombre")} className={label}>
            {t.name}
          </label>
          <input
            id={id("nombre")}
            name="nombre"
            required
            maxLength={CONTACT_LIMITS.maxNombre}
            autoComplete="name"
            aria-invalid={errors.nombre ? true : undefined}
            aria-describedby={errors.nombre ? id("nombre-error") : undefined}
            onChange={() => errors.nombre && setErrors((prev) => ({ ...prev, nombre: undefined }))}
            className={input}
            placeholder={c.namePlaceholder}
          />
          {errors.nombre && (
            <p id={id("nombre-error")} role="alert" className={error}>
              {errors.nombre}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={id("contacto")} className={label}>
            {t.contact}
          </label>
          <input
            id={id("contacto")}
            name="contacto"
            required
            maxLength={CONTACT_LIMITS.maxContacto}
            autoComplete="email"
            aria-invalid={errors.contacto ? true : undefined}
            aria-describedby={errors.contacto ? id("contacto-error") : id("contacto-hint")}
            onChange={() => errors.contacto && setErrors((prev) => ({ ...prev, contacto: undefined }))}
            className={input}
            placeholder={t.contactPlaceholder}
          />
          {errors.contacto ? (
            <p id={id("contacto-error")} role="alert" className={error}>
              {errors.contacto}
            </p>
          ) : (
            <p id={id("contacto-hint")} className={hint}>
              {c.oneIsEnough}
            </p>
          )}
        </div>

        <p className="sm:col-span-2 text-sm font-light leading-relaxed text-white/60">
          {t.docsA}{" "}
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4">
            WhatsApp
          </a>{" "}
          {t.docsOr}{" "}
          <a href={`mailto:${email}`} className="text-white underline underline-offset-4">
            {email}
          </a>
          .
        </p>
      </div>

      {status === "error" && (
        <div role="alert" className="mt-10 border-l-2 border-bronze-light pl-4 text-sm font-light leading-relaxed text-white/80">
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

      <div className="mt-12 flex flex-col justify-between gap-6 border-t border-white/15 pt-8 sm:flex-row sm:items-center">
        <p className="max-w-sm text-sm font-light leading-relaxed text-white/50">
          {c.privacyNote}{" "}
          <Link href={localizedPath(ROUTES.privacy, locale)} className="underline underline-offset-2 hover:text-white">
            {c.privacy}
          </Link>
        </p>
        <button
          type="submit"
          disabled={sending}
          className="group/btn inline-flex w-full shrink-0 items-center justify-between gap-7 border border-paper bg-paper px-6 py-[17px] text-[10px] font-semibold uppercase tracking-[0.09em] text-ink transition-colors duration-200 hover:border-bronze hover:bg-bronze hover:text-white disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {c.sending}
            </>
          ) : (
            <>
              {t.submit}
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
