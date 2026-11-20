import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import HtmlLang from "@/components/i18n/HtmlLang";
import { getSettings } from "@/lib/wordpress";
import { LEGAL, ROUTES, SITE, ogImage } from "@/lib/site";
import { languageAlternates, localizedPath } from "@/lib/i18n";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Privacy policy — ALKO",
  description: "How ALKO processes the personal data you give us through this website and what your rights are.",
  alternates: { canonical: localizedPath(ROUTES.privacy, "en"), languages: languageAlternates(ROUTES.privacy) },
  openGraph: {
    title: "Privacy policy — ALKO",
    description: "How ALKO processes the personal data you give us through this website and what your rights are.",
    url: localizedPath(ROUTES.privacy, "en"),
    type: "website",
    locale: "en_GB",
    siteName: SITE.name,
    images: [ogImage("en")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy policy — ALKO",
    description: "How ALKO processes the personal data you give us through this website and what your rights are.",
  },
};

/** Fecha de la última actualización en inglés (LEGAL.actualizada está en castellano: «noviembre de 2026»). */
const MONTHS: Record<string, string> = {
  enero: "January",
  febrero: "February",
  marzo: "March",
  abril: "April",
  mayo: "May",
  junio: "June",
  julio: "July",
  agosto: "August",
  septiembre: "September",
  octubre: "October",
  noviembre: "November",
  diciembre: "December",
};
const updated = LEGAL.actualizada.replace(/^(\p{L}+)\s+de\s+(\d{4})$/u, (all, month: string, year: string) =>
  MONTHS[month.toLowerCase()] ? `${MONTHS[month.toLowerCase()]} ${year}` : all,
);

function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section id={`apartado-${n}`} className="grid scroll-mt-28 grid-cols-12 gap-x-6 gap-y-4 border-t border-ink/15 py-10 sm:py-12">
      <div className="col-span-12 lg:col-span-4">
        <div className="flex items-baseline gap-4 lg:sticky lg:top-32 lg:block">
          <span className="display-title text-3xl text-bronze lg:text-5xl">{n}</span>
          <h2 className="display-title text-2xl leading-tight sm:text-3xl lg:mt-4">{title}</h2>
        </div>
      </div>
      <div className="col-span-12 max-w-2xl space-y-4 leading-relaxed text-mid lg:col-span-7 lg:col-start-6 [&_a]:text-ink [&_a]:underline [&_a]:decoration-bronze [&_a]:underline-offset-4 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:space-y-2 [&_ul>li]:relative [&_ul>li]:pl-6 [&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:text-bronze [&_ul>li]:before:content-['—']">
        {children}
      </div>
    </section>
  );
}

const SECTIONS = [
  "Data controller",
  "What data we process",
  "What we use it for",
  "Legal basis",
  "How long we keep it",
  "Who else can access it",
  "Your rights",
  "Security",
  "Cookies",
  "Changes to this policy",
];

/** Política de privacidad en inglés (traducción de /politica-de-privacidad; en caso de duda prevalece la versión en castellano). */
export default async function PrivacyPageEn() {
  const settings = await getSettings();
  const email = settings.email;

  return (
    <main className="bg-paper text-ink">
      <HtmlLang locale="en" />
      <EditorialHeader
        locale="en"
        breadcrumbs={[{ label: "Privacy policy" }]}
        eyebrow="Legal"
        title="Privacy policy"
        description="What data we collect on this website, what we use it for and how you can exercise your rights."
        aside={
          <nav aria-label="Sections">
            <ol className="grid grid-cols-1 border-t border-ink/15 sm:grid-cols-2 sm:gap-x-6">
              {SECTIONS.map((label, i) => {
                const n = String(i + 1).padStart(2, "0");
                return (
                  <li key={n}>
                    <a
                      href={`#apartado-${n}`}
                      className="flex items-baseline gap-3 border-b border-ink/15 py-2.5 text-sm transition-colors hover:text-bronze"
                    >
                      <span className="text-[10px] tracking-[0.18em] text-bronze">{n}</span>
                      {label}
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        }
      />

      <div className="site-wrap pb-20 pt-10 sm:pb-28">
        <p className="max-w-3xl pb-10 text-lg leading-relaxed text-mid sm:pb-12">
          At ALKO we process your personal data in accordance with Regulation (EU) 2016/679 (GDPR) and Spain’s Organic Law
          3/2018 on the Protection of Personal Data and Guarantee of Digital Rights (LOPDGDD). Here we explain clearly how
          we do it. This is a translation of our{" "}
          <Link href={ROUTES.privacy} hrefLang="es" className="text-ink underline decoration-bronze underline-offset-4">
            Spanish privacy policy
          </Link>
          , which prevails in case of any discrepancy.
        </p>

        <Section n="01" title="Data controller">
          <ul>
            <li>
              <strong>Controller:</strong> {LEGAL.titular}
            </li>
            {LEGAL.nif && (
              <li>
                <strong>Tax ID (NIF):</strong> {LEGAL.nif}
              </li>
            )}
            <li>
              <strong>Address:</strong> {settings.direccion}
            </li>
            <li>
              <strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a>
            </li>
            <li>
              <strong>Phone:</strong> {settings.telefono}
            </li>
          </ul>
        </Section>

        <Section n="02" title="What data we process">
          <p>Only the data you give us directly through the website:</p>
          <ul>
            <li>
              <strong>Contact and quote forms:</strong> name, email address, phone number, the message you write to us, the
              project details and any files you attach (drawings, photos or documents).
            </li>
            <li>
              <strong>Careers:</strong> the details of your application and the CV you send us.
            </li>
            <li>
              <strong>WhatsApp, phone or email:</strong> the data you share when you contact us through those channels.
            </li>
          </ul>
          <p>
            Please do not include third-party data or special categories of data (health, beliefs, etc.) in your messages
            or attachments.
          </p>
        </Section>

        <Section n="03" title="What we use it for">
          <ul>
            <li>To answer your enquiries and prepare assessments or quotes.</li>
            <li>To manage the pre-contractual relationship and, if you commission work from us, the contractual one.</li>
            <li>To assess your application in our recruitment processes.</li>
          </ul>
          <p>We do not make automated decisions or create profiles with your data.</p>
        </Section>

        <Section n="04" title="Legal basis">
          <ul>
            <li>
              <strong>Your consent</strong>, when you send us a form or an application (Art. 6.1.a GDPR). You can withdraw
              it at any time.
            </li>
            <li>
              <strong>Taking steps prior to entering into a contract, or performing a contract</strong> to which you are a
              party, when you ask us for a quote or commission work from us (Art. 6.1.b GDPR).
            </li>
            <li>
              <strong>Compliance with legal obligations</strong>, for example tax and accounting obligations (Art. 6.1.c
              GDPR).
            </li>
          </ul>
        </Section>

        <Section n="05" title="How long we keep it">
          <ul>
            <li>Enquiries and quotes that are not accepted: up to one year from the last contact.</li>
            <li>Clients: for as long as the relationship lasts and, afterwards, for the periods required by law.</li>
            <li>Applications: up to one year, unless you ask us to delete them sooner.</li>
          </ul>
          <p>After those periods, the data is securely deleted or blocked.</p>
        </Section>

        <Section n="06" title="Who else can access it">
          <p>
            We do not sell or pass on your data to third parties, except where required by law. For the website to work we
            use providers that act as data processors (web hosting, database, email and file storage), with whom we have
            signed the safeguards required by the GDPR.
          </p>
          <p>
            Some of these providers may be located outside the European Economic Area. In that case, the transfer is
            covered by adequacy decisions of the European Commission or by standard contractual clauses.
          </p>
        </Section>

        <Section n="07" title="Your rights">
          <p>
            You can exercise your rights of access, rectification, erasure, objection, restriction of processing and data
            portability at any time, and withdraw your consent. Write to us at <a href={`mailto:${email}`}>{email}</a>{" "}
            stating which right you wish to exercise.
          </p>
          <p>
            If you feel we have not handled your request properly, you can lodge a complaint with the Spanish Data
            Protection Agency (AEPD) at{" "}
            <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
              www.aepd.es
            </a>
            .
          </p>
        </Section>

        <Section n="08" title="Security">
          <p>
            We apply technical and organisational measures to protect your data against loss, unauthorised access or
            misuse, such as an encrypted connection (HTTPS) and restricted access to the information.
          </p>
        </Section>

        <Section n="09" title="Cookies">
          <p>
            This website only uses the cookies and technical storage needed for it to work. We do not use analytics or
            advertising cookies. If we add them in the future, we will ask for your consent first.
          </p>
        </Section>

        <Section n="10" title="Changes to this policy">
          <p>
            We may update this policy to reflect legal changes or changes to our services. The version in force is always
            the one published on this page.
          </p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-mid">Last updated: {updated}</p>
        </Section>

        <div className="border-t border-ink/15 pt-10">
          <Link href={localizedPath(ROUTES.contact, "en")} className="btn btn-outline">
            Contact {SITE.name} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
