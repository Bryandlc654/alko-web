"use client";

import { useState } from "react";
import { Check, Link2, Mail, MessageCircle } from "lucide-react";

/** Compartir el artículo: copiar el enlace, WhatsApp, LinkedIn y correo. */
export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const text = encodeURIComponent(title);
  const link = encodeURIComponent(url);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copia este enlace:", url);
    }
  }

  const item =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 text-stone-700 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white";
  const icon = "h-[18px] w-[18px]";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={copy} className={item} aria-label={copied ? "Enlace copiado" : "Copiar enlace"}>
        {copied ? <Check className={icon} aria-hidden="true" /> : <Link2 className={icon} aria-hidden="true" />}
      </button>
      <a
        href={`https://wa.me/?text=${text}%20${link}`}
        target="_blank"
        rel="noopener noreferrer"
        className={item}
        aria-label="Compartir por WhatsApp"
      >
        <MessageCircle className={icon} aria-hidden="true" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${link}`}
        target="_blank"
        rel="noopener noreferrer"
        className={item}
        aria-label="Compartir en LinkedIn"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className={icon} aria-hidden="true">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11.5H3V9.75Zm6.5 0h3.83v1.57h.06c.53-.95 1.84-1.95 3.78-1.95 4.04 0 4.78 2.66 4.78 6.12v5.76h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.69v5.19h-4V9.75Z" />
        </svg>
      </a>
      <a href={`mailto:?subject=${text}&body=${link}`} className={item} aria-label="Compartir por correo">
        <Mail className={icon} aria-hidden="true" />
      </a>
      <span role="status" aria-live="polite" className="text-sm text-stone-500">
        {copied ? "Enlace copiado" : ""}
      </span>
    </div>
  );
}
