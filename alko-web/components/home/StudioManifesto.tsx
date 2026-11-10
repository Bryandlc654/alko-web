import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/site";

/**
 * Estudio: filosofía y acceso a equipo. El brief pide equipo real y evidencias
 * autorizadas, así que aquí no se muestran nombres ni cifras sin validar.
 */
export default function StudioManifesto() {
  return (
    <section id="estudio" className="grid grid-cols-1 bg-ink text-paper md:grid-cols-[54%_46%] md:min-h-[540px]">
      <div className="px-[var(--gutter)] py-[clamp(64px,8vw,125px)]">
        <p className="eyebrow eyebrow-light reveal-item">04 / Estudio</p>
        <h2 className="reveal-item display-title my-8 max-w-[850px] text-[clamp(43px,5.7vw,87px)] tracking-[-0.068em]">
          La calidad no se promete. Se demuestra en la obra.
        </h2>
        <p className="reveal-item max-w-[515px] text-sm leading-[1.85] text-[#C7C1B8]">
          Preferimos una memoria constructiva precisa, un equipo organizado y un resultado visible a
          cualquier declaración grandilocuente.
        </p>
        <div className="reveal-item mt-9 flex flex-wrap gap-x-10 gap-y-5">
          <Link href={ROUTES.company} className="arrow-link text-paper">
            Conocer ALKO <span aria-hidden="true">↗</span>
          </Link>
          <Link href={ROUTES.team} className="arrow-link text-paper">
            Ver el equipo <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
      <div className="relative min-h-[340px] overflow-hidden">
        <Image
          src="/proceso-coordinacion.jpg"
          alt="Coordinación de obra"
          fill
          sizes="(max-width: 768px) 100vw, 46vw"
          className="object-cover saturate-[.7]"
        />
      </div>
    </section>
  );
}
