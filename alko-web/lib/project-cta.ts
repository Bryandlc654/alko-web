import type { Project } from "@/lib/types";

/** Textos de la llamada a la acción final de un proyecto: los del panel o, si están vacíos, estos. */
export function projectCta(project: Pick<Project, "title" | "exclusivo" | "ctaTitulo" | "ctaTexto" | "ctaBoton">) {
  const defaults = project.exclusivo
    ? {
        titulo: "Un proyecto a la medida de tu espacio",
        texto: "Cuéntanos qué tienes en mente. El equipo de ALKO Exclusiva te atenderá de forma personal y reservada.",
        boton: "Solicitar una conversación",
      }
    : {
        titulo: "¿Quieres un proyecto\ncomo este?",
        texto: `Cuéntanos qué necesitas. Te preparamos una valoración de alcance, plazo y presupuesto con el mismo equipo que hizo ${project.title}.`,
        boton: "Solicitar valoración",
      };
  return {
    titulo: project.ctaTitulo?.trim() || defaults.titulo,
    texto: project.ctaTexto?.trim() || defaults.texto,
    boton: project.ctaBoton?.trim() || defaults.boton,
  };
}
