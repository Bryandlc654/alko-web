import Image from "next/image";
import ContactTrigger from "@/components/contact/ContactTrigger";
import type { SiteSettings } from "@/lib/types";

export default function ContactCta({ settings }: { settings: SiteSettings }) {
  const telHref = `tel:${settings.telefono.replace(/[^+\d]/g, "")}`;
  const mailto = `mailto:${settings.email}?subject=Nueva%20Consulta%20Tecnica%20ALKO`;

  return (
    <section id="contacto" className="relative w-full overflow-hidden bg-stone-950 group">
      <div className="relative w-full h-[520px] sm:h-[580px] md:h-[640px] lg:h-[700px] overflow-hidden">
        <Image
          src="/cta-bg.jpg"
          alt="Hablemos de tu próximo proyecto"
          fill
          sizes="100vw"
          className="w-full h-full object-cover object-top select-none pointer-events-none transition-transform duration-1000 ease-out group-hover:scale-[1.01]"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent" />
        <div className="absolute inset-0 z-10 flex flex-col justify-between max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="pt-8 sm:pt-14 md:pt-18 lg:pt-20">
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] font-light font-display text-white tracking-[-0.03em] leading-[1.08] select-text">
              Hablemos de tu
              <br />
              próximo proyecto.
            </h2>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-6">
            <div className="space-y-5 max-w-xl">
              <p className="text-base sm:text-lg font-sans text-stone-200/90 font-light leading-relaxed max-w-lg drop-shadow-sm">
                Una única interlocución para coordinar arquitectura, compras, instalaciones y obra completa.
                Sin intermediarios ni imprevistos.
              </p>
              <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-7 gap-y-2.5 pt-1 text-xs font-light text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                <a href={telHref} className="inline-flex items-center gap-2 hover:text-white transition-colors">
                  <span className="text-white/70 font-mono text-[10px] uppercase tracking-wider">TEL</span>
                  <span className="tracking-wide">{settings.telefono}</span>
                </a>
                <span className="text-white/40 hidden sm:inline">•</span>
                <a href={mailto} className="inline-flex items-center gap-2 hover:text-white transition-colors">
                  <span className="text-white/70 font-mono text-[10px] uppercase tracking-wider">ESCRÍBENOS</span>
                  <span className="underline underline-offset-4 decoration-white/50 hover:decoration-white">
                    {settings.email}
                  </span>
                </a>
                <span className="text-white/40 hidden sm:inline">•</span>
                <div className="inline-flex items-center gap-2 text-white">
                  <span className="text-white/70 font-mono text-[10px] uppercase tracking-wider">VISÍTANOS</span>
                  <span>{settings.direccion}</span>
                </div>
              </div>
            </div>
            <div className="shrink-0 self-start lg:self-auto">
              <ContactTrigger mode="rapido" source="Cierre de página" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-full bg-amber-700 hover:bg-amber-800 text-white text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 border border-white/10 shrink-0 cursor-pointer">
                <span>SOLICITAR CONSULTORÍA</span>
                <span>→</span>
              </ContactTrigger>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
