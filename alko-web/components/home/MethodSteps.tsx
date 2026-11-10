import Link from "next/link";
import { METHOD_STEPS } from "@/lib/divisions";
import { METHOD_HREF } from "@/lib/site";

/** Método ALKO en cinco etapas, con la introducción fija al hacer scroll. */
export default function MethodSteps() {
  return (
    <section id="metodo" className="section-y bg-paper text-ink">
      <div className="site-wrap grid grid-cols-1 gap-10 lg:grid-cols-[43%_1fr] lg:gap-[75px]">
        <div className="reveal-item self-start lg:sticky lg:top-[130px]">
          <p className="eyebrow">03 / El método ALKO</p>
          <h2 className="display-title mb-6 mt-4 text-[clamp(44px,5vw,76px)] tracking-[-0.065em]">
            La diferencia está en cómo se ejecuta.
          </h2>
          <p className="max-w-[430px] text-[15px] leading-[1.85] text-mid">
            La calidad comienza mucho antes de elegir materiales. Está en el alcance, la planificación, la
            coordinación de los equipos y el seguimiento de cada decisión.
          </p>
          <Link href={METHOD_HREF} className="arrow-link mt-8">
            Conocer nuestro método <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <ol className="border-t border-line">
          {METHOD_STEPS.map((step) => (
            <li
              key={step.num}
              className="reveal-item grid grid-cols-[48px_1fr] gap-4 border-b border-line py-8 sm:grid-cols-[64px_1fr]"
            >
              <span className="pt-1.5 text-xs text-bronze">{step.num}</span>
              <div>
                <h3 className="display-title text-[25px] font-normal tracking-[-0.045em]">{step.title}</h3>
                <p className="mt-2 max-w-[570px] text-[13px] leading-[1.85] text-mid">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
