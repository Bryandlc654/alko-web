import Link from "next/link";
import ContactTrigger from "@/components/contact/ContactTrigger";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import EditorialSection from "@/components/editorial/EditorialSection";
import EditorialCta from "@/components/editorial/EditorialCta";
import { getSettings } from "@/lib/wordpress";
import { getDbEquipoPageContent } from "@/lib/db/mysql";
import { DEFAULT_EQUIPO_MEMBERS } from "@/lib/content";
import { ROUTES } from "@/lib/site";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 60;

const EQUIPO_TITLE = "Equipo de ALKO, construcción y reformas en Madrid";
const EQUIPO_DESCRIPTION =
  "Conoce al equipo de ALKO: dirección técnica, arquitectura, jefatura de obra, instalaciones y atención al cliente, bajo un mismo criterio en cada obra de Madrid.";

export const metadata = pageMetadata({
  title: EQUIPO_TITLE,
  description: EQUIPO_DESCRIPTION,
  path: ROUTES.team,
});

export default async function EquipoPage() {
  const [settings, pageContent] = await Promise.all([
    getSettings(),
    getDbEquipoPageContent(),
  ]);

  const listaMiembros =
    pageContent.miembros && pageContent.miembros.length > 0
      ? pageContent.miembros
      : DEFAULT_EQUIPO_MEMBERS;

  // Sin la lista de personas: solo se publicaría en los datos estructurados con el equipo real
  // (nombres y fotos de cada persona) cargado en el panel.
  const jsonLd = pageJsonLd({
    type: "AboutPage",
    path: ROUTES.team,
    name: EQUIPO_TITLE,
    description: EQUIPO_DESCRIPTION,
  });

  return (
    <main className="bg-paper text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <EditorialHeader
        breadcrumbs={[{ label: "Empresa", href: ROUTES.company }, { label: "Equipo" }]}
        eyebrow={pageContent.headerBadge || "Equipo"}
        title={pageContent.headerTitulo || "Personas detrás de cada obra"}
        description={
          pageContent.headerDescripcion ||
          "Un equipo multidisciplinar que comparte un mismo criterio constructivo. Dirección técnica, arquitectura, obra, instalaciones y atención al cliente."
        }
        aside={
          <dl className="grid grid-cols-2 border-t border-ink/15">
            <div className="pt-5 pr-4">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-mid">Profesionales</dt>
              <dd className="display-title mt-2 text-4xl">{String(listaMiembros.length).padStart(2, "0")}</dd>
            </div>
            <div className="border-l border-ink/15 pl-4 pt-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-mid">Dirección de obra</dt>
              <dd className="display-title mt-2 text-4xl">01</dd>
            </div>
          </dl>
        }
        image={pageContent.imagenDestacada || pageContent.headerBgImage || "/equipo-header.jpg"}
        imageAlt="Supervisor de ALKO revisando la obra con planos"
        imagePosition="object-top"
        caption="El equipo, en obra"
      />

      {/* 01 · Filosofía */}
      <EditorialSection number="01" label="Cómo trabajamos" title={pageContent.filosofiaTitulo || "Menos compartimentos. Más equipo."}>
        <p className="reveal-item display-title max-w-3xl text-2xl leading-snug text-ink sm:text-3xl">
          {pageContent.filosofiaTexto ||
            "Trabajamos como un solo equipo, no como departamentos aislados. Eso reduce interfaces, acelera decisiones y mantiene la coherencia del proyecto de principio a fin."}
        </p>
      </EditorialSection>

      {/* 02 · Profesionales: solo nombre y función, sin fotos. */}
      <EditorialSection
        tone="white"
        number="02"
        label={pageContent.gridTag || "Nuestro equipo"}
        title={pageContent.gridTitulo || "Nuestros profesionales"}
        intro={
          pageContent.gridDescripcion ||
          "Perfiles que comparten un mismo criterio constructivo y una sola dirección de obra."
        }
      >
        <ul className="grid grid-cols-1 border-t border-ink/15 sm:grid-cols-2">
          {listaMiembros.map((m, i) => (
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
        label="Siguiente paso"
        title={pageContent.ctaTitulo || "¿Sumamos tu proyecto al equipo?"}
        description={
          pageContent.ctaDescripcion || "Cuéntanos qué necesitas y te ponemos en contacto con la persona adecuada."
        }
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
        <ContactTrigger mode="rapido" source="Equipo" className="btn btn-paper">
          Solicitar consultoría <span aria-hidden="true">→</span>
        </ContactTrigger>
        <Link href={ROUTES.careers} className="btn btn-ghost-light">
          Trabaja con nosotros
        </Link>
      </EditorialCta>
    </main>
  );
}
