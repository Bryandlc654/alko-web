import type { Metadata } from "next";
import Link from "next/link";
import ContactTrigger from "@/components/contact/ContactTrigger";
import EditorialCta from "@/components/editorial/EditorialCta";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import EditorialSection from "@/components/editorial/EditorialSection";
import HtmlLang from "@/components/i18n/HtmlLang";
import { DEFAULT_EQUIPO_MEMBERS } from "@/lib/content";
import { getDbEquipoPageContent } from "@/lib/db/mysql";
import { LOCALE_META, languageAlternates, localizedPath, type Locale } from "@/lib/i18n";
import { TEAM_COPY } from "@/lib/i18n/team";
import { pageJsonLd } from "@/lib/seo";
import { METHOD_HREF, OG_IMAGE, ROUTES, SITE } from "@/lib/site";
import { getSettings } from "@/lib/wordpress";

const HEADER_IMAGE = "/equipo-header.jpg";

/** Metadatos del equipo en cada idioma, con canonical propio y alternativas hreflang. */
export function teamMetadata(locale: Locale): Metadata {
  const t = TEAM_COPY[locale];
  const path = localizedPath(ROUTES.team, locale);
  return {
    title: { absolute: t.meta.title },
    description: t.meta.description,
    alternates: { canonical: path, languages: languageAlternates(ROUTES.team) },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      url: path,
      type: "website",
      locale: LOCALE_META[locale].ogLocale,
      alternateLocale: [LOCALE_META[locale === "es" ? "en" : "es"].ogLocale],
      siteName: SITE.name,
      images: [{ url: HEADER_IMAGE, alt: t.header.alt }, OG_IMAGE],
    },
  };
}

/**
 * Página del equipo, compartida por /equipo y /en/team. En castellano, los textos del panel;
 * en inglés, los del diccionario (lib/i18n/team.ts) con los nombres del panel.
 */
export default async function TeamPage({ locale }: { locale: Locale }) {
  const t = TEAM_COPY[locale];
  const es = locale === "es";
  const [settings, panel] = await Promise.all([getSettings(), getDbEquipoPageContent()]);

  const miembros = (panel.miembros && panel.miembros.length > 0 ? panel.miembros : DEFAULT_EQUIPO_MEMBERS).map((m) => ({
    ...m,
    rol: es ? m.rol : t.roles[m.rol.trim()] ?? m.rol,
  }));

  // En castellano manda el panel (con el diccionario de respaldo); en inglés, el diccionario.
  const pick = (value: string | undefined, fallback: string) => (es && value) || fallback;
  const c = {
    eyebrow: pick(panel.headerBadge, t.header.eyebrow),
    title: pick(panel.headerTitulo, t.header.title),
    description: pick(panel.headerDescripcion, t.header.description),
    philosophyTitle: pick(panel.filosofiaTitulo, t.philosophy.title),
    philosophyText: pick(panel.filosofiaTexto, t.philosophy.text),
    gridTag: pick(panel.gridTag, t.grid.tag),
    gridTitle: pick(panel.gridTitulo, t.grid.title),
    gridIntro: pick(panel.gridDescripcion, t.grid.intro),
    ctaTitle: pick(panel.ctaTitulo, t.cta.title),
    ctaDescription: pick(panel.ctaDescripcion, t.cta.description),
  };
  const image = panel.imagenDestacada || panel.headerBgImage || HEADER_IMAGE;
  const path = localizedPath(ROUTES.team, locale);

  // Sin la lista de personas: solo se publicaría en los datos estructurados con el equipo real
  // (nombres y fotos de cada persona) cargado en el panel.
  const jsonLd = pageJsonLd({
    type: "AboutPage",
    path,
    name: t.meta.title,
    description: t.meta.description,
    extra: {
      inLanguage: es ? "es-ES" : "en",
      primaryImageOfPage: image.startsWith("/") ? `${SITE.url}${image}` : image,
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
          <dl className="grid grid-cols-2 border-t border-ink/15">
            <div className="pt-5 pr-4">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-mid">{t.stats.people}</dt>
              <dd className="display-title mt-2 text-4xl">{String(miembros.length).padStart(2, "0")}</dd>
            </div>
            <div className="border-l border-ink/15 pl-4 pt-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-mid">{t.stats.lead}</dt>
              <dd className="display-title mt-2 text-4xl">01</dd>
            </div>
          </dl>
        }
        image={image}
        imageAlt={t.header.alt}
        imagePosition="object-top"
        caption={t.header.caption}
      />

      {/* 01 · Filosofía */}
      <EditorialSection number="01" label={t.philosophy.label} title={c.philosophyTitle}>
        <p className="reveal-item display-title max-w-3xl text-2xl leading-snug text-ink sm:text-3xl">{c.philosophyText}</p>
        <Link href={localizedPath(METHOD_HREF, locale)} className="reveal-item arrow-link mt-10 inline-flex">
          {t.philosophy.link} <span aria-hidden="true">↗</span>
        </Link>
      </EditorialSection>

      {/* 02 · Profesionales: solo nombre y función, sin fotos. */}
      <EditorialSection tone="white" number="02" label={c.gridTag} title={c.gridTitle} intro={c.gridIntro}>
        <ul className="grid grid-cols-1 border-t border-ink/15 sm:grid-cols-2">
          {miembros.map((m, i) => (
            <li
              key={m.nombre + i}
              className="reveal-item group flex items-baseline gap-6 border-b border-ink/15 py-7 sm:py-9 sm:odd:pr-8 sm:even:border-l sm:even:pl-8"
              style={{ transitionDelay: `${(i % 2) * 80}ms` }}
            >
              <span className="w-8 shrink-0 text-[10px] tracking-[0.22em] text-bronze">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <h3 className="display-title text-2xl leading-tight sm:text-3xl">{m.nombre}</h3>
                <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-mid">{m.rol}</p>
              </div>
            </li>
          ))}
        </ul>
      </EditorialSection>

      <EditorialCta
        label={t.cta.label}
        title={c.ctaTitle}
        description={c.ctaDescription}
        meta={
          <ul className="space-y-1">
            <li>
              <a href={`tel:${settings.telefono.replace(/[^+\d]/g, "")}`} className="transition-colors hover:text-paper">
                {settings.telefono}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="break-all transition-colors hover:text-paper">
                {settings.email}
              </a>
            </li>
            {settings.direccion && <li className="text-paper/50">{settings.direccion}</li>}
          </ul>
        }
      >
        <ContactTrigger mode="rapido" source={es ? "Equipo" : "Equipo · EN"} className="btn btn-paper">
          {t.cta.button} <span aria-hidden="true">→</span>
        </ContactTrigger>
        <Link href={localizedPath(ROUTES.careers, locale)} className="btn btn-ghost-light">
          {t.cta.careers}
        </Link>
      </EditorialCta>
    </main>
  );
}
