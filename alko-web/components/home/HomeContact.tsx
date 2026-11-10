import type { ReactNode } from "react";
import ContactForm from "@/components/ui/ContactForm";
import type { SiteSettings } from "@/lib/types";

/**
 * Formulario cualificado al final de la portada (el brief lo sitúa después del
 * portfolio, nunca antes). Usa el formulario real que ya envía a /api/contacto;
 * sus campos se ajustarán al brief en la fase de formulario.
 */
export default function HomeContact({
  settings,
  projectTypes,
}: {
  settings: SiteSettings;
  projectTypes: string[];
}) {
  const telHref = `tel:${settings.telefono.replace(/[^+\d]/g, "")}`;
  const info: { label: string; value: ReactNode }[] = [
    { label: "Ubicación", value: "Madrid y proyectos seleccionados" },
    { label: "Proceso", value: "Valoración inicial → estudio técnico → propuesta" },
    {
      label: "Teléfono",
      value: (
        <a href={telHref} className="hover:text-ink">
          {settings.telefono}
        </a>
      ),
    },
    {
      label: "Email",
      value: (
        <a href={`mailto:${settings.email}`} className="break-all hover:text-ink">
          {settings.email}
        </a>
      ),
    },
  ];

  return (
    <section id="presentar-proyecto" className="section-y bg-[#EAE5DC] text-ink">
      <div className="site-wrap grid grid-cols-1 gap-12 lg:grid-cols-[42%_1fr] lg:gap-[clamp(40px,7vw,120px)]">
        <div className="reveal-item">
          <p className="eyebrow">05 / Iniciar conversación</p>
          <h2 className="display-title my-5 max-w-[620px] text-[clamp(45px,5.7vw,86px)] tracking-[-0.068em]">
            El próximo proyecto puede empezar aquí.
          </h2>
          <p className="max-w-[425px] text-[15px] leading-[1.85] text-mid">
            Cuéntanos qué estás planteando. Revisaremos si el encargo encaja con nuestras especialidades
            antes de definir los siguientes pasos.
          </p>
          <dl className="mt-12 border-t border-[#BEB8AF]">
            {info.map((row) => (
              <div key={row.label} className="flex gap-5 border-b border-[#BEB8AF] py-3.5 text-xs">
                <dt className="w-20 shrink-0 font-semibold uppercase tracking-[0.1em]">{row.label}</dt>
                <dd className="text-mid">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="reveal-item bg-ink p-[clamp(24px,4vw,56px)] text-white" style={{ transitionDelay: "120ms" }}>
          <ContactForm
            projectTypes={projectTypes}
            email={settings.email}
            whatsappHref={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}
            source="Formulario portada · /"
          />
        </div>
      </div>
    </section>
  );
}
