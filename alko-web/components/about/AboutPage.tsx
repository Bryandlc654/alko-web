import type { Metadata } from "next";
import { localizeProject } from "@/lib/i18n/project-text";
import Image from "@/components/ui/Image";
import Link from "next/link";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import EditorialSection from "@/components/editorial/EditorialSection";
import HtmlLang from "@/components/i18n/HtmlLang";
import FinalContact from "@/components/sections/FinalContact";
import Materials from "@/components/sections/Materials";
import Process from "@/components/sections/Process";
import { METHOD_STEPS } from "@/lib/divisions";
import { LOCALE_META, languageAlternates, localizedPath, type Locale } from "@/lib/i18n";
import { ABOUT_COPY } from "@/lib/i18n/about";
import { HOME_COPY } from "@/lib/i18n/home";
import { pageJsonLd } from "@/lib/seo";
import { METHOD_HREF, OG_IMAGE, ogImage, siteKeywords, ROUTES, SITE } from "@/lib/site";
import { getDbNosotrosPageContent } from "@/lib/db/mysql";
import { getFabricantes, getProjects, getSectors, getSettings } from "@/lib/wordpress";

/** Imágenes por defecto del bloque «Más sobre ALKO» (personas: es de lo que tratan esas páginas). */
export const ABOUT_LINK_IMAGES = { team: "/equipo-header.jpg", careers: "/equipo-pasillo.jpg" } as const;

/** Metadatos del estudio en cada idioma, con canonical propio y alternativas hreflang. */
export function aboutMetadata(locale: Locale): Metadata {
  const t = ABOUT_COPY[locale].meta;
  const path = localizedPath(ROUTES.company, locale);
  return {
    title: { absolute: t.title },
    description: t.description,
    alternates: { canonical: path, languages: languageAlternates(ROUTES.company) },
    keywords: siteKeywords(locale),
    openGraph: {
      title: t.title,
      description: t.description,
      url: path,
      type: "website",
      locale: LOCALE_META[locale].ogLocale,
      alternateLocale: [LOCALE_META[locale === "es" ? "en" : "es"].ogLocale],
      siteName: SITE.name,
      images: [{ url: "/nosotros-header.jpg", alt: ABOUT_COPY[locale].headerAlt }, ogImage(locale)],
    },
  };
}

/**
 * Página del estudio, compartida por /nosotros y /en/about. En castellano, los textos del
 * panel; en inglés, los del diccionario (lib/i18n/about.ts) con las fotos del panel.
 */
export default async function AboutPage({ locale }: { locale: Locale }) {
  const t = ABOUT_COPY[locale];
  const [settings, projects, sectors, fabricantes, panel] = await Promise.all([
    getSettings(),
    getProjects(),
    getSectors(),
    getFabricantes(),
    getDbNosotrosPageContent(),
  ]);
  const en = t.content;

  // Cifras: las del panel (o las de respaldo); en inglés, con su etiqueta traducida.
  const baseCifras = (
    panel.cifras && panel.cifras.length > 0
      ? panel.cifras
      : [
          { valor: "1996", etiqueta: "Construyendo y reformando en Madrid" },
          { valor: "1", etiqueta: "Interlocutor para todo el proyecto" },
          sectors.length > 0 && { valor: String(sectors.length), etiqueta: "Servicios y sectores especializados" },
          METHOD_STEPS.length > 0 && { valor: String(METHOD_STEPS.length), etiqueta: "Fases de control por obra" },
        ].filter(Boolean)
  ) as { valor: string; etiqueta: string }[];
  const cifras = en
    ? baseCifras.flatMap((c) => (en.cifras[c.etiqueta] ? [{ valor: c.valor, etiqueta: en.cifras[c.etiqueta] }] : []))
    : baseCifras;

  // Textos de cada bloque: panel en castellano, diccionario en inglés.
  const c = en
    ? {
        ...en,
        headerBadge: t.eyebrow,
        pilares: en.pilares.map((p, i) => ({
          numero: panel.pilares?.[i]?.numero || String(i + 1).padStart(2, "0"),
          imagen: panel.pilares?.[i]?.imagen || "",
          ...p,
        })),
        valores: en.valores.map((v, i) => ({ numero: String(i + 1).padStart(2, "0"), ...v })),
      }
    : {
        ...panel,
        headerBadge: panel.headerBadge || t.eyebrow,
        headerTitulo: panel.headerTitulo || "Una constructora con sensibilidad arquitectónica.",
        introTag: panel.introTag || "Quiénes somos",
        pilaresTag: panel.pilaresTag || "Cómo trabajamos",
        metodoTag: panel.metodoTag || "Método ALKO",
        valoresTag: panel.valoresTag || "Valores",
        pilares: panel.pilares || [],
        valores: panel.valores || [],
      };

  const steps = METHOD_STEPS.map((step, i) => ({
    id: `metodo-${step.num}`,
    tag: step.num,
    title: en ? HOME_COPY.en.method.steps[i]?.title || step.title : step.title,
    texto: en ? HOME_COPY.en.method.steps[i]?.text || step.text : step.text,
    imagen: step.image,
  }));
  const processContent = en
    ? {
        procesoTitulo: en.procesoTitulo,
        procesoSubtitulo: en.procesoSubtitulo(steps.length),
        procesoColText: en.procesoColText,
        procesoFaseLabel: t.process.phase,
      }
    : undefined;

  const enlaces = [
    {
      href: localizedPath(ROUTES.team, locale),
      etiqueta: (!en && panel.enlaceEquipoEtiqueta) || t.links.team.tag,
      titulo: (!en && panel.enlaceEquipoTitulo) || t.links.team.title,
      imagen: panel.enlaceEquipoImagen || ABOUT_LINK_IMAGES.team,
      alt: t.links.team.alt,
    },
    {
      href: localizedPath(ROUTES.careers, locale),
      etiqueta: (!en && panel.enlaceEmpleoEtiqueta) || t.links.careers.tag,
      titulo: (!en && panel.enlaceEmpleoTitulo) || t.links.careers.title,
      imagen: panel.enlaceEmpleoImagen || ABOUT_LINK_IMAGES.careers,
      alt: t.links.careers.alt,
    },
  ];

  const destacado = projects[0] && localizeProject(projects[0], locale);
  const path = localizedPath(ROUTES.company, locale);
  // Año de fundación, si figura entre las cifras (p. ej. «1996»).
  const fundacion = baseCifras.find((x) => /^(19|20)\d{2}$/.test(x.valor.trim()))?.valor.trim();
  const jsonLd = pageJsonLd({
    type: "AboutPage",
    path,
    name: t.meta.title,
    description: t.meta.description,
    organization: {
      description: ABOUT_COPY.es.meta.description,
      ...(fundacion && { foundingDate: fundacion }),
      ...(settings.telefono && { telephone: settings.telefono }),
      ...(settings.email && { email: settings.email }),
      ...(sectors.length > 0 && { knowsAbout: sectors.map((s) => s.title) }),
    },
    extra: {
      inLanguage: locale === "es" ? "es-ES" : "en",
      primaryImageOfPage: `${SITE.url}${panel.headerBgImage?.startsWith("/") ? panel.headerBgImage : "/nosotros-header.jpg"}`,
    },
  });

  return (
    <main className="bg-paper text-ink">
      <HtmlLang locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EditorialHeader
        locale={locale}
        breadcrumbs={[{ label: t.breadcrumb }]}
        eyebrow={c.headerBadge}
        title={<span className="whitespace-pre-line">{c.headerTitulo}</span>}
        description={c.headerDescripcion ? <span className="whitespace-pre-line">{c.headerDescripcion}</span> : undefined}
        aside={
          <dl className="grid grid-cols-2 border-t border-ink/15">
            {cifras.slice(0, 2).map((cifra, i) => (
              <div key={cifra.etiqueta + i} className={`pt-5 ${i > 0 ? "border-l border-ink/15 pl-4" : "pr-4"}`}>
                <dt className="text-[10px] uppercase leading-relaxed tracking-[0.22em] text-mid">{cifra.etiqueta}</dt>
                <dd className="display-title mt-2 text-4xl">{cifra.valor}</dd>
              </div>
            ))}
          </dl>
        }
        image={panel.headerBgImage || "/nosotros-header.jpg"}
        imageAlt={t.headerAlt}
        caption={t.caption}
      />

      {/* 01 · Introducción */}
      <EditorialSection number="01" label={c.introTag} title={c.introTitulo}>
        {c.introLead && (
          <p className="reveal-item display-title max-w-3xl whitespace-pre-line text-2xl leading-snug sm:text-3xl">
            {c.introLead}
          </p>
        )}
        <div className="reveal-item mt-10 grid grid-cols-1 gap-x-10 gap-y-6 border-t border-ink/15 pt-10 sm:grid-cols-2">
          <p className="whitespace-pre-line text-lg leading-relaxed text-mid">{c.introCol1}</p>
          <p className="whitespace-pre-line text-lg leading-relaxed text-mid">{c.introCol2}</p>
        </div>
        <div className="reveal-item mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link href={localizedPath(ROUTES.projects, locale)} className="btn btn-ink">
            {t.viewProjects} <span aria-hidden="true">→</span>
          </Link>
          <Link href={localizedPath(METHOD_HREF, locale)} className="arrow-link">
            {t.method} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </EditorialSection>

      {/* Obra real, enmarcada */}
      {destacado && (
        <section className="bg-paper">
          <div className="site-wrap pb-6">
            <Link href={localizedPath(`${ROUTES.projects}/${destacado.slug}`, locale)} className="group block">
              <div className="reveal-scale relative aspect-[4/3] overflow-hidden bg-piedra sm:aspect-[21/9]">
                <Image
                  src={destacado.imagen}
                  alt={[destacado.title, destacado.ubicacion?.replace(/\.+$/, "")].filter(Boolean).join(", ")}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/15 pb-4">
                <span className="text-[10px] uppercase tracking-[0.22em] text-mid">
                  {t.projectLabel} · {[en ? destacado.ubicacion : destacado.tipologia, destacado.anio].filter(Boolean).join(" · ")}
                </span>
                <span className="display-title text-2xl transition-colors group-hover:text-bronze sm:text-3xl">
                  {destacado.title} <span aria-hidden="true">↗</span>
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* 02 · Cifras */}
      <EditorialSection number="02" label={t.figuresLabel} tone="ink">
        <dl className={`grid grid-cols-1 border-t border-paper/15 sm:grid-cols-2 ${cifras.length >= 4 ? "xl:grid-cols-4" : ""}`}>
          {cifras.map((cifra, i) => (
            <div
              key={cifra.etiqueta + i}
              className="reveal-item flex flex-col-reverse justify-end border-b border-paper/15 py-8 sm:odd:pr-8 sm:even:border-l sm:even:pl-8 xl:border-l xl:px-8 xl:first:border-l-0 xl:first:pl-0"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <dt className="mt-4 max-w-[16rem] leading-snug text-paper/60">{cifra.etiqueta}</dt>
              <dd className="display-title text-6xl leading-none text-bronze-light sm:text-7xl">{cifra.valor}</dd>
            </div>
          ))}
        </dl>
      </EditorialSection>

      {/* 03 · Pilares */}
      <EditorialSection number="03" label={c.pilaresTag} title={c.pilaresTitulo} intro={c.pilaresDescripcion} wide>
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-3">
          {c.pilares.map((pilar, i) => (
            <article key={pilar.numero + i} className="reveal-item" style={{ transitionDelay: `${i * 120}ms` }}>
              <div className="relative aspect-[4/5] overflow-hidden bg-piedra">
                {pilar.imagen && (
                  <Image
                    src={pilar.imagen}
                    alt={t.pillarAlt(pilar.titulo.replace(/\s+/g, " ").trim())}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="mt-6 flex items-baseline gap-4 border-t border-ink/15 pt-5">
                <span className="text-[10px] tracking-[0.22em] text-bronze">{pilar.numero}</span>
                <h3 className="display-title whitespace-pre-line text-2xl sm:text-3xl">{pilar.titulo}</h3>
              </div>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-mid">{pilar.texto}</p>
            </article>
          ))}
        </div>
      </EditorialSection>

      {/* 04 · Método ALKO */}
      <div id="metodo">
        <EditorialSection tone="white" number="04" label={c.metodoTag} title={c.metodoTitulo}>
          {c.metodoLead && (
            <p className="reveal-item display-title max-w-3xl whitespace-pre-line text-2xl leading-snug sm:text-3xl">
              {c.metodoLead}
            </p>
          )}
          <div className="reveal-item mt-10 grid grid-cols-1 gap-x-10 gap-y-6 border-t border-ink/15 pt-10 sm:grid-cols-2">
            <p className="whitespace-pre-line text-lg leading-relaxed text-mid">{c.metodoCol1}</p>
            <p className="whitespace-pre-line text-lg leading-relaxed text-mid">{c.metodoCol2}</p>
          </div>
          <div className="reveal-scale relative mt-14 aspect-[16/9] overflow-hidden bg-piedra">
            <Image
              src={panel.metodoImagen || "/nosotros-metodo.jpg"}
              alt={t.methodAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 75vw"
              className="object-cover"
            />
          </div>
        </EditorialSection>

        {/* Las fases del proceso: las mismas cinco etapas de la portada, con sus imágenes y textos. */}
        <Process fases={steps} id="fases" content={processContent} />
      </div>

      {/* 05 · Valores */}
      <EditorialSection number="05" label={c.valoresTag} title={c.valoresTitulo} intro={c.valoresDescripcion}>
        <ol className="border-t border-ink/15">
          {c.valores.map((valor, i) => (
            <li
              key={valor.numero + i}
              className="reveal-item grid grid-cols-12 items-baseline gap-x-6 gap-y-3 border-b border-ink/15 py-8"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <span className="col-span-12 text-[10px] tracking-[0.22em] text-bronze sm:col-span-1">{valor.numero}</span>
              <h3 className="display-title col-span-12 whitespace-pre-line text-2xl sm:col-span-5 sm:text-3xl">{valor.titulo}</h3>
              <p className="col-span-12 whitespace-pre-line leading-relaxed text-mid sm:col-span-6">{valor.texto}</p>
            </li>
          ))}
        </ol>
      </EditorialSection>

      {/* Fabricantes */}
      {fabricantes.length > 0 && <Materials fabricantes={fabricantes} locale={locale} />}

      {/* 06 · Equipo y empleo */}
      <EditorialSection number="06" label={t.moreLabel} tone="white">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {enlaces.map((enlace, i) => (
            <Link key={enlace.href} href={enlace.href} className="reveal-item group block" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="relative aspect-[16/10] overflow-hidden bg-piedra">
                <Image
                  src={enlace.imagen}
                  alt={enlace.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-5 flex items-start justify-between gap-6 border-t border-ink/15 pt-5">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-mid">{enlace.etiqueta}</span>
                  <span className="display-title mt-2 block text-2xl transition-colors group-hover:text-bronze sm:text-3xl">
                    {enlace.titulo}
                  </span>
                </div>
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/30 transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-paper"
                >
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </EditorialSection>

      <FinalContact settings={settings} id="contacto" source={`Formulario nosotros · ${path}`} locale={locale} />
    </main>
  );
}
