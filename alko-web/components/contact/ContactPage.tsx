import type { Metadata } from "next";
import Image from "@/components/ui/Image";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import EditorialSection from "@/components/editorial/EditorialSection";
import HtmlLang from "@/components/i18n/HtmlLang";
import QuickContactForm from "@/components/ui/QuickContactForm";
import { getDbContactoPageContent } from "@/lib/db/mysql";
import { LOCALE_META, languageAlternates, localizedPath, type Locale } from "@/lib/i18n";
import { CONTACT_PAGE_COPY } from "@/lib/i18n/contact-page";
import { pageJsonLd } from "@/lib/seo";
import { OG_IMAGE, ogImage, siteKeywords, ROUTES, SITE } from "@/lib/site";
import { getSettings } from "@/lib/wordpress";

const OFFICE_IMAGE = "/oficinas.jpg";

/** Metadatos de cada idioma, con canonical propio y alternativas hreflang. */
export function contactMetadata(locale: Locale): Metadata {
  const t = CONTACT_PAGE_COPY[locale];
  const path = localizedPath(ROUTES.contact, locale);
  return {
    title: { absolute: t.meta.title },
    description: t.meta.description,
    alternates: { canonical: path, languages: languageAlternates(ROUTES.contact) },
    keywords: siteKeywords(locale),
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      url: path,
      type: "website",
      locale: LOCALE_META[locale].ogLocale,
      alternateLocale: [LOCALE_META[locale === "es" ? "en" : "es"].ogLocale],
      siteName: SITE.name,
      images: [ogImage(locale)],
    },
  };
}

/** Un teléfono de relleno («+34 910 000 000») no se publica en los datos estructurados. */
const isPlaceholderPhone = (phone: string) => /0{6,}/.test(phone.replace(/\D/g, ""));

interface Channel {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

/**
 * Contacto, compartida por /contacto y /en/contact: cabecera tipográfica, formulario, canales,
 * pasos y oficina. En castellano, los textos del panel; en inglés, los del diccionario.
 */
export default async function ContactPage({ locale }: { locale: Locale }) {
  const t = CONTACT_PAGE_COPY[locale];
  const es = locale === "es";
  const [settings, panel] = await Promise.all([getSettings(), getDbContactoPageContent()]);

  const telHref = `tel:${settings.telefono.replace(/[^+\d]/g, "")}`;
  const whatsappHref = `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.direccion)}`;

  // En castellano manda el panel (con el diccionario de respaldo); en inglés, el diccionario.
  const pick = (value: string | undefined, fallback: string) => (es && value) || fallback;
  const c = {
    eyebrow: pick(panel.headerBadge, t.header.eyebrow),
    title: pick(panel.headerTitulo, t.header.title),
    description: pick(panel.headerDescripcion, t.header.description),
    formTag: pick(panel.formTag, t.form.tag),
    formTitle: pick(panel.formTitulo, t.form.title),
    channelsTag: pick(panel.canalesTag, t.channels.tag),
    channelsTitle: pick(panel.canalesTitulo, t.channels.title),
    channelsIntro: pick(panel.canalesDescripcion, t.channels.intro),
    stepsTag: pick(panel.pasosTag, t.steps.tag),
    stepsTitle: pick(panel.pasosTitulo, t.steps.title),
    officeTag: pick(panel.oficinaTag, t.office.tag),
    officeTitle: pick(panel.oficinaTitulo, t.office.title),
  };
  const steps = es && panel.pasos && panel.pasos.length > 0 ? panel.pasos : t.steps.items;
  const officeImage = panel.oficinaImagen || OFFICE_IMAGE;

  const channels: Channel[] = [
    { label: t.channels.phone, value: settings.telefono, href: telHref },
    { label: t.channels.email, value: settings.email, href: `mailto:${settings.email}` },
    { label: t.channels.whatsapp, value: t.channels.whatsappValue, href: whatsappHref, external: true },
    ...(settings.horario ? [{ label: t.channels.hours, value: settings.horario }] : []),
  ];

  // La página de contacto y la empresa con sus datos de contacto (los mismos que se ven).
  const postalCode = settings.direccion?.match(/\b\d{5}\b/)?.[0];
  const phone = settings.telefono && !isPlaceholderPhone(settings.telefono) ? settings.telefono : undefined;
  const jsonLd = pageJsonLd({
    type: "ContactPage",
    path: localizedPath(ROUTES.contact, locale),
    name: t.meta.title,
    description: t.meta.description,
    organization: {
      ...(phone && { telephone: phone }),
      ...(settings.email && { email: settings.email }),
      ...(settings.direccion && {
        address: {
          "@type": "PostalAddress",
          streetAddress: settings.direccion.split(",")[0].trim(),
          ...(postalCode && { postalCode }),
          addressLocality: "Madrid",
          addressRegion: "Comunidad de Madrid",
          addressCountry: "ES",
        },
      }),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        ...(phone && { telephone: phone }),
        ...(settings.email && { email: settings.email }),
        areaServed: "ES",
        availableLanguage: ["Spanish", "English"],
      },
    },
    extra: {
      inLanguage: es ? "es-ES" : "en",
      primaryImageOfPage: /^https?:\/\//.test(officeImage) ? officeImage : `${SITE.url}${officeImage}`,
    },
  });

  return (
    <main className="bg-paper text-ink">
      <HtmlLang locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EditorialHeader
        locale={locale}
        breadcrumbs={[{ label: t.breadcrumb }]}
        eyebrow={c.eyebrow}
        title={<span className="whitespace-pre-line">{c.title}</span>}
        description={<span className="whitespace-pre-line">{c.description}</span>}
        aside={
          <div className="flex flex-col gap-3">
            <a
              href="#formulario"
              className="group flex items-center justify-between border-b border-ink/15 pb-3 text-[11px] uppercase tracking-[0.22em] transition-colors hover:text-bronze"
            >
              {t.header.quote} <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">↓</span>
            </a>
            <a
              href={telHref}
              className="group flex items-center justify-between border-b border-ink/15 pb-3 text-[11px] uppercase tracking-[0.22em] transition-colors hover:text-bronze"
            >
              {t.header.call} · {settings.telefono} <span aria-hidden="true">↗</span>
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between border-b border-ink/15 pb-3 text-[11px] uppercase tracking-[0.22em] transition-colors hover:text-bronze"
            >
              WhatsApp <span aria-hidden="true">↗</span>
            </a>
          </div>
        }
      />

      {/* 01 · Formulario */}
      <EditorialSection id="formulario" number="01" label={c.formTag} title={c.formTitle} intro={t.form.intro}>
        <div className="reveal-item bg-ink p-6 text-white sm:p-10 lg:p-14">
          <QuickContactForm email={settings.email} whatsappHref={whatsappHref} source={t.form.source} locale={locale} />
        </div>
      </EditorialSection>

      {/* 02 · Canales */}
      <EditorialSection tone="white" number="02" label={c.channelsTag} title={c.channelsTitle} intro={c.channelsIntro}>
        <ul className="grid grid-cols-1 border-l border-t border-ink/15 sm:grid-cols-2">
          {channels.map(({ label, value, href, external }, i) => {
            const content = (
              <>
                <span className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-mid">
                  <span>
                    <span className="text-bronze">{String(i + 1).padStart(2, "0")}</span> · {label}
                  </span>
                  {href && (
                    <span aria-hidden="true" className="text-sm transition-colors group-hover:text-bronze">
                      ↗
                    </span>
                  )}
                </span>
                <span className="display-title mt-10 block break-words text-2xl transition-colors group-hover:text-bronze sm:text-[1.7rem]">
                  {value}
                </span>
              </>
            );
            return (
              <li key={label} className="reveal-item border-b border-r border-ink/15" style={{ transitionDelay: `${i * 80}ms` }}>
                {href ? (
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group block h-full p-6 transition-colors hover:bg-paper sm:p-8"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="h-full p-6 sm:p-8">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </EditorialSection>

      {/* 03 · Pasos */}
      <EditorialSection tone="ink" number="03" label={c.stepsTag} title={c.stepsTitle}>
        <ol className="border-t border-paper/15">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="reveal-item grid grid-cols-12 items-baseline gap-x-6 gap-y-3 border-b border-paper/15 py-8 sm:py-10"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="col-span-12 text-[10px] uppercase tracking-[0.22em] text-bronze-light sm:col-span-2">
                {t.steps.step} {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display-title col-span-12 text-3xl sm:col-span-5 sm:text-4xl">{step.title}</h3>
              <p className="col-span-12 max-w-md leading-relaxed text-paper/60 sm:col-span-5">{step.text}</p>
            </li>
          ))}
        </ol>
      </EditorialSection>

      {/* 04 · Oficina */}
      <EditorialSection number="04" label={c.officeTag} title={c.officeTitle}>
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="reveal-scale relative col-span-12 aspect-[16/10] overflow-hidden bg-piedra lg:col-span-8">
            <Image src={officeImage} alt={t.office.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="reveal-item col-span-12 flex flex-col justify-between lg:col-span-4">
            <dl className="divide-y divide-ink/10 border-y border-ink/10 text-sm">
              <div className="py-4">
                <dt className="text-[10px] uppercase tracking-[0.22em] text-mid">{t.office.address}</dt>
                <dd className="mt-2 text-base">{settings.direccion}</dd>
              </div>
              {settings.horario && (
                <div className="py-4">
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-mid">{t.office.hours}</dt>
                  <dd className="mt-2 text-base">{settings.horario}</dd>
                </div>
              )}
            </dl>
            <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="btn btn-ink mt-10 self-start">
              {t.office.directions} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </EditorialSection>
    </main>
  );
}
