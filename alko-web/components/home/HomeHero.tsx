import Image from "next/image";
import Link from "next/link";
import ContactTrigger from "@/components/contact/ContactTrigger";
import { ROUTES } from "@/lib/site";
import type { Slide } from "@/lib/types";

/**
 * Hero editorial a sangre: una sola imagen real, sin autoplay, con el titular
 * sobre la fotografía. (El brief proponía un 52/48; el cliente prefiere no dividirlo.)
 */
export default function HomeHero({ image }: { image?: Slide }) {
  return (
    <header className="hero relative isolate flex min-h-[640px] w-full flex-col overflow-hidden bg-ink text-white h-[100svh] max-h-[1000px]">
      {image && (
        <div id="hero-slider" className="absolute inset-0 -z-20">
          <Image
            src={image.image}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      )}
      {/* Velado para la legibilidad del titular, más denso abajo a la izquierda */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/25 to-black/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />

      <div className="site-wrap flex flex-1 flex-col justify-end pb-10 pt-32 sm:pb-12">
        <div className="max-w-[920px]">
          <p className="eyebrow eyebrow-light">ALKO / Construcción y arquitectura técnica / Madrid</p>
          <h1 className="display-title mt-6 text-[clamp(48px,7vw,112px)] leading-[1.02] tracking-[-0.07em]">
            Construimos
            <br />
            espacios que <span className="font-normal text-bronze-light">permanecen.</span>
          </h1>
          <p className="mt-7 max-w-[520px] text-[15px] leading-[1.85] text-white/85 sm:text-base">
            Construcción integral y coordinación técnica para viviendas, espacios corporativos y
            proyectos singulares. Una ejecución cuidada desde el primer planteamiento hasta la entrega.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={ROUTES.projects} className="btn btn-paper">
              Explorar proyectos <span aria-hidden="true">↗</span>
            </Link>
            <ContactTrigger mode="avanzado" source="Portada" className="btn btn-ghost-light">
              Presentar proyecto <span aria-hidden="true">↗</span>
            </ContactTrigger>
          </div>
        </div>

        <div className="mt-14 flex items-center justify-between gap-6 border-t border-white/25 pt-5 text-[10px] uppercase tracking-[0.14em] text-white/70">
          <span>Construcción con criterio</span>
          <span className="hidden sm:inline">Arquitectura · Materialidad · Precisión</span>
          <span>Madrid · España</span>
        </div>
      </div>
    </header>
  );
}
