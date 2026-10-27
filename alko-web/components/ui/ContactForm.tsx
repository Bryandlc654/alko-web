"use client";

import { useEffect, useId, useRef, useState, type DragEvent, type FormEvent } from "react";
import { CheckCircle2, ChevronDown, FileText, Loader2, Paperclip, X } from "lucide-react";
import {
  CONTACT_LIMITS,
  CONTACT_MESSAGES,
  FECHAS,
  PRESUPUESTOS,
  SITUACIONES,
  cleanSurface,
  contactKind,
  fileProblem,
  formatBytes,
} from "@/lib/contact/config";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"tipo" | "nombre" | "contacto", string>>;

interface Sent {
  nombre: string;
  contacto: string;
  tipo: string;
  ubicacion: string;
  planos: number;
}

/**
 * Formulario «Cuéntanos tu proyecto» (pensado para ir sobre fondo oscuro).
 *
 * Se envía a /api/contacto con los planos adjuntos. Solo son obligatorios el tipo de
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
}) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const formRef = useRef<HTMLFormElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [sent, setSent] = useState<Sent | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileNotice, setFileNotice] = useState("");
  const [dragging, setDragging] = useState(false);

  // Al enviar, la confirmación recibe el foco y se lleva a la vista.
  useEffect(() => {
    if (status === "sent") {
      confirmRef.current?.focus();
      confirmRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [status]);

  function addFiles(list: FileList | File[]) {
    const messages: string[] = [];
    const next = [...files];
    for (const file of Array.from(list)) {
      const problem = fileProblem(file.name, file.size);
      if (problem) {
        messages.push(problem);
      } else if (next.some((f) => f.name === file.name && f.size === file.size)) {
        continue; // ya está añadido
      } else if (next.length >= CONTACT_LIMITS.maxFiles) {
        messages.push(`Puedes adjuntar hasta ${CONTACT_LIMITS.maxFiles} archivos.`);
        break;
      } else if (next.reduce((sum, f) => sum + f.size, 0) + file.size > CONTACT_LIMITS.maxTotalBytes) {
        messages.push(`Los adjuntos no pueden superar ${formatBytes(CONTACT_LIMITS.maxTotalBytes)} en total.`);
      } else {
        next.push(file);
      }
    }
    setFiles(next);
    setFileNotice(messages.join(" "));
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files.length > 0) addFiles(event.dataTransfer.files);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? "").trim();

    // Validación en el navegador (el servidor vuelve a comprobarlo todo).
    const found: Errors = {};
    if (!value("tipo")) found.tipo = "Elige el tipo de proyecto.";
    if (!value("nombre")) found.nombre = "Dinos tu nombre o el de tu empresa.";
    if (!value("contacto")) found.contacto = "Escribe un teléfono o un email para poder contestarte.";
    else if (!contactKind(value("contacto"))) found.contacto = "No parece un teléfono ni un email válido.";
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = (["tipo", "nombre", "contacto"] as const).find((key) => found[key]);
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const body = new FormData();
    for (const [key, val] of data.entries()) if (typeof val === "string") body.append(key, val);
    body.append("origen", source ?? "");
    for (const file of files) body.append("planos", file, file.name);

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
          planos: files.length,
        });
        setStatus("sent");
        onSent?.();
        form.reset();
        setFiles([]);
        setFileNotice("");
        return;
      }
      const message = (json as { error?: unknown } | null)?.error;
      setServerError(typeof message === "string" && message ? message : CONTACT_MESSAGES.failed);
    } catch {
      setServerError(CONTACT_MESSAGES.failed); // sin conexión
    }
    setStatus("error");
  }

  const group = "flex items-center gap-4 mb-8 font-mono text-[11px] tracking-[0.25em] uppercase text-white/50";
  const label = "block font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-white/50 mb-1";
  const input =
    "w-full border-0 border-b border-white/25 bg-transparent px-0 py-3 text-lg text-white font-light placeholder:text-white/30 focus:border-amber-700 focus:outline-none focus:ring-0 transition-colors aria-[invalid=true]:border-amber-500";
  const hint = "mt-2 text-sm font-light text-white/50";
  const error = "mt-2 text-sm text-amber-500";

  // --- Confirmación ---------------------------------------------------------------------------
  if (status === "sent" && sent) {
    const resumen: [string, string][] = [
      ["Tipo de proyecto", sent.tipo],
      ["Ubicación", sent.ubicacion],
      ["Planos adjuntos", sent.planos > 0 ? String(sent.planos) : ""],
    ];
    return (
      <div
        ref={confirmRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="py-4 outline-none sm:py-8"
      >
        <CheckCircle2 className="h-12 w-12 text-amber-500" strokeWidth={1.25} aria-hidden="true" />
        <h3 className="mt-6 font-serif font-light text-3xl sm:text-4xl leading-tight tracking-tight">
          Hemos recibido tu proyecto
        </h3>
        <p className="mt-4 max-w-xl text-lg font-light text-white/70 leading-relaxed">
          Gracias, {sent.nombre}. El equipo técnico revisará la información que nos has enviado y se pondrá en
          contacto contigo en <span className="text-white">{sent.contacto}</span>.
        </p>

        <dl className="mt-8 max-w-xl border-t border-white/15">
          {resumen
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 border-b border-white/15 py-3">
                <dt className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-white/50">{k}</dt>
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
          className="mt-10 inline-flex items-center gap-2 border-b border-white pb-1 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:border-amber-500 hover:text-amber-500"
        >
          {onClose ? "Cerrar" : "Enviar otro proyecto"}
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
          <option value="" className="bg-stone-900 text-white/60">
            Sin indicar
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-stone-900 text-white">
              {option}
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
        Solo necesitamos el tipo de proyecto, tu nombre y un teléfono o email. El resto es opcional y nos ayuda
        a orientarte mejor.
      </p>

      {/* Campo trampa para bots: las personas no lo ven */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          No rellenar
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <p className={group}>
        <span className="text-amber-700">01</span>
        <span>Tu proyecto</span>
        <span className="h-px flex-1 bg-white/15" />
      </p>
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
        <fieldset
          className="group sm:col-span-2"
          data-invalid={errors.tipo ? "true" : undefined}
          aria-describedby={errors.tipo ? id("tipo-error") : undefined}
        >
          <legend className={`${label} mb-3`}>Tipo de proyecto *</legend>
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
                <span className="inline-flex rounded-full border border-white/25 px-4 py-2 text-[11px] font-light uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-white hover:text-white peer-checked:border-amber-700 peer-checked:bg-amber-700 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-stone-950 group-data-[invalid=true]:border-amber-500">
                  {type}
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
            Ubicación
          </label>
          <input
            id={id("ubicacion")}
            name="ubicacion"
            maxLength={CONTACT_LIMITS.maxUbicacion}
            autoComplete="address-level2"
            className={input}
            placeholder="Madrid, barrio o municipio"
          />
        </div>

        <div>
          <label htmlFor={id("superficie")} className={label}>
            Superficie
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
              placeholder="Aproximada"
            />
            <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-white/50">m²</span>
          </div>
        </div>

        {select("situacion", "Situación actual", SITUACIONES)}
        {select("fecha", "Fecha prevista", FECHAS)}
        <div className="sm:col-span-2">{select("presupuesto", "Presupuesto aproximado", PRESUPUESTOS)}</div>
      </div>

      <p className={`${group} mt-14`}>
        <span className="text-amber-700">02</span>
        <span>Tus datos y planos</span>
        <span className="h-px flex-1 bg-white/15" />
      </p>
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
        <div>
          <label htmlFor={id("nombre")} className={label}>
            Nombre / empresa *
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
            placeholder="Tu nombre o el de tu empresa"
          />
          {errors.nombre && (
            <p id={id("nombre-error")} role="alert" className={error}>
              {errors.nombre}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={id("contacto")} className={label}>
            Teléfono / email *
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
            placeholder="600 000 000 o tu@email.com"
          />
          {errors.contacto ? (
            <p id={id("contacto-error")} role="alert" className={error}>
              {errors.contacto}
            </p>
          ) : (
            <p id={id("contacto-hint")} className={hint}>
              Con uno de los dos nos basta.
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <span className={label}>Adjuntar planos</span>
          <div className="relative">
            <input
              id={id("planos")}
              type="file"
              multiple
              accept={CONTACT_LIMITS.allowedExtensions.map((e) => `.${e}`).join(",")}
              onChange={(e) => {
                if (e.target.files) addFiles(e.target.files);
                e.target.value = ""; // permite volver a elegir el mismo archivo
              }}
              className="peer sr-only"
              aria-describedby={id("planos-hint")}
            />
            <label
              htmlFor={id("planos")}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-6 py-8 text-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-stone-950 ${
                dragging ? "border-amber-500 bg-white/5" : "border-white/25 hover:border-white/60"
              }`}
            >
              <Paperclip className="h-6 w-6 text-amber-500" strokeWidth={1.5} aria-hidden="true" />
              <span className="font-light text-white">
                Arrastra tus planos aquí o <span className="underline underline-offset-4">elige archivos</span>
              </span>
            </label>
          </div>
          <p id={id("planos-hint")} className={hint}>
            PDF, JPG, PNG, WEBP, DWG o DXF. Hasta {CONTACT_LIMITS.maxFiles} archivos y{" "}
            {formatBytes(CONTACT_LIMITS.maxTotalBytes)} en total.
          </p>
          {fileNotice && (
            <p role="alert" className={error}>
              {fileNotice}
            </p>
          )}

          {files.length > 0 && (
            <ul className="mt-4 border-t border-white/15" aria-label="Archivos adjuntos">
              {files.map((file) => (
                <li
                  key={`${file.name}-${file.size}`}
                  className="flex items-center gap-3 border-b border-white/15 py-3"
                >
                  <FileText className="h-5 w-5 shrink-0 text-white/50" strokeWidth={1.5} aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate font-light text-white">{file.name}</span>
                  <span className="shrink-0 font-mono text-[11px] tracking-[0.15em] text-white/50">
                    {formatBytes(file.size)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFiles((prev) => prev.filter((f) => f !== file));
                      setFileNotice("");
                    }}
                    aria-label={`Quitar ${file.name}`}
                    className="shrink-0 rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {status === "error" && (
        <div role="alert" className="mt-10 border-l-2 border-amber-500 pl-4 text-sm font-light leading-relaxed text-white/80">
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
          Usaremos tus datos y tus planos solo para responder a tu consulta.
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
              Enviar proyecto
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
