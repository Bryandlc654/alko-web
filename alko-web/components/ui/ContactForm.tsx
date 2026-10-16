"use client";

import { useState, type FormEvent } from "react";

/**
 * Formulario de contacto (pensado para ir sobre fondo oscuro).
 *
 * No hay backend de envío: al enviar se compone un correo con los datos y se
 * abre el cliente de correo del usuario (mailto). Para enviarlo desde el
 * servidor bastaría con sustituir `handleSubmit` por un POST a una API route.
 */
export default function ContactForm({
  email,
  projectTypes,
}: {
  email: string;
  projectTypes: string[];
}) {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();

    const subject = `Nueva consulta ALKO — ${field("tipo") || "Proyecto"}`;
    const body = [
      `Nombre: ${field("nombre")}`,
      `Email: ${field("email")}`,
      `Teléfono: ${field("telefono") || "—"}`,
      `Tipo de proyecto: ${field("tipo") || "—"}`,
      `Ubicación: ${field("ubicacion") || "—"}`,
      "",
      field("mensaje"),
    ].join("\n");

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const group = "flex items-center gap-4 mb-8 font-mono text-[11px] tracking-[0.25em] uppercase text-white/50";
  const label = "block font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-white/50 mb-1";
  const input =
    "w-full border-0 border-b border-white/25 bg-transparent px-0 py-3 text-lg text-white font-light placeholder:text-white/30 focus:border-amber-700 focus:outline-none focus:ring-0 transition-colors";

  return (
    <form onSubmit={handleSubmit}>
      <p className={group}>
        <span className="text-amber-700">01</span>
        <span>Tus datos</span>
        <span className="h-px flex-1 bg-white/15" />
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
        <div>
          <label htmlFor="nombre" className={label}>
            Nombre *
          </label>
          <input id="nombre" name="nombre" required autoComplete="name" className={input} placeholder="Tu nombre" />
        </div>
        <div>
          <label htmlFor="email" className={label}>
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={input}
            placeholder="tu@email.com"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="telefono" className={label}>
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            autoComplete="tel"
            className={input}
            placeholder="+34"
          />
        </div>
      </div>

      <p className={`${group} mt-14`}>
        <span className="text-amber-700">02</span>
        <span>Tu proyecto</span>
        <span className="h-px flex-1 bg-white/15" />
      </p>
      <div className="grid grid-cols-1 gap-y-8">
        <fieldset>
          <legend className={`${label} mb-3`}>Tipo de proyecto</legend>
          <div className="flex flex-wrap gap-2">
            {projectTypes.map((type, i) => (
              <label key={type} className="cursor-pointer">
                <input
                  type="radio"
                  name="tipo"
                  value={type}
                  defaultChecked={i === 0}
                  className="peer sr-only"
                />
                <span className="inline-flex rounded-full border border-white/25 px-4 py-2 text-[11px] font-light uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-white hover:text-white peer-checked:border-amber-700 peer-checked:bg-amber-700 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-stone-950">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="ubicacion" className={label}>
            Ubicación de la obra
          </label>
          <input id="ubicacion" name="ubicacion" className={input} placeholder="Madrid, barrio o municipio" />
        </div>
        <div>
          <label htmlFor="mensaje" className={label}>
            Cuéntanos tu proyecto *
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            required
            rows={4}
            className={`${input} resize-y`}
            placeholder="Superficie aproximada, alcance de la reforma, plazos deseados…"
          />
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-white/15 pt-8">
        <p className="max-w-sm text-sm text-white/50 font-light leading-relaxed">
          Al enviar se abrirá tu aplicación de correo con el mensaje preparado. Solo usaremos tus datos
          para responder a tu consulta.
        </p>
        <button
          type="submit"
          className="group/btn inline-flex w-full sm:w-auto items-center justify-center gap-3 shrink-0 px-9 py-4 rounded-full bg-amber-700 hover:bg-white hover:text-stone-900 text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-xl active:scale-95"
        >
          Enviar consulta
          <span aria-hidden="true" className="transition-transform group-hover/btn:translate-x-1">
            →
          </span>
        </button>
      </div>

      {sent && (
        <p role="status" className="mt-6 border-l-2 border-amber-700 pl-4 text-sm text-white/70">
          Si no se ha abierto tu correo, escríbenos directamente a{" "}
          <a href={`mailto:${email}`} className="text-white underline underline-offset-4">
            {email}
          </a>
          .
        </p>
      )}
    </form>
  );
}
