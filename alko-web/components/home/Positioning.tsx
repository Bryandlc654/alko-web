/** Tesis corta de posicionamiento: dirección de obra y coordinación técnica. */
export default function Positioning() {
  return (
    <section aria-label="Posicionamiento" className="bg-paper text-ink">
      <div className="site-wrap">
        <div className="grid grid-cols-1 gap-6 border-b border-line py-[clamp(50px,6vw,90px)] md:grid-cols-2 md:gap-20">
          <p className="reveal-item display-title max-w-[750px] text-[clamp(27px,3vw,43px)] leading-[1.28] tracking-[-0.05em]">
            Una empresa constructora con sensibilidad arquitectónica y una sola dirección de ejecución.
          </p>
          <p
            className="reveal-item max-w-[470px] self-end text-[15px] leading-[1.95] text-mid md:justify-self-end"
            style={{ transitionDelay: "120ms" }}
          >
            Entendemos la obra como un proceso de decisiones coordinadas. Desde el replanteo y las
            instalaciones hasta los acabados, trabajamos para transformar una intención de diseño en un
            espacio construido.
          </p>
        </div>
      </div>
    </section>
  );
}
