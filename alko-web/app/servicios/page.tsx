import Image from "@/components/ui/Image";
import Link from "next/link";
import ContactCta from "@/components/sections/ContactCta";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import EditorialSection from "@/components/editorial/EditorialSection";
import { ROUTES } from "@/lib/site";
import { getSectors, getSettings } from "@/lib/wordpress";
import { getDbServiciosPageContent } from "@/lib/db/mysql";

export const revalidate = 60;

export const metadata = {
  title: "Servicios — ALKO",
  description:
    "Especialidades: rehabilitación, reforma integral, obra nueva y gestión de instalaciones técnicas con un único responsable.",
};

const pad = (n: number) => String(n).padStart(2, "0");

export default async function ServiciosPage() {
  const [sectors, pageContent, settings] = await Promise.all([
    getSectors(),
    getDbServiciosPageContent(),
    getSettings(),
  ]);

  return (
    <main className="bg-paper text-ink">
      <EditorialHeader
        breadcrumbs={[{ label: "Servicios" }]}
        eyebrow={pageContent.headerBadge || "Servicios"}
        title={pageContent.headerTitulo || "Especialidades"}
        description={
          pageContent.headerDescripcion ||
          "Actuamos de forma transversal para reducir interfaces y garantizar la coherencia entre proyecto y obra."
        }
        image={pageContent.headerBgImage || sectors[0]?.imagen || "/sector-oficinas.jpg"}
        caption="Divisiones ALKO"
        aside={
          <div>
            <div className="flex items-baseline justify-between gap-6 border-t border-ink/15 py-4">
              <span className="text-[11px] uppercase tracking-[0.22em]">Divisiones</span>
              <span className="display-title text-4xl">{pad(sectors.length)}</span>
            </div>
            <div className="flex items-baseline justify-between gap-6 border-t border-ink/15 py-4">
              <span className="text-[11px] uppercase tracking-[0.22em]">Interlocutor por obra</span>
              <span className="display-title text-4xl">01</span>
            </div>
            <a
              href="#divisiones"
              className="group flex items-baseline justify-between gap-6 border-y border-ink/15 py-4 transition-colors hover:text-bronze"
            >
              <span className="text-[11px] uppercase tracking-[0.22em]">Ver todas las divisiones</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">↓</span>
            </a>
          </div>
        }
      />

      {/* Índice rápido: todas las divisiones en filas. */}
      <EditorialSection
        id="divisiones"
        number="01"
        label="Índice"
        title={"Pensado con propósito,\nconstruido para durar"}
        intro="Cada especialidad tiene su propio equipo técnico, con un mismo método de trabajo y un único interlocutor de principio a fin."
      >
        <ul className="border-t border-ink/15">
          {sectors.map((sector, i) => (
            <li key={sector.id}>
              <Link
                href={`${ROUTES.sectors}/${sector.slug}`}
                className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-4 border-b border-ink/15 py-5 sm:grid-cols-[3rem_minmax(0,2fr)_minmax(0,3fr)_auto] sm:gap-6"
              >
                <span className="text-[10px] tracking-[0.18em] text-bronze">{sector.numero || pad(i + 1)}</span>
                <span className="display-title text-xl leading-tight transition-colors group-hover:text-bronze sm:text-2xl">
                  {sector.title}
                </span>
                <span className="hidden truncate text-sm text-mid sm:block">{sector.descripcion}</span>
                <span aria-hidden="true" className="text-mid transition-transform group-hover:translate-x-1 group-hover:text-ink">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </EditorialSection>

      {/* Fichas de cada división con foto. */}
      <EditorialSection number="02" label="Divisiones" title="Elige tu división" tone="white" wide>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector, i) => (
            <li key={sector.id} className="reveal-item">
              <Link href={`${ROUTES.sectors}/${sector.slug}`} className="group flex h-full flex-col">
                <span className="relative block aspect-[4/3] overflow-hidden bg-piedra">
                  {sector.imagen && (
                    <Image
                      src={sector.imagen}
                      alt={`${sector.title} en Madrid`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1.6s] ease-alko group-hover:scale-[1.04]"
                    />
                  )}
                  <span className="absolute left-4 top-4 bg-paper px-2 py-1 text-[10px] tracking-[0.18em] text-ink">
                    {sector.numero || pad(i + 1)}
                  </span>
                </span>
                <span className="display-title mt-5 block text-2xl leading-tight transition-colors group-hover:text-bronze sm:text-[1.7rem]">
                  {sector.title}
                </span>
                {sector.descripcion && (
                  <span className="mt-3 line-clamp-3 block leading-relaxed text-mid">{sector.descripcion}</span>
                )}
                <span className="mt-auto block pt-6">
                  <span className="arrow-link">
                    Ver servicio <span aria-hidden="true">↗</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </EditorialSection>

      <ContactCta settings={settings} source="Servicios" />
    </main>
  );
}
