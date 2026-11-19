import type { Metadata } from "next";
import Image from "@/components/ui/Image";
import EditorialCta from "@/components/editorial/EditorialCta";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import EditorialSection from "@/components/editorial/EditorialSection";
import JobApplyCtaButton from "@/components/empleo/JobApplyCtaButton";
import JobPositionsList from "@/components/empleo/JobPositionsList";
import HtmlLang from "@/components/i18n/HtmlLang";
import { DEFAULT_POSICIONES_EMPLEO } from "@/lib/content";
import { getDbEmpleoPageContent } from "@/lib/db/mysql";
import { LOCALE_META, languageAlternates, localizedPath, type Locale } from "@/lib/i18n";
import { CAREERS_COPY, localizePosition } from "@/lib/i18n/careers";
import { metaDescription, pageJsonLd } from "@/lib/seo";
import { OG_IMAGE, ROUTES, SITE } from "@/lib/site";
import type { PosicionEmpleo } from "@/lib/types";
import { getSettings } from "@/lib/wordpress";

/** Imágenes por defecto: trabajadores de ALKO en obra y el equipo reunido sobre los planos. */
const HEADER_IMAGE = "/metodo-ejecutar.jpg";
const CULTURE_IMAGE = "/nosotros-metodo.jpg";

/** Vacantes del panel (o las de respaldo si no hay ninguna). */
const allPositions = (posiciones?: PosicionEmpleo[]) =>
  posiciones && posiciones.length > 0 ? posiciones : DEFAULT_POSICIONES_EMPLEO;

/** Vacantes abiertas (las desactivadas en el panel no cuentan), con sus textos en el idioma. */
const openPositions = (posiciones: PosicionEmpleo[] | undefined, locale: Locale) =>
  allPositions(posiciones)
    .filter((p) => p.activa !== false)
    .map((p) => localizePosition(p, locale));

const absolute = (src: string) => (/^https?:\/\//.test(src) ? src : `${SITE.url}${src}`);

/** Metadatos de cada idioma: la descripción nombra los puestos abiertos. */
export async function careersMetadata(locale: Locale): Promise<Metadata> {
  const t = CAREERS_COPY[locale];
  const panel = await getDbEmpleoPageContent();
  const description = metaDescription(t.meta.description(openPositions(panel.posiciones, locale).map((p) => p.titulo)));
  const path = localizedPath(ROUTES.careers, locale);
  const image = panel.headerBgImage || HEADER_IMAGE;
  return {
    title: { absolute: t.meta.title },
    description,
    alternates: { canonical: path, languages: languageAlternates(ROUTES.careers) },
    openGraph: {
      title: t.meta.title,
      description,
      url: path,
      type: "website",
      locale: LOCALE_META[locale].ogLocale,
      alternateLocale: [LOCALE_META[locale === "es" ? "en" : "es"].ogLocale],
      siteName: SITE.name,
      images: [{ url: image, alt: t.header.alt }, OG_IMAGE],
    },
  };
}

/**
 * «Trabaja con nosotros», compartida por /trabaja-con-nosotros y /en/careers. En castellano, los
 * textos del panel; en inglés, los del diccionario (lib/i18n/careers.ts) y los puestos traducidos.
 */
export default async function CareersPage({ locale }: { locale: Locale }) {
  const t = CAREERS_COPY[locale];
  const es = locale === "es";
  const [settings, panel] = await Promise.all([getSettings(), getDbEmpleoPageContent()]);

  const listaPosiciones = allPositions(panel.posiciones);
  const abiertas = openPositions(panel.posiciones, locale);
  const description = metaDescription(t.meta.description(abiertas.map((p) => p.titulo)));
  const path = localizedPath(ROUTES.careers, locale);

  // En castellano manda el panel (con el diccionario de respaldo); en inglés, el diccionario.
  const pick = (value: string | undefined, fallback: string) => (es && value) || fallback;
  const c = {
    eyebrow: pick(panel.headerBadge, t.header.eyebrow),
    title: pick(panel.headerTitulo, t.header.title),
    description: pick(panel.headerDescripcion, t.header.description),
    cultureTag: pick(panel.culturaTag, t.culture.tag),
    cultureTitle: pick(panel.culturaTitulo, t.culture.title),
    cultureP1: pick(panel.culturaParrafo1, t.culture.p1),
    cultureP2: pick(panel.culturaParrafo2, t.culture.p2),
    positionsTag: pick(panel.posicionesTag, t.positionsSection.tag),
    positionsTitle: pick(panel.posicionesTitulo, t.positionsSection.title),
    positionsIntro: pick(panel.posicionesSubtitulo, t.positionsSection.intro),
    ctaTitle: pick(panel.ctaTitulo, t.cta.title),
    ctaDescription: pick(panel.ctaDescripcion, t.cta.description),
  };
  const headerImage = panel.headerBgImage || HEADER_IMAGE;

  const jsonLd = pageJsonLd({
    path,
    name: t.meta.title,
    description,
    // Puestos abiertos como lista; para ofertas de empleo completas (JobPosting) Google pide
    // fecha de publicación de cada una, que el panel no guarda.
    extra: {
      inLanguage: es ? "es-ES" : "en",
      primaryImageOfPage: absolute(headerImage),
      ...(abiertas.length > 0 && {
        mainEntity: {
          "@type": "ItemList",
          name: t.meta.listName,
          itemListElement: abiertas.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.titulo,
            ...(p.resumen && { description: p.resumen }),
          })),
        },
      }),
    },
  });

  return (
    <main className="bg-paper text-ink">
      <HtmlLang locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EditorialHeader
        locale={locale}
        breadcrumbs={[{ label: t.breadcrumbParent, href: localizedPath(ROUTES.company, locale) }, { label: t.breadcrumb }]}
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.description}
        aside={
          <a
            href="#posiciones"
            className="group flex items-end justify-between gap-6 border-t border-ink/15 pt-5 transition-colors hover:text-bronze"
          >
            <span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-mid">{t.header.open}</span>
              <span className="display-title mt-2 block text-5xl">{String(abiertas.length).padStart(2, "0")}</span>
            </span>
            <span className="pb-2 text-[11px] uppercase tracking-[0.22em]">
              {t.header.see}{" "}
              <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-y-0.5">↓</span>
            </span>
          </a>
        }
        image={headerImage}
        imageAlt={t.header.alt}
        imagePosition="object-[center_30%]"
        caption={t.header.caption}
      />

      {/* 01 · Cultura */}
      <EditorialSection number="01" label={c.cultureTag} title={c.cultureTitle}>
        <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
          <p className="reveal-item text-lg leading-relaxed text-mid">{c.cultureP1}</p>
          <p className="reveal-item text-lg leading-relaxed text-mid" style={{ transitionDelay: "100ms" }}>
            {c.cultureP2}
          </p>
        </div>
        <div className="reveal-scale relative mt-14 aspect-[16/9] overflow-hidden bg-piedra">
          <Image
            src={panel.culturaImagen || CULTURE_IMAGE}
            alt={t.culture.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-cover object-center"
          />
        </div>
      </EditorialSection>

      {/* 02 · Posiciones abiertas */}
      <EditorialSection
        id="posiciones"
        tone="white"
        number="02"
        label={c.positionsTag}
        title={c.positionsTitle}
        intro={c.positionsIntro}
      >
        <JobPositionsList posiciones={listaPosiciones} locale={locale} />
      </EditorialSection>

      <EditorialCta
        label={t.cta.label}
        title={c.ctaTitle}
        description={c.ctaDescription}
        meta={
          <a
            href={`mailto:${settings.email}?subject=${encodeURIComponent(t.cta.mailSubject)}`}
            className="break-all transition-colors hover:text-paper"
          >
            {settings.email}
          </a>
        }
      >
        <JobApplyCtaButton vacantes={listaPosiciones} locale={locale} />
      </EditorialCta>
    </main>
  );
}
