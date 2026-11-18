import Image from "@/components/ui/Image";
import Link from "next/link";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import EditorialSection from "@/components/editorial/EditorialSection";
import FinalContact from "@/components/sections/FinalContact";
import Materials from "@/components/sections/Materials";
import Process from "@/components/sections/Process";
import { METHOD_HREF, ROUTES } from "@/lib/site";
import { METHOD_STEPS } from "@/lib/divisions";
import { pageJsonLd, pageMetadata } from "@/lib/seo";
import { getFabricantes, getProjects, getSectors, getSettings } from "@/lib/wordpress";
import { getDbNosotrosPageContent } from "@/lib/db/mysql";

export const revalidate = 60;

const NOSOTROS_TITLE = "Sobre ALKO, empresa de reformas integrales en Madrid";
const NOSOTROS_DESCRIPTION =
  "Empresa de construcción y reformas integrales en Madrid. Un único responsable de proyecto, compras, instalaciones y acabados, de la primera visita a la entrega.";

export const metadata = pageMetadata({
  title: NOSOTROS_TITLE,
  description: NOSOTROS_DESCRIPTION,
  path: ROUTES.company,
});

/** Mismo método que la portada: cinco etapas con sus imágenes y textos. */
const PROCESO_FASES = METHOD_STEPS.map((step) => ({
  id: `metodo-${step.num}`,
  tag: step.num,
  title: step.title,
  texto: step.text,
  imagen: step.image,
}));

export default async function NosotrosPage() {
  const [settings, projects, sectors, fabricantes, pageContent] = await Promise.all([
    getSettings(),
    getProjects(),
    getSectors(),
    getFabricantes(),
    getDbNosotrosPageContent(),
  ]);

  const destacado = projects[0];
  const cifras = pageContent.cifras && pageContent.cifras.length > 0 ? pageContent.cifras : [
    { valor: "1996", etiqueta: "Construyendo y reformando en Madrid" },
    { valor: "1", etiqueta: "Interlocutor para todo el proyecto" },
    sectors.length > 0 && { valor: String(sectors.length), etiqueta: "Servicios y sectores especializados" },
    METHOD_STEPS.length > 0 && { valor: String(METHOD_STEPS.length), etiqueta: "Fases de control por obra" },
  ].filter(Boolean) as { valor: string; etiqueta: string }[];

  const enlaces = [
    {
      href: ROUTES.team,
      etiqueta: pageContent.enlaceEquipoEtiqueta || "Equipo",
      titulo: pageContent.enlaceEquipoTitulo || "Las personas detrás de cada obra",
      imagen: pageContent.enlaceEquipoImagen || "/proceso-entrega.jpg",
    },
    {
      href: ROUTES.careers,
      etiqueta: pageContent.enlaceEmpleoEtiqueta || "Trabaja con nosotros",
      titulo: pageContent.enlaceEmpleoTitulo || "Buscamos profesionales con criterio",
      imagen: pageContent.enlaceEmpleoImagen || "/proceso-instalaciones.jpg",
    },
  ];

  // Año de fundación, si figura entre las cifras del panel (p. ej. «1996»).
  const fundacion = cifras.find((c) => /^(19|20)\d{2}$/.test(c.valor.trim()))?.valor.trim();
  const jsonLd = pageJsonLd({
    type: "AboutPage",
    path: ROUTES.company,
    name: NOSOTROS_TITLE,
    description: NOSOTROS_DESCRIPTION,
    organization: {
      description: NOSOTROS_DESCRIPTION,
      ...(fundacion && { foundingDate: fundacion }),
      ...(settings.telefono && { telephone: settings.telefono }),
      ...(settings.email && { email: settings.email }),
      ...(sectors.length > 0 && { knowsAbout: sectors.map((s) => s.title) }),
    },
  });

  return (
    <main className="bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EditorialHeader
        breadcrumbs={[{ label: "Nosotros" }]}
        eyebrow={pageContent.headerBadge || "Estudio"}
        title={<span className="whitespace-pre-line">{pageContent.headerTitulo || "Una constructora con sensibilidad arquitectónica."}</span>}
        description={
          pageContent.headerDescripcion ? <span className="whitespace-pre-line">{pageContent.headerDescripcion}</span> : undefined
        }
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
        image={pageContent.headerBgImage || "/nosotros-header.jpg"}
        imageAlt="Cocina abierta al jardín y la piscina en una vivienda reformada por ALKO"
        caption="Estudio ALKO"
      />

      {/* 01 · Introducción */}
      <EditorialSection number="01" label={pageContent.introTag || "Quiénes somos"} title={pageContent.introTitulo}>
        {pageContent.introLead && (
          <p className="reveal-item display-title max-w-3xl whitespace-pre-line text-2xl leading-snug sm:text-3xl">
            {pageContent.introLead}
          </p>
        )}
        <div className="reveal-item mt-10 grid grid-cols-1 gap-x-10 gap-y-6 border-t border-ink/15 pt-10 sm:grid-cols-2">
          <p className="whitespace-pre-line text-lg leading-relaxed text-mid">{pageContent.introCol1}</p>
          <p className="whitespace-pre-line text-lg leading-relaxed text-mid">{pageContent.introCol2}</p>
        </div>
        <div className="reveal-item mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link href={ROUTES.projects} className="btn btn-ink">
            Ver proyectos <span aria-hidden="true">→</span>
          </Link>
          <Link href={METHOD_HREF} className="arrow-link">
            Conoce el método <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </EditorialSection>

      {/* Obra real, enmarcada */}
      {destacado && (
        <section className="bg-paper">
          <div className="site-wrap pb-6">
            <Link href={`${ROUTES.projects}/${destacado.slug}`} className="group block">
              <div className="reveal-scale relative aspect-[4/3] overflow-hidden bg-piedra sm:aspect-[21/9]">
                <Image
                  src={destacado.imagen}
                  alt={destacado.title}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/15 pb-4">
                <span className="text-[10px] uppercase tracking-[0.22em] text-mid">
                  Proyecto · {[destacado.tipologia, destacado.anio].filter(Boolean).join(" · ")}
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
      <EditorialSection number="02" label="ALKO en cifras" tone="ink">
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
      <EditorialSection
        number="03"
        label={pageContent.pilaresTag || "Cómo trabajamos"}
        title={pageContent.pilaresTitulo}
        intro={pageContent.pilaresDescripcion}
        wide
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-3">
          {(pageContent.pilares || []).map((pilar, i) => (
            <article key={pilar.numero + i} className="reveal-item" style={{ transitionDelay: `${i * 120}ms` }}>
              <div className="relative aspect-[4/5] overflow-hidden bg-piedra">
                <Image src={pilar.imagen} alt={pilar.titulo} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
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
        <EditorialSection tone="white" number="04" label={pageContent.metodoTag || "Método ALKO"} title={pageContent.metodoTitulo}>
          {pageContent.metodoLead && (
            <p className="reveal-item display-title max-w-3xl whitespace-pre-line text-2xl leading-snug sm:text-3xl">
              {pageContent.metodoLead}
            </p>
          )}
          <div className="reveal-item mt-10 grid grid-cols-1 gap-x-10 gap-y-6 border-t border-ink/15 pt-10 sm:grid-cols-2">
            <p className="whitespace-pre-line text-lg leading-relaxed text-mid">{pageContent.metodoCol1}</p>
            <p className="whitespace-pre-line text-lg leading-relaxed text-mid">{pageContent.metodoCol2}</p>
          </div>
          <div className="reveal-scale relative mt-14 aspect-[16/9] overflow-hidden bg-piedra">
            <Image
              src={pageContent.metodoImagen || "/nosotros-metodo.jpg"}
              alt="Equipo de ALKO revisando planos en obra"
              fill
              sizes="(max-width: 1024px) 100vw, 75vw"
              className="object-cover"
            />
          </div>
        </EditorialSection>

        {/* Las fases del proceso: las mismas cinco etapas de la portada, con sus imágenes y textos. */}
        <Process fases={PROCESO_FASES} id="fases" />
      </div>

      {/* 05 · Valores */}
      <EditorialSection
        number="05"
        label={pageContent.valoresTag || "Valores"}
        title={pageContent.valoresTitulo}
        intro={pageContent.valoresDescripcion}
      >
        <ol className="border-t border-ink/15">
          {(pageContent.valores || []).map((valor, i) => (
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
      {fabricantes.length > 0 && <Materials fabricantes={fabricantes} />}

      {/* 06 · Equipo y empleo */}
      <EditorialSection number="06" label="Más sobre ALKO" tone="white">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {enlaces.map((enlace, i) => (
            <Link key={enlace.href} href={enlace.href} className="reveal-item group block" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="relative aspect-[16/10] overflow-hidden bg-piedra">
                <Image
                  src={enlace.imagen}
                  alt=""
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

      <FinalContact settings={settings} id="contacto" source="Formulario nosotros · /nosotros" />
    </main>
  );
}
