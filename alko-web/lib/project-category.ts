/**
 * Las tipologías se escriben a mano en el panel y hay variantes casi iguales («baño», «baños»,
 * con o sin punto final). Para el filtro se agrupan en unas pocas categorías claras.
 */
export const CATEGORY_ORDER = ["Reformas integrales", "Vivienda unifamiliar", "Cocinas", "Baños"];
export function projectCategory(tipologia: string): string {
  const t = tipologia.toLowerCase();
  if (t.includes("unifamiliar")) return "Vivienda unifamiliar";
  if (t.includes("cocina")) return "Cocinas";
  if (t.includes("bano") || t.includes("baño")) return "Baños";
  return "Reformas integrales";
}
