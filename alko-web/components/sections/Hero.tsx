import Image from "@/components/ui/Image";
import ContactTrigger from "@/components/contact/ContactTrigger";
import QuickContactForm from "@/components/ui/QuickContactForm";
import type { HomeContent, SiteSettings, Slide } from "@/lib/types";

export default function Hero({
  slides,
  content,
  settings,
}: {
  slides: Slide[];
  content?: HomeContent;
  settings: SiteSettings;
}) {
  const whatsappHref = `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`;
  return (
    <header className="hero relative min-h-screen w-full flex flex-col justify-between overflow-hidden">
      {/* Slider de fondo con overlay cinematográfico arquitectónico */}
      <div id="hero-slider" className="absolute inset-0 -z-20 overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero-slide absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={i === 0}
              // Los demás slides no se ven al cargar: que no compitan con el primero.
              fetchPriority={i === 0 ? undefined : "low"}
              sizes="100vw"
              className={`object-cover object-center filter brightness-100 contrast-[1.01] transition-transform duration-[7000ms] ease-out ${
                i === 0 ? "scale-105" : "scale-100"
              }`}
            />
          </div>
        ))}

        {/* Velo oscuro + degradados: el texto se lee también sobre fotos claras */}
        <div className="absolute inset-0 bg-stone-950/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-stone-950/15 to-stone-950/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/55 via-stone-950/10 to-transparent" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 my-auto py-10 lg:py-16 mt-24 lg:mt-28">
        <div className="max-w-3xl">
          <div className="space-y-1 sm:space-y-2 drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight text-white leading-none font-display">
              {content?.heroTitulo ?? "Construcción"}
            </h1>
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight font-display font-sans">
              {content?.heroSubtitulo ?? "y reformas integrales en Madrid."}
            </p>
          </div>

          <p className="mt-8 sm:mt-10 max-w-xl text-base sm:text-lg font-normal text-white leading-relaxed tracking-normal font-sans drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {content?.heroDescripcion ?? "Ejecutamos proyectos residenciales y corporativos de alta exigencia, coordinando construcción, instalaciones, acabados y gestión técnica hasta la entrega final."}
          </p>
        </div>
      </div>

      {/* Barra inferior del hero (en escritorio deja sitio a la derecha para el formulario) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 pb-8 sm:pb-10 pt-4 flex items-center gap-3 sm:gap-4 mt-16 sm:mt-20 lg:mt-24 lg:pr-[440px]">
        <ContactTrigger mode="avanzado" source="Portada" className="inline-flex shrink-0 items-center justify-center px-5 sm:px-7 py-3 rounded-full border border-white/60 bg-stone-900/30 hover:bg-white/15 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold tracking-[0.12em] sm:tracking-[0.18em] whitespace-nowrap uppercase transition duration-300 shadow-sm active:scale-95">
          {content?.heroCtaTexto ?? "SOLICITAR PRESUPUESTO"}
        </ContactTrigger>

        {/* Flechas del slider, al lado del botón */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            id="prev-slide-btn"
            aria-label="Slide anterior"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl rounded-tr-sm border border-white/40 bg-stone-900/40 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition duration-200 group active:scale-95 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17L7 7M7 7v9M7 7h9" />
            </svg>
          </button>

          <button
            id="next-slide-btn"
            aria-label="Slide siguiente"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl rounded-bl-sm border border-white/40 bg-stone-900/40 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition duration-200 group active:scale-95 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7l10 10m0 0V8m0 9H8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Formulario rápido abierto: abajo a la derecha en escritorio, debajo de los botones en móvil */}
      {/* Pegado al borde inferior del hero */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:absolute lg:inset-x-0 lg:bottom-0 lg:pointer-events-none">
        <section
          aria-labelledby="hero-form-title"
          className="ml-auto w-full border border-b-0 border-white/15 bg-stone-950/60 p-6 text-white shadow-2xl backdrop-blur-md sm:max-w-md lg:pointer-events-auto lg:w-[380px]"
        >
          <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-amber-500">Contacto</span>
          <h2 id="hero-form-title" className="mt-2 mb-5 font-display text-2xl font-light leading-tight tracking-tight">
            Hablemos de tu proyecto
          </h2>
          <QuickContactForm compact source="Portada (formulario del hero)" email={settings.email} whatsappHref={whatsappHref} />
        </section>
      </div>
    </header>
  );
}
