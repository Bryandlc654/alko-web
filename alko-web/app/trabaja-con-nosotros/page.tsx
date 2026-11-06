import Image from "@/components/ui/Image";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
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
    <main className="bg-white text-stone-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        breadcrumbs={[{ label: "Empresa", href: ROUTES.company }, { label: "Trabaja con nosotros" }]}
        eyebrow={pageContent.headerBadge || "TRABAJA CON NOSOTROS"}
        title={pageContent.headerTitulo || "Construimos con las personas"}
        description={
          pageContent.headerDescripcion ||
          "Buscamos profesionales que compartan nuestro criterio técnico y quieran crecer dentro de un equipo que trabaja como una dirección única."
        }
        image={pageContent.headerBgImage || "/proceso-control.jpg"}
      />

      {/* Cultura */}
      <section className="relative isolate w-full overflow-hidden bg-white text-stone-900">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] mx-auto hidden max-w-[1780px] grid-cols-6 px-6 sm:px-12 lg:grid lg:px-20"
        >
          <div className="h-full border-x border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
          <div className="h-full border-r border-black/[0.06]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1720px] px-6 py-16 sm:px-12 sm:py-24 lg:px-20">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-14">
            <div className="relative pt-1 lg:col-span-5 reveal-item">
              <span className="font-mono text-xs tracking-widest text-stone-500 uppercase">
                {pageContent.culturaTag || "El equipo ALKO"}
              </span>
            </div>

            <div
              className="lg:col-span-7 lg:pl-10 xl:pl-16 reveal-item"
              style={{ transitionDelay: "120ms" }}
            >
              <h2 className="font-serif font-light text-3xl leading-tight sm:text-4xl lg:text-5xl">
                {pageContent.culturaTitulo ||
                  "Un equipo pequeño, con criterio y sin intermediarios"}
              </h2>
              <p className="mt-5 max-w-lg text-stone-600">
                {pageContent.culturaParrafo1 ||
                  "En ALKO cada persona tiene responsabilidad real sobre el proyecto. Trabajamos cerca de la obra, con decisiones rápidas y una única dirección técnica."}
              </p>
              <p className="mt-4 max-w-lg text-stone-600">
                {pageContent.culturaParrafo2 ||
                  "Buscamos perfiles con oficio y ambición de crecer: gente que disfrute resolviendo problemas constructivos y cuidando el detalle hasta la entrega."}
              </p>
            </div>
          </div>

          <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden bg-stone-100 sm:aspect-[16/7] reveal-scale">
            <Image
              src={pageContent.culturaImagen || "/proceso-construccion.jpg"}
              alt="Equipo de obra de ALKO trabajando en un proyecto"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Posiciones abiertas */}
      <section className="border-t border-stone-200 bg-stone-50 py-16 sm:py-24">
        <Container>
          <div className="flex flex-col justify-between gap-8 border-b border-stone-300/70 pb-10 lg:flex-row lg:items-end">
            <div className="reveal-item">
              <span className="font-mono text-xs tracking-widest text-stone-500 uppercase">
                {pageContent.posicionesTag || "POSICIONES ABIERTAS"}
              </span>
              <h2 className="mt-3 font-serif font-light text-3xl leading-tight sm:text-4xl lg:text-5xl">
                {pageContent.posicionesTitulo || "Únete al equipo"}
              </h2>
            </div>
            <p className="max-w-sm text-sm text-stone-600">
              {pageContent.posicionesSubtitulo ||
                "Envíanos tu candidatura por correo. Valoramos perfiles técnicos con experiencia en obra."}
            </p>
          </div>

          {/* Lista interactiva de vacantes con modal */}
          <JobPositionsList posiciones={listaPosiciones} />
        </Container>
      </section>

      {/* CTA final */}
      <section className="relative w-full overflow-hidden bg-stone-950 group">
        <div className="relative h-[440px] w-full overflow-hidden sm:h-[500px] md:h-[560px]">
          <Image
            src={pageContent.ctaBgImage || "/cta-bg.jpg"}
            alt="Trabaja con ALKO"
            fill
            sizes="100vw"
            className="pointer-events-none select-none object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-[1.01]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent" />
          <div className="absolute inset-0 z-10 mx-auto flex max-w-7xl flex-col justify-between px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-24">
            <div className="pt-8 sm:pt-14">
              <h2 className="text-3xl font-light leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-[68px]">
                {pageContent.ctaTitulo || "¿No encuentras tu puesto ideal?"}
              </h2>
            </div>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-xl">
                <p className="text-sm leading-relaxed text-stone-200/85 sm:text-base">
                  {pageContent.ctaDescripcion ||
                    "Envíanos una candidatura espontánea. Nos interesa conocer perfiles con criterio técnico, aunque no haya una posición abierta."}
                </p>
              </div>
              <div className="shrink-0">
                <JobApplyCtaButton vacantes={listaPosiciones} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
