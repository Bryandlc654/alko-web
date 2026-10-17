import Image from "next/image";
import { Clock, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import Container from "@/components/ui/Container";
import ContactForm from "@/components/ui/ContactForm";
import { getSectors, getSettings } from "@/lib/wordpress";

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
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

export default async function ContactoPage() {
  const [settings, sectors] = await Promise.all([getSettings(), getSectors()]);

  const telHref = `tel:${settings.telefono.replace(/[^+\d]/g, "")}`;
  const whatsappHref = `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.direccion)}`;
  const projectTypes = [...sectors.map((sector) => sector.title), "Otro"];

  const channels: Channel[] = [
    { icon: Phone, label: "Teléfono", value: settings.telefono, href: telHref },
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: MessageCircle, label: "WhatsApp", value: "Escríbenos al momento", href: whatsappHref, external: true },
    { icon: Clock, label: "Horario", value: settings.horario },
  ];

  const pill =
    "inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-[11px] font-light uppercase tracking-[0.16em] transition-colors";

  return (
    <main className="bg-white text-stone-900">
      <header className="relative isolate flex min-h-[640px] sm:min-h-[720px] lg:min-h-[82vh] items-end overflow-hidden bg-stone-950 text-white pt-36 sm:pt-44 pb-16 sm:pb-20">
        <Image
          src="/cta-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-top"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-stone-950/90 via-stone-950/55 to-stone-950/10" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-stone-950/70 to-transparent" />

        <Container className="relative">
          <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-white/70 uppercase mb-4">
            CONTACTO
          </span>
          <h1 className="font-display font-light text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[-0.03em] leading-[1.02] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
            Hablemos de tu
            <br />
            próximo proyecto.
          </h1>
          <p className="mt-6 max-w-xl text-base sm:text-lg text-white/85 font-light leading-relaxed">
            Cuéntanos tus necesidades y te proponemos un planteamiento técnico claro, con plazos
            definidos y sin sorpresas.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#formulario" className={`${pill} border-amber-700 bg-amber-700 text-white hover:bg-amber-800`}>
              Solicitar presupuesto <span aria-hidden="true">↓</span>
            </a>
            <a href={telHref} className={`${pill} border-white/40 bg-stone-950/20 backdrop-blur-sm text-white hover:border-white`}>
              <Phone className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              Llamar
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${pill} border-white/40 bg-stone-950/20 backdrop-blur-sm text-white hover:border-white`}
            >
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </Container>
      </header>

      {/* Canales + formulario */}
      <section className="relative isolate overflow-clip">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 mx-auto hidden max-w-7xl grid-cols-6 px-6 sm:px-10 lg:grid lg:px-12"
        >
          <div className="h-full border-x border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
        </div>

        <Container className="py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16">
            <aside className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start reveal-item">
              <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase mb-3">
                ALKO MADRID
              </span>
              <h2 className="font-serif font-light text-3xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight leading-tight">
                Un único interlocutor, desde la primera llamada.
              </h2>
              <p className="mt-5 max-w-md text-base sm:text-lg text-stone-600 font-light leading-relaxed">
                Elige el canal que prefieras. Te atenderá directamente el equipo técnico que llevará tu
                obra.
              </p>

              <ul className="mt-10 border-t border-stone-300">
                {channels.map(({ icon: Icon, label, value, href, external }) => {
                  const content = (
                    <>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone-300 text-stone-900 transition-colors group-hover:border-amber-700 group-hover:bg-amber-700 group-hover:text-white">
                        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-stone-500">
                          {label}
                        </span>
                        <span className="mt-0.5 block break-words font-serif font-light text-xl text-stone-900 leading-snug group-hover:text-amber-800 transition-colors">
                          {value}
                        </span>
                      </span>
                      {href && (
                        <span
                          aria-hidden="true"
                          className="text-lg text-stone-400 transition-all group-hover:text-stone-900 group-hover:translate-x-1 group-hover:-translate-y-1"
                        >
                          ↗
                        </span>
                      )}
                    </>
                  );
                  return (
                    <li key={label} className="border-b border-stone-300">
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
              className="lg:col-span-7 scroll-mt-28 reveal-item"
              style={{ transitionDelay: "120ms" }}
            >
              <div className="bg-stone-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl">
                <div className="flex items-start justify-between gap-6 mb-12">
                  <div>
                    <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-white/50 uppercase mb-3">
                      SOLICITUD DE PRESUPUESTO
                    </span>
                    <h2
                      id="form-title"
                      className="font-serif font-light text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-none"
                    >
                      Cuéntanos qué necesitas
                    </h2>
                  </div>
                  <div className="hidden sm:flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-700 mt-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                  </div>
                </div>
                <ContactForm email={settings.email} projectTypes={projectTypes} />
              </div>
            </section>
          </div>
        </Container>
      </section>

      {/* Proceso */}
      <section className="bg-stone-100">
        <Container className="py-16 sm:py-24">
          <div className="reveal-item mb-12 sm:mb-16">
            <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase mb-2">
              DESPUÉS DE ESCRIBIRNOS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-stone-900 tracking-tight leading-none">
              Qué pasa a continuación
            </h2>
          </div>
          <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 lg:gap-14">
            <span
              aria-hidden="true"
              className="absolute left-2.5 top-2.5 bottom-0 w-px bg-stone-900/15 md:left-0 md:right-0 md:bottom-auto md:h-px md:w-auto"
            />
            {NEXT_STEPS.map((step, i) => (
              <li key={step.title} className="reveal-item relative pl-12 md:pl-0 md:pt-12" style={{ transitionDelay: `${i * 120}ms` }}>
                <span className="absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full border border-amber-700 bg-stone-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                </span>
                <span className="font-serif font-light text-5xl sm:text-6xl text-stone-900/15 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-serif font-light text-2xl sm:text-3xl text-stone-900 tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-base text-stone-600 font-light leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Oficina */}
      <section>
        <Container className="py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7 reveal-item">
              <div data-parallax="8" className="relative overflow-hidden aspect-[16/10] bg-stone-200">
                <Image
                  src="/oficinas.jpg"
                  alt="Oficina de ALKO en Madrid"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
            <div className="lg:col-span-5 reveal-item" style={{ transitionDelay: "120ms" }}>
              <span className="block font-mono text-[11px] sm:text-xs tracking-[0.25em] text-stone-500 uppercase mb-3">
                VISÍTANOS
              </span>
              <h2 className="font-serif font-light text-3xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight leading-tight">
                Nuestra oficina
              </h2>
              <div className="mt-8 space-y-5 border-t border-stone-300 pt-8">
                <p className="flex items-start gap-4 text-lg text-stone-900 font-light leading-snug">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-amber-700" strokeWidth={1.5} aria-hidden="true" />
                  {settings.direccion}
                </p>
                <p className="flex items-start gap-4 text-lg text-stone-900 font-light leading-snug">
                  <Clock className="mt-1 h-4 w-4 shrink-0 text-amber-700" strokeWidth={1.5} aria-hidden="true" />
                  {settings.horario}
                </p>
              </div>
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 inline-flex items-center gap-3 rounded-full border border-stone-900 px-6 py-3 text-[11px] font-light uppercase tracking-[0.16em] text-stone-900 transition-colors hover:bg-stone-900 hover:text-white"
              >
                Cómo llegar
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
