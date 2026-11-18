import ManufacturerLogo from "@/components/home/ManufacturerLogo";
import type { Fabricante, HomeContent } from "@/lib/types";

/** Fabricantes en losetas blancas · Propuesta 6 (V5). Textos editables desde el panel. */
export default function Materials({ fabricantes, content }: { fabricantes: Fabricante[]; content?: HomeContent }) {
  if (fabricantes.length === 0) return null;
  // Cuatro columnas solo si llenan filas completas; si no, tres.
  const cols = fabricantes.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  const tile = "group grid aspect-[16/7] place-items-center";

  return (
    <section id="materiales" aria-labelledby="materiales-titulo" className="bg-paper py-24 text-ink md:py-28">
      <div className="site-wrap text-center">
        <p className="eyebrow reveal-item">{content?.materialesTag || "Materiales de confianza"}</p>
        <h2 id="materiales-titulo" className="reveal-item display-title mt-5 text-[40px] md:text-[56px]">
          {content?.materialesTitulo || "Trabajamos con fabricantes de referencia"}
        </h2>
        {content?.materialesDescripcion && (
          <p className="reveal-item mx-auto mt-6 max-w-xl leading-relaxed text-mid">{content.materialesDescripcion}</p>
        )}
      </div>
      <ul className={`site-wrap mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3 ${cols}`}>
        {fabricantes.map((fab) => (
          <li key={fab.id} className="reveal-item">
            {fab.url ? (
              <a href={fab.url} target="_blank" rel="noopener noreferrer" className={tile}>
                <ManufacturerLogo src={fab.logo} name={fab.name} />
              </a>
            ) : (
              <div className={tile}>
                <ManufacturerLogo src={fab.logo} name={fab.name} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
