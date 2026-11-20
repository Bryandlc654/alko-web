import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "@/components/ui/Image";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Lightbox from "@/components/ui/Lightbox";
import Prose from "@/components/ui/Prose";
import ContactTrigger from "@/components/contact/ContactTrigger";
import HtmlLang from "@/components/i18n/HtmlLang";
import EditorialSection from "@/components/editorial/EditorialSection";
import EditorialCta from "@/components/editorial/EditorialCta";
import ExclusiveProject from "@/components/projects/ExclusiveProject";
import { projectCta } from "@/lib/project-cta";
import { displayName, metaDescription } from "@/lib/seo";
import { OG_IMAGE, ROUTES, SITE, ogImage, siteKeywords } from "@/lib/site";
import { LOCALE_META, languageAlternates, localizedPath, type Locale } from "@/lib/i18n";
import { PROJECT_PAGE_COPY } from "@/lib/i18n/project-page";
import { localizeProjectDetail } from "@/lib/i18n/projects-content";
import { localizeSector } from "@/lib/i18n/services-content";
import { getProjectBySlug, getProjects, getSectorBySlug, getSettings } from "@/lib/wordpress";
import { splitLead } from "@/lib/utils";

// Columnas de la ficha en escritorio según el número de datos (clases literales para Tailwind).
const FICHA_COLS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-3 lg:grid-cols-5",
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Metadatos de una ficha de proyecto en cada idioma, con canonical propio y alternativas hreflang. */
export async function projectMetadata(slug: string, locale: Locale): Promise<Metadata> {
  const raw = await getProjectBySlug(slug);
  if (!raw) return {};
  const project = localizeProjectDetail(raw, locale);
  const t = PROJECT_PAGE_COPY[locale];
  // «Reforma Velázquez: residencial de alta gama en Barrio de Salamanca, Madrid | ALKO»: el nombre de
  // la obra no lo busca nadie; la tipología y el barrio, sí.
  const name = displayName(project.title);
  // Los textos del panel a veces llevan punto final («Residencial.»).
  const clean = (value?: string) => (value || "").trim().replace(/\.+$/, "");
  const tipologia = clean(project.tipologia);
  const tipo = tipologia ? tipologia.charAt(0).toUpperCase() + tipologia.slice(1).toLowerCase() : "";
  const lugar = clean(project.ubicacion);
  const detail = [tipo, lugar && `${t.meta.in} ${lugar}`].filter(Boolean).join(" ");
  const brand = project.exclusivo ? "ALKO Exclusiva" : "ALKO";
  const lower = detail.charAt(0).toLowerCase() + detail.slice(1);
  // Sin repetir «Reforma»: «Reforma Hermosilla» + «Reforma de baños en…» → «Reforma de baños en… · Hermosilla».
  const rest = name.replace(/^reforma\s+/i, "");
  const startsWithReforma = /^reforma\b/i.test(detail);
  const heading = !detail
    ? name
    : startsWithReforma && detail.toLowerCase().includes(rest.toLowerCase())
      ? detail
      : startsWithReforma && /^reforma\s/i.test(name)
        ? `${detail} · ${rest}`
        : `${name}: ${lower}`;
  const altParts = [name, project.tipologia, project.ubicacion].filter(
    (part, i, all): part is string => !!part && all.findIndex((p) => p?.toLowerCase() === part.toLowerCase()) === i,
  );
  const esPath = `${ROUTES.projects}/${raw.slug}`;
  const path = localizedPath(esPath, locale);
  const title = `${heading} | ${brand}`;
  const description = metaDescription(
    splitLead(project.content).lead || (locale === "en" ? project.reto : "") || t.meta.description(name, detail ? lower : t.meta.fallback),
  );
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path, languages: languageAlternates(esPath) },
    keywords: siteKeywords(locale),
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      locale: LOCALE_META[locale].ogLocale,
      alternateLocale: [LOCALE_META[locale === "es" ? "en" : "es"].ogLocale],
      siteName: SITE.name,
      images: [project.imagen ? { url: project.imagen, alt: altParts.join(", ") } : locale === "es" ? OG_IMAGE : ogImage(locale)],
    },
  };
}

/**
 * Ficha de un proyecto, compartida por /proyectos/[slug] y /en/projects/[slug]. En inglés, los textos del
 * proyecto salen de lib/i18n/projects-content (los que no estén traducidos no se muestran).
 */
export default async function ProjectDetailPage({ slug, locale }: { slug: string; locale: Locale }) {
  const t = PROJECT_PAGE_COPY[locale];
  const [rawProject, rawProjects, settings] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getSettings(),
  ]);
  if (!rawProject) return notFound();
  const project = localizeProjectDetail(rawProject, locale);
  const projects = rawProjects.map((p) => localizeProjectDetail(p, locale));
  const rawServicio = project.servicio ? await getSectorBySlug(project.servicio) : null;
  const servicio = rawServicio && localizeSector(rawServicio, locale);
  const projectHref = (other: string) => localizedPath(`${ROUTES.projects}/${other}`, locale);

  // Proyecto anterior y siguiente (circular) para seguir navegando.
  const index = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects.length > 1 && index >= 0 ? projects[(index - 1 + projects.length) % projects.length] : null;
  const next = projects.length > 1 && index >= 0 ? projects[(index + 1) % projects.length] : null;
  const neighbours = [
    prev && { label: t.prev, project: prev, arrow: "←" },
    next && next.slug !== prev?.slug && { label: t.next, project: next, arrow: "→" },
  ].filter(Boolean) as { label: string; project: typeof project; arrow: string }[];

  // Los proyectos ALKO Exclusiva tienen su propia plantilla.
  if (project.exclusivo) {
    return (
      <>
        <HtmlLang locale={locale} />
        <ExclusiveProject project={project} servicio={servicio} neighbours={neighbours} settings={settings} locale={locale} />
      </>
    );
  }

  const cta = projectCta(project, locale);
  const { lead, rest } = splitLead(project.content || "");

  const ficha = [
    [t.ficha.tipologia, project.tipologia],
    [t.ficha.ubicacion, project.ubicacion],
    [t.ficha.superficie, project.superficie],
    [t.ficha.plazo, project.plazo],
    [t.ficha.anio, project.anio],
  ].filter(([, value]) => value);

  const capitulos = [
    { titulo: t.chapters.reto, texto: project.reto },
    { titulo: t.chapters.solucion, texto: project.solucion },
    { titulo: t.chapters.resultado, texto: project.resultado },
  ].filter((c) => c.texto?.trim());

  const alcance = (project.alcance || []).filter(Boolean);
  const materiales = (project.materiales || []).filter((m) => m.elemento || m.detalle);
  const cifras = (project.cifras || []).filter((c) => c.valor).slice(0, 4);

  // Antes y después solo si se han subido las dos.
  const fotoAntes = project.fotoAntes?.trim();
  const fotoDespues = project.fotoDespues?.trim();
  const showBeforeAfter = Boolean(fotoAntes && fotoDespues);

  // Galería sin la foto de portada (ya va arriba), salvo que sea la única.
  const todas = [project.imagen, ...project.galeria]
    .map((src) => src?.trim())
    .filter((src, i, arr): src is string => !!src && arr.indexOf(src) === i);
  const sinPortada = todas.filter((src) => src !== project.imagen?.trim());
  const galeria = sinPortada.length > 0 ? sinPortada : todas;

  // Numeración de las secciones según las que aparecen.
  let n = 0;
  const num = () => pad(++n);

  return (
    <main className="bg-paper text-ink">
      <HtmlLang locale={locale} />
      {/* Cabecera clara: migas, titular grande y ficha técnica en una fila. */}
      <header className="bg-paper">
        <div className="site-wrap pt-28 sm:pt-36 lg:pt-40">
          <div className="hh-rise flex items-center justify-between gap-6 border-b border-ink/15 pb-5">
            <Breadcrumbs
              items={[{ label: t.breadcrumb, href: localizedPath(ROUTES.projects, locale) }, { label: project.title }]}
              tone="dark"
              className="min-w-0"
              locale={locale}
            />
            <span className="hidden shrink-0 text-[10px] uppercase tracking-[0.22em] text-mid sm:inline">
              {t.project}{project.indice && <span className="ml-2 text-bronze">{project.indice}</span>}
            </span>
          </div>

          <h1 className="hh-rise display-title mt-12 max-w-[16ch] text-[2.9rem] leading-[0.96] tracking-[-0.045em] sm:mt-16 sm:text-7xl lg:text-[6.25rem] xl:text-[7.25rem]">
            {project.title}
          </h1>

          {ficha.length > 0 && (
            <dl
              className={`hh-rise mt-12 grid grid-cols-1 border-t border-ink/15 sm:mt-16 ${FICHA_COLS[ficha.length]}`}
              style={{ animationDelay: ".15s" }}
            >
              {ficha.map(([label, value], i) => (
                <div
                  key={label}
                  className={`flex items-baseline justify-between gap-4 border-b border-ink/15 py-4 sm:block sm:border-b-0 sm:py-6 sm:pr-6 ${
                    i > 0 ? "sm:border-l sm:pl-6" : ""
                  }`}
                >
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-mid">
                    <span className="mr-2 text-bronze">{pad(i + 1)}</span>
                    {label}
                  </dt>
                  <dd className="display-title text-right text-lg sm:mt-3 sm:text-left sm:text-2xl">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {project.imagen && (
          <figure className="site-wrap mt-10 pb-6 sm:mt-14">
            <div
              className="hh-rise relative aspect-[4/3] overflow-hidden bg-piedra sm:aspect-[16/8]"
              style={{ animationDelay: ".25s" }}
            >
              <Image src={project.imagen} alt={project.title} fill priority sizes="100vw" className="hh-zoom object-cover" />
            </div>
            <figcaption className="mt-4 flex items-center gap-4 text-mid">
              <span className="text-[10px] uppercase tracking-[0.22em]">{project.cliente || "ALKO"}</span>
              <span className="cota flex-1 text-ink" aria-hidden="true" />
              {servicio ? (
                <Link
                  href={localizedPath(`${ROUTES.sectors}/${servicio.slug}`, locale)}
                  className="text-[10px] uppercase tracking-[0.22em] transition-colors hover:text-bronze"
                >
                  {servicio.title} ↗
                </Link>
              ) : (
                <span className="text-[10px] uppercase tracking-[0.22em]">{project.ubicacion || "Madrid"}</span>
              )}
            </figcaption>
          </figure>
        )}
      </header>

      {/* Memoria: entradilla grande, texto y relato por partes. */}
      {(lead || rest || capitulos.length > 0) && (
        <EditorialSection number={num()} label={t.memoria} title={lead || undefined}>
          {rest && (
            <div className="max-w-2xl">
              <Prose html={rest} variant="article" />
            </div>
          )}
          {capitulos.length > 0 && (
            <ol className={`border-t border-ink/15 ${rest ? "mt-16" : ""}`}>
              {capitulos.map((cap, i) => (
                <li key={cap.titulo} className="reveal-item grid grid-cols-12 gap-x-6 gap-y-3 border-b border-ink/15 py-8">
                  <span className="col-span-12 text-[10px] uppercase tracking-[0.22em] text-bronze sm:col-span-2">
                    {t.part} {pad(i + 1)}
                  </span>
                  <h3 className="display-title col-span-12 text-2xl leading-tight sm:col-span-4 sm:text-3xl">{cap.titulo}</h3>
                  <p className="col-span-12 whitespace-pre-line leading-relaxed text-mid sm:col-span-6">{cap.texto}</p>
                </li>
              ))}
            </ol>
          )}
        </EditorialSection>
      )}

      {/* Cifras en banda carbón. */}
      {cifras.length > 0 && (
        <section className="bg-ink text-paper">
          <div className="site-wrap py-16 sm:py-20">
            <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
              {cifras.map((c, i) => (
                <div
                  key={`${c.valor}-${i}`}
                  className={`reveal-item pr-6 ${i % 2 === 1 ? "border-l border-paper/15 pl-6" : ""} ${
                    i > 0 ? "lg:border-l lg:border-paper/15 lg:pl-8" : ""
                  }`}
                >
                  <dt className="sr-only">{c.etiqueta}</dt>
                  <dd>
                    <span className="display-title block text-5xl leading-none text-bronze-light sm:text-6xl">{c.valor}</span>
                    <span className="mt-4 block text-[10px] uppercase tracking-[0.22em] text-paper/60">{c.etiqueta}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Alcance y acabados. */}
      {(alcance.length > 0 || materiales.length > 0) && (
        <EditorialSection number={num()} label={t.detailLabel} title={t.detailTitle} tone="white">
          <div className={`grid grid-cols-1 gap-12 ${alcance.length > 0 && materiales.length > 0 ? "xl:grid-cols-2" : ""}`}>
            {alcance.length > 0 && (
              <div className="reveal-item">
                <p className="mb-4 text-[10px] uppercase tracking-[0.22em] text-mid">{t.scope}</p>
                <ul className="border-t border-ink/15">
                  {alcance.map((item, i) => (
                    <li key={`${item}-${i}`} className="flex gap-5 border-b border-ink/15 py-4">
                      <span className="pt-0.5 text-[10px] tracking-[0.18em] text-bronze">{pad(i + 1)}</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {materiales.length > 0 && (
              <div className="reveal-item">
                <p className="mb-4 text-[10px] uppercase tracking-[0.22em] text-mid">{t.materials}</p>
                <dl className="border-t border-ink/15">
                  {materiales.map((m, i) => (
                    <div key={`${m.elemento}-${i}`} className="grid grid-cols-1 gap-1 border-b border-ink/15 py-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6">
                      <dt className="display-title text-lg">{m.elemento}</dt>
                      <dd className="leading-relaxed text-mid">{m.detalle}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </EditorialSection>
      )}

      {/* Antes y después. */}
      {showBeforeAfter && fotoAntes && fotoDespues && (
        <EditorialSection number={num()} label={t.photoLabel} title={t.beforeAfter} wide>
          <Lightbox className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              { src: fotoAntes, ...t.before, tag: "bg-paper text-ink", extra: "grayscale" },
              { src: fotoDespues, ...t.after, tag: "bg-ink text-paper", extra: "" },
            ].map((f) => (
              <figure key={f.label} className="reveal-item">
                <button
                  type="button"
                  data-lightbox-src={f.src}
                  data-lightbox-alt={`${project.title} · ${f.label}`}
                  aria-label={f.see}
                  className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-piedra"
                >
                  <Image
                    src={f.src}
                    alt={`${project.title}, ${f.alt}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className={`object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.03] ${f.extra}`}
                  />
                  <span className={`absolute left-4 top-4 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.22em] ${f.tag}`}>
                    {f.label}
                  </span>
                </button>
                <figcaption className="mt-4 flex items-center justify-between border-t border-ink/15 pt-3 text-[10px] uppercase tracking-[0.22em] text-mid">
                  <span>{f.note}</span>
                  <span>{project.title}</span>
                </figcaption>
              </figure>
            ))}
          </Lightbox>
        </EditorialSection>
      )}

      {/* Galería: ritmo de una ancha y dos medias, numeradas. */}
      {galeria.length > 0 && (
        <EditorialSection
          number={num()}
          label={t.gallery(pad(galeria.length), galeria.length)}
          title={t.galleryTitle}
          tone="white"
          wide
        >
          <Lightbox className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2">
            {galeria.map((src, i, all) => {
              const wide = i % 3 === 0 || (i === all.length - 1 && i % 3 === 1);
              return (
                <figure key={`${src}-${i}`} className={`reveal-item ${wide ? "md:col-span-2" : ""}`}>
                  <button
                    type="button"
                    data-lightbox-src={src}
                    data-lightbox-alt={`${project.title} · ${t.image} ${i + 1}`}
                    aria-label={t.seeImage(i + 1)}
                    className={`group relative block w-full cursor-zoom-in overflow-hidden bg-piedra ${
                      wide ? "aspect-[4/3] md:aspect-[16/8]" : "aspect-[4/3] md:aspect-[4/5]"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${project.title}, ${t.imageAlt(i + 1)}`}
                      fill
                      sizes={wide ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                      className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.03]"
                    />
                  </button>
                  <figcaption className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-mid">
                    <span>
                      <span className="text-bronze">{pad(i + 1)}</span> / {pad(all.length)}
                    </span>
                    <span aria-hidden="true">↗</span>
                  </figcaption>
                </figure>
              );
            })}
          </Lightbox>
        </EditorialSection>
      )}

      {/* Reseña del cliente (solo si se ha escrito en el panel). */}
      {project.resenaTexto?.trim() && (
        <EditorialSection number={num()} label={t.reviewLabel}>
          <figure className="reveal-item">
            {!!project.resenaValoracion && (
              <div className="flex gap-1 text-bronze" role="img" aria-label={t.stars(project.resenaValoracion)}>
                {Array.from({ length: 5 }, (_, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className={`h-4 w-4 ${i < (project.resenaValoracion || 0) ? "fill-current" : "fill-ink/15"}`}
                  >
                    <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z" />
                  </svg>
                ))}
              </div>
            )}
            <blockquote className="display-title mt-8 max-w-4xl text-[1.9rem] leading-[1.15] tracking-[-0.02em] sm:text-4xl lg:text-5xl">
              <span aria-hidden="true" className="text-bronze">«</span>
              {project.resenaTexto.trim()}
              <span aria-hidden="true" className="text-bronze">»</span>
            </blockquote>
            {(project.resenaAutor || project.resenaCargo) && (
              <figcaption className="mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-ink/15 pt-5">
                {project.resenaAutor && <span className="display-title text-lg">{project.resenaAutor}</span>}
                {project.resenaCargo && (
                  <span className="text-[10px] uppercase tracking-[0.22em] text-mid">{project.resenaCargo}</span>
                )}
              </figcaption>
            )}
          </figure>
        </EditorialSection>
      )}

      {/* Cierre: llamada a la acción (textos editables en el panel). */}
      <EditorialCta
        label={t.ctaLabel}
        title={cta.titulo}
        description={cta.texto}
        meta={
          <a href={`tel:${settings.telefono.replace(/[^+\d]/g, "")}`} className="transition-colors hover:text-paper">
            {t.callUs} <span className="text-paper underline decoration-bronze-light underline-offset-4">{settings.telefono}</span>
          </a>
        }
      >
        <ContactTrigger mode="avanzado" source={`Proyecto ${rawProject.title}${locale === "en" ? " · EN" : ""}`} className="btn btn-paper">
          {cta.boton} <span aria-hidden="true">→</span>
        </ContactTrigger>
        <Link href={localizedPath(ROUTES.projects, locale)} className="btn btn-ghost-light">
          {t.allProjects}
        </Link>
      </EditorialCta>

      {/* Más proyectos: anterior y siguiente con miniatura enmarcada. */}
      {neighbours.length > 0 && (
        <nav aria-label={t.moreProjects} className="bg-paper">
          <div className="site-wrap py-16 sm:py-20">
            <div className={`grid grid-cols-1 gap-10 border-t border-ink/15 pt-8 ${neighbours.length > 1 ? "md:grid-cols-2" : ""}`}>
              {neighbours.map(({ label, project: other, arrow }, i) => (
                <Link
                  key={other.id}
                  href={projectHref(other.slug)}
                  className={`group grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-5 sm:gap-8 ${
                    i === 1 ? "md:border-l md:border-ink/15 md:pl-10" : ""
                  }`}
                >
                  <span className="relative block aspect-[4/3] overflow-hidden bg-piedra">
                    <Image
                      src={other.imagen}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 40vw, 20vw"
                      className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.05]"
                    />
                  </span>
                  <span>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-mid">
                      {arrow === "←" ? `${arrow} ${label}` : `${label} ${arrow}`}
                    </span>
                    <span className="display-title mt-3 block text-2xl leading-tight transition-colors group-hover:text-bronze sm:text-3xl">
                      {other.title}
                    </span>
                    <span className="mt-2 block text-sm text-mid">
                      {[other.tipologia, other.anio].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </main>
  );
}
