import Image from "@/components/ui/Image";
import ContactForm from "@/components/ui/ContactForm";
import { DIVISION_OPTIONS, divisionForSector } from "@/lib/divisions";
import type { SiteSettings } from "@/lib/types";

/**
 * Cierre «Hablemos» (propuesta 6 · V5): foto a sangre, titular grande a la izquierda y el
 * formulario real en una tarjeta. La tarjeta es carbón porque el formulario está diseñado
 * para fondo oscuro; envía a /api/contacto.
 */
export default function HablemosSection({
  settings,
  source,
  id = "contacto",
  description,
  image = "/cta-bg.jpg",
  sectorSlug,
  title,
  eyebrow,
  overlay = false,
}: {
  settings: SiteSettings;
  /** Origen que llega en el correo (p. ej. «Formulario portada · /»). */
  source: string;
  id?: string;
  description?: string;
  image?: string;
  /** Servicio desde el que se muestra, para preseleccionar su división. */
  sectorSlug?: string;
  /** Titular propio (p. ej. la llamada final de cada proyecto); si falta, «Hablemos ↘». Admite saltos de línea. */
  title?: string;
  /** Antetítulo opcional sobre el titular. */
  eyebrow?: string;
  /** Velo más oscuro sobre toda la foto (fotos de obra claras). */
  overlay?: boolean;
}) {
  const telHref = `tel:${settings.telefono.replace(/[^+\d]/g, "")}`;

  return (
    <section id={id} className="relative overflow-hidden text-white">
      <Image src={image} alt="" fill sizes="100vw" className="object-cover" />
      <div
        className={`absolute inset-0 ${overlay ? "bg-black/60" : "bg-gradient-to-r from-black/65 via-black/40 to-black/20"}`}
      />

      <div className="site-wrap relative grid min-h-[760px] items-center gap-10 py-24 md:py-32 lg:grid-cols-3">
        <div className="reveal-item">
          {eyebrow && <p className="eyebrow eyebrow-light mb-6">{eyebrow}</p>}
          {title ? (
            <h2 className="display-title whitespace-pre-line text-[2.6rem] leading-[1.02] md:text-5xl">{title}</h2>
          ) : (
            <h2 className="display-title whitespace-nowrap text-[60px] leading-[.95] tracking-[-0.045em] md:text-[64px] lg:text-[84px]">
              Hablemos <span aria-hidden="true">↘</span>
            </h2>
          )}
          <p className="mt-6 max-w-xs text-white/85">
            {description ||
              "Cuéntanos lo esencial. Un técnico de la división correspondiente revisará tu solicitud y te contactará."}
          </p>
          <p className="mt-8 space-y-1 text-sm text-white/80">
            <a href={telHref} className="block hover:text-white">
              {settings.telefono}
            </a>
            <a href={`mailto:${settings.email}`} className="block break-all hover:text-white">
              {settings.email}
            </a>
            {settings.direccion && <span className="block text-white/60">{settings.direccion}</span>}
          </p>
        </div>

        <div className="reveal-item bg-ink/95 p-6 backdrop-blur-sm md:p-10 lg:col-span-2" style={{ transitionDelay: "120ms" }}>
          <ContactForm
            projectTypes={DIVISION_OPTIONS}
            email={settings.email}
            whatsappHref={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}
            defaultTipo={divisionForSector(sectorSlug)}
            source={source}
          />
        </div>
      </div>
    </section>
  );
}
