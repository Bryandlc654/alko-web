import type { Project } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { PROJECT_PAGE_COPY } from "@/lib/i18n/project-page";

/** Textos de la llamada a la acción final de un proyecto: los del panel o, si están vacíos, estos. */
export function projectCta(
  project: Pick<Project, "title" | "exclusivo" | "ctaTitulo" | "ctaTexto" | "ctaBoton">,
  locale: Locale = "es",
) {
  const t = PROJECT_PAGE_COPY[locale];
  const defaults = project.exclusivo
    ? // En la plantilla exclusiva, `boton` es el título del formulario.
      t.exclusive.cta
    : { titulo: t.cta.titulo, texto: t.cta.texto(project.title), boton: t.cta.boton };
  return {
    titulo: project.ctaTitulo?.trim() || defaults.titulo,
    texto: project.ctaTexto?.trim() || defaults.texto,
    boton: project.ctaBoton?.trim() || defaults.boton,
  };
}
