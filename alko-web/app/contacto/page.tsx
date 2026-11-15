import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import QuickContactForm from "@/components/ui/QuickContactForm";
import { getSettings } from "@/lib/wordpress";
import { getDbContactoPageContent } from "@/lib/db/mysql";

export const revalidate = 60;

export const metadata = {
  title: "Contacto — ALKO",
  description:
    "Solicita presupuesto o consulta técnica. Una única interlocución para tu proyecto.",
};

const NEXT_STEPS = [
  {
    title: "Revisamos tu consulta",
    text: "El equipo técnico estudia el alcance y te contacta para concretar necesidades.",
  },
  {
    title: "Visita técnica",
    text: "Vemos el espacio, tomamos medidas y detectamos condicionantes de obra e instalaciones.",
  },
  {
    title: "Propuesta cerrada",
    text: "Presupuesto por partidas, calidades definidas y calendario de ejecución.",
  },
];

interface Channel {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

/** Contacto · Propuesta 6: hero V4, canales + formulario, pasos y oficina. */
export default async function ContactoPage() {
  const [settings, pageContent] = await Promise.all([
    getSettings(),
    getDbContactoPageContent(),
  ]);

  const telHref = `tel:${settings.telefono.replace(/[^+\d]/g, "")}`;
  const whatsappHref = `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.direccion)}`;

  const channels: Channel[] = [
    { label: "Teléfono", value: settings.telefono, href: telHref },
    { label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { label: "WhatsApp", value: "Escríbenos al momento", href: whatsappHref, external: true },
    { label: "Horario", value: settings.horario },
  ];
  const steps = pageContent.pasos && pageContent.pasos.length > 0 ? pageContent.pasos : NEXT_STEPS;

  return (
    <main className="bg-paper text-ink">
      <PageHero
        eyebrow={pageContent.headerBadge || "CONTACTO"}
        title={<span className="whitespace-pre-line">{pageContent.headerTitulo || "Hablemos de tu próxima obra."}</span>}
        description={pageContent.headerDescripcion ? <span className="whitespace-pre-line">{pageContent.headerDescripcion}</span> : undefined}
        image={pageContent.headerBgImage || "/cta-bg.jpg"}
        imagePosition="object-top"
      >
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a href="#formulario" className="btn btn-paper">
            Solicitar presupuesto <span aria-hidden="true">↓</span>
          </a>
          <a href={telHref} className="border-b border-paper/50 pb-1 text-[11px] uppercase tracking-[0.22em] transition-colors hover:border-paper">
            Llamar
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-paper/50 pb-1 text-[11px] uppercase tracking-[0.22em] transition-colors hover:border-paper"
          >
            WhatsApp
          </a>
        </div>
      </PageHero>

      {/* Canales + formulario */}
      <section className="plan-lines bg-surface">
        <div className="site-wrap grid grid-cols-12 gap-x-6 gap-y-14 py-24 lg:py-32">
          <aside className="reveal-item col-span-12 lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
            <p className="eyebrow">{pageContent.canalesTag || "ALKO Madrid"}</p>
            <h2 className="display-title mt-6 text-[2.4rem] leading-[1.05] sm:text-5xl">
              {pageContent.canalesTitulo || "Un único interlocutor, desde la primera llamada."}
            </h2>
            <p className="mt-8 max-w-md leading-relaxed text-mid">
              {pageContent.canalesDescripcion ||
                "Elige el canal que prefieras. Te atenderá directamente el equipo técnico que llevará tu obra."}
            </p>

            <ul className="mt-12 border-t border-ink/15">
              {channels.map(({ label, value, href, external }) => {
                const content = (
                  <>
                    <span className="w-20 shrink-0 text-[10px] uppercase tracking-[0.22em] text-mid sm:w-24">{label}</span>
                    <span className="display-title min-w-0 flex-1 break-words text-lg transition-colors group-hover:text-bronze sm:text-xl">
                      {value}
                    </span>
                    {href && (
                      <span aria-hidden="true" className="text-mid transition-colors group-hover:text-bronze">
                        ↗
                      </span>
                    )}
                  </>
                );
                return (
                  <li key={label} className="border-b border-ink/15">
                    {href ? (
                      <a
                        href={href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group flex items-center gap-5 py-5"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-center gap-5 py-5">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </aside>

          <section
            id="formulario"
            aria-labelledby="form-title"
            className="reveal-item col-span-12 scroll-mt-28 lg:col-span-7"
            style={{ transitionDelay: "120ms" }}
          >
            <div className="bg-ink p-6 text-white sm:p-10 lg:p-12">
              <p className="eyebrow eyebrow-light">{pageContent.formTag || "Solicitud de presupuesto"}</p>
              <h2 id="form-title" className="display-title mb-12 mt-5 text-4xl lg:text-5xl">
                {pageContent.formTitulo || "Cuéntanos tu proyecto"}
              </h2>
              <QuickContactForm email={settings.email} whatsappHref={whatsappHref} source="Página de contacto" />
            </div>
          </section>
        </div>
      </section>

      {/* Pasos */}
      <section className="bg-ink text-paper">
        <div className="site-wrap py-24 lg:py-32">
          <div className="grid grid-cols-12 items-end gap-6">
            <div className="col-span-12 lg:col-span-7">
              <p className="eyebrow eyebrow-light reveal-item">{pageContent.pasosTag || "Después de escribirnos"}</p>
              <h2 className="reveal-item display-title mt-6 text-5xl leading-none sm:text-6xl">
                {pageContent.pasosTitulo || "Qué pasa a continuación"}
              </h2>
            </div>
          </div>
          <ol className="mt-16 grid grid-cols-1 border-t border-paper/15 md:grid-cols-3">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className={`reveal-item py-10 md:pr-10 ${i > 0 ? "border-t border-paper/15 md:border-l md:border-t-0 md:pl-10" : ""}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <span className="display-title text-5xl text-bronze-light">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display-title mt-6 text-2xl sm:text-3xl">{step.title}</h3>
                <p className="mt-3 max-w-xs leading-relaxed text-paper/60">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Oficina */}
      <section className="bg-paper">
        <div className="site-wrap grid grid-cols-12 items-center gap-x-6 gap-y-12 py-24 lg:py-32">
          <figure className="col-span-12 lg:col-span-7">
            <div className="reveal-scale relative aspect-[16/10] overflow-hidden bg-piedra">
              <Image
                src={pageContent.oficinaImagen || "/oficinas.jpg"}
                alt="Oficina de ALKO en Madrid"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 flex items-center gap-4 text-mid">
              <span className="text-[10px] uppercase tracking-[0.22em]">Oficina</span>
              <span className="cota flex-1 text-ink" aria-hidden="true" />
              <span className="text-[10px] uppercase tracking-[0.22em]">Madrid</span>
            </figcaption>
          </figure>
          <div className="reveal-item col-span-12 lg:col-span-4 lg:col-start-9" style={{ transitionDelay: "120ms" }}>
            <p className="eyebrow">{pageContent.oficinaTag || "Visítanos"}</p>
            <h2 className="display-title mt-6 text-5xl leading-none">{pageContent.oficinaTitulo || "Nuestra oficina"}</h2>
            <dl className="mt-10 divide-y divide-ink/10 border-y border-ink/10 text-sm">
              <div className="flex justify-between gap-6 py-3">
                <dt className="text-mid">Dirección</dt>
                <dd className="text-right">{settings.direccion}</dd>
              </div>
              {settings.horario && (
                <div className="flex justify-between gap-6 py-3">
                  <dt className="text-mid">Horario</dt>
                  <dd className="text-right">{settings.horario}</dd>
                </div>
              )}
            </dl>
            <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-10">
              Cómo llegar <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
