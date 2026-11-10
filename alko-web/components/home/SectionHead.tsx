import type { ReactNode } from "react";

/** Cabecera de sección del sistema: etiqueta, titular grande y texto lateral. */
export default function SectionHead({
  eyebrow,
  title,
  text,
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: ReactNode;
  light?: boolean;
}) {
  return (
    <div className="mb-[clamp(28px,3.5vw,48px)] flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
      <div className="reveal-item">
        <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}>{eyebrow}</p>
        <h2 className="display-title mt-4 max-w-[850px] text-[clamp(40px,5.3vw,80px)] tracking-[-0.065em]">
          {title}
        </h2>
      </div>
      {text && (
        <p
          className={`reveal-item max-w-[320px] text-sm leading-[1.8] ${light ? "text-white/70" : "text-mid"}`}
          style={{ transitionDelay: "120ms" }}
        >
          {text}
        </p>
      )}
    </div>
  );
}
