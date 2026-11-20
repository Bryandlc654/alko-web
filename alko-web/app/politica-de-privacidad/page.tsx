import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import { getSettings } from "@/lib/wordpress";
import { LEGAL, ROUTES, SITE } from "@/lib/site";
import { languageAlternates } from "@/lib/i18n";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Política de privacidad — ALKO",
  description: "Cómo trata ALKO los datos personales que nos facilitas a través de esta web y qué derechos tienes.",
  alternates: { canonical: ROUTES.privacy, languages: languageAlternates(ROUTES.privacy) },
};

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

const APARTADOS = [
  "Responsable del tratamiento",
  "Qué datos tratamos",
  "Para qué los usamos",
  "Base legal",
  "Cuánto tiempo los conservamos",
  "Quién más puede acceder",
  "Tus derechos",
  "Seguridad",
  "Cookies",
  "Cambios en esta política",
];

export default async function PrivacyPage() {
  const settings = await getSettings();
  const email = settings.email;

  return (
    <main className="bg-paper text-ink">
      <EditorialHeader
        breadcrumbs={[{ label: "Política de privacidad" }]}
        eyebrow="Legal"
        title="Política de privacidad"
        description="Qué datos recogemos en esta web, para qué los usamos y cómo puedes ejercer tus derechos."
        aside={
          <nav aria-label="Apartados">
            <ol className="grid grid-cols-1 border-t border-ink/15 sm:grid-cols-2 sm:gap-x-6">
              {APARTADOS.map((label, i) => {
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
          En ALKO tratamos tus datos personales conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica
          3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD). Aquí te explicamos
          de forma clara cómo lo hacemos.
        </p>

        <Section n="01" title="Responsable del tratamiento">
          <ul>
            <li>
              <strong>Titular:</strong> {LEGAL.titular}
            </li>
            {LEGAL.nif && (
              <li>
                <strong>NIF:</strong> {LEGAL.nif}
              </li>
            )}
            <li>
              <strong>Dirección:</strong> {settings.direccion}
            </li>
            <li>
              <strong>Correo electrónico:</strong> <a href={`mailto:${email}`}>{email}</a>
            </li>
            <li>
              <strong>Teléfono:</strong> {settings.telefono}
            </li>
          </ul>
        </Section>

        <Section n="02" title="Qué datos tratamos">
          <p>Solo los que nos facilitas tú directamente a través de la web:</p>
          <ul>
            <li>
              <strong>Formularios de contacto y presupuesto:</strong> nombre, correo electrónico, teléfono, el mensaje
              que nos escribas, los datos del proyecto y los archivos que adjuntes (planos, fotos o documentos).
            </li>
            <li>
              <strong>Trabaja con nosotros:</strong> los datos de tu candidatura y el currículum que nos envíes.
            </li>
            <li>
              <strong>WhatsApp, teléfono o correo:</strong> los datos que compartas al contactarnos por esos canales.
            </li>
          </ul>
          <p>
            Te pedimos que no incluyas datos de terceros ni datos especialmente protegidos (salud, ideología, etc.)
            en los mensajes o adjuntos.
          </p>
        </Section>

        <Section n="03" title="Para qué los usamos">
          <ul>
            <li>Responder a tus consultas y preparar valoraciones o presupuestos.</li>
            <li>Gestionar la relación precontractual y, si nos encargas una obra, la contractual.</li>
            <li>Valorar tu candidatura en nuestros procesos de selección.</li>
          </ul>
          <p>No tomamos decisiones automatizadas ni elaboramos perfiles con tus datos.</p>
        </Section>

        <Section n="04" title="Base legal">
          <ul>
            <li>
              <strong>Tu consentimiento</strong>, al enviarnos un formulario o una candidatura (art. 6.1.a RGPD). Puedes
              retirarlo cuando quieras.
            </li>
            <li>
              <strong>La aplicación de medidas precontractuales o la ejecución de un contrato</strong> en el que eres
              parte, cuando nos pides un presupuesto o nos encargas una obra (art. 6.1.b RGPD).
            </li>
            <li>
              <strong>El cumplimiento de obligaciones legales</strong>, por ejemplo fiscales y contables (art. 6.1.c
              RGPD).
            </li>
          </ul>
        </Section>

        <Section n="05" title="Cuánto tiempo los conservamos">
          <ul>
            <li>Consultas y presupuestos no aceptados: hasta un año desde el último contacto.</li>
            <li>Clientes: mientras dure la relación y, después, durante los plazos que exige la ley.</li>
            <li>Candidaturas: hasta un año, salvo que nos pidas borrarlas antes.</li>
          </ul>
          <p>Pasados esos plazos, los datos se eliminan o se bloquean de forma segura.</p>
        </Section>

        <Section n="06" title="Quién más puede acceder">
          <p>
            No vendemos ni cedemos tus datos a terceros, salvo obligación legal. Para que la web funcione contamos con
            proveedores que actúan como encargados del tratamiento (alojamiento web, base de datos, correo
            electrónico y almacenamiento de archivos), con los que tenemos firmadas las garantías que exige el RGPD.
          </p>
          <p>
            Algunos de estos proveedores pueden estar fuera del Espacio Económico Europeo. En ese caso, la
            transferencia se ampara en decisiones de adecuación de la Comisión Europea o en cláusulas contractuales
            tipo.
          </p>
        </Section>

        <Section n="07" title="Tus derechos">
          <p>
            Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición, limitación
            del tratamiento y portabilidad, así como retirar tu consentimiento. Escríbenos a{" "}
            <a href={`mailto:${email}`}>{email}</a> indicando qué derecho quieres ejercer.
          </p>
          <p>
            Si consideras que no hemos atendido bien tu solicitud, puedes presentar una reclamación ante la Agencia
            Española de Protección de Datos en{" "}
            <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
              www.aepd.es
            </a>
            .
          </p>
        </Section>

        <Section n="08" title="Seguridad">
          <p>
            Aplicamos medidas técnicas y organizativas para proteger tus datos frente a pérdidas, accesos no
            autorizados o usos indebidos, como la conexión cifrada (HTTPS) y el acceso restringido a la información.
          </p>
        </Section>

        <Section n="09" title="Cookies">
          <p>
            Esta web solo utiliza las cookies y el almacenamiento técnico necesarios para que funcione. No usamos
            cookies de analítica ni de publicidad. Si en el futuro las incorporamos, te pediremos antes tu
            consentimiento.
          </p>
        </Section>

        <Section n="10" title="Cambios en esta política">
          <p>
            Podemos actualizar esta política para adaptarla a cambios legales o de nuestros servicios. La versión
            vigente es siempre la publicada en esta página.
          </p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-mid">
            Última actualización: {LEGAL.actualizada}
          </p>
        </Section>

        <div className="border-t border-ink/15 pt-10">
          <Link
            href={ROUTES.contact}
            className="btn btn-outline"
          >
            Contactar con {SITE.name} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
