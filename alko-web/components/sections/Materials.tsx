import ManufacturerLogo from "@/components/home/ManufacturerLogo";
import type { Fabricante, HomeContent } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { HOME_COPY } from "@/lib/i18n/home";

/** Fabricantes en losetas blancas · Propuesta 6 (V5). Textos editables desde el panel. */
export default function Materials({
  fabricantes,
  content,
  locale = "es",
}: {
  fabricantes: Fabricante[];
  content?: HomeContent;
  locale?: Locale;
}) {
  if (fabricantes.length === 0) return null;
  // En castellano mandan los textos del panel; en inglés, los del diccionario.
  const d = HOME_COPY[locale].materials;
  const tag = locale === "es" ? content?.materialesTag || d.tag : d.tag;
  const title = locale === "es" ? content?.materialesTitulo || d.title : d.title;
  const text = locale === "es" ? content?.materialesDescripcion : d.text;
  // Cuatro columnas solo si llenan filas completas; si no, tres.
  const cols = fabricantes.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  const tile = "group grid aspect-[16/7] place-items-center";

  return (
    <section id="materiales" aria-labelledby="materiales-titulo" className="bg-paper py-24 text-ink md:py-28">
      <div className="site-wrap text-center">
        <p className="eyebrow reveal-item">{tag}</p>
        <h2 id="materiales-titulo" className="reveal-item display-title mt-5 text-[40px] md:text-[56px]">
          {title}
        </h2>
        {text && <p className="reveal-item mx-auto mt-6 max-w-xl leading-relaxed text-mid">{text}</p>}
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
