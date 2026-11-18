import Image from "next/image";
import ContactTrigger from "@/components/contact/ContactTrigger";

/** Banda de manifiesto: foto a sangre con un bloque translúcido y otro carbón (propuesta 6 · V5). */
export default function ManifestoBand() {
  return (
    <section aria-label="Manifiesto" className="relative min-h-[640px] overflow-hidden text-white md:h-[86vh] md:max-h-[820px]">
      <Image src="/manifiesto-comedor.jpg" alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/20" />
      <svg
        className="absolute bottom-24 left-[var(--gutter)] hidden w-24 text-white/80 md:block"
        viewBox="0 0 100 210"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M2 2l96 56v40L2 42zM2 62l96 56v90H2V150l50 28v-26L2 124z" />
      </svg>
      <div className="site-wrap relative flex h-full min-h-[640px] items-center justify-center py-24 md:min-h-0">
        <div className="reveal-item w-full max-w-[505px]">
          <div className="bg-white/35 p-6 backdrop-blur-md md:p-7">
            <p className="display-title text-[40px] leading-[1.02] text-ink md:text-[56px]">
              Construimos hoy espacios que permanecen mañana
            </p>
          </div>
          <div className="ml-auto w-[min(100%,280px)] bg-ink text-paper">
            <p className="p-5 text-[15px] leading-snug text-paper/80">
              Coordinamos arquitectura, oficios e instalaciones para entregar espacios bien resueltos y duraderos.
            </p>
            <ContactTrigger
              mode="avanzado"
              source="Portada · Manifiesto"
              className="group mt-2 flex items-stretch justify-between border-t border-paper/15 text-[11px] uppercase tracking-[0.22em]"
            >
              <span className="px-5 py-4 transition-colors group-hover:text-piedra">Hablar con el equipo</span>
              <span className="grid w-[52px] place-items-center bg-bronze" aria-hidden="true">
                →
              </span>
            </ContactTrigger>
          </div>
        </div>
      </div>
    </section>
  );
}
