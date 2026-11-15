import Image from "@/components/ui/Image";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import EditorialSection from "@/components/editorial/EditorialSection";
import EditorialCta from "@/components/editorial/EditorialCta";
import { ROUTES } from "@/lib/site";
import { pageJsonLd, pageMetadata } from "@/lib/seo";
import type { PosicionEmpleo } from "@/lib/types";
import { getSettings } from "@/lib/wordpress";
import { getDbEmpleoPageContent } from "@/lib/db/mysql";
import { DEFAULT_POSICIONES_EMPLEO } from "@/lib/content";
import JobPositionsList from "@/components/empleo/JobPositionsList";
import JobApplyCtaButton from "@/components/empleo/JobApplyCtaButton";

export const revalidate = 60;

const EMPLEO_TITLE = "Empleo en construcción en Madrid: trabaja en ALKO";

/** Posiciones abiertas (las desactivadas en el panel no cuentan). */
function posicionesAbiertas(posiciones?: PosicionEmpleo[]) {
  const lista = posiciones && posiciones.length > 0 ? posiciones : DEFAULT_POSICIONES_EMPLEO;
  return lista.filter((p) => p.activa !== false);
}

function empleoDescription(posiciones: PosicionEmpleo[]) {
  const puestos = posiciones.map((p) => p.titulo.trim().toLowerCase()).filter(Boolean);
  if (puestos.length === 0) {
    return "Únete al equipo de ALKO, empresa de construcción y reformas integrales en Madrid. Envíanos tu candidatura espontánea.";
  }
  // Separados solo por comas: un puesto puede llevar «y» en su nombre (compras y aprovisionamiento).
  return `Únete a ALKO, construcción y reformas integrales en Madrid. Buscamos: ${puestos.join(", ")}.`;
}

export async function generateMetadata() {
  const pageContent = await getDbEmpleoPageContent();
  return pageMetadata({
    title: EMPLEO_TITLE,
    description: empleoDescription(posicionesAbiertas(pageContent.posiciones)),
    path: ROUTES.careers,
  });
}

export default async function TrabajaConNosotrosPage() {
  const [settings, pageContent] = await Promise.all([
    getSettings(),
    getDbEmpleoPageContent(),
  ]);

  const listaPosiciones =
    pageContent.posiciones && pageContent.posiciones.length > 0
      ? pageContent.posiciones
      : DEFAULT_POSICIONES_EMPLEO;

  const abiertas = posicionesAbiertas(pageContent.posiciones);
  const jsonLd = pageJsonLd({
    path: ROUTES.careers,
    name: EMPLEO_TITLE,
    description: empleoDescription(abiertas),
    // Puestos abiertos como lista; para ofertas de empleo completas (JobPosting) Google pide
    // fecha de publicación de cada una, que el panel no guarda.
    extra:
      abiertas.length > 0
        ? {
            mainEntity: {
              "@type": "ItemList",
              name: "Posiciones abiertas",
              itemListElement: abiertas.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: p.titulo,
                ...(p.resumen && { description: p.resumen }),
              })),
            },
          }
        : {},
  });

  const candidaturaHref = (puesto?: string) => {
    const subject = puesto ? `Candidatura — ${puesto}` : "Candidatura espontánea ALKO";
    return `mailto:${settings.email}?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <main className="bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EditorialHeader
        breadcrumbs={[{ label: "Empresa", href: ROUTES.company }, { label: "Trabaja con nosotros" }]}
        eyebrow={pageContent.headerBadge || "Trabaja con nosotros"}
        title={pageContent.headerTitulo || "Construimos con las personas"}
        description={
          pageContent.headerDescripcion ||
          "Buscamos profesionales que compartan nuestro criterio técnico y quieran crecer dentro de un equipo que trabaja como una dirección única."
        }
        aside={
          <a
            href="#posiciones"
            className="group flex items-end justify-between gap-6 border-t border-ink/15 pt-5 transition-colors hover:text-bronze"
          >
            <span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-mid">Posiciones abiertas</span>
              <span className="display-title mt-2 block text-5xl">{String(abiertas.length).padStart(2, "0")}</span>
            </span>
            <span className="pb-2 text-[11px] uppercase tracking-[0.22em]">
              Ver puestos <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-y-0.5">↓</span>
            </span>
          </a>
        }
        image={pageContent.headerBgImage || "/proceso-control.jpg"}
        imageAlt="Equipo de ALKO en obra"
        caption="Trabajo en obra"
      />

      {/* 01 · Cultura */}
      <EditorialSection
        number="01"
        label={pageContent.culturaTag || "El equipo ALKO"}
        title={pageContent.culturaTitulo || "Un equipo pequeño, con criterio y sin intermediarios"}
      >
        <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
          <p className="reveal-item text-lg leading-relaxed text-mid">
            {pageContent.culturaParrafo1 ||
              "En ALKO cada persona tiene responsabilidad real sobre el proyecto. Trabajamos cerca de la obra, con decisiones rápidas y una única dirección técnica."}
          </p>
          <p className="reveal-item text-lg leading-relaxed text-mid" style={{ transitionDelay: "100ms" }}>
            {pageContent.culturaParrafo2 ||
              "Buscamos perfiles con oficio y ambición de crecer: gente que disfrute resolviendo problemas constructivos y cuidando el detalle hasta la entrega."}
          </p>
        </div>
        <div className="reveal-scale relative mt-14 aspect-[16/9] overflow-hidden bg-piedra">
          <Image
            src={pageContent.culturaImagen || "/proceso-construccion.jpg"}
            alt="Equipo de obra de ALKO trabajando en un proyecto"
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
        label={pageContent.posicionesTag || "Posiciones abiertas"}
        title={pageContent.posicionesTitulo || "Únete al equipo"}
        intro={
          pageContent.posicionesSubtitulo ||
          "Envíanos tu candidatura por correo. Valoramos perfiles técnicos con experiencia en obra."
        }
      >
        <JobPositionsList posiciones={listaPosiciones} />
      </EditorialSection>

      <EditorialCta
        label="Candidatura espontánea"
        title={pageContent.ctaTitulo || "¿No encuentras tu puesto ideal?"}
        description={
          pageContent.ctaDescripcion ||
          "Envíanos una candidatura espontánea. Nos interesa conocer perfiles con criterio técnico, aunque no haya una posición abierta."
        }
        meta={
          <a href={candidaturaHref()} className="break-all transition-colors hover:text-paper">
            {settings.email}
          </a>
        }
      >
        <JobApplyCtaButton vacantes={listaPosiciones} />
      </EditorialCta>
    </main>
  );
}
