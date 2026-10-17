import Image from "next/image";

const RETO_BADGES = ["Climatización", "Ventilación", "Red de Datos", "Acabados H2"];

export default function Experience() {
  return (
    <section
      id="experiencia"
      className="relative bg-white text-stone-900 border-t border-stone-200/80"
      style={{ height: "230vh" }}
    >
      <div
        id="expand-sticky-viewport"
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between"
      >
        <div className="absolute inset-0 pointer-events-none z-0 flex">
          <div className="w-[6%] sm:w-[5%] lg:w-[4%] h-full border-r border-stone-300/60 relative hidden sm:block">
            <div className="absolute bottom-10 left-3 lg:left-4 opacity-20 text-stone-500">
              <svg
                className="w-8 h-8"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path d="M4 6v22h22" />
                <path d="M6 26L26 6" />
              </svg>
            </div>
          </div>
          <div className="w-full lg:w-[46%] h-full border-r border-stone-300/60 relative" />
          <div className="hidden lg:block w-[38%] h-full border-r border-stone-300/60 relative" />
          <div className="hidden lg:block flex-1 h-full relative" />
        </div>

        <div className="relative z-10 w-full h-full flex flex-col lg:flex-row">
          <div
            id="expand-image-container"
            className="w-full lg:w-[50%] h-[42vh] lg:h-full relative overflow-hidden"
          >
            <div
              id="expand-img-box"
              className="absolute overflow-hidden shadow-sm"
              style={{ width: 310, height: 410, left: 40, bottom: 40 }}
            >
              <Image
                id="expand-target-image"
                src="/90dias.jpg"
                alt="ALKO Terraza y horizonte arquitectónico"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center brightness-[0.98] contrast-[1.02]"
              />
            </div>
          </div>

          <div className="w-full lg:w-[50%] h-[58vh] lg:h-full relative flex flex-col justify-center px-6 sm:px-12 lg:px-16 overflow-hidden">
            <div
              id="expand-stage-1"
              className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16 transition-opacity duration-150"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-2xl">
                <div className="flex flex-col justify-start">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-stone-500 uppercase block mb-1">
                    01 / CONTEXTO
                  </span>
                  <h4 className="font-serif font-light text-xl sm:text-2xl text-stone-900 mb-3 tracking-tight leading-snug">
                    El Proyecto
                  </h4>
                  <p className="font-sans text-base sm:text-lg text-stone-600 font-light leading-relaxed tracking-normal">
                    Transformación arquitectónica e infraestructural completa de sede corporativa
                    de dos plantas en Madrid para Start Research, requiriendo operatividad
                    continua, áreas de trabajo abiertas y laboratorios analíticos.
                  </p>
                </div>

                <div className="flex flex-col justify-start">
                  <div className="space-y-3">
                    <div>
                      <span className="font-mono text-[11px] tracking-[0.2em] text-stone-500 uppercase block mb-1">
                        02 / CONDICIONANTES REALES
                      </span>
                      <h4 className="font-serif font-light text-xl sm:text-2xl text-stone-900 mb-2 tracking-tight leading-snug">
                        El Reto
                      </h4>
                    </div>
                    <p className="font-sans text-base sm:text-lg text-stone-600 font-light leading-relaxed tracking-normal">
                      Plazo de entrega inamovible de 90 días naturales, convivencia con normativas
                      acústicas estrictas e integración de complejas redes de ventilación y
                      cableado de datos en alturas de falso techo limitadas.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {RETO_BADGES.map((badge) => (
                        <span
                          key={badge}
                          className="px-2.5 py-1 text-[10px] uppercase font-sans border border-stone-300 rounded-full text-stone-700 bg-stone-100/60"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              id="expand-stage-2"
              className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16 opacity-0 pointer-events-none transition-opacity duration-150"
            >
              <div className="w-full max-w-xl flex flex-col space-y-6 sm:space-y-7">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between gap-4 sm:gap-8">
                    <div className="flex-shrink-0 text-stone-800">
                      <svg
                        className="w-9 h-9 sm:w-11 sm:h-11"
                        viewBox="0 0 48 48"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 29a14 14 0 0 1 22-10" strokeDasharray="1.5 2.5" />
                        <path d="M9 33a17 17 0 0 1 27-13" />
                        <path d="M14 31a9 9 0 0 1 12-6" />
                        <circle cx="33" cy="15" r="2.5" />
                        <circle cx="33" cy="15" r="1" fill="currentColor" />
                        <line x1="33" y1="12" x2="33" y2="8" />
                        <line x1="33" y1="17.5" x2="25" y2="35" />
                        <line x1="33" y1="17.5" x2="41" y2="35" />
                        <circle cx="25" cy="35" r="1.5" />
                        <circle cx="41" cy="35" r="1.5" />
                        <path d="M28 27h10" />
                      </svg>
                    </div>

                    <div className="flex-1 flex flex-col pl-2 sm:pl-3">
                      <span className="font-serif text-xs sm:text-sm text-stone-600 font-normal">
                        03 / QUÉ EJECUTÓ ALKO · EL ALCANCE
                      </span>
                      <div className="flex items-baseline">
                        <span
                          id="metric-num-clients"
                          className="font-sans text-5xl sm:text-6xl lg:text-7xl font-light text-stone-900 tracking-tight leading-none"
                        >
                          90
                        </span>
                        <span className="text-2xl sm:text-3xl font-light text-stone-900 ml-1.5">
                          Días
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 self-center">
                      <span className="inline-block px-3.5 sm:px-4 py-1 rounded-full border border-stone-400/90 text-stone-800 text-[10px] sm:text-[11px] font-normal tracking-wide uppercase">
                        El Reto
                      </span>
                    </div>
                  </div>

                  <p className="font-sans text-base sm:text-lg text-stone-600 font-light leading-relaxed tracking-normal pl-11 sm:pl-14">
                    Demolición selectiva, tabiquería técnica, climatización VRF simultánea,
                    renovación forzada de aire, distribución de fibra óptica y cableado
                    estructurado, carpinterías a medida y acabados de especificación H2.
                  </p>
                </div>

                <div className="border-b border-dotted border-stone-300 w-full" />

                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between gap-4 sm:gap-8">
                    <div className="flex-shrink-0 text-stone-800">
                      <svg
                        className="w-9 h-9 sm:w-11 sm:h-11"
                        viewBox="0 0 48 48"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 12v24c0 2 1.5 3 3 3h22c2 0 3-1.5 3-3V12c0-2-1.5-3-3-3H15c-2 0-3 1.5-3 3z" />
                        <path d="M15 9v30" />
                        <path d="M37 9v30" />
                        <path d="M37 36c1.5 0 3 1 3 2.5s-1.5 2.5-3 2.5-3-1-3-2.5V12" />
                        <rect x="18" y="16" width="16" height="16" />
                        <line x1="18" y1="22" x2="26" y2="22" />
                        <line x1="26" y1="16" x2="26" y2="26" />
                        <line x1="22" y1="26" x2="30" y2="26" />
                      </svg>
                    </div>

                    <div className="flex-1 flex flex-col pl-2 sm:pl-3">
                      <span className="font-serif text-xs sm:text-sm text-stone-600 font-normal">
                        04 / DECISIONES TÉCNICAS · LA SOLUCIÓN
                      </span>
                      <div className="flex items-baseline">
                        <span
                          id="metric-num-awards"
                          className="font-sans text-5xl sm:text-6xl lg:text-7xl font-light text-stone-900 tracking-tight leading-none"
                        >
                          2
                        </span>
                        <span className="text-2xl sm:text-3xl font-light text-stone-900 ml-1.5">
                          Plantas
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 self-center">
                      <span className="inline-block px-3.5 sm:px-4 py-1 rounded-full border border-stone-400/90 text-stone-800 text-[10px] sm:text-[11px] font-normal tracking-wide uppercase">
                        La Solución
                      </span>
                    </div>
                  </div>

                  <p className="font-sans text-base sm:text-lg text-stone-600 font-light leading-relaxed tracking-normal pl-11 sm:pl-14">
                    Una única dirección facultativa que coordinó en paralelo compras críticas de
                    maquinaria e ingeniería de trazados en plenum, neutralizando desviaciones y
                    entregando la obra con verificación técnica total antes del plazo fijado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
