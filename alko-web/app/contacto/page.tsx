import Image from "@/components/ui/Image";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import EditorialSection from "@/components/editorial/EditorialSection";
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

/** Contacto · línea editorial clara: cabecera tipográfica, formulario, canales, pasos y oficina. */
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
    ...(settings.horario ? [{ label: "Horario", value: settings.horario }] : []),
  ];
  const steps = pageContent.pasos && pageContent.pasos.length > 0 ? pageContent.pasos : NEXT_STEPS;

  return (
    <main className="bg-paper text-ink">
      <EditorialHeader
        breadcrumbs={[{ label: "Contacto" }]}
        eyebrow={pageContent.headerBadge || "Contacto"}
        title={<span className="whitespace-pre-line">{pageContent.headerTitulo || "Hablemos de tu próxima obra."}</span>}
        description={
          <span className="whitespace-pre-line">
            {pageContent.headerDescripcion ||
              "Cuéntanos qué tienes entre manos. Te responde directamente el equipo técnico que llevará tu obra."}
          </span>
        }
        aside={
          <div className="flex flex-col gap-3">
            <a
              href="#formulario"
              className="group flex items-center justify-between border-b border-ink/15 pb-3 text-[11px] uppercase tracking-[0.22em] transition-colors hover:text-bronze"
            >
              Solicitar presupuesto <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">↓</span>
            </a>
            <a
              href={telHref}
              className="group flex items-center justify-between border-b border-ink/15 pb-3 text-[11px] uppercase tracking-[0.22em] transition-colors hover:text-bronze"
            >
              Llamar · {settings.telefono} <span aria-hidden="true">↗</span>
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between border-b border-ink/15 pb-3 text-[11px] uppercase tracking-[0.22em] transition-colors hover:text-bronze"
            >
              WhatsApp <span aria-hidden="true">↗</span>
            </a>
          </div>
        }
      />

      {/* 01 · Formulario */}
      <EditorialSection
        id="formulario"
        number="01"
        label={pageContent.formTag || "Solicitud de presupuesto"}
        title={pageContent.formTitulo || "Cuéntanos tu proyecto"}
        intro="Solo necesitamos tu nombre y un correo o teléfono. Con eso te llamamos para concretar."
      >
        <div className="reveal-item bg-ink p-6 text-white sm:p-10 lg:p-14">
          <QuickContactForm email={settings.email} whatsappHref={whatsappHref} source="Página de contacto" />
        </div>
      </EditorialSection>

      {/* 02 · Canales */}
      <EditorialSection
        tone="white"
        number="02"
        label={pageContent.canalesTag || "ALKO Madrid"}
        title={pageContent.canalesTitulo || "Un único interlocutor, desde la primera llamada."}
        intro={
          pageContent.canalesDescripcion ||
          "Elige el canal que prefieras. Te atenderá directamente el equipo técnico que llevará tu obra."
        }
      >
        <ul className="grid grid-cols-1 border-l border-t border-ink/15 sm:grid-cols-2">
          {channels.map(({ label, value, href, external }, i) => {
            const content = (
              <>
                <span className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-mid">
                  <span>
                    <span className="text-bronze">{String(i + 1).padStart(2, "0")}</span> · {label}
                  </span>
                  {href && (
                    <span aria-hidden="true" className="text-sm transition-colors group-hover:text-bronze">
                      ↗
                    </span>
                  )}
                </span>
                <span className="display-title mt-10 block break-words text-2xl transition-colors group-hover:text-bronze sm:text-[1.7rem]">
                  {value}
                </span>
              </>
            );
            return (
              <li key={label} className="reveal-item border-b border-r border-ink/15" style={{ transitionDelay: `${i * 80}ms` }}>
                {href ? (
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group block h-full p-6 transition-colors hover:bg-paper sm:p-8"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="h-full p-6 sm:p-8">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </EditorialSection>

      {/* 03 · Pasos */}
      <EditorialSection
        tone="ink"
        number="03"
        label={pageContent.pasosTag || "Después de escribirnos"}
        title={pageContent.pasosTitulo || "Qué pasa a continuación"}
      >
        <ol className="border-t border-paper/15">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="reveal-item grid grid-cols-12 items-baseline gap-x-6 gap-y-3 border-b border-paper/15 py-8 sm:py-10"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="col-span-12 text-[10px] uppercase tracking-[0.22em] text-bronze-light sm:col-span-2">
                Paso {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display-title col-span-12 text-3xl sm:col-span-5 sm:text-4xl">{step.title}</h3>
              <p className="col-span-12 max-w-md leading-relaxed text-paper/60 sm:col-span-5">{step.text}</p>
            </li>
          ))}
        </ol>
      </EditorialSection>

      {/* 04 · Oficina */}
      <EditorialSection number="04" label={pageContent.oficinaTag || "Visítanos"} title={pageContent.oficinaTitulo || "Nuestra oficina"}>
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="reveal-scale relative col-span-12 aspect-[16/10] overflow-hidden bg-piedra lg:col-span-8">
            <Image
              src={pageContent.oficinaImagen || "/oficinas.jpg"}
              alt="Oficina de ALKO en Madrid"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="reveal-item col-span-12 flex flex-col justify-between lg:col-span-4">
            <dl className="divide-y divide-ink/10 border-y border-ink/10 text-sm">
              <div className="py-4">
                <dt className="text-[10px] uppercase tracking-[0.22em] text-mid">Dirección</dt>
                <dd className="mt-2 text-base">{settings.direccion}</dd>
              </div>
              {settings.horario && (
                <div className="py-4">
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-mid">Horario</dt>
                  <dd className="mt-2 text-base">{settings.horario}</dd>
                </div>
              )}
            </dl>
            <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="btn btn-ink mt-10 self-start">
              Cómo llegar <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </EditorialSection>
    </main>
  );
}
