import Link from "next/link";
import Image from "@/components/ui/Image";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Container from "@/components/ui/Container";
import Lightbox from "@/components/ui/Lightbox";
import Prose from "@/components/ui/Prose";
import QuickContactForm from "@/components/ui/QuickContactForm";
import ExclusiveSeal, { EXCLUSIVE_GOLD } from "@/components/ui/ExclusiveSeal";
import { ROUTES } from "@/lib/site";
import { splitLead } from "@/lib/utils";
import { projectCta } from "@/lib/project-cta";
import type { Project, Sector, SiteSettings } from "@/lib/types";

const IVORY = "#f5f1e8";
const ROMAN = ["I", "II", "III", "IV"];

/** Filete dorado con un rombo en el centro, separador de la plantilla exclusiva. */
function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-4 ${className}`}>
      <span className="h-px w-16 sm:w-24" style={{ backgroundColor: EXCLUSIVE_GOLD }} />
      <span className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: EXCLUSIVE_GOLD }} />
      <span className="h-px w-16 sm:w-24" style={{ backgroundColor: EXCLUSIVE_GOLD }} />
    </div>
  );
}

function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`block font-mono text-[10px] sm:text-[11px] tracking-[0.35em] uppercase ${className}`}
      style={{ color: EXCLUSIVE_GOLD }}
    >
      {children}
    </span>
  );
}

/**
 * Plantilla de página para los proyectos ALKO Exclusiva: más editorial y sobria que la normal,
 * con portada centrada, sello, relato por capítulos, galería sobre fondo oscuro y una llamada
 * a la acción propia. Cada bloque solo aparece si el proyecto tiene ese contenido.
 */
export default function ExclusiveProject({
  project,
  servicio,
  neighbours,
  settings,
}: {
  project: Project;
  servicio: Sector | null;
  neighbours: { label: string; project: Project; arrow: string }[];
  settings: SiteSettings;
}) {
  const whatsappHref = `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`;
  const { lead, rest } = splitLead(project.content || "");
  const fotoAntes = project.fotoAntes?.trim();
  const fotoDespues = project.fotoDespues?.trim();
  const fotos = [project.fotoDespues, ...project.galeria, project.imagen]
    .map((src) => src?.trim())
    .filter((src, i, all): src is string => !!src && all.indexOf(src) === i && src !== fotoAntes);
  // Fotos para los capítulos: ni la portada ni la panorámica (fotos[0]) si hay otras.
  const capituloFotos = fotos.slice(1).filter((src) => src !== project.imagen);
  const fotoCapitulo = (i: number) => capituloFotos[i] || fotos[i % Math.max(fotos.length, 1)] || project.imagen;

  const ficha = [
    ["Ubicación", project.ubicacion],
    ["Tipología", project.tipologia],
    ["Superficie", project.superficie],
    ["Plazo", project.plazo],
    ["Año", project.anio],
  ].filter(([, value]) => value);

  const capitulos = [
    { titulo: "El encargo", texto: project.reto },
    { titulo: "La solución", texto: project.solucion },
    { titulo: "El resultado", texto: project.resultado },
  ].filter((c) => c.texto?.trim());

  const alcance = (project.alcance || []).filter(Boolean);
  const materiales = (project.materiales || []).filter((m) => m.elemento || m.detalle);
  const cifras = (project.cifras || []).filter((c) => c.valor);
  const cta = projectCta(project);

  return (
    <main className="bg-stone-950 text-white">
      {/* Portada: foto a sangre, sello y título centrados */}
      <header className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
        <Image src={project.imagen} alt={project.title} fill priority sizes="100vw" className="-z-10 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-stone-950/55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-stone-950/70 via-transparent to-stone-950" />

        <Container className="pt-32 sm:pt-40">
          <Breadcrumbs items={[{ label: "Proyectos", href: ROUTES.projects }, { label: project.title }]} />
        </Container>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
          <ExclusiveSeal size={128} className="reveal-item" />
          <Eyebrow className="reveal-item mt-10">
            ALKO Exclusiva{project.ubicacion ? ` · ${project.ubicacion}` : ""}
          </Eyebrow>
          <h1 className="reveal-item mt-6 max-w-5xl font-serif text-4xl font-light leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
            {project.title}
          </h1>
          <GoldDivider className="reveal-item mt-10" />
          {(project.tipologia || project.anio) && (
            <p className="reveal-item mt-6 font-serif text-lg font-light text-white/70 sm:text-xl">
              {[project.tipologia, project.anio].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        <div className="pb-10 text-center">
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/50">Descubrir el proyecto</span>
          <span aria-hidden="true" className="mx-auto mt-4 block h-12 w-px bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </header>

      {/* Presentación y ficha */}
      <section className="py-24 sm:py-32">
        <Container>
          {lead && (
            <p className="reveal-item mx-auto max-w-4xl text-center font-serif text-2xl font-light leading-snug tracking-tight text-white/90 sm:text-3xl lg:text-4xl">
              {lead}
            </p>
          )}

          {ficha.length > 0 && (
            <dl
              className={`reveal-item mx-auto grid max-w-5xl grid-cols-2 gap-y-10 border-y border-white/10 py-10 sm:grid-cols-3 lg:grid-cols-5 ${lead ? "mt-20" : ""}`}
            >
              {ficha.map(([label, value]) => (
                <div key={label} className="px-4 text-center">
                  <dt className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: EXCLUSIVE_GOLD }}>
                    {label}
                  </dt>
                  <dd className="mt-3 font-serif text-lg font-light text-white sm:text-xl">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {(project.cliente || servicio) && (
            <p className="mt-8 text-center text-sm font-light text-white/50">
              {project.cliente}
              {project.cliente && servicio ? " · " : ""}
              {servicio && (
                <Link
                  href={`${ROUTES.sectors}/${servicio.slug}`}
                  className="underline decoration-white/30 underline-offset-4 transition hover:text-white"
                >
                  {servicio.title}
                </Link>
              )}
            </p>
          )}
        </Container>
      </section>

      {/* Imagen panorámica */}
      {fotos[0] && (
        <div className="reveal-scale relative h-[60vh] min-h-[380px] w-full overflow-hidden sm:h-[80vh]">
          <Image src={fotos[0]} alt={`${project.title}, vista general`} fill sizes="100vw" className="object-cover object-center" />
        </div>
      )}

      {/* Relato por capítulos, sobre marfil, con fotos alternas */}
      {capitulos.length > 0 && (
        <section className="text-stone-900" style={{ backgroundColor: IVORY }}>
          <Container className="space-y-24 py-24 sm:space-y-32 sm:py-32">
            {capitulos.map((cap, i) => {
              const reversed = i % 2 === 1;
              return (
                <article key={cap.titulo} className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
                  <div className={`reveal-item lg:col-span-5 ${reversed ? "lg:order-2" : ""}`}>
                    <span className="font-serif text-6xl font-light leading-none sm:text-7xl" style={{ color: EXCLUSIVE_GOLD }}>
                      {ROMAN[i]}
                    </span>
                    <h2 className="mt-6 font-serif text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl">{cap.titulo}</h2>
                    <span aria-hidden="true" className="mt-8 block h-px w-12" style={{ backgroundColor: EXCLUSIVE_GOLD }} />
                    <p className="mt-8 whitespace-pre-line text-lg font-light leading-relaxed text-stone-700">{cap.texto}</p>
                  </div>
                  <div className={`reveal-scale lg:col-span-7 ${reversed ? "lg:order-1" : ""}`}>
                    <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[4/3]">
                      <Image
                        src={fotoCapitulo(i)}
                        alt={`${project.title}: ${cap.titulo.toLowerCase()}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="object-cover object-center"
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </Container>
        </section>
      )}

      {/* Memoria completa, si el proyecto la tiene y no se ha contado por capítulos */}
      {capitulos.length === 0 && rest && (
        <section className="text-stone-900" style={{ backgroundColor: IVORY }}>
          <Container className="py-24 sm:py-32">
            <div className="mx-auto max-w-3xl">
              <Prose html={rest} variant="article" />
            </div>
          </Container>
        </section>
      )}

      {/* Cifras */}
      {cifras.length > 0 && (
        <section className="border-b border-white/10 py-20 sm:py-24">
          <Container>
            <dl className="grid grid-cols-2 gap-10 text-center lg:grid-cols-4">
              {cifras.slice(0, 4).map((c) => (
                <div key={`${c.valor}-${c.etiqueta}`} className="reveal-item">
                  <dt className="sr-only">{c.etiqueta}</dt>
                  <dd>
                    <span className="block font-serif text-5xl font-light sm:text-6xl" style={{ color: EXCLUSIVE_GOLD }}>
                      {c.valor}
                    </span>
                    <span className="mt-3 block text-sm font-light text-white/60">{c.etiqueta}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      )}

      {/* Alcance y materiales */}
      {(alcance.length > 0 || materiales.length > 0) && (
        <section className="py-24 sm:py-32">
          <Container>
            <div className="text-center">
              <Eyebrow>La obra en detalle</Eyebrow>
              <h2 className="mt-5 font-serif text-3xl font-light tracking-tight sm:text-5xl">Alcance y acabados</h2>
              <GoldDivider className="mt-8" />
            </div>
            <div className={`mt-16 grid grid-cols-1 gap-16 ${alcance.length > 0 && materiales.length > 0 ? "lg:grid-cols-2" : "mx-auto max-w-3xl"}`}>
              {alcance.length > 0 && (
                <ul className="reveal-item border-t border-white/10">
                  {alcance.map((item, i) => (
                    <li key={`${item}-${i}`} className="flex gap-6 border-b border-white/10 py-5">
                      <span className="font-mono text-[11px] tracking-[0.2em]" style={{ color: EXCLUSIVE_GOLD }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-light leading-relaxed text-white/85">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {materiales.length > 0 && (
                <dl className="reveal-item border-t border-white/10">
                  {materiales.map((m, i) => (
                    <div key={`${m.elemento}-${i}`} className="grid grid-cols-1 gap-1 border-b border-white/10 py-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6">
                      <dt className="font-serif text-lg text-white">{m.elemento}</dt>
                      <dd className="font-light leading-relaxed text-white/65">{m.detalle}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Antes y después */}
      {fotoAntes && fotoDespues && (
        <section className="text-stone-900" style={{ backgroundColor: IVORY }}>
          <Container className="py-24 sm:py-32">
            <div className="text-center">
              <Eyebrow>Transformación</Eyebrow>
              <h2 className="mt-5 font-serif text-3xl font-light tracking-tight sm:text-5xl">Antes y después</h2>
            </div>
            <Lightbox className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {[
                { src: fotoAntes, label: "Antes", extra: "grayscale" },
                { src: fotoDespues, label: "Después", extra: "" },
              ].map((f) => (
                <figure key={f.label} className="reveal-scale">
                  <button
                    type="button"
                    data-lightbox-src={f.src}
                    data-lightbox-alt={`${project.title} · ${f.label}`}
                    aria-label={`Ver foto de ${f.label.toLowerCase()} en grande`}
                    className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden"
                  >
                    <Image src={f.src} alt={`${project.title}, ${f.label.toLowerCase()}`} fill sizes="(max-width: 640px) 100vw, 50vw" className={`object-cover ${f.extra}`} />
                  </button>
                  <figcaption className="mt-4 text-center font-mono text-[10px] tracking-[0.35em] uppercase text-stone-500">
                    {f.label}
                  </figcaption>
                </figure>
              ))}
            </Lightbox>
          </Container>
        </section>
      )}

      {/* Galería */}
      {fotos.length > 1 && (
        <section className="py-24 sm:py-32">
          <Container>
            <div className="text-center">
              <Eyebrow>Galería</Eyebrow>
              <h2 className="mt-5 font-serif text-3xl font-light tracking-tight sm:text-5xl">El proyecto en imágenes</h2>
              <GoldDivider className="mt-8" />
            </div>
            <Lightbox className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-6 sm:gap-6">
              {fotos.map((src, i) => {
                // Ritmo editorial: una ancha, dos medias, repetir.
                const wide = i % 3 === 0;
                return (
                  <figure key={`${src}-${i}`} className={`reveal-scale group relative overflow-hidden ${wide ? "sm:col-span-6 aspect-[16/9]" : "sm:col-span-3 aspect-[4/5]"}`}>
                    <button
                      type="button"
                      data-lightbox-src={src}
                      data-lightbox-alt={`${project.title} · Imagen ${i + 1}`}
                      aria-label={`Ver imagen ${i + 1} en grande`}
                      className="absolute inset-0 cursor-zoom-in"
                    >
                      <Image
                        src={src}
                        alt={`${project.title}, imagen ${i + 1}`}
                        fill
                        sizes={wide ? "100vw" : "(max-width: 640px) 100vw, 50vw"}
                        className="object-cover transition duration-1000 ease-out group-hover:scale-[1.03]"
                      />
                    </button>
                  </figure>
                );
              })}
            </Lightbox>
          </Container>
        </section>
      )}

      {/* Reseña del cliente */}
      {project.resenaTexto?.trim() && (
        <section aria-labelledby="resena-exclusiva" className="border-t border-white/10 py-24 sm:py-32">
          <Container>
            <figure className="reveal-item mx-auto max-w-4xl text-center">
              <h2 id="resena-exclusiva">
                <Eyebrow>Lo que dice el cliente</Eyebrow>
              </h2>
              {!!project.resenaValoracion && (
                <div className="mt-8 flex justify-center gap-1.5" role="img" aria-label={`${project.resenaValoracion} de 5 estrellas`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg key={i} viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" style={{ fill: i < (project.resenaValoracion || 0) ? EXCLUSIVE_GOLD : "rgba(255,255,255,0.2)" }}>
                      <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z" />
                    </svg>
                  ))}
                </div>
              )}
              <blockquote className="mt-10 font-serif text-2xl font-light leading-snug tracking-tight text-white sm:text-3xl lg:text-4xl">
                «{project.resenaTexto.trim()}»
              </blockquote>
              {(project.resenaAutor || project.resenaCargo) && (
                <figcaption className="mt-10">
                  <GoldDivider />
                  {project.resenaAutor && <span className="mt-6 block font-serif text-lg text-white">{project.resenaAutor}</span>}
                  {project.resenaCargo && (
                    <span className="mt-1 block font-mono text-[10px] tracking-[0.3em] uppercase text-white/50">{project.resenaCargo}</span>
                  )}
                </figcaption>
              )}
            </figure>
          </Container>
        </section>
      )}

      {/* Contacto con el equipo de ALKO Exclusiva: texto a la izquierda, formulario abierto a la derecha */}
      <section id="contacto-exclusiva" aria-labelledby="contacto-exclusiva-title" className="relative isolate overflow-hidden">
        <Image src={fotos[fotos.length - 1] || project.imagen} alt="" fill sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-stone-950/85" />
        <Container className="py-24 sm:py-32">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_420px] lg:gap-20">
            <div className="text-center lg:text-left">
              <ExclusiveSeal size={84} className="mx-auto lg:mx-0" />
              <Eyebrow className="mt-10 block">Equipo ALKO Exclusiva</Eyebrow>
              <h2
                id="contacto-exclusiva-title"
                className="mx-auto mt-5 max-w-2xl whitespace-pre-line font-serif text-3xl font-light leading-tight tracking-tight sm:text-5xl lg:mx-0"
              >
                {cta.titulo}
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-white/70 sm:text-lg lg:mx-0">{cta.texto}</p>
              <GoldDivider className="mt-10 lg:justify-start" />
              <p className="mt-8 text-sm font-light text-white/60">
                O llámanos al{" "}
                <a href={`tel:${settings.telefono.replace(/[^+\d]/g, "")}`} className="text-white underline decoration-[#c6a66b] underline-offset-4">
                  {settings.telefono}
                </a>
              </p>
            </div>

            <div className="border p-7 sm:p-9" style={{ borderColor: EXCLUSIVE_GOLD, backgroundColor: "rgba(12,10,9,0.7)" }}>
              <span className="block font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: EXCLUSIVE_GOLD }}>
                Contacto reservado
              </span>
              <h3 className="mt-2 mb-6 font-serif text-2xl font-light leading-tight tracking-tight text-white">{cta.boton}</h3>
              <QuickContactForm compact source={`ALKO Exclusiva · ${project.title}`} email={settings.email} whatsappHref={whatsappHref} />
            </div>
          </div>
        </Container>
      </section>

      {/* Más proyectos */}
      {neighbours.length > 0 && (
        <nav aria-label="Más proyectos" className="border-t border-white/10">
          <div className={`grid grid-cols-1 ${neighbours.length > 1 ? "md:grid-cols-2" : ""}`}>
            {neighbours.map(({ label, project: other, arrow }, i) => (
              <Link
                key={other.id}
                href={`${ROUTES.projects}/${other.slug}`}
                className={`group flex items-center gap-6 border-white/10 px-6 py-10 transition hover:bg-white/[0.03] sm:px-12 sm:py-14 ${i === 1 ? "md:justify-end md:border-l md:text-right" : ""}`}
              >
                <div>
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/50">
                    {arrow === "←" ? `${arrow} ${label}` : `${label} ${arrow}`}
                  </span>
                  <span className="mt-3 block font-serif text-2xl font-light tracking-tight transition group-hover:text-[#c6a66b] sm:text-3xl">
                    {other.title}
                  </span>
                  {other.exclusivo && <Eyebrow className="mt-2">ALKO Exclusiva</Eyebrow>}
                </div>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </main>
  );
}
