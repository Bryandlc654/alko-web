import Link from "next/link";
import Image from "@/components/ui/Image";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Lightbox from "@/components/ui/Lightbox";
import Prose from "@/components/ui/Prose";
import QuickContactForm from "@/components/ui/QuickContactForm";
import ExclusiveSeal, { EXCLUSIVE_GOLD } from "@/components/ui/ExclusiveSeal";
import { ROUTES } from "@/lib/site";
import { splitLead } from "@/lib/utils";
import { projectCta } from "@/lib/project-cta";
import type { Project, Sector, SiteSettings } from "@/lib/types";

const IVORY = "#f3eee3";
const ROMAN = ["I", "II", "III", "IV", "V", "VI"];
const pad = (n: number) => String(n).padStart(2, "0");

/** Etiqueta pequeña en dorado. */
function Gold({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`text-[10px] uppercase tracking-[0.24em] ${className}`} style={{ color: EXCLUSIVE_GOLD }}>
      {children}
    </span>
  );
}

/** Filete dorado a todo el ancho con una marca en el centro. */
function Rule({ mark, className = "" }: { mark?: string; className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-5 ${className}`}>
      <span className="h-px flex-1" style={{ backgroundColor: `${EXCLUSIVE_GOLD}80` }} />
      {mark ? <Gold>{mark}</Gold> : <span className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: EXCLUSIVE_GOLD }} />}
      <span className="h-px flex-1" style={{ backgroundColor: `${EXCLUSIVE_GOLD}80` }} />
    </div>
  );
}

/** Foto enmarcada con un filete dorado interior y pie «Lámina». */
function Plate({
  src,
  alt,
  number,
  caption,
  aspect,
  sizes,
  priority = false,
  lightbox = false,
}: {
  src: string;
  alt: string;
  number: number;
  caption?: string;
  aspect: string;
  sizes: string;
  priority?: boolean;
  lightbox?: boolean;
}) {
  const img = (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-[1.8s] ease-alko group-hover:scale-[1.03]"
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-3 border sm:inset-4" style={{ borderColor: `${EXCLUSIVE_GOLD}99` }} />
    </>
  );
  return (
    <figure>
      {lightbox ? (
        <button
          type="button"
          data-lightbox-src={src}
          data-lightbox-alt={alt}
          aria-label={`Ver lámina ${number} en grande`}
          className={`group relative block w-full cursor-zoom-in overflow-hidden bg-stone-300 ${aspect}`}
        >
          {img}
        </button>
      ) : (
        <div className={`group relative overflow-hidden bg-stone-300 ${aspect}`}>{img}</div>
      )}
      <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-[10px] uppercase tracking-[0.24em] text-stone-500">
        <span>
          <span style={{ color: EXCLUSIVE_GOLD }}>Lámina {ROMAN[number - 1] || number}</span>
          {caption && <> · {caption}</>}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Plantilla de los proyectos ALKO Exclusiva, a modo de monografía impresa: papel marfil, filetes
 * dorados, portada partida (texto y sello a la izquierda, lámina a la derecha), relato por
 * capítulos con numeración romana, láminas numeradas sobre carbón y contacto reservado.
 * Cada bloque solo aparece si el proyecto tiene ese contenido.
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
  const cifras = (project.cifras || []).filter((c) => c.valor).slice(0, 4);
  const cta = projectCta(project);
  const tel = settings.telefono.replace(/[^+\d]/g, "");

  // Numeración continua de las láminas (portada = I).
  let plate = 1;
  const nextPlate = () => ++plate;

  return (
    <main className="text-ink" style={{ backgroundColor: IVORY }}>
      {/* Portada partida: texto y ficha a la izquierda, lámina a la derecha. */}
      <header>
        <div className="site-wrap pt-28 sm:pt-36 lg:pt-40">
          <div className="hh-rise flex items-center justify-between gap-6 border-b pb-5" style={{ borderColor: `${EXCLUSIVE_GOLD}66` }}>
            <Breadcrumbs
              items={[{ label: "Proyectos", href: ROUTES.projects }, { label: project.title }]}
              tone="dark"
              className="min-w-0"
            />
            <Gold className="hidden shrink-0 sm:inline">
              ALKO Exclusiva{project.indice ? ` · Nº ${project.indice}` : ""}
            </Gold>
          </div>

          <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-14 sm:mt-16 lg:gap-x-10">
            <div className="col-span-12 flex flex-col lg:col-span-5">
              <div className="hh-rise flex items-center gap-5">
                <ExclusiveSeal size={76} tone="dark" />
                <span className="flex flex-col gap-1">
                  <Gold>Monografía</Gold>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
                    {[project.tipologia, project.anio].filter(Boolean).join(" · ") || "ALKO Exclusiva"}
                  </span>
                </span>
              </div>

              <h1 className="hh-rise display-title mt-10 text-[2.8rem] leading-[0.98] tracking-[-0.04em] sm:text-6xl xl:text-[5.25rem]">
                {project.title}
              </h1>
              <span aria-hidden="true" className="hh-rise mt-10 block h-px w-20" style={{ backgroundColor: EXCLUSIVE_GOLD }} />

              {(ficha.length > 0 || project.cliente || servicio) && (
                <dl className="hh-rise mt-10 border-t border-ink/15 lg:mt-auto" style={{ animationDelay: ".15s" }}>
                  {ficha.map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-6 border-b border-ink/15 py-3.5">
                      <dt>
                        <Gold>{label}</Gold>
                      </dt>
                      <dd className="display-title text-right text-lg">{value}</dd>
                    </div>
                  ))}
                  {project.cliente && (
                    <div className="flex items-baseline justify-between gap-6 border-b border-ink/15 py-3.5">
                      <dt>
                        <Gold>Cliente</Gold>
                      </dt>
                      <dd className="text-right text-sm">{project.cliente}</dd>
                    </div>
                  )}
                  {servicio && (
                    <div className="flex items-baseline justify-between gap-6 border-b border-ink/15 py-3.5">
                      <dt>
                        <Gold>Servicio</Gold>
                      </dt>
                      <dd className="text-right text-sm">
                        <Link
                          href={`${ROUTES.sectors}/${servicio.slug}`}
                          className="underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-current"
                        >
                          {servicio.title} ↗
                        </Link>
                      </dd>
                    </div>
                  )}
                </dl>
              )}
            </div>

            {project.imagen && (
              <div className="hh-rise col-span-12 lg:col-span-7" style={{ animationDelay: ".2s" }}>
                <Plate
                  src={project.imagen}
                  alt={project.title}
                  number={1}
                  caption={project.ubicacion || "Portada"}
                  aspect="aspect-[4/5] sm:aspect-[5/4]"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Presentación: entradilla grande con capitular dorada. */}
      {lead && (
        <section className="site-wrap pt-24 sm:pt-32">
          <Rule mark="Presentación" />
          <div className="mt-12 grid grid-cols-12 gap-6">
            <p className="reveal-item display-title col-span-12 text-[1.75rem] leading-[1.2] tracking-[-0.02em] sm:text-4xl lg:col-span-9 lg:col-start-4 lg:text-[2.75rem]">
              <span className="float-left mr-3 mt-1 text-[3.4em] leading-[0.8]" style={{ color: EXCLUSIVE_GOLD }}>
                {lead.charAt(0)}
              </span>
              {lead.slice(1)}
            </p>
          </div>
        </section>
      )}

      {/* Lámina panorámica. */}
      {fotos[0] && (
        <div className="site-wrap reveal-scale pt-20 sm:pt-28">
          <Plate
            src={fotos[0]}
            alt={`${project.title}, vista general`}
            number={nextPlate()}
            caption="Vista general"
            aspect="aspect-[4/3] sm:aspect-[21/9]"
            sizes="100vw"
          />
        </div>
      )}

      {/* Capítulos: numeral romano y título, texto y lámina. */}
      {capitulos.length > 0 && (
        <section className="site-wrap pt-24 sm:pt-32">
          <Rule mark="El relato" />
          <div className="mt-4">
            {capitulos.map((cap, i) => {
              const reversed = i % 2 === 1;
              return (
                <article
                  key={cap.titulo}
                  className="grid grid-cols-12 items-start gap-x-6 gap-y-8 border-b border-ink/10 py-14 last:border-b-0 sm:py-20 lg:gap-x-10"
                >
                  <div className={`reveal-item col-span-12 lg:col-span-5 ${reversed ? "lg:order-2 lg:col-start-8" : ""}`}>
                    <div className="flex items-baseline gap-5">
                      <span className="display-title text-6xl leading-none sm:text-7xl" style={{ color: EXCLUSIVE_GOLD }}>
                        {ROMAN[i]}
                      </span>
                      <Gold>Capítulo</Gold>
                    </div>
                    <h2 className="display-title mt-6 text-3xl leading-tight sm:text-5xl">{cap.titulo}</h2>
                    <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-stone-600">{cap.texto}</p>
                  </div>
                  <div className={`reveal-scale col-span-12 lg:col-span-6 ${reversed ? "lg:order-1" : "lg:col-start-7"}`}>
                    <Plate
                      src={fotoCapitulo(i)}
                      alt={`${project.title}: ${cap.titulo.toLowerCase()}`}
                      number={nextPlate()}
                      caption={cap.titulo}
                      aspect="aspect-[4/5] sm:aspect-[4/3]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Memoria completa, si no se ha contado por capítulos. */}
      {capitulos.length === 0 && rest && (
        <section className="site-wrap pt-24 sm:pt-32">
          <Rule mark="Memoria" />
          <div className="mt-12 grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-7 lg:col-start-4">
              <Prose html={rest} variant="article" />
            </div>
          </div>
        </section>
      )}

      {/* Cifras sobre carbón, separadas por filetes dorados. */}
      {cifras.length > 0 && (
        <section className="mt-24 bg-ink text-paper sm:mt-32">
          <div className="site-wrap py-16 sm:py-20">
            <dl className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
              {cifras.map((c, i) => (
                <div
                  key={`${c.valor}-${i}`}
                  className={`reveal-item px-2 text-center ${i % 2 === 1 ? "border-l" : ""} ${i > 0 ? "lg:border-l" : ""}`}
                  style={{ borderColor: `${EXCLUSIVE_GOLD}55` }}
                >
                  <dt className="sr-only">{c.etiqueta}</dt>
                  <dd>
                    <span className="display-title block text-5xl leading-none sm:text-6xl" style={{ color: EXCLUSIVE_GOLD }}>
                      {c.valor}
                    </span>
                    <span className="mt-4 block text-[10px] uppercase tracking-[0.24em] text-paper/60">{c.etiqueta}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Alcance y acabados. */}
      {(alcance.length > 0 || materiales.length > 0) && (
        <section className="site-wrap pt-24 sm:pt-32">
          <Rule mark="La obra en detalle" />
          <h2 className="reveal-item display-title mt-12 text-4xl sm:text-5xl lg:text-6xl">Alcance y acabados</h2>
          <div className={`mt-12 grid grid-cols-1 gap-14 ${alcance.length > 0 && materiales.length > 0 ? "lg:grid-cols-2" : "max-w-3xl"}`}>
            {alcance.length > 0 && (
              <div className="reveal-item">
                <Gold>Partidas</Gold>
                <ul className="mt-4 border-t border-ink/15">
                  {alcance.map((item, i) => (
                    <li key={`${item}-${i}`} className="flex gap-6 border-b border-ink/15 py-4">
                      <span className="display-title w-8 shrink-0 text-lg" style={{ color: EXCLUSIVE_GOLD }}>
                        {ROMAN[i] || pad(i + 1)}
                      </span>
                      <span className="leading-relaxed text-stone-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {materiales.length > 0 && (
              <div className="reveal-item">
                <Gold>Acabados</Gold>
                <dl className="mt-4 border-t border-ink/15">
                  {materiales.map((m, i) => (
                    <div key={`${m.elemento}-${i}`} className="grid grid-cols-1 gap-1 border-b border-ink/15 py-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6">
                      <dt className="display-title text-lg">{m.elemento}</dt>
                      <dd className="leading-relaxed text-stone-600">{m.detalle}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Antes y después. */}
      {fotoAntes && fotoDespues && (
        <section className="site-wrap pt-24 sm:pt-32">
          <Rule mark="Transformación" />
          <Lightbox className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {[
              { src: fotoAntes, label: "Antes" },
              { src: fotoDespues, label: "Después" },
            ].map((f) => (
              <div key={f.label} className={`reveal-scale ${f.label === "Antes" ? "[&_img]:grayscale" : ""}`}>
                <Plate
                  src={f.src}
                  alt={`${project.title}, ${f.label.toLowerCase()}`}
                  number={nextPlate()}
                  caption={f.label}
                  aspect="aspect-[4/3]"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  lightbox
                />
              </div>
            ))}
          </Lightbox>
        </section>
      )}

      {/* Láminas: galería sobre carbón. */}
      {fotos.length > 1 && (
        <section className="mt-24 bg-ink text-paper sm:mt-32">
          <div className="site-wrap py-20 sm:py-28">
            <div className="flex flex-col gap-4 border-b pb-8 sm:flex-row sm:items-end sm:justify-between" style={{ borderColor: `${EXCLUSIVE_GOLD}55` }}>
              <div>
                <Gold>Galería · {pad(fotos.length)} láminas</Gold>
                <h2 className="display-title mt-4 text-4xl sm:text-5xl lg:text-6xl">El proyecto en imágenes</h2>
              </div>
              <ExclusiveSeal size={56} className="hidden sm:block" />
            </div>
            <Lightbox className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-12">
              {fotos.map((src, i) => {
                // Ritmo: ancha (8) + estrecha (4), estrecha (4) + ancha (8), una a todo el ancho.
                const spans = ["md:col-span-8", "md:col-span-4", "md:col-span-4", "md:col-span-8", "md:col-span-12"];
                const aspects = ["aspect-[4/3]", "aspect-[4/3] md:aspect-[3/4.1]", "aspect-[4/3] md:aspect-[3/4.1]", "aspect-[4/3]", "aspect-[4/3] md:aspect-[21/9]"];
                const k = i % 5;
                const last = i === fotos.length - 1;
                return (
                  <figure key={`${src}-${i}`} className={`reveal-scale ${last && (k === 0 || k === 2) ? "md:col-span-12" : spans[k]}`}>
                    <button
                      type="button"
                      data-lightbox-src={src}
                      data-lightbox-alt={`${project.title} · Lámina ${i + 1}`}
                      aria-label={`Ver lámina ${i + 1} en grande`}
                      className={`group relative block w-full cursor-zoom-in overflow-hidden bg-stone-800 ${
                        last && (k === 0 || k === 2) ? "aspect-[4/3] md:aspect-[21/9]" : aspects[k]
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`${project.title}, imagen ${i + 1}`}
                        fill
                        sizes={k === 4 ? "100vw" : "(max-width: 768px) 100vw, 66vw"}
                        className="object-cover transition-transform duration-[1.8s] ease-alko group-hover:scale-[1.03]"
                      />
                    </button>
                    <figcaption className="mt-3 text-[10px] uppercase tracking-[0.24em] text-paper/50">
                      <span style={{ color: EXCLUSIVE_GOLD }}>{pad(i + 1)}</span> / {pad(fotos.length)}
                    </figcaption>
                  </figure>
                );
              })}
            </Lightbox>
          </div>
        </section>
      )}

      {/* Reseña del cliente. */}
      {project.resenaTexto?.trim() && (
        <section aria-labelledby="resena-exclusiva" className="site-wrap pt-24 sm:pt-32">
          <Rule mark="Testimonio" />
          <figure className="reveal-item mt-12 grid grid-cols-12 gap-6">
            <h2 id="resena-exclusiva" className="sr-only">
              Lo que dice el cliente
            </h2>
            <span aria-hidden="true" className="display-title col-span-12 text-8xl leading-[0.6] lg:col-span-2 lg:text-[9rem]" style={{ color: EXCLUSIVE_GOLD }}>
              “
            </span>
            <div className="col-span-12 lg:col-span-9 lg:col-start-4">
              {!!project.resenaValoracion && (
                <div className="mb-6 flex gap-1.5" role="img" aria-label={`${project.resenaValoracion} de 5 estrellas`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="h-4 w-4"
                      style={{ fill: i < (project.resenaValoracion || 0) ? EXCLUSIVE_GOLD : "rgba(28,25,23,0.15)" }}
                    >
                      <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z" />
                    </svg>
                  ))}
                </div>
              )}
              <blockquote className="display-title text-[1.9rem] leading-[1.15] tracking-[-0.02em] sm:text-4xl lg:text-5xl">
                {project.resenaTexto.trim()}
              </blockquote>
              {(project.resenaAutor || project.resenaCargo) && (
                <figcaption className="mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-ink/15 pt-5">
                  {project.resenaAutor && <span className="display-title text-lg">{project.resenaAutor}</span>}
                  {project.resenaCargo && <Gold>{project.resenaCargo}</Gold>}
                </figcaption>
              )}
            </div>
          </figure>
        </section>
      )}

      {/* Contacto reservado: texto a la izquierda, formulario en tarjeta carbón a la derecha. */}
      <section id="contacto-exclusiva" aria-labelledby="contacto-exclusiva-title" className="site-wrap pb-24 pt-24 sm:pb-32 sm:pt-32">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12 border-t pt-12 lg:gap-x-10" style={{ borderColor: `${EXCLUSIVE_GOLD}80` }}>
          <div className="col-span-12 lg:col-span-6">
            <ExclusiveSeal size={84} tone="dark" />
            <Gold className="mt-10 block">Equipo ALKO Exclusiva</Gold>
            <h2
              id="contacto-exclusiva-title"
              className="display-title mt-5 max-w-[14ch] whitespace-pre-line text-[2.6rem] leading-[1] tracking-[-0.035em] sm:text-6xl lg:text-7xl"
            >
              {cta.titulo}
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-stone-600">{cta.texto}</p>
            <dl className="mt-10 max-w-md border-t border-ink/15">
              <div className="flex items-baseline justify-between gap-6 border-b border-ink/15 py-3.5">
                <dt>
                  <Gold>Teléfono</Gold>
                </dt>
                <dd>
                  <a href={`tel:${tel}`} className="display-title text-lg transition-colors hover:text-stone-500">
                    {settings.telefono}
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-b border-ink/15 py-3.5">
                <dt>
                  <Gold>Atención</Gold>
                </dt>
                <dd className="text-sm">Personal y reservada</dd>
              </div>
            </dl>
          </div>

          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <div className="relative bg-ink p-7 text-paper sm:p-10">
              <span aria-hidden="true" className="pointer-events-none absolute inset-3 border" style={{ borderColor: `${EXCLUSIVE_GOLD}66` }} />
              <div className="relative">
                <Gold>Contacto reservado</Gold>
                <h3 className="display-title mb-6 mt-3 text-2xl leading-tight sm:text-3xl">{cta.boton}</h3>
                <QuickContactForm compact source={`ALKO Exclusiva · ${project.title}`} email={settings.email} whatsappHref={whatsappHref} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Más proyectos. */}
      {neighbours.length > 0 && (
        <nav aria-label="Más proyectos" className="site-wrap pb-16 sm:pb-20">
          <div
            className={`grid grid-cols-1 border-t ${neighbours.length > 1 ? "md:grid-cols-2" : ""}`}
            style={{ borderColor: `${EXCLUSIVE_GOLD}80` }}
          >
            {neighbours.map(({ label, project: other, arrow }, i) => (
              <Link
                key={other.id}
                href={`${ROUTES.projects}/${other.slug}`}
                className={`group flex items-center gap-6 pt-10 ${
                  i === 1 ? "mt-10 border-t border-ink/10 md:mt-0 md:justify-end md:border-l md:border-t-0 md:pl-10 md:text-right" : "md:pr-10"
                }`}
              >
                <span className={`relative hidden aspect-square w-24 shrink-0 overflow-hidden sm:block ${i === 1 ? "md:order-2" : ""}`}>
                  <Image src={other.imagen} alt="" fill sizes="96px" className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-110" />
                </span>
                <span>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
                    {arrow === "←" ? `${arrow} ${label}` : `${label} ${arrow}`}
                  </span>
                  <span className="display-title mt-3 block text-2xl transition-colors group-hover:text-[#a8874c] sm:text-3xl">
                    {other.title}
                  </span>
                  {other.exclusivo && <Gold className="mt-2 block">ALKO Exclusiva</Gold>}
                </span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </main>
  );
}
